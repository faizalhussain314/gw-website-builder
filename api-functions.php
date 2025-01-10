<?php


// Register REST API routes
add_action('rest_api_init', function () {
    
    register_rest_route('custom/v1', '/get-userdata', [
        'methods'  => 'GET',
        'callback' => 'custom_get_userdata',
        'permission_callback' => '__return_true', // Allow public access; modify as needed for security
    ]);

    register_rest_route('custom/v1', '/set-logo-width', array(
        'methods'  => 'POST',
        'callback' => 'update_logo_width',
        'permission_callback' => '__return_true',
    ));
    
    register_rest_route('custom/v1', '/check-previous-import', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'check_previous_import',
        'permission_callback' => '__return_true'
    ));
    
    register_rest_route('custom/v1', '/get-user-token', [
        'methods' => 'GET',
        'callback' => 'get_logged_user_token',
        'permission_callback' => '__return_true',
    ]);
    
    register_rest_route('custom/v1', '/user-details-react', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'api_fetch_user_details',
        'permission_callback' => '__return_true',
    ));

    register_rest_route('custom/v1', '/disconnect', [
        'methods'  => 'GET',
        'callback' => 'Api_disconnect_handler',
        'permission_callback' => '__return_true', 
    ]);
    
    register_rest_route('custom/v1', '/save_user_plan_details', array(
        'methods' => 'GET',
        'callback' => 'handle_save_user_plan_details',
        'permission_callback' => '__return_true', 
    ));

    register_rest_route('custom/v1', '/update-count', [
        'methods' => 'POST',
        'callback' => 'handle_update_count',
        'permission_callback' => '__return_true',
    ]);
    
    register_rest_route('custom/v1', '/check-word-count', [
        'methods'             => 'GET',
        'callback'            => 'check_word_count',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('custom/v1', '/check-site-count', [
        'methods'             => 'GET',
        'callback'            => 'check_site_count',
        'permission_callback' => '__return_true',
    ]);
    
    register_rest_route('custom/v1', '/delete-uploads', array(
        'methods' => 'DELETE',
        'callback' => 'delete_uploads_folder',
        'permission_callback' => '__return_true'
    ));
    register_rest_route('custom/v1', '/create-uploads', array(
        'methods' => 'POST',
        'callback' => 'create_uploads_folder',
        'permission_callback' => '__return_true'
    ));
    register_rest_route('custom/v1', '/delete-all-styles', array(
        'methods' => WP_REST_Server::DELETABLE,
        'callback' => 'delete_all_styles',
        'permission_callback' => '__return_true'
    ));
    register_rest_route('custom/v1', '/remove-all-generated-data', array(
        'methods' => WP_REST_Server::DELETABLE,
        'callback' => 'remove_all_generated_data',
        'permission_callback' => '__return_true'
    ));
	register_rest_route('custom/v1', '/install-plugin', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'custom_xml_importer_install_and_activate_plugins',
        'permission_callback' => '__return_true'
    ));
    register_rest_route('custom/v1', '/install-theme', array(
        'methods' => WP_REST_Server::CREATABLE, 
        'callback' => 'custom_xml_importer_install_and_activate_theme',
        'permission_callback' => '__return_true' 
    ));
    register_rest_route('custom/v1', '/install-posts', array(
        'methods' => WP_REST_Server::CREATABLE, 
        'callback' => 'import_posts_from_url',
        'permission_callback' => '__return_true' 
    ));
    register_rest_route('custom/v1', '/install-pages', array(
        'methods' => WP_REST_Server::CREATABLE, 
        'callback' => 'import_posts_from_url',
        'permission_callback' => '__return_true'
    ));
    register_rest_route('custom/v1', '/install-forms', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'import_posts_from_url',
        'permission_callback' => '__return_true' 
    ));
    register_rest_route('custom/v1', '/install-elementor-kit', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'import_elementor_kit',
        'permission_callback' => '__return_true' 
    ));

    register_rest_route('custom/v1', '/install-elementor-settings', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'import_elementor_settings',
        'permission_callback' => '__return_true' 
    ));
    register_rest_route('custom/v1', '/install-header-footer', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'import_header_footer_data',
        'permission_callback' => '__return_true' 
    ));
    register_rest_route('custom/v1', '/update-form-details', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'update_form_details',
        'permission_callback' => '__return_true'
    ));
    register_rest_route('custom/v1', '/get-form-details', array(
        'methods' => WP_REST_Server::CREATABLE, 
        'callback' => 'fetch_form_details',
        'permission_callback' =>'__return_true'
    ));
    register_rest_route('custom/v1', '/import-menus-css', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'wpse_import_menus_css',
        'permission_callback' => '__return_true'
    ));
    register_rest_route('custom/v1', '/import-sitelogo', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'import_site_logo',
        'permission_callback' => '__return_true'
    ));
    register_rest_route('custom/v1', '/replace-user-content', array(
    'methods' => WP_REST_Server::CREATABLE,
    'callback' => 'update_user_details_data',
    'permission_callback' => '__return_true'
    ));
    register_rest_route('custom/v1', '/regenerate-global-css', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'regenerate_global_elementor_css',
        'permission_callback' => '__return_true'
    ));
    register_rest_route('custom/v1', '/save-generated-data', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'save_generated_data',
        'permission_callback' => '__return_true',
    ));
    register_rest_route('custom/v1', '/save-generated-html-data', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'save_generated_html_data',
        'permission_callback' => '__return_true'
    ));
    register_rest_route('custom/v1', '/get-saved-html-data', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'fetch_html_data',
        'permission_callback' => '__return_true'
    ));
    register_rest_route('custom/v1', '/get-html-data-details', array(
        'methods' => WP_REST_Server::CREATABLE,  // Using READABLE as this is a GET operation
        'callback' => 'fetch_html_data_details',
        'permission_callback' => '__return_true'
    ));
	register_rest_route('custom/v1', '/save-generated-page-status', array(
		'methods'  => WP_REST_Server::CREATABLE,
		'callback' => 'save_generated_page_status',
		'permission_callback' => '__return_true'
	) );

	register_rest_route( 'custom/v1', '/get-generated-page-status', array(
		'methods'  => WP_REST_Server::CREATABLE,
		'callback' => 'get_generated_page_status',
		'permission_callback' => '__return_true'
	) );
	register_rest_route( 'custom/v1', '/save-selected-template', array(
		'methods'  => WP_REST_Server::CREATABLE,
		'callback' => 'save_selected_template_data',
		'permission_callback' => '__return_true'
	) );
	register_rest_route( 'custom/v1', '/get-selected-template', array(
		'methods'  => WP_REST_Server::CREATABLE,
		'callback' => 'get_selected_template_data',
		'permission_callback' => '__return_true'
	) );
	register_rest_route( 'custom/v1', '/update-style-changes', array(
		'methods'  => WP_REST_Server::CREATABLE,
		'callback' => 'update_elementor_global_settings',
		'permission_callback' => '__return_true'
	) );
	register_rest_route( 'custom/v1', '/empty-tables', array(
		'methods'  => WP_REST_Server::DELETABLE,
		'callback' => 'myplugin_empty_tables',
		'permission_callback' => '__return_true'
	) );
    register_rest_route('custom/v1', '/delete-theme-and-plugins', [
        'methods' => 'DELETE',
        'callback' => 'delete_theme_and_plugins',
        'permission_callback' => '__return_true'
    ]);
    register_rest_route('custom/v1', '/update-content', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'update_elementor_page_content_directly',
        'permission_callback' => '__return_true'
    ));
    register_rest_route('custom/v1', '/delete-all-posts', array(
        'methods' => WP_REST_Server::DELETABLE,
        'callback' => 'delete_all_custom_posts',
        'permission_callback' => '__return_true'
    ));
    register_rest_route('custom/v1', '/get-gwuser-details', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'get_gwuser_details',
        'permission_callback' => '__return_true'
    ));
});


// Custom skin to suppress output during theme installation
class Silent_Upgrader_Skin extends WP_Upgrader_Skin {
    public function feedback($string, ...$args) {
        // Suppress feedback
    }
}

function get_gwuser_details(WP_REST_Request $request) {
    global $wpdb;
    $connect_status=get_option('gravitywrite_account_key',true);
    if($connect_status == "disconnected"||$connect_status == ""){
        return new WP_Error('User not logged in', 'No details found in the user details table.', array('status' => 404));
    }
    $fields = $request->get_param('fields');
    if (!$fields || !is_array($fields)) {
        $fields = '*';
    } else {
        $fields = array_map(function($field) {
            return esc_sql($field);
        }, $fields);
        $fields = implode(', ', $fields);
    }
    $table_name = $wpdb->prefix . 'gw_user_plan_details';
    $query = "SELECT $fields FROM $table_name"; // No WHERE clause needed

    $details = $wpdb->get_results($query);

    if (empty($details)) {
        return new WP_Error('no_details_found', 'No details found in the user details table.', array('status' => 404));
    }

    return rest_ensure_response($details);
}

function delete_attachments_by_title_or_filename($title, $filename) {
    global $wpdb;

    $query_title = $wpdb->prepare("
        SELECT ID 
        FROM $wpdb->posts 
        WHERE post_type = 'attachment' 
        AND post_title = %s", 
        $title
    );
    $attachment_ids_title = $wpdb->get_col($query_title);

    // Second query to find attachment IDs by filename
    $query_filename = $wpdb->prepare("
        SELECT post_id 
        FROM $wpdb->postmeta 
        WHERE meta_key = '_wp_attached_file' 
        AND meta_value LIKE %s", 
        '%' . $wpdb->esc_like($filename) . '%'
    );
    $attachment_ids_filename = $wpdb->get_col($query_filename);

    // Combine the results of both queries, ensuring no duplicates
    $attachment_ids = array_unique(array_merge($attachment_ids_title, $attachment_ids_filename));

    if (empty($attachment_ids)) {
        return 'No attachments found with title: ' . $title . ' or filename: ' . $filename;
    }

    // Delete all found attachments
    foreach ($attachment_ids as $id) {
        wp_delete_attachment($id, true); // True to ensure the file is also deleted from the server
    }

    return 'Deleted attachments with title: ' . $title . ' and/or filename: ' . $filename;
}

function delete_all_custom_posts(WP_REST_Request $request) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'imported_posts';
    $menu_name="Menu";
    $menu_exists = wp_get_nav_menu_object($menu_name);
    $menu_id = $menu_exists ? $menu_exists->term_id : wp_create_nav_menu($menu_name);
    wp_delete_nav_menu_items($menu_id);
    // Selecting all post IDs, their types, and filenames from your custom table
    $posts = $wpdb->get_results("SELECT post_id, post_type, page_name FROM $table_name");

    if (empty($posts)) {
        return new WP_REST_Response('No posts found to delete.', 200);
    }

    foreach ($posts as $post) {
        if ($post->post_type === 'attachment') {
            // Delete all matching attachments by filename
            delete_attachments_by_title_or_filename($post->page_name, $post->page_name);
        } else {
            wp_delete_post($post->post_id, true); 
        }
    }
    
    $wpdb->query("TRUNCATE TABLE {$table_name}");

    // Return a simple success message
    return new WP_REST_Response('All custom posts deleted successfully.and empty table Imported Posts', 200);
}


// Callback function to delete a theme and plugins
function delete_theme_and_plugins(WP_REST_Request $request) {
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs'; 
    $log_file_path = $log_dir . '/plugin-log.txt';

    $api_url = $request->get_route();

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    //start delete uploads 

    $plugin_dir1 = dirname(plugin_dir_path(__FILE__));
    
    $uploads_dir = $plugin_dir1 . '/uploads';

    if (!file_exists($uploads_dir)) {
    	 log_message('Uploads folder does not exist.', $log_file_path, 'error', $api_url);
        
    }

    $deleted = delete_directory($uploads_dir);

    if ($deleted) {
        log_message('Uploads folder deleted successfully.', $log_file_path, 'success', $api_url);
    } else {
        log_message('Failed to delete uploads folder.', $log_file_path, 'success', $api_url);
    }

    //end delete uploads

    $theme_slug = 'hello-elementor';

    $plugins_json = get_option('custom_plugins_to_delete');
    $plugins = json_decode($plugins_json, true);

    // Delete the plugins
    $deleted_plugins = [];
    if (is_array($plugins)) {
        foreach ($plugins as $slug) {
            if (is_plugin_active($slug . '/' . $slug . '.php')) {
                deactivate_plugins($slug . '/' . $slug . '.php');
            }

            // Delete the plugin
            if (delete_plugins([$slug . '/' . $slug . '.php'])) {
                $deleted_plugins[] = $slug;
            }
        }
    }

    // Check if the theme to be deleted is active
    if (wp_get_theme()->stylesheet === $theme_slug) {
        $default_theme_slug = 'twentytwentyone';
        
        if (!wp_get_theme($default_theme_slug)->exists()) {
            include_once(ABSPATH . 'wp-admin/includes/class-wp-upgrader.php');

            $skin = new Silent_Upgrader_Skin();
            $theme_upgrader = new Theme_Upgrader($skin);

            ob_start();
            $theme_upgrader->install('https://downloads.wordpress.org/theme/twentytwentyone.latest-stable.zip');
            ob_end_clean(); 

            if (!wp_get_theme($default_theme_slug)->exists()) {
                return new WP_REST_Response([
                    'message' => 'Failed to install the default theme. Please try again.'
                ], 500);
            }
        }

        ob_start();
        switch_theme($default_theme_slug);
        ob_end_clean();
    }

    ob_start();
    if (delete_theme($theme_slug)) {
        ob_end_clean();

        $message = [
            'message' => 'Theme and plugins deleted successfully.',
            'deleted_plugins' => $deleted_plugins,
            'deleted_themes' => $theme_slug
        ];
        log_message('Theme and plugins deleted successfully.', $log_file_path, 'success', $api_url);

        return new WP_REST_Response($message, 200);
    } else {
        ob_end_clean();

        log_message('Theme not found or could not be deleted.', $log_file_path, 'error', $api_url);

        return new WP_REST_Response(['message' => 'Theme not found or could not be deleted.'], 404);
    }
}


function update_style_changes(WP_REST_Request $request) {
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs'; 
    $log_file_path = $log_dir . '/plugin-log.txt';

    $api_url = $request->get_route(); 
    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $primary_color = $request->get_param('primary_color');
    $secondary_color = $request->get_param('secondary_color');

    if (empty($primary_color) || empty($secondary_color)) {
        $message = 'Both primary and secondary colors are required.';
        log_message($message, $log_file_path,'error',$api_url);
        return new WP_Error('invalid_data', $message, array('status' => 400));
    }

    if (!did_action('elementor/loaded')) {
        $message = 'Elementor is not loaded.';
        log_message($message, $log_file_path,'error',$api_url);
        return new WP_Error('elementor_not_loaded', $message, array('status' => 500));
    }

    // Get the active kit ID
    $active_kit_id = (int) get_option('elementor_active_kit');

    if ($active_kit_id) {
        $kit_settings = get_post_meta($active_kit_id, '_elementor_page_settings', true);

        if ($kit_settings && isset($kit_settings['system_colors'])) {
            // Update the colors
            foreach ($kit_settings['system_colors'] as &$color) {
                if ($color['_id'] === 'primary') {
                    $color['color'] = sanitize_hex_color($primary_color);
                } elseif ($color['_id'] === 'secondary') {
                    $color['color'] = sanitize_hex_color($secondary_color);
                }
            }

            // Update the kit settings
            update_post_meta($active_kit_id, '_elementor_page_settings', $kit_settings);
            \Elementor\Plugin::$instance->files_manager->clear_cache();

            // Log success message
            $message = "Successfully updated primary color to $primary_color and secondary color to $secondary_color.";
            log_message($message, $log_file_path,'success',$api_url);

            return rest_ensure_response(array(
                'success' => true,
                'primary_color' => $primary_color,
                'secondary_color' => $secondary_color,
            ));
        } else {
            $message = 'Kit settings not found.';
            log_message( $message, $log_file_path,'warning',$api_url);
            return new WP_Error('kit_not_found', $message, array('status' => 404));
        }
    } else {
        $message = 'No active Elementor Kit ID found.';
        log_message($message, $log_file_path, 'warning',$api_url);
        return new WP_Error('no_active_kit', $message, array('status' => 404));
    }
}


function update_elementor_global_settings(WP_REST_Request $request) {
    global $wpdb;

    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs'; 
    $log_file_path = $log_dir . '/plugin-log.txt';

    $api_url = $request->get_route(); 
    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $table_name = $wpdb->prefix . 'gw_user_form_details';
    $user_data = $wpdb->get_row("SELECT color, font FROM $table_name", ARRAY_A);

    if (empty($user_data)) {
        $message = 'No color and font selected in wpje_gw_user_form_details table.';
        log_message($message, $log_file_path, 'Info', $api_url);
        //return new WP_Error('no_data_found', $message, array('status' => 404));
    }

    // Extract the color values and the font from the fetched row
    $colors = json_decode($user_data['color'], true);
    $fonts = json_decode($user_data['font'], true);

    // Ensure the color values and fonts are properly set
    if (empty($colors['primary']) || empty($colors['secondary']) || empty($fonts['primary']) || empty($fonts['secondary'])) {
        $message = 'No Color or font Selected for User.';
        log_message($message, $log_file_path, 'Info', $api_url);
        //return new WP_Error('incomplete_data', $message, array('status' => 400));
    }

    $primary_color = $colors['primary'];
    $secondary_color = $colors['secondary'];
    $primary_font = $fonts['primary'];
    $secondary_font = $fonts['secondary'];

    if (!did_action('elementor/loaded')) {
        $message = 'Elementor is not loaded.';
        log_message($message, $log_file_path, 'error', $api_url);
        return new WP_Error('elementor_not_loaded', $message, array('status' => 500));
    }

    $active_kit_id = (int) get_option('elementor_active_kit');

    if (!$active_kit_id) {
        $message = 'No active Elementor Kit ID found.';
        log_message($message, $log_file_path, 'warning', $api_url);
        return new WP_Error('no_active_kit', $message, array('status' => 404));
    }

    $kit_settings = get_post_meta($active_kit_id, '_elementor_page_settings', true);

    // Check if kit settings exist
    if (!$kit_settings) {
        $message = 'Kit settings not found.';
        log_message($message, $log_file_path, 'warning', $api_url);
        return new WP_Error('kit_not_found', $message, array('status' => 404));
    }

    if (!empty($primary_color) && !empty($secondary_color)) {
        // Update the colors from the database
        if (isset($kit_settings['system_colors'])) {
            foreach ($kit_settings['system_colors'] as &$color) {
                if ($color['_id'] === 'primary') {
                    $color['color'] = sanitize_hex_color($primary_color);
                } elseif ($color['_id'] === 'secondary') {
                    $color['color'] = sanitize_hex_color($secondary_color);
                }
            }
        }
    }

    if (!empty($primary_font) && !empty($secondary_font)) {
        // Update the fonts from the database
        if (isset($kit_settings['system_typography'])) {
            foreach ($kit_settings['system_typography'] as &$font) {
                if ($font['_id'] === 'primary') {
                    $font['typography_font_family'] = sanitize_text_field($primary_font);
                } elseif ($font['_id'] === 'secondary') {
                    $font['typography_font_family'] = sanitize_text_field($secondary_font);
                }
            }
        }
    }

    // Update the kit settings in the database
    update_post_meta($active_kit_id, '_elementor_page_settings', $kit_settings);
    \Elementor\Plugin::$instance->files_manager->clear_cache();

    // Log success message
    $message = "Successfully updated primary color to $primary_color, secondary color to $secondary_color, primary font to $primary_font, and secondary font to $secondary_font.";
    log_message($message, $log_file_path, 'success', $api_url);

    return rest_ensure_response(array(
        'success' => true,
        'primary_color' => $primary_color,
        'secondary_color' => $secondary_color,
        'primary_font' => $primary_font,
        'secondary_font' => $secondary_font,
    ));
}




function save_selected_template_data(WP_REST_Request $request) {
    global $wpdb; 
    $table_name = $wpdb->prefix . 'selected_template_data'; 
    $template_id = $request->get_param('template_id');
    $template_name = $request->get_param('template_name');
    $template_json_data = json_encode($request->get_param('template_json_data'));

    $plugin_dir = plugin_dir_path(__FILE__); 
    $log_dir = $plugin_dir . 'logs'; 
    $log_file_path = $log_dir . '/plugin-log.txt';
     $api_url = $request->get_route(); // Get the API URL

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $count = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");

    if ($count > 0) {
        $result = $wpdb->update(
            $table_name,
            [
                'template_id' => $template_id,
                'template_name' => $template_name,
                'template_json_data' => $template_json_data
            ],
            ['id' => 1]
        );

        if (false === $result) {
            $message = 'Failed to update template data in the database.';
            log_message($message, $log_file_path, 'error',$api_url);
            return new WP_Error('db_error', $message, array('status' => 500));
        } else {
            $message = 'Successfully updated template data for ID 1.';
            log_message($message, $log_file_path, 'success',$api_url);
        }
    } else {
        $result = $wpdb->insert(
            $table_name,
            [
                'id' => 1,
                'template_id' => $template_id,
                'template_name' => $template_name,
                'template_json_data' => $template_json_data
            ]
        );

        if (false === $result) {
            $message = 'Failed to insert new template data into the database.';
            log_message($message, $log_file_path, 'error',$api_url);
            return new WP_Error('db_error', $message, array('status' => 500));
        } else {
            $message = 'Successfully inserted new template data with ID 1.';
            log_message($message, $log_file_path, 'success',$api_url);
        }
    }

    return new WP_REST_Response(['success' => true, 'id' => 1], 200);
}


function get_selected_template_data(WP_REST_Request $request) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'selected_template_data'; 

    $plugin_dir = plugin_dir_path(__FILE__); 
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt';
     $api_url = $request->get_route(); // Get the API URL

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $query = "SELECT * FROM $table_name";
    $results = $wpdb->get_results($query, ARRAY_A);

    if (!empty($results)) {
        $message = 'Successfully retrieved template data.';
        log_message($message, $log_file_path, 'success',$api_url);
        return new WP_REST_Response($results, 200);
    } else {
        $message = 'No data found in selected_template_data table.';
        log_message($message, $log_file_path, 'warning',$api_url);
        return new WP_Error('no_data', 'No HTML metadata found', ['status' => 404]);
    }
}


function save_generated_page_status(WP_REST_Request $request) {
    global $wpdb;
    $plugin_dir = plugin_dir_path(__FILE__); 
    $log_dir = $plugin_dir . 'logs'; 
    $log_file_path = $log_dir . '/plugin-log.txt';
    $api_url = $request->get_route();

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $params = $request->get_json_params();
    $page_name = $request->get_param('page_name');
    $page_slug = $request->get_param('page_slug');
    $table_name = $wpdb->prefix . 'page_generation_status';

    // Ensure all required parameters are present
    if (!$page_name || !$page_slug) {
        $message = 'Missing required parameters: page_name or page_slug.';
        log_message($message, $log_file_path, 'error', $api_url);

        return new WP_REST_Response([
            'status' => 'error',
            'message' => $message,
        ], 200); // Always return status code 200
    }

    // Check if entry exists
    $existing = $wpdb->get_row($wpdb->prepare(
        "SELECT id FROM $table_name WHERE page_name = %s AND page_slug = %s",
        $page_name, $page_slug
    ));

    if ($existing) {
        // Update existing entry
        $success = $wpdb->update($table_name, $params, ['id' => $existing->id]);

        if ($success !== false) {
            $message = "Updated existing entry for page: '$page_name' with slug: '$page_slug'.";
            log_message($message, $log_file_path, 'success', $api_url);

            return new WP_REST_Response([
                'status' => 'success',
                'message' => $message,
            ], 200); // Always return status code 200
        } else {
            $message = "Failed to update entry for page: '$page_name' with slug: '$page_slug'.";
            log_message($message, $log_file_path, 'error', $api_url);

            return new WP_REST_Response([
                'status' => 'error',
                'message' => $message,
            ], 200); // Always return status code 200
        }
    } else {
        // Insert new entry
        $success = $wpdb->insert($table_name, $params);

        if ($success) {
            $message = "Inserted new entry for page: '$page_name' with slug: '$page_slug'.";
            log_message($message, $log_file_path, 'success', $api_url);

            return new WP_REST_Response([
                'status' => 'success',
                'message' => $message,
            ], 200); // Always return status code 200
        } else {
            $message = "Failed to insert new entry for page: '$page_name' with slug: '$page_slug'.";
            log_message($message, $log_file_path, 'error', $api_url);

            return new WP_REST_Response([
                'status' => 'error',
                'message' => $message,
            ], 200); // Always return status code 200
        }
    }
}

function get_generated_page_status(WP_REST_Request $request) {
    global $wpdb;

    $plugin_dir = plugin_dir_path(__FILE__); 
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt';
    $api_url = $request->get_route(); // Get the API URL

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $table_name = $wpdb->prefix . 'page_generation_status';

    $query = "SELECT * FROM $table_name";
    $results = $wpdb->get_results($query, ARRAY_A);

    if (!empty($results)) {
        log_message("Successfully retrieved generated page status data.", $log_file_path, 'success', $api_url);

        return new WP_REST_Response([
            'status' => 'success',
            'message' => 'Successfully retrieved data.',
            'data' => $results,
        ], 200); // Always return 200
    } else {
        log_message("No data found in generated page status.", $log_file_path, 'warning', $api_url);

        return new WP_REST_Response([
            'status' => 'error',
            'message' => 'No HTML metadata found.',
            'data' => [],
        ], 200); // Always return 200
    }
}



function fetch_html_data_details(WP_REST_Request $request) {
    global $wpdb;

    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt';
     $api_url = $request->get_route(); // Get the API URL

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $table_name = $wpdb->prefix . 'generated_html_content';

    $query = "SELECT DISTINCT version_name, page_name, template_name FROM $table_name";
    $results = $wpdb->get_results($query, ARRAY_A);

    if (!empty($results)) {
        // Log successful retrieval of data
        log_message("Successfully retrieved HTML data details.", $log_file_path, 'success',$api_url);
        return new WP_REST_Response($results, 200);
    } else {
        // Log warning for no data found
        log_message("No HTML metadata found.", $log_file_path, 'warning',$api_url);
        return new WP_Error('no_data', 'No HTML metadata found', ['status' => 404]);
    }
}

function fetch_html_data($request) {
    global $wpdb;

    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs'; 
    $log_file_path = $log_dir . '/plugin-log.txt';
    $api_url = $request->get_route();

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $table_name = $wpdb->prefix . 'generated_html_content';

    $version_name = sanitize_text_field($request->get_param('version_name'));
    $page_name = sanitize_text_field($request->get_param('page_name'));
    $template_name = sanitize_text_field($request->get_param('template_name'));

    $query = $wpdb->prepare(
        "SELECT html_data FROM $table_name WHERE version_name = %s AND page_name = %s AND template_name = %s",
        $version_name, $page_name, $template_name
    );

    $results = $wpdb->get_results($query, ARRAY_A);

    if (!empty($results)) {
        foreach ($results as $index => $result) {
            $clean_html = base64_decode($result['html_data']);
            $results[$index]['html_data'] = $clean_html;
        }

        log_message("Successfully fetched HTML data for version: $version_name, page: $page_name, template: $template_name.", $log_file_path, 'success', $api_url);
        return new WP_REST_Response([
            'status' => 'success',
            'message' => 'Successfully fetched HTML data.',
            'data' => $results,
        ], 200); // Always return 200
    } else {
        log_message("No HTML data found for version: $version_name, page: $page_name, template: $template_name.", $log_file_path, 'warning', $api_url);
        return new WP_REST_Response([
            'status' => 'error',
            'message' => 'No HTML data found for the given criteria.',
            'data' => [],
        ], 200); // Always return 200
    }
}


function save_generated_html_data($request) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'generated_html_content';
    $api_url = $request->get_route();

    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt';

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $version_name = sanitize_text_field($request->get_param('version_name'));
    $page_name = sanitize_text_field($request->get_param('page_name'));
    $template_name = sanitize_text_field($request->get_param('template_name'));
    $html_data = base64_encode($request->get_param('html_data')); 

    if ($page_name === 'Blog' || $page_name === 'Contact Us') {
        if (empty($html_data)) {
            $home_data = $wpdb->get_row($wpdb->prepare(
                "SELECT html_data FROM $table_name WHERE page_name = %s AND template_name = %s AND version_name = %s",
                'Home', $template_name, $version_name
            ));

            if ($home_data) {
                $html_data = $home_data->html_data;
            } else {
                return new WP_REST_Response(['success' => false, 'message' => 'Home data not found'], 404);
            }
        }
    }

    $exists = $wpdb->get_var($wpdb->prepare(
        "SELECT id FROM $table_name WHERE version_name = %s AND page_name = %s AND template_name = %s",
        $version_name, $page_name, $template_name
    ));

    $data = array(
        'version_name' => $version_name,
        'page_name' => $page_name,
        'template_name' => $template_name,
        'html_data' => $html_data
    );

    $format = array('%s', '%s', '%s', '%s');

    if ($exists) {
        // Update existing record
        $result = $wpdb->update($table_name, $data, array('id' => $exists), $format, array('%d'));
        if ($result !== false) {
            log_message("Successfully updated HTML data for version: $version_name, page: $page_name, template: $template_name.", $log_file_path, 'success', $api_url);
            return new WP_REST_Response(['success' => true, 'id' => $exists], 200);
        } else {
            log_message("Failed to update HTML data for version: $version_name, page: $page_name, template: $template_name.", $log_file_path, 'error', $api_url);
            return new WP_Error('db_error', 'Failed to save HTML data', ['status' => 500]);
        }
    } else {
        // Insert new record
        $result = $wpdb->insert($table_name, $data, $format);
        if ($result !== false) {
            log_message("Successfully saved new HTML data for version: $version_name, page: $page_name, template: $template_name.", $log_file_path, 'success', $api_url);
            return new WP_REST_Response(['success' => true, 'id' => $wpdb->insert_id], 200);
        } else {
            log_message("Failed to save new HTML data for version: $version_name, page: $page_name, template: $template_name.", $log_file_path, 'error', $api_url);
            return new WP_Error('db_error', 'Failed to save HTML data', ['status' => 500]);
        }
    }
}

function save_generated_data(WP_REST_Request $request) {
    global $wpdb;

    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs'; 
    $log_file_path = $log_dir . '/plugin-log.txt';
    $api_url = $request->get_route(); // Get the API URL

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $table_name = $wpdb->prefix . 'generated_content';

    $page_name = sanitize_text_field($request->get_param('page_name'));
    $template_name = sanitize_text_field($request->get_param('template_name'));
    $version_name = sanitize_text_field($request->get_param('version_name'));
    
    // Get json_content from the request
    $json_content = $request->get_param('json_content');
    
    // Check if the page is Blog or Contact Us and if json_content is empty
    if (($page_name === 'Blog' || $page_name === 'Contact Us') && empty($json_content)) {
        // Fetch Home page JSON content
        $home_data = $wpdb->get_row($wpdb->prepare(
            "SELECT json_content FROM $table_name WHERE page_name = %s AND template_name = %s AND version_name = %s",
            'Home', $template_name, $version_name
        ));

        if ($home_data) {
            $json_content = $home_data->json_content; // Use Home's JSON content
        } else {
            return new WP_REST_Response(['success' => false, 'message' => 'Home data not found'], 404);
        }
    } else {
        $json_content = json_encode($json_content); // Encode if it's not empty
    }

    // Check if the entry already exists
    $exists = $wpdb->get_var($wpdb->prepare(
        "SELECT id FROM $table_name WHERE page_name = %s AND template_name = %s AND version_name = %s",
        $page_name, $template_name, $version_name
    ));

    $data = array(
        'page_name' => $page_name,
        'template_name' => $template_name,
        'version_name' => $version_name,
        'json_content' => $json_content
    );

    $data_format = array('%s', '%s', '%s', '%s');

    if ($exists) {
        // Update existing record
        $result = $wpdb->update($table_name, $data, array('id' => $exists), $data_format, array('%d'));
        if ($result !== false) {
            log_message("Successfully updated generated data for page: $page_name, template: $template_name, version: $version_name.", $log_file_path, 'success', $api_url);
            $response_id = $exists;
        } else {
            log_message("Failed to update generated data for page: $page_name, template: $template_name, version: $version_name.", $log_file_path, 'error', $api_url);
            return new WP_REST_Response(['success' => false, 'message' => 'Failed to save data'], 500);
        }
    } else {
        // Insert new record
        $result = $wpdb->insert($table_name, $data, $data_format);
        if ($result !== false) {
            log_message("Successfully saved new generated data for page: $page_name, template: $template_name, version: $version_name.", $log_file_path, 'success', $api_url);
            $response_id = $wpdb->insert_id;
        } else {
            log_message("Failed to save new generated data for page: $page_name, template: $template_name, version: $version_name.", $log_file_path, 'error', $api_url);
            return new WP_REST_Response(['success' => false, 'message' => 'Failed to save data'], 500);
        }
    }

    return new WP_REST_Response([
        'success' => true,
        'message' => 'Data successfully saved',
        'id' => $response_id
    ], 200); 
}

function regenerate_global_elementor_css(WP_REST_Request $request) {
    global $wpdb;
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt';
    $api_url = $request->get_route(); // Get the API URL
    
    // Create log directory if it doesn't exist
    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    // Check if Elementor is active
    if (!class_exists('\Elementor\Plugin')) {
        log_message('Elementor is not active.', $log_file_path, 'error', $api_url);
        return new WP_REST_Response(['success' => false, 'message' => 'Elementor is not active'], 500);
    }

    // Clear Elementor cache
    $elementor = \Elementor\Plugin::instance()->files_manager->clear_cache();
    log_message('Elementor files regenerated successfully.', $log_file_path, 'success', $api_url);

    // Get the menu ID from the database
    $menu_id = $wpdb->get_var($wpdb->prepare(
        "SELECT menu_id FROM {$wpdb->prefix}menu_details WHERE menu_name = %s",
        'Menu'
    ));

    // Check if menu ID is retrieved
    if (!$menu_id) {
        log_message('Error in finding menus.', $log_file_path, 'error', $api_url);
        return new WP_REST_Response([
            'success' => false,
            'message' => 'Elementor files regenerated successfully. Error in finding menus.'
        ], 404);
    }

    // Fetch all menu items for the specific menu ID
    $menu_items = wp_get_nav_menu_items($menu_id);
    $front_page_id = get_option('page_on_front');

    // Remove all existing "Home" menu items that don't match the front page
    if (is_array($menu_items)) {
        foreach ($menu_items as $item) {
            if ($item->title === 'Home' && $item->object_id != $front_page_id) {
                wp_delete_post($item->ID, true);
                log_message('Deleted previous "Home" menu item with ID ' . $item->ID, $log_file_path, 'info', $api_url);
            }
        }
    }

    // Check if "Home" menu item already exists for the front page
    $home_item_exists = false;

    if (is_array($menu_items)) {
        foreach ($menu_items as $item) {
            if ($item->title === 'Home' && $item->object_id == $front_page_id) {
                $home_item_exists = true;
                break; // Exit loop as soon as a match is found
            }
        }
    }

    // Add new "Home" menu item if it doesn't exist
    if (!$home_item_exists) {
        $menu_item_data = [
            'menu-item-title' => 'Home',
            'menu-item-object-id' => $front_page_id,
            'menu-item-object' => 'page',
            'menu-item-type' => 'post_type',
            'menu-item-status' => 'publish',
            'menu-item-position' => 1
        ];

        $new_menu_item_id = wp_update_nav_menu_item($menu_id, 0, $menu_item_data);

        if (is_wp_error($new_menu_item_id)) {
            log_message('Failed to add "Home" menu item.', $log_file_path, 'error', $api_url);
            return new WP_REST_Response(['success' => false, 'message' => 'Failed to add "Home" menu item'], 500);
        }
        log_message('New "Home" menu item added successfully.', $log_file_path, 'success', $api_url);
    } else {
        log_message('"Home" menu item already exists.', $log_file_path, 'info', $api_url);
    }
	
	$width = get_option('selected_logo_width', true);
     // Fetch the existing custom CSS
    $existing_css = wp_get_custom_css();

    // Define the new CSS rule for #template-logo and #footer-logo
    $new_css = "
        #template-logo img,
        #footer-logo img {
            width: {$width}px;
            max-width: 100%;
            height: auto;
        }
    ";

    // Replace any existing #template-logo or #footer-logo rules
    $pattern = '/#template-logo\s*img\s*,\s*#footer-logo\s*img\s*{[^}]*}/';
    if (preg_match($pattern, $existing_css)) {
        // Replace the existing rule
        $updated_css = preg_replace($pattern, trim($new_css), $existing_css);
    } else {
        // Append the new rule if no existing rule is found
        $updated_css = $existing_css . "\n" . $new_css;
    }

    // Save the updated CSS back to the Customizer
    wp_update_custom_css_post($updated_css);
	
    return new WP_REST_Response([
        'success' => true,
        'message' => 'Elementor files regenerated successfully and menu updated.'
    ], 200);
}

function import_site_logo_old(WP_REST_Request $request) {
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt'; 
     $api_url = $request->get_route(); // Get the API URL

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $params = $request->get_json_params();
    $image_url = $params['fileurl'] ?? '';
    

    $image_id = attachment_url_to_postid($image_url);
    
    if ($image_id) {
        // Set the image as the custom logo
        set_theme_mod('custom_logo', $image_id);
        log_message('Site logo updated successfully.', $log_file_path, 'success',$api_url);

        return new WP_REST_Response([
            'success' => true,
            'message' => 'Site logo updated successfully.'
        ], 200);
    } else {
        // Handle the case where the image is not found in the media library
        log_message('Failed to find the image in the media library. Make sure the image is uploaded and try again.', $log_file_path, 'error',$api_url);

        return new WP_REST_Response([
            'success' => false,
            'message' => 'Failed to find the image in the media library. Make sure the image is uploaded and try again.'
        ], 404);
    }
}
function upload_to_wp($file_path) {
    // Get WordPress upload directory
    $upload_dir = wp_upload_dir();

    // Copy the file to the upload directory
    $filename = basename($file_path);
    $new_file_path = $upload_dir['path'] . '/' . $filename;
    copy($file_path, $new_file_path);

    // Create an array of attachment data to add to the media library
    $attachment = array(
        'guid'           => $upload_dir['url'] . '/' . basename($new_file_path),
        'post_mime_type' => 'image/png',
        'post_title'     => preg_replace('/\.[^.]+$/', '', basename($filename)),
        'post_content'   => '',
        'post_status'    => 'inherit'
    );

    // Insert the attachment into the media library
    $attach_id = wp_insert_attachment($attachment, $new_file_path);

    // Generate the metadata for the attachment
    require_once(ABSPATH . 'wp-admin/includes/image.php');
    $attach_data = wp_generate_attachment_metadata($attach_id, $new_file_path);
    wp_update_attachment_metadata($attach_id, $attach_data);

    return $attach_id;
}

function import_site_logo(WP_REST_Request $request) {
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt'; 
    $api_url = $request->get_route();
    $image_id="";

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $params = $request->get_json_params();
    $image_url = $params['fileurl'] ?? '';
    $type = $params['type'] ?? '';

    if (empty($image_url)||empty($type)) {
        log_message('No image URL provided.', $log_file_path, 'error', $api_url);
        return new WP_REST_Response([
            'success' => false,
            'message' => 'No image URL or type provided.'
        ], 400);
    }
    if($type=="url"){
        $image_id = attachment_url_to_postid($image_url);
        
        if (!$image_id) {
            // Download the image to a temporary location
            $temp_file = download_url($image_url);

            if (is_wp_error($temp_file)) {
                log_message('Failed to download the image from the URL.', $log_file_path, 'error', $api_url);
                return new WP_REST_Response([
                    'success' => false,
                    'message' => 'Failed to download the image from the URL.'
                ], 400);
            }

            // File array to simulate an upload
            $file = array(
                'name'     => basename($image_url),
                'tmp_name' => $temp_file,
            );

            $upload = wp_handle_sideload($file, array('test_form' => false));

            if (isset($upload['error'])) {
                @unlink($temp_file);
                log_message('Failed to upload the image to the media library.', $log_file_path, 'error', $api_url);
                return new WP_REST_Response([
                    'success' => false,
                    'message' => 'Failed to upload the image to the media library.'
                ], 400);
            }

            $attachment_data = array(
                'post_mime_type' => $upload['type'],
                'post_title'     => sanitize_file_name($upload['file']),
                'post_content'   => '',
                'post_status'    => 'inherit',
            );

            $image_id = wp_insert_attachment($attachment_data, $upload['file']);
            require_once(ABSPATH . 'wp-admin/includes/image.php');
            $attach_data = wp_generate_attachment_metadata($image_id, $upload['file']);
            wp_update_attachment_metadata($image_id, $attach_data);
        }
    }
    else{
        global $wpdb;
        $table_name = $wpdb->prefix . 'gw_user_form_details';

        $query = "SELECT templateList FROM $table_name LIMIT 1";
        $result = $wpdb->get_var($query);
        
        // Decode the JSON data to access dark_theme
        $templateList = json_decode($result, true);
        $dark_theme = $templateList['dark_theme'] ?? 0;
        $text = $image_url;
        $font_size = 20;
        $plugin_dir = plugin_dir_path(__FILE__);
        $font_file = $plugin_dir . 'fonts/Roboto-Medium.ttf'; // Ensure this font file exists in your directory
        
        // Calculate the exact dimensions of the text
        $bbox = imagettfbbox($font_size, 0, $font_file, $text);
        
        // Determine width and height without extra space
        $text_width = abs($bbox[2] - $bbox[0]);
        $text_height = abs($bbox[7] - $bbox[1]);
        
        // Add padding for top, bottom, and right sides
        $padding = 20; // Adjust this value to control the amount of white space
        $canvas_width = $text_width + $padding; // Add padding to the right
        $canvas_height = $text_height + (2 * $padding); // Add padding to the top and bottom
        
        // Create a blank image with the padded dimensions
        $image = imagecreatetruecolor($canvas_width, $canvas_height);
        
        // Set transparency settings
        imagesavealpha($image, true); // Allow transparency
        $transparent_color = imagecolorallocatealpha($image, 0, 0, 0, 127); // Fully transparent
        imagefill($image, 0, 0, $transparent_color); // Fill the background with transparency
        
        // Set text color based on theme
        if ($dark_theme) {
            $text_color = imagecolorallocate($image, 255, 255, 255); // White text
        } else {
            $text_color = imagecolorallocate($image, 0, 0, 0); // Black text
        }
        
        // Calculate the position to center the text vertically with padding
        $text_x = 0; // Start at the left edge
        $text_y = $padding + abs($bbox[5]); // Add top padding to the baseline
        
        // Add text to the image with padding
        imagettftext($image, $font_size, 0, $text_x, $text_y, $text_color, $font_file, $text);
        
        // Save the image to a temporary file
        $temp_file = __DIR__ . '/my_image_' . time() . '.png';
        imagepng($image, $temp_file); // Save as PNG to preserve transparency
        imagedestroy($image);
        
        // Upload the image to WordPress
        $image_id = upload_to_wp($temp_file);

        // global $wpdb;
        // $table_name = $wpdb->prefix . 'gw_user_form_details';
        
        // $query = "SELECT templateList FROM $table_name LIMIT 1";
        // $result = $wpdb->get_var($query);
        
        // // Decode the JSON data to access dark_theme
        // $templateList = json_decode($result, true);
        // $dark_theme = $templateList['dark_theme'] ?? 0;
        // $text = $image_url;
        // $font_size = 20;
        // $plugin_dir = plugin_dir_path(__FILE__);
        // $font_file = $plugin_dir . 'fonts/Roboto-Medium.ttf'; // Ensure this font file exists in your directory
        
        // // Calculate the exact dimensions of the text
        // $bbox = imagettfbbox($font_size, 0, $font_file, $text);
        
        // // Determine width and height without extra space
        // $width = abs($bbox[2] - $bbox[0]);  // Width based on the text only
        // $height = abs($bbox[7] - $bbox[1]); // Height based on the text only
        
        // // Create a blank image with the exact dimensions
        // $image = imagecreatetruecolor($width, $height);
        
        // // Set transparency settings
        // imagesavealpha($image, true); // Allow transparency
        // $transparent_color = imagecolorallocatealpha($image, 0, 0, 0, 127); // Fully transparent
        // imagefill($image, 0, 0, $transparent_color); // Fill the background with transparency
        
        // // Set text color based on theme
        // if ($dark_theme) {
        //     $text_color = imagecolorallocate($image, 255, 255, 255); // White text
        // } else {
        //     $text_color = imagecolorallocate($image, 0, 0, 0); // Black text
        // }
        
        // // Add text to the image without any padding
        // imagettftext($image, $font_size, 0, 0, abs($bbox[5]), $text_color, $font_file, $text);
        
        // // Save the image to a temporary file
        // $temp_file = __DIR__ . '/my_image_' . time() . '.png';
        // imagepng($image, $temp_file); // Save as PNG to preserve transparency
        // imagedestroy($image);
        
        // // Upload the image to WordPress
        // $image_id = upload_to_wp($temp_file);

        
    }
    // Set the image as the custom logo
    set_theme_mod('custom_logo', $image_id);
    log_message('Site logo updated successfully.', $log_file_path, 'success', $api_url);

    return new WP_REST_Response([
        'success' => true,
        'message' => 'Site logo updated successfully.'
    ], 200);
}

global $wpdb; // Access the WordPress database
    $table_name = $wpdb->prefix . 'gw_user_form_details';

    // Retrieve the first templateList from the table
    $query = "SELECT templateList FROM $table_name LIMIT 1";
    $result = $wpdb->get_var($query);

    // Decode the JSON data to access dark_theme
    $templateList = json_decode($result, true);

    // Check if 'dark_theme' exists and is set, otherwise default to 0
    $dark_theme = $templateList['dark_theme'] ?? 0; // Default to 0 if not present

    // Determine logo color based on dark_theme
    $text_color_rgb = $dark_theme === 1 ? [255, 255, 255] : [0, 0, 0]; 
    // print_r($dark_theme);
    // echo '<pre>';
    // print_r($templateList);
    // echo '</pre>';exit;

function wpse_import_menus_css(WP_REST_Request $request) {
    // Statically define the path to the plugin's uploads folder
    //$plugin_dir = plugin_dir_path(__FILE__);
    
    $plugin_dir = ABSPATH . 'wp-content/plugins/gw-website-builder-main'; 
    $uploads_dir = $plugin_dir . '/uploads';

    // Log directory remains unchanged
    $log_dir = $plugin_dir . '/API/logs'; 
    $log_file_path = $log_dir . '/plugin-log.txt';
    $api_url = $request->get_route();

    // Ensure the logs and uploads directories exist
    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    if (!file_exists($uploads_dir)) {
        mkdir($uploads_dir, 0755, true);
    }

    $params = $request->get_json_params();
    $file_url = $params['fileurl'] ?? '';

    if (empty($file_url)) {
        log_message('No file URL provided for importing menus and CSS.', $log_file_path, 'error', $api_url);
        return new WP_REST_Response([
            'success' => false,
            'message' => 'No file URL provided'
        ], 400); // Bad Request
    }

    // Prepare the local file path in the uploads directory
    $local_file_path = $uploads_dir . '/' . basename($file_url);

    // Download the JSON/XML file
    if (!download_file($file_url, $local_file_path)) {
        log_message("Failed to download the file from: $file_url", $log_file_path, 'error', $api_url);
        return new WP_REST_Response([
            'success' => false,
            'message' => 'Failed to download the file from: ' . $file_url
        ], 500); // Internal Server Error
    }

    // Load the JSON or XML file from the local path
    $file_contents = file_get_contents($local_file_path);

    // Assuming it's JSON format, process the file accordingly (you can adjust if XML)
    $data = json_decode($file_contents, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        log_message('Invalid JSON format when importing menus and CSS.', $log_file_path, 'error', $api_url);
        return new WP_REST_Response([
            'success' => false,
            'message' => 'Invalid JSON format'
        ], 400); // Bad Request
    }

    // Process the imported data (replace wpse_process_import_data with your actual function)
    $result = wpse_process_import_data($data);

    if ($result) {
        log_message('Menus and CSS imported successfully.', $log_file_path, 'success', $api_url);
        return new WP_REST_Response([
            'success' => true,
            'message' => 'Menus and CSS imported successfully'
        ], 200); // OK
    } else {
        log_message('Failed to import menus and CSS.', $log_file_path, 'error', $api_url);
        return new WP_REST_Response([
            'success' => false,
            'message' => 'Failed to import menus and CSS'
        ], 500); // Internal Server Error
    }
}


// Function to remove all generated data
function remove_all_generated_data(WP_REST_Request $request) {
    global $wpdb;

    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt';

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    $api_url = $request->get_route();
    

    // Log the request details
    log_message("Received remove-all-generated-data request.", $log_file_path, 'info', $api_url);

    // Tables to truncate
    $tables = [
        $wpdb->prefix . 'page_generation_status',
        $wpdb->prefix . 'generated_content',
        $wpdb->prefix . 'generated_html_content'
    ];

    // Initialize response array
    $response_data = [];
    
    foreach ($tables as $table) {
        // Check if table exists
        if ($wpdb->get_var("SHOW TABLES LIKE '{$table}'") === $table) {
            // Log table truncation
            log_message("Truncating table: {$table}", $log_file_path, 'info', $api_url);
            
            // SQL to truncate table
            $wpdb->query("TRUNCATE TABLE `{$table}`");
            $response_data[$table] = 'Truncated successfully';
            
            // Log success
            log_message("Table {$table} truncated successfully.", $log_file_path, 'info', $api_url);
        } else {
            $response_data[$table] = 'Table does not exist';
            
            // Log failure
            log_message("Table {$table} does not exist.", $log_file_path, 'error', $api_url);
        }
    }

    return new WP_REST_Response($response_data, 200);
}

// Function to delete all styles
function delete_all_styles(WP_REST_Request $request) {
    global $wpdb;

    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt';

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    $api_url = $request->get_route();

    // Log the request details
    log_message("Received delete-all-styles request.", $log_file_path, 'info', $api_url);

    // Table name
    $table_name = $wpdb->prefix . 'gw_user_form_details';
    
    // Data to be updated (empty strings or NULL, as per your requirement)
    $data = array(
        'logo' => '',  // Set to empty string or use NULL if that’s more appropriate
        'color' => '',
        'font' => ''
    );

    // Where clause to identify the row
    $where = array('id' => 1);

    // Log start of style deletion
    log_message("Attempting to delete styles from table {$table_name}.", $log_file_path, 'info', $api_url);

    // Execute the update
    $updated = $wpdb->update($table_name, $data, $where);

    if (false === $updated) {
        // Log update failure
        log_message("Failed to update style settings for table {$table_name}.", $log_file_path, 'error', $api_url);
        return new WP_Error('db_update_error', 'Failed to update style settings', array('status' => 500));
    } else {
        // Log successful update
        log_message("Style settings updated successfully for table {$table_name}.", $log_file_path, 'Success', $api_url);
        return new WP_REST_Response('Style settings deleted successfully', 200);
    }
}

//user flow starts here

// function update_logo_width($request) {
//     // Get the width parameter from the API request
//     $width = $request->get_param('width');

//     // Validate the width (ensure it's a number and greater than 0)
//     if (!is_numeric($width) || $width <= 0) {
//         return new WP_Error('invalid_width', 'The width must be a positive number.', array('status' => 400));
//     }

//     // Fetch the existing custom CSS
//     $existing_css = wp_get_custom_css();

//     // Define the new CSS rule
//     $new_css = "
//         .hfe-site-logo-set .hfe-site-logo-img {
//             width: {$width}px;
//             max-width: 100%;
//             height: auto;
//         }
//     ";

//     // Replace any existing .hfe-site-logo-set .hfe-site-logo-img rule
//     $pattern = '/\.hfe-site-logo-set\s*\.hfe-site-logo-img\s*{[^}]*}/';
//     if (preg_match($pattern, $existing_css)) {
//         // Replace the existing rule
//         $updated_css = preg_replace($pattern, trim($new_css), $existing_css);
//     } else {
//         // Append the new rule if no existing rule is found
//         $updated_css = $existing_css . "\n" . $new_css;
//     }

//     // Save the updated CSS back to the Customizer
//     wp_update_custom_css_post($updated_css);

//     return array(
//         'success' => true,
//         'message' => 'Logo width updated successfully.',
//         'width'   => $width,
//     );
// }


function custom_get_userdata() {
    $api_url = 'https://api.gravitywrite.com/api/get-user-details';
    $bearer_token = get_option('api_user_token', true);

    // Check if the bearer token exists
    if (empty($bearer_token)) {
        return new WP_Error(
            'no_token',
            'No token found. Please log in again.',
            ['status' => 401]
        );
    }

    // Set up the request arguments
    $args = [
        'headers' => [
            'Authorization' => 'Bearer ' . $bearer_token,
        ],
    ];

    // Perform the request
    $response = wp_remote_get($api_url, $args);

    // Check for errors in the request
    if (is_wp_error($response)) {
        return new WP_Error(
            'request_failed',
            'Error fetching data: ' . $response->get_error_message(),
            ['status' => 500]
        );
    }

    // Get the response body and decode it
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    // Check if the JSON decoding succeeded
    if (json_last_error() !== JSON_ERROR_NONE) {
        return new WP_Error(
            'json_error',
            'Error decoding JSON response: ' . json_last_error_msg(),
            ['status' => 500]
        );
    }

    // Transform the data into the required format
    $transformed_data = [
        [
            "id" => "1", // Hardcoded, update if you want a dynamic ID
            "name" => isset($data['user_name']) ? $data['user_name'] : '',
            "email" => isset($data['user_email']) ? $data['user_email'] : '',
            "gravator" => isset($data['gravator']) ? $data['gravator'] : '',
            "plan_detail" => isset($data['plan_name']) ? $data['plan_name'] : '',
            "website_used" => isset($data['ai_websites_used']) ? (string) $data['ai_websites_used'] : '0',
            "website_total" => isset($data['ai_websites_total']) ? (string) $data['ai_websites_total'] : '0',
        ]
    ];

    // Return the transformed data
    return rest_ensure_response($transformed_data);
}


function update_logo_width($request) {
    // Get the width parameter from the API request
    $width = $request->get_param('width');
   
    // Validate the width (ensure it's a number and greater than 0)
    if (!is_numeric($width) || $width <= 0) {
        return new WP_Error('invalid_width', 'The width must be a positive number.', array('status' => 400));
    }

    // Fetch the existing custom CSS
    $existing_css = wp_get_custom_css();

    // Define the new CSS rule for #template-logo and #footer-logo
    $new_css = "
        #template-logo img,
        #footer-logo img {
            width: {$width}px;
            max-width: 100%;
            height: auto;
        }
    ";

    // Replace any existing #template-logo or #footer-logo rules
    $pattern = '/#template-logo\s*img\s*,\s*#footer-logo\s*img\s*{[^}]*}/';
    if (preg_match($pattern, $existing_css)) {
        // Replace the existing rule
        $updated_css = preg_replace($pattern, trim($new_css), $existing_css);
    } else {
        // Append the new rule if no existing rule is found
        $updated_css = $existing_css . "\n" . $new_css;
    }

    // Save the updated CSS back to the Customizer
    wp_update_custom_css_post($updated_css);
    update_option('selected_logo_width', $width);

    return array(
        'success' => true,
        'message' => 'Logo width updated successfully.',
        'width'   => $width,
    );
}


function check_previous_import() {
    // Get the value of the option 'is_imported'
    $is_imported = get_option('is_imported');
    // Check if 'is_imported' is set to 'yes'
    if ($is_imported === 'yes') {
        
        return new WP_REST_Response([
            'value' => true
        ], 200);
    }
    else{
        return new WP_REST_Response([
            'value' => false
        ], 200);

    }

}

function get_logged_user_token() {
    $api_user_token = get_option('api_user_token');

    // Prepare the response
    if (!empty($api_user_token)) {
        $response = [
            'status' => true,
            'token'  => $api_user_token,
        ];
    } else {
        $response = [
            'status'  => false,
            'message' => 'Token not found.',
        ];
    }

    // Return the response
    return rest_ensure_response($response);
}


function api_fetch_user_details(WP_REST_Request $request) {
    $email = $request->get_param('email');
    $token = $request->get_param('wp_token');
    $fe_token = $request->get_param('fe_token');
    
    if (empty($email) || empty($token)) {
        return new WP_REST_Response('Missing email or token', 400);
    }
    update_option('api_user_email', sanitize_email($email));
    update_option('api_user_token', sanitize_text_field($token));
    update_option('api_user_fe_token', sanitize_text_field($fe_token));

    $user_data = fetch_user_data_from_api();
    if ($user_data) {
        $result = save_user_data_to_database($user_data);
        update_option('gravitywrite_account_key', 'connected');
        return new WP_REST_Response($result, 200);
    }
    return new WP_REST_Response('Error fetching or saving data', 500);
}


function Api_disconnect_handler(WP_REST_Request $request) {
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt';

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    $api_url = $request->get_route();
    
    $updated = update_option('gravitywrite_account_key', 'disconnected');

    if ($updated !== false) {
        log_message("Account successfully set to disconnected in WordPress options.", $log_file_path, 'info',$api_url);

        wp_send_json_success(['message' => 'You have successfully disconnected from GravityWrite.']);
        
        if (!is_admin() || 'gravitywrite_settings' !== ($_GET['page'] ?? '')) {
            log_message("Disconnect request not initiated from the settings page.", $log_file_path, 'warning',$api_url);
            return;
        }
    
        // $email = $_GET['email'] ?? '';
        // $token = $_GET['wp_token'] ?? '';
        // $fe_token = $_GET['fe_token'] ?? '';

        // // Sanitize the email and token
        // $email = sanitize_email($email);
        // $token = sanitize_text_field($token);
        // $fe_token = sanitize_text_field($fe_token);
        
        $email = get_option('api_user_email',true);
        $token = get_option('api_user_token',true);
        $fe_token =  get_option('api_user_fe_token',true);
    

        if (empty($email) || empty($token)) {
            log_message("Missing email or token in disconnect request.", $log_file_path, 'error',$api_url);
            return;
        }
    
        $api = 'https://api.gravitywrite.com/api/connect-status';
        // $response = wp_remote_post($api, [
        //     'method'    => 'POST',
        //     'headers'   => [
        //         'Content-Type'  => 'application/json',
        //         'Authorization' => 'Bearer ' . $token,
        //     ],
        //     'body'      => json_encode(['status' => 0]),
        // ]);
        
        $current_domain = home_url();
        //echo $current_domain;

        $response = wp_remote_post($api, [
            'method'    => 'POST',
            'headers'   => [
                'Content-Type'  => 'application/x-www-form-urlencoded',
                'Authorization' => 'Bearer ' . $token,
            ],
            'body'      => http_build_query([
                'status' => 0,
                'domain' => $current_domain,
            ]),
        ]);

    
        if (is_wp_error($response)) {
            $error_message = $response->get_error_message();
            log_message("Failed to connect to external API: $error_message", $log_file_path, 'error', $api_url);
            return;
        }

        // Parse the API response
        $response_body = wp_remote_retrieve_body($response);
        $data = json_decode($response_body, true);
    
        if (isset($data['wp_status']) && $data['wp_status'] === 'Disconnected') {
            update_option('gravitywrite_account_key', 'disconnected');
            update_option('api_user_email', $email);
            update_option('api_user_token', $token);
            update_option('api_user_fe_token', $fe_token);
            global $wpdb;
            $table_name = $wpdb->prefix . 'gw_user_plan_details'; 
            $wpdb->query("TRUNCATE TABLE {$table_name}");
            log_message("Successfully disconnected account and truncate user plan details.", $log_file_path, 'info',$api_url);
        } else {
            log_message("Failed to disconnect. API response status did not indicate disconnection.", $log_file_path, 'warning', $api_url);
        }

    } else {
        $account_status = get_option('gravitywrite_account_key');
        if($account_status == 'disconnected'){
            wp_send_json_error(['message' => 'Disconnection has already been completed.']);
        }
        else{
            log_message("Failed to update account status to disconnected in WordPress options.", $log_file_path, 'error',$api_url);
            wp_send_json_error(['message' => 'Failed to disconnect. Please try again.']);
        }
    }
}


function handle_save_user_plan_details(WP_REST_Request $request) {
    global $wpdb;
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt';

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    $api_url = $request->get_route();
    log_message("Received handle-save-user-plan-details request.", $log_file_path, 'info', $api_url);

    $user_data = fetch_user_data_from_api();

    if ($user_data) {
        log_message("Fetched user data successfully.", $log_file_path, 'info', $api_url);
        $result = save_user_data_to_database($user_data);

        if (strpos($result, 'successfully') !== false) {
            log_message("User data saved to database: {$result}", $log_file_path, 'success', $api_url);
            return new WP_REST_Response(['message' => $result, 'status' => 200], 200);
        } else {
            log_message("Error saving user data to database: {$result}", $log_file_path, 'error', $api_url);
            return new WP_REST_Response(['message' => $result, 'status' => 500], 500);
        }
    } else {
        log_message("Failed to fetch user data from API.", $log_file_path, 'error', $api_url);
        return new WP_REST_Response(['message' => 'Failed to fetch user data.', 'status' => 500], 500);
    }
}

function handle_update_count($request) {
    global $wpdb;
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt';

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    $api_request_url = $request->get_route();
    try {
        $page_title = $request->get_param('page_title') ?? 'Default Title';
        $template_id = $request->get_param('template_id') ?? '1';
        $is_type = $request->get_param('is_type') ?? 'words';

        $api_url = 'https://api.gravitywrite.com/api/update-count';
        $bearer_token = get_option('api_user_token', true);
        log_message("Starting handle_update_count request", $log_file_path, 'info', $api_request_url);

        if ($is_type === 'words') {
            $words = $request->get_param('words') ?? 1;
            $sitecount = 0;
        } elseif ($is_type === 'sitecount') {
            $words = 0;
            $sitecount = $request->get_param('sitecount') ?? 1;
        } else {
            log_message("Invalid is_type value: {$is_type}", $log_file_path, 'error', $api_request_url);
            return new WP_Error('invalid_type', 'Invalid is_type value', ['status' => 400]);
        }

        $body = [
            'words'       => $words,
            'page_title'  => $page_title,
            'template_id' => $template_id,
            'sitecount'   => $sitecount,
            'is_type'     => $is_type
        ];

        $headers = [
            'Content-Type'  => 'application/json',
            'Authorization' => 'Bearer ' . $bearer_token
        ];

        $response = wp_remote_post($api_url, [
            'method'  => 'POST',
            'headers' => $headers,
            'body'    => json_encode($body)
        ]);

        if (is_wp_error($response)) {
            log_message("Failed to connect to external API: " . $response->get_error_message(), $log_file_path, 'error', $api_request_url);
            throw new Exception('Failed to connect to external API: ' . $response->get_error_message());
        }

        $response_body = wp_remote_retrieve_body($response);
        $response_data = json_decode($response_body, true);

        if (isset($response_data['countupdated']) && $response_data['countupdated'] === true) {
            $message = ($is_type === 'words') ? 'Words count updated successfully' : 'Site count updated successfully';
            $updated_count = ($is_type === 'words') ? $words : $sitecount;
            log_message($message, $log_file_path, 'success', $api_request_url);
            return [
                'status'    => 'success',
                'wp_status' => $response_data['wp_status'],
                'updated_count' => $updated_count,
                'message'   => $message
            ];
        } else {
            log_message("Failed to update count on external API. Response: " . $response_body, $log_file_path, 'error', $api_request_url);
            throw new Exception('Failed to update count on external API. Response: ' . $response_body);
        }
    } catch (Exception $e) {
        log_message("Exception: " . $e->getMessage(), $log_file_path, 'error', $api_request_url);
        return new WP_Error('api_error', 'Exception: ' . $e->getMessage(), ['status' => 500]);
    }
}

function check_word_count_old($request) {
    global $wpdb;
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt';

    // Ensure the logs directory exists
    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $api_request_url = $request->get_route();
    $api_url = 'https://api.gravitywrite.com/api/check-word-count';
    $bearer_token = get_option('api_user_token', true);

    // Check if Bearer token is available
    if (empty($bearer_token)) {
        log_message("Bearer token is missing", $log_file_path, 'error', $api_request_url);
        return [
            'status' => false,
            'message' => 'Bearer token is missing'
        ];
    }

    $headers = [
        'Content-Type'  => 'application/json',
        'Authorization' => 'Bearer ' . $bearer_token
    ];

    $response = wp_remote_get($api_url, ['headers' => $headers]);

    // Handle API connection errors
    if (is_wp_error($response)) {
        log_message("Failed to connect to external API", $log_file_path, 'error', $api_request_url);
        return [
            'status' => false,
            'message' => 'Failed to connect to external API'
        ];
    }

    $response_body = wp_remote_retrieve_body($response);
    $response_data = json_decode($response_body, true);

    // Handle various error cases based on API response
    if (isset($response_data['status']) && $response_data['status'] === false) {
        if (isset($response_data['wp_status']) && $response_data['wp_status'] == 1) {
            // Word limit reached error
            log_message("Word limit reached", $log_file_path, 'error', $api_request_url);
            return [
                'status' => false,
                'message' => 'Word limit reached'
            ];
        } else {
            // Invalid token error
            log_message("Invalid Bearer token provided", $log_file_path, 'error', $api_request_url);
            return [
                'status' => false,
                'message' => 'Invalid Bearer token provided'
            ];
        }
    }

    // Successful response
    log_message("Word count checked successfully", $log_file_path, 'success', $api_request_url);
    return [
        'status' => true,
        'message' => 'Word count checked successfully'
    ];
}

function check_word_count($request) {
    global $wpdb;
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt';

    // Ensure the logs directory exists
    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $api_request_url = $request->get_route();
    $api_url = 'https://api.gravitywrite.com/api/check-word-count';
    $bearer_token = get_option('api_user_token', true);

    if (empty($bearer_token)) {
        log_message("Bearer token is missing", $log_file_path, 'error', $api_request_url);
        return [
            'status' => false,
            'message' => 'Bearer token is missing'
        ];
    }

    $headers = [
        'Content-Type'  => 'application/json',
        'Authorization' => 'Bearer ' . $bearer_token
    ];

    $response = wp_remote_get($api_url, ['headers' => $headers]);
    
    if (is_wp_error($response)) {
        $error_message = $response->get_error_message(); 
        log_message("Failed to connect to external API: " . $error_message, $log_file_path, 'error', $api_request_url);
        return [
            'status' => false,
            'message' => 'Failed to connect to external API: ' . $error_message
        ];
    }

    $response_body = wp_remote_retrieve_body($response);
    $response_data = json_decode($response_body, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        log_message("Invalid JSON response", $log_file_path, 'error', $api_request_url);
        return [
            'status' => false,
            'message' => 'Invalid JSON response'
        ];
    }
    
     // Handle various error cases based on API response
    if (isset($response_data['status']) && $response_data['status'] === false) {
        if (isset($response_data['wp_status']) && $response_data['wp_status'] == 1) {
            // Word limit reached error
            log_message("Word limit reached", $log_file_path, 'error', $api_request_url);
            return [
                'status' => false,
                'message' => 'Word limit reached'
            ];
        } else {
            // Invalid token error
            log_message("Invalid Bearer token provided", $log_file_path, 'error', $api_request_url);
            return [
                'status' => false,
                'message' => 'Invalid Bearer token provided'
            ];
        }
    }

    // Log success and return the actual API response
    log_message("Word count checked successfully", $log_file_path, 'success', $api_request_url);
    return [
        'status' => isset($response_data['status']) ? $response_data['status'] : '',
        'wp_status' => isset($response_data['wp_status']) ? $response_data['wp_status'] : '',
        'message' => 'Word count checked successfully'
    ];
}

function check_site_count($request) {
    global $wpdb;
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt';

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $api_request_url = $request->get_route();
    $api_url = 'https://api.gravitywrite.com/api/check-site-import-count';
    $bearer_token = get_option('api_user_token', true);

    if (empty($bearer_token)) {
        log_message("Bearer token is missing", $log_file_path, 'error', $api_request_url);
        return new WP_Error('missing_token', 'Bearer token is missing', ['status' => 400]);
    }

    $headers = [
        'Content-Type'  => 'application/json',
        'Authorization' => 'Bearer ' . $bearer_token
    ];

    $response = wp_remote_get($api_url, ['headers' => $headers]);

    if (is_wp_error($response)) {
        log_message("Failed to connect to external API", $log_file_path, 'error', $api_request_url);
        return new WP_Error('api_error', 'Failed to connect to external API', ['status' => 500]);
    }

    $response_body = wp_remote_retrieve_body($response);
    $response_data = json_decode($response_body, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        log_message("Invalid JSON response", $log_file_path, 'error', $api_request_url);
        return new WP_Error('json_error', 'Invalid JSON response', ['status' => 500]);
    }

    // Log success and return the actual API response
    log_message("Site count checked successfully", $log_file_path, 'success', $api_request_url);
    return [
        'status' => isset($response_data['status']) ? $response_data['status'] : '',
        'wp_status' => isset($response_data['wp_status']) ? $response_data['wp_status'] : '',
        'message' => 'Site count checked successfully'
    ];
}

function check_site_count_old($request) {
    global $wpdb;
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt';

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    $api_request_url = $request->get_route();
    $api_url = 'https://api.gravitywrite.com/api/check-site-import-count';
    $bearer_token = get_option('api_user_token', true);

    if (empty($bearer_token)) {
        log_message("Bearer token is missing", $log_file_path, 'error', $api_request_url);
        return new WP_Error('missing_token', 'Bearer token is missing', ['status' => 400]);
    }

    $headers = [
        'Content-Type'  => 'application/json',
        'Authorization' => 'Bearer ' . $bearer_token
    ];

    $response = wp_remote_get($api_url, ['headers' => $headers]);

    if (is_wp_error($response)) {
        log_message("Failed to connect to external API", $log_file_path, 'error', $api_request_url);
        return new WP_Error('api_error', 'Failed to connect to external API', ['status' => 500]);
    }

    $response_body = wp_remote_retrieve_body($response);
    $response_data = json_decode($response_body, true);

    if (isset($response_data['status']) && $response_data['status'] === false) {
        log_message("Invalid or expired Bearer token", $log_file_path, 'error', $api_request_url);
        return ['status' => false, 'reason' => 'Invalid or expired Bearer token'];
    }

    log_message("Site count checked successfully", $log_file_path, 'success', $api_request_url);
    return ['status' => true, 'message' => 'Site count checked successfully'];
}


function fetch_user_data_from_api() {
    $api_url = 'https://api.gravitywrite.com/api/get-user-details';
    $bearer_token = get_option('api_user_token', true);

    $args = [
        'headers' => [
            'Authorization' => 'Bearer ' . $bearer_token,
        ],
    ];

    $response = wp_remote_get($api_url, $args);

    if (is_wp_error($response)) {
        return 'Error fetching data';
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    if (empty($data)) {
        return 'No user data found';
    }

    if (!empty($data)) {
        return [
            'name'          => sanitize_text_field($data['user_name']),
            'email'         => sanitize_email($data['user_email']),
            'gravator'      => esc_url_raw($data['gravator']),
            'plan_detail'   => sanitize_text_field($data['plan_name']),
            'website_used'  => intval($data['ai_websites_used']),
            'website_total' => intval($data['ai_websites_total']),
        ];
    }

    return null;
}


function save_user_data_to_database($user_data) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'gw_user_plan_details';

    // Always use the row with ID 1 for saving/updating
    $specific_id = 1;

    // Check if the row with ID 1 exists
    $existing_user = $wpdb->get_var($wpdb->prepare(
        "SELECT id FROM $table_name WHERE id = %d", $specific_id
    ));

    if ($existing_user) {
        // If the row with ID 1 exists, perform an update
        $updated = $wpdb->update(
            $table_name,
            [
                'name'          => $user_data['name'],
                'email'         => $user_data['email'],
                'plan_detail'   => $user_data['plan_detail'],
                'gravator'      => $user_data['gravator'],
                'website_used'  => $user_data['website_used'],
                'website_total' => $user_data['website_total']
            ],
            ['id' => $specific_id], // Where clause (based on ID)
            [
                '%s',
                '%s',
                '%s',
                '%s',
                '%d',
                '%d'
            ],
            ['%d'] // Where format for the ID
        );

        if ($updated !== false) {
            return 'User data updated successfully.';
        } else {
            return 'Failed to update user data.';
        }
    } else {
        // If the row with ID 1 does not exist, perform an insert with ID 1
        $inserted = $wpdb->insert(
            $table_name,
            [
                'id'            => $specific_id, // Set ID to 1 for this row
                'name'          => $user_data['name'],
                'email'         => $user_data['email'],
                'plan_detail'   => $user_data['plan_detail'],
                'gravator'      => $user_data['gravator'],
                'website_used'  => $user_data['website_used'],
                'website_total' => $user_data['website_total']
            ],
            [
                '%d',
                '%s',
                '%s',
                '%s',
                '%s',
                '%d',
                '%d'
            ]
        );

        if ($inserted) {
            return 'User data inserted successfully.';
        } else {
            return 'Failed to insert user data.';
        }
    }
}


//user flow end

function delete_uploads_folder(WP_REST_Request $request) {
    $plugin_dir = dirname(plugin_dir_path(__FILE__));
    $uploads_dir = $plugin_dir . '/uploads/';

    if (!file_exists($uploads_dir)) {
        return new WP_REST_Response(['success' => false, 'message' => 'Uploads folder does not exist.'], 404);
    }

    $deleted = delete_directory($uploads_dir);

    if ($deleted) {
        return new WP_REST_Response(['success' => true, 'message' => 'Uploads folder deleted successfully.'], 200);
    } else {
        return new WP_REST_Response(['success' => false, 'message' => 'Failed to delete uploads folder.'], 500);
    }
}

function delete_directory($dir) {
    if (!is_dir($dir)) {
        return false;
    }

    $files = array_diff(scandir($dir), array('.', '..'));

    foreach ($files as $file) {
        $file_path = "$dir/$file";
        if (is_dir($file_path)) {
            delete_directory($file_path);
        } else {
            unlink($file_path); 
        }
    }

    return rmdir($dir);
}

function create_uploads_folder(WP_REST_Request $request) {
    $plugin_dir = dirname(__DIR__) . '/'; 
    $uploads_dir = $plugin_dir . 'uploads/'; 

    if (!file_exists($uploads_dir)) {
        // Attempt to create the uploads folder
        if (wp_mkdir_p($uploads_dir)) {
            return new WP_REST_Response(['success' => true, 'message' => 'Uploads folder created successfully.'], 201); // 201 Created
        } else {
            return new WP_REST_Response(['success' => false, 'message' => 'Failed to create uploads folder.'], 500); // Internal Server Error
        }
    } else {
        return new WP_REST_Response(['success' => false, 'message' => 'Uploads folder already exists.'], 409); // Conflict
    }
}


function validate_request_origin() {
    $site_url = home_url();

    if (isset($_SERVER['HTTP_REFERER'])) {
        $referrer = $_SERVER['HTTP_REFERER'];

        if (strpos($referrer, $site_url) !== false) {
            return true;  
        } else {
            return new WP_Error('rest_forbidden', 'Invalid request origin.', array('status' => 403));
        }
    }

    return new WP_Error('rest_forbidden', 'No referrer found.', array('status' => 403));
}


function custom_xml_importer_install_and_activate_plugins(WP_REST_Request $request) {
    
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt';

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    $api_url = $request->get_route();
    $plugins = $request->get_param('plugins');
    log_message('API called installed plugins ', $log_file_path, 'info',$api_url);
    if (empty($plugins)) {
        log_message('No plugins specified for installation.', $log_file_path, 'error',$api_url);
        return new WP_REST_Response([
            'success' => false,
            'message' => 'No Plugins Specified'
        ], 400); 
    }

    //create uplaods folder start
    $plugin_dir1 = dirname(__DIR__) . '/'; 
    $uploads_dir = $plugin_dir1 . 'uploads/'; 

    if (!file_exists($uploads_dir)) {
        if (wp_mkdir_p($uploads_dir)) {
         log_message('Uploads folder created successfully', $log_file_path, 'success',$api_url);
           
        } else {
         log_message('Failed to create uploads folder.', $log_file_path, 'error',$api_url);
          
        }
    } else {
        log_message('Uploads folder already exists.', $log_file_path, 'error',$api_url);
       
    }
    //create uplaods folder end
    
    $result = update_site_title_from_custom_table();

    log_message($result, $log_file_path, 'info', $api_url);
    
    $result = install_plugins($plugins);
    if (!$result['success']) {
        log_message('Failed to install plugins: ' . $result['error'], $log_file_path, 'error',$api_url);
        return new WP_REST_Response([
            'success' => false,
            'message' => $result['error']
        ], 500); 
    }

    log_message('Successfully installed plugins: ' . implode(', ', $plugins), $log_file_path, 'success',$api_url);
    return new WP_REST_Response([
        'success' => true,
        'message' => $result['message']
    ], 200); 
}


function custom_xml_importer_install_and_activate_theme(WP_REST_Request $request) {
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt';
     $api_url = $request->get_route();

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $result = install_theme();
    if (!$result['success']) {
        log_message('Failed to install and activate theme: ' . $result['error'], $log_file_path, 'error',$api_url);
        return new WP_REST_Response([
            'success' => false,
            'message' => $result['error']
        ], 500); 
    }

    log_message('Successfully installed and activated the theme.', $log_file_path, 'success',$api_url);
    return new WP_REST_Response([
        'success' => true,
        'message' => $result['message']
    ], 200); 
}

function import_posts_from_url(WP_REST_Request $request) {
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt';
    $api_url = $request->get_route(); // Get the API URL

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $params = $request->get_json_params();
    $file_url = $params['fileurl'] ?? null;
	$deleted = wp_delete_post(1);
    
	if($deleted){
    log_message('Hello World Post Deleted Successfuly!. ', $log_file_path, 'info',$api_url);
    }
    if (!$file_url) {
        log_message('No XML file URL provided for importing posts.', $log_file_path, 'error', $api_url);
        return new WP_REST_Response([
            'success' => false,
            'message' => 'No XML file URL provided'
        ], 400); 
    }

    $import_results = import_posts($file_url);

    if ($import_results) {
        log_message('Successfully imported posts from URL: ' . $file_url, $log_file_path, 'success', $api_url);
        return new WP_REST_Response([
            'success' => true,
            'message' => 'Import results',
            'data' => $import_results
        ], 200); // OK
    } else {
        log_message('Failed to import posts from URL: ' . $file_url, $log_file_path, 'error', $api_url);
        return new WP_REST_Response([
            'success' => false,
            'message' => 'Failed to import posts',
            'data' => $import_results
        ], 500); 
    }
}

function import_header_footer_data(WP_REST_Request $request) {
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt';
    $api_url = $request->get_route();

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $params = $request->get_json_params();
    $file_url = $params['fileurl'] ?? null;

    if (!$file_url) {
        log_message('No XML file URL provided for importing header and footer data.', $log_file_path, 'error', $api_url);
        return new WP_REST_Response([
            'success' => false,
            'message' => 'No XML file URL provided'
        ], 400); 
    }

    $import_results = import_header_footer($file_url);

    if ($import_results['success']) {
        log_message('Header and footer data imported successfully.', $log_file_path, 'success', $api_url);
        return new WP_REST_Response([
            'success' => true,
            'message' => $import_results['message']
        ], 200); 
    } else {
        log_message('Failed to import header and footer data: ' . $import_results['message'], $log_file_path, 'error', $api_url);
        return new WP_REST_Response([
            'success' => false,
            'message' => $import_results['message']
        ], 500); 
    }
}

function import_elementor_kit(WP_REST_Request $request) {
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt';
    $api_url = $request->get_route(); // Get the API URL

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $params = $request->get_json_params();
    $file_url = $params['fileurl'] ?? 'default_value_if_not_set';

    if ($file_url == 'default_value_if_not_set') {
        log_message('No file URL provided for importing Elementor kit.', $log_file_path, 'error', $api_url);
        return new WP_REST_Response([
            'success' => false,
            'message' => 'No file URL provided'
        ], 400); 
    }

    $result = install_elementor_kits($file_url);
    if ($result) {
        log_message('Elementor kit installed successfully from URL: ' . $file_url, $log_file_path, 'success', $api_url);
        return new WP_REST_Response([
            'success' => true,
            'message' => 'Elementor kit installed successfully'
        ], 200); 
    } else {
        log_message('Failed to install Elementor kit from URL: ' . $file_url, $log_file_path, 'error', $api_url);
        return new WP_REST_Response([
            'success' => false,
            'message' => 'Failed to install Elementor kit'
        ], 500); 
    }
}

function import_elementor_settings(WP_REST_Request $request) {
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt'; 
    $api_url = $request->get_route(); // Get the API URL

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $params = $request->get_json_params();
    $file_url = $params['fileurl'] ?? null;

    if (!$file_url) {
        log_message('No file URL provided for importing Elementor settings.', $log_file_path, 'error', $api_url);
        return new WP_REST_Response([
            'success' => false,
            'message' => 'No file URL provided'
        ], 400); 
    }

    $result = install_elementor_kit_settings($file_url);
    if ($result === true) {
        log_message('Elementor settings imported successfully from URL: ' . $file_url, $log_file_path, 'success', $api_url);
        return new WP_REST_Response([
            'success' => true,
            'message' => 'Elementor settings imported successfully.'
        ], 200); 
    } else {
        log_message('Failed to import Elementor settings from URL: ' . $file_url . ' Error: ' . $result, $log_file_path, 'error', $api_url);
        return new WP_REST_Response([
            'success' => false,
            'message' => $result
        ], 500); 
    }
}

function update_form_details(WP_REST_Request $request) {
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt'; 
    $api_url = $request->get_route(); // Get the API URL

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $params = $request->get_json_params();
    $result = save_or_update_form_details($params); 

    if ($result === true) {
        log_message('Form details updated successfully: ' . json_encode($params), $log_file_path, 'success', $api_url);
        return new WP_REST_Response(['success' => true, 'message' => 'Data saved successfully'], 200);
    } else {
        log_message('Failed to update form details: ' . json_encode($params), $log_file_path, 'error', $api_url);
        return new WP_REST_Response(['success' => false, 'message' => 'Failed to save data'], 500);
    }
}

function update_site_title_from_custom_table() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'gw_user_form_details';

    $business_name = $wpdb->get_var( "SELECT businessName FROM $table_name LIMIT 1" );

    // Define the log file path
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt'; 
    $api_url = 'update_site_title_from_custom_table';

    // Check if a businessName was found
    if ( $business_name ) {
        // Update the site title with the businessName value
        update_option('blogname', $business_name);

        // Clear the cached options to ensure the change is immediately reflected
        wp_cache_delete('alloptions', 'options');

        // Log the success message
        log_message('Site title updated successfully to: ' . $business_name, $log_file_path, 'success', $api_url);

        // Optionally return a success message
        return 'Site title updated successfully to: ' . $business_name;
    } else {
        // Log the failure message
        log_message('Failed to update site title. No businessName found in the table.', $log_file_path, 'error', $api_url);

        return 'No businessName found in the table.';
    }
}

function fetch_form_details(WP_REST_Request $request) {
    $plugin_dir = plugin_dir_path(__FILE__);
    $log_dir = $plugin_dir . 'logs';
    $log_file_path = $log_dir . '/plugin-log.txt'; 
    $api_url = $request->get_route(); // Get the API URL

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $fields = $request->get_json_params()['fields'] ?? [];
    $field_list = is_array($fields) ? $fields : explode(',', $fields);

    $result = get_form_details_from_database($field_list);

    if (!empty($result)) {
        log_message('Form details fetched successfully for fields: ' . json_encode($field_list), $log_file_path, 'success', $api_url);
        return new WP_REST_Response($result, 200); 
    } else {
        log_message('No data found for fields: ' . json_encode($field_list), $log_file_path, 'error', $api_url);
        return new WP_REST_Response([
            'success' => false,
            'message' => 'No data found'
        ], 404); 
    }
}


ob_start();

class GW_Website_Builder {
        public function __construct() {
        add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_head', array($this, 'custom_admin_style'));
        add_action('rest_api_init', array($this, 'register_api_endpoints'));
        add_action('after_setup_theme', array($this, 'create_gravity_write_ai_builder_table'));
        add_action('after_setup_theme', array($this, 'alter_gravity_write_ai_builder_table'));
        add_action('admin_menu', array($this, 'gravitywrite_create_admin_menu'));
        add_action('wp_ajax_gravitywrite_disconnect', array($this, 'gravitywrite_disconnect_handler'));

    }


    public function gravitywrite_create_admin_menu() {
        
        // Main Menu: GravityWrite
        add_menu_page(
            'GravityWrite',
            'GravityWrite',
            'manage_options',
            'gw-website-builder',
            array($this, 'settings_page_html'),
            'https://plugin.mywpsite.org/wp-content/uploads/logo/Icon.svg',
            1
        );

        add_submenu_page(
            'gw-website-builder',
            'Build Website',
            'Build Website',
            'manage_options',
            'gw-website-builder',
            array($this, 'settings_page_html')
        );

        add_submenu_page(
            'gw-website-builder',
            'Settings',
            'Settings',
            'manage_options',
            'gravitywrite_settings',
            array($this, 'gravitywrite_settings_page')
        );

        add_submenu_page(
            'gw-website-builder',
            'Active Logs',
            'Active Logs',
            'manage_options',
            'gw-active-logs',
            array($this, 'display_active_logs_function')
        );
    }

    public function display_active_logs_function() {
        $plugin_dir = plugin_dir_path(__FILE__);
        $log_file_path = $plugin_dir . 'logs/plugin-log.txt';

        // Number of logs to display per page
        $logs_per_page = 10;

        // Get the current page number from the query string, defaulting to 1
        $current_page = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;

        echo '<style>
        .active-logs-container {
            font-family: Arial, sans-serif;
            background-color: #ffffff;
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 99%;
            margin: 20px 4px;
        }
        .active-logs-container h1 {
            color: #333;
            font-size: 24px;
            border-bottom: 2px solid #0073aa;
            padding-bottom: 10px;
        }
        .active-logs-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .active-logs-table th, .active-logs-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        .active-logs-table th {
            background-color: #0073aa;
            color: white;
        }
        .active-logs-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .active-logs-table tr:hover {
            background-color: #f1f1f1;
        }
        td.messages_row {
            max-width: 440px;
            word-wrap: break-word;
        }

        /* Pagination Styles */
        .pagination {
            margin: 20px 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .pagination a, .pagination span {
            display: inline-block;
            padding: 8px 12px;
            margin: 0 5px;
            border: 1px solid #0073aa;
            color: #0073aa;
            text-decoration: none;
            border-radius: 4px;
        }
        .pagination a:hover {
            background-color: #0073aa;
            color: #fff;
        }
        .pagination .current {
            background-color: #0073aa;
            color: #fff;
            border-color: #0073aa;
        }
        .pagination .disabled {
            color: #ccc;
            pointer-events: none;
            cursor: not-allowed;
        }
        </style>';

        echo '<div class="active-logs-container">';
        echo '<h1>Activity Logs</h1>';

        if (file_exists($log_file_path)) {
            $log_content = file_get_contents($log_file_path);
            if (!empty($log_content)) {
                $logs = array_filter(explode("\n", trim($log_content))); // Filter out empty lines

                // Get total number of logs
                $total_logs = count($logs);

                // Calculate total number of pages
                $total_pages = ceil($total_logs / $logs_per_page);

                // Determine the starting log index for the current page
                $start = ($current_page - 1) * $logs_per_page;

                // Slice the logs array to get only the logs for the current page
                $logs_to_display = array_slice($logs, $start, $logs_per_page);

                echo '<table class="active-logs-table">';
                echo '<tr><th>Created Date</th><th>Type</th><th>Message</th><th>API URL</th></tr>';

                foreach ($logs_to_display as $log) {
                    if (preg_match('/\[(.*?)\] \[(.*?)\] (.*?) \[API URL: (.*?)\]/', $log, $matches)) {
                        echo '<tr>';
                        echo '<td>' . esc_html($matches[1]) . '</td>'; // Created Date
                        echo '<td>' . esc_html($matches[2]) . '</td>'; // Type
                        echo '<td class="messages_row">' . esc_html($matches[3]) . '</td>'; // Message
                        echo '<td>' . esc_html($matches[4]) . '</td>'; // API URL
                        echo '</tr>';
                    }
                }

                echo '</table>';

                // Use WordPress's paginate_links function to generate pagination links
                $pagination_args = array(
                    'base'    => add_query_arg('paged', '%#%'),
                    'format'  => '',
                    'total'   => $total_pages,
                    'current' => $current_page,
                    'prev_text' => __('&laquo; Previous'),
                    'next_text' => __('Next &raquo;'),
                );

                echo '<div class="pagination">';
                echo paginate_links($pagination_args);
                echo '</div>';

            } else {
                echo '<p>No logs available at the moment.</p>';
            }
        } else {
            echo '<p>Log file not found. Please ensure that logging is enabled and the log file exists.</p>';
        }

        echo '</div>';
    }


    public function settings_page_html() {
        if (!current_user_can('manage_options')) {
            return;
        }
        echo '<div id="root"></div>';
    }

    public function gravitywrite_dashboard_page() {
        ?>
        <div class="gw-wrapper">
            <div class="gw-content">
                <h1>Building a website has never been this easy!</h1>
                <p>Here is how the AI Website Builder works:</p>
                <ol>
                    <li>Create a free account on GravityWrite platform.</li>
                    <li>Describe your dream website in your own words.</li>
                    <li>Watch as AI crafts your WordPress website instantly.</li>
                    <li>Refine the website with an easy drag & drop builder.</li>
                    <li>Launch.</li>
                </ol>
                <a href="#" class="gw-button">Let's Get Started</a>
            </div>
            <div class="gw-illustration">
                <img src="https://plugin.mywpsite.org/wp-content/plugins/new plugin 3 2/dist/aibuilder.svg" alt="AI Builder Illustration">
            </div>
        </div>
            <style>
        .notice {
            display: none;
        }
        #wpwrap {
           
            background-color: #f6f9fc !important;
            
        }
        .gw-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: row;
            height: 80vh;
            /*background-color: #f9fafc;*/
            padding: 20px;
        }
        .gw-content {
            margin-right: 50px;
            text-align: left;
        }
        .gw-content h1 {
            font-size: 32px;
            font-weight: 600;
            color: #333;
        }
        .gw-content p {
            font-size: 18px;
            color: #555;
            margin-bottom: 20px;
        }
        .gw-content ol {
            margin-left: 20px;
            padding-left: 0;
            color: #555;
            font-size: 16px;
        }
        .gw-content ol li {
            margin-bottom: 10px;
        }
        .gw-button {
            display: inline-block;
            /* background-color: #6f4de2; */
            border-radius: 10px;
            border-radius: 10px;
            background: linear-gradient(102deg, #963FFF -16.35%, #2E42FF 97.83%);
            /* background: linear-gradient(106deg, #CC11EA -79.77%, #2E42FF 110.3%); */
            color: #fff;
            padding: 15px 35px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            margin-top: 20px;
        }
        .gw-button:hover {
            background-color: #5a39c7;
        }
        .gw-illustration {
            max-width: 400px;
        }
        .gw-illustration img {
            max-width: 100%;
            height: auto;
        }
    </style>
 
        <?php
    }

    public function gravitywrite_settings_page() {
        // Check the status of gravitywrite_account_key
        $account_status = get_option('gravitywrite_account_key');
       // echo "Check Account Status " . $account_status;
        $logged = ($account_status === 'connected');
        
        $current_page_url = esc_url(add_query_arg([], admin_url($GLOBALS['pagenow']) . '?' . $_SERVER['QUERY_STRING']));
    
        if ($logged) {
            $this->fetch_gravitywrite_data();
            
            
            ?>
                <script type="text/javascript">

                const customConfirmHtml = `
                    <div id="customConfirm" style="display: none;">
                        <div id="confirmBox">
                            <p>Are you sure you want to disconnect?</p>
                            <button id="confirmYes">Yes</button>
                            <button id="confirmNo">No</button>
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', customConfirmHtml);
                
                // CSS styling for the popup (insert this into your CSS or <style> block)
                const customConfirmStyle = `
                    #customConfirm {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 10000;
                    }
                    #confirmBox {
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        text-align: center;
                        width: 300px;
                    }
                    #confirmBox p {
                        margin-bottom: 20px;
                        font-size: 16px;
                        color: #333;
                    }
                    #confirmBox button {
                        margin: 5px;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 4px;
                        font-size: 14px;
                        cursor: pointer;
                    }
                    #confirmYes {
                        background-color: #d9534f;
                        color: white;
                    }
                    #confirmNo {
                        background-color: #5bc0de;
                        color: white;
                    }
                `;
                const styleSheet = document.createElement("style");
                styleSheet.type = "text/css";
                styleSheet.innerText = customConfirmStyle;
                document.head.appendChild(styleSheet);
                
                // JavaScript code to handle the custom confirmation and disconnect action
                document.getElementById('gravitywrite-disconnect').addEventListener('click', function(e) {
                    e.preventDefault();
                
                    // Show the custom confirmation popup
                    const customConfirm = document.getElementById('customConfirm');
                    customConfirm.style.display = 'flex';
                
                    // Add event listeners for the Yes and No buttons
                    document.getElementById('confirmYes').addEventListener('click', function() {
                        customConfirm.style.display = 'none'; // Hide the popup
                
                        // Display loading message
                        const loadingMessage = document.createElement('div');
                        loadingMessage.innerText = "Disconnecting...";
                        Object.assign(loadingMessage.style, {
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            padding: '20px',
                            backgroundColor: '#333',
                            color: '#fff',
                            borderRadius: '8px',
                            zIndex: '9999',
                            fontSize: '18px',
                            textAlign: 'center'
                        });
                        document.body.appendChild(loadingMessage);
                
                        // Trigger the disconnect request asynchronously in the background
                        jQuery.post(ajaxurl, { action: 'gravitywrite_disconnect' })
                            .done(function(response) {
                                if (response.success) {
                                    const baseUrl = window.location.origin;
                                    const redirectUrl = `${baseUrl}/wp-admin/admin.php?page=gravitywrite_settings`;
                                    window.location.href = redirectUrl;
                                    //alert(response.data.message);
                                } else {
                                    alert(response.data.message);
                                }
                            })
                            .fail(function() {
                                 const baseUrl = window.location.origin;
                                 const redirectUrl = `${baseUrl}/wp-admin/admin.php?page=gravitywrite_settings`;
                                    window.location.href = redirectUrl;
                               let errorMessage = jqXHR.responseJSON?.data?.message || jqXHR.responseText || "Unknown error occurred.";
                               //alert("Error: " + errorMessage);

                            })
                            .always(function() {
                                // Clean up loading message
                                if (document.body.contains(loadingMessage)) {
                                    document.body.removeChild(loadingMessage);
                                }
                            });
                    });
                
                    document.getElementById('confirmNo').addEventListener('click', function() {
                        customConfirm.style.display = 'none'; // Hide the popup
                    });
                });



                </script>

            <?php
        } else { 
            if (!is_admin() || 'gravitywrite_settings' !== ($_GET['page'] ?? '')) {
                return;
            }
        
            $email = $_GET['email'] ?? '';
            $token = $_GET['wp_token'] ?? '';
        
            $email = sanitize_email($email);
            $token = sanitize_text_field($token);
        
            if (isset($email) || isset($token)) {
                add_action('admin_notices', function() {
                    echo '<div class="notice notice-error"><p>Please check your Login Email and token.</p></div>';
                });
               
            }
        
        ?>
            <div class="wrap">
                <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">GravityWrite: Settings</h1>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
                    <h2 style="font-size: 18px; font-weight: 500;">
                        <img src="https://plugin.mywpsite.org/wp-content/uploads/logo/Icon-blue.svg" alt="GravityWrite Icon" style="width: 25px; height: 25px; vertical-align: middle; margin-right: 8px;">
                        Optimize with GravityWrite
                    </h2>
                    <p style="font-size: 16px; color: #555; max-width: 1100px;">
                        Boost your SEO game with our seamless content transfer between GravityWrite Content Editor and WordPress. Refine and perfect your articles effortlessly, ensuring your SEO strategy is never left to luck. Create content that ranks with GravityWrite in WordPress today!
                    </p>

                    <a href="https://app.gravitywrite.com/login?callback_url=<?php echo ($current_page_url); ?>&domain=wordpress" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #2E42FF; color: white; text-decoration: none; border-radius: 5px;">
                        Log in and integrate with GravityWrite
                    </a>
                </div>
                <p style="margin-top: 20px; font-size: 14px; color: #555;">
                    In case of questions or troubles, please check our 
                    <a href="https://gravitywrite.com/ai-website-builder" target="_blank" style="color: #2E42FF;">documentation</a> or contact our 
                    <a href="https://support.gravitywrite.com/en" target="_blank" style="color: #2E42FF;">support team</a>.
                </p>
            </div>
            <style>
                /*.notice {*/
                /*    display: none;*/
                /*}*/
                #wpwrap {
                    background-color: #f6f9fc !important;
                }
            </style>
        <?php }
    }

    

    function gravitywrite_disconnect_handler() {
        $updated = update_option('gravitywrite_account_key', 'disconnected');
    
        if ($updated !== false) {
            $email = get_option('api_user_email', true);
            $token = get_option('api_user_token', true);
            $fe_token = get_option('api_user_fe_token', true);
    
            if (empty($token)) {
                return;
            }
    
            $api_url = 'https://api.gravitywrite.com/api/connect-status';
            $current_domain = home_url();
    
            $response = wp_remote_post($api_url, [
                'method'    => 'POST',
                'headers'   => [
                    'Content-Type'  => 'application/x-www-form-urlencoded',
                    'Authorization' => 'Bearer ' . $token,
                ],
                'body'      => http_build_query([
                    'status' => 0,
                    'domain' => $current_domain,
                ]),
            ]);
    
            if (is_wp_error($response)) {
                $error_message = $response->get_error_message();
                wp_send_json_error(['message' => 'Failed to connect to API: ' . $error_message . '. Token: ' . $token], 500);
            }
    
            $response_body = wp_remote_retrieve_body($response);
            $data = json_decode($response_body, true);
    
            if (isset($data['wp_status']) && $data['wp_status'] === 'Disconnected') {
                // Update options and clean up
                update_option('gravitywrite_account_key', 'disconnected');
                update_option('api_user_email', '');
                update_option('api_user_token', '');
                update_option('api_user_fe_token', '');
    
                // Truncate the table
                global $wpdb;
                $table_name = $wpdb->prefix . 'gw_user_plan_details'; 
                $wpdb->query("TRUNCATE TABLE {$table_name}");
    
                wp_send_json_success(['message' => 'Successfully disconnected from GravityWrite And Truncate table User Plan Details']);
            } else {
                wp_send_json_error([
                    'message' => 'Failed to disconnect. API response did not indicate disconnection.',
                    'response_data' => json_encode($data)
                ], 500);
            }
        } else {
            wp_send_json_error(['message' => 'Failed to update account status. Please try again.'], 500);
        }
    }


    public function fetch_gravitywrite_data() {
        $api_url = 'https://api.gravitywrite.com/api/get-user-details';
        $bearer_token = get_option('api_user_token', true);
    
        if (empty($bearer_token)) {
            echo 'No token found. Please log in again.';
        }
    
        $args = [
            'headers' => [
                'Authorization' => 'Bearer ' . $bearer_token,
            ],
        ];
    
        $response = wp_remote_get($api_url, $args);
    
        if (is_wp_error($response)) {
            echo 'Error fetching data: ' . $response->get_error_message();
        }
    
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
    
        if (empty($data)) {
            return 'No user data found';
        }
    
        $current_page_url = esc_url(add_query_arg([], admin_url($GLOBALS['pagenow']) . '?' . $_SERVER['QUERY_STRING']));
        // Check for specific error message related to expired token
        if (isset($data['error']) && $data['error'] === 'Unauthorized' && isset($data['message']) && $data['message'] === 'Invalid or expired wp_token') {
            // Token is expired or invalid, return a message
           add_action('admin_notices', function() {
                echo '<div class="notice notice-error"><p>Your session has expired. Please log in again.</p></div>';
            });
            //echo 'Your session has expired. Please log in again.';
            ?>
            
            <div class="wrap">
                <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">GravityWrite: Settings</h1>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
                    <h2 style="font-size: 18px; font-weight: 500;">
                        <img src="https://plugin.mywpsite.org/wp-content/uploads/logo/Icon-blue.svg" alt="GravityWrite Icon" style="width: 25px; height: 25px; vertical-align: middle; margin-right: 8px;">
                        Optimize with GravityWrite
                    </h2>
                    <p style="font-size: 16px; color: #555; max-width: 1100px;">
                        Boost your SEO game with our seamless content transfer between GravityWrite Content Editor and WordPress. Refine and perfect your articles effortlessly, ensuring your SEO strategy is never left to luck. Create content that ranks with GravityWrite in WordPress today!
                    </p>

                    <a href="https://app.gravitywrite.com/login?callback_url=<?php echo ($current_page_url); ?>&domain=wordpress" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #2E42FF; color: white; text-decoration: none; border-radius: 5px;">
                        Log in and integrate with GravityWrite
                    </a>
                </div>
                <p style="margin-top: 20px; font-size: 14px; color: #555;">
                    In case of questions or troubles, please check our 
                    <a href="#" style="color: #2E42FF;">documentation</a> or contact our 
                    <a href="#" style="color: #2E42FF;">support team</a>.
                </p>
            </div>
            <?php
            return;
        }

        
        $active_status = $data['wp_status'] ? '1' : '0';
        if($active_status == '1'){
            $active_status = "Connected";
        }else{
            $active_status = "Disconnected";
        }
        $display_data = [
            'account_status' => $active_status,
            'user_name' => $data['user_email'],
            'plan_name' => $data['user_name'],
            'current_plan' => $data['plan_name'],
            'period' => ucfirst($data['period']),
            'reset_date' => $data['reset_date'],
            'ai_websites_used' => $data['ai_websites_used'],
            'ai_websites_total' => $data['ai_websites_total'],
            'words_used' => $data['words_used'],
            'words_total' => $data['words_total'],
            'images_used' => $data['images_used'],
            'images_total' => $data['images_total'],
        ];


        ?>
        <div class="wrap" style="margin: 20px auto; font-family: Arial, sans-serif;">
            <!-- Main Container -->
            <div style="padding: 20px; border-radius: 12px;">
                <h1 style="font-size: 24px; font-weight: 600; color: #0A2540; margin-bottom: 20px;">GravityWrite: Settings</h1>
    
                <!-- Account Status Section -->
                <div style="padding: 20px; background-color: #fff; border-radius: 12px; margin-bottom: 20px; line-height: 2.0; box-shadow: 0 1px 3px rgba(0,0,0,.1); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <p style="font-size: 18px; margin: 0;">
                            <strong>Account Status:</strong> <span style="color: #00B13C;">● <?php echo esc_html($display_data['account_status']); ?></span>
                        </p>
                        <p style="font-size: 18px; margin: 0;">
                            <strong>User Name: </strong> <span><?php echo esc_html($display_data['user_name']); ?></span>
                            <a href="#" id="gravitywrite-disconnect" style="color: red; margin-left: 10px;">Disconnect</a>
                        </p>
                    </div>
                
                    <!-- View GravityWrite Button (positioned to the right) -->
                    <div class="view-gw-button">
                        <?php 
                        $token = get_option('api_user_fe_token');
                        
                        // Get everything after the '|' in the token
                        $token_parts = explode('|', $token);
						$cleaned_token = isset($token_parts[1]) && !empty($token_parts[1]) ? $token_parts[1] : $token;
						//echo $cleaned_token;

                        ?>
                        <a href="https://app.gravitywrite.com/dashboard?impersonateToken=<?php echo $cleaned_token; ?>" 
                           target="_blank" 
                           style="line-height: 22px; font-size: 16px; font-weight: 500 !important; padding: 12px 35px; background-color: #2e4eff; color: #fff; text-decoration: none; border-radius: 7px;">
                           View GravityWrite
                        </a>
                    </div>

                </div>

    
                <!-- Plan Information -->
                <div style="padding: 20px; background-color: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.1);">
                    <div style="display: flex;justify-content: space-between;align-items: center;margin-top: 15px;margin-bottom: 5px;border-bottom: 2px solid #8080803d;">
                        <h2 style="font-size: 22px; font-weight: 600;"><?php echo esc_html($display_data['plan_name']); ?> 
                            <span style="color: #fff; font-size: 12px; background-color: #00B13C; margin-left: 10px; padding: 4px; border-radius: 5px;">
                                <?php echo ucfirst(strtolower($data['account_status'])); ?>
                            </span>
                        </h2>
                        <div class="plan-block">
                            <div id="plan">
                                <p>Current Plan </p><p><strong><?php echo esc_html($display_data['current_plan']); ?></strong></p>
                            </div>
                            <div id="period">
                                 <p>Period </p><p><strong><?php echo esc_html($display_data['period']); ?></strong></p>
                            </div>
                        </div>
                        <a href="https://gravitywrite.com/pricing" target="_blank" style="line-height: 22px;font-size: 16px;font-weight: 500 !important;padding: 12px 35px;background-color: #2e4eff;color: #fff;text-decoration: none;border-radius: 7px;">
                            <img src="https://plugin.mywpsite.org/wp-content/uploads/logo/Vector.svg" alt="Upgrade Icon" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
                            Upgrade
                        </a>
                    </div>
    
                    <div style="margin-top: 20px;">
                        <div class="credit-block" style="display: flex; justify-content: space-between;">
                            <p class="credit-title">Plan Credit</p>
                            <p>Reset will happen on <strong style="color: #2e4eff; margin: 0px 10px;"><?php echo esc_html($display_data['reset_date']); ?></strong></p>
                        </div>
    
                        <!-- Credit Bars -->
                        <div style="margin-bottom: 20px;font-size: medium;">
                            <span>AI Website Generated</span>
                            <span class="right-text">
                                <span class="used"><?php echo esc_html($display_data['ai_websites_used']); ?></span> used of <?php echo esc_html($display_data['ai_websites_total']); ?> AI Website
                            </span>
                            <div style="background-color: #f0f0f0; border-radius: 5px; height: 8px; width: 100%; margin-top: 10px;">
                                <?php 
                                $websites_used_percent = ($display_data['ai_websites_used'] / $display_data['ai_websites_total']) * 100;
                                $websites_used_percent = $websites_used_percent > 100 ? 100 : $websites_used_percent; // Cap the percentage at 100%
                                ?>
                                <div style="background: linear-gradient(110deg, #963FFF -4.83%, #2E42FF 91.64%); width: <?php echo $websites_used_percent; ?>%; height: 8px; border-radius: 5px;"></div>
                            </div>
                        </div>

                        <div style="margin-bottom: 20px;font-size: medium;">
                            <span>Words Usage</span>
                            <span class="right-text">
                            <span class="used"><?php echo esc_html($display_data['words_used']); ?></span> used of <?php echo esc_html($display_data['words_total']); ?> Words
                            </span>
                            <div style="background-color: #f0f0f0; border-radius: 5px; height: 8px; width: 100%; margin-top: 10px;">
                                <?php 
                                $percent_used = ($display_data['words_used'] / $display_data['words_total']) * 100;
                                $percent_used = $percent_used > 100 ? 100 : $percent_used; // Cap the percentage at 100%
                                ?>
                                <div style="background: linear-gradient(110deg, #963FFF -4.83%, #2E42FF 91.64%); width: <?php echo $percent_used; ?>%; height: 8px; border-radius: 5px;"></div>
                            </div>
                        </div>

    
                        <div style="margin-bottom: 20px;font-size: medium;">
                            <span>Image Usage</span>
                            <span class="right-text">
                                <span class="used"><?php echo esc_html($display_data['images_used']); ?></span> used of <?php echo esc_html($display_data['images_total']); ?> Images
                            </span>
                            <div style="background-color: #f0f0f0; border-radius: 5px; height: 8px; width: 100%; margin-top: 10px;">
                                <?php 
                                $images_used_percent = ($display_data['images_used'] / $display_data['images_total']) * 100;
                                $images_used_percent = $images_used_percent > 100 ? 100 : $images_used_percent; // Cap the percentage at 100%
                                ?>
                                <div style="background: linear-gradient(110deg, #963FFF -4.83%, #2E42FF 91.64%); width: <?php echo $images_used_percent; ?>%; height: 8px; border-radius: 5px;"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    
        <style>
            b, strong {
                font-weight: 500 !important;
            }
            span.used {
                font-weight: bold;
            }
            #wpwrap {
                background-color: #f6f9fc !important;
            }
            span.right-text {
                float: right;
                font-size: small;
            }
            .plan-section p {
                margin: 6px;
            }
            .plan-block strong {
                font-size: large;
                font-weight: 600;
            }
            .plan-block {
                display: flex;
                flex-direction: row;
                margin-left: 30%;
            }
            .plan-block p {
                margin: 7px 10px;
            }
            .wp-die-message, p {
                line-height: unset !important;
            }
            .credit-block p {
                font-size: medium;
                display: flex;
                flex-direction: row;
                align-content: space-between;
                text-align: center;
                margin: 8px;
                padding: unset;
            }
            .credit-block {
                display: flex;
                border: 1px solid #80808033;
                justify-content: space-between;
                height: 35px;
                margin: 22px 0px;
                background-color: aliceblue;
                border-radius: 10px;
                padding: 10px;
                line-height: unset;
            }
            p.credit-title {
                color: #2b3de2;
                font-size: 20px;
                text-align: center;
                margin-top: 10px;
            }
        </style>
        <?php
    }

    public function fetch_gravitywrite_data_old() {
    	$api_url = site_url('/wp-json/gravitywrite/v1/account-status');
    
        // $api_url = 'https://plugin.mywpsite.org/wp-json/gravitywrite/v1/account-status';
        $response = wp_remote_get($api_url);
    
        if (is_wp_error($response)) {
            // Handle error
            return 'Error fetching data';
        }
    
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
    
        if (empty($data)) {
            return 'No data found';
        }
    
        ?>
        <div class="wrap" style="margin: 20px auto; font-family: Arial, sans-serif;">
            <!-- Main Container -->
            <div style="padding: 20px; border-radius: 12px;">
                <h1 style="font-size: 24px; font-weight: 600; color: #0A2540; margin-bottom: 20px;">GravityWrite: Settings</h1>
    
                <!-- Account Status Section -->
                <div style="padding: 20px;background-color: #fff;border-radius: 12px;margin-bottom: 20px;line-height: 2.0;box-shadow: 0 1px 3px rgba(0,0,0,.1);">
    
                    <p style="font-size: 18px; margin: 0;">
                        <strong>Account Status:</strong> <span style="color: #00B13C;">● <?php echo esc_html($data['account_status']); ?></span>
                    </p>
                    <p style="font-size: 18px; margin: 0;">
                        <strong>User Name: </strong> <span><?php echo esc_html($data['user_name']); ?></span>
                        <a href="#" id="gravitywrite-disconnect" style="color: red; margin-left: 10px;">Disconnect</a>
    
                    </p>
                </div>
    
                <!-- Plan Information -->
                <div style="padding: 20px; background-color: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.1);">
                    
    
                   <div style="display: flex;justify-content: space-between;align-items: center;margin-top: 15px;margin-bottom: 5px;border-bottom: 2px solid #8080803d;">
                        <h2 style="font-size: 22px; font-weight: 600;"><?php echo esc_html($data['plan_name']); ?> 
                            <span style="color: #fff; font-size: 12px; background-color: 00B13C; margin-left: 10px; padding: 4px; border-radius: 5px;">
                                <?php echo ucfirst(strtolower($data['account_status'])); ?>
                            </span>
                        </h2>
                        <div class="plan-block">
                            <div id="plan">
                                <p>Current Plan </p><p><strong><?php echo esc_html($data['current_plan']); ?></strong></p>
                            </div>
                            
                            <div id="period">
                                 <p>Period </p><p><strong><?php echo esc_html($data['period']); ?></strong></p>
                            </div>
    
                           
                        </div>
                   <a href="#" style="line-height: 22px;font-size: 16px;font-weight: 500 !important;padding: 12px 35px;background-color: #2e4eff;color: #fff;text-decoration: none;border-radius: 7px;">
                        <img src="https://plugin.mywpsite.org/wp-content/uploads/logo/Vector.svg" alt="Upgrade Icon" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
                        Upgrade
                    </a>
    
                    </div>
    
                    <div style="margin-top: 20px;">
                        <div class="credit-block" style="display: flex;
        justify-content: space-between;">
    
                            <p class="credit-title">Plan Credit</p>
                            <p>Reset will happen on <strong style="color: #2e4eff;margin: 0px 10px;"><?php echo esc_html($data['reset_date']); ?></strong></p>
                        </div>
                        <!-- Credit Bars -->
                        <div style="margin-bottom: 20px;font-size: medium;">
                            <span>AI Website Generated</span>
                            <span class="right-text"><span class="used"><?php echo esc_html($data['ai_websites_used']); ?></span> used of <?php echo esc_html($data['ai_websites_total']); ?> AI Website</span>
                            <div style="background-color: #f0f0f0; border-radius: 5px; height: 8px; width: 100%; margin-top: 10px;">
                                
                    
                                <div style="background: linear-gradient(110deg, #963FFF -4.83%, #2E42FF 91.64%); width: <?php echo (esc_html($data['ai_websites_used']) / esc_html($data['ai_websites_total'])) * 100; ?>%; height: 8px; border-radius: 5px;"></div>
                            </div>
                            
                        </div>
    
                        <div style="margin-bottom: 20px;font-size: medium;">        <span>Words Usage</span>
                             <span class="right-text"><span class="used"><?php echo esc_html($data['words_used']); ?></span> used of <?php echo esc_html($data['words_total']); ?> Words</span>
                            <div style="background-color: #f0f0f0; border-radius: 5px; height: 8px; width: 100%; margin-top: 10px;">
                                <div style="background: linear-gradient(110deg, #963FFF -4.83%, #2E42FF 91.64%); width: <?php echo (esc_html($data['words_used']) / esc_html($data['words_total'])) * 100; ?>%; height: 8px; border-radius: 5px;"></div>
                            </div>
                           
                        </div>
    
                        <div style="margin-bottom: 20px;font-size: medium;">
                            <span>Image Usage</span>
                              <span class="right-text"><span class="used"><?php echo esc_html($data['images_used']); ?></span> used of <?php echo esc_html($data['images_total']); ?> Images</span>
                            <div style="background-color: #f0f0f0; border-radius: 5px; height: 8px; width: 100%; margin-top: 10px;">
                                <div style="background: linear-gradient(110deg, #963FFF -4.83%, #2E42FF 91.64%); width: <?php echo (esc_html($data['images_used']) / esc_html($data['images_total'])) * 100; ?>%; height: 8px; border-radius: 5px;"></div>
                            </div>
                          
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            b, strong {
                font-weight: 500 !important;
            }
            span.used {
                font-weight: bold;
            }
            #wpwrap {
               
                background-color: #f6f9fc !important;
                
            }
            span.right-text {
                float: right;
                font-size: small;
            }
            .plan-section p {
                margin: 6px;
            }
            .plan-block strong {
                font-size: large;
                font-weight: 600;
            }
            .plan-block {
                display: flex;
                flex-direction: row;
                margin-left: 30%;
            }
            .plan-block p{
                margin: 7px 10px;
            }
            .wp-die-message, p{
              line-height: unset !important;
            }
            .credit-block p {
                font-size: medium;
                display: flex;
                flex-direction: row;
                align-content: space-between;
                text-align: center;
                margin: 8px;
                padding: unset;
            }
            
            .credit-block {
                /* width: 100%; */
                display: flex;
                border: 1px solid #80808033;
                justify-content: space-between;
                height: 35px;
                margin: 22px 0px;
                background-color: aliceblue;
                border-radius: 10px;
                padding: 10px;
                line-height: unset;
            }
            
            p.credit-title {
                color: #2b3de2;
                font-size: 20px;
                text-align: center;
                margin-top: 10px;
            }
            
        </style>
     
        <?php
    }



//end include admin settings
  

    public function enqueue_scripts($hook) {
        // Only add scripts on the specific admin page for your plugin
        if ('toplevel_page_gw-website-builder' !== $hook) {
            return;
        }
    //     // Deregister WordPress admin styles
        wp_deregister_style('wp-admin');
        wp_deregister_style('common');
        wp_deregister_style('forms');
        wp_deregister_style('dashboard');
        wp_deregister_style('admin-menu');
        wp_deregister_style('admin-bar');
        wp_deregister_style('nav-menus');
        wp_deregister_style('widgets');
        wp_deregister_style('l10n');



        // Define the paths to the expected JS and CSS files
        $script_path = plugin_dir_path(__FILE__) . 'dist/mainfile.js';
        $style_path = plugin_dir_path(__FILE__) . 'dist/mainfile.css';
    
        // Check if the JS file exists
        if (file_exists($script_path)) {
            wp_enqueue_script('gw-website-builder-js', plugins_url('dist/mainfile.js', __FILE__), array(), null, true);
        } else {
            error_log("Script file not found: " . $script_path);
        }
    
        // Check if the CSS file exists
        if (file_exists($style_path)) {
            wp_enqueue_style('gw-website-builder-css', plugins_url('dist/mainfile.css', __FILE__), array(), null);
        } else {
            error_log("Style file not found: " . $style_path);
            echo"script pathi is:,$script_path";
        }
    
        // Localize script to pass data from PHP to JavaScript
        wp_localize_script('gw-website-builder-js', 'viteReactPluginData', array(
            'api_url' => esc_url_raw(rest_url('custom/v1')),
            'nonce' => wp_create_nonce('wp_rest'),
        ));
    }
    

    public function custom_admin_style() {
        // Only apply custom styles on the specific admin page for your plugin
        global $pagenow;
        if ($pagenow == 'admin.php' && isset($_GET['page']) && $_GET['page'] == 'gw-website-builder') {
            echo '<style>
                #wpwrap { position: absolute; width: 100%; }
                #adminmenu, #wpadminbar, #adminmenuback, #adminmenuwrap, #wpfooter , #metform-unsupported-metform-pro-version , #adminmenumain { display: none; }
                .wrap { margin: 0; }
                html.wp-toolbar { padding: 0 !important; }
                #update-nag, .update-nag, .notice, .e-notice, .dci-global-header { display: none !important; }
                #wpcontent, #wpbody-content { margin: 0 !important; padding: 0 !important; }
                
            </style>';
        }
    }

    private function get_asset_path($type) {
        $script_dir = plugin_dir_path(__FILE__) . 'dist/assets';
        $script_files = scandir($script_dir);
        $asset_path = '';

        foreach ($script_files as $file) {
            if ($type === 'js' && preg_match('/\.js$/', $file)) {
                $asset_path = plugins_url('/dist/assets/' . $file, __FILE__);
                break;
            } elseif ($type === 'css' && preg_match('/\.css$/', $file)) {
                $asset_path = plugins_url('/dist/assets/' . $file, __FILE__);
                break;
            }
        }

        return $asset_path;
    }

    function upload_custom_logo(WP_REST_Request $request) {
        $plugin_dir = plugin_dir_path(__FILE__);
        $log_dir = $plugin_dir . 'logs';
        $log_file_path = $log_dir . '/plugin-log.txt';
        $api_url = $request->get_route();

    
        // Create logs directory if it doesn't exist
        if (!file_exists($log_dir)) {
            mkdir($log_dir, 0755, true);
        }
    
        // Log the API URL

        // Required media functions
        require_once(ABSPATH . 'wp-admin/includes/media.php');
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');
    
        // Check if image file is provided
        if (empty($_FILES) || !isset($_FILES['image'])) {
            log_message('No image file specified', $log_file_path, 'error',$api_url);
            return new WP_Error('no_image', "No image file specified", array('status' => 400));
        }
    
        // Upload the file using WordPress media handler
        $file_handler = 'image';
        $attachment_id = media_handle_upload($file_handler, 0);
    
        // Check if there was an error in uploading the file
        if (is_wp_error($attachment_id)) {
            log_message('Upload error: ' . $attachment_id->get_error_message(), $log_file_path, 'error',$api_url);
            return $attachment_id;
        }
    
        // Retrieve the uploaded image URL
        $image_url = wp_get_attachment_url($attachment_id);
    
        if (!$image_url) {
            log_message('Upload successful but could not retrieve image URL.', $log_file_path, 'error',$api_url);
            return new WP_Error('upload_failed', 'Upload successful but could not retrieve image URL.', array('status' => 404));
        }
    
        // Log success message
        log_message('Image uploaded successfully: ID = ' . $attachment_id . ', URL = ' . $image_url, $log_file_path, 'success',$api_url);
    
        // Return success response with image ID and URL
        return new WP_REST_Response(array(
            'id'  => $attachment_id,
            'url' => $image_url,
        ), 200);
    }



    public function register_api_endpoints() {
        register_rest_route('gravitywrite/v1', '/account-status', array(
            'methods' => 'GET',
            'callback' => array($this, 'gravitywrite_account_status'), // Updated to use a class method callback
            'permission_callback' => '__return_true', // Ensure the endpoint is publicly accessible
        ));

        // Register the content endpoint
        register_rest_route('custom/v1', '/store-content', array(
            'methods' => array('POST', 'GET', 'PUT'),
            'callback' => array($this, 'handle_content_post_request'),
            'permission_callback' => '__return_true',
        ));

        // Register the category endpoint
        register_rest_route('custom/v1', '/store-category', array(
            'methods' => array('POST', 'GET', 'PUT'),
            'callback' => array($this, 'handle_category_post_request'),
            'permission_callback' => '__return_true',
        ));

        // Register the name endpoint
        register_rest_route('custom/v1', '/store-name', array(
            'methods' => array('POST', 'GET', 'PUT'),
            'callback' => array($this, 'handle_name_post_request'),
            'permission_callback' => '__return_true',
        ));

        // Register the description1 endpoint
        register_rest_route('custom/v1', '/store-description1', array(
            'methods' => array('POST', 'GET', 'PUT'),
            'callback' => array($this, 'handle_description1_post_request'),
            'permission_callback' => '__return_true',
        ));

        // Register the description2 endpoint
        register_rest_route('custom/v1', '/store-description2', array(
            'methods' => array('POST', 'GET', 'PUT'),
            'callback' => array($this, 'handle_description2_post_request'),
            'permission_callback' => '__return_true',
        ));

        // Register the image URL endpoint
        register_rest_route('custom/v1', '/store-image-url', array(
            'methods' => array('POST', 'GET', 'PUT'),
            'callback' => array($this, 'handle_image_url_post_request'),
            'permission_callback' => '__return_true',
        ));

        // Register the contact info endpoint
        register_rest_route('custom/v1', '/store-contact-info', array(
            'methods' => array('POST', 'GET', 'PUT'),
            'callback' => array($this, 'handle_contact_info_post_request'),
            'permission_callback' => '__return_true',
        ));

        // Register the template name endpoint
        register_rest_route('custom/v1', '/store-template', array(
            'methods' => array('POST', 'GET', 'PUT'),
            'callback' => array($this, 'handle_template_request'),
            'permission_callback' => '__return_true',
        ));

        // Register the design details endpoint
        register_rest_route('custom/v1', '/store-design', array(
            'methods' => array('POST', 'GET', 'PUT'),
            'callback' => array($this, 'handle_design_request'),
            'permission_callback' => '__return_true',
        ));

        // Register the update status endpoint
        register_rest_route('custom/v1', '/update-status', array(
            'methods' => 'POST',
            'callback' => array($this, 'handle_update_status_request'),
            'permission_callback' => '__return_true',
        ));

        // Register the upload logo endpoint
        register_rest_route('custom/v1', '/upload-logo', array(
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => array($this, 'upload_custom_logo'),
            'permission_callback' => '__return_true',
        ));

        // Register the attempt endpoint
        register_rest_route('custom/v1', '/attempt', array(
            'methods' => array('POST', 'GET'),
            'callback' => array($this, 'handle_attempt_request'),
            'permission_callback' => '__return_true',
        ));
    }

    public function handle_content_post_request(WP_REST_Request $request) {
        $data = $request->get_json_params();
        return $this->handle_post_get_update_request($request, 'gravity_write_ai_builder', $data, array('pages', 'style', 'template'));
    }

    public function handle_category_post_request(WP_REST_Request $request) {
        $data = $request->get_json_params();
        return $this->handle_post_get_update_request($request, 'gravity_write_ai_builder', $data, array('category'));
    }

    public function handle_name_post_request(WP_REST_Request $request) {
        $data = $request->get_json_params();
        return $this->handle_post_get_update_request($request, 'gravity_write_ai_builder', $data, array('name'));
    }

    public function handle_description1_post_request(WP_REST_Request $request) {
        $data = $request->get_json_params();
        return $this->handle_post_get_update_request($request, 'gravity_write_ai_builder', $data, array('description1'));
    }

    public function handle_description2_post_request(WP_REST_Request $request) {
        $data = $request->get_json_params();
        return $this->handle_post_get_update_request($request, 'gravity_write_ai_builder', $data, array('description2'));
    }

    public function handle_image_url_post_request(WP_REST_Request $request) {
        $data = $request->get_json_params();
        return $this->handle_post_get_update_request($request, 'gravity_write_ai_builder', $data, array('image_url'));
    }

    public function handle_contact_info_post_request(WP_REST_Request $request) {
        $data = $request->get_json_params();
        return $this->handle_post_get_update_request($request, 'gravity_write_ai_builder', $data, array('email', 'phone_number', 'address'));
    }

    public function handle_template_request(WP_REST_Request $request) {
        $data = $request->get_json_params();
        return $this->handle_post_get_update_request($request, 'gravity_write_ai_builder', $data, array('template_name'));
    }

    public function handle_design_request(WP_REST_Request $request) {
        $data = $request->get_json_params();
        return $this->handle_post_get_update_request($request, 'gravity_write_ai_builder', $data, array('primary_color', 'secondary_color', 'primary_font', 'secondary_font'));
    }
    
    public function gravitywrite_account_status() {
        $response = array(
            'account_status' => 'Connected',
            'user_name' => 'nandhini@gmail.com',
            'plan_name' => 'Nandhini WL',
            'plan_status' => 'Active',
            'current_plan' => 'Enterprise',
            'period' => 'Monthly',
            'reset_date' => '04 Jun 2024',
            'ai_websites_used' => 7,
            'ai_websites_total' => 15,
            'words_used' => 1000,
            'words_total' => 2000,
            'images_used' => 35,
            'images_total' => 120,
        );

        return rest_ensure_response($response);
    }


    public function handle_update_status_request(WP_REST_Request $request) {
        $plugin_dir = plugin_dir_path(__FILE__);
        $log_dir = $plugin_dir . 'logs';
        $log_file_path = $log_dir . '/plugin-log.txt';
    
        if (!file_exists($log_dir)) {
            mkdir($log_dir, 0755, true);
        }
    
        // Capture the API URL
        $api_url = $request->get_route();
    
        $attempt_id = $request->get_param('attempt_id');
        $status = $request->get_param('status');
    
        if (empty($attempt_id) || !isset($status)) {
            log_message("Attempt ID and status are required.", $log_file_path, 'error', $api_url);
            return new WP_Error('rest_invalid', __('Attempt ID and status are required.'), array('status' => 400));
        }
    
        global $wpdb;
        $table_name = $wpdb->prefix . 'gravity_write_ai_builder';
    
        // Fetch the existing record for the given attempt_id
        $existing_record = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE attempt_id = %s", sanitize_text_field($attempt_id)));
    
        if (!$existing_record) {
            log_message("No record found for attempt ID: $attempt_id", $log_file_path, 'error', $api_url);
            return new WP_Error('rest_not_found', __('No record found for the provided attempt ID.'), array('status' => 404));
        }
    
        // Update the status in the database
        $result = $wpdb->update(
            $table_name,
            array('status' => sanitize_text_field($status)),
            array('attempt_id' => sanitize_text_field($attempt_id))
        );
    
        if ($result === false) {
            log_message("Failed to update status in the database for attempt ID: $attempt_id", $log_file_path, 'error', $api_url);
            return new WP_Error('rest_db_update_failed', __('Failed to update status in the database.'), array('status' => 500));
        }
    
        log_message("Status updated successfully for attempt ID: $attempt_id", $log_file_path, 'success', $api_url);
        return new WP_REST_Response('Status updated successfully', 200);
    }

    
    public function handle_post_get_update_request(WP_REST_Request $request, $table_name, $data, $fields) {
        $plugin_dir = plugin_dir_path(__FILE__);
        $log_dir = $plugin_dir . 'logs';
        $log_file_path = $log_dir . '/plugin-log.txt';
    
        if (!file_exists($log_dir)) {
            mkdir($log_dir, 0755, true);
        }
    
        $api_url = $request->get_route();
    
        $allowed_domain = home_url();
        $parsed_url = parse_url($allowed_domain);
        $allowed_domain = $parsed_url['scheme'] . '://' . $parsed_url['host'];
    
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
        if ($origin !== $allowed_domain && !empty($origin)) {
            log_message("Forbidden access attempt from origin: $origin", $log_file_path, 'error', $api_url);
            return new WP_Error('rest_forbidden', __('You are not allowed to access this resource.'), array('status' => 403));
        }
    
        global $wpdb;
        $table_name = $wpdb->prefix . $table_name;
    
        // Check if attempt_id is provided
        $attempt_id = $request->get_param('attempt_id');
        if (empty($attempt_id)) {
            log_message("Attempt ID is required.", $log_file_path, 'error', $api_url);
            return new WP_Error('rest_invalid', __('Attempt ID is required.'), array('status' => 400));
        }
    
        // Handle GET request to fetch the record
        if ($request->get_method() === 'GET') {
            $result = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE attempt_id = %s", sanitize_text_field($attempt_id)));
            if (empty($result)) {
                log_message("No record found for attempt ID: $attempt_id", $log_file_path, 'error', $api_url);
                return new WP_Error('rest_not_found', __('No record found for the provided attempt ID.'), array('status' => 404));
            }
            log_message("Record fetched successfully for attempt ID: $attempt_id", $log_file_path, 'success', $api_url);
            return new WP_REST_Response($result, 200);
        }
    
        // Prepare data for insertion or update
        $insert_data = array('attempt_id' => sanitize_text_field($attempt_id));
        foreach ($fields as $field) {
            if (isset($data[$field])) {
                $insert_data[$field] = sanitize_text_field($data[$field]);
            }
        }
    
        // Check if record with attempt_id already exists
        $existing_record = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE attempt_id = %s", sanitize_text_field($attempt_id)));
    
        // Handle PUT (update) request
        if ($request->get_method() === 'PUT' && $existing_record) {
            if ($existing_record->status == '1') {
                log_message("Cannot update record with status 1 for attempt ID: $attempt_id", $log_file_path, 'error', $api_url);
                return new WP_Error('rest_forbidden', __('Cannot update record with status 1.'), array('status' => 403));
            }
            $where = array('attempt_id' => sanitize_text_field($attempt_id));
            $result = $wpdb->update($table_name, $insert_data, $where);
            if ($result === false) {
                log_message("Failed to update data in the database for attempt ID: $attempt_id", $log_file_path, 'error', $api_url);
                return new WP_Error('rest_db_update_failed', __('Failed to update data in the database.'), array('status' => 500));
            }
            log_message("Data updated successfully for attempt ID: $attempt_id", $log_file_path, 'success', $api_url);
            return new WP_REST_Response('Data updated successfully', 200);
        }
    
        // Handle POST (create) request
        if ($existing_record) {
            if ($existing_record->status == '1') {
                log_message("Cannot update record with status 1 for attempt ID: $attempt_id", $log_file_path, 'error', $api_url);
                return new WP_Error('rest_forbidden', __('Cannot update record with status 1.'), array('status' => 403));
            }
            $where = array('attempt_id' => sanitize_text_field($attempt_id));
            $result = $wpdb->update($table_name, $insert_data, $where);
            if ($result === false) {
                log_message("Failed to update data in the database for attempt ID: $attempt_id", $log_file_path, 'error', $api_url);
                return new WP_Error('rest_db_update_failed', __('Failed to update data in the database.'), array('status' => 500));
            }
            log_message("Data updated successfully for attempt ID: $attempt_id", $log_file_path, 'success', $api_url);
            return new WP_REST_Response('Data updated successfully', 200);
        } else {
            // Default status for new records
            $insert_data['status'] = 'not started'; 
            $result = $wpdb->insert($table_name, $insert_data);
            if ($result === false) {
                log_message("Failed to insert data into the database for attempt ID: $attempt_id", $log_file_path, 'error', $api_url);
                return new WP_Error('rest_db_insert_failed', __('Failed to insert data into the database.'), array('status' => 500));
            }
            log_message("Data inserted successfully for attempt ID: $attempt_id", $log_file_path, 'success', $api_url);
            return new WP_REST_Response('Data inserted successfully', 201);
        }
    }



    public function create_gravity_write_ai_builder_table() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'gravity_write_ai_builder';

        if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
            $charset_collate = $wpdb->get_charset_collate();

            $sql = "CREATE TABLE $table_name (
                id mediumint(9) NOT NULL AUTO_INCREMENT,
                attempt_id mediumint(9) NOT NULL,
                pages longtext DEFAULT NULL,
                style longtext DEFAULT NULL,
                template varchar(255) DEFAULT NULL,
                category varchar(255) DEFAULT NULL,
                name varchar(255) DEFAULT NULL,
                description1 longtext DEFAULT NULL,
                description2 longtext DEFAULT NULL,
                image_url longtext DEFAULT NULL, -- Support multiple URLs
                email varchar(255) DEFAULT NULL,
                phone_number varchar(255) DEFAULT NULL,
                address longtext DEFAULT NULL,
                template_name varchar(255) DEFAULT NULL,
                primary_color varchar(255) DEFAULT NULL,
                secondary_color varchar(255) DEFAULT NULL,
                primary_font varchar(255) DEFAULT NULL,
                secondary_font varchar(255) DEFAULT NULL,
                status varchar(20) DEFAULT 'not started',
                PRIMARY KEY (id),
                UNIQUE (attempt_id)
            ) $charset_collate;";

            require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
            dbDelta($sql);
        }
    }

    public function alter_gravity_write_ai_builder_table() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'gravity_write_ai_builder';

        $column = $wpdb->get_results("SHOW COLUMNS FROM $table_name LIKE 'status'");
        if (empty($column)) {
            $sql = "ALTER TABLE $table_name ADD status varchar(20) DEFAULT 'not started'";
            $wpdb->query($sql);
        }
    }

    public function handle_attempt_request(WP_REST_Request $request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'gravity_write_ai_builder';
    
        // Capture the API URL
        $api_url = $request->get_route();
        
        // Define plugin directory and log file path
        $plugin_dir = plugin_dir_path(__FILE__);
        $log_dir = $plugin_dir . 'logs';
        $log_file_path = $log_dir . '/plugin-log.txt'; 
        
        // Create the log directory if it doesn't exist
        if (!file_exists($log_dir)) {
            mkdir($log_dir, 0755, true);
        }
    
        // Handle POST request to insert a new attempt
        if ($request->get_method() === 'POST') {
            $attempt_data = $request->get_json_params();
            
            // Ensure the data is well-sanitized and valid
            if (isset($attempt_data['attempt_id'])) {
                $attempt_id = sanitize_text_field($attempt_data['attempt_id']);
    
                // Log the insertion attempt
                log_message("Attempt to insert new record with attempt ID: $attempt_id", $log_file_path, 'info', $api_url);
                
                // Prepare data for insertion
                $insert_data = array(
                    'attempt_id' => $attempt_id, 
                    'status' => 'not started'
                );
                
                // Insert into database
                $result = $wpdb->insert($table_name, $insert_data);
    
                if ($result === false) {
                    // Log the failure
                    log_message("Failed to insert attempt with ID: $attempt_id", $log_file_path, 'error', $api_url);
                    return new WP_Error('rest_db_insert_failed', __('Failed to insert attempt into the database.'), array('status' => 500));
                }
    
                // Log the success
                log_message("Attempt inserted successfully with ID: $attempt_id", $log_file_path, 'success', $api_url);
                return new WP_REST_Response('Attempt inserted successfully', 201);
            } else {
                log_message("Attempt ID is missing in the POST request.", $log_file_path, 'error', $api_url);
                return new WP_Error('rest_invalid_data', __('Attempt ID is required.'), array('status' => 400));
            }
        }
    
        // Handle GET request to fetch the latest attempt ID
        if ($request->get_method() === 'GET') {
            log_message('Fetching the latest attempt ID.', $log_file_path, 'info', $api_url);
    
            // Retrieve the latest attempt ID from the database
            $latest_attempt = $wpdb->get_row("SELECT attempt_id FROM $table_name ORDER BY id DESC LIMIT 1");
    
            if (empty($latest_attempt)) {
                log_message('No attempts found in the database.', $log_file_path, 'error', $api_url);
                return new WP_Error('rest_not_found', __('No attempts found.'), array('status' => 404));
            }
    
            // Log and return the latest attempt
            log_message('Latest attempt ID: ' . $latest_attempt->attempt_id, $log_file_path, 'success', $api_url);
            return new WP_REST_Response(array('latest_attempt_id' => $latest_attempt->attempt_id), 200);
        }
    
        // Log the invalid method attempt
        log_message('Invalid request method: ' . $request->get_method(), $log_file_path, 'error', $api_url);
        return new WP_Error('rest_invalid_method', __('Invalid request method.'), array('status' => 405));
    }


}

$gw_website_builder = new GW_Website_Builder();
ob_end_flush(); 

register_activation_hook(__FILE__, 'gw_website_builder_activate');

function gw_website_builder_activate() {
    add_option('gw_website_builder_do_activation_redirect', true);
}

add_action('admin_init', 'gw_website_builder_redirect');

function gw_website_builder_redirect() {
    if (get_option('gw_website_builder_do_activation_redirect', false)) {
        delete_option('gw_website_builder_do_activation_redirect');
        if (!isset($_GET['activate-multi'])) {
            wp_redirect(admin_url('admin.php?page=gw-website-builder'));
        }
    }
}

// create api for truncate tables start
// Register custom REST API endpoint to empty specific tables
add_action('rest_api_init', function () {
    register_rest_route('myplugin/v1', '/empty-tables', array(
        'methods' => 'DELETE',
        'callback' => 'myplugin_empty_tables',
        'permission_callback' => function () {
            return true; 
        }
    ));
});

/**
 * Callback function to empty specific WordPress tables and log the result with different log levels.
 *
 * @return WP_REST_Response|WP_Error
 */
function myplugin_empty_tables(WP_REST_Request $request) {
    global $wpdb;

    // Get the full API URL from the request object
    $api_url = $request->get_route();
    //log_message('success', $message, $log_file_path, $api_url);

    $plugin_dir = plugin_dir_path(__FILE__); 
    $log_dir = $plugin_dir . 'logs'; 
    $log_file_path = $log_dir . '/plugin-log.txt';

    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $tables_to_empty = array(
        $wpdb->prefix . 'gw_user_form_details', 
        //$wpdb->prefix . 'imported_posts', 
        //$wpdb->prefix . 'menu_details', 
        //$wpdb->prefix . 'menu_item_details', 
        $wpdb->prefix . 'generated_content', 
        $wpdb->prefix . 'generated_html_content', 
        $wpdb->prefix . 'page_generation_status', 
        $wpdb->prefix . 'selected_template_data'
    );

    $response_data = array();

    // Log the start of the truncation process, including the API URL
    log_message('Table truncation process started.', $log_file_path,'notice', $api_url);

    foreach ($tables_to_empty as $table) {
        if ($wpdb->get_var("SHOW TABLES LIKE '$table'") == $table) {
            $row_count = $wpdb->get_var("SELECT COUNT(*) FROM $table");

            if ($row_count > 0) {
                $result = $wpdb->query("TRUNCATE TABLE $table");

                if ($result === false) {
                    $message = "Failed to truncate table: $table. Error: " . $wpdb->last_error;
                    log_message($message, $log_file_path,'warning',  $api_url);
                    $response_data[] = array('table' => $table, 'status' => 'failed', 'message' => $message);
                } else {
                    $message = "Successfully truncated table: $table";
                    log_message($message, $log_file_path,'success',  $api_url);
                    $response_data[] = array('table' => $table, 'status' => 'success', 'message' => $message);
                }
            } else {
                // Table is already empty, log a warning
                $message = "Table is already empty: $table";
                log_message($message, $log_file_path,'warning', $api_url);
                $response_data[] = array('table' => $table, 'status' => 'warning', 'message' => $message);
            }
        } else {
            $message = "Table not found: $table";
            log_message( $message, $log_file_path, 'warning',$api_url);
            $response_data[] = array('table' => $table, 'status' => 'warning', 'message' => $message);
        }
    }

    // Log the completion of the truncation process, including the API URL
    log_message('Table truncation process completed.', $log_file_path, 'notice', $api_url);

    return rest_ensure_response(array(
        'status' => 'completed',
        'message' => 'Table truncation process completed.',
        'details' => $response_data
    ));
}


//create api for truncate tables end


//end