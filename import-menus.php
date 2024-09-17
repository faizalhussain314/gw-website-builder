<?php

// Function to process the import of menus and custom CSS
function wpse_process_import_data($data) {
    global $wpdb;
    $table_name=$wpdb->prefix . 'menu_details';
    if (isset($data['custom_css'])) {
        wp_update_custom_css_post($data['custom_css']); // Import Custom CSS
    }

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
    }

    if (isset($data['menus'])) {
        foreach ($data['menus'] as $menu_name => $items) {
            $menu_exists = wp_get_nav_menu_object($menu_name);
            $menu_id = $menu_exists ? $menu_exists->term_id : wp_create_nav_menu($menu_name);
            wp_delete_nav_menu_items($menu_id);
            foreach ($items as $item) {
                $current_url = home_url();
                
                wp_update_nav_menu_item($menu_id, 0, [
                    'menu-item-title' => $item['title'],
                    'menu-item-url' => $item['url'],
                    'menu-item-status' => 'publish',
                    'menu-item-type' => $item['type'],
                    'menu-item-object' => $item['object'],
                    'menu-item-object-id' => $item['object_id'],
                    'menu-item-parent-id' => $item['parent_id'],
                    'menu-item-position' => $item['menu_order']
                ]);
                // Prepare data for insertion or update
    
                $menu_item_data = [
                    'menu_name'   => $item['title'],
                    'menu_item_order' => $item['menu_order'],
                ];
                $menu_title=$item['title'];
    
                $table_name2=$wpdb->prefix . 'menu_item_details';
                $exists1 = $wpdb->get_var($wpdb->prepare(
                    "SELECT COUNT(*) FROM $table_name2 WHERE menu_name = %d",
                    $menu_title
                ));
                if ($exists1 > 0) {
                    // Update existing record
                    $wpdb->update(
                        $table_name2,
                        $menu_item_data,
                        ['menu_name' => $menu_title]
                    );
                } else {
                    // Insert new record
                    $wpdb->insert(
                        $table_name2,
                        $menu_item_data
                    );
                }
            }
            $menu_data = [
                'menu_id'   => $menu_id,
                'menu_name' => $menu_name,
            ];
            // Check if this menu ID already exists in the table
            $exists = $wpdb->get_var($wpdb->prepare(
                "SELECT COUNT(*) FROM $table_name WHERE menu_name = %d",
                $menu_name
            ));

            if ($exists > 0) {
                // Update existing record
                $wpdb->update(
                    $table_name,
                    $menu_data,
                    ['menu_name' => $menu_name]
                );
            } else {
                // Insert new record
                $wpdb->insert(
                    $table_name,
                    $menu_data
                );
            }
        }
    }

    return true;
}

?>