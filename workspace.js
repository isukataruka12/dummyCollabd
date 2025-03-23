document.addEventListener('DOMContentLoaded', function() {
    // Initialize the workspace components
    initWorkspace();
    
    // Initialize all integration components
    initIntegrations();
    
    // Set up communication between components
    setupComponentCommunication();
  });
  
  function initWorkspace() {
    // Set up navigation between views
    const navItems = document.querySelectorAll('.workspace-nav-item');
    const views = document.querySelectorAll('.workspace-view');
    
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        // Update active nav item
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Show corresponding view
        const viewId = item.getAttribute('data-view') + '-view';
        views.forEach(view => view.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
      });
    });
    
    // Handle project selection
    const projectLinks = document.querySelectorAll('.workspace-projects ul li a');
    
    projectLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active project
        projectLinks.forEach(project => project.classList.remove('active'));
        link.classList.add('active');
        
        // Update workspace header
        const projectName = link.textContent;
        document.querySelector('.workspace-header h1').textContent = `Workspace: ${projectName}`;
        
        // Load project in VS Code and GitHub
        if (window.vsCodeIntegration) {
          window.vsCodeIntegration.openRepository(projectName);
        }
        
        // Dispatch custom event for project change
        const projectEvent = new CustomEvent('project-change', {
          detail: { name: projectName }
        });
        window.dispatchEvent(projectEvent);
      });
    });
    
    // Handle refresh button
    document.querySelector('.refresh-btn').addEventListener('click', () => {
      // Reload all integrations
      if (window.vsCodeIntegration) {
        const activeFile = window.vsCodeIntegration.activeFile;
        window.vsCodeIntegration.showEditor(activeFile);
      }
      
      if (window.githubIntegration) {
        window.githubIntegration.showGitHubDashboard();
      }
      
      if (window.discordIntegration) {
        window.discordIntegration.showDiscordInterface();
      }
      
      // Show success message
      showNotification('Workspace refreshed successfully!', 'success');
    });
    
    // Handle settings button
    document.querySelector('.settings-btn').addEventListener('click', () => {
      showNotification('Workspace settings coming soon!', 'info');
    });
    
    // Handle new project button
    document.querySelector('.new-project-btn').addEventListener('click', () => {
      const projectName = prompt('Enter new project name:');
      if (projectName && projectName.trim()) {
        // Add new project to list
        const projectsList = document.querySelector('.workspace-projects ul');
        const newProject = document.createElement('li');
        newProject.innerHTML = `<a href="#">${projectName}</a>`;
        projectsList.appendChild(newProject);
        
        // Set up click handler for new project
        const link = newProject.querySelector('a');
        link.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Update active project
          projectLinks.forEach(project => project.classList.remove('active'));
          link.classList.add('active');
          
          // Update workspace header
          document.querySelector('.workspace-header h1').textContent = `Workspace: ${projectName}`;
          
          // Load project in VS Code and GitHub
          if (window.vsCodeIntegration) {
            window.vsCodeIntegration.openRepository(projectName);
          }
        });
        
        // Trigger click on new project
        link.click();
        
        showNotification(`Project "${projectName}" created successfully!`, 'success');
      }
    });
    
    // Handle invite button
    document.querySelector('.invite-btn').addEventListener('click', () => {
      showNotification('Invitation sent to team members!', 'success');
    });
  }
  
  function initIntegrations() {
    // Initialize VS Code in both containers
    if (window.vsCodeIntegration) {
      window.vsCodeIntegration.init('vscode-container');
      // Clone for full view
      setTimeout(() => {
        document.getElementById('vscode-container-full').innerHTML = 
          document.getElementById('vscode-container').innerHTML;
      }, 500);
    }
    
    // Initialize GitHub in both containers
    if (window.githubIntegration) {
      window.githubIntegration.init('github-container');
      // Clone for full view
      setTimeout(() => {
        document.getElementById('github-container-full').innerHTML = 
          document.getElementById('github-container').innerHTML;
      }, 500);
    }
    
    // Initialize Discord in both containers
    if (window.discordIntegration) {
      window.discordIntegration.init('discord-container');
      // Clone for full view
      setTimeout(() => {
        document.getElementById('discord-container-full').innerHTML = 
          document.getElementById('discord-container').innerHTML;
      }, 500);
    }
  }
  
  function setupComponentCommunication() {
    // When a GitHub event happens, relay it to Discord
    window.addEventListener('github-event', function(e) {
      if (window.discordIntegration) {
        window.discordIntegration.handleGitHubEvent(e.detail);
      }
    });
    
    // When a VS Code event happens, relay it to Discord
    window.addEventListener('vscode-event', function(e) {
      if (window.discordIntegration) {
        window.discordIntegration.handleVSCodeEvent(e.detail);
      }
    });
    
    // Listen for project changes
    window.addEventListener('project-change', function(e) {
      const projectName = e.detail.name;
      
      // Update VS Code with the new project
      if (window.vsCodeIntegration) {
        window.vsCodeIntegration.openRepository(projectName);
      }
      
      // Update GitHub to show the project repos
      if (window.githubIntegration && window.githubIntegration.filterByRepo) {
        window.githubIntegration.filterByRepo(projectName);
      }
      
      // Send a message to Discord about project change
      if (window.discordIntegration) {
        window.discordIntegration.relayMessage(`Switched to project: ${projectName}`, 'general');
      }
    });
    
    // For demo purposes, simulate some events after a delay
    setTimeout(() => {
      // Simulate a GitHub commit event
      const githubEvent = new CustomEvent('github-event', {
        detail: {
          type: 'commit',
          repo: 'collabd-project',
          message: 'Added new workspace integration feature'
        }
      });
      window.dispatchEvent(githubEvent);
      
      // Simulate a VS Code file edit event after another delay
      setTimeout(() => {
        const vscodeEvent = new CustomEvent('vscode-event', {
          detail: {
            type: 'file_edit',
            file: 'workspace.js',
            project: 'collabd-project'
          }
        });
        window.dispatchEvent(vscodeEvent);
      }, 5000);
    }, 3000);
  }
  
  // Utility function to show notifications
  function showNotification(message, type = 'info') {
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
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add close handler
    notification.querySelector('.close-notification').addEventListener('click', () => {
      notification.classList.add('closing');
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.classList.add('closing');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
    
    // Add animation class after a tiny delay (for animation to work)
    setTimeout(() => {
      notification.classList.add('show');
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
  
  // Add this to your existing CSS file
  const notificationStyles = `
  .workspace-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: white;
    border-left: 4px solid #4CAF50;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 350px;
    transform: translateX(400px);
    opacity: 0;
    transition: transform 0.3s, opacity 0.3s;
    z-index: 1000;
  }
  
  .workspace-notification.show {
    transform: translateX(0);
    opacity: 1;
  }
  
  .workspace-notification.closing {
    transform: translateX(400px);
    opacity: 0;
  }
  
  .workspace-notification.info {
    border-left-color: #2196F3;
  }
  
  .workspace-notification.success {
    border-left-color: #4CAF50;
  }
  
  .workspace-notification.warning {
    border-left-color: #ff9800;
  }
  
  .workspace-notification.error {
    border-left-color: #f44336;
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    padding: 12px 15px;
  }
  
  .notification-content i {
    margin-right: 10px;
    font-size: 18px;
  }
  
  .workspace-notification.info i {
    color: #2196F3;
  }
  
  .workspace-notification.success i {
    color: #4CAF50;
  }
  
  .workspace-notification.warning i {
    color: #ff9800;
  }
  
  .workspace-notification.error i {
    color: #f44336;
  }
  
  .close-notification {
    background: none;
    border: none;
    font-size: 22px;
    cursor: pointer;
    color: #888;
    padding: 10px 15px;
    transition: color 0.2s;
  }
  
  .close-notification:hover {
    color: #333;
  }
  `;
  
  // Add notification styles to the page
  const styleEl = document.createElement('style');
  styleEl.textContent = notificationStyles;
  document.head.appendChild(styleEl);