<?php
/**
 * Plugin Name: AI Website Builder - Gravity Write latest
 * Description: A Website Builder made by WordPress.
 * Version: 1.0.0
 * Author: Gravity Write
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

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

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
        'methods' => WP_REST_Server::CREATABLE, 
        'callback' => 'fetch_form_details',
        'permission_callback' =>'__return_true'
    ));

    // Register the attempt endpoint
    // register_rest_route('custom/v1', '/attempt', array(
    //     'methods' => array('POST', 'GET'),
    //     'callback' => array($this, 'handle_attempt_request'),
    //     'permission_callback' => '__return_true',
    // ));
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


class GW_Website_Builder {
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_head', array($this, 'custom_admin_style'));
        add_action('rest_api_init', array($this, 'register_api_endpoints'));
        add_action('after_setup_theme', array($this, 'create_gravity_write_ai_builder_table'));
        add_action('after_setup_theme', array($this, 'alter_gravity_write_ai_builder_table'));
    }

    public function add_admin_menu() {
        add_menu_page(
            'GW Website Builder', // Page title
            'GW Website Builder', // Menu title
            'manage_options',     
            'gw-website-builder', 
            array($this, 'settings_page_html'), 
            'dashicons-admin-generic', // Icon URL
            20 // Position
        );
    }

    public function settings_page_html() {
        
        if (!current_user_can('manage_options')) {
            return;
        }
        echo '<div id="root"></div>'; // This div will host our React app
    }

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


        wp_enqueue_script('lodash', 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js', array(), '4.17.21', true);
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
                #update-nag, .update-nag { display: none !important; }
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

    public function register_api_endpoints() {
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

    public function handle_update_status_request(WP_REST_Request $request) {
        $attempt_id = $request->get_param('attempt_id');
        $status = $request->get_param('status');

        if (empty($attempt_id) || !isset($status)) {
            return new WP_Error('rest_invalid', __('Attempt ID and status are required.'), array('status' => 400));
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'gravity_write_ai_builder';

        $existing_record = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE attempt_id = %d", $attempt_id));

        if (!$existing_record) {
            return new WP_Error('rest_not_found', __('No record found for the provided attempt ID.'), array('status' => 404));
        }

        $result = $wpdb->update(
            $table_name,
            array('status' => sanitize_text_field($status)),
            array('attempt_id' => sanitize_text_field($attempt_id))
        );

        if ($result === false) {
            return new WP_Error('rest_db_update_failed', __('Failed to update status in the database.'), array('status' => 500));
        }

        return new WP_REST_Response('Status updated successfully', 200);
    }

    public function handle_post_get_update_request(WP_REST_Request $request, $table_name, $data, $fields) {
        // Get the allowed domain dynamically
        $allowed_domain = home_url();
        $parsed_url = parse_url($allowed_domain);
        $allowed_domain = $parsed_url['scheme'] . '://' . $parsed_url['host'];

        // Check the origin of the request
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if ($origin !== $allowed_domain && !empty($origin)) {
            return new WP_Error('rest_forbidden', __('You are not allowed to access this resource.'), array('status' => 403));
        }

        global $wpdb;
        $table_name = $wpdb->prefix . $table_name;

        // Check if attempt_id is provided
        $attempt_id = $request->get_param('attempt_id');
        if (empty($attempt_id)) {
            return new WP_Error('rest_invalid', __('Attempt ID is required.'), array('status' => 400));
        }

        // Handle GET request
        if ($request->get_method() === 'GET') {
            $result = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE attempt_id = %d", $attempt_id));
            if (empty($result)) {
                return new WP_Error('rest_not_found', __('No record found for the provided attempt ID.'), array('status' => 404));
            }
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
        $existing_record = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE attempt_id = %d", $attempt_id));

        // Handle PUT (update) request
        if ($request->get_method() === 'PUT' && $existing_record) {
            if ($existing_record->status == '1') {
                return new WP_Error('rest_forbidden', __('Cannot update record with status 1.'), array('status' => 403));
            }
            $where = array('attempt_id' => sanitize_text_field($attempt_id));
            $result = $wpdb->update($table_name, $insert_data, $where);
            if ($result === false) {
                return new WP_Error('rest_db_update_failed', __('Failed to update data in the database.'), array('status' => 500));
            }
            return new WP_REST_Response('Data updated successfully', 200);
        }

        // Handle POST (create) request
        if ($existing_record) {
            if ($existing_record->status == '1') {
                return new WP_Error('rest_forbidden', __('Cannot update record with status 1.'), array('status' => 403));
            }
            $where = array('attempt_id' => sanitize_text_field($attempt_id));
            $result = $wpdb->update($table_name, $insert_data, $where);
            if ($result === false) {
                return new WP_Error('rest_db_update_failed', __('Failed to update data in the database.'), array('status' => 500));
            }
            return new WP_REST_Response('Data updated successfully', 200);
        } else {
            $insert_data['status'] = 'not started'; // Default status to 'not started' for new records
            $result = $wpdb->insert($table_name, $insert_data);
            if ($result === false) {
                return new WP_Error('rest_db_insert_failed', __('Failed to insert data into the database.'), array('status' => 500));
            }
            return new WP_REST_Response('Data inserted successfully', 201);
        }
    }

    public function upload_custom_logo(WP_REST_Request $request) {
        require_once(ABSPATH . 'wp-admin/includes/media.php');
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');

        // Check if the files are set and are not empty
        if (empty($_FILES) || !isset($_FILES['image'])) {
            return new WP_Error('no_image', 'No image file specified', array('status' => 400));
        }

        // Handle the uploaded file
        $file_handler = 'image';  // That’s the name attribute from your React form
        $attachment_id = media_handle_upload($file_handler, 0);
        if (is_wp_error($attachment_id)) {
            return $attachment_id; // Return the error details
        }

        // Get the URL of the uploaded image
        $image_url = wp_get_attachment_url($attachment_id);
        if (!$image_url) {
            return new WP_Error('upload_failed', 'Upload successful but could not retrieve image URL.', array('status' => 404));
        }

        // Return the attachment ID and URL
        return new WP_REST_Response(array(
            'id'  => $attachment_id,
            'url' => $image_url,
        ), 200);
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

        // Handle POST request to store a new attempt
        if ($request->get_method() === 'POST') {
            // Retrieve data from the request
            $attempt_data = $request->get_json_params();
            $attempt_id = sanitize_text_field($attempt_data['attempt_id']);

            // Insert the new attempt into the database
            $insert_data = array('attempt_id' => $attempt_id, 'status' => 'not started');
            $result = $wpdb->insert($table_name, $insert_data);

            if ($result === false) {
                return new WP_Error('rest_db_insert_failed', __('Failed to insert attempt into the database.'), array('status' => 500));
            }

            return new WP_REST_Response('Attempt inserted successfully', 201);
        }

        // Handle GET request to retrieve the latest attempt ID
        if ($request->get_method() === 'GET') {
            // Retrieve the latest attempt ID from the database
            $latest_attempt = $wpdb->get_row("SELECT attempt_id FROM $table_name ORDER BY id DESC LIMIT 1");

            if (empty($latest_attempt)) {
                return new WP_Error('rest_not_found', __('No attempts found.'), array('status' => 404));
            }

            return new WP_REST_Response(array('latest_attempt_id' => $latest_attempt->attempt_id), 200);
        }

        return new WP_Error('rest_invalid_method', __('Invalid request method.'), array('status' => 405));
    }
}

$gw_website_builder = new GW_Website_Builder();
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
?>
