// discord-integration.js
class DiscordIntegration {
  constructor() {
      this.authToken = localStorage.getItem('discordToken');
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
          <div class="discord-section">
              <div class="section-header">
                  <h2><i class="fab fa-discord"></i> Discord Integration</h2>
              </div>
              <div id="discord-content" class="section-content">
                  <div class="loading">Loading Discord integration...</div>
              </div>
          </div>
      `;
  }

  checkAuthStatus() {
      const contentContainer = document.getElementById('discord-content');
      
      if (!this.authToken) {
          contentContainer.innerHTML = `
              <div class="auth-required">
                  <p>Connect your Discord account to access team communication and notifications.</p>
                  <button id="discord-connect" class="btn">Connect Discord</button>
              </div>
          `;
          
          document.getElementById('discord-connect').addEventListener('click', () => this.connectDiscord());
      } else {
          this.loadDiscordChannels();
      }
  }

  connectDiscord() {
      // Simulate Discord OAuth flow
      const authWindow = window.open('about:blank', 'Discord Auth', 'width=600,height=700');
      authWindow.document.write(`
          <h1>Discord Authentication</h1>
          <p>This is a simulated auth flow for the demo.</p>
          <button id="authorize">Authorize Collabd</button>
          <script>
              document.getElementById('authorize').addEventListener('click', function() {
                  window.opener.postMessage({ 
                      type: 'discord-auth-success', 
                      token: 'demo-discord-token-' + Date.now(),
                      userInfo: {
                          username: 'CollaberUser',
                          discriminator: '1234',
                          avatar: 'https://example.com/avatar.png'
                      }
                  }, '*');
                  window.close();
              });
          </script>
      `);
      
      window.addEventListener('message', (event) => {
          if (event.data.type === 'discord-auth-success') {
              this.authToken = event.data.token;
              localStorage.setItem('discordToken', this.authToken);
              
              // Store user info
              const userData = JSON.parse(localStorage.getItem('collabdUserData') || '{}');
              userData.discordUser = event.data.userInfo;
              localStorage.setItem('collabdUserData', JSON.stringify(userData));
              
              this.loadDiscordChannels();
          }
      });
  }

  loadDiscordChannels() {
      const contentContainer = document.getElementById('discord-content');
      
      // Simulate Discord channels and servers
      const servers = [
          { 
              name: 'Collabd Dev Team', 
              channels: [
                  { name: 'general', type: 'text', unreadMessages: 3 },
                  { name: 'frontend-dev', type: 'text', unreadMessages: 1 },
                  { name: 'backend-dev', type: 'text', unreadMessages: 0 },
                  { name: 'voice-chat', type: 'voice', participants: 4 }
              ]
          },
          { 
              name: 'Open Source Community', 
              channels: [
                  { name: 'projects', type: 'text', unreadMessages: 5 },
                  { name: 'help-desk', type: 'text', unreadMessages: 2 }
              ]
          }
      ];
      
      const userData = JSON.parse(localStorage.getItem('collabdUserData') || '{}');
      const discordUser = userData.discordUser || {};
      
      contentContainer.innerHTML = `
          <div class="discord-workspace">
              <div class="user-profile">
                  <div class="avatar">
                      <img src="${discordUser.avatar || '/default-avatar.png'}" alt="Discord Avatar">
                  </div>
                  <div class="user-info">
                      <h3>${discordUser.username || 'Discord User'}#${discordUser.discriminator || '0000'}</h3>
                      <button id="discord-logout" class="btn btn-sm btn-outline">Disconnect</button>
                  </div>
              </div>
              
              <div class="servers-list">
                  <h4>Servers</h4>
                  ${servers.map(server => `
                      <div class="server-item">
                          <div class="server-name">${server.name}</div>
                          <div class="channels-list">
                              ${server.channels.map(channel => `
                                  <div class="channel-item ${channel.type}">
                                      <span class="channel-icon">
                                          ${channel.type === 'text' ? '#' : '🎙️'}
                                      </span>
                                      <span class="channel-name">${channel.name}</span>
                                      ${channel.type === 'text' && channel.unreadMessages > 0 ? 
                                          `<span class="unread-badge">${channel.unreadMessages}</span>` : 
                                          (channel.type === 'voice' ? 
                                          `<span class="voice-participants">${channel.participants} online</span>` : '')}
                                  </div>
                              `).join('')}
                          </div>
                      </div>
                  `).join('')}
              </div>
              
              <div class="discord-actions">
                  <button id="open-discord-app" class="btn">Open Discord</button>
                  <button id="create-server" class="btn btn-outline">Create Server</button>
              </div>
          </div>
      `;
      
      // Set up event listeners
      document.getElementById('discord-logout')?.addEventListener('click', () => this.disconnectDiscord());
      
      document.getElementById('open-discord-app')?.addEventListener('click', () => {
          try {
              // Try to open Discord app
              window.location.href = 'discord://';
              
              // As a fallback, also open web version after a delay
              setTimeout(() => {
                  window.open('https://discord.com/app', '_blank');
              }, 1000);
          } catch (e) {
              // If protocol handler fails, open web version
              window.open('https://discord.com/app', '_blank');
          }
      });
      
      document.getElementById('create-server')?.addEventListener('click', () => this.createServerModal());
  }

  disconnectDiscord() {
      // Remove Discord token and user info
      localStorage.removeItem('discordToken');
      
      // Update user data
      const userData = JSON.parse(localStorage.getItem('collabdUserData') || '{}');
      delete userData.discordUser;
      delete userData.discord;
      localStorage.setItem('collabdUserData', JSON.stringify(userData));
      
      // Reinitialize UI
      this.checkAuthStatus();
      
      // Optional: Show disconnection message
      alert('Discord account disconnected successfully.');
  }

  createServerModal() {
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
          <div class="modal-content">
              <div class="modal-header">
                  <h2>Create New Server</h2>
                  <span class="close">&times;</span>
              </div>
              <div class="modal-body">
                  <form id="new-server-form">
                      <div class="form-group">
                          <label for="server-name">Server Name</label>
                          <input type="text" id="server-name" class="form-control" required>
                      </div>
                      <div class="form-group">
                          <label>Server Type</label>
                          <div class="radio-group">
                              <label>
                                  <input type="radio" name="server-type" value="community" checked>
                                  Community Server
                              </label>
                              <label>
                                  <input type="radio" name="server-type" value="friends">
                                  Friends & Family
                              </label>
                          </div>
                      </div>
                      <div class="form-group">
                          <label for="server-description">Description (Optional)</label>
                          <textarea id="server-description" class="form-control" rows="3"></textarea>
                      </div>
                      <div class="form-actions">
                          <button type="button" class="btn btn-outline" id="cancel-server">Cancel</button>
                          <button type="submit" class="btn">Create Server</button>
                      </div>
                  </form>
              </div>
          </div>
      `;
      
      document.body.appendChild(modal);
      
      // Close modal events
      modal.querySelector('.close').addEventListener('click', closeModal);
      document.getElementById('cancel-server').addEventListener('click', closeModal);
      
      function closeModal() {
          document.body.removeChild(modal);
      }
      
      // Form submission
      document.getElementById('new-server-form').addEventListener('submit', (e) => {
          e.preventDefault();
          const serverName = document.getElementById('server-name').value;
          const serverType = document.querySelector('input[name="server-type"]:checked').value;
          const description = document.getElementById('server-description').value;
          
          // Simulate server creation
          alert(`Server "${serverName}" created successfully!`);
          closeModal();
      });
  }
}

// Discord Username Integration
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
      const discordElements = document.querySelectorAll('.discord-item, [data-service="discord"], .workspace-nav-item[data-view="discord"]');
      
      discordElements.forEach(function(element) {
          // Add click event listener to Discord elements
          element.addEventListener('click', function(event) {
              // If the click is on a link or button that should have different behavior, ignore
              if (event.target.tagName === 'BUTTON' || 
                  (event.target.tagName === 'A' && event.target.href && !event.target.href.includes('#'))) {
                  return;
              }
              
              // Check if the user has a Discord username
              if (userData.discord) {
                  // Prevent default action
                  event.preventDefault();
                  
                  // Open the user's Discord profile
                  // Note: This is a generic Discord profile link 
                  window.open(`https://discord.com/users/${userData.discord}`, '_blank');
                  
                  console.log(`Opening Discord profile for: ${userData.discord}`);
              } else {
                  // Alert the user if no Discord username is set
                  alert('No Discord username set. Please add your Discord username in settings.');
              }
          });
      });
  }
});

// Initialize Discord integration
document.addEventListener('DOMContentLoaded', function() {
  window.discordIntegration = new DiscordIntegration();
  window.discordIntegration.init('discord-container');
});