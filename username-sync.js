document.addEventListener('DOMContentLoaded', function() {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('collabdUserData') || '{}');
    
    // If we're on the signup page
    if (document.querySelector('form[onsubmit*="handleSignup"]') || document.querySelector('.signup-form')) {
      // Set up signup form submission
      const signupForm = document.querySelector('form[onsubmit*="handleSignup"]') || document.querySelector('.signup-form');
      
      if (signupForm) {
        // Override the original submit handler
        signupForm.onsubmit = function(event) {
          event.preventDefault();
          
          // Get form data
          const fullName = document.getElementById('fullname').value;
          const email = document.getElementById('email').value;
          
          // Get username - could be directly from a field or generated
          let username = '';
          if (document.getElementById('username')) {
            username = document.getElementById('username').value;
          } else {
            // Generate username from email or name if no username field
            username = email.split('@')[0] || fullName.split(' ')[0].toLowerCase();
          }
          
          // Create user data object
          const userData = {
            fullName: fullName,
            username: username,
            email: email
          };
          
          // Log what we're saving for debugging
          console.log('Saving user data:', userData);
          
          // Save to localStorage
          localStorage.setItem('collabdUserData', JSON.stringify(userData));
          
          // Redirect to workspace
          alert('Account created! Redirecting to workspace...');
          setTimeout(function() {
            window.location.href = 'workspace.html';
          }, 1000);
          
          return false;
        };
      }
    }
    
    // If we're on the workspace page
    if (document.querySelector('.workspace-container') || document.querySelector('.user-profile')) {
      // Find all places where username should be displayed
      const usernameElements = document.querySelectorAll('.user-profile span');
      
      // Update each username element with the username from localStorage
      usernameElements.forEach(function(element) {
        if (userData.username) {
          console.log('Updating workspace username to:', userData.username);
          element.textContent = userData.username;
        }
      });
    }
    
    // If we're on the settings page
    if (document.getElementById('username')) {
      // Update the username field if it exists
      if (userData.username) {
        console.log('Setting settings username field to:', userData.username);
        document.getElementById('username').value = userData.username;
      }
      
      // Update full name field if it exists
      if (document.getElementById('fullname') && userData.fullName) {
        document.getElementById('fullname').value = userData.fullName;
      }
      
      // Update email field if it exists
      if (document.getElementById('email') && userData.email) {
        document.getElementById('email').value = userData.email;
      }
      
      // Handle settings form submission
      const settingsForm = document.querySelector('form') || document.getElementById('settings-form');
      if (settingsForm) {
        settingsForm.addEventListener('submit', function(event) {
          event.preventDefault();
          
          // Get updated settings
          const updatedData = {
            ...userData,
            username: document.getElementById('username').value,
            fullName: document.getElementById('fullname').value,
            email: document.getElementById('email').value
          };
          
          // Log what we're saving
          console.log('Updating user data:', updatedData);
          
          // Save to localStorage
          localStorage.setItem('collabdUserData', JSON.stringify(updatedData));
          
          alert('Settings saved successfully!');
        });
      }
    }
    
    // Setup profile picture upload if the button exists
    const changePhotoBtn = document.querySelector('.change-photo-btn');
    if (changePhotoBtn) {
      changePhotoBtn.addEventListener('click', function() {
        // Create file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        
        // Handle file selection
        fileInput.addEventListener('change', function(e) {
          if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
              // Save profile picture to localStorage
              localStorage.setItem('profilePicture', event.target.result);
              
              // Update all profile pictures on the page
              const profilePics = document.querySelectorAll('.profile-pic');
              profilePics.forEach(function(pic) {
                pic.src = event.target.result;
              });
            };
            
            reader.readAsDataURL(e.target.files[0]);
          }
        });
        
        // Open file selection dialog
        fileInput.click();
      });
    }
    
    // Update profile pictures if they exist in localStorage
    const profilePicture = localStorage.getItem('profilePicture');
    if (profilePicture) {
      const profilePics = document.querySelectorAll('.profile-pic');
      profilePics.forEach(function(pic) {
        pic.src = profilePicture;
      });
    }
  });
  
  // Original handleSignup function for compatibility
  function handleSignup(event) {
    event.preventDefault();
    
    // Get form data
    const fullName = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    let username = '';
    
    // Get username if available, otherwise generate from email
    if (document.getElementById('username')) {
      username = document.getElementById('username').value;
    } else {
      username = email.split('@')[0];
    }
    
    // Create user data object
    const userData = {
      fullName: fullName,
      username: username,
      email: email
    };
    
    // Save to localStorage
    localStorage.setItem('collabdUserData', JSON.stringify(userData));
    
    // Redirect to workspace
    alert('Account created! Redirecting to workspace...');
    setTimeout(function() {
      window.location.href = 'workspace.html';
    }, 1000);
    
    return false;
  }