<?php 

function get_menu_item_order_by_page_name($page_name) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'menu_item_details';  // Adjust the table name as needed

    // Fetch the menu item order where the menu name matches the page title
    $menu_item_order = $wpdb->get_var($wpdb->prepare(
        "SELECT menu_item_order FROM $table_name WHERE menu_name = %s",
        $page_name
    ));

    return $menu_item_order ? (int) $menu_item_order : false;  // Return false if no order is found
}
function create_menus_for_pages(WP_REST_Request $request) {
    global $wpdb;

    // Fetch the single menu name and ID from wp_menu_details
    $menu_details = $wpdb->get_row("SELECT menu_id, menu_name FROM {$wpdb->prefix}menu_details LIMIT 1");

    if (!$menu_details) {
        return new WP_Error('no_menu_found', 'No menu found in the database.', array('status' => 404));
    }

    // Assign variables for menu ID and name
    $menu_id = $menu_details->menu_id;
    $menu_name = $menu_details->menu_name;

    // Clear existing menu items
    wp_delete_nav_menu_items($menu_id);

    // Get page IDs from imported_posts where type is 'page'
    $page_ids = $wpdb->get_col("SELECT post_id FROM {$wpdb->prefix}imported_posts WHERE post_type = 'page'");

    // Add each page as a menu item
    foreach ($page_ids as $page_id) {
        $page_title = get_the_title($page_id);
        if (stripos($page_title, 'home') !== false) {
            
            $wpdb->update(
                $wpdb->options,
                ['option_value' => 'page'],
                ['option_name' => 'show_on_front']
            );
            $wpdb->update(
                $wpdb->options,
                ['option_value' => $page_id],
                ['option_name' => 'page_on_front']
            );
        }
        $page_name=get_the_title($page_id);
        $item_order=get_menu_item_order_by_page_name($page_name);
        wp_update_nav_menu_item($menu_id, 0, array(
            'menu-item-title' => get_the_title($page_id),
            'menu-item-object-id' => $page_id,
            'menu-item-object' => 'page',
            'menu-item-type' => 'post_type',
            'menu-item-status' => 'publish',
            'menu-item-object-id' => $page_id,
            'menu-item-parent-id' => $page_id,
            'menu-item-position' => $item_order
        ));
    }
    $dat=json_encode($page_ids);

    return rest_ensure_response(array('success' => true, 'message' => "Menu '{$item_order}' updated with pages."));
}

// Helper function to delete all menu items
function wp_delete_nav_menu_items($menu_id) {
    $items = wp_get_nav_menu_items($menu_id);
    foreach ($items as $item) {
        wp_delete_post($item->ID, true);
    }
}




?>