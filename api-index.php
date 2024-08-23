<?php
/*
Plugin Name: Custom XML Importer
Description: A custom plugin to import XML data and manage plugins/themes, with additional import capabilities.
Version: 1.0
Author: Your Name
*/

require_once(ABSPATH . 'wp-admin/includes/class-wp-upgrader.php');
require_once(ABSPATH . 'wp-admin/includes/plugin.php');
require_once(ABSPATH . 'wp-admin/includes/theme.php');
require_once(ABSPATH . 'wp-admin/includes/file.php');
require_once(ABSPATH . 'wp-admin/includes/post.php');
require_once(ABSPATH . 'wp-admin/includes/media.php');
require_once(ABSPATH . 'wp-admin/includes/image.php');
require_once(ABSPATH . 'wp-admin/includes/class-wp-ajax-upgrader-skin.php');
require_once(ABSPATH . 'wp-admin/includes/import.php');
require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
require_once(plugin_dir_path(__FILE__) . 'import-posts.php');
require_once(plugin_dir_path(__FILE__) . 'gravitywrite-wp-import.php'); 
require_once(plugin_dir_path(__FILE__) . 'download-file.php'); 
require_once(plugin_dir_path(__FILE__) . 'install_theme.php'); 
require_once(plugin_dir_path(__FILE__) . 'install_plugins.php'); 
require_once(plugin_dir_path(__FILE__) . 'import-header-footer.php'); 
require_once(plugin_dir_path(__FILE__) . 'elementor-import.php'); 
require_once(plugin_dir_path(__FILE__) . 'save-form-details.php'); 

// Increase memory limit
ini_set('memory_limit', '512M');
register_activation_hook(__FILE__, 'create_required_tables');

function create_required_tables() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'gw_user_form_details';  // Using WPDB prefix to set the table name

    // Check if the table already exists
    if ($wpdb->get_var("SHOW TABLES LIKE '{$table_name}'") != $table_name) {
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            businessName text,
            description1 text,
            description2 text,
            images longtext, 
            designs longtext,  
            templateid mediumint(9),
            templatename text,
            logo text,
            category text, 
            content longtext, 
            color longtext, 
            font text,
            templateList longtext, 
            PRIMARY KEY (id)
        ) $charset_collate;";
        dbDelta($sql);
    }
}

// Register REST API routes
add_action('rest_api_init', function () {
    // Register the install plugin endpoint
    register_rest_route('custom/v1', '/install-plugin', array(
        'methods' => WP_REST_Server::CREATABLE, // This is better as it includes POST, PUT, etc.
        'callback' => 'custom_xml_importer_install_and_activate_plugins',
        'permission_callback' => '__return_true', // Ensure the callback always runs
    ));
    // Register the install theme endpoint
    
    register_rest_route('custom/v1', '/install-theme', array(
        'methods' => WP_REST_Server::CREATABLE, 
        'callback' => 'custom_xml_importer_install_and_activate_theme',
        'permission_callback' => '__return_true', 
    ));
    register_rest_route('custom/v1', '/install-posts', array(
        'methods' => WP_REST_Server::CREATABLE, 
        'callback' => 'import_posts_from_url',
        'permission_callback' => '__return_true', 
    ));
    register_rest_route('custom/v1', '/install-pages', array(
        'methods' => WP_REST_Server::CREATABLE, 
        'callback' => 'import_posts_from_url',
        'permission_callback' => '__return_true',
    ));
    register_rest_route('custom/v1', '/install-forms', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'import_posts_from_url',
        'permission_callback' => '__return_true', 
    ));
    register_rest_route('custom/v1', '/install-elementor-kit', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'import_elementor_kit',
        'permission_callback' => '__return_true', 
    ));

    register_rest_route('custom/v1', '/install-elementor-settings', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'import_elementor_settings',
        'permission_callback' => '__return_true', // Ensure the callback always runs
    ));
    register_rest_route('custom/v1', '/install-header-footer', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'import_header_footer_data',
        'permission_callback' => '__return_true', // Ensure the callback always runs
    ));
    register_rest_route('custom/v1', '/update-form-details', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'update_form_details',
        'permission_callback' => '__return_true',
    ));
    register_rest_route('custom/v1', '/get-form-details', array(
        'methods' => WP_REST_Server::READABLE, // Equivalent to 'GET'
        'callback' => 'fetch_form_details',
        'permission_callback' =>'__return_true'
    ));
});
function custom_xml_importer_install_and_activate_plugins(WP_REST_Request $request){
    // Retrieve plugin data sent in the request
    $plugins = $request->get_param('plugins');

    if (empty($plugins)) {
        return new WP_Error('no_plugins', 'No plugins specified', array('status' => 400));
    }

    // Call the function to install and activate plugins
    return install_plugins($plugins);
}
function custom_xml_importer_install_and_activate_theme(WP_REST_Request $request) {
    $result = install_theme();
    if (!$result['success']) {
        return new WP_REST_Response([
            'success' => false,
            'message' => $result['error']
        ], 500); // Return HTTP status 500 if there's an error
    }
    
    return new WP_REST_Response([
        'success' => true,
        'message' => $result['message']
    ], 200); // Return HTTP status 200 if successful
}
function import_posts_from_url(WP_REST_Request $request) {
    $params = $request->get_json_params();
    $file_url = $params['xml_url'] ?? null;

    if (!$file_url) {
        return new WP_REST_Response([
            'success' => false,
            'message' => 'No XML file URL provided'
        ], 400); // Bad Request
    }

    $import_results = import_posts($file_url);

    if ($import_results) {
        return new WP_REST_Response([
            'success' => true,
            'message' => 'Import results',
            'data' => $import_results
        ], 200); // OK
    } else {
        return new WP_REST_Response([
            'success' => false,
            'message' => 'Failed to import posts',
            'data' => $import_results
        ], 500); // Internal Server Error
    }
}
function import_header_footer_data(WP_REST_Request $request){
    $params = $request->get_json_params();
    $file_url = $params['xml_url'] ?? null;

    if (!$file_url) {
        return new WP_REST_Response([
            'success' => false,
            'message' => 'No XML file URL provided'
        ], 400); // Bad Request
    }

    $import_results = import_header_footer($file_url);

    if ($import_results) {
        return new WP_REST_Response([
            'success' => true,
            'message' => 'Header and footer data imported successfully.'
        ], 200); // OK
    } else {
        return new WP_REST_Response([
            'success' => false,
            'message' => 'Failed to import header and footer data.'
        ], 500); // Internal Server Error
    }
}


function import_elementor_kit(WP_REST_Request $request) {
    $params = $request->get_json_params();
    $file_url = $params['fileurl'] ?? 'default_value_if_not_set';

    if ($file_url == 'default_value_if_not_set') {
        return new WP_REST_Response([
            'success' => false,
            'message' => 'No file URL provided'
        ], 400); // Bad Request
    }

    $result = install_elementor_kits($file_url);
    if ($result) {
        return new WP_REST_Response([
            'success' => true,
            'message' => 'Elementor kit installed successfully'
        ], 200); // OK
    } else {
        return new WP_REST_Response([
            'success' => false,
            'message' => 'Failed to install Elementor kit'
        ], 500); // Internal Server Error
    }
}
function import_elementor_settings(WP_REST_Request $request) {
    $params = $request->get_json_params();
    $file_url = $params['fileurl'] ?? null;

    if (!$file_url) {
        return new WP_REST_Response([
            'success' => false,
            'message' => 'No file URL provided'
        ], 400); // Bad Request
    }

    $result = install_elementor_kit_settings($file_url);
    if ($result === true) {
        return new WP_REST_Response([
            'success' => true,
            'message' => 'Elementor settings imported successfully.'
        ], 200); // OK
    } else {
        return new WP_REST_Response([
            'success' => false,
            'message' => $result
        ], 500); // Internal Server Error
    }
}
function update_form_details(WP_REST_Request $request) {
    $params = $request->get_json_params();
    $result = save_or_update_form_details($params); // Call to a separate function to handle DB operations

    if ($result === true) {
        return new WP_REST_Response(['success' => true, 'message' => 'Data saved successfully'], 200);
    } else {
        return new WP_REST_Response(['success' => false, 'message' => 'Failed to save data'], 500);
    }
}
function fetch_form_details(WP_REST_Request $request) {
    // Extract fields from the request JSON body
    $fields = $request->get_json_params()['fields'] ?? [];
    $field_list = is_array($fields) ? $fields : explode(',', $fields);

    // Call the function that performs the database query
    $result = get_form_details_from_database($field_list);

    if (!empty($result)) {
        return new WP_REST_Response($result, 200); // Return successful response with data
    } else {
        return new WP_REST_Response([
            'success' => false,
            'message' => 'No data found'
        ], 404); // Return an error if no data is found
    }
}

