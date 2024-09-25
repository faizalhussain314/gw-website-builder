<?php 
function ensure_elementor_active_kit() {
    // Retrieve the current active Elementor kit ID
    $active_kit_id = get_option('elementor_active_kit');

    // If there is no active kit, create one
    if (!$active_kit_id) {
        // Define the new kit's attributes
        $new_kit_args = array(
            'post_type'   => 'elementor_library', // Confirm that this is the correct post type for your kits
            'post_title'  => 'New Default Elementor Kit',
            'post_status' => 'publish',
            'post_content'=> '' // Default content, modify as needed
        );

        // Insert the new post (Elementor kit)
        $active_kit_id = wp_insert_post($new_kit_args);

        // Check for errors during the kit creation
        if (is_wp_error($active_kit_id)) {
            // Log and return the error message
            error_log('Error creating new Elementor kit: ' . $active_kit_id->get_error_message());
            return false;
        }

        // Successfully created, set as the new active kit
        update_option('elementor_active_kit', $active_kit_id);
    }

    // Return the ID of the active kit (either existing or newly created)
    return $active_kit_id;
}


// Function to parse the XML file and update the Elementor active kit meta
function install_elementor_kits($file_url) {
    $plugin_dir = plugin_dir_path(__FILE__);
    $local_file_path = $plugin_dir . basename($file_url); // Generate local path for saving the file

    // Download the file
    if (!download_file($file_url, $local_file_path)) {
        echo "Failed to download the file from: $file_url";
        return false; // Stop the process if download fails
    }

    // Load XML from the local file
    $xml_data = file_get_contents($local_file_path);
    $xml = simplexml_load_string($xml_data);
    if (!$xml) {
        echo "Failed to load XML data.";
        return false;
    }

    $active_kit_id = ensure_elementor_active_kit();
    if (!$active_kit_id) {
        echo "Failed to ensure active Elementor kit.";
        return false; // Exit if there was an error creating or retrieving the kit
    }

    // Iterate over XML data to find and update Elementor settings
    foreach ($xml->channel->item as $item) {
        foreach ($item->children('wp', true)->postmeta as $meta) {
            $key = (string) $meta->meta_key;
            $value = maybe_unserialize((string) $meta->meta_value);
            if ($key == '_elementor_page_settings') {
                update_post_meta($active_kit_id, '_elementor_page_settings', $value);
                echo "Updated Elementor kit settings successfully for kit ID: $active_kit_id<br>";
                // Debug output to confirm the meta values
                $val = get_post_meta($active_kit_id, '_elementor_page_settings', true);
            }
        }
        return true;
    }
    return true; // Indicate successful completion
}

function install_elementor_kit_settings($file_url) {
    $plugin_dir = plugin_dir_path(__FILE__);
    $local_file_path = $plugin_dir . basename($file_url); // Generate local path

    // Download the file
    if (!download_file($file_url, $local_file_path)) {
        return "Failed to download the file from: $file_url";
    }

    $file_contents = file_get_contents($local_file_path);
    $settings = json_decode($file_contents, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        return 'Failed to parse JSON file: ' . json_last_error_msg();
    }

    return update_elementor_settings($settings);
}

function update_elementor_settings($settings) {
    if (!did_action('elementor/loaded')) {
        return 'Elementor is not loaded.';
    }
    $elementor = \Elementor\Plugin::instance();
    $kit_manager = $elementor->kits_manager;
    $active_kit_id = $kit_manager->get_active_id();
    $kit = $kit_manager->get_kit_for_frontend($active_kit_id);

    if (isset($settings['settings'])) {
        foreach ($settings['settings'] as $key => $value) {
            if(in_array($key, ['system_colors', 'custom_colors', 'system_typography', 'custom_typography'])) {
                $kit->set_settings($key, $value);
                $kit->save(['settings' => $kit->get_settings()]);
            }
        }
        return true;
    } else {
        return 'Invalid settings data in JSON file.';
    }
}


?>