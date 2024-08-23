<?php 
function save_or_update_form_details($data) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'gw_user_form_details';

    // Encode any array or JSON data from the request
    $data = array_map(function($item) {
        return is_array($item) ? json_encode($item) : $item;
    }, $data);

    // Check if there is already an existing row
    $exists = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");

    if ($exists) {
        // Update existing row
        $result = $wpdb->update($table_name, $data, ['id' => 1]); // assuming id is known and constant
    } else {
        // Insert new row if no existing data
        $result = $wpdb->insert($table_name, $data);
    }

    return $result !== false;
}
function get_form_details_from_database($field_list) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'gw_user_form_details';

    // Prepare SQL SELECT clause safely to avoid SQL injection
    $select_fields = array_map(function($field) use ($wpdb) {
        $safe_field = $wpdb->_real_escape($field);
        return "`$safe_field`";
    }, $field_list);

    // Construct the SQL query
    $sql = $wpdb->prepare("SELECT " . implode(', ', $select_fields) . " FROM `$table_name` WHERE id = %d", 1);

    // Execute the query
    $result = $wpdb->get_results($sql, ARRAY_A);

    // Return only the first result as an object, or an empty object if no results
    return !empty($result) ? $result[0] : new stdClass();
}


?>