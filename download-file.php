<?php

function download_file($url, $local_path) {
    if (!ini_get('allow_url_fopen')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $file_data = curl_exec($ch);
        $error = curl_error($ch);
        curl_close($ch);
        if ($file_data === false) {
            echo "CURL Error: $error";
            return false;
        }
    } else {
        $file_data = file_get_contents($url);
        if ($file_data === false) {
            return false;
        }
    }
    
    $save_result = file_put_contents($local_path, $file_data);
    return $save_result !== false;
}
?>