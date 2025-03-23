// github-integration.js
class GitHubIntegration {
    constructor() {
      this.authToken = localStorage.getItem('githubToken');
      this.container = null;
    }
  
    init(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
      
      this.renderInitialUI();
      this.checkAuthStatus();
    }
  
    renderInitialUI() {
      this.container.innerHTML = `
        <div class="github-section">
          <div class="section-header">
            <h2><i class="fab fa-github"></i> GitHub Integration</h2>
          </div>
          <div id="github-content" class="section-content">
            <div class="loading">Loading GitHub integration...</div>
          </div>
        </div>
      `;
    }
  
    checkAuthStatus() {
      const contentContainer = document.getElementById('github-content');
      
      if (!this.authToken) {
        contentContainer.innerHTML = `
          <div class="auth-required">
            <p>Connect your GitHub account to access repositories and pull requests.</p>
            <button id="github-connect" class="btn">Connect GitHub</button>
          </div>
        `;
        
        document.getElementById('github-connect').addEventListener('click', () => this.connectGitHub());
      } else {
        this.loadRepositories();
      }
    }
  
    connectGitHub() {
      // In a real implementation, use GitHub OAuth flow
      // For demo purposes, simulate authentication
      const authWindow = window.open('about:blank', 'GitHub Auth', 'width=600,height=700');
      authWindow.document.write(`
        <h1>GitHub Authentication</h1>
        <p>This is a simulated auth flow for the demo.</p>
        <button id="authorize">Authorize Collabd</button>
        <script>
          document.getElementById('authorize').addEventListener('click', function() {
            window.opener.postMessage({ type: 'github-auth-success', token: 'demo-token-' + Date.now() }, '*');
            window.close();
          });
        </script>
      `);
      
      window.addEventListener('message', (event) => {
        if (event.data.type === 'github-auth-success') {
          this.authToken = event.data.token;
          localStorage.setItem('githubToken', this.authToken);
          this.loadRepositories();
        }
      });
    }
  
    async loadRepositories() {
      const contentContainer = document.getElementById('github-content');
      
      // In a real implementation, fetch from GitHub API
      // For demo, simulate repository data
      const repos = [
        { name: 'collabd-frontend', description: 'Frontend for Collabd platform', stars: 12, forks: 3, url: '#', language: 'JavaScript' },
        { name: 'collabd-backend', description: 'Backend API for Collabd', stars: 8, forks: 2, url: '#', language: 'Node.js' },
        { name: 'react-component-library', description: 'Reusable React components', stars: 45, forks: 12, url: '#', language: 'TypeScript' }
      ];
      
      contentContainer.innerHTML = `
        <div class="github-repos">
          <div class="action-bar">
            <button id="new-repo" class="btn btn-sm"><i class="fas fa-plus"></i> New Repository</button>
            <button id="refresh-repos" class="btn btn-sm btn-outline"><i class="fas fa-sync"></i> Refresh</button>
          </div>
          <div class="repo-list">
            ${repos.map(repo => `
              <div class="repo-card">
                <h3><a href="${repo.url}">${repo.name}</a></h3>
                <p>${repo.description}</p>
                <div class="repo-stats">
                  <span class="language"><span class="language-color" style="background-color: ${this.getLanguageColor(repo.language)}"></span>${repo.language}</span>
                  <span class="stars"><i class="fas fa-star"></i> ${repo.stars}</span>
                  <span class="forks"><i class="fas fa-code-branch"></i> ${repo.forks}</span>
                </div>
                <div class="repo-actions">
                  <button class="btn btn-sm btn-outline open-in-vscode" data-repo="${repo.name}">Open in VS Code</button>
                  <button class="btn btn-sm pull-requests" data-repo="${repo.name}">Pull Requests</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
      // Set up event listeners
      document.getElementById('new-repo').addEventListener('click', () => this.createRepository());
      document.getElementById('refresh-repos').addEventListener('click', () => this.loadRepositories());
      
      document.querySelectorAll('.open-in-vscode').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const repoName = e.target.getAttribute('data-repo');
          window.vsCodeIntegration?.openRepository(repoName);
        });
      });
      
      document.querySelectorAll('.pull-requests').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const repoName = e.target.getAttribute('data-repo');
          this.showPullRequests(repoName);
        });
      });
    }
  
    getLanguageColor(language) {
      const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#2b7489',
        'Python': '#3572A5',
        'Java': '#b07219',
        'C#': '#178600',
        'PHP': '#4F5D95',
        'Node.js': '#68A063'
      };
      return colors[language] || '#cccccc';
    }
  
    createRepository() {
      // Show repository creation modal
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>Create New Repository</h2>
            <span class="close">&times;</span>
          </div>
          <div class="modal-body">
            <form id="new-repo-form">
              <div class="form-group">
                <label for="repo-name">Repository Name</label>
                <input type="text" id="repo-name" class="form-control" required>
              </div>
              <div class="form-group">
                <label for="repo-description">Description</label>
                <textarea id="repo-description" class="form-control" rows="3"></textarea>
              </div>
              <div class="form-group">
                <label>Visibility</label>
                <div class="radio-group">
                  <label><input type="radio" name="visibility" value="public" checked> Public</label>
                  <label><input type="radio" name="visibility" value="private"> Private</label>
                </div>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-outline" id="cancel-repo">Cancel</button>
                <button type="submit" class="btn">Create Repository</button>
              </div>
            </form>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Set up event listeners
      modal.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(modal);
      });
      
      document.getElementById('cancel-repo').addEventListener('click', () => {
        document.body.removeChild(modal);
      });
      
      document.getElementById('new-repo-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('repo-name').value;
        const description = document.getElementById('repo-description').value;
        const visibility = document.querySelector('input[name="visibility"]:checked').value;
        
        // In a real implementation, create repo via GitHub API
        alert(`Repository ${name} created successfully!`);
        document.body.removeChild(modal);
        this.loadRepositories(); // Refresh repositories
      });
    }
  
    showPullRequests(repoName) {
      const contentContainer = document.getElementById('github-content');
      
      // In a real implementation, fetch from GitHub API
      // For demo, simulate PR data
      const pullRequests = [
        { id: 1, title: 'Add login functionality', user: 'sarah-dev', status: 'open', created: '2 days ago' },
        { id: 2, title: 'Fix navigation bug', user: 'alex-coder', status: 'open', created: '5 hours ago' },
        { id: 3, title: 'Update documentation', user: 'doc-master', status: 'merged', created: '1 week ago' }
      ];
      
      contentContainer.innerHTML = `
        <div class="pull-requests-view">
          <div class="action-bar">
            <button id="back-to-repos" class="btn btn-sm btn-outline"><i class="fas fa-arrow-left"></i> Back to Repositories</button>
            <h3>${repoName}: Pull Requests</h3>
          </div>
          <div class="pr-list">
            ${pullRequests.length ? pullRequests.map(pr => `
              <div class="pr-card ${pr.status}">
                <div class="pr-title">
                  <span class="pr-icon">
                    <i class="fas ${pr.status === 'merged' ? 'fa-code-merge' : 'fa-code-pull-request'}"></i>
                  </span>
                  <h4>${pr.title}</h4>
                </div>
                <div class="pr-info">
                  <span class="pr-id">#${pr.id}</span>
                  <span class="pr-user">${pr.user}</span>
                  <span class="pr-time">${pr.created}</span>
                  <span class="pr-status ${pr.status}">${pr.status}</span>
                </div>
                <div class="pr-actions">
                  <button class="btn btn-sm btn-outline view-pr" data-pr="${pr.id}">View</button>
                  <button class="btn btn-sm ${pr.status === 'open' ? '' : 'disabled'}" ${pr.status === 'open' ? '' : 'disabled'}>
                    ${pr.status === 'open' ? 'Merge' : 'Merged'}
                  </button>
                </div>
              </div>
            `).join('') : '<div class="empty-state">No pull requests found for this repository.</div>'}
          </div>
        </div>
      `;
      
      document.getElementById('back-to-repos').addEventListener('click', () => {
        this.loadRepositories();
      });
    }
  }
  
  // Initialize GitHub integration
  document.addEventListener('DOMContentLoaded', function() {
    window.githubIntegration = new GitHubIntegration();
    window.githubIntegration.init('github-container');
  });



  // github-integration.js - Integrates GitHub username with workspace

document.addEventListener('DOMContentLoaded', function() {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('collabdUserData') || '{}');
    
    // If we're on the settings page
    if (document.getElementById('github')) {
      // Set the GitHub username field value if it exists in userData
      if (userData.github) {
        document.getElementById('github').value = userData.github;
      }
      
      // Update the userData when settings form is submitted
      const settingsForm = document.querySelector('form') || document.getElementById('settings-form');
      if (settingsForm) {
        settingsForm.addEventListener('submit', function(event) {
          // Get the current GitHub username
          const githubUsername = document.getElementById('github').value;
          
          // Update userData with GitHub username
          userData.github = githubUsername;
          
          // Save the updated userData to localStorage
          localStorage.setItem('collabdUserData', JSON.stringify(userData));
          
          console.log('Saved GitHub username:', githubUsername);
        });
      }
    }
    
    // If we're on the workspace page
    if (document.querySelector('.workspace-container')) {
      // Find all GitHub-related elements in the workspace
      // This will depend on your HTML structure - adjust the selectors as needed
      const githubElements = document.querySelectorAll('.github-item, [data-service="github"], .workspace-nav-item[data-view="github"]');
      
      githubElements.forEach(function(element) {
        // Add click event listener to GitHub elements
        element.addEventListener('click', function(event) {
          // If the click is on a link or button that should have different behavior, ignore
          if (event.target.tagName === 'BUTTON' || 
              (event.target.tagName === 'A' && event.target.href && !event.target.href.includes('#'))) {
            return;
          }
          
          // Check if the user has a GitHub username
          if (userData.github) {
            // Prevent default action
            event.preventDefault();
            
            // Open the GitHub profile in a new tab
            window.open('https://github.com/' + userData.github, '_blank');
            
            console.log('Redirecting to GitHub profile:', userData.github);
          } else {
            // Alert the user if no GitHub username is set
            alert('No GitHub username set. Please add your GitHub username in settings.');
            
            // Optionally redirect to settings page
            // window.location.href = 'settings.html';
          }
        });
      });
      
      // For GitHub repositories in the workspace
      const repoElements = document.querySelectorAll('.repository-item, [data-repo]');
      
      repoElements.forEach(function(element) {
        element.addEventListener('click', function(event) {
          // Skip if the click is on a specific action button
          if (event.target.tagName === 'BUTTON' || 
              (event.target.tagName === 'A' && event.target.href && !event.target.href.includes('#'))) {
            return;
          }
          
          // Get the repository name
          const repoName = element.getAttribute('data-repo') || element.textContent.trim();
          
          // Check if the user has a GitHub username
          if (userData.github && repoName) {
            // Prevent default action
            event.preventDefault();
            
            // Open the GitHub repository in a new tab
            window.open('https://github.com/' + userData.github + '/' + repoName, '_blank');
            
            console.log('Redirecting to GitHub repository:', userData.github + '/' + repoName);
          }
        });
      });
    }
  });