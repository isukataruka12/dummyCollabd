// This version doesn't use ES modules and can be included directly in HTML with a script tag

// Initialize Firebase (make sure Firebase scripts are included before this script)
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

  // Initialize Firebase if it hasn't been initialized yet
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // Check if user is logged in
  let currentUser = null;
  
  auth.onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in
      currentUser = user;
      loadUserSettings();
    } else {
      // Redirect to login page if not signed in
      // Uncomment the following line when authentication is fully implemented
      // window.location.href = 'login.html';
    }
  });
  
  // Load user settings from Firestore
  function loadUserSettings() {
    if (!currentUser) return;
    
    db.collection('users').doc(currentUser.uid).get()
      .then(function(doc) {
        if (doc.exists) {
          const userData = doc.data();
          
          // Populate form fields with user data
          document.getElementById('fullname').value = userData.fullName || '';
          document.getElementById('username').value = userData.username || '';
          document.getElementById('email').value = userData.email || '';
          document.getElementById('bio').value = userData.bio || '';
          document.getElementById('location').value = userData.location || '';
          document.getElementById('github').value = userData.github || '';
          document.getElementById('discord').value = userData.discord || '';
          
          // Set toggle switches
          const toggles = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
          if (userData.profileSettings) {
            toggles[0].checked = userData.profileSettings.isPublic;
            toggles[1].checked = userData.profileSettings.showEmail;
            toggles[2].checked = userData.profileSettings.showOnlineStatus;
          }
        }
      })
      .catch(function(error) {
        console.error("Error loading user settings:", error);
        showNotification("Failed to load user settings", "error");
      });
  }
  
  // Save user settings to Firestore
  window.saveUserSettings = function(event) {
    event.preventDefault();
    
    if (!currentUser) {
      // For testing purposes, create a mock user ID if not logged in
      // Remove this in production code
      if (!currentUser) {
        currentUser = { uid: 'test-user-' + Math.random().toString(36).substring(2, 15) };
        console.warn('Using mock user ID for testing:', currentUser.uid);
      }
    }
    
    // Get values from form
    const fullName = document.getElementById('fullname').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const bio = document.getElementById('bio').value.trim();
    const location = document.getElementById('location').value.trim();
    const github = document.getElementById('github').value.trim();
    const discord = document.getElementById('discord').value.trim();
    
    // Get toggle values
    const toggles = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
    const isPublic = toggles[0].checked;
    const showEmail = toggles[1].checked;
    const showOnlineStatus = toggles[2].checked;
    
    // Create user data object
    const userData = {
      fullName,
      username,
      email,
      bio,
      location,
      github,
      discord,
      profileSettings: {
        isPublic,
        showEmail,
        showOnlineStatus
      },
      connectedAccounts: {
        vscode: true, // These values should be dynamically determined based on actual connections
        github: true,
        discord: true
      },
      updatedAt: new Date()
    };
    
    // Save to Firestore
    db.collection('users').doc(currentUser.uid).set(userData, { merge: true })
      .then(function() {
        showNotification("Settings saved successfully", "success");
      })
      .catch(function(error) {
        console.error("Error saving user settings:", error);
        showNotification("Failed to save settings", "error");
      });
  };
  
  // Function to disconnect a service
  window.disconnectService = function(serviceName) {
    if (!currentUser) return;
    
    db.collection('users').doc(currentUser.uid).get()
      .then(function(doc) {
        if (doc.exists) {
          const userData = doc.data();
          const connectedAccounts = userData.connectedAccounts || {};
          
          // Update the service connection status
          switch(serviceName) {
            case 'Visual Studio Code':
              connectedAccounts.vscode = false;
              break;
            case 'GitHub':
              connectedAccounts.github = false;
              break;
            case 'Discord':
              connectedAccounts.discord = false;
              break;
          }
          
          // Update the user document
          return db.collection('users').doc(currentUser.uid).update({
            connectedAccounts: connectedAccounts
          });
        }
      })
      .then(function() {
        showNotification(`Disconnected from ${serviceName}`, "success");
        
        // Update UI to show disconnected state
        const buttons = document.querySelectorAll('.btn.btn-outline');
        buttons.forEach(function(btn) {
          if (btn.innerText === 'Disconnect' && btn.onclick.toString().includes(serviceName)) {
            const statusDiv = btn.parentElement.querySelector('div div:nth-child(2)');
            if (statusDiv) {
              statusDiv.innerText = 'Disconnected';
            }
            btn.innerText = 'Connect';
            // You would need to implement the connectService function
            // btn.onclick = function() { connectService(serviceName); };
          }
        });
      })
      .catch(function(error) {
        console.error(`Error disconnecting ${serviceName}:`, error);
        showNotification(`Failed to disconnect ${serviceName}`, "error");
      });
  };
  
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
  const style = document.createElement('style');
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
});