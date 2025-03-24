// // // Settings functionality script

// // // Function to load user data into the settings form
// // function loadUserData() {
// //     const userData = localStorage.getItem('collabdUserData');
    
// //     if (userData) {
// //         const user = JSON.parse(userData);
        
// //         // Populate form fields with user data
// //         document.getElementById('fullname').value = user.fullName || '';
// //         document.getElementById('username').value = user.username || '';
// //         document.getElementById('email').value = user.email || '';
// //         document.getElementById('bio').value = user.bio || '';
// //         document.getElementById('location').value = user.location || '';
// //         document.getElementById('github').value = user.github || '';
// //         document.getElementById('discord').value = user.discord || '';
        
// //         // Set toggle switches based on user preferences
// //         const toggles = document.querySelectorAll('.switch input[type="checkbox"]');
// //         if (toggles.length >= 3) {
// //             toggles[0].checked = user.profileVisible !== false;
// //             toggles[1].checked = user.showEmail !== false;
// //             toggles[2].checked = user.showOnlineStatus === true;
// //         }
// //     }
// // }

// // // Function to save user settings
// // function saveUserSettings(event) {
// //     event.preventDefault();
    
// //     // Get form values
// //     const fullName = document.getElementById('fullname').value;
// //     const username = document.getElementById('username').value;
// //     const email = document.getElementById('email').value;
// //     const bio = document.getElementById('bio').value;
// //     const location = document.getElementById('location').value;
// //     const github = document.getElementById('github').value;
// //     const discord = document.getElementById('discord').value;
    
// //     // Get toggle states
// //     const toggles = document.querySelectorAll('.switch input[type="checkbox"]');
// //     const profileVisible = toggles.length > 0 ? toggles[0].checked : true;
// //     const showEmail = toggles.length > 1 ? toggles[1].checked : true;
// //     const showOnlineStatus = toggles.length > 2 ? toggles[2].checked : false;
    
// //     // Create updated user data object
// //     const userData = {
// //         fullName: fullName,
// //         username: username,
// //         email: email,
// //         bio: bio,
// //         location: location,
// //         github: github,
// //         discord: discord,
// //         profileVisible: profileVisible,
// //         showEmail: showEmail,
// //         showOnlineStatus: showOnlineStatus
// //     };
    
// //     // Save updated user data to localStorage
// //     localStorage.setItem('collabdUserData', JSON.stringify(userData));
    
// //     // Show success message
// //     alert('Your settings have been saved successfully!');
// // }

// // // Function to handle disconnect actions
// // function disconnectService(service) {
// //     alert(`${service} has been disconnected from your account.`);
// //     // In a real application, we would make API calls to disconnect the service
// // }

// // // Initialize the settings page
// // document.addEventListener('DOMContentLoaded', function() {
// //     // Load user data
// //     loadUserData();
    
// //     // Set up form submission
// //     const settingsForm = document.querySelector('form');
// //     if (settingsForm) {
// //         settingsForm.addEventListener('submit', saveUserSettings);
// //     }
    
// //     // Set up disconnect buttons
// //     const vscodeBtn = document.querySelector('.btn-outline[onclick*="VSCode"]');
// //     if (vscodeBtn) {
// //         vscodeBtn.onclick = function() {
// //             disconnectService('Visual Studio Code');
// //             return false;
// //         };
// //     }
    
// //     const githubBtn = document.querySelector('.btn-outline[onclick*="GitHub"]');
// //     if (githubBtn) {
// //         githubBtn.onclick = function() {
// //             disconnectService('GitHub');
// //             return false;
// //         };
// //     }
    
// //     const discordBtn = document.querySelector('.btn-outline[onclick*="Discord"]');
// //     if (discordBtn) {
// //         discordBtn.onclick = function() {
// //             disconnectService('Discord');
// //             return false;
// //         };
// //     }
// // });







// // Settings functionality script

// // Function to load user data into the settings form
// function loadUserData() {
//     const userData = localStorage.getItem('collabdUserData');
    
//     if (userData) {
//         const user = JSON.parse(userData);
        
//         // Populate form fields with user data
//         document.getElementById('fullname').value = user.fullName || '';
//         document.getElementById('username').value = user.username || '';
//         document.getElementById('email').value = user.email || '';
//         document.getElementById('bio').value = user.bio || '';
//         document.getElementById('location').value = user.location || '';
//         document.getElementById('github').value = user.github || '';
//         document.getElementById('discord').value = user.discord || '';
        
//         // Set toggle switches based on user preferences
//         const toggles = document.querySelectorAll('.switch input[type="checkbox"]');
//         if (toggles.length >= 3) {
//             toggles[0].checked = user.profileVisible !== false;
//             toggles[1].checked = user.showEmail !== false;
//             toggles[2].checked = user.showOnlineStatus === true;
//         }
//     }
// }

// // Function to save user settings
// function saveUserSettings(event) {
//     event.preventDefault();
    
//     // Get form values
//     const fullName = document.getElementById('fullname').value;
//     const username = document.getElementById('username').value;
//     const email = document.getElementById('email').value;
//     const bio = document.getElementById('bio').value;
//     const location = document.getElementById('location').value;
//     const github = document.getElementById('github').value;
//     const discord = document.getElementById('discord').value;
    
//     // Get toggle states
//     const toggles = document.querySelectorAll('.switch input[type="checkbox"]');
//     const profileVisible = toggles.length > 0 ? toggles[0].checked : true;
//     const showEmail = toggles.length > 1 ? toggles[1].checked : true;
//     const showOnlineStatus = toggles.length > 2 ? toggles[2].checked : false;
    
//     // Create updated user data object
//     const userData = {
//         fullName: fullName,
//         username: username,
//         email: email,
//         bio: bio,
//         location: location,
//         github: github,
//         discord: discord,
//         profileVisible: profileVisible,
//         showEmail: showEmail,
//         showOnlineStatus: showOnlineStatus
//     };
    
//     // Save updated user data to localStorage
//     localStorage.setItem('collabdUserData', JSON.stringify(userData));
    
//     // Show success message
//     alert('Your settings have been saved successfully!');
// }

// // Function to handle disconnect actions
// function disconnectService(service) {
//     alert(`${service} has been disconnected from your account.`);
//     // In a real application, we would make API calls to disconnect the service
// }

// // Initialize the settings page
// document.addEventListener('DOMContentLoaded', function() {
//     // Load user data
//     loadUserData();
    
//     // Set up form submission
//     const settingsForm = document.querySelector('form');
//     if (settingsForm) {
//         settingsForm.addEventListener('submit', saveUserSettings);
//     }
    
//     // Set up disconnect buttons
//     const vscodeBtn = document.querySelector('.btn-outline[onclick*="VSCode"]');
//     if (vscodeBtn) {
//         vscodeBtn.onclick = function() {
//             disconnectService('Visual Studio Code');
//             return false;
//         };
//     }
    
//     const githubBtn = document.querySelector('.btn-outline[onclick*="GitHub"]');
//     if (githubBtn) {
//         githubBtn.onclick = function() {
//             disconnectService('GitHub');
//             return false;
//         };
//     }
    
//     const discordBtn = document.querySelector('.btn-outline[onclick*="Discord"]');
//     if (discordBtn) {
//         discordBtn.onclick = function() {
//             disconnectService('Discord');
//             return false;
//         };
//     }
// });








document.addEventListener('DOMContentLoaded', function() {
    // Include the necessary scripts if they haven't been loaded
    loadScriptIfNotExists('js/database-integration.js');
    loadScriptIfNotExists('js/service-redirects.js');
    
    // Initialize settings page
    initializeSettingsPage();
    
    // Set up event listeners
    setupServiceButtons();
    setupFormSubmission();
  });
  
  // Load script if it doesn't exist
  function loadScriptIfNotExists(src) {
    if (!document.querySelector(`script[src="${src}"]`)) {
      const script = document.createElement('script');
      script.src = src;
      document.body.appendChild(script);
    }
  }
  
  // Initialize settings page
  function initializeSettingsPage() {
    // Get existing user data
    const userData = UserDatabaseManager?.getCurrentUser() || 
                    JSON.parse(localStorage.getItem('collabdUserData') || '{}');
    
    // Fill form fields with user data
    if (userData) {
      // Update form fields
      const fullnameInput = document.getElementById('fullname');
      const usernameInput = document.getElementById('username');
      const emailInput = document.getElementById('email');
      const bioInput = document.getElementById('bio');
      const locationInput = document.getElementById('location');
      const githubInput = document.getElementById('github');
      const discordInput = document.getElementById('discord');
      
      if (fullnameInput) fullnameInput.value = userData.fullName || '';
      if (usernameInput) usernameInput.value = userData.username || '';
      if (emailInput) emailInput.value = userData.email || '';
      if (bioInput) bioInput.value = userData.bio || '';
      if (locationInput) locationInput.value = userData.location || '';
      if (githubInput) githubInput.value = userData.github || '';
      if (discordInput) discordInput.value = userData.discord || '';
      
      // Set toggle switches
      const toggles = document.querySelectorAll('.switch input[type="checkbox"]');
      if (toggles.length >= 3) {
        toggles[0].checked = userData.profileVisible !== false;
        toggles[1].checked = userData.showEmail !== false;
        toggles[2].checked = userData.showOnlineStatus === true;
      }
    }
    
    // Update service connection status indicators
    updateServiceConnectionStatus();
  }
  
  // Update service connection status indicators
  function updateServiceConnectionStatus() {
    // Get connection data
    const connections = JSON.parse(localStorage.getItem('serviceConnections') || '{}');
    
    // Update each service status
    ['vscode', 'github', 'discord'].forEach(service => {
      const isConnected = connections[service]?.connected === true;
      const serviceTitle = service === 'vscode' ? 'Visual Studio Code' : 
                            service === 'github' ? 'GitHub' : 'Discord';
      
      // Find the status element
      let statusElem;
      if (service === 'vscode') {
        statusElem = document.querySelector('.integration-header div:nth-child(2)');
      } else if (service === 'github') {
        statusElem = document.querySelectorAll('.integration-header div:nth-child(2)')[1];
      } else if (service === 'discord') {
        statusElem = document.querySelectorAll('.integration-header div:nth-child(2)')[2];
      }
      
      // Update the status display if element exists
      if (statusElem) {
        statusElem.textContent = isConnected ? 'Connected' : 'Not Connected';
        statusElem.className = `integration-status ${service}-status ${isConnected ? 'connected' : 'not-connected'}`;
      }
    });
  }
  
  // Set up service buttons
  function setupServiceButtons() {
    // Get connection data
    const connections = JSON.parse(localStorage.getItem('serviceConnections') || '{}');
    
    // Set up disconnect buttons using new database API
    const vscodeBtn = document.querySelector('.btn-outline[onclick*="VSCode"]');
    if (vscodeBtn) {
      vscodeBtn.onclick = async function() {
        try {
          if (UserDatabaseManager) {
            await UserDatabaseManager.disconnectService('vscode');
          } else {
            // Fallback if database integration is not loaded
            localStorage.setItem('vsCodeConnected', 'false');
            const connections = JSON.parse(localStorage.getItem('serviceConnections') || '{}');
            if (connections.vscode) {
              connections.vscode.connected = false;
              connections.vscode.disconnectedAt = new Date().toISOString();
            }
            localStorage.setItem('serviceConnections', JSON.stringify(connections));
          }
          
          // Update UI
          updateServiceConnectionStatus();
          
          // Show confirmation
          alert('Visual Studio Code has been disconnected from your account.');
        } catch (error) {
          console.error('Error disconnecting VSCode:', error);
          alert('Failed to disconnect VSCode. Please try again.');
        }
        return false;
      };
    }
    
    const githubBtn = document.querySelector('.btn-outline[onclick*="GitHub"]');
    if (githubBtn) {
      githubBtn.onclick = async function() {
        try {
          if (UserDatabaseManager) {
            await UserDatabaseManager.disconnectService('github');
          } else {
            // Fallback if database integration is not loaded
            localStorage.setItem('githubConnected', 'false');
            const connections = JSON.parse(localStorage.getItem('serviceConnections') || '{}');
            if (connections.github) {
              connections.github.connected = false;
              connections.github.disconnectedAt = new Date().toISOString();
            }
            localStorage.setItem('serviceConnections', JSON.stringify(connections));
          }
          
          // Update UI
          updateServiceConnectionStatus();
          
          // Show confirmation
          alert('GitHub has been disconnected from your account.');
        } catch (error) {
          console.error('Error disconnecting GitHub:', error);
          alert('Failed to disconnect GitHub. Please try again.');
        }
        return false;
      };
    }
    
    const discordBtn = document.querySelector('.btn-outline[onclick*="Discord"]');
    if (discordBtn) {
      discordBtn.onclick = async function() {
        try {
          if (UserDatabaseManager) {
            await UserDatabaseManager.disconnectService('discord');
          } else {
            // Fallback if database integration is not loaded
            localStorage.setItem('discordConnected', 'false');
            const connections = JSON.parse(localStorage.getItem('serviceConnections') || '{}');
            if (connections.discord) {
              connections.discord.connected = false;
              connections.discord.disconnectedAt = new Date().toISOString();
            }
            localStorage.setItem('serviceConnections', JSON.stringify(connections));
          }
          
          // Update UI
          updateServiceConnectionStatus();
          
          // Show confirmation
          alert('Discord has been disconnected from your account.');
        } catch (error) {
          console.error('Error disconnecting Discord:', error);
          alert('Failed to disconnect Discord. Please try again.');
        }
        return false;
      };
    }
    
    // Add "Open" buttons next to Connected Services
    const vscodeSection = document.getElementById('vscode-section') || 
                         document.querySelector('.integration-card:first-child');
    const githubSection = document.getElementById('github-section') ||
                         document.querySelectorAll('.integration-card')[1];
    const discordSection = document.getElementById('discord-section') ||
                          document.querySelectorAll('.integration-card')[2];
    
    if (vscodeSection && !vscodeSection.querySelector('.open-service-btn')) {
      addOpenButton(vscodeSection, 'vscode');
    }
    
    if (githubSection && !githubSection.querySelector('.open-service-btn')) {
      addOpenButton(githubSection, 'github');
    }
    
    if (discordSection && !discordSection.querySelector('.open-service-btn')) {
      addOpenButton(discordSection, 'discord');
    }
  }
  
  // Add an "Open" button to a service section
  function addOpenButton(section, service) {
    const actionDiv = section.querySelector('.integration-actions') || 
                     section.querySelector('.btn-outline').parentNode;
    
    if (actionDiv) {
      const openBtn = document.createElement('button');
      openBtn.className = 'btn open-service-btn';
      openBtn.textContent = `Open ${service === 'vscode' ? 'VS Code' : 
                             service === 'github' ? 'GitHub' : 'Discord'}`;
      openBtn.style.marginLeft = '10px';
      
      openBtn.addEventListener('click', function() {
        if (service === 'vscode') {
          redirectToVSCode();
        } else if (service === 'github') {
          redirectToGitHub();
        } else if (service === 'discord') {
          redirectToDiscord();
        }
      });
      
      actionDiv.appendChild(openBtn);
    }
  }
  
  // Set up form submission
  // function setupFormSubmission() {
  //   const form = document.querySelector('form');
  //   if (!form) return;
    
  //   form.addEventListener('submit', async function(e) {
  //     e.preventDefault();
      
  //     // Get form values
  //     const fullName = document.getElementById('fullname')?.value;
  //     const username = document.getElementById('username')?.value;
  //     const email = document.getElementById('email')?.value;
  //     const bio = document.getElementById('bio')?.value;
  //     const location = document.getElementById('location')?.value;
  //     const github = document.getElementById('github')?.value;
  //     const discord = document.getElementById('discord')?.value;
      
  //     // Get toggle states
  //     const toggles = document.querySelectorAll('.switch input[type="checkbox"]');
  //     const profileVisible = toggles.length > 0 ? toggles[0].checked : true;
  //     const showEmail = toggles.length > 1 ? toggles[1].checked : true;
  //     const showOnlineStatus = toggles.length > 2 ? toggles[2].checked : false;
      
  //     // Create updated user data object
  //     const userData = {
  //       fullName: fullName,
  //       username: username,
  //       email: email,
  //       bio: bio,
  //       location: location,
  //       github: github,
  //       discord: discord,
  //       profileVisible: profileVisible,
  //       showEmail: showEmail,
  //       showOnlineStatus: showOnlineStatus
  //     };
      
  //     try {
  //       // Use database manager if available, otherwise use localStorage
  //       if (UserDatabaseManager) {
  //         // Update user data in database
  //         await UserDatabaseManager.syncUser(userData);
          
  //         // Connect services if usernames provided
  //         if (github) {
  //           await UserDatabaseManager.connectService('github', github);
  //         }
          
  //         if (discord) {
  //           await UserDatabaseManager.connectService('discord', discord);
  //         }
  //       } else {
  //         // Fallback to localStorage
  //         localStorage.setItem('collabdUserData', JSON.stringify(userData));
          
  //         // Update service connections if provided
  //         if (github) {
  //           const connections = JSON.parse(localStorage.getItem('serviceConnections') || '{}');
  //           connections.github = {
  //             connected: true,
  //             username: github,
  //             connectedAt: new Date().toISOString()
  //           };
  //           localStorage.setItem('serviceConnections', JSON.stringify(connections));
  //         }
          
  //         if (discord) {
  //           const connections = JSON.parse(localStorage.getItem('serviceConnections') || '{}');
  //           connections.discord = {
  //             connected: true,
  //             username: discord,
  //             connectedAt: new Date().toISOString()
  //           };
  //           localStorage.setItem('serviceConnections', JSON.stringify(connections));
  //         }
  //       }
        
  //       // Update UI
  //       updateServiceConnectionStatus();
        
  //       // Show success message
  //       alert('Your settings have been saved successfully!');
  //     } catch (error) {
  //       console.error('Error saving settings:', error);
  //       alert('There was an error saving your settings. Please try again.');
  //     }
  //   });
  // }
  function setupFormSubmission() {
    const form = document.querySelector('form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const fullName = document.getElementById('fullname')?.value;
        const username = document.getElementById('username')?.value;
        const email = document.getElementById('email')?.value;
        const bio = document.getElementById('bio')?.value;
        const location = document.getElementById('location')?.value;
        const github = document.getElementById('github')?.value;
        const discord = document.getElementById('discord')?.value;
        
        // Get toggle states
        const toggles = document.querySelectorAll('.switch input[type="checkbox"]');
        const profileVisible = toggles.length > 0 ? toggles[0].checked : true;
        const showEmail = toggles.length > 1 ? toggles[1].checked : true;
        const showOnlineStatus = toggles.length > 2 ? toggles[2].checked : false;
        
        try {
            // Retrieve existing user data by email
            let existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
            let userData = existingUsers[email];
            
            if (!userData) {
                // If no existing user, create new entry
                userData = {};
            }
            
            // Update user data, preserving existing service connections if they exist
            userData.fullName = fullName;
            userData.username = username;
            userData.email = email;
            userData.bio = bio;
            userData.location = location;
            
            // Preserve existing GitHub username if not overwritten
            if (github) {
                userData.github = github;
            }
            
            // Preserve existing Discord username if not overwritten
            if (discord) {
                userData.discord = discord;
            }
            
            // Update other settings
            userData.profileVisible = profileVisible;
            userData.showEmail = showEmail;
            userData.showOnlineStatus = showOnlineStatus;
            
            // Save updated user data
            existingUsers[email] = userData;
            localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
            
            // Also update current user in localStorage for immediate use
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            // Update service connections
            const connections = JSON.parse(localStorage.getItem('serviceConnections') || '{}');
            
            if (github) {
                connections.github = {
                    connected: true,
                    username: github,
                    connectedAt: new Date().toISOString(),
                    email: email
                };
            }
            
            if (discord) {
                connections.discord = {
                    connected: true,
                    username: discord,
                    connectedAt: new Date().toISOString(),
                    email: email
                };
            }
            
            localStorage.setItem('serviceConnections', JSON.stringify(connections));
            
            // Update UI
            updateServiceConnectionStatus();
            
            // Show success message
            alert('Your settings have been saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('There was an error saving your settings. Please try again.');
        }
    });
}

// Modify initialization to load user data by email
function initializeSettingsPage() {
    // Get current user's email
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const email = currentUser.email;
    
    // Retrieve all registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    
    // Get user data for this email
    const userData = registeredUsers[email] || currentUser;
    
    if (userData) {
        // Update form fields
        const fullnameInput = document.getElementById('fullname');
        const usernameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');
        const bioInput = document.getElementById('bio');
        const locationInput = document.getElementById('location');
        const githubInput = document.getElementById('github');
        const discordInput = document.getElementById('discord');
        
        if (fullnameInput) fullnameInput.value = userData.fullName || '';
        if (usernameInput) usernameInput.value = userData.username || '';
        if (emailInput) emailInput.value = userData.email || '';
        if (bioInput) bioInput.value = userData.bio || '';
        if (locationInput) locationInput.value = userData.location || '';
        if (githubInput) githubInput.value = userData.github || '';
        if (discordInput) discordInput.value = userData.discord || '';
        
        // Set toggle switches
        const toggles = document.querySelectorAll('.switch input[type="checkbox"]');
        if (toggles.length >= 3) {
            toggles[0].checked = userData.profileVisible !== false;
            toggles[1].checked = userData.showEmail !== false;
            toggles[2].checked = userData.showOnlineStatus === true;
        }
    }
    
    // Update service connection status indicators
    updateServiceConnectionStatus();
}
  // Original saveUserSettings function - we'll keep this for backward compatibility
  // but enhance it with our new database integration
  function saveUserSettings(event) {
    event.preventDefault();
    
    // Get form values
    const fullName = document.getElementById('fullname').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const bio = document.getElementById('bio')?.value || '';
    const location = document.getElementById('location')?.value || '';
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
    
    // Try to use database manager if available
    if (typeof UserDatabaseManager !== 'undefined') {
      UserDatabaseManager.syncUser(userData)
        .then(() => {
          // Connect services if usernames provided
          if (github) {
            UserDatabaseManager.connectService('github', github);
          }
          
          if (discord) {
            UserDatabaseManager.connectService('discord', discord);
          }
          
          // Update UI
          updateServiceConnectionStatus();
          
          // Show success message
          alert('Your settings have been saved successfully!');
        })
        .catch(err => {
          console.error('Error saving settings:', err);
          // Fall back to localStorage
          localStorage.setItem('collabdUserData', JSON.stringify(userData));
          alert('Your settings have been saved locally. Server sync failed.');
        });
    } else {
      // Save updated user data to localStorage
      localStorage.setItem('collabdUserData', JSON.stringify(userData));
      
      // Show success message
      alert('Your settings have been saved successfully!');
    }
  }




