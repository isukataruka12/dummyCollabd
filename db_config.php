<?php
// Database configuration file

// Define database connection constants
define('DB_HOST', 'localhost');
define('DB_USER', 'collabd_user');
define('DB_PASS', 'your_secure_password');
define('DB_NAME', 'collabd_db');

// Create a PDO database connection
function getDbConnection() {
    try {
        $conn = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
            DB_USER,
            DB_PASS,
            array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
        );
        
        return $conn;
    } catch(PDOException $e) {
        // Log error (to a file in production)
        error_log("Database Connection Error: " . $e->getMessage());
        
        // Return error as JSON
        http_response_code(500);
        echo json_encode(array("error" => "Database connection failed"));
        exit;
    }
}