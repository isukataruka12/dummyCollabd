// document.addEventListener('DOMContentLoaded', function() {
//     // Initialize the workspace components
//     initWorkspace();
    
//     // Initialize all integration components
//     initIntegrations();
    
//     // Set up communication between components
//     setupComponentCommunication();
//   });
  
//   function initWorkspace() {
//     // Set up navigation between views
//     const navItems = document.querySelectorAll('.workspace-nav-item');
//     const views = document.querySelectorAll('.workspace-view');
    
//     navItems.forEach(item => {
//       item.addEventListener('click', () => {
//         // Update active nav item
//         navItems.forEach(nav => nav.classList.remove('active'));
//         item.classList.add('active');
        
//         // Show corresponding view
//         const viewId = item.getAttribute('data-view') + '-view';
//         views.forEach(view => view.classList.remove('active'));
//         document.getElementById(viewId).classList.add('active');
//       });
//     });
    
//     // Handle project selection
//     const projectLinks = document.querySelectorAll('.workspace-projects ul li a');
    
//     projectLinks.forEach(link => {
//       link.addEventListener('click', (e) => {
//         e.preventDefault();
        
//         // Update active project
//         projectLinks.forEach(project => project.classList.remove('active'));
//         link.classList.add('active');
        
//         // Update workspace header
//         const projectName = link.textContent;
//         document.querySelector('.workspace-header h1').textContent = `Workspace: ${projectName}`;
        
//         // Load project in VS Code and GitHub
//         if (window.vsCodeIntegration) {
//           window.vsCodeIntegration.openRepository(projectName);
//         }
        
//         // Dispatch custom event for project change
//         const projectEvent = new CustomEvent('project-change', {
//           detail: { name: projectName }
//         });
//         window.dispatchEvent(projectEvent);
//       });
//     });
    
//     // Handle refresh button
//     document.querySelector('.refresh-btn').addEventListener('click', () => {
//       // Reload all integrations
//       if (window.vsCodeIntegration) {
//         const activeFile = window.vsCodeIntegration.activeFile;
//         window.vsCodeIntegration.showEditor(activeFile);
//       }
      
//       if (window.githubIntegration) {
//         window.githubIntegration.showGitHubDashboard();
//       }
      
//       if (window.discordIntegration) {
//         window.discordIntegration.showDiscordInterface();
//       }
      
//       // Show success message
//       showNotification('Workspace refreshed successfully!', 'success');
//     });
    
//     // Handle settings button
//     document.querySelector('.settings-btn').addEventListener('click', () => {
//       showNotification('Workspace settings coming soon!', 'info');
//     });
    
//     // Handle new project button
//     document.querySelector('.new-project-btn').addEventListener('click', () => {
//       const projectName = prompt('Enter new project name:');
//       if (projectName && projectName.trim()) {
//         // Add new project to list
//         const projectsList = document.querySelector('.workspace-projects ul');
//         const newProject = document.createElement('li');
//         newProject.innerHTML = `<a href="#">${projectName}</a>`;
//         projectsList.appendChild(newProject);
        
//         // Set up click handler for new project
//         const link = newProject.querySelector('a');
//         link.addEventListener('click', (e) => {
//           e.preventDefault();
          
//           // Update active project
//           projectLinks.forEach(project => project.classList.remove('active'));
//           link.classList.add('active');
          
//           // Update workspace header
//           document.querySelector('.workspace-header h1').textContent = `Workspace: ${projectName}`;
          
//           // Load project in VS Code and GitHub
//           if (window.vsCodeIntegration) {
//             window.vsCodeIntegration.openRepository(projectName);
//           }
//         });
        
//         // Trigger click on new project
//         link.click();
        
//         showNotification(`Project "${projectName}" created successfully!`, 'success');
//       }
//     });
    
//     // Handle invite button
//     document.querySelector('.invite-btn').addEventListener('click', () => {
//       showNotification('Invitation sent to team members!', 'success');
//     });
//   }
  
//   function initIntegrations() {
//     // Initialize VS Code in both containers
//     if (window.vsCodeIntegration) {
//       window.vsCodeIntegration.init('vscode-container');
//       // Clone for full view
//       setTimeout(() => {
//         document.getElementById('vscode-container-full').innerHTML = 
//           document.getElementById('vscode-container').innerHTML;
//       }, 500);
//     }
    
//     // Initialize GitHub in both containers
//     if (window.githubIntegration) {
//       window.githubIntegration.init('github-container');
//       // Clone for full view
//       setTimeout(() => {
//         document.getElementById('github-container-full').innerHTML = 
//           document.getElementById('github-container').innerHTML;
//       }, 500);
//     }
    
//     // Initialize Discord in both containers
//     if (window.discordIntegration) {
//       window.discordIntegration.init('discord-container');
//       // Clone for full view
//       setTimeout(() => {
//         document.getElementById('discord-container-full').innerHTML = 
//           document.getElementById('discord-container').innerHTML;
//       }, 500);
//     }
//   }
  
//   function setupComponentCommunication() {
//     // When a GitHub event happens, relay it to Discord
//     window.addEventListener('github-event', function(e) {
//       if (window.discordIntegration) {
//         window.discordIntegration.handleGitHubEvent(e.detail);
//       }
//     });
    
//     // When a VS Code event happens, relay it to Discord
//     window.addEventListener('vscode-event', function(e) {
//       if (window.discordIntegration) {
//         window.discordIntegration.handleVSCodeEvent(e.detail);
//       }
//     });
    
//     // Listen for project changes
//     window.addEventListener('project-change', function(e) {
//       const projectName = e.detail.name;
      
//       // Update VS Code with the new project
//       if (window.vsCodeIntegration) {
//         window.vsCodeIntegration.openRepository(projectName);
//       }
      
//       // Update GitHub to show the project repos
//       if (window.githubIntegration && window.githubIntegration.filterByRepo) {
//         window.githubIntegration.filterByRepo(projectName);
//       }
      
//       // Send a message to Discord about project change
//       if (window.discordIntegration) {
//         window.discordIntegration.relayMessage(`Switched to project: ${projectName}`, 'general');
//       }
//     });
    
//     // For demo purposes, simulate some events after a delay
//     setTimeout(() => {
//       // Simulate a GitHub commit event
//       const githubEvent = new CustomEvent('github-event', {
//         detail: {
//           type: 'commit',
//           repo: 'collabd-project',
//           message: 'Added new workspace integration feature'
//         }
//       });
//       window.dispatchEvent(githubEvent);
      
//       // Simulate a VS Code file edit event after another delay
//       setTimeout(() => {
//         const vscodeEvent = new CustomEvent('vscode-event', {
//           detail: {
//             type: 'file_edit',
//             file: 'workspace.js',
//             project: 'collabd-project'
//           }
//         });
//         window.dispatchEvent(vscodeEvent);
//       }, 5000);
//     }, 3000);
//   }
  
//   // Utility function to show notifications
//   function showNotification(message, type = 'info') {
//     // Create notification element
//     const notification = document.createElement('div');
//     notification.className = `workspace-notification ${type}`;
//     notification.innerHTML = `
//       <div class="notification-content">
//         <i class="fas ${getIconForType(type)}"></i>
//         <span>${message}</span>
//       </div>
//       <button class="close-notification">×</button>
//     `;
    
//     // Add to document
//     document.body.appendChild(notification);
    
//     // Add close handler
//     notification.querySelector('.close-notification').addEventListener('click', () => {
//       notification.classList.add('closing');
//       setTimeout(() => {
//         notification.remove();
//       }, 300);
//     });
    
//     // Auto-remove after 5 seconds
//     setTimeout(() => {
//       notification.classList.add('closing');
//       setTimeout(() => {
//         notification.remove();
//       }, 300);
//     }, 5000);
    
//     // Add animation class after a tiny delay (for animation to work)
//     setTimeout(() => {
//       notification.classList.add('show');
//     }, 10);
//   }
  
//   function getIconForType(type) {
//     switch (type) {
//       case 'success': return 'fa-check-circle';
//       case 'error': return 'fa-exclamation-circle';
//       case 'warning': return 'fa-exclamation-triangle';
//       case 'info':
//       default: return 'fa-info-circle';
//     }
//   }
  
//   // Add this to your existing CSS file
//   const notificationStyles = `
//   .workspace-notification {
//     position: fixed;
//     top: 20px;
//     right: 20px;
//     background-color: white;
//     border-left: 4px solid #4CAF50;
//     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//     border-radius: 4px;
//     padding: 0;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     max-width: 350px;
//     transform: translateX(400px);
//     opacity: 0;
//     transition: transform 0.3s, opacity 0.3s;
//     z-index: 1000;
//   }
  
//   .workspace-notification.show {
//     transform: translateX(0);
//     opacity: 1;
//   }
  
//   .workspace-notification.closing {
//     transform: translateX(400px);
//     opacity: 0;
//   }
  
//   .workspace-notification.info {
//     border-left-color: #2196F3;
//   }
  
//   .workspace-notification.success {
//     border-left-color: #4CAF50;
//   }
  
//   .workspace-notification.warning {
//     border-left-color: #ff9800;
//   }
  
//   .workspace-notification.error {
//     border-left-color: #f44336;
//   }
  
//   .notification-content {
//     display: flex;
//     align-items: center;
//     padding: 12px 15px;
//   }
  
//   .notification-content i {
//     margin-right: 10px;
//     font-size: 18px;
//   }
  
//   .workspace-notification.info i {
//     color: #2196F3;
//   }
  
//   .workspace-notification.success i {
//     color: #4CAF50;
//   }
  
//   .workspace-notification.warning i {
//     color: #ff9800;
//   }
  
//   .workspace-notification.error i {
//     color: #f44336;
//   }
  
//   .close-notification {
//     background: none;
//     border: none;
//     font-size: 22px;
//     cursor: pointer;
//     color: #888;
//     padding: 10px 15px;
//     transition: color 0.2s;
//   }
  
//   .close-notification:hover {
//     color: #333;
//   }
//   `;
  
//   // Add notification styles to the page
//   const styleEl = document.createElement('style');
//   styleEl.textContent = notificationStyles;
//   document.head.appendChild(styleEl);




// workspace-integration.js
// This file enhances the workspace with database integration and service redirects

document.addEventListener('DOMContentLoaded', function() {
  // Load required scripts if not already loaded
  loadScriptIfNotExists('js/database-integration.js');
  loadScriptIfNotExists('js/service-redirects.js');
  loadScriptIfNotExists('js/launcher.js');
  
  // Wait a bit to ensure scripts are loaded
  setTimeout(() => {
    // Initialize workspace enhancements
    initWorkspaceEnhancements();
  }, 500);
});

// Load script if it doesn't exist
function loadScriptIfNotExists(src) {
  if (!document.querySelector(`script[src="${src}"]`)) {
    const script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
  }
}

// Initialize workspace enhancements
function initWorkspaceEnhancements() {
  // Sync projects with database
  syncProjectsWithDatabase();
  
  // Add service redirect buttons to workspace navigation
  enhanceWorkspaceNavigation();
  
  // Enhance project actions for database integration
  enhanceProjectActions();
  
  // Enable direct launch integration
  enableDirectLaunch();
}

// Sync projects with database
async function syncProjectsWithDatabase() {
  if (!window.ProjectsDatabaseManager) return;
  
  try {
    // Get projects from database
    const projects = await ProjectsDatabaseManager.getProjects();
    
    // Get the projects list container
    const projectsList = document.querySelector('.workspace-projects ul');
    if (!projectsList) return;
    
    // Clear existing projects
    projectsList.innerHTML = '';
    
    // Add projects from database
    projects.forEach(project => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="#" data-repo="${project.title}">${project.title}</a>`;
      projectsList.appendChild(li);
    });
    
    // Set up click handlers for new project items
    const projectLinks = document.querySelectorAll('.workspace-projects ul li a');
    projectLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active project
        projectLinks.forEach(p => p.classList.remove('active'));
        link.classList.add('active');
        
        // Update workspace header
        const projectName = link.textContent;
        document.querySelector('.workspace-header h1').textContent = `Workspace: ${projectName}`;
        
        // Trigger project change event
        const projectEvent = new CustomEvent('project-change', {
          detail: { name: projectName }
        });
        window.dispatchEvent(projectEvent);
      });
    });
    
    // Activate first project if none active
    if (!document.querySelector('.workspace-projects ul li a.active') && projectLinks.length > 0) {
      projectLinks[0].classList.add('active');
    }
  } catch (error) {
    console.error('Error syncing projects with database:', error);
  }
}

// Enhance workspace navigation with direct launch capabilities
function enhanceWorkspaceNavigation() {
  // Add direct launch attributes to workspace nav items
  const vsCodeNav = document.querySelector('.workspace-nav-item[data-view="vscode"]');
  const githubNav = document.querySelector('.workspace-nav-item[data-view="github"]');
  const discordNav = document.querySelector('.workspace-nav-item[data-view="discord"]');
  
  if (vsCodeNav) {
    vsCodeNav.setAttribute('data-service', 'vscode');
    
    // Add context menu for direct launch options
    vsCodeNav.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      
      // Get active project
      const activeProject = document.querySelector('.workspace-projects ul li a.active');
      const projectName = activeProject ? activeProject.textContent : null;
      
      // Show context menu for launching options
      showServiceContextMenu(e.pageX, e.pageY, 'vscode', projectName);
    });
  }
  
  if (githubNav) {
    githubNav.setAttribute('data-service', 'github');
    
    // Add context menu for direct launch options
    githubNav.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      
      // Get active project
      const activeProject = document.querySelector('.workspace-projects ul li a.active');
      const projectName = activeProject ? activeProject.textContent : null;
      
      // Show context menu for launching options
      showServiceContextMenu(e.pageX, e.pageY, 'github', projectName);
    });
  }
  
  if (discordNav) {
    discordNav.setAttribute('data-service', 'discord');
    
    // Add context menu for direct launch options
    discordNav.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      
      // Show context menu for launching options
      showServiceContextMenu(e.pageX, e.pageY, 'discord');
    });
  }
}

// Show context menu for service launch options
function showServiceContextMenu(x, y, service, projectName = null) {
  // Remove any existing context menu
  const existingMenu = document.querySelector('.service-context-menu');
  if (existingMenu) {
    existingMenu.remove();
  }
  
  // Create context menu
  const menu = document.createElement('div');
  menu.className = 'service-context-menu';
  menu.style.position = 'absolute';
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.style.backgroundColor = 'white';
  menu.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  menu.style.borderRadius = '4px';
  menu.style.padding = '5px 0';
  menu.style.zIndex = '1000';
  
  // Add menu items based on service
  let menuItems = [];
  
  if (service === 'vscode') {
    menuItems = [
      { text: 'Open VS Code Desktop', action: () => redirectToVSCode(projectName) },
      { text: 'Open VS Code Web', action: () => window.open(`https://vscode.dev`, '_blank') },
      { text: projectName ? `Open ${projectName} Project` : 'Open Active Project', 
        action: () => redirectToVSCode(projectName) }
    ];
  } else if (service === 'github') {
    menuItems = [
      { text: 'Open GitHub Profile', action: () => redirectToGitHub() },
      { text: projectName ? `Open ${projectName} Repository` : 'Open Active Repository', 
        action: () => redirectToGitHub(null, projectName) }
    ];
  } else if (service === 'discord') {
    menuItems = [
      { text: 'Open Discord App', action: () => redirectToDiscord() },
      { text: 'Open Discord Web', action: () => window.open('https://discord.com/app', '_blank') },
      { text: 'Join Collabd Server', action: () => redirectToDiscord('Collabd') }
    ];
  }
  
  // Add items to menu
  menuItems.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.className = 'service-context-menu-item';
    menuItem.textContent = item.text;
    menuItem.style.padding = '8px 15px';
    menuItem.style.cursor = 'pointer';
    menuItem.style.whiteSpace = 'nowrap';
    
    menuItem.addEventListener('mouseover', function() {
      this.style.backgroundColor = '#f5f5f5';
    });
    
    menuItem.addEventListener('mouseout', function() {
      this.style.backgroundColor = 'transparent';
    });
    
    menuItem.addEventListener('click', function() {
      // Hide menu
      menu.remove();
      
      // Execute action
      item.action();
    });
    
    menu.appendChild(menuItem);
  });
  
  // Add to document
  document.body.appendChild(menu);
  
  // Close menu when clicking outside
  document.addEventListener('click', function closeMenu() {
    menu.remove();
    document.removeEventListener('click', closeMenu);
  });
}

// Enhance project actions
function enhanceProjectActions() {
  // Enhance new project button
  const newProjectBtn = document.querySelector('.new-project-btn');
  if (newProjectBtn) {
    // Replace click handler to use database
    newProjectBtn.removeEventListener('click', newProjectBtn.onclick);
    newProjectBtn.addEventListener('click', createNewProject);
  }
}

// Create new project with database integration
async function createNewProject() {
  const projectName = prompt('Enter new project name:');
  if (!projectName || !projectName.trim()) return;
  
  try {
    // Get current user
    const userData = UserDatabaseManager?.getCurrentUser() || 
                    JSON.parse(localStorage.getItem('collabdUserData') || '{}');
    
    // Create project in database
    const newProject = await ProjectsDatabaseManager.createProject({
      title: projectName,
      description: 'New project created from workspace',
      tags: 'new,project',
      vacancies: 3,
      creator: userData.fullName || userData.username || 'Anonymous'
    });
    
    // Update UI
    const projectsList = document.querySelector('.workspace-projects ul');
    const projectLinks = document.querySelectorAll('.workspace-projects ul li a');
    
    // Create new project list item
    const li = document.createElement('li');
    li.innerHTML = `<a href="#" data-repo="${projectName}">${projectName}</a>`;
    projectsList.appendChild(li);
    
    // Set up click handler for new project
    const link = li.querySelector('a');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active project
      projectLinks.forEach(p => p.classList.remove('active'));
      link.classList.add('active');
      
      // Update workspace header
      document.querySelector('.workspace-header h1').textContent = `Workspace: ${projectName}`;
      
      // Trigger project change event
      const projectEvent = new CustomEvent('project-change', {
        detail: { name: projectName }
      });
      window.dispatchEvent(projectEvent);
    });
    
    // Activate the new project
    link.click();
    
    // Show success notification
    showNotification(`Project "${projectName}" created successfully!`, 'success');
  } catch (error) {
    console.error('Error creating project:', error);
    showNotification('Failed to create project. Please try again.', 'error');
  }
}

// Enable direct launch from project list
function enableDirectLaunch() {
  // Add context menu for projects
  const projectLinks = document.querySelectorAll('.workspace-projects ul li a');
  
  projectLinks.forEach(link => {
    link.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      
      const projectName = this.textContent;
      
      // Show context menu with launch options
      showProjectContextMenu(e.pageX, e.pageY, projectName);
    });
  });
}

// Show context menu for project launch options
function showProjectContextMenu(x, y, projectName) {
  // Remove any existing context menu
  const existingMenu = document.querySelector('.project-context-menu');
  if (existingMenu) {
    existingMenu.remove();
  }
  
  // Create context menu
  const menu = document.createElement('div');
  menu.className = 'project-context-menu';
  menu.style.position = 'absolute';
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.style.backgroundColor = 'white';
  menu.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  menu.style.borderRadius = '4px';
  menu.style.padding = '5px 0';
  menu.style.zIndex = '1000';
  
  // Add menu items
  const menuItems = [
    { 
      text: 'Open in VS Code', 
      icon: '<i class="fas fa-code"></i>', 
      action: () => redirectToVSCode(projectName) 
    },
    { 
      text: 'View on GitHub', 
      icon: '<i class="fab fa-github"></i>', 
      action: () => redirectToGitHub(null, projectName) 
    },
    { 
      text: 'Discuss on Discord', 
      icon: '<i class="fab fa-discord"></i>', 
      action: () => {
        // Create channel name from project name (lowercase with hyphens)
        const channelName = projectName.toLowerCase().replace(/\s+/g, '-');
        redirectToDiscord('Collabd', channelName);
      }
    },
    { 
      text: 'View Project Details', 
      icon: '<i class="fas fa-info-circle"></i>', 
      action: () => {
        // Try to fetch project ID
        ProjectsDatabaseManager.getProjects()
          .then(projects => {
            const project = projects.find(p => p.title === projectName);
            if (project && project.id) {
              window.open(`project-details.php?id=${project.id}`, '_blank');
            } else {
              showNotification('Project details not available', 'warning');
            }
          })
          .catch(err => {
            console.error('Error getting project details:', err);
            showNotification('Could not retrieve project details', 'error');
          });
      }
    }
  ];
  
  // Add items to menu
  menuItems.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.className = 'project-context-menu-item';
    menuItem.innerHTML = `${item.icon} <span>${item.text}</span>`;
    menuItem.style.padding = '8px 15px';
    menuItem.style.cursor = 'pointer';
    menuItem.style.display = 'flex';
    menuItem.style.alignItems = 'center';
    menuItem.style.gap = '8px';
    
    // Style the icon
    const icon = menuItem.querySelector('i');
    if (icon) {
      icon.style.width = '16px';
      icon.style.textAlign = 'center';
      
      // Color based on service
      if (icon.classList.contains('fa-code')) {
        icon.style.color = '#007acc';
      } else if (icon.classList.contains('fa-github')) {
        icon.style.color = '#24292e';
      } else if (icon.classList.contains('fa-discord')) {
        icon.style.color = '#7289da';
      }
    }
    
    menuItem.addEventListener('mouseover', function() {
      this.style.backgroundColor = '#f5f5f5';
    });
    
    menuItem.addEventListener('mouseout', function() {
      this.style.backgroundColor = 'transparent';
    });
    
    menuItem.addEventListener('click', function() {
      // Hide menu
      menu.remove();
      
      // Execute action
      item.action();
    });
    
    menu.appendChild(menuItem);
  });
  
  // Add to document
  document.body.appendChild(menu);
  
  // Close menu when clicking outside
  document.addEventListener('click', function closeMenu() {
    menu.remove();
    document.removeEventListener('click', closeMenu);
  });
}

// Show notification (reusing from workspace.js)
function showNotification(message, type = 'info') {
  // Check if the original function exists
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, type);
    return;
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `workspace-notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${getIconForType(type)}"></i>
      <span>${message}</span>
    </div>
    <button class="close-notification">×</button>
  `;
  
  // Style the notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: 'white',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
    borderLeftColor: type === 'success' ? '#4CAF50' : 
                     type === 'warning' ? '#ff9800' : 
                     type === 'error' ? '#f44336' : '#2196F3',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '350px',
    transform: 'translateX(400px)',
    opacity: '0',
    transition: 'transform 0.3s, opacity 0.3s',
    zIndex: '1000'
  });
  
  // Add to document
  document.body.appendChild(notification);
  
  // Add close handler
  notification.querySelector('.close-notification').addEventListener('click', () => {
    notification.style.transform = 'translateX(400px)';
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
  
  // Add animation class after a tiny delay (for animation to work)
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
    notification.style.opacity = '1';
  }, 10);
}

function getIconForType(type) {
  switch (type) {
    case 'success': return 'fa-check-circle';
    case 'error': return 'fa-exclamation-circle';
    case 'warning': return 'fa-exclamation-triangle';
    case 'info':
    default: return 'fa-info-circle';
  }
}