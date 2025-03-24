<?php
// API for managing projects
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
    case 'projects':
        handleProjects($method);
        break;
    case 'apply':
        handleProjectApplication($method);
        break;
    case 'applications':
        handleProjectApplications($method);
        break;
    default:
        // Return 404 for undefined endpoints
        http_response_code(404);
        echo json_encode(array('error' => 'Endpoint not found'));
        break;
}

// Handle projects endpoint
function handleProjects($method) {
    switch ($method) {
        case 'GET':
            getProjects();
            break;
        case 'POST':
            createProject();
            break;
        case 'PUT':
            updateProject();
            break;
        case 'DELETE':
            deleteProject();
            break;
        default:
            http_response_code(405); // Method Not Allowed
            echo json_encode(array('error' => 'Method not allowed'));
            break;
    }
}

// Get all projects
function getProjects() {
    try {
        $conn = getDbConnection();
        
        // Check for project ID parameter
        if (isset($_GET['id'])) {
            $stmt = $conn->prepare("SELECT * FROM projects WHERE id = :id");
            $stmt->bindParam(':id', $_GET['id'], PDO::PARAM_INT);
            $stmt->execute();
            $project = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($project) {
                echo json_encode($project);
            } else {
                http_response_code(404);
                echo json_encode(array('error' => 'Project not found'));
            }
        } else {
            // Get all projects with optional filtering
            $query = "SELECT * FROM projects";
            
            // Handle search/filter
            if (isset($_GET['search'])) {
                $search = '%' . $_GET['search'] . '%';
                $query .= " WHERE title LIKE :search OR description LIKE :search OR tags LIKE :search";
            }
            
            // Handle sorting
            if (isset($_GET['sort'])) {
                switch ($_GET['sort']) {
                    case 'newest':
                        $query .= " ORDER BY created_at DESC";
                        break;
                    case 'oldest':
                        $query .= " ORDER BY created_at ASC";
                        break;
                    case 'vacancies':
                        $query .= " ORDER BY vacancies DESC";
                        break;
                    default:
                        $query .= " ORDER BY created_at DESC";
                        break;
                }
            } else {
                $query .= " ORDER BY created_at DESC";
            }
            
            $stmt = $conn->prepare($query);
            
            if (isset($_GET['search'])) {
                $stmt->bindParam(':search', $search, PDO::PARAM_STR);
            }
            
            $stmt->execute();
            $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode($projects);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
    }
}

// Create a new project
function createProject() {
    try {
        // Get JSON request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($data['title']) || !isset($data['creator'])) {
            http_response_code(400);
            echo json_encode(array('error' => 'Missing required fields (title, creator)'));
            return;
        }
        
        $conn = getDbConnection();
        
        // Insert new project
        $stmt = $conn->prepare("
            INSERT INTO projects (title, description, vacancies, creator, tags) 
            VALUES (:title, :description, :vacancies, :creator, :tags)
        ");
        
        $stmt->bindParam(':title', $data['title'], PDO::PARAM_STR);
        $stmt->bindParam(':description', $data['description'], PDO::PARAM_STR);
        $stmt->bindParam(':vacancies', $data['vacancies'], PDO::PARAM_INT);
        $stmt->bindParam(':creator', $data['creator'], PDO::PARAM_STR);
        $stmt->bindParam(':tags', $data['tags'], PDO::PARAM_STR);
        
        $stmt->execute();
        
        // Get the newly created project ID
        $projectId = $conn->lastInsertId();
        
        // Fetch and return the created project
        $stmt = $conn->prepare("SELECT * FROM projects WHERE id = :id");
        $stmt->bindParam(':id', $projectId, PDO::PARAM_INT);
        $stmt->execute();
        $project = $stmt->fetch(PDO::FETCH_ASSOC);
        
        http_response_code(201); // Created
        echo json_encode($project);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
    }
}

// Update an existing project
function updateProject() {
    try {
        // Get JSON request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(array('error' => 'Missing project ID'));
            return;
        }
        
        $conn = getDbConnection();
        
        // Build the update query dynamically based on provided fields
        $query = "UPDATE projects SET updated_at = CURRENT_TIMESTAMP";
        $params = array();
        
        if (isset($data['title'])) {
            $query .= ", title = :title";
            $params[':title'] = $data['title'];
        }
        
        if (isset($data['description'])) {
            $query .= ", description = :description";
            $params[':description'] = $data['description'];
        }
        
        if (isset($data['vacancies'])) {
            $query .= ", vacancies = :vacancies";
            $params[':vacancies'] = $data['vacancies'];
        }
        
        if (isset($data['tags'])) {
            $query .= ", tags = :tags";
            $params[':tags'] = $data['tags'];
        }
        
        $query .= " WHERE id = :id";
        $params[':id'] = $data['id'];
        
        // Execute the update
        $stmt = $conn->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->execute();
        
        // Check if the project exists and was updated
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(array('error' => 'Project not found'));
            return;
        }
        
        // Fetch and return the updated project
        $stmt = $conn->prepare("SELECT * FROM projects WHERE id = :id");
        $stmt->bindParam(':id', $data['id'], PDO::PARAM_INT);
        $stmt->execute();
        $project = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode($project);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
    }
}

// Delete a project
function deleteProject() {
    try {
        // Get JSON request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(array('error' => 'Missing project ID'));
            return;
        }
        
        $conn = getDbConnection();
        
        // Delete the project
        $stmt = $conn->prepare("DELETE FROM projects WHERE id = :id");
        $stmt->bindParam(':id', $data['id'], PDO::PARAM_INT);
        $stmt->execute();
        
        // Check if the project exists and was deleted
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(array('error' => 'Project not found'));
            return;
        }
        
        echo json_encode(array('success' => true, 'message' => 'Project deleted successfully'));
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
    }
}

// Handle project application (apply for a project)
function handleProjectApplication($method) {
    if ($method !== 'POST') {
        http_response_code(405); // Method Not Allowed
        echo json_encode(array('error' => 'Method not allowed'));
        return;
    }
    
    try {
        // Get JSON request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($data['project_id']) || !isset($data['user_id']) || 
            !isset($data['user_name']) || !isset($data['user_email'])) {
            http_response_code(400);
            echo json_encode(array('error' => 'Missing required fields'));
            return;
        }
        
        $conn = getDbConnection();
        
        // Check if project exists and has vacancies
        $stmt = $conn->prepare("SELECT * FROM projects WHERE id = :id");
        $stmt->bindParam(':id', $data['project_id'], PDO::PARAM_INT);
        $stmt->execute();
        $project = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$project) {
            http_response_code(404);
            echo json_encode(array('error' => 'Project not found'));
            return;
        }
        
        if ($project['vacancies'] <= 0) {
            http_response_code(400);
            echo json_encode(array('error' => 'No vacancies available for this project'));
            return;
        }
        
        // Check if user has already applied
        $stmt = $conn->prepare(
            "SELECT * FROM project_applications 
             WHERE project_id = :project_id AND user_id = :user_id"
        );
        $stmt->bindParam(':project_id', $data['project_id'], PDO::PARAM_INT);
        $stmt->bindParam(':user_id', $data['user_id'], PDO::PARAM_STR);
        $stmt->execute();
        
        if ($stmt->fetch(PDO::FETCH_ASSOC)) {
            http_response_code(400);
            echo json_encode(array('error' => 'You have already applied to this project'));
            return;
        }
        
        // Insert application
        $stmt = $conn->prepare(
            "INSERT INTO project_applications (project_id, user_id, user_name, user_email) 
             VALUES (:project_id, :user_id, :user_name, :user_email)"
        );
        $stmt->bindParam(':project_id', $data['project_id'], PDO::PARAM_INT);
        $stmt->bindParam(':user_id', $data['user_id'], PDO::PARAM_STR);
        $stmt->bindParam(':user_name', $data['user_name'], PDO::PARAM_STR);
        $stmt->bindParam(':user_email', $data['user_email'], PDO::PARAM_STR);
        $stmt->execute();
        
        // Decrease vacancy count
        $stmt = $conn->prepare(
            "UPDATE projects SET vacancies = vacancies - 1 WHERE id = :id AND vacancies > 0"
        );
        $stmt->bindParam(':id', $data['project_id'], PDO::PARAM_INT);
        $stmt->execute();
        
        // Return success
        http_response_code(201); // Created
        echo json_encode(array(
            'success' => true, 
            'message' => 'Application submitted successfully'
        ));
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
    }
}

// Handle getting project applications
function handleProjectApplications($method) {
    if ($method !== 'GET') {
        http_response_code(405); // Method Not Allowed
        echo json_encode(array('error' => 'Method not allowed'));
        return;
    }
    
    try {
        // Validate project ID
        if (!isset($_GET['project_id'])) {
            http_response_code(400);
            echo json_encode(array('error' => 'Missing project ID'));
            return;
        }
        
        $conn = getDbConnection();
        
        // Get applications for the project
        $stmt = $conn->prepare(
            "SELECT * FROM project_applications 
             WHERE project_id = :project_id 
             ORDER BY applied_at DESC"
        );
        $stmt->bindParam(':project_id', $_GET['project_id'], PDO::PARAM_INT);
        $stmt->execute();
        $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($applications);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
    }
}