<?php 

function install_theme() {
    $theme_slug = 'hello-elementor'; // Theme slug to install
    $theme_path = WP_CONTENT_DIR . '/themes/' . $theme_slug;

    if (!file_exists($theme_path)) {
        $upgrader = new Theme_Upgrader(new WP_Ajax_Upgrader_Skin());
        $result = $upgrader->install('https://downloads.wordpress.org/theme/' . $theme_slug . '.zip');
        
        // Check if there was an error during the installation
        if (is_wp_error($result)) {
            return ['success' => false, 'error' => $result->get_error_message()];
        }
    }

    // Check if the current active theme is not the one we've just installed
    $current_theme = wp_get_theme();
    if ($current_theme->get_template() !== $theme_slug) {
        $activate = switch_theme($theme_slug);
        if (is_wp_error($activate)) {
            return ['success' => false, 'error' => $activate->get_error_message()];
        }
    }

    return ['success' => true, 'message' => 'Theme installed and activated successfully'];
}

?>