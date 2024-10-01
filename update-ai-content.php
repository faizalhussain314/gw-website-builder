<?php
function update_elementor_page_content_directly(WP_REST_Request $request) {
    global $wpdb; // Global WordPress database class instance
    $params = json_decode($request->get_body(), true);
    $page_title = sanitize_text_field($request->get_param('page_name')); // Adjust to your needs
    $page = get_page_by_title($page_title);

    if (!$page) {
        return new WP_REST_Response(['success' => false, 'message' => 'Page not found'], 404);
    }
    $json_content = $wpdb->get_var($wpdb->prepare(
        "SELECT json_content FROM {$wpdb->prefix}generated_content WHERE page_name = %s",
        $page_title
    ));

    if (!$json_content) {
        return new WP_REST_Response(['success' => false, 'message' => 'No parameters found for this page'], 404);
    }

    $params = json_decode($json_content);

    $elementor_data = $wpdb->get_var($wpdb->prepare(
        "SELECT meta_value FROM {$wpdb->postmeta} WHERE post_id = %d AND meta_key = '_elementor_data'",
        $page->ID
    ));

    if ($elementor_data) {
        $elementor_data = maybe_unserialize($elementor_data); // Ensure it's properly unserialized
        $updated_data = traverse_and_update_content(json_decode($elementor_data, true), $params);
        $encoded_data = wp_json_encode($updated_data);

        $result = $wpdb->update(
            $wpdb->postmeta,
            ['meta_value' => maybe_serialize($encoded_data)], // Ensure it's serialized back properly
            ['post_id' => $page->ID, 'meta_key' => '_elementor_data'],
            ['%s'], // Value format
            ['%d', '%s'] // Where format
        );

        if ($result !== false) {
            // Try to regenerate CSS
            $css_regeneration_successful = true;
        } else {
            return new WP_REST_Response(['success' => false, 'message' => 'Failed to update content'], 500);
        }
    } else {
        return new WP_REST_Response(['success' => false, 'message' => 'No Elementor data found'], 404);
    }

    return new WP_REST_Response(['success' => true, 'message' => 'Content updated and CSS regenerated', 'css_regeneration' => $css_regeneration_successful], 200);
}

function traverse_and_update_content($elementor_data, $replacements) {
    array_walk_recursive($elementor_data, function (&$item, $key) use ($replacements) {
        if (is_string($item)) {
            foreach ($replacements as $search => $replace) {
                if (strpos($item, $search) !== false) {
                    $search = str_replace("\u2019", "'", $search);
                    $item = str_replace($search, $replace, $item);
                }
            }
        }
    });
    return $elementor_data;
}

?>