<?php
function import_header_footer($file_url) {
    $plugin_dir = plugin_dir_path(__FILE__);
    $local_file_path = $plugin_dir . basename($file_url); // Generate local path

    // Download the file
    if (!download_file($file_url, $local_file_path)) {
        echo "Failed to download the file from: $file_url";
        return false; // Stop the process if download fails
    }

    echo "<pre>Downloaded file path: $local_file_path\n</pre>";
    $xml_data = file_get_contents($local_file_path);
    $xml = simplexml_load_string($xml_data);

    if (!$xml) {
        echo "Failed to load XML";
        return false;
    }

    foreach ($xml->post as $item) {
        $bsf_rules = (string) $item->ehf_target_include_locations; // Assuming this is the correct XML node
        $post_data = array(
            'post_title'     => (string) $item->Title,
            'post_content'   => (string) $item->Content,
            'post_date'      => (string) $item->Date,
            'post_type'      => (string) $item->PostType,
            'post_status'    => (string) $item->Status,
            'post_author'    => (int) $item->AuthorID,
            'post_name'      => (string) $item->Slug,
            'post_parent'    => (string) $item->ParentSlug,
            'menu_order'     => (int) $item->Order,
            'comment_status' => (string) $item->CommentStatus,
            'ping_status'    => (string) $item->PingStatus,
            'post_modified'  => (string) $item->PostModifiedDate,
            'meta_input'     => array(
                'ehf_target_include_locations' => (string)$item->ehf_target_include_locations,
                'ehf_target_exclude_locations' => (string)$item->ehf_target_exclude_locations,
                'ehf_target_user_roles'        => (string)$item->ehf_target_user_roles,
                'ehf_template_type'            => (string)$item->ehf_template_type,
                '_wp_page_template'            => (string) $item->_wp_page_template,
                'ehf_template_type'            => (string) $item->ehf_template_type,
                '_elementor_edit_mode'         => (string) $item->_elementor_edit_mode,
                '_elementor_template_type'     => (string) $item->_elementor_template_type,
                '_elementor_version'           => (string) $item->_elementor_version,
                'ekit_post_views_count'        => (int) $item->ekit_post_views_count,
                '_elementor_data'              => maybe_unserialize((string) $item->_elementor_data),
                '_elementor_css'               => (string) $item->_elementor_css,
                'image_url'                    => (string) $item->ImageURL,
                'image_title'                  => (string) $item->ImageTitle,
                'image_caption'                => (string) $item->ImageCaption,
                'image_description'            => (string) $item->ImageDescription,
                'image_alt_text'               => (string) $item->ImageAltText,
                'image_featured'               => (string) $item->ImageFeatured,
                'attachment_url'               => (string) $item->AttachmentURL
            )
        );

        $result = wp_insert_post($post_data, true);

        if (is_wp_error($result)) {
            echo "<p>Error inserting post: " . $result->get_error_message() . "</p>";
        } else {
            echo "<p>New post inserted successfully: Post ID = " . $bsf_rules . "</p>";
        }
    }
    return true; // Assuming all goes well
}

?>