<?php 

function update_user_details_data(WP_REST_Request $request) {
    global $wpdb; // Global WordPress database object
    $params = $request->get_json_params();
    $post_name = $params['pagename']; // Get the specific name for the footer post from the JSON body

    // Fetch the post ID from the custom table by post_name
    $query = $wpdb->prepare("SELECT post_id FROM {$wpdb->prefix}imported_posts WHERE page_name = %s LIMIT 1", $post_name);
    $post_id = $wpdb->get_var($query);

    if (!$post_id) {
        return new WP_REST_Response(['success' => false, 'message' => 'No post found with the specified name'], 404);
    }

    // Retrieve Elementor data
    $elementor_data = get_post_meta($post_id, '_elementor_data', true);
    if (!$elementor_data) {
        return new WP_REST_Response(['success' => false, 'message' => 'Failed to retrieve Elementor data for the post'], 404);
    }
    $elementor_data = json_decode($elementor_data, true);

    // Process the incoming JSON and update Elementor data using the traverse function
    $updated_data = traverse_and_update_content($elementor_data, $params['replace-content']);

    // Save the updated Elementor data back to the post
    update_post_meta($post_id, '_elementor_data', json_encode($updated_data));

    return new WP_REST_Response(['success' => true, 'message' => 'Post data updated successfully'], 200);
}


?>