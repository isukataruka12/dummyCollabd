document.addEventListener('DOMContentLoaded', function() {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('collabdUserData') || '{}');
    
    // If we're on the settings page
    if (document.getElementById('discord')) {
      // Set the Discord username field value if it exists in userData
      if (userData.discord) {
        document.getElementById('discord').value = userData.discord;
      }
      
      // Update the userData when settings form is submitted
      const settingsForm = document.querySelector('form') || document.getElementById('settings-form');
      if (settingsForm) {
        settingsForm.addEventListener('submit', function(event) {
          // Get the current Discord username
          const discordUsername = document.getElementById('discord').value;
          
          // Update userData with Discord username
          userData.discord = discordUsername;
          
          // Save the updated userData to localStorage
          localStorage.setItem('collabdUserData', JSON.stringify(userData));
          
          console.log('Saved Discord username:', discordUsername);
        });
      }
    }
    
    // If we're on the workspace page
    if (document.querySelector('.workspace-container')) {
      // Find all Discord-related elements in the workspace
      // This will depend on your HTML structure - adjust the selectors as needed
      const discordElements = document.querySelectorAll('.discord-item, [data-service="discord"], .workspace-nav-item[data-view="discord"]');
      
      discordElements.forEach(function(element) {
        // Add click event listener to Discord elements
        element.addEventListener('click', function(event) {
          // If the click is on a link or button that should have different behavior, ignore
          if (event.target.tagName === 'BUTTON' || 
              (event.target.tagName === 'A' && event.target.href && !event.target.href.includes('#'))) {
            return;
          }
          
          // Discord URL pattern handling
          if (userData.discord) {
            // Get Discord username and discriminator (tag)
            let discordUser = userData.discord;
            let discordURL = 'https://discord.com/users/';
            
            // Check if the username contains a discriminator (#1234)
            if (discordUser.includes('#')) {
              // Extract username and discriminator
              const [username, discriminator] = discordUser.split('#');
              // Modern Discord URLs don't directly support discriminators, but we'll handle it as best we can
              discordURL += discordUser.replace('#', '/');
            } else {
              // Just use the username
              discordURL += discordUser;
            }
            
            // Prevent default action for navigation elements only
            if (element.classList.contains('workspace-nav-item')) {
              event.preventDefault();
              
              // Open the Discord profile in a new tab
              window.open(discordURL, '_blank');
              
              console.log('Redirecting to Discord profile:', discordURL);
            }
          }
        });
      });
      
      // Find all VS Code-related elements in the workspace
      const vsCodeElements = document.querySelectorAll('.vscode-item, [data-service="vscode"], .workspace-nav-item[data-view="vscode"]');
      
      vsCodeElements.forEach(function(element) {
        // Add click event listener to VS Code elements
        element.addEventListener('click', function(event) {
          // If the click is on a link or button that should have different behavior, ignore
          if (event.target.tagName === 'BUTTON' || 
              (event.target.tagName === 'A' && event.target.href && !event.target.href.includes('#'))) {
            return;
          }
          
          // For VS Code, we can open Visual Studio Code's website or VS Code extension marketplace
          // Prevent default action for navigation elements only
          if (element.classList.contains('workspace-nav-item')) {
            event.preventDefault();
            
            // Open VS Code website or marketplace
            window.open('https://vscode.dev/', '_blank');
            
            console.log('Redirecting to VS Code online editor');
          }
        });
      });
      
      // Set up quick links to external platforms in the workspace
      setupExternalLinks();
    }
  });
  
  // Function to set up external links in the workspace
  function setupExternalLinks() {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('collabdUserData') || '{}');
    
    // Add a floating quick links panel if it doesn't exist
    if (!document.getElementById('external-links-panel')) {
      const panel = document.createElement('div');
      panel.id = 'external-links-panel';
      panel.className = 'external-links-panel';
      
      // Set up HTML for the panel
      panel.innerHTML = `
        <div class="panel-header">
          <h3>Quick Links</h3>
          <button class="toggle-panel"><i class="fas fa-chevron-down"></i></button>
        </div>
        <div class="panel-content">
          <ul class="external-links">
            <li class="github-link" style="display: ${userData.github ? 'flex' : 'none'}">
              <i class="fab fa-github"></i>
              <a href="https://github.com/${userData.github}" target="_blank">GitHub Profile</a>
            </li>
            <li class="discord-link" style="display: ${userData.discord ? 'flex' : 'none'}">
              <i class="fab fa-discord"></i>
              <a href="https://discord.com/users/${userData.discord.replace('#', '/')}" target="_blank">Discord Profile</a>
            </li>
            <li class="vscode-link">
              <i class="fas fa-code"></i>
              <a href="https://vscode.dev/" target="_blank">VS Code Online</a>
            </li>
          </ul>
        </div>
      `;
      
      // Add panel styles
      const style = document.createElement('style');
      style.textContent = `
        .external-links-panel {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 250px;
          z-index: 100;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .panel-header {
          background-color: #7289da;
          color: white;
          padding: 10px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }
        
        .panel-header h3 {
          margin: 0;
          font-size: 16px;
        }
        
        .toggle-panel {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        
        .panel-content {
          padding: 15px;
          max-height: 200px;
          overflow-y: auto;
          transition: max-height 0.3s ease;
        }
        
        .panel-collapsed .panel-content {
          max-height: 0;
          padding: 0 15px;
        }
        
        .panel-collapsed .toggle-panel i {
          transform: rotate(180deg);
        }
        
        .external-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .external-links li {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .external-links li:last-child {
          margin-bottom: 0;
        }
        
        .external-links i {
          margin-right: 10px;
          font-size: 18px;
          width: 18px;
          text-align: center;
        }
        
        .external-links a {
          color: #333;
          text-decoration: none;
          font-size: 14px;
        }
        
        .external-links a:hover {
          text-decoration: underline;
          color: #7289da;
        }
        
        .github-link i {
          color: #333;
        }
        
        .discord-link i {
          color: #7289da;
        }
        
        .vscode-link i {
          color: #007acc;
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(panel);
      
      // Add event listener for panel toggle
      const toggleBtn = panel.querySelector('.toggle-panel');
      const panelHeader = panel.querySelector('.panel-header');
      
      function togglePanel() {
        panel.classList.toggle('panel-collapsed');
        
        // Save panel state to localStorage
        localStorage.setItem('panelCollapsed', panel.classList.contains('panel-collapsed'));
      }
      
      toggleBtn.addEventListener('click', togglePanel);
      panelHeader.addEventListener('click', function(event) {
        if (event.target !== toggleBtn && event.target !== toggleBtn.querySelector('i')) {
          togglePanel();
        }
      });
      
      // Set initial panel state based on localStorage
      if (localStorage.getItem('panelCollapsed') === 'true') {
        panel.classList.add('panel-collapsed');
      }
    } else {
      // Update existing panel links
      const githubLink = document.querySelector('.github-link');
      const discordLink = document.querySelector('.discord-link');
      
      if (githubLink) {
        if (userData.github) {
          githubLink.style.display = 'flex';
          githubLink.querySelector('a').href = `https://github.com/${userData.github}`;
        } else {
          githubLink.style.display = 'none';
        }
      }
      
      if (discordLink) {
        if (userData.discord) {
          discordLink.style.display = 'flex';
          discordLink.querySelector('a').href = `https://discord.com/users/${userData.discord.replace('#', '/')}`;
        } else {
          discordLink.style.display = 'none';
        }
      }
    }
  }