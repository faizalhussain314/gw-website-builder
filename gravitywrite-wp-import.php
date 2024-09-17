<?php
/**
 * GravityWrite Importer class for managing the import process of a WXR-like file
 *
 * @package GravityWrite
 * @subpackage Importer
 */

/**
 * GravityWrite importer class.
 */
 
require_once ABSPATH . 'wp-admin/includes/class-wp-importer.php';
require_once plugin_dir_path( __FILE__ ) . 'parsers.php';

class GW_Import extends WP_Importer {
    var $max_wxr_version = 1.0; // max. supported WXR version

    var $id; // Import attachment ID

    // information to import from WXR-like file
    var $version;
    var $authors = array();
    var $posts = array();
    var $terms = array();
    var $categories = array();
    var $tags = array();
    var $base_url = '';

    // mappings from old information to new
    var $processed_authors = array();
    var $author_mapping = array();
    var $processed_terms = array();
    var $processed_posts = array();
    var $post_orphans = array();
    var $processed_menu_items = array();
    var $menu_item_orphans = array();
    var $missing_menu_items = array();

    var $fetch_attachments = false;
    var $url_remap = array();
    var $featured_images = array();

    function dispatch() {
		$this->header();
        $file = 'path_to_your_wxr_file.xml'; // Define the path to your WXR file here
        $this->import($file);
        $this->footer();
    }

    function import($file) {
        add_filter('import_post_meta_key', array($this, 'is_valid_meta_key'));
        add_filter('http_request_timeout', array(&$this, 'bump_request_timeout'));

        $this->import_start($file);
        $this->get_author_mapping();

        $this->process_categories();
        $this->process_tags();
        $this->process_terms();
        $this->process_posts();

        $this->backfill_parents();
        $this->backfill_attachment_urls();
        $this->remap_featured_images();

        $this->import_end();
    }
	
    function import_start($file) {
        if (!file_exists($file)) {
            echo '<p><strong>' . __('Error: The file does not exist, please try again.', 'gravitywrite-importer') . '</strong></p>';
            $this->footer();
            die();
        }
    
        $parser = new GW_Parser(); // Ensure you have this class defined or included before using it
        $import_data = $parser->parse($file);
    
        if (is_wp_error($import_data)) {
            echo '<p><strong>' . __('Error: Failed to parse WXR file.', 'gravitywrite-importer') . '</strong><br />';
            echo esc_html($import_data->get_error_message()) . '</p>';
            $this->footer();
            die();
        }
    
        // Set up the basic import data from parsed XML
        $this->version = $import_data['version'];
        $this->authors = $import_data['authors'];
        $this->posts = $import_data['posts'];
        $this->categories = $import_data['categories'];
        $this->tags = $import_data['tags'];
        $this->terms = $import_data['terms'];
        $this->base_url = $import_data['base_url'];
    
        echo '<p>' . __('Initialization complete. Starting import...', 'gravitywrite-importer') . '</p>';
    
        do_action('gw_import_start');
    }

	function gw_suspend_cache_invalidation($suspend = true) {
		global $wpdb;
		$wpdb->suppress_errors($suspend);
		if ($suspend) {
			wp_suspend_cache_invalidation(true);
		} else {
			wp_suspend_cache_invalidation(false);
		}
	}

	function get_author_mapping() {
		foreach ($this->authors as $author) {
			$user = $this->find_or_create_user($author);  // This method needs to handle user lookup and creation.
			$this->author_mapping[$author['id']] = $user['id'];
		}
		echo '<p>' . __('Author mapping complete.', 'gravitywrite-importer') . '</p>';
	}

	function process_categories() {
		foreach ($this->categories as $category) {
			if (!$this->category_exists($category['name'])) {
				$this->create_category($category);
			}
		}
		echo '<p>' . __('Category processing complete.', 'gravitywrite-importer') . '</p>';
	}

	function process_tags() {
		foreach ($this->tags as $tag) {
			if (!$this->tag_exists($tag['name'])) {
				$this->create_tag($tag);
			}
		}
		echo '<p>' . __('Tag processing complete.', 'gravitywrite-importer') . '</p>';
	}

	function process_terms() {
		foreach ($this->terms as $term) {
			if (!$this->term_exists($term['name'], $term['taxonomy'])) {
				$this->create_term($term, $term['taxonomy']);
			}
		}
		echo '<p>' . __('Term processing complete.', 'gravitywrite-importer') . '</p>';
	}

	function process_posts() {
		$this->posts = apply_filters('wp_import_posts', $this->posts);
	
		foreach ($this->posts as $post) {
			$post = apply_filters('wp_import_post_data_raw', $post);
	
			if (!post_type_exists($post['post_type'])) {
				printf(
					__('Failed to import “%1$s”: Invalid post type %2$s', 'wordpress-importer'),
					esc_html($post['post_title']),
					esc_html($post['post_type'])
				);
				echo '<br />';
				do_action('wp_import_post_exists', $post);
				continue;
			}
	
			if (isset($this->processed_posts[$post['post_id']]) && !empty($post['post_id'])) {
				continue;
			}
	
			if ('auto-draft' == $post['status']) {
				continue;
			}
	
			if ('nav_menu_item' == $post['post_type']) {
				$this->process_menu_item($post);
				continue;
			}
	
			$post_exists = post_exists($post['post_title'], '', $post['post_date']);
			$post_exists = apply_filters('wp_import_existing_post', $post_exists, $post);
	
			if ($post_exists && get_post_type($post_exists) == $post['post_type']) {
				$post_id = $post_exists;
				$this->processed_posts[intval($post['post_id'])] = intval($post_exists);
			} else {
				$post_parent = (int) $post['post_parent'];
				if ($post_parent) {
					if (isset($this->processed_posts[$post_parent])) {
						$post_parent = $this->processed_posts[$post_parent];
					} else {
						$this->post_orphans[intval($post['post_id'])] = $post_parent;
						$post_parent = 0;
					}
				}
	
				$author = sanitize_user($post['post_author'], true);
				if (isset($this->author_mapping[$author])) {
					$author = $this->author_mapping[$author];
				} else {
					$author = (int) get_current_user_id();
				}
	
				$postdata = array(
					'import_id'      => $post['post_id'],
					'post_author'    => $author,
					'post_date'      => $post['post_date'],
					'post_date_gmt'  => $post['post_date_gmt'],
					'post_content'   => $post['post_content'],
					'post_excerpt'   => $post['post_excerpt'],
					'post_title'     => $post['post_title'],
					'post_status'    => $post['status'],
					'post_name'      => $post['post_name'],
					'comment_status' => $post['comment_status'],
					'ping_status'    => $post['ping_status'],
					'guid'           => $post['guid'],
					'post_parent'    => $post_parent,
					'menu_order'     => $post['menu_order'],
					'post_type'      => $post['post_type'],
					'post_password'  => $post['post_password'],
				);
	
				$original_post_id = $post['post_id'];
				$postdata = apply_filters('wp_import_post_data_processed', $postdata, $post);
				$postdata = wp_slash($postdata);
	
				if ('attachment' == $postdata['post_type']) {
					$remote_url = !empty($post['attachment_url']) ? $post['attachment_url'] : $post['guid'];
					$postdata['upload_date'] = $post['post_date'];
					if (isset($post['postmeta'])) {
						foreach ($post['postmeta'] as $meta) {
							if ('_wp_attached_file' == $meta['key']) {
								if (preg_match('%^[0-9]{4}/[0-9]{2}%', $meta['value'], $matches)) {
									$postdata['upload_date'] = $matches[0];
								}
								break;
							}
						}
					}
					$post_id = $this->process_attachment($postdata, $remote_url);
				} else {
					$post_id = wp_insert_post($postdata, true);
					do_action('wp_import_insert_post', $post_id, $original_post_id, $postdata, $post);
				}
				
				if (is_wp_error($post_id)) {
					printf(
						__('Failed to import %1$s “%2$s”', 'wordpress-importer'),
						get_post_type_object($post['post_type'])->labels->singular_name,
						esc_html($post['post_title'])
					);
					if (defined('IMPORT_DEBUG') && IMPORT_DEBUG) {
						echo ': ' . $post_id->get_error_message();
					}
					echo '<br />';
					continue;
				}
	
				if (1 == $post['is_sticky']) {
					stick_post($post_id);
				}
			}
	
			$this->processed_posts[intval($post['post_id'])] = (int) $post_id;
	
			if (!isset($post['postmeta'])) {
				$post['postmeta'] = array();
			}
	
			$post['postmeta'] = apply_filters('wp_import_post_meta', $post['postmeta'], $post_id, $post);
	
			if (!empty($post['postmeta'])) {
				foreach ($post['postmeta'] as $meta) {
					$key = $meta['key'];
					$value = false;
	
					if ('_edit_last' == $key) {
						if (isset($this->processed_authors[intval($meta['value'])])) {
							$value = $this->processed_authors[intval($meta['value'])];
						} else {
							$key = false;
						}
					}
	
					if ($key) {
						if (!$value) {
							$value = maybe_unserialize($meta['value']);
						}
	
						add_post_meta($post_id, wp_slash($key), wp_slash_strings_only($value));
	
						do_action('import_post_meta', $post_id, $key, $value);
	
						if ('_thumbnail_id' == $key) {
							$this->featured_images[$post_id] = (int) $value;
						}
					}
				}
			}
	
			// Import Elementor data if available
			$this->import_elementor_data($post_id, $post);
			$imported_post_data = [
				'post_id'       => $post_id,
				'post_type' =>$post['post_type'],
				'template_name' => "our_template",
				'page_name'=>$post['post_title'] // Assuming template_name is part of your data structure
			];
	        global $wpdb;
			// Insert data into imported_posts
			$wpdb->insert($wpdb->prefix . 'imported_posts', $imported_post_data);
			update_post_meta($post_id,'_wp_page_template' , 'elementor_header_footer');
		}
	
		unset($this->posts);
	}
	
	function process_attachment($postdata, $remote_url) {
		if (!$this->fetch_attachments) {
			return new WP_Error('attachment_processing_error', __('Fetching attachments is not enabled.', 'gravitywrite-importer'));
		}
	
		$upload = $this->fetch_remote_file($remote_url, $postdata);
		if (is_wp_error($upload)) {
			return $upload;
		}
	
		$info = wp_check_filetype($upload['file']);
		if (!$info) {
			return new WP_Error('attachment_processing_error', __('Invalid file type.', 'gravitywrite-importer'));
		}
	
		$postdata = array_merge($postdata, array(
			'post_mime_type' => $info['type'],
			'guid'           => $upload['url']
		));
	
		$post_id = wp_insert_attachment($postdata, $upload['file']);
		if (!is_wp_error($post_id)) {
			wp_update_attachment_metadata($post_id, wp_generate_attachment_metadata($post_id, $upload['file']));
		}
	
		return $post_id;
	}
	
	function fetch_remote_file($url, $post) {
		// If a URL remap is set, map the URL.
		$url = str_replace(array_keys($this->url_remap), array_values($this->url_remap), $url);
	
		// Download file to temporary location.
		$tmp_file = download_url($url);
	
		// If error downloading file, return error.
		if (is_wp_error($tmp_file)) {
			return $tmp_file;
		}
	
		// Construct the upload array.
		$file_array = array(
			'name'     => basename($url),
			'tmp_name' => $tmp_file
		);
	
		// Check for upload errors.
		$upload_id = media_handle_sideload($file_array, $post['ID']);
	
		// If error uploading file, unlink the temporary file and return error.
		if (is_wp_error($upload_id)) {
			@unlink($file_array['tmp_name']);
			return $upload_id;
		}
	
		// Return the upload data.
		return array(
			'file' => get_attached_file($upload_id),
			'url'  => wp_get_attachment_url($upload_id),
		);
	}
	
	

	private function import_elementor_data($post_id, $post) {
		// Elementor meta keys that need to be imported
		$elementor_meta_keys = array(
			'_elementor_data',
			'_wp_page_template',
			'_elementor_edit_mode',
			'_elementor_template_type',
			'_elementor_version',
			'_elementor_page_settings'
		);
	
		// Import Elementor meta data
		foreach ($elementor_meta_keys as $meta_key) {
			if (isset($post['postmeta'][$meta_key])) {
				$meta_value = maybe_unserialize($post['postmeta'][$meta_key]);
				// Print each value of the meta key before updating
				echo '<p>Updating post meta: ' . esc_html($meta_key) . ' with value: ' . esc_html(print_r($meta_value, true)) . '</p>';
				update_post_meta($post_id, $meta_key, $meta_value);
			}
		}
	
		// Ensure the post status is set to publish
		if ($post['status'] == 'publish') {
			wp_update_post(array(
				'ID' => $post_id,
				'post_status' => 'publish'
			));
		}
	}
	

	function backfill_parents() {
		foreach ($this->post_orphans as $orphan_id => $parent_id) {
			$this->assign_post_parent($orphan_id, $parent_id);
		}
		echo '<p>' . __('Parent backfilling complete.', 'gravitywrite-importer') . '</p>';
	}

	function backfill_attachment_urls() {
		foreach ($this->url_remap as $old_url => $new_url) {
			$this->update_attachment_url($old_url, $new_url);
		}
		echo '<p>' . __('Attachment URL backfilling complete.', 'gravitywrite-importer') . '</p>';
	}

	function remap_featured_images() {
		foreach ($this->featured_images as $post_id => $old_image_id) {
			$this->update_featured_image($post_id, $old_image_id);
		}
		echo '<p>' . __('Featured images remapping complete.', 'gravitywrite-importer') . '</p>';
	}

	function import_end() {
		echo '<p>' . __('Import complete! Check your imported content.', 'gravitywrite-importer') . '</p>';
		do_action('gw_import_end');  // Trigger any actions that need to run after the import.
	}

	private function find_or_create_user($author) {
		$user = get_user_by('login', $author['login']);
		if (!$user) {
			$userdata = array(
				'user_login' => $author['login'],
				'user_pass'  => wp_generate_password(),
				'user_email' => $author['email'],
				'first_name' => $author['first_name'],
				'last_name'  => $author['last_name'],
				'role'       => 'subscriber'
			);
			$user_id = wp_insert_user($userdata);
			if (is_wp_error($user_id)) {
				echo 'Error creating user: ' . $user_id->get_error_message();
				return false;
			}
			return get_user_by('id', $user_id);
		}
		return $user;
	}

	private function category_exists($category_name) {
		return term_exists($category_name, 'category');
	}

	private function create_category($category) {
		$term = wp_insert_term(
			$category['name'], // the term 
			'category', // the taxonomy
			array(
				'description'=> $category['description'],
				'slug' => $category['slug']
			)
		);
		if (is_wp_error($term)) {
			echo 'Error creating category: ' . $term->get_error_message();
			return false;
		}
		return $term;
	}


		private function tag_exists($tag_name) {
			return term_exists($tag_name, 'post_tag');
		}
		
		private function create_tag($tag) {
			$term = wp_insert_term(
				$tag['name'], // the term 
				'post_tag', // the taxonomy
				array(
					'description'=> $tag['description'],
					'slug' => $tag['slug']
				)
			);
			if (is_wp_error($term)) {
				echo 'Error creating tag: ' . $term->get_error_message();
				return false;
			}
			return $term;
		}
		
		private function term_exists($term_name, $taxonomy) {
			return term_exists($term_name, $taxonomy);
		}
		
		private function create_term($term, $taxonomy) {
			$term_args = array(
				'description' => $term['description'],
				'slug'        => $term['slug'],
				'parent'      => (empty($term['parent']) ? 0 : term_exists($term['parent'], $taxonomy))
			);
			$new_term = wp_insert_term($term['name'], $taxonomy, $term_args);
			if (is_wp_error($new_term)) {
				echo 'Error creating term: ' . $new_term->get_error_message();
				return false;
			}
			return $new_term;
		}
		
		private function insert_post($post) {
			// Set the correct post type for Elementor pages
			if (isset($post['post_type']) && $post['post_type'] == 'elementor_library') {
				$post['post_type'] = 'elementor_library';
			}
		
			// Insert the post and capture the new post ID
			$post_id = wp_insert_post($post, true);
			if (is_wp_error($post_id)) {
				echo 'Error inserting post: ' . $post_id->get_error_message();
				return false;
			}
		
			// Process post meta data
			if (!empty($post['postmeta'])) {
				foreach ($post['postmeta'] as $meta_key => $meta_value) {
					update_post_meta($post_id, $meta_key, $meta_value);
				}
			}
		
			// Process taxonomies
			if (!empty($post['terms'])) {
				foreach ($post['terms'] as $term) {
					wp_set_object_terms($post_id, $term['slug'], $term['taxonomy'], true);
				}
			}
		
			return $post_id;
		}
		private function assign_post_parent($post_id, $parent_id) {
			wp_update_post(array(
				'ID'          => $post_id,
				'post_parent' => $parent_id
			));
		}
		
		private function update_attachment_url($old_url, $new_url) {
			global $wpdb;
			$wpdb->query($wpdb->prepare("UPDATE {$wpdb->postmeta} SET meta_value = REPLACE(meta_value, %s, %s) WHERE meta_key = '_wp_attached_file' OR meta_key = '_wp_attachment_metadata'", $old_url, $new_url));
		}
		
		private function update_featured_image($post_id, $image_id) {
			update_post_meta($post_id, '_thumbnail_id', $image_id);
		}
		
	
}
