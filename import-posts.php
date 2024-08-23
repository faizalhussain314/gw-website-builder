<?php
function import_posts($file_url) {
    $plugin_dir = plugin_dir_path(__FILE__);
    $local_file_path = $plugin_dir . basename($file_url);

    // Download the file
    if (!download_file($file_url, $local_file_path)) {
        return ['Failed to download the file from: ' . $file_url]; // Return error message as an array
    }

    $import_results = [];
    $wp_importer = new GW_Import(); // Make sure GW_Import is defined or included
    $wp_importer->fetch_attachments = true;

    if (!file_exists($local_file_path)) {
        $import_results[] = 'The file does not exist: ' . $local_file_path;
    } else {
        ob_start();
        $import_result = $wp_importer->import($local_file_path);
        ob_end_clean();
        $import_results[] = is_wp_error($import_result) ? 'Import failed for ' . basename($local_file_path) . ': ' . $import_result->get_error_message() : 'Import successful for ' . basename($local_file_path);
    }

    return $import_results;
}

?>
