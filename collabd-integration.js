// collabd-integration.js
// This file handles the integration between user data, workspace, and services

// User data management
const CollabdUser = {
    // Get current user data
    getCurrentUser: function() {
      const userData = localStorage.getItem('collabdUserData');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    },
    
    // Save user data
    saveUserData: function(userData) {
      localStorage.setItem('collabdUserData', JSON.stringify(userData));
    },
    
    // Update specific user properties
    updateUser: function(properties) {
      const currentUser = this.getCurrentUser() || {};
      const updatedUser = { ...currentUser, ...properties };
      this.saveUserData(updatedUser);
      
      // Dispatch event to notify components of user data change
      window.dispatchEvent(new CustomEvent('user-data-updated', { 
        detail: updatedUser 
      }));
      
      return updatedUser;
    },
    
    // Check if user is logged in
    isLoggedIn: function() {
      return !!this.getCurrentUser();
    }
  };
  
  // Service integration management
  const ServiceIntegration = {
    // Connect a service
    connectService: function(service, username) {
      // Get current connection statuses
      const connections = JSON.parse(localStorage.getItem('serviceConnections') || '{}');
      
      // Update connection status
      connections[service.toLowerCase()] = {
        connected: true,
        username: username,
        connectedAt: new Date().toISOString()
      };
      
      // Save updated connections
      localStorage.setItem('serviceConnections', JSON.stringify(connections));
      
      // Update user data with service username
      if (service.toLowerCase() === 'github' || service.toLowerCase() === 'discord') {
        const userData = CollabdUser.getCurrentUser() || {};
        userData[service.toLowerCase()] = username;
        CollabdUser.saveUserData(userData);
      }
      
      // Dispatch event to notify components
      window.dispatchEvent(new CustomEvent('service-connected', {
        detail: { service, username }
      }));
      
      return connections[service.toLowerCase()];
    },
    
    // Disconnect a service
    disconnectService: function(service) {
      // Get current connection statuses
      const connections = JSON.parse(localStorage.getItem('serviceConnections') || '{}');
      
      // Update connection status
      if (connections[service.toLowerCase()]) {
        connections[service.toLowerCase()].connected = false;
        connections[service.toLowerCase()].disconnectedAt = new Date().toISOString();
      }
      
      // Save updated connections
      localStorage.setItem('serviceConnections', JSON.stringify(connections));
      
      // Dispatch event to notify components
      window.dispatchEvent(new CustomEvent('service-disconnected', {
        detail: { service }
      }));
      
      return connections;
    },
    
    // Check if a service is connected
    isServiceConnected: function(service) {
      const connections = JSON.parse(localStorage.getItem('serviceConnections') || '{}');
      return connections[service.toLowerCase()]?.connected === true;
    },
    
    // Get all service connections
    getAllConnections: function() {
      return JSON.parse(localStorage.getItem('serviceConnections') || '{}');
    },
    
    // Get connection details for a specific service
    getServiceConnection: function(service) {
      const connections = this.getAllConnections();
      return connections[service.toLowerCase()] || { connected: false };
    }
  };
  
  // Project management
  const ProjectManager = {
    // Get all projects
    getProjects: function() {
      return JSON.parse(localStorage.getItem('collabdProjects') || '[]');
    },
    
    // Get a specific project
    getProject: function(projectName) {
      const projects = this.getProjects();
      return projects.find(p => p.name === projectName);
    },
    
    // Create a new project
    createProject: function(projectData) {
      const projects = this.getProjects();
      
      // Check if project with this name already exists
      if (projects.some(p => p.name === projectData.name)) {
        throw new Error(`Project '${projectData.name}' already exists`);
      }
      
      // Add creation date and owner
      const user = CollabdUser.getCurrentUser();
      const newProject = {
        ...projectData,
        createdAt: new Date().toISOString(),
        owner: user?.username || 'anonymous',
        members: [user?.username || 'anonymous']
      };
      
      // Add to projects list
      projects.push(newProject);
      localStorage.setItem('collabdProjects', JSON.stringify(projects));
      
      // Dispatch event to notify components
      window.dispatchEvent(new CustomEvent('project-created', {
        detail: newProject
      }));
      
      return newProject;
    },
    
    // Update project details
    updateProject: function(projectName, updateData) {
      const projects = this.getProjects();
      const projectIndex = projects.findIndex(p => p.name === projectName);
      
      if (projectIndex === -1) {
        throw new Error(`Project '${projectName}' not found`);
      }
      
      // Update project
      projects[projectIndex] = {
        ...projects[projectIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('collabdProjects', JSON.stringify(projects));
      
      // Dispatch event to notify components
      window.dispatchEvent(new CustomEvent('project-updated', {
        detail: projects[projectIndex]
      }));
      
      return projects[projectIndex];
    },
    
    // Delete a project
    deleteProject: function(projectName) {
      const projects = this.getProjects();
      const updatedProjects = projects.filter(p => p.name !== projectName);
      
      if (updatedProjects.length === projects.length) {
        throw new Error(`Project '${projectName}' not found`);
      }
      
      localStorage.setItem('collabdProjects', JSON.stringify(updatedProjects));
      
      // Dispatch event to notify components
      window.dispatchEvent(new CustomEvent('project-deleted', {
        detail: { projectName }
      }));
      
      return true;
    }
  };
  
  // Utility functions for workspace integration
  const WorkspaceIntegration = {
    // Initialize the workspace with user data
    initWorkspace: function() {
      const user = CollabdUser.getCurrentUser();
      
      if (user) {
        // Update user profile in workspace
        this.updateUserProfile(user);
        
        // Initialize integrations based on connection status
        this.initIntegrations();
        
        // Load user projects
        this.loadUserProjects();
      }
    },
    
    // Update user profile display in workspace
    updateUserProfile: function(userData) {
      // Update user display in workspace header
      const userProfileElem = document.querySelector('.user-profile');
      if (userProfileElem) {
        const profilePicElem = userProfileElem.querySelector('.profile-pic');
        const usernameElem = userProfileElem.querySelector('span');
        
        if (usernameElem) {
          usernameElem.textContent = userData.username || 'User';
        }
        
        // Set placeholder profile picture if no custom one
        if (profilePicElem && !userData.profilePicture) {
          // Generate consistent profile picture based on username
          const hash = userData.username ? userData.username.charCodeAt(0) % 70 : 5;
          profilePicElem.src = `https://i.pravatar.cc/150?img=${hash}`;
        }
      }
    },
    
    // Initialize integrations based on connection status
    initIntegrations: function() {
      const connections = ServiceIntegration.getAllConnections();
      
      // VS Code integration
      if (connections.vscode?.connected && window.vsCodeIntegration) {
        if (!window.vsCodeIntegration.connected) {
          // Force connected state
          window.vsCodeIntegration.connected = true;
          localStorage.setItem('vsCodeConnected', 'true');
          
          // If on workspace page, initialize VS Code
          if (document.getElementById('vscode-container')) {
            window.vsCodeIntegration.init('vscode-container');
            
            // Clone for full view if needed
            setTimeout(() => {
              if (document.getElementById('vscode-container-full')) {
                document.getElementById('vscode-container-full').innerHTML = 
                  document.getElementById('vscode-container').innerHTML;
              }
            }, 500);
          }
        }
      }
      
      // GitHub integration
      if (connections.github?.connected && window.githubIntegration) {
        if (!window.githubIntegration.connected) {
          // Force connected state
          window.githubIntegration.connected = true;
          localStorage.setItem('githubConnected', 'true');
          
          // Set GitHub username
          window.githubIntegration.userName = connections.github.username;
          localStorage.setItem('githubUsername', connections.github.username);
          
          // If on workspace page, initialize GitHub
          if (document.getElementById('github-container')) {
            window.githubIntegration.init('github-container');
            
            // Clone for full view if needed
            setTimeout(() => {
              if (document.getElementById('github-container-full')) {
                document.getElementById('github-container-full').innerHTML = 
                  document.getElementById('github-container').innerHTML;
              }
            }, 500);
          }
        }
      }
      
      // Discord integration
      if (connections.discord?.connected && window.discordIntegration) {
        if (!window.discordIntegration.connected) {
          // Force connected state
          window.discordIntegration.connected = true;
          localStorage.setItem('discordConnected', 'true');
          
          // If on workspace page, initialize Discord
          if (document.getElementById('discord-container')) {
            window.discordIntegration.init('discord-container');
            
            // Clone for full view if needed
            setTimeout(() => {
              if (document.getElementById('discord-container-full')) {
                document.getElementById('discord-container-full').innerHTML = 
                  document.getElementById('discord-container').innerHTML;
              }
            }, 500);
          }
        }
      }
    },
    
    // Load user projects in the workspace
    loadUserProjects: function() {
      const projectsList = document.querySelector('.workspace-projects ul');
      if (!projectsList) return;
      
      // Clear existing projects
      projectsList.innerHTML = '';
      
      // Get user projects
      const projects = ProjectManager.getProjects();
      
      if (projects.length === 0) {
        // Add sample project if no projects exist
        try {
          ProjectManager.createProject({
            name: 'collabd-project',
            description: 'Team collaboration platform integrating VS Code, GitHub and Discord',
            language: 'JavaScript'
          });
        } catch (err) {
          // Project might already exist, ignore error
        }
      }
      
      // Refresh projects list
      const updatedProjects = ProjectManager.getProjects();
      
      // Add projects to sidebar
      updatedProjects.forEach(project => {
        const projectItem = document.createElement('li');
        projectItem.innerHTML = `<a href="#" data-project="${project.name}">${project.name}</a>`;
        projectsList.appendChild(projectItem);
        
        // Set up click handler for project
        const link = projectItem.querySelector('a');
        link.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Update active project
          document.querySelectorAll('.workspace-projects ul li a').forEach(p => {
            p.classList.remove('active');
          });
          link.classList.add('active');
          
          // Update workspace header
          const headerTitle = document.querySelector('.workspace-header h1');
          if (headerTitle) {
            headerTitle.textContent = `Workspace: ${project.name}`;
          }
          
          // Dispatch project change event
          const projectEvent = new CustomEvent('project-change', {
            detail: { name: project.name }
          });
          window.dispatchEvent(projectEvent);
        });
      });
      
      // Activate first project
      if (updatedProjects.length > 0 && projectsList.querySelector('a')) {
        projectsList.querySelector('a').classList.add('active');
      }
    },
    
    // Create new project in workspace
    createNewProject: function(projectName, description = '', language = 'JavaScript') {
      try {
        // Create project
        const newProject = ProjectManager.createProject({
          name: projectName,
          description: description,
          language: language
        });
        
        // Update projects list in UI
        this.loadUserProjects();
        
        // Activate the new project
        const projectLink = document.querySelector(`.workspace-projects ul li a[data-project="${projectName}"]`);
        if (projectLink) {
          projectLink.click();
        }
        
        return newProject;
      } catch (err) {
        console.error('Failed to create project:', err);
        return null;
      }
    }
  };
  
  // Initialize integration on page load
  document.addEventListener('DOMContentLoaded', function() {
    // Check if on workspace page
    if (document.querySelector('.workspace-container')) {
      WorkspaceIntegration.initWorkspace();
      
      // Set up new project button
      const newProjectBtn = document.querySelector('.new-project-btn');
      if (newProjectBtn) {
        newProjectBtn.addEventListener('click', () => {
          const projectName = prompt('Enter new project name:');
          if (projectName && projectName.trim()) {
            const description = prompt('Enter project description (optional):');
            const language = prompt('Enter main programming language (default: JavaScript):') || 'JavaScript';
            
            WorkspaceIntegration.createNewProject(projectName, description, language);
          }
        });
      }
    }
    
    // Update settings disconnect buttons to use ServiceIntegration
    const updateSettingsPage = function() {
      // Set up disconnect buttons on settings page
      const vscodeBtn = document.querySelector('.btn-outline[onclick*="VSCode"]');
      if (vscodeBtn) {
        vscodeBtn.onclick = function() {
          ServiceIntegration.disconnectService('vscode');
          alert('Visual Studio Code has been disconnected from your account.');
          return false;
        };
      }
      
      const githubBtn = document.querySelector('.btn-outline[onclick*="GitHub"]');
      if (githubBtn) {
        githubBtn.onclick = function() {
          ServiceIntegration.disconnectService('github');
          alert('GitHub has been disconnected from your account.');
          return false;
        };
      }
      
      const discordBtn = document.querySelector('.btn-outline[onclick*="Discord"]');
      if (discordBtn) {
        discordBtn.onclick = function() {
          ServiceIntegration.disconnectService('discord');
          alert('Discord has been disconnected from your account.');
          return false;
        };
      }
      
      // Update connection status indicators if they exist
      const connections = ServiceIntegration.getAllConnections();
      
      ['vscode', 'github', 'discord'].forEach(service => {
        const statusElem = document.querySelector(`.${service}-status`);
        if (statusElem) {
          statusElem.classList.toggle('connected', connections[service]?.connected === true);
          statusElem.textContent = connections[service]?.connected ? 'Connected' : 'Not Connected';
        }
      });
    };
    
    // If on settings page, update disconnect buttons
    if (document.querySelector('form') && document.getElementById('fullname')) {
      updateSettingsPage();
    }
    
    // Handle signup form submissions to update user data
    const signupForm = document.querySelector('form.signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const fullName = document.getElementById('fullname')?.value;
        const username = document.getElementById('username')?.value;
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value; // In a real app, don't store password in localStorage
        
        if (username && email) {
          // Create user data
          const userData = {
            fullName: fullName,
            username: username,
            email: email,
            bio: '',
            location: '',
            github: '',
            discord: '',
            profileVisible: true,
            showEmail: true,
            showOnlineStatus: false,
            signupDate: new Date().toISOString()
          };
          
          // Save user data
          CollabdUser.saveUserData(userData);
          
          // Redirect to workspace or dashboard
          alert('Account created successfully! Redirecting to workspace...');
          window.location.href = 'workspace.html';
        } else {
          alert('Please fill in all required fields.');
        }
      });
    }
    
    // Override settings form save to update connection statuses
    const settingsForm = document.querySelector('form');
    if (settingsForm && document.getElementById('fullname')) {
      const originalSubmitHandler = settingsForm.onsubmit;
      
      settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const fullName = document.getElementById('fullname').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const bio = document.getElementById('bio').value;
        const location = document.getElementById('location').value;
        const github = document.getElementById('github').value;
        const discord = document.getElementById('discord').value;
        
        // Get toggle states
        const toggles = document.querySelectorAll('.switch input[type="checkbox"]');
        const profileVisible = toggles.length > 0 ? toggles[0].checked : true;
        const showEmail = toggles.length > 1 ? toggles[1].checked : true;
        const showOnlineStatus = toggles.length > 2 ? toggles[2].checked : false;
        
        // Create updated user data object
        const userData = {
          fullName: fullName,
          username: username,
          email: email,
          bio: bio,
          location: location,
          github: github,
          discord: discord,
          profileVisible: profileVisible,
          showEmail: showEmail,
          showOnlineStatus: showOnlineStatus
        };
        
        // Save updated user data to localStorage
        CollabdUser.saveUserData(userData);
        
        // Update service connections based on GitHub/Discord usernames
        if (github) {
          ServiceIntegration.connectService('github', github);
        }
        
        if (discord) {
          ServiceIntegration.connectService('discord', discord);
        }
        
        // Show success message
        alert('Your settings have been saved successfully!');
      });
    }
  });
  
  // Implement connect service handlers for workspace
  function connectVSCode() {
    ServiceIntegration.connectService('vscode', 'vscode-user');
    
    if (window.vsCodeIntegration) {
      window.vsCodeIntegration.connected = true;
      localStorage.setItem('vsCodeConnected', 'true');
      window.vsCodeIntegration.showEditor();
    }
    
    return true;
  }
  
  function connectGitHub() {
    const user = CollabdUser.getCurrentUser();
    let githubUsername = user?.github || '';
    
    if (!githubUsername) {
      githubUsername = prompt('Enter your GitHub username:');
      if (!githubUsername) return false;
      
      // Update user data with GitHub username
      CollabdUser.updateUser({ github: githubUsername });
    }
    
    ServiceIntegration.connectService('github', githubUsername);
    
    if (window.githubIntegration) {
      window.githubIntegration.connected = true;
      window.githubIntegration.userName = githubUsername;
      localStorage.setItem('githubConnected', 'true');
      localStorage.setItem('githubUsername', githubUsername);
      window.githubIntegration.showGitHubDashboard();
    }
    
    return true;
  }
  
  function connectDiscord() {
    const user = CollabdUser.getCurrentUser();
    let discordUsername = user?.discord || '';
    
    if (!discordUsername) {
      discordUsername = prompt('Enter your Discord username:');
      if (!discordUsername) return false;
      
      // Update user data with Discord username
      CollabdUser.updateUser({ discord: discordUsername });
    }
    
    ServiceIntegration.connectService('discord', discordUsername);
    
    if (window.discordIntegration) {
      window.discordIntegration.connected = true;
      localStorage.setItem('discordConnected', 'true');
      window.discordIntegration.showDiscordInterface();
    }
    
    return true;
  }