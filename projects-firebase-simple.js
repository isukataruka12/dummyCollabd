// This version doesn't use ES modules and can be included directly in HTML with a script tag

// Initialize Firebase when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyAmO2yXvIwHq8nP78qKr_aO8A92I-orIVo",
      authDomain: "collabd-ce35e.firebaseapp.com",
      databaseURL: "https://collabd-ce35e-default-rtdb.firebaseio.com",
      projectId: "collabd-ce35e",
      storageBucket: "collabd-ce35e.firebasestorage.app",
      messagingSenderId: "680036639038",
      appId: "1:680036639038:web:b71c426fc93b4deb58cc6f",
      measurementId: "G-JH71SGEE29"
    };
  
    // Initialize Firebase if not already initialized
    if (typeof firebase !== 'undefined') {
      // Check if Firebase app is already initialized
      try {
        firebase.app();
      } catch (e) {
        firebase.initializeApp(firebaseConfig);
      }
    } else {
      console.error('Firebase SDK not loaded. Make sure to include the Firebase scripts.');
      return;
    }
  
    const db = firebase.firestore();
    const auth = firebase.auth();
    
    // Check if user is logged in
    let currentUser = null;
    
    // Add notification styles
    addNotificationStyles();
    
    // Wait for auth state to be determined before proceeding
    auth.onAuthStateChanged(function(user) {
      currentUser = user;
      
      // Get reference to the projects grid to check if we're on the projects page
      const projectsGrid = document.querySelector('.projects-grid');
      
      if (projectsGrid) {
        // Initialize and load projects
        initializeProjectData();
      }
    });
    
    // Initialize project data from HTML elements if not in Firestore
    function initializeProjectData() {
      // Check if projects collection has data
      db.collection('projects').get().then(function(snapshot) {
        if (snapshot.empty) {
          console.log('No projects in Firestore. Initializing from HTML...');
          const projectCards = document.querySelectorAll('.project-card');
          
          // Use Promise.all to wait for all projects to be saved
          const promises = [];
          
          projectCards.forEach(function(card) {
            const title = card.querySelector('h3').textContent;
            const description = card.querySelector('p').textContent;
            const tagsElements = card.querySelectorAll('.project-tag');
            const tags = Array.from(tagsElements).map(tag => tag.textContent.trim());
            const vacancyBadge = card.querySelector('.vacancy-badge');
            const vacancies = parseInt(vacancyBadge.textContent.match(/\d+/)[0]);
            const creatorElement = card.querySelector('.project-meta span:first-child');
            // Get creator text and remove the SVG element part
            const creatorText = creatorElement ? creatorElement.textContent.trim() : 'Anonymous';
            const creator = creatorText.replace(/^\s+/g, '');
            
            // Add project to Firestore and store promise
            const promise = db.collection('projects').add({
              title,
              description,
              tags,
              vacancies,
              creator,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function(docRef) {
              // Add data-id attribute to the project card
              card.setAttribute('data-id', docRef.id);
              return docRef;
            });
            
            promises.push(promise);
          });
          
          // Wait for all projects to be saved
          Promise.all(promises).then(function() {
            showNotification('Projects initialized in Firebase', 'success');
            
            // Set up interactions after data is ready
            setupApplyButtons();
            setupFilterOptions();
            setupCreateProjectButton();
          }).catch(function(error) {
            console.error('Error initializing projects:', error);
            showNotification('Failed to initialize some projects', 'error');
          });
        } else {
          console.log('Projects already exist in Firestore');
          
          // Load projects from Firestore
          loadProjects();
          
          // Set up interactions
          setupFilterOptions();
          setupCreateProjectButton();
        }
      }).catch(function(error) {
        console.error('Error checking projects collection:', error);
        showNotification('Failed to initialize projects', 'error');
      });
    }
    
    // Load projects from Firestore
    function loadProjects() {
      db.collection('projects').get().then(function(snapshot) {
        if (!snapshot.empty) {
          // Clear existing projects
          const projectsGrid = document.querySelector('.projects-grid');
          if (projectsGrid) {
            projectsGrid.innerHTML = '';
            
            // Render projects from Firestore
            snapshot.forEach(function(doc) {
              const project = doc.data();
              project.id = doc.id;
              addProjectCard(project, projectsGrid);
            });
            
            // Set up apply buttons after DOM is updated
            setupApplyButtons();
          }
        }
      }).catch(function(error) {
        console.error('Error loading projects:', error);
        showNotification('Failed to load projects', 'error');
      });
    }
    
    // Function to add a project card to the UI
    function addProjectCard(project, projectsGrid) {
      if (!projectsGrid) return;
      
      // Create tags HTML
      const tagsHtml = Array.isArray(project.tags) && project.tags.length > 0
        ? project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')
        : '';
      
      // Format date
      let timeAgo = 'Recently';
      if (project.createdAt) {
        // Handle Firebase timestamp conversion
        const createdDate = project.createdAt.toDate ? project.createdAt.toDate() : 
                           (project.createdAt.seconds ? new Date(project.createdAt.seconds * 1000) : new Date());
        timeAgo = getTimeAgo(createdDate);
      }
      
      // Create project card
      const cardHtml = `
        <div class="project-card" data-id="${project.id}">
          <div class="project-img">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div class="project-info">
            <h3>${project.title || 'Untitled Project'}</h3>
            <p>${project.description || 'No description provided.'}</p>
            <div class="project-meta">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                ${project.creator || 'Anonymous'}
              </span>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                ${timeAgo}
              </span>
            </div>
            <div class="project-tags">
              ${tagsHtml}
            </div>
            <div class="vacancy-badge">${project.vacancies || 0} ${project.vacancies === 1 ? 'Vacancy' : 'Vacancies'}</div>
            <a href="#" class="btn btn-outline">Apply Now</a>
          </div>
        </div>
      `;
      
      // Add to DOM
      projectsGrid.insertAdjacentHTML('beforeend', cardHtml);
    }
    
    // Helper function to get time ago string
    function getTimeAgo(date) {
      if (!date || !(date instanceof Date) || isNaN(date)) {
        return 'Recently';
      }
      
      const now = new Date();
      const diffMs = now - date;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);
      const diffWeek = Math.floor(diffDay / 7);
      const diffMonth = Math.floor(diffDay / 30);
      
      if (diffMonth > 0) {
        return diffMonth === 1 ? '1 month ago' : `${diffMonth} months ago`;
      } else if (diffWeek > 0) {
        return diffWeek === 1 ? '1 week ago' : `${diffWeek} weeks ago`;
      } else if (diffDay > 0) {
        return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
      } else if (diffHour > 0) {
        return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
      } else if (diffMin > 0) {
        return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
      } else {
        return 'Just now';
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
          if (!currentUser) {
            showNotification('Please log in to apply for projects', 'warning');
            window.location.href = 'login.html';
            return;
          }
          
          // Get project card and project info
          const projectCard = this.closest('.project-card');
          if (!projectCard) {
            showNotification('Project information not found', 'error');
            return;
          }
          
          const projectId = projectCard.getAttribute('data-id');
          if (!projectId) {
            showNotification('Project ID not found', 'error');
            return;
          }
          
          const projectTitle = projectCard.querySelector('h3').textContent;
          
          // Get current project data
          db.collection('projects').doc(projectId).get().then((doc) => {
            if (!doc.exists) {
              showNotification('Project not found in database', 'error');
              return;
            }
            
            const projectData = doc.data();
            
            // Check if user has already applied
            db.collection('applications')
              .where('userId', '==', currentUser.uid)
              .where('projectId', '==', projectId)
              .get()
              .then((snapshot) => {
                if (!snapshot.empty) {
                  showNotification(`You have already applied to "${projectTitle}"`, 'info');
                  return;
                }
                
                // Check vacancies
                let vacancies = projectData.vacancies || 0;
                if (vacancies <= 0) {
                  showNotification('Sorry, there are no more vacancies for this project', 'warning');
                  return;
                }
                
                // Reduce vacancies by 1
                vacancies--;
                
                // Update project in Firestore
                db.collection('projects').doc(projectId).update({
                  vacancies,
                  updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                  // Create application in Firestore
                  return db.collection('applications').add({
                    userId: currentUser.uid,
                    userEmail: currentUser.email || '',
                    projectId,
                    projectTitle,
                    appliedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    status: 'Pending'
                  });
                }).then(() => {
                  // Update UI
                  const vacancyBadge = projectCard.querySelector('.vacancy-badge');
                  if (vacancyBadge) {
                    vacancyBadge.textContent = vacancies > 1 ? `${vacancies} Vacancies` : `${vacancies} Vacancy`;
                  }
                  
                  this.textContent = 'Applied';
                  this.disabled = true;
                  this.style.backgroundColor = '#00b894';
                  this.style.color = 'white';
                  this.style.borderColor = '#00b894';
                  
                  showNotification(`Successfully applied to "${projectTitle}"!`, 'success');
                }).catch((error) => {
                  console.error('Error updating project:', error);
                  showNotification('Failed to apply to project', 'error');
                });
              }).catch((error) => {
                console.error('Error checking applications:', error);
                showNotification('Failed to check application status', 'error');
              });
          }).catch((error) => {
            console.error('Error getting project:', error);
            showNotification('Failed to get project data', 'error');
          });
        });
      });
      
      // Check and update UI for already applied projects
      checkAppliedProjects();
    }
    
    // Check if user has already applied to projects and update UI
    function checkAppliedProjects() {
      if (!currentUser) return;
      
      db.collection('applications')
        .where('userId', '==', currentUser.uid)
        .get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            const appliedProjectIds = [];
            snapshot.forEach(doc => {
              const data = doc.data();
              if (data.projectId) {
                appliedProjectIds.push(data.projectId);
              }
            });
            
            const projectCards = document.querySelectorAll('.project-card');
            
            projectCards.forEach(card => {
              const projectId = card.getAttribute('data-id');
              if (projectId && appliedProjectIds.includes(projectId)) {
                const applyButton = card.querySelector('.btn-outline');
                if (applyButton) {
                  applyButton.textContent = 'Applied';
                  applyButton.disabled = true;
                  applyButton.style.backgroundColor = '#00b894';
                  applyButton.style.color = 'white';
                  applyButton.style.borderColor = '#00b894';
                }
              }
            });
          }
        }).catch((error) => {
          console.error('Error checking applied projects:', error);
        });
    }
    
    // Set up filter options
    function setupFilterOptions() {
      const searchInput = document.querySelector('input[placeholder="Search projects..."]');
      const categorySelect = document.querySelector('select:nth-of-type(1)');
      const sortSelect = document.querySelector('select:nth-of-type(2)');
      
      if (searchInput) {
        searchInput.addEventListener('input', filterProjects);
      }
      
      if (categorySelect) {
        categorySelect.addEventListener('change', filterProjects);
      }
      
      if (sortSelect) {
        sortSelect.addEventListener('change', filterProjects);
      }
    }
    
    // Filter and sort projects
    function filterProjects() {
      const searchInput = document.querySelector('input[placeholder="Search projects..."]');
      const categorySelect = document.querySelector('select:nth-of-type(1)');
      const sortSelect = document.querySelector('select:nth-of-type(2)');
      
      const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const category = categorySelect ? categorySelect.value : 'All Categories';
      const sortOption = sortSelect ? sortSelect.value : 'Sort by: Newest';
      
      // Get all projects from Firestore
      db.collection('projects').get().then((snapshot) => {
        // Convert to array and apply filters
        let projects = [];
        snapshot.forEach(doc => {
          const project = doc.data();
          project.id = doc.id;
          projects.push(project);
        });
        
        // Apply search filter
        if (searchTerm) {
          projects = projects.filter(project => {
            const title = (project.title || '').toLowerCase();
            const description = (project.description || '').toLowerCase();
            const tags = Array.isArray(project.tags) ? project.tags.map(tag => tag.toLowerCase()) : [];
            
            return title.includes(searchTerm) ||
                   description.includes(searchTerm) ||
                   tags.some(tag => tag.includes(searchTerm));
          });
        }
        
        // Apply category filter
        if (category !== 'All Categories') {
          projects = projects.filter(project => {
            if (!Array.isArray(project.tags) || project.tags.length === 0) return false;
            
            const tags = project.tags.map(tag => tag.toLowerCase());
            
            if (category === 'Web Development') {
              return tags.some(tag => 
                ['react', 'html', 'css', 'javascript', 'js', 'web'].some(term => tag.includes(term))
              );
            } else if (category === 'Mobile Apps') {
              return tags.some(tag => 
                ['react native', 'android', 'ios', 'flutter', 'mobile'].some(term => tag.includes(term))
              );
            } else if (category === 'Data Science') {
              return tags.some(tag => 
                ['python', 'data', 'machine learning', 'ml', 'ai'].some(term => tag.includes(term))
              );
            } else if (category === 'DevOps') {
              return tags.some(tag => 
                ['docker', 'kubernetes', 'aws', 'ci/cd', 'devops'].some(term => tag.includes(term))
              );
            } else {
              return tags.some(tag => tag === category.toLowerCase());
            }
          });
        }
        
        // Apply sorting
        if (sortOption === 'Sort by: Newest') {
          projects.sort((a, b) => {
            const timeA = a.createdAt ? (a.createdAt.seconds || 0) : 0;
            const timeB = b.createdAt ? (b.createdAt.seconds || 0) : 0;
            return timeB - timeA;
          });
        } else if (sortOption === 'Sort by: Oldest') {
          projects.sort((a, b) => {
            const timeA = a.createdAt ? (a.createdAt.seconds || 0) : 0;
            const timeB = b.createdAt ? (b.createdAt.seconds || 0) : 0;
            return timeA - timeB;
          });
        } else if (sortOption === 'Sort by: Most Vacancies') {
          projects.sort((a, b) => (b.vacancies || 0) - (a.vacancies || 0));
        } else if (sortOption === 'Sort by: Most Popular') {
          // For simplicity, we'll use the number of tags as a proxy for popularity
          projects.sort((a, b) => {
            const tagsA = Array.isArray(a.tags) ? a.tags.length : 0;
            const tagsB = Array.isArray(b.tags) ? b.tags.length : 0;
            return tagsB - tagsA;
          });
        }
        
        // Render filtered and sorted projects
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
          projectsGrid.innerHTML = '';
          projects.forEach(project => {
            addProjectCard(project, projectsGrid);
          });
          
          setupApplyButtons();
        }
      }).catch((error) => {
        console.error('Error filtering projects:', error);
        showNotification('Failed to filter projects', 'error');
      });
    }
    
    // Setup Create New Project button
    function setupCreateProjectButton() {
      const createProjectButton = document.querySelector('a[href="login.html"].btn');
      if (!createProjectButton) return;
      
      createProjectButton.addEventListener('click', function(e) {
        if (currentUser) {
          e.preventDefault();
          showCreateProjectForm();
        }
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
        
        if (!currentUser) {
          showNotification('You must be logged in to create a project', 'warning');
          document.body.removeChild(overlay);
          window.location.href = 'login.html';
          return;
        }
        
        // Get form values
        const title = document.getElementById('project-title').value.trim();
        const description = document.getElementById('project-description').value.trim();
        const tagsInput = document.getElementById('project-tags').value.trim();
        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
        const vacancies = parseInt(document.getElementById('project-vacancies').value) || 0;
        
        // Add new project to Firestore
        db.collection('projects').add({
          title,
          description,
          tags,
          vacancies,
          creator: currentUser.displayName || currentUser.email || 'Anonymous',
          creatorId: currentUser.uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function(docRef) {
          // Close modal
          document.body.removeChild(overlay);
          
          // Show success message
          showNotification('Project created successfully!', 'success');
          
          // Reload projects
          loadProjects();
        }).catch(function(error) {
          console.error('Error creating project:', error);
          showNotification('Failed to create project: ' + error.message, 'error');
        });
      });
    }
    
    // Simple notification function
    function showNotification(message, type = "info") {
      // Check if notification container exists, create if not
      let notificationContainer = document.querySelector('.notification-container');
      if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
      }
      
      // Create notification element
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;
      
      // Add to container
      notificationContainer.appendChild(notification);
      
      // Remove after 3 seconds
      setTimeout(function() {
        notification.classList.add('fade-out');
        setTimeout(function() {
          notification.remove();
        }, 500);
      }, 3000);
    }
    
    // Add CSS for notifications
    function addNotificationStyles() {
      const existingStyle = document.getElementById('notification-styles');
      if (existingStyle) return;
      
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        .notification-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
        }
        
        .notification {
          margin-bottom: 10px;
          padding: 15px 20px;
          border-radius: 4px;
          color: white;
          min-width: 250px;
          max-width: 350px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          animation: slideIn 0.5s ease-out forwards;
        }
        
        .notification.success {
          background-color: #4CAF50;
        }
        
        .notification.error {
          background-color: #F44336;
        }
        
        .notification.info {
          background-color: #2196F3;
        }
        
        .notification.warning {
          background-color: #FF9800;
        }
        
        .notification.fade-out {
          animation: fadeOut 0.5s ease-out forwards;
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Export functions for global access
    window.createProject = showCreateProjectForm;
    window.applyToProject = function(projectId) {
      const applyButton = document.querySelector(`.project-card[data-id="${projectId}"] .btn-outline`);
      if (applyButton) {
        applyButton.click();
      }
    };
  });