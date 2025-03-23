// // Project application functionality
// document.addEventListener('DOMContentLoaded', function() {
//     // Get all Apply Now buttons
//     const applyButtons = document.querySelectorAll('.project-card .btn-outline');
    
//     // Add click event listeners to each button
//     applyButtons.forEach(button => {
//         button.addEventListener('click', function(e) {
//             e.preventDefault();
            
//             // Check if user is logged in
//             const isLoggedIn = localStorage.getItem('collabdLoggedIn') === 'true';
            
//             if (!isLoggedIn) {
//                 alert('Please log in to apply for projects');
//                 window.location.href = 'login.html';
//                 return;
//             }
            
//             // Get project card and project info
//             const projectCard = this.closest('.project-card');
//             const projectTitle = projectCard.querySelector('h3').textContent;
            
//             // Get current vacancies
//             const vacancyBadge = projectCard.querySelector('.vacancy-badge');
//             let vacancies = parseInt(vacancyBadge.textContent.match(/\d+/)[0]);
            
//             // Check if user has already applied
//             const appliedProjects = JSON.parse(localStorage.getItem('collabdAppliedProjects') || '[]');
            
//             if (appliedProjects.includes(projectTitle)) {
//                 alert(`You have already applied to "${projectTitle}"`);
//                 return;
//             }
            
//             // Apply for the project
//             if (vacancies > 0) {
//                 // Reduce vacancies by 1
//                 vacancies--;
//                 vacancyBadge.textContent = vacancies > 1 ? `${vacancies} Vacancies` : `${vacancies} Vacancy`;
                
//                 // Update button text
//                 this.textContent = 'Applied';
//                 this.disabled = true;
//                 this.style.backgroundColor = '#00b894';
//                 this.style.color = 'white';
//                 this.style.borderColor = '#00b894';
                
//                 // Save applied project to localStorage
//                 appliedProjects.push(projectTitle);
//                 localStorage.setItem('collabdAppliedProjects', JSON.stringify(appliedProjects));
                
//                 // Show success message
//                 alert(`Successfully applied to "${projectTitle}"!`);
                
//                 // Update project data in localStorage
//                 updateProjectData(projectTitle, vacancies);
//             } else {
//                 alert('Sorry, there are no more vacancies for this project.');
//             }
//         });
//     });
    
//     // Check and update UI for already applied projects
//     function checkAppliedProjects() {
//         const appliedProjects = JSON.parse(localStorage.getItem('collabdAppliedProjects') || '[]');
        
//         if (appliedProjects.length > 0) {
//             const projectCards = document.querySelectorAll('.project-card');
            
//             projectCards.forEach(card => {
//                 const projectTitle = card.querySelector('h3').textContent;
//                 const applyButton = card.querySelector('.btn-outline');
                
//                 if (appliedProjects.includes(projectTitle)) {
//                     applyButton.textContent = 'Applied';
//                     applyButton.disabled = true;
//                     applyButton.style.backgroundColor = '#00b894';
//                     applyButton.style.color = 'white';
//                     applyButton.style.borderColor = '#00b894';
//                 }
//             });
//         }
//     }
    
//     // Update project data in localStorage
//     function updateProjectData(projectTitle, vacancies) {
//         // Get existing project data
//         const projectsData = JSON.parse(localStorage.getItem('collabdProjects') || '[]');
        
//         // Find and update the specific project
//         const projectIndex = projectsData.findIndex(project => project.title === projectTitle);
        
//         if (projectIndex !== -1) {
//             projectsData[projectIndex].vacancies = vacancies;
//         } else {
//             // If project not found in localStorage, add it
//             projectsData.push({
//                 title: projectTitle,
//                 vacancies: vacancies
//             });
//         }
        
//         // Save updated data
//         localStorage.setItem('collabdProjects', JSON.stringify(projectsData));
//     }
    
//     // Load project data from localStorage
//     function loadProjectData() {
//         const projectsData = JSON.parse(localStorage.getItem('collabdProjects') || '[]');
        
//         if (projectsData.length > 0) {
//             const projectCards = document.querySelectorAll('.project-card');
            
//             projectCards.forEach(card => {
//                 const projectTitle = card.querySelector('h3').textContent;
//                 const vacancyBadge = card.querySelector('.vacancy-badge');
                
//                 // Find project in data
//                 const projectData = projectsData.find(project => project.title === projectTitle);
                
//                 if (projectData) {
//                     // Update vacancy display
//                     vacancyBadge.textContent = projectData.vacancies > 1 ? 
//                         `${projectData.vacancies} Vacancies` : 
//                         `${projectData.vacancies} Vacancy`;
//                 }
//             });
//         }
//     }
    
//     // Initialize
//     checkAppliedProjects();
//     loadProjectData();
// });

// // Add this to the DOMContentLoaded event listener
// const createProjectButton = document.querySelector('a[href="login.html"].btn');
// if (createProjectButton) {
//     createProjectButton.addEventListener('click', function(e) {
//         const isLoggedIn = localStorage.getItem('collabdLoggedIn') === 'true';
        
//         if (isLoggedIn) {
//             e.preventDefault();
//             // Show project creation form
//             showCreateProjectForm();
//         }
//         // If not logged in, the default link to login.html will work
//     });
// }

// // Function to show project creation form
// function showCreateProjectForm() {
//     // Create modal overlay
//     const overlay = document.createElement('div');
//     overlay.style.position = 'fixed';
//     overlay.style.top = '0';
//     overlay.style.left = '0';
//     overlay.style.width = '100%';
//     overlay.style.height = '100%';
//     overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
//     overlay.style.zIndex = '1000';
//     overlay.style.display = 'flex';
//     overlay.style.justifyContent = 'center';
//     overlay.style.alignItems = 'center';
    
//     // Create form container
//     const formContainer = document.createElement('div');
//     formContainer.style.backgroundColor = 'white';
//     formContainer.style.padding = '30px';
//     formContainer.style.borderRadius = '10px';
//     formContainer.style.width = '500px';
//     formContainer.style.maxWidth = '90%';
    
//     // Create form
//     formContainer.innerHTML = `
//         <h2>Create New Project</h2>
//         <form id="create-project-form">
//             <div class="form-group">
//                 <label for="project-title">Project Title</label>
//                 <input type="text" id="project-title" class="form-control" required>
//             </div>
//             <div class="form-group">
//                 <label for="project-description">Description</label>
//                 <textarea id="project-description" class="form-control" rows="4" required></textarea>
//             </div>
//             <div class="form-group">
//                 <label for="project-tags">Tags (comma separated)</label>
//                 <input type="text" id="project-tags" class="form-control">
//             </div>
//             <div class="form-group">
//                 <label for="project-vacancies">Number of Vacancies</label>
//                 <input type="number" id="project-vacancies" class="form-control" min="0" value="1" required>
//             </div>
//             <div style="display: flex; justify-content: space-between; margin-top: 20px;">
//                 <button type="button" id="cancel-project" class="btn btn-outline">Cancel</button>
//                 <button type="submit" class="btn">Create Project</button>
//             </div>
//         </form>
//     `;
    
//     // Add form to overlay
//     overlay.appendChild(formContainer);
    
//     // Add overlay to body
//     document.body.appendChild(overlay);
    
//     // Handle cancel button
//     document.getElementById('cancel-project').addEventListener('click', function() {
//         document.body.removeChild(overlay);
//     });
    
//     // Handle form submission
//     document.getElementById('create-project-form').addEventListener('submit', function(e) {
//         e.preventDefault();
        
//         // Get form values
//         const title = document.getElementById('project-title').value;
//         const description = document.getElementById('project-description').value;
//         const tags = document.getElementById('project-tags').value;
//         const vacancies = parseInt(document.getElementById('project-vacancies').value);
        
//         // Get user data
//         const userData = JSON.parse(localStorage.getItem('collabdUserData'));
        
//         // Create new project
//         const newProject = {
//             title: title,
//             description: description,
//             tags: tags,
//             vacancies: vacancies,
//             creator: userData.fullName || 'Anonymous',
//             createdAt: new Date().toISOString()
//         };
        
//         // Add to projects in localStorage
//         const projects = JSON.parse(localStorage.getItem('collabdProjects') || '[]');
//         projects.push(newProject);
//         localStorage.setItem('collabdProjects', JSON.stringify(projects));
        
//         // Close modal
//         document.body.removeChild(overlay);
        
//         // Show success message
//         alert('Project created successfully! Refresh the page to see your new project.');
        
//         // Optional: reload page to show new project
//         window.location.reload();
//     });
// }










// Project application functionality with filtering, sorting, and search
document.addEventListener('DOMContentLoaded', function() {
    // Initialize project data if not already in localStorage
    initializeProjectData();
    
    // Set up Apply Now buttons
    setupApplyButtons();
    
    // Set up search, filter, and sort options
    setupSearchField();
    setupFilterDropdown();
    setupSortDropdown();
    
    // Set up Create New Project button
    setupCreateProjectButton();
});

// Initialize project data from HTML elements if not in localStorage
function initializeProjectData() {
    if (!localStorage.getItem('collabdProjects')) {
        const projectCards = document.querySelectorAll('.project-card');
        const projects = [];
        
        projectCards.forEach(card => {
            const title = card.querySelector('h3').textContent;
            const description = card.querySelector('p').textContent;
            const tagsElements = card.querySelectorAll('.project-tag');
            const tags = Array.from(tagsElements).map(tag => tag.textContent).join(',');
            const vacancyBadge = card.querySelector('.vacancy-badge');
            const vacancies = parseInt(vacancyBadge.textContent.match(/\d+/)[0]);
            const creatorElement = card.querySelector('.project-meta span:first-child');
            const creator = creatorElement ? creatorElement.textContent.trim() : 'Anonymous';
            
            projects.push({
                title,
                description,
                tags,
                vacancies,
                creator,
                createdAt: new Date().toISOString(),
                originalIndex: projects.length // To restore original order when needed
            });
        });
        
        localStorage.setItem('collabdProjects', JSON.stringify(projects));
    }
    
    // Initialize applications data structure if not exists
    if (!localStorage.getItem('collabdApplications')) {
        localStorage.setItem('collabdApplications', JSON.stringify([]));
    }
}

// Set up Apply Now buttons
function setupApplyButtons() {
    // Get all Apply Now buttons
    const applyButtons = document.querySelectorAll('.project-card .btn-outline');
    
    // Add click event listeners to each button
    applyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if user is logged in
            const isLoggedIn = localStorage.getItem('collabdLoggedIn') === 'true';
            
            if (!isLoggedIn) {
                alert('Please log in to apply for projects');
                window.location.href = 'login.html';
                return;
            }
            
            // Get project card and project info
            const projectCard = this.closest('.project-card');
            const projectTitle = projectCard.querySelector('h3').textContent;
            
            // Get current vacancies
            const vacancyBadge = projectCard.querySelector('.vacancy-badge');
            let vacancies = parseInt(vacancyBadge.textContent.match(/\d+/)[0]);
            
            // Get user data
            const userData = JSON.parse(localStorage.getItem('collabdUserData'));
            
            // Check if user has already applied
            const applications = JSON.parse(localStorage.getItem('collabdApplications') || '[]');
            const hasApplied = applications.some(app => 
                app.projectTitle === projectTitle && app.userId === userData.id
            );
            
            if (hasApplied) {
                alert(`You have already applied to "${projectTitle}"`);
                return;
            }
            
            // Apply for the project
            if (vacancies > 0) {
                // Reduce vacancies by 1
                vacancies--;
                vacancyBadge.textContent = vacancies > 1 ? `${vacancies} Vacancies` : `${vacancies} Vacancy`;
                
                // Update button text
                this.textContent = 'Applied';
                this.disabled = true;
                this.style.backgroundColor = '#00b894';
                this.style.color = 'white';
                this.style.borderColor = '#00b894';
                
                // Save application data
                const newApplication = {
                    userId: userData.id,
                    userName: userData.fullName,
                    userEmail: userData.email,
                    projectTitle: projectTitle,
                    appliedAt: new Date().toISOString(),
                    status: 'Pending'
                };
                
                applications.push(newApplication);
                localStorage.setItem('collabdApplications', JSON.stringify(applications));
                
                // Show success message
                alert(`Successfully applied to "${projectTitle}"!`);
                
                // Update project data in localStorage
                updateProjectData(projectTitle, vacancies);
            } else {
                alert('Sorry, there are no more vacancies for this project.');
            }
        });
    });
    
    // Check and update UI for already applied projects
    checkAppliedProjects();
}

// Check if user has already applied to projects and update UI
function checkAppliedProjects() {
    const isLoggedIn = localStorage.getItem('collabdLoggedIn') === 'true';
    if (!isLoggedIn) return;
    
    const userData = JSON.parse(localStorage.getItem('collabdUserData'));
    if (!userData) return;
    
    const applications = JSON.parse(localStorage.getItem('collabdApplications') || '[]');
    const userApplications = applications.filter(app => app.userId === userData.id);
    
    if (userApplications.length > 0) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const projectTitle = card.querySelector('h3').textContent;
            const applyButton = card.querySelector('.btn-outline');
            
            const hasApplied = userApplications.some(app => app.projectTitle === projectTitle);
            
            if (hasApplied) {
                applyButton.textContent = 'Applied';
                applyButton.disabled = true;
                applyButton.style.backgroundColor = '#00b894';
                applyButton.style.color = 'white';
                applyButton.style.borderColor = '#00b894';
            }
        });
    }
}

// Update project data in localStorage
function updateProjectData(projectTitle, vacancies) {
    // Get existing project data
    const projectsData = JSON.parse(localStorage.getItem('collabdProjects') || '[]');
    
    // Find and update the specific project
    const projectIndex = projectsData.findIndex(project => project.title === projectTitle);
    
    if (projectIndex !== -1) {
        projectsData[projectIndex].vacancies = vacancies;
        localStorage.setItem('collabdProjects', JSON.stringify(projectsData));
    }
}

// Load project data from localStorage
function loadProjectData() {
    const projectsData = JSON.parse(localStorage.getItem('collabdProjects') || '[]');
    
    if (projectsData.length > 0) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const projectTitle = card.querySelector('h3').textContent;
            const vacancyBadge = card.querySelector('.vacancy-badge');
            
            // Find project in data
            const projectData = projectsData.find(project => project.title === projectTitle);
            
            if (projectData) {
                // Update vacancy display
                vacancyBadge.textContent = projectData.vacancies > 1 ? 
                    `${projectData.vacancies} Vacancies` : 
                    `${projectData.vacancies} Vacancy`;
            }
        });
    }
}

// Set up search field
function setupSearchField() {
    const searchInput = document.querySelector('input[placeholder="Search projects..."]');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        searchProjects(searchTerm);
    });
}

// Search projects functionality
function searchProjects(searchTerm) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.project-tag'))
            .map(tag => tag.textContent.toLowerCase())
            .join(' ');
        
        const matchesSearch = 
            title.includes(searchTerm) || 
            description.includes(searchTerm) || 
            tags.includes(searchTerm);
        
        card.style.display = matchesSearch ? 'block' : 'none';
    });
}

// Set up category filter dropdown
function setupFilterDropdown() {
    const filterSelect = document.querySelector('select:nth-of-type(1)');
    if (!filterSelect) return;
    
    filterSelect.addEventListener('change', function() {
        const category = this.value;
        filterProjects(category);
    });
}

// Filter projects by category
function filterProjects(category) {
    if (category === 'All Categories') {
        // Show all projects
        document.querySelectorAll('.project-card').forEach(card => {
            card.style.display = 'block';
        });
        return;
    }
    
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const tags = Array.from(card.querySelectorAll('.project-tag'))
            .map(tag => tag.textContent);
        
        const matchesCategory = tags.some(tag => 
            tag.toLowerCase() === category.toLowerCase() ||
            (category === 'Web Development' && (
                tag.toLowerCase().includes('react') || 
                tag.toLowerCase().includes('html') ||
                tag.toLowerCase().includes('css') ||
                tag.toLowerCase().includes('javascript') ||
                tag.toLowerCase().includes('js')
            )) ||
            (category === 'Mobile Apps' && (
                tag.toLowerCase().includes('react native') ||
                tag.toLowerCase().includes('android') ||
                tag.toLowerCase().includes('ios') ||
                tag.toLowerCase().includes('flutter')
            )) ||
            (category === 'Data Science' && (
                tag.toLowerCase().includes('python') ||
                tag.toLowerCase().includes('data') ||
                tag.toLowerCase().includes('machine learning')
            )) ||
            (category === 'DevOps' && (
                tag.toLowerCase().includes('docker') ||
                tag.toLowerCase().includes('kubernetes') ||
                tag.toLowerCase().includes('aws') ||
                tag.toLowerCase().includes('ci/cd')
            ))
        );
        
        card.style.display = matchesCategory ? 'block' : 'none';
    });
}

// Set up sort dropdown
function setupSortDropdown() {
    const sortSelect = document.querySelector('select:nth-of-type(2)');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        const sortOption = this.value;
        sortProjects(sortOption);
    });
}

// Sort projects based on selected option
function sortProjects(sortOption) {
    const projectsGrid = document.querySelector('.projects-grid');
    const projectCards = Array.from(document.querySelectorAll('.project-card'));
    
    // Sort the projects
    projectCards.sort((a, b) => {
        if (sortOption === 'Sort by: Newest') {
            // Default is already newest first, use the original HTML order
            const indexA = parseInt(a.getAttribute('data-index') || '0');
            const indexB = parseInt(b.getAttribute('data-index') || '0');
            return indexA - indexB;
        } 
        else if (sortOption === 'Sort by: Oldest') {
            // Reverse the default order
            const indexA = parseInt(a.getAttribute('data-index') || '0');
            const indexB = parseInt(b.getAttribute('data-index') || '0');
            return indexB - indexA;
        }
        else if (sortOption === 'Sort by: Most Vacancies') {
            const vacanciesA = parseInt(a.querySelector('.vacancy-badge').textContent.match(/\d+/)[0]);
            const vacanciesB = parseInt(b.querySelector('.vacancy-badge').textContent.match(/\d+/)[0]);
            return vacanciesB - vacanciesA;
        }
        else if (sortOption === 'Sort by: Most Popular') {
            // For this demo, we'll just use the number of tags as a proxy for popularity
            const tagsA = a.querySelectorAll('.project-tag').length;
            const tagsB = b.querySelectorAll('.project-tag').length;
            return tagsB - tagsA;
        }
        return 0;
    });
    
    // Re-append the sorted cards
    projectCards.forEach(card => {
        projectsGrid.appendChild(card);
    });
}

// Set up Create New Project button
function setupCreateProjectButton() {
    const createProjectButton = document.querySelector('a[href="login.html"].btn');
    if (!createProjectButton) return;
    
    createProjectButton.addEventListener('click', function(e) {
        const isLoggedIn = localStorage.getItem('collabdLoggedIn') === 'true';
        
        if (isLoggedIn) {
            e.preventDefault();
            showCreateProjectForm();
        }
        // If not logged in, the default link to login.html will work
    });
}

// Function to show project creation form
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
    document.getElementById('create-project-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const title = document.getElementById('project-title').value;
        const description = document.getElementById('project-description').value;
        const tags = document.getElementById('project-tags').value;
        const vacancies = parseInt(document.getElementById('project-vacancies').value);
        
        // Get user data
        const userData = JSON.parse(localStorage.getItem('collabdUserData'));
        
        // Create new project
        const newProject = {
            title: title,
            description: description,
            tags: tags,
            vacancies: vacancies,
            creator: userData.fullName || 'Anonymous',
            createdAt: new Date().toISOString()
        };
        
        // Add to projects in localStorage
        const projects = JSON.parse(localStorage.getItem('collabdProjects') || '[]');
        projects.push(newProject);
        localStorage.setItem('collabdProjects', JSON.stringify(projects));
        
        // Close modal
        document.body.removeChild(overlay);
        
        // Add the new project to the UI
        addProjectCard(newProject);
        
        // Show success message
        alert('Project created successfully!');
    });
}

// Function to add a new project card to the UI
function addProjectCard(project) {
    const projectsGrid = document.querySelector('.projects-grid');
    
    // Create tags HTML
    const tagsHtml = project.tags.split(',').map(tag => 
        `<span class="project-tag">${tag.trim()}</span>`
    ).join('');
    
    // Create project card
    const cardHtml = `
        <div class="project-card">
            <div class="project-img">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
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
                        Just now
                    </span>
                </div>
                <div class="project-tags">
                    ${tagsHtml}
                </div>
                <div class="vacancy-badge">${project.vacancies} ${project.vacancies === 1 ? 'Vacancy' : 'Vacancies'}</div>
                <a href="#" class="btn btn-outline">Apply Now</a>
            </div>
        </div>
    `;
    
    // Add to DOM
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cardHtml;
    const newCard = tempDiv.firstElementChild;
    projectsGrid.prepend(newCard);
    
    // Set up apply button for the new card
    const applyButton = newCard.querySelector('.btn-outline');
    applyButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('collabdLoggedIn') === 'true';
        
        if (!isLoggedIn) {
            alert('Please log in to apply for projects');
            window.location.href = 'login.html';
            return;
        }
        
        // Rest of apply logic...
        // (Similar to the apply button logic in setupApplyButtons)
    });
}

// When the page loads, assign data-index attributes for proper sorting
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.setAttribute('data-index', index.toString());
    });
    
    // Load the current project data
    loadProjectData();
});