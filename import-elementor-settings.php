<?php

function ensure_elementor_active_kit() {
    $active_kit_id = get_option('elementor_active_kit');
    if (!$active_kit_id) {
        $active_kit_id = wp_insert_post([
            'post_type'   => 'elementor_library',
            'post_title'  => 'New Default Elementor Kit',
            'post_status' => 'publish'
        ]);

        if (is_wp_error($active_kit_id)) {
            echo "Error creating new Elementor kit: " . $active_kit_id->get_error_message();
            return false;
        }

        update_option('elementor_active_kit', $active_kit_id);
    }
    return $active_kit_id;
}

// Function to parse the XML file and update the Elementor active kit meta
function update_elementor_kit_from_xml($file_path) {
    $xml_data = file_get_contents($file_path);
    $xml = simplexml_load_string($xml_data);
    $active_kit_id = ensure_elementor_active_kit();

    if (!$active_kit_id) {
        return; // Exit if there was an error creating the kit
    }


    foreach ($xml->channel->item as $item) {
        foreach ($item->children('wp', true)->postmeta as $meta) {
            $key = (string)$meta->meta_key;
            $value = maybe_unserialize((string)$meta->meta_value);
            if ($key == '_elementor_page_settings') {
                update_post_meta($active_kit_id, '_elementor_page_settings', $value);
                echo "Updated Elementor kit settings successfully for kit ID: $active_kit_id<br>";
                $val=get_post_meta($active_kit_id, '_elementor_page_settings');
                echo "<pre>";
                print_r($val);
            }
        }
    }
}
function install_elementor_kit($file_path) {
    $plugin_dir = plugin_dir_path(__FILE__);
    $local_file_path = $plugin_dir . basename($file_url); // Generate local path

    // Download the file
    if (!download_file($file_url, $local_file_path)) {
        echo "Failed to download the file from: $file_url";
        return false; // Stop the process if download fails
    }

    echo "<pre>";
    echo "Downloaded file path: $local_file_path\n";
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
    // Get the active kit ID
    $kit_manager = $elementor->kits_manager;
    $active_kit_id = $kit_manager->get_active_id();
    $kit = $kit_manager->get_kit_for_frontend($active_kit_id);
    
    if (isset($settings['settings'])) {
        foreach ($settings['settings'] as $key => $value) {
            if($key=='system_colors'){
                $kit->set_settings('system_colors', $value);
                $kit->save(['settings' => $kit->get_settings()]);
            }
            if($key=='custom_colors'){
                $kit->set_settings('custom_colors', $value);
                $kit->save(['settings' => $kit->get_settings()]);
            }
            if($key=='system_typography'){
                $kit->set_settings('system_typography', $value);
                $kit->save(['settings' => $kit->get_settings()]);
            }  
            if($key=='custom_typography'){
                $kit->set_settings('custom_typography', $value);
                $kit->save(['settings' => $kit->get_settings()]);
            }  
        }
        return '<div class="updated"><p>Elementor settings imported successfully.</p></div>';
    } else {
        return '<div class="error"><p>Invalid settings data in JSON file.</p></div>';
    }
}
?>