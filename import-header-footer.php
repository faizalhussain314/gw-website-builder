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
    $xml = simplexml_load_string($xml_data, null, LIBXML_NOCDATA);

    if (!$xml) {
        echo "Failed to load XML";
        return false;
    }

    global $wpdb;  // Ensure you have global access to $wpdb

    foreach ($xml->channel->item as $item) {
        $title = (string) $item->title;

        // Check if the post already exists
        $existing_post_id = post_exists($title);
        if ($existing_post_id) {
            continue; // Skip to the next item
        }

        $post_data = array(
            'post_title'     => $title,
            'post_content'   => (string) $item->children('content', true)->encoded,
            'post_date'      => (string) $item->children('wp', true)->post_date,
            'post_type'      => (string) $item->children('wp', true)->post_type,
            'post_status'    => (string) $item->children('wp', true)->status,
            'post_author'    => (int) $item->children('dc', true)->creator,
            'post_name'      => (string) $item->children('wp', true)->post_name,
            'post_parent'    => 0,
            'menu_order'     => (int) $item->children('wp', true)->menu_order,
            'comment_status' => (string) $item->children('wp', true)->comment_status,
            'ping_status'    => (string) $item->children('wp', true)->ping_status,
            'post_modified'  => (string) $item->children('wp', true)->post_modified,
            'meta_input'     => array()
        );

        // Handle post meta
        foreach ($item->children('wp', true)->postmeta as $meta) {
            $meta_key = (string) $meta->meta_key;
            $meta_value = (string) $meta->meta_value;
            $post_data['meta_input'][$meta_key] = maybe_unserialize($meta_value);
        }

        $post_id = wp_insert_post($post_data, true);
        if (is_wp_error($post_id)) {
            echo "Failed to insert post: " . $post_id->get_error_message() . "\n";
            continue; // Skip to the next item if there is an error
        }

        // Store additional post details in the custom table
        $imported_post_data = [
            'post_id'       => $post_id,
            'post_type'     => $post_data['post_type'],
            'template_name' => "our_template", 
            'page_name'     => $title
        ];
        $wpdb->insert($wpdb->prefix . 'imported_posts', $imported_post_data);
    }
    return ['success' => true, 'message' => 'Header and Footer Imported Successfully'];
}
?>
