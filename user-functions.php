<?php
/**
 * Class for handling user details retrieval from an API using WordPress admin panel.
 */
class Ai_Builder_User_Details {

    /**
     * Constructor that adds the action to admin_init.
     */
    public function __construct() {
        add_action('admin_init', array($this, 'fetch_user_details'));
    }

    /**
     * Fetch user details using cURL by extracting data from $_GET superglobal and save them in the options table.
    */

    function fetch_user_data_from_api1() {
        $api_url = 'https://api.gravitywrite.com/api/get-user-details';
        $bearer_token = get_option('api_user_token', true);
    
        $args = [
            'headers' => [
                'Authorization' => 'Bearer ' . $bearer_token,
            ],
        ];
    
        $response = wp_remote_get($api_url, $args);
    
        if (is_wp_error($response)) {
            return 'Error fetching data';
        }
    
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
    
        if (empty($data)) {
            return 'No user data found';
        }
    
        if (!empty($data)) {
            return [
                'name'          => sanitize_text_field($data['user_name']),
                'email'         => sanitize_email($data['user_email']),
                'gravator'      => esc_url_raw($data['gravator']),
                'plan_detail'   => sanitize_text_field($data['plan_name']),
                'website_used'  => intval($data['ai_websites_used']),
                'website_total' => intval($data['ai_websites_total']),
            ];
        }
    
        return null;
    }

    // Function to save or update user data in the database
    function save_user_data_to_database1($user_data) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'gw_user_plan_details';
    
        // Always use the row with ID 1 for saving/updating
        $specific_id = 1;
    
        $existing_user = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM $table_name WHERE id = %d", $specific_id
        ));
    
        if ($existing_user) {
            // If the row with ID 1 exists, perform an update
            $updated = $wpdb->update(
                $table_name,
                [
                    'name'          => $user_data['name'],
                    'email'         => $user_data['email'],
                    'plan_detail'   => $user_data['plan_detail'],
                    'gravator'      => $user_data['gravator'],
                    'website_used'  => $user_data['website_used'],
                    'website_total' => $user_data['website_total']
                ],
                ['id' => $specific_id], // Where clause (based on ID)
                [
                    '%s',
                    '%s',
                    '%s',
                    '%s',
                    '%d',
                    '%d'
                ],
                ['%d'] // Where format for the ID
            );
    
            if ($updated !== false) {
                return 'User data updated successfully.';
            } else {
                return 'Failed to update user data.';
            }
        } else {
            // If the row with ID 1 does not exist, perform an insert with ID 1
            $inserted = $wpdb->insert(
                $table_name,
                [
                    'id'            => $specific_id, // Set ID to 1 for this row
                    'name'          => $user_data['name'],
                    'email'         => $user_data['email'],
                    'plan_detail'   => $user_data['plan_detail'],
                    'gravator'      => $user_data['gravator'],
                    'website_used'  => $user_data['website_used'],
                    'website_total' => $user_data['website_total']
                ],
                [
                    '%d',
                    '%s',
                    '%s',
                    '%s',
                    '%s',
                    '%d',
                    '%d'
                ]
            );
    
            if ($inserted) {
                return 'User data inserted successfully.';
            } else {
                return 'Failed to insert user data.';
            }
        }
    }
    
    function fetch_user_details() {
        //echo get_option('api_user_token',true);exit;
        if (!is_admin() || 'gravitywrite_settings' !== ($_GET['page'] ?? '')) {
            return;
        }
    
        $email = $_GET['email'] ?? '';
        $token = $_GET['wp_token'] ?? '';
        $fe_token = $_GET['fe_token'] ?? '';
             
        $email = sanitize_email($email);
        $token = sanitize_text_field($token);
        $fe_token = sanitize_text_field($fe_token);
    
        if (empty($email) || empty($token)) {
            return;
        }
    
        $api_url = 'https://api.gravitywrite.com/api/connect-status';
       
        $current_domain = home_url();
        //echo $current_domain;

        $response = wp_remote_post($api_url, [
            'method'    => 'POST',
            'headers'   => [
                'Content-Type'  => 'application/x-www-form-urlencoded',
                'Authorization' => 'Bearer ' . $token,
            ],
            'body'      => http_build_query([
                'status' => 1,
                'domain' => $current_domain,
            ]),
        ]);
    
        if (empty($response)) {
            add_action('admin_notices', function() {
                echo '<div class="notice notice-error"><p>Something went wrong. The response is empty.</p></div>';
            });
            return; // Stop further execution
        }
        //print_r($response);
        if (is_wp_error($response)) {
            $error_message = $response->get_error_message();
            add_action('admin_notices', function() use ($error_message) {
                echo '<div class="notice notice-error"><p>Failed to connect to the API. Error: ' . esc_html($error_message) . '</p></div>';
            });
            return;
        }
    
        $response_body = wp_remote_retrieve_body($response);
        //print_r($response_body);exit;
        $data = json_decode($response_body, true);
       
        // Check for API errors and print the actual error message
        if (isset($data['error']) && isset($data['message'])) {
            $error_message = $data['message']; 
            //echo $error_message;exit;
            add_action('admin_notices', function() use ($error_message) {
                echo '<div class="notice notice-error"><p>' . esc_html($error_message) . '</p></div>';
                
                //Token is Expired Login with gravitywrite settings here
                $current_page_url = esc_url(add_query_arg([], admin_url($GLOBALS['pagenow']) . '?' . $_SERVER['QUERY_STRING']));
                
                ?>
            
            <div class="wrap">
                <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">GravityWrite: Settings</h1>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
                    <h2 style="font-size: 18px; font-weight: 500;">
                        <img src="https://plugin.mywpsite.org/wp-content/uploads/logo/Icon-blue.svg" alt="GravityWrite Icon" style="width: 25px; height: 25px; vertical-align: middle; margin-right: 8px;">
                        Optimize with GravityWrite
                    </h2>
                    <p style="font-size: 16px; color: #555; max-width: 1100px;">
                        Boost your SEO game with our seamless content transfer between GravityWrite Content Editor and WordPress. Refine and perfect your articles effortlessly, ensuring your SEO strategy is never left to luck. Create content that ranks with GravityWrite in WordPress today!
                    </p>

                    <a href="https://app.gravitywrite.com/login?callback_url=<?php echo ($current_page_url); ?>&domain=wordpress" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #2E42FF; color: white; text-decoration: none; border-radius: 5px;">
                        Log in and integrate with GravityWrite
                    </a>
                </div>
                <p style="margin-top: 20px; font-size: 14px; color: #555;">
                    In case of questions or troubles, please check our 
                    <a href="#" style="color: #2E42FF;">documentation</a> or contact our 
                    <a href="#" style="color: #2E42FF;">support team</a>.
                </p>
            </div>
            <?php
            
            exit;
            });
           
        }
        if (isset($data['wp_status']) && $data['wp_status'] === 'Connected') {
            update_option('gravitywrite_account_key', 'connected');
            update_option('api_user_email', $email);
            update_option('api_user_token', $token);
            update_option('api_user_fe_token', $fe_token);
        
    
            $user_data = $this->fetch_user_data_from_api1();
    
            if ($user_data) {
                $result = $this->save_user_data_to_database1($user_data);
                if ($result === false) {
                    add_action('admin_notices', function() {
                        echo '<div class="notice notice-error"><p>Failed to save user data to the database.</p></div>';
                    });
                }
            } else {
                add_action('admin_notices', function() {
                    echo '<div class="notice notice-error"><p>No user data fetched from API. Please check your credentials.</p></div>';
                });
            }
        } else {
             if (isset($data['error']) && strpos($data['error'], 'Unauthorized')) {
                add_action('admin_notices', function() {
                    update_option('gravitywrite_account_key','disconnected');
                    // Truncate the table
                    global $wpdb;
                    $table_name = $wpdb->prefix . 'gw_user_plan_details';
                    $wpdb->query("TRUNCATE TABLE {$table_name}");
                    
                    echo '<div class="notice notice-error"><p>Your token is expired Unauthorized. Please login again.</p></div>';
                });
             }
            
        }
    }


    
}

// Instantiate the class to ensure it gets loaded and hooks are set.
new Ai_Builder_User_Details();
