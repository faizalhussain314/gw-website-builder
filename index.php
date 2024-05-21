<?php
/**
 * Plugin Name: Vite React Plugin Test
 * Description: A WordPress plugin that uses Vite and React.
 * Version: 1.0
 * Author: Your Name
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class ViteReactPlugin {
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
    }

    public function add_admin_menu() {
        add_menu_page(
            'Vite React Plugin',     // Page title
            'Vite React Settings',   // Menu title
            'manage_options',        // Capability
            'vite-react-plugin',     // Menu slug
            array($this, 'settings_page_html'), // Callback function
            'dashicons-admin-generic', // Icon URL
            20                        // Position
        );
    }

    public function settings_page_html() {
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            return;
        }

        echo '<div id="root"></div>'; // This div will host our React app
    }

    public function enqueue_scripts($hook) {
        // Only add scripts on the specific admin page for your plugin
        if ('toplevel_page_vite-react-plugin' !== $hook) {
            return;
        }

        // Dynamically get script path
        $script_path_js = $this->get_asset_path('js');
        $script_path_css = $this->get_asset_path('css');

        wp_enqueue_script('vite-react-app-js', $script_path_js, array(), '1.0', true);
        wp_enqueue_style('vite-react-app-css', $script_path_css, array(), '1.0', 'all');
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
}

$viteReactPlugin = new ViteReactPlugin();
?>