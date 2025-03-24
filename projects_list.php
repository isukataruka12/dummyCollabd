<?php
// Projects list page
require_once 'database-config.php';

// Get search, filter, and sort parameters
$search = isset($_GET['search']) ? $_GET['search'] : '';
$category = isset($_GET['category']) ? $_GET['category'] : 'All Categories';
$sort = isset($_GET['sort']) ? $_GET['sort'] : 'newest';

// Convert sort parameter
$sortParam = $sort;
if ($sort === 'newest') {
    $sortParam = 'created_at DESC';
} else if ($sort === 'oldest') {
    $sortParam = 'created_at ASC';
} else if ($sort === 'vacancies') {
    $sortParam = 'vacancies DESC';
}

try {
    // Get database connection
    $conn = getDbConnection();
    
    // Build the query
    $query = "SELECT * FROM projects";
    $params = array();
    
    // Apply search filter if provided
    if (!empty($search)) {
        $query .= " WHERE (title LIKE :search OR description LIKE :search OR tags LIKE :search)";
        $params[':search'] = "%$search%";
    }
    
    // Apply category filter client-side to keep the logic consistent
    
    // Apply sorting
    $query .= " ORDER BY $sortParam";
    
    // Execute the query
    $stmt = $conn->prepare($query);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->execute();
    
    // Get all projects
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // If category filter is applied (other than 'All Categories'), filter projects client-side
    if ($category !== 'All Categories') {
        $filteredProjects = [];
        
        foreach ($projects as $project) {
            $tags = explode(',', strtolower($project['tags']));
            $tags = array_map('trim', $tags);
            
            $matchesCategory = false;
            
            // Check if any tag matches the category
            foreach ($tags as $tag) {
                if ($tag === strtolower($category) ||
                    ($category === 'Web Development' && 
                     (strpos($tag, 'react') !== false || 
                      strpos($tag, 'html') !== false ||
                      strpos($tag, 'css') !== false ||
                      strpos($tag, 'javascript') !== false ||
                      strpos($tag, 'js') !== false)) ||
                    ($category === 'Mobile Apps' && 
                     (strpos($tag, 'react native') !== false ||
                      strpos($tag, 'android') !== false ||
                      strpos($tag, 'ios') !== false ||
                      strpos($tag, 'flutter') !== false)) ||
                    ($category === 'Data Science' && 
                     (strpos($tag, 'python') !== false ||
                      strpos($tag, 'data') !== false ||
                      strpos($tag, 'machine learning') !== false)) ||
                    ($category === 'DevOps' && 
                     (strpos($tag, 'docker') !== false ||
                      strpos($tag, 'kubernetes') !== false ||
                      strpos($tag, 'aws') !== false ||
                      strpos($tag, 'ci/cd') !== false))) {
                    $matchesCategory = true;
                    break;
                }
            }
            
            if ($matchesCategory) {
                $filteredProjects[] = $project;
            }
        }
        
        $projects = $filteredProjects;
    }
} catch (PDOException $e) {
    // Log error
    error_log("Database Error: " . $e->getMessage());
    
    // Set empty projects array
    $projects = [];
    
    // Set error message
    $errorMessage = "An error occurred while fetching projects.";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projects - Collabd</title>
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

    <!-- Projects Section -->
    <section class="projects-section">
        <div class="container">
            <div class="section-header">
                <h1>Find Projects</h1>
                <a href="#" id="create-project-btn" class="btn">Create New Project</a>
            </div>
            
            <div class="projects-filters">
                <div class="search-bar">
                    <input type="text" placeholder="Search projects..." value="<?php echo htmlspecialchars($search); ?>">
                    <button type="button"><i class="fas fa-search"></i></button>
                </div>
                <div class="filter-dropdowns">
                    <select id="category-filter">
                        <option value="All Categories" <?php echo $category === 'All Categories' ? 'selected' : ''; ?>>All Categories</option>
                        <option value="Web Development" <?php echo $category === 'Web Development' ? 'selected' : ''; ?>>Web Development</option>
                        <option value="Mobile Apps" <?php echo $category === 'Mobile Apps' ? 'selected' : ''; ?>>Mobile Apps</option>
                        <option value="Data Science" <?php echo $category === 'Data Science' ? 'selected' : ''; ?>>Data Science</option>
                        <option value="DevOps" <?php echo $category === 'DevOps' ? 'selected' : ''; ?>>DevOps</option>
                        <option value="UI/UX" <?php echo $category === 'UI/UX' ? 'selected' : ''; ?>>UI/UX</option>
                        <option value="Game Dev" <?php echo $category === 'Game Dev' ? 'selected' : ''; ?>>Game Dev</option>
                    </select>
                    <select id="sort-filter">
                        <option value="newest" <?php echo $sort === 'newest' ? 'selected' : ''; ?>>Sort by: Newest</option>
                        <option value="oldest" <?php echo $sort === 'oldest' ? 'selected' : ''; ?>>Sort by: Oldest</option>
                        <option value="vacancies" <?php echo $sort === 'vacancies' ? 'selected' : ''; ?>>Sort by: Most Vacancies</option>
                    </select>
                </div>
            </div>

            <?php if (isset($errorMessage)): ?>
                <div class="error-message">
                    <?php echo htmlspecialchars($errorMessage); ?>
                </div>
            <?php endif; ?>
            
            <div class="projects-grid">
                <?php if (empty($projects)): ?>
                    <div class="no-projects">
                        <p>No projects found matching your criteria.</p>
                    </div>
                <?php else: ?>
                    <?php foreach ($projects as $project): ?>
                        <div class="project-card" data-id="<?php echo $project['id']; ?>">
                            <div class="project-img">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </div>
                            <div class="project-info">
                                <h3><?php echo htmlspecialchars($project['title']); ?></h3>
                                <p><?php echo htmlspecialchars(substr($project['description'], 0, 150) . (strlen($project['description']) > 150 ? '...' : '')); ?></p>
                                <div class="project-meta">
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                        <?php echo htmlspecialchars($project['creator']); ?>
                                    </span>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                        <?php echo date('M d, Y', strtotime($project['created_at'])); ?>
                                    </span>
                                </div>
                                <div class="project-tags">
                                    <?php if (!empty($project['tags'])): ?>
                                        <?php foreach (explode(',', $project['tags']) as $tag): ?>
                                            <span class="project-tag"><?php echo htmlspecialchars(trim($tag)); ?></span>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </div>
                                <div class="vacancy-badge">
                                    <?php echo $project['vacancies']; ?> <?php echo $project['vacancies'] == 1 ? 'Vacancy' : 'Vacancies'; ?>
                                </div>
                                <div class="project-actions">
                                    <a href="project-details.php?id=<?php echo $project['id']; ?>" class="btn">View Details</a>
                                    <button class="btn btn-outline apply-btn" data-project-id="<?php echo $project['id']; ?>">Apply Now</button>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
    </section>

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
    <script src="js/launcher.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Handle search
            const searchInput = document.querySelector('.search-bar input');
            const searchButton = document.querySelector('.search-bar button');
            
            // Search function
            function performSearch() {
                const searchTerm = searchInput.value.trim();
                const category = document.getElementById('category-filter').value;
                const sort = document.getElementById('sort-filter').value;
                
                // Redirect with query parameters
                window.location.href = `projects.php?search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(category)}&sort=${encodeURIComponent(sort)}`;
            }
            
            // Search on button click
            searchButton.addEventListener('click', performSearch);
            
            // Search on Enter key
            searchInput.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
            
            // Handle category filter change
            document.getElementById('category-filter').addEventListener('change', function() {
                const searchTerm = searchInput.value.trim();
                const category = this.value;
                const sort = document.getElementById('sort-filter').value;
                
                window.location.href = `projects.php?search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(category)}&sort=${encodeURIComponent(sort)}`;
            });
            
            // Handle sort filter change
            document.getElementById('sort-filter').addEventListener('change', function() {
                const searchTerm = searchInput.value.trim();
                const category = document.getElementById('category-filter').value;
                const sort = this.value;
                
                window.location.href = `projects.php?search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(category)}&sort=${encodeURIComponent(sort)}`;
            });
            
            // Handle create project button
            document.getElementById('create-project-btn').addEventListener('click', function(e) {
                e.preventDefault();
                
                // Check if user is logged in
                const userData = UserDatabaseManager.getCurrentUser();
                if (!userData) {
                    alert('Please log in to create a new project');
                    window.location.href = 'login.html';
                    return;
                }
                
                // Show create project form
                showCreateProjectForm();
            });
            
            // Handle apply buttons
            const applyButtons = document.querySelectorAll('.apply-btn');
            applyButtons.forEach(button => {
                button.addEventListener('click', async function(e) {
                    e.preventDefault();
                    
                    const projectId = this.getAttribute('data-project-id');
                    if (!projectId) return;
                    
                    // Check if user is logged in
                    const userData = UserDatabaseManager.getCurrentUser();
                    if (!userData) {
                        alert('Please log in to apply for projects');
                        window.location.href = 'login.html';
                        return;
                    }
                    
                    try {
                        // Check if user has already applied
                        const hasApplied = await ProjectsDatabaseManager.hasUserApplied(projectId, userData.id);
                        if (hasApplied) {
                            alert('You have already applied to this project');
                            return;
                        }
                        
                        // Apply for the project
                        await ProjectsDatabaseManager.applyForProject(projectId, userData);
                        
                        // Update UI
                        this.textContent = 'Applied';
                        this.disabled = true;
                        this.style.backgroundColor = '#00b894';
                        this.style.color = 'white';
                        this.style.borderColor = '#00b894';
                        
                        // Update vacancy count in UI
                        const vacancyBadge = this.closest('.project-card').querySelector('.vacancy-badge');
                        if (vacancyBadge) {
                            let vacancies = parseInt(vacancyBadge.textContent);
                            vacancies = isNaN(vacancies) ? 0 : vacancies - 1;
                            vacancyBadge.textContent = `${vacancies} ${vacancies === 1 ? 'Vacancy' : 'Vacancies'}`;
                        }
                        
                        alert('Application submitted successfully!');
                    } catch (error) {
                        console.error('Error applying for project:', error);
                        alert('Failed to apply for project. Please try again later.');
                    }
                });
            });
            
            // Check and update UI for already applied projects
            checkAppliedProjects();
        });
        
        // Check if user has already applied to projects and update UI
        async function checkAppliedProjects() {
            const userData = UserDatabaseManager.getCurrentUser();
            if (!userData) return;
            
            const applyButtons = document.querySelectorAll('.apply-btn');
            for (const button of applyButtons) {
                const projectId = button.getAttribute('data-project-id');
                if (!projectId) continue;
                
                try {
                    const hasApplied = await ProjectsDatabaseManager.hasUserApplied(projectId, userData.id);
                    if (hasApplied) {
                        button.textContent = 'Applied';
                        button.disabled = true;
                        button.style.backgroundColor = '#00b894';
                        button.style.color = 'white';
                        button.style.borderColor = '#00b894';
                    }
                } catch (error) {
                    console.error(`Error checking application for project ${projectId}:`, error);
                }
            }
        }
        
        // Show project creation form
        function showCreateProjectForm() {
            // Create modal overlay
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '1000';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            
            // Create form container
            const formContainer = document.createElement('div');
            formContainer.style.backgroundColor = 'white';
            formContainer.style.padding = '30px';
            formContainer.style.borderRadius = '10px';
            formContainer.style.width = '500px';
            formContainer.style.maxWidth = '90%';
            
            // Create form
            formContainer.innerHTML = `
                <h2>Create New Project</h2>
                <form id="create-project-form">
                    <div class="form-group">
                        <label for="project-title">Project Title</label>
                        <input type="text" id="project-title" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="project-description">Description</label>
                        <textarea id="project-description" class="form-control" rows="4" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="project-tags">Tags (comma separated)</label>
                        <input type="text" id="project-tags" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="project-vacancies">Number of Vacancies</label>
                        <input type="number" id="project-vacancies" class="form-control" min="0" value="1" required>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                        <button type="button" id="cancel-project" class="btn btn-outline">Cancel</button>
                        <button type="submit" class="btn">Create Project</button>
                    </div>
                </form>
            `;
            
            // Add form to overlay
            overlay.appendChild(formContainer);
            
            // Add overlay to body
            document.body.appendChild(overlay);
            
            // Handle cancel button
            document.getElementById('cancel-project').addEventListener('click', function() {
                document.body.removeChild(overlay);
            });
            
            // Handle form submission
            document.getElementById('create-project-form').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Get form values
                const title = document.getElementById('project-title').value;
                const description = document.getElementById('project-description').value;
                const tags = document.getElementById('project-tags').value;
                const vacancies = parseInt(document.getElementById('project-vacancies').value);
                
                // Get user data
                const userData = UserDatabaseManager.getCurrentUser();
                
                try {
                    // Create new project
                    const newProject = await ProjectsDatabaseManager.createProject({
                        title: title,
                        description: description,
                        tags: tags,
                        vacancies: vacancies,
                        creator: userData.fullName || userData.username || 'Anonymous'
                    });
                    
                    // Close modal
                    document.body.removeChild(overlay);
                    
                    // Show success message
                    alert('Project created successfully! Refreshing projects list...');
                    
                    // Refresh the page to show the new project
                    window.location.reload();
                } catch (error) {
                    console.error('Error creating project:', error);
                    alert('Failed to create project. Please try again.');
                }
            });
        }
    </script>
</body>
</html>