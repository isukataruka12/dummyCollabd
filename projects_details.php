<?php
// Project details page
require_once 'database-config.php';

// Check if project ID is provided
if (!isset($_GET['id'])) {
    header('Location: projects.php');
    exit;
}

$projectId = $_GET['id'];
$project = null;
$applications = [];

try {
    // Get database connection
    $conn = getDbConnection();
    
    // Get project details
    $stmt = $conn->prepare("SELECT * FROM projects WHERE id = :id");
    $stmt->bindParam(':id', $projectId, PDO::PARAM_INT);
    $stmt->execute();
    
    $project = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$project) {
        // Project not found, redirect to projects page
        header('Location: projects.php');
        exit;
    }
    
    // Get project applications
    $stmt = $conn->prepare(
        "SELECT * FROM project_applications 
         WHERE project_id = :project_id 
         ORDER BY applied_at DESC"
    );
    $stmt->bindParam(':project_id', $projectId, PDO::PARAM_INT);
    $stmt->execute();
    
    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // Log error
    error_log("Database Error: " . $e->getMessage());
    
    // Set error message
    $errorMessage = "An error occurred while fetching project details.";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($project['title'] ?? 'Project Details'); ?> - Collabd</title>
    <!-- Include CSS stylesheets -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
</head>
<body>
    <!-- Header -->
    <header class="site-header">
        <div class="header-container">
            <div class="logo">
                <a href="index.html">
                    <img src="images/logo.png" alt="Collabd Logo">
                </a>
            </div>
            <nav class="main-nav">
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="projects.php" class="active">Projects</a></li>
                    <li><a href="workspace.html">Workspace</a></li>
                    <li><a href="login.html" class="btn">Log In</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main>
        <?php if (isset($errorMessage)): ?>
            <div class="error-message">
                <?php echo htmlspecialchars($errorMessage); ?>
            </div>
        <?php elseif ($project): ?>
            <section class="project-details">
                <div class="container">
                    <div class="back-link">
                        <a href="projects.php"><i class="fas fa-arrow-left"></i> Back to Projects</a>
                    </div>
                    
                    <div class="project-header">
                        <h1><?php echo htmlspecialchars($project['title']); ?></h1>
                        <div class="project-meta">
                            <span>
                                <i class="fas fa-user"></i>
                                <?php echo htmlspecialchars($project['creator']); ?>
                            </span>
                            <span>
                                <i class="fas fa-clock"></i>
                                <?php echo date('M d, Y', strtotime($project['created_at'])); ?>
                            </span>
                            <span>
                                <i class="fas fa-users"></i>
                                <?php echo $project['vacancies']; ?> 
                                <?php echo $project['vacancies'] == 1 ? 'Vacancy' : 'Vacancies'; ?>
                            </span>
                        </div>
                    </div>
                    
                    <div class="project-content">
                        <div class="project-description">
                            <h2>Description</h2>
                            <p><?php echo nl2br(htmlspecialchars($project['description'] ?? 'No description provided.')); ?></p>
                        </div>
                        
                        <?php if (!empty($project['tags'])): ?>
                            <div class="project-tags">
                                <h2>Technologies</h2>
                                <div class="tags-list">
                                    <?php foreach (explode(',', $project['tags']) as $tag): ?>
                                        <span class="project-tag"><?php echo htmlspecialchars(trim($tag)); ?></span>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        <?php endif; ?>
                        
                        <div class="project-actions">
                            <button id="apply-button" class="btn" data-project-id="<?php echo $project['id']; ?>">Apply Now</button>
                            <button id="open-vscode-button" class="btn btn-outline" data-project="<?php echo $project['title']; ?>">
                                <i class="fas fa-code"></i> Open in VS Code
                            </button>
                            <button id="open-github-button" class="btn btn-outline">
                                <i class="fab fa-github"></i> View on GitHub
                            </button>
                            <button id="open-discord-button" class="btn btn-outline">
                                <i class="fab fa-discord"></i> Join Discord
                            </button>
                        </div>
                    </div>
                    
                    <div class="project-applications">
                        <h2>Applications (<?php echo count($applications); ?>)</h2>
                        
                        <?php if (empty($applications)): ?>
                            <p>No applications yet. Be the first to apply!</p>
                        <?php else: ?>
                            <div class="applications-list">
                                <?php foreach ($applications as $application): ?>
                                    <div class="application-card">
                                        <div class="applicant-info">
                                            <div class="applicant-avatar">
                                                <img src="https://i.pravatar.cc/150?img=<?php echo abs(crc32($application['user_id'])) % 70; ?>" 
                                                     alt="<?php echo htmlspecialchars($application['user_name']); ?>">
                                            </div>
                                            <div class="applicant-details">
                                                <h3><?php echo htmlspecialchars($application['user_name']); ?></h3>
                                                <p class="applicant-email"><?php echo htmlspecialchars($application['user_email']); ?></p>
                                                <p class="applied-date">
                                                    Applied on <?php echo date('M d, Y', strtotime($application['applied_at'])); ?>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="application-status <?php echo strtolower($application['status']); ?>">
                                            <?php echo $application['status']; ?>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </section>
        <?php endif; ?>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">
                    <img src="images/logo.png" alt="Collabd Logo">
                    <p>Collaborative Development Platform</p>
                </div>
                <div class="footer-links">
                    <div class="link-group">
                        <h3>Platform</h3>
                        <ul>
                            <li><a href="index.html">Home</a></li>
                            <li><a href="projects.php">Projects</a></li>
                            <li><a href="workspace.html">Workspace</a></li>
                        </ul>
                    </div>
                    <div class="link-group">
                        <h3>Resources</h3>
                        <ul>
                            <li><a href="#">Documentation</a></li>
                            <li><a href="#">API</a></li>
                            <li><a href="#">Community</a></li>
                        </ul>
                    </div>
                    <div class="link-group">
                        <h3>Company</h3>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Contact</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="copyright">
                <p>&copy; 2025 Collabd. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- JavaScript files -->
    <script src="js/database-integration.js"></script>
    <script src="js/service-redirects.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Get the current user data
            const userData = UserDatabaseManager.getCurrentUser();
            
            // Handle apply button
            const applyButton = document.getElementById('apply-button');
            if (applyButton) {
                const projectId = applyButton.getAttribute('data-project-id');
                
                // Check if user is logged in
                if (!userData) {
                    applyButton.addEventListener('click', function() {
                        alert('Please log in to apply for this project');
                        window.location.href = 'login.html';
                    });
                } else {
                    // Check if user has already applied
                    ProjectsDatabaseManager.hasUserApplied(projectId, userData.id)
                        .then(hasApplied => {
                            if (hasApplied) {
                                applyButton.textContent = 'Applied';
                                applyButton.disabled = true;
                                applyButton.style.backgroundColor = '#00b894';
                                applyButton.style.color = 'white';
                                applyButton.style.borderColor = '#00b894';
                            } else {
                                // Set up apply button
                                applyButton.addEventListener('click', async function() {
                                    try {
                                        await ProjectsDatabaseManager.applyForProject(projectId, userData);
                                        
                                        // Update UI
                                        applyButton.textContent = 'Applied';
                                        applyButton.disabled = true;
                                        applyButton.style.backgroundColor = '#00b894';
                                        applyButton.style.color = 'white';
                                        applyButton.style.borderColor = '#00b894';
                                        
                                        // Reload page to show updated applications
                                        alert('Application submitted successfully!');
                                        window.location.reload();
                                    } catch (error) {
                                        console.error('Error applying for project:', error);
                                        alert('Failed to apply for project. Please try again later.');
                                    }
                                });
                            }
                        })
                        .catch(error => {
                            console.error('Error checking application status:', error);
                        });
                }
            }
            
            // Handle service buttons
            const vscodeButton = document.getElementById('open-vscode-button');
            if (vscodeButton) {
                vscodeButton.addEventListener('click', function() {
                    const project = vscodeButton.getAttribute('data-project');
                    redirectToVSCode(project);
                });
            }
            
            const githubButton = document.getElementById('open-github-button');
            if (githubButton) {
                githubButton.addEventListener('click', function() {
                    redirectToGitHub();
                });
            }
            
            const discordButton = document.getElementById('open-discord-button');
            if (discordButton) {
                discordButton.addEventListener('click', function() {
                    redirectToDiscord('Collabd');
                });
            }
        });
    </script>