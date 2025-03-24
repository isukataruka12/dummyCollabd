<?php
// API for managing users and service connections
require_once 'database-config.php';

// Set headers for JSON API
header('Content-Type: application/json');

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

// Get the request path
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path_parts = explode('/', trim($path, '/'));
$endpoint = end($path_parts);

// Handle routing based on endpoint and method
switch ($endpoint) {
    case 'users':
        handleUsers($method);
        break;
    case 'services':
        handleServices($method);
        break;
    default:
        // Return 404 for undefined endpoints
        http_response_code(404);
        echo json_encode(array('error' => 'Endpoint not found'));
        break;
}

// Handle users endpoint
function handleUsers($method) {
    switch ($method) {
        case 'GET':
            getUser();
            break;
        case 'POST':
            createUser();
            break;
        case 'PUT':
            updateUser();
            break;
        default:
            http_response_code(405); // Method Not Allowed
            echo json_encode(array('error' => 'Method not allowed'));
            break;
    }
}

// Get user by ID
function getUser() {
    try {
        // Check for user ID parameter
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(array('error' => 'Missing user ID'));
            return;
        }
        
        $conn = getDbConnection();
        
        $stmt = $conn->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->bindParam(':id', $_GET['id'], PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            // Get user's service connections
            $stmt = $conn->prepare(
                "SELECT service_name, username, connected, connected_at 
                 FROM service_connections 
                 WHERE user_id = :user_id"
            );
            $stmt->bindParam(':user_id', $_GET['id'], PDO::PARAM_STR);
            $stmt->execute();
            $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Add services to user data
            $user['services'] = $services;
            
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(array('error' => 'User not found'));
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
    }
}

// Create a new user
function createUser() {
    try {
        // Get JSON request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($data['id']) || !isset($data['full_name']) || 
            !isset($data['username']) || !isset($data['email'])) {
            http_response_code(400);
            echo json_encode(array('error' => 'Missing required fields'));
            return;
        }
        
        $conn = getDbConnection();
        
        // Check if username or email already exists
        $stmt = $conn->prepare(
            "SELECT COUNT(*) as count FROM users 
             WHERE username = :username OR email = :email"
        );
        $stmt->bindParam(':username', $data['username'], PDO::PARAM_STR);
        $stmt->bindParam(':email', $data['email'], PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result['count'] > 0) {
            http_response_code(409); // Conflict
            echo json_encode(array('error' => 'Username or email already exists'));
            return;
        }
        
        // Insert new user
        $stmt = $conn->prepare(
            "INSERT INTO users (id, full_name, username, email, bio, location, 
             github_username, discord_username, profile_visible, show_email, 
             show_online_status, profile_picture) 
             VALUES (:id, :full_name, :username, :email, :bio, :location,
             :github_username, :discord_username, :profile_visible, :show_email,
             :show_online_status, :profile_picture)"
        );
        
        // Bind parameters
        $stmt->bindParam(':id', $data['id'], PDO::PARAM_STR);
        $stmt->bindParam(':full_name', $data['full_name'], PDO::PARAM_STR);
        $stmt->bindParam(':username', $data['username'], PDO::PARAM_STR);
        $stmt->bindParam(':email', $data['email'], PDO::PARAM_STR);
        $stmt->bindParam(':bio', $data['bio'] ?? '', PDO::PARAM_STR);
        $stmt->bindParam(':location', $data['location'] ?? '', PDO::PARAM_STR);
        $stmt->bindParam(':github_username', $data['github_username'] ?? '', PDO::PARAM_STR);
        $stmt->bindParam(':discord_username', $data['discord_username'] ?? '', PDO::PARAM_STR);
        
        // Set boolean values with defaults
        $profileVisible = isset($data['profile_visible']) ? $data['profile_visible'] : true;
        $showEmail = isset($data['show_email']) ? $data['show_email'] : true;
        $showOnlineStatus = isset($data['show_online_status']) ? $data['show_online_status'] : false;
        
        $stmt->bindParam(':profile_visible', $profileVisible, PDO::PARAM_BOOL);
        $stmt->bindParam(':show_email', $showEmail, PDO::PARAM_BOOL);
        $stmt->bindParam(':show_online_status', $showOnlineStatus, PDO::PARAM_BOOL);
        $stmt->bindParam(':profile_picture', $data['profile_picture'] ?? null, PDO::PARAM_STR);
        
        $stmt->execute();
        
        // Handle service connections if provided
        if (isset($data['services']) && is_array($data['services'])) {
            foreach ($data['services'] as $service) {
                if (!isset($service['service_name']) || !isset($service['username'])) {
                    continue; // Skip invalid service entries
                }
                
                connectService($conn, $data['id'], $service['service_name'], $service['username']);
            }
        }
        
        http_response_code(201); // Created
        echo json_encode(array(
            'success' => true,
            'message' => 'User created successfully',
            'user_id' => $data['id']
        ));
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
    }
}

// Update an existing user
function updateUser() {
    try {
        // Get JSON request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(array('error' => 'Missing user ID'));
            return;
        }
        
        $conn = getDbConnection();
        
        // Check if user exists
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM users WHERE id = :id");
        $stmt->bindParam(':id', $data['id'], PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result['count'] === 0) {
            http_response_code(404);
            echo json_encode(array('error' => 'User not found'));
            return;
        }
        
        // Build the update query dynamically based on provided fields
        $query = "UPDATE users SET updated_at = CURRENT_TIMESTAMP";
        $params = array();
        
        $fields = [
            'full_name', 'username', 'email', 'bio', 'location', 'github_username',
            'discord_username', 'profile_visible', 'show_email', 'show_online_status', 
            'profile_picture'
        ];
        
        foreach ($fields as $field) {
            if (isset($data[$field])) {
                $query .= ", $field = :$field";
                $params[":$field"] = $data[$field];
            }
        }
        
        $query .= " WHERE id = :id";
        $params[':id'] = $data['id'];
        
        // Execute the update
        $stmt = $conn->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->execute();
        
        // Handle service connections if provided
        if (isset($data['services']) && is_array($data['services'])) {
            foreach ($data['services'] as $service) {
                if (!isset($service['service_name'])) {
                    continue; // Skip invalid service entries
                }
                
                if (isset($service['connected']) && $service['connected'] === false) {
                    disconnectService($conn, $data['id'], $service['service_name']);
                } else if (isset($service['username'])) {
                    connectService($conn, $data['id'], $service['service_name'], $service['username']);
                }
            }
        }
        
        echo json_encode(array(
            'success' => true,
            'message' => 'User updated successfully'
        ));
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
    }
}

// Handle services endpoint
function handleServices($method) {
    switch ($method) {
        case 'GET':
            getServices();
            break;
        case 'POST':
            connectUserService();
            break;
        case 'DELETE':
            disconnectUserService();
            break;
        default:
            http_response_code(405); // Method Not Allowed
            echo json_encode(array('error' => 'Method not allowed'));
            break;
    }
}

// Get services for a user
function getServices() {
    try {
        // Check for user ID parameter
        if (!isset($_GET['user_id'])) {
            http_response_code(400);
            echo json_encode(array('error' => 'Missing user ID'));
            return;
        }
        
        $conn = getDbConnection();
        
        $stmt = $conn->prepare(
            "SELECT service_name, username, connected, connected_at, disconnected_at 
             FROM service_connections 
             WHERE user_id = :user_id"
        );
        $stmt->bindParam(':user_id', $_GET['user_id'], PDO::PARAM_STR);
        $stmt->execute();
        $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($services);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
    }
}

// Connect a user to a service
function connectUserService() {
    try {
        // Get JSON request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($data['user_id']) || !isset($data['service_name']) || !isset($data['username'])) {
            http_response_code(400);
            echo json_encode(array('error' => 'Missing required fields'));
            return;
        }
        
        $conn = getDbConnection();
        
        // Connect the service
        connectService($conn, $data['user_id'], $data['service_name'], $data['username']);
        
        echo json_encode(array(
            'success' => true,
            'message' => 'Service connected successfully'
        ));
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
    }
}

// Disconnect a user from a service
function disconnectUserService() {
    try {
        // Get JSON request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($data['user_id']) || !isset($data['service_name'])) {
            http_response_code(400);
            echo json_encode(array('error' => 'Missing required fields'));
            return;
        }
        
        $conn = getDbConnection();
        
        // Disconnect the service
        disconnectService($conn, $data['user_id'], $data['service_name']);
        
        echo json_encode(array(
            'success' => true,
            'message' => 'Service disconnected successfully'
        ));
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
    }
}

// Helper function to connect a service
function connectService($conn, $userId, $serviceName, $username) {
    // Check if the connection exists
    $stmt = $conn->prepare(
        "SELECT * FROM service_connections 
         WHERE user_id = :user_id AND service_name = :service_name"
    );
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_STR);
    $stmt->bindParam(':service_name', $serviceName, PDO::PARAM_STR);
    $stmt->execute();
    
    $connection = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($connection) {
        // Update existing connection
        $stmt = $conn->prepare(
            "UPDATE service_connections 
             SET username = :username, connected = TRUE, 
             connected_at = CURRENT_TIMESTAMP, disconnected_at = NULL
             WHERE user_id = :user_id AND service_name = :service_name"
        );
    } else {
        // Create new connection
        $stmt = $conn->prepare(
            "INSERT INTO service_connections (user_id, service_name, username, connected) 
             VALUES (:user_id, :service_name, :username, TRUE)"
        );
    }
    
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_STR);
    $stmt->bindParam(':service_name', $serviceName, PDO::PARAM_STR);
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    
    $stmt->execute();
    
    // If it's GitHub or Discord, also update the user record
    if ($serviceName === 'github' || $serviceName === 'discord') {
        $field = $serviceName . '_username';
        $stmt = $conn->prepare("UPDATE users SET $field = :username WHERE id = :user_id");
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_STR);
        $stmt->execute();
    }
    
    return true;
}

// Helper function to disconnect a service
function disconnectService($conn, $userId, $serviceName) {
    $stmt = $conn->prepare(
        "UPDATE service_connections 
         SET connected = FALSE, disconnected_at = CURRENT_TIMESTAMP
         WHERE user_id = :user_id AND service_name = :service_name"
    );
    
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_STR);
    $stmt->bindParam(':service_name', $serviceName, PDO::PARAM_STR);
    
    $stmt->execute();
    
    return true;
}