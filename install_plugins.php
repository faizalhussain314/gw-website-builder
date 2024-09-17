<?php
function install_plugins($plugins) {

    $upgrader = new Plugin_Upgrader(new WP_Ajax_Upgrader_Skin());
    $errors = array();

    foreach ($plugins as $plugin_slug) {
        $plugin_path = WP_PLUGIN_DIR . '/' . $plugin_slug . '/' . $plugin_slug . '.php';
        
        if (!file_exists($plugin_path)) {
            $result = $upgrader->install('https://downloads.wordpress.org/plugin/' . $plugin_slug . '.zip');
            if (is_wp_error($result)) {
                $errors[$plugin_slug] = $result->get_error_message();
                continue;
            }
        }

        if (!is_plugin_active($plugin_path)) {
            $activate = activate_plugin($plugin_path);
            if (is_wp_error($activate)) {
                $errors[$plugin_slug] = $activate->get_error_message();
                continue;
            }
        }
    }

    if (empty($errors)) {
        return ['success' => true, 'message' => 'Plugins installed and activated successfully'];
    } else {
        return ['success' => false, 'error' => $errors];
    }
}
?>
