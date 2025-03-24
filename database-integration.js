// database-integration.js - Connect projects to the database backend

// API endpoint URLs
const API_BASE_URL = '/api'; // Adjust to your actual API URL
const PROJECTS_API = `${API_BASE_URL}/projects.php`;
const APPLY_API = `${API_BASE_URL}/projects.php?endpoint=apply`;
const USERS_API = `${API_BASE_URL}/users.php`;
const SERVICES_API = `${API_BASE_URL}/users.php?endpoint=services`;

// Enhanced Projects Manager with database integration
const ProjectsDatabaseManager = {
    // Get all projects from the database
    async getProjects(searchTerm = '', sortBy = 'newest') {
        try {
            let url = `${PROJECTS_API}?projects`;
            
            if (searchTerm) {
                url += `&search=${encodeURIComponent(searchTerm)}`;
            }
            
            if (sortBy) {
                url += `&sort=${encodeURIComponent(sortBy)}`;
            }
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            
            const projects = await response.json();
            
            // Store in localStorage as a cache
            localStorage.setItem('collabdProjects', JSON.stringify(projects));
            
            return projects;
        } catch (error) {
            console.error('Error fetching projects:', error);
            
            // Fall back to localStorage if available
            const cachedProjects = localStorage.getItem('collabdProjects');
            return cachedProjects ? JSON.parse(cachedProjects) : [];
        }
    },
    
    // Get a single project by ID
    async getProject(projectId) {
        try {
            const response = await fetch(`${PROJECTS_API}?id=${projectId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch project');
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error fetching project ${projectId}:`, error);
            
            // Fall back to localStorage if available
            const cachedProjects = JSON.parse(localStorage.getItem('collabdProjects') || '[]');
            return cachedProjects.find(p => p.id === projectId);
        }
    },
    
    // Create a new project in the database
    async createProject(projectData) {
        try {
            const response = await fetch(PROJECTS_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to create project');
            }
            
            const newProject = await response.json();
            
            // Update local cache
            const cachedProjects = JSON.parse(localStorage.getItem('collabdProjects') || '[]');
            cachedProjects.push(newProject);
            localStorage.setItem('collabdProjects', JSON.stringify(cachedProjects));
            
            return newProject;
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    },
    
    // Update a project in the database
    async updateProject(projectId, updateData) {
        try {
            const response = await fetch(PROJECTS_API, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: projectId,
                    ...updateData
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update project');
            }
            
            const updatedProject = await response.json();
            
            // Update local cache
            const cachedProjects = JSON.parse(localStorage.getItem('collabdProjects') || '[]');
            const index = cachedProjects.findIndex(p => p.id === projectId);
            
            if (index !== -1) {
                cachedProjects[index] = updatedProject;
                localStorage.setItem('collabdProjects', JSON.stringify(cachedProjects));
            }
            
            return updatedProject;
        } catch (error) {
            console.error(`Error updating project ${projectId}:`, error);
            throw error;
        }
    },
    
    // Delete a project from the database
    async deleteProject(projectId) {
        try {
            const response = await fetch(PROJECTS_API, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: projectId })
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete project');
            }
            
            // Update local cache
            const cachedProjects = JSON.parse(localStorage.getItem('collabdProjects') || '[]');
            const updatedProjects = cachedProjects.filter(p => p.id !== projectId);
            localStorage.setItem('collabdProjects', JSON.stringify(updatedProjects));
            
            return true;
        } catch (error) {
            console.error(`Error deleting project ${projectId}:`, error);
            throw error;
        }
    },
    
    // Apply for a project
    async applyForProject(projectId, userData) {
        try {
            const response = await fetch(APPLY_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    project_id: projectId,
                    user_id: userData.id,
                    user_name: userData.fullName || userData.username,
                    user_email: userData.email
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to apply for project');
            }
            
            // Decrease vacancy count in local cache
            const cachedProjects = JSON.parse(localStorage.getItem('collabdProjects') || '[]');
            const index = cachedProjects.findIndex(p => p.id === projectId);
            
            if (index !== -1 && cachedProjects[index].vacancies > 0) {
                cachedProjects[index].vacancies--;
                localStorage.setItem('collabdProjects', JSON.stringify(cachedProjects));
            }
            
            // Save application to local applications cache
            const applications = JSON.parse(localStorage.getItem('collabdApplications') || '[]');
            applications.push({
                projectId: projectId,
                userId: userData.id,
                appliedAt: new Date().toISOString()
            });
            localStorage.setItem('collabdApplications', JSON.stringify(applications));
            
            return await response.json();
        } catch (error) {
            console.error(`Error applying for project ${projectId}:`, error);
            throw error;
        }
    },
    
    // Get all applications for a project
    async getProjectApplications(projectId) {
        try {
            const response = await fetch(`${API_BASE_URL}/projects.php?endpoint=applications&project_id=${projectId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch project applications');
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error fetching applications for project ${projectId}:`, error);
            throw error;
        }
    },
    
    // Check if a user has applied to a project
    async hasUserApplied(projectId, userId) {
        try {
            const applications = await this.getProjectApplications(projectId);
            return applications.some(app => app.user_id === userId);
        } catch (error) {
            console.error(`Error checking if user ${userId} applied to project ${projectId}:`, error);
            
            // Fall back to localStorage if available
            const cachedApplications = JSON.parse(localStorage.getItem('collabdApplications') || '[]');
            return cachedApplications.some(app => 
                app.projectId === projectId && app.userId === userId
            );
        }
    }
};

// Enhanced User Manager with database integration
const UserDatabaseManager = {
    // Get current user data
    getCurrentUser() {
        const userData = localStorage.getItem('collabdUserData');
        return userData ? JSON.parse(userData) : null;
    },
    
    // Save user data
    saveUserData(userData) {
        localStorage.setItem('collabdUserData', JSON.stringify(userData));
    },
    
    // Create/Update user in the database
    async syncUser(userData) {
        try {
            // Generate random ID if not present
            if (!userData.id) {
                userData.id = this._generateUserId();
                this.saveUserData(userData);
            }
            
            // Check if user exists in the database
            const response = await fetch(`${USERS_API}?id=${userData.id}`);
            const exists = response.ok && !(await response.json()).error;
            
            if (exists) {
                // Update user
                await fetch(USERS_API, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
            } else {
                // Create user
                await fetch(USERS_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
            }
            
            return userData;
        } catch (error) {
            console.error('Error syncing user data:', error);
            return userData; // Return the original userData even if syncing failed
        }
    },
    
    // Connect a service for the current user
    async connectService(serviceName, username) {
        try {
            const user = this.getCurrentUser();
            if (!user || !user.id) {
                throw new Error('User not logged in');
            }
            
            // Update user data with the service username
            user[serviceName === 'github' ? 'github' : 
                 serviceName === 'discord' ? 'discord' : 
                 `${serviceName}_username`] = username;
            
            this.saveUserData(user);
            
            // Connect service in the database
            await fetch(SERVICES_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user.id,
                    service_name: serviceName,
                    username: username
                })
            });
            
            // Update local service connections cache
            const connections = JSON.parse(localStorage.getItem('serviceConnections') || '{}');
            connections[serviceName] = {
                connected: true,
                username: username,
                connectedAt: new Date().toISOString()
            };
            localStorage.setItem('serviceConnections', JSON.stringify(connections));
            
            return true;
        } catch (error) {
            console.error(`Error connecting ${serviceName}:`, error);
            throw error;
        }
    },
    
    // Disconnect a service for the current user
    async disconnectService(serviceName) {
        try {
            const user = this.getCurrentUser();
            if (!user || !user.id) {
                throw new Error('User not logged in');
            }
            
            // Disconnect service in the database
            await fetch(SERVICES_API, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user.id,
                    service_name: serviceName
                })
            });
            
            // Update local service connections cache
            const connections = JSON.parse(localStorage.getItem('serviceConnections') || '{}');
            if (connections[serviceName]) {
                connections[serviceName].connected = false;
                connections[serviceName].disconnectedAt = new Date().toISOString();
            }
            localStorage.setItem('serviceConnections', JSON.stringify(connections));
            
            return true;
        } catch (error) {
            console.error(`Error disconnecting ${serviceName}:`, error);
            throw error;
        }
    },
    
    // Helper to generate a unique user ID
    _generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
};

// Initialize database integration on page load
document.addEventListener('DOMContentLoaded', function() {
    // Sync current user data with database
    const currentUser = UserDatabaseManager.getCurrentUser();
    if (currentUser) {
        UserDatabaseManager.syncUser(currentUser)
            .then(() => console.log('User data synced with database'))
            .catch(err => console.error('Error syncing user data:', err));
    }
    
    // If on projects page, load projects from database
    if (document.querySelector('.projects-grid')) {
        initProjectsPage();
    }
    
    // If on the user profile or settings page, init service connections
    if (document.getElementById('fullname') || document.querySelector('.user-profile')) {
        initServiceConnections();
    }
});

// Initialize the projects page with database integration
async function initProjectsPage() {
    try {
        // Get projects from database
        const projects = await ProjectsDatabaseManager.getProjects();
        
        // Get the projects grid container
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;
        
        // Clear existing content
        projectsGrid.innerHTML = '';
        
        // Render projects
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
        
        // Set up search, filter, and sort functionality
        setupProjectsFiltering();
    } catch (error) {
        console.error('Error initializing projects page:', error);
    }
}

// Create a project card element
function createProjectCard(project) {
    // Create tags HTML
    const tagsHtml = project.tags ? project.tags.split(',').map(tag => 
        `<span class="project-tag">${tag.trim()}</span>`
    ).join('') : '';
    
    // Create a div to hold the card
    const cardContainer = document.createElement('div');
    
    // Set the card HTML
    cardContainer.innerHTML = `
        <div class="project-card" data-id="${project.id}">
            <div class="project-img">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description || 'No description provided.'}</p>
                <div class="project-meta">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        ${project.creator}
                    </span>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        ${new Date(project.created_at).toLocaleDateString()}
                    </span>
                </div>
                <div class="project-tags">
                    ${tagsHtml}
                </div>
                <div class="vacancy-badge">
                    ${project.vacancies} ${parseInt(project.vacancies) === 1 ? 'Vacancy' : 'Vacancies'}
                </div>
                <button class="btn btn-outline apply-btn" data-project-id="${project.id}">
                    Apply Now
                </button>
            </div>
        </div>
    `;
    
    // Get the card element
    const card = cardContainer.firstElementChild;
    
    // Set up the apply button
    const applyButton = card.querySelector('.apply-btn');
    applyButton.addEventListener('click', async function() {
        await handleProjectApplication(project.id);
    });
    
    return card;
}

// Handle project application
async function handleProjectApplication(projectId) {
    try {
        // Check if user is logged in
        const userData = UserDatabaseManager.getCurrentUser();
        if (!userData) {
            alert('Please log in to apply for projects');
            window.location.href = 'login.html';
            return;
        }
        
        // Check if user has already applied
        const hasApplied = await ProjectsDatabaseManager.hasUserApplied(projectId, userData.id);
        if (hasApplied) {
            alert('You have already applied to this project');
            return;
        }
        
        // Get project details
        const project = await ProjectsDatabaseManager.getProject(projectId);
        
        // Check if there are vacancies
        if (project.vacancies <= 0) {
            alert('Sorry, there are no more vacancies for this project');
            return;
        }
        
        // Apply for the project
        await ProjectsDatabaseManager.applyForProject(projectId, userData);
        
        // Update UI
        const applyButton = document.querySelector(`.apply-btn[data-project-id="${projectId}"]`);
        if (applyButton) {
            applyButton.textContent = 'Applied';
            applyButton.disabled = true;
            applyButton.style.backgroundColor = '#00b894';
            applyButton.style.color = 'white';
            applyButton.style.borderColor = '#00b894';
        }
        
        // Update vacancy count in UI
        const vacancyBadge = document.querySelector(`.project-card[data-id="${projectId}"] .vacancy-badge`);
        if (vacancyBadge) {
            const newVacancies = project.vacancies - 1;
            vacancyBadge.textContent = `${newVacancies} ${newVacancies === 1 ? 'Vacancy' : 'Vacancies'}`;
        }
        
        alert(`Successfully applied to "${project.title}"!`);
    } catch (error) {
        console.error('Error applying for project:', error);
        alert('Failed to apply for the project. Please try again later.');
    }
}

// Set up projects filtering, searching, and sorting
function setupProjectsFiltering() {
    // Set up search field
    const searchInput = document.querySelector('input[placeholder="Search projects..."]');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(async function() {
            const searchTerm = this.value.trim();
            const sortSelect = document.querySelector('select:nth-of-type(2)');
            const sortOption = sortSelect ? sortSelect.value : 'newest';
            
            // Get filtered projects
            const projects = await ProjectsDatabaseManager.getProjects(searchTerm, sortOption);
            
            // Update UI
            updateProjectsGrid(projects);
        }, 300));
    }
    
    // Set up category filter
    const filterSelect = document.querySelector('select:nth-of-type(1)');
    if (filterSelect) {
        filterSelect.addEventListener('change', async function() {
            const category = this.value;
            
            // For categories, we'll filter client-side after getting all projects
            const searchInput = document.querySelector('input[placeholder="Search projects..."]');
            const searchTerm = searchInput ? searchInput.value.trim() : '';
            const sortSelect = document.querySelector('select:nth-of-type(2)');
            const sortOption = sortSelect ? sortSelect.value : 'newest';
            
            // Get projects
            let projects = await ProjectsDatabaseManager.getProjects(searchTerm, sortOption);
            
            // Filter by category if not "All Categories"
            if (category !== 'All Categories') {
                projects = projects.filter(project => {
                    const tags = project.tags ? project.tags.split(',').map(tag => tag.trim().toLowerCase()) : [];
                    
                    return tags.some(tag => 
                        tag === category.toLowerCase() ||
                        (category === 'Web Development' && (
                            tag.includes('react') || 
                            tag.includes('html') ||
                            tag.includes('css') ||
                            tag.includes('javascript') ||
                            tag.includes('js')
                        )) ||
                        (category === 'Mobile Apps' && (
                            tag.includes('react native') ||
                            tag.includes('android') ||
                            tag.includes('ios') ||
                            tag.includes('flutter')
                        )) ||
                        (category === 'Data Science' && (
                            tag.includes('python') ||
                            tag.includes('data') ||
                            tag.includes('machine learning')
                        )) ||
                        (category === 'DevOps' && (
                            tag.includes('docker') ||
                            tag.includes('kubernetes') ||
                            tag.includes('aws') ||
                            tag.includes('ci/cd')
                        ))
                    );
                });
            }
            
            // Update UI
            updateProjectsGrid(projects);
        });
    }
    
    // Set up sort dropdown
    const sortSelect = document.querySelector('select:nth-of-type(2)');
    if (sortSelect) {
        sortSelect.addEventListener('change', async function() {
            const sortOption = this.value;
            let sortBy;
            
            // Map sort options to API sort parameters
            switch (sortOption) {
                case 'Sort by: Newest':
                    sortBy = 'newest';
                    break;
                case 'Sort by: Oldest':
                    sortBy = 'oldest';
                    break;
                case 'Sort by: Most Vacancies':
                    sortBy = 'vacancies';
                    break;
                default:
                    sortBy = 'newest';
            }
            
            // Get search term if any
            const searchInput = document.querySelector('input[placeholder="Search projects..."]');
            const searchTerm = searchInput ? searchInput.value.trim() : '';
            
            // Get sorted projects
            const projects = await ProjectsDatabaseManager.getProjects(searchTerm, sortBy);
            
            // Update UI
            updateProjectsGrid(projects);
        });
    }
    
    // Set up create new project button
    const createProjectButton = document.querySelector('a[href="login.html"].btn');
    if (createProjectButton) {
        createProjectButton.addEventListener('click', function(e) {
            const isLoggedIn = UserDatabaseManager.getCurrentUser() !== null;
            
            if (isLoggedIn) {
                e.preventDefault();
                showCreateProjectForm();
            }
        });
    }
}

// Update the projects grid with new data
function updateProjectsGrid(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    // Clear existing content
    projectsGrid.innerHTML = '';
    
    if (projects.length === 0) {
        projectsGrid.innerHTML = '<div class="no-projects">No projects found matching your criteria.</div>';
        return;
    }
    
    // Add project cards
    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
    
    // Check and update UI for already applied projects
    checkAppliedProjects();
}

// Check if user has already applied to projects and update UI
async function checkAppliedProjects() {
    const user = UserDatabaseManager.getCurrentUser();
    if (!user) return;
    
    const projectCards = document.querySelectorAll('.project-card');
    
    for (const card of projectCards) {
        const projectId = card.getAttribute('data-id');
        if (!projectId) continue;
        
        try {
            const hasApplied = await ProjectsDatabaseManager.hasUserApplied(projectId, user.id);
            
            if (hasApplied) {
                const applyButton = card.querySelector('.apply-btn');
                applyButton.textContent = 'Applied';
                applyButton.disabled = true;
                applyButton.style.backgroundColor = '#00b894';
                applyButton.style.color = 'white';
                applyButton.style.borderColor = '#00b894';
            }
        } catch (error) {
            console.error(`Error checking application status for project ${projectId}:`, error);
        }
    }
}

// Initialize service connections
function initServiceConnections() {
    // Update service connection status in UI
    updateServiceConnectionsUI();
    
    // Set up service connect/disconnect buttons
    setupServiceButtons();
}

// Update service connections UI
function updateServiceConnectionsUI() {
    // Get service connections
    const connections = JSON.parse(localStorage.getItem('serviceConnections') || '{}');
    
    // Update each service status
    ['vscode', 'github', 'discord'].forEach(service => {
        // Get connection status
        const isConnected = connections[service]?.connected === true;
        
        // Update status indicators
        const statusElem = document.querySelector(`.${service}-status`);
        if (statusElem) {
            statusElem.textContent = isConnected ? 'Connected' : 'Not Connected';
            statusElem.className = `integration-status ${service}-status ${isConnected ? 'connected' : 'not-connected'}`;
        }
        
        // Show/hide buttons based on connection status
        const connectBtn = document.getElementById(`connect-${service}`);
        const disconnectBtn = document.getElementById(`disconnect-${service}`);
        
        if (connectBtn) connectBtn.style.display = isConnected ? 'none' : 'inline-block';
        if (disconnectBtn) disconnectBtn.style.display = isConnected ? 'inline-block' : 'none';
    });
}

// Set up service connect/disconnect buttons
function setupServiceButtons() {
    // Connect buttons
    ['vscode', 'github', 'discord'].forEach(service => {
        const connectBtn = document.getElementById(`connect-${service}`);
        if (connectBtn) {
            connectBtn.addEventListener('click', async function() {
                try {
                    // Get user data
                    const userData = UserDatabaseManager.getCurrentUser();
                    if (!userData) {
                        alert('Please log in to connect services');
                        return;
                    }
                    
                    let username = '';
                    
                    // Get username based on service
                    if (service === 'github') {
                        username = document.getElementById('github')?.value || userData.github || '';
                        if (!username) {
                            username = prompt('Enter your GitHub username:');
                            if (!username) return;
                        }
                    } else if (service === 'discord') {
                        username = document.getElementById('discord')?.value || userData.discord || '';
                        if (!username) {
                            username = prompt('Enter your Discord username:');
                            if (!username) return;
                        }
                    } else if (service === 'vscode') {
                        username = userData.username || 'vscode-user';
                    }
                    
                    // Connect the service
                    await UserDatabaseManager.connectService(service, username);
                    
                    // Update service connections UI
                    updateServiceConnectionsUI();
                    
                    // Update input field if any
                    if (service === 'github' && document.getElementById('github')) {
                        document.getElementById('github').value = username;
                    } else if (service === 'discord' && document.getElementById('discord')) {
                        document.getElementById('discord').value = username;
                    }
                    
                    alert(`${service.toUpperCase()} connected successfully!`);
                } catch (error) {
                    console.error(`Error connecting ${service}:`, error);
                    alert(`Failed to connect ${service}. Please try again.`);
                }
            });
        }
        
        // Disconnect buttons
        const disconnectBtn = document.getElementById(`disconnect-${service}`);
        if (disconnectBtn) {
            disconnectBtn.addEventListener('click', async function() {
                try {
                    // Disconnect the service
                    await UserDatabaseManager.disconnectService(service);
                    
                    // Update service connections UI
                    updateServiceConnectionsUI();
                    
                    alert(`${service.toUpperCase()} disconnected successfully!`);
                } catch (error) {
                    console.error(`Error disconnecting ${service}:`, error);
                    alert(`Failed to disconnect ${service}. Please try again.`);
                }
            });
        }
    });
}

// Helper function to debounce search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}