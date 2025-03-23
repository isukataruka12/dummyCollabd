// Add this code to a new file called profile-sync.js

// Function to handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    // Get user data from form
    const fullName = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!fullName || !email || !password) {
      alert('Please fill in all required fields');
      return false;
    }
    
    // Generate username from first part of email
    const username = email.split('@')[0];
    
    // Create user data object
    const userData = {
      fullName: fullName,
      username: username,
      email: email,
      signupDate: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('collabdUserData', JSON.stringify(userData));
    
    // Redirect to workspace
    alert('Account created! Redirecting to workspace...');
    setTimeout(() => {
      window.location.href = 'workspace.html';
    }, 1000);
    
    return false;
  }
  
  // Function to update username in settings
  function updateSettingsForm() {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('collabdUserData') || '{}');
    
    // Update form fields if they exist
    if (document.getElementById('fullname')) {
      document.getElementById('fullname').value = userData.fullName || '';
    }
    
    if (document.getElementById('username')) {
      document.getElementById('username').value = userData.username || '';
    }
    
    if (document.getElementById('email')) {
      document.getElementById('email').value = userData.email || '';
    }
  }
  
  // Function to update username in workspace
  function updateWorkspaceUsername() {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('collabdUserData') || '{}');
    
    // Update username in the navbar
    const usernameElement = document.querySelector('.user-profile span');
    if (usernameElement && userData.username) {
      usernameElement.textContent = userData.username;
    }
  }
  
  // Function to set up profile picture upload
  function setupProfilePictureUpload() {
    // Add change event to profile picture elements with change-photo-btn class
    const profilePicButtons = document.querySelectorAll('.change-photo-btn');
    
    profilePicButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Create a file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        
        // Handle file selection
        fileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
              // Save the profile picture to localStorage
              localStorage.setItem('profilePicture', event.target.result);
              
              // Update all profile pictures on the page
              updateProfilePictures();
            };
            
            reader.readAsDataURL(e.target.files[0]);
          }
        });
        
        // Trigger file selection dialog
        fileInput.click();
      });
    });
  }
  
  // Function to update all profile pictures
  function updateProfilePictures() {
    // Get profile picture from localStorage
    const profilePic = localStorage.getItem('profilePicture');
    
    // Update all profile picture elements
    if (profilePic) {
      const profilePicElements = document.querySelectorAll('.profile-pic');
      profilePicElements.forEach(element => {
        element.src = profilePic;
      });
    }
  }
  
  // Initialize everything when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    // Check which page we're on
    const isSignupPage = document.querySelector('.signup-form, form[onsubmit*="handleSignup"]');
    const isSettingsPage = document.getElementById('settings-form');
    const isWorkspacePage = document.querySelector('.workspace-container');
    
    // Initialize based on page type
    if (isSignupPage) {
      // Set up signup form submission
      const form = isSignupPage;
      form.onsubmit = handleSignup;
    }
    
    if (isSettingsPage) {
      // Update settings form with user data
      updateSettingsForm();
      
      // Handle settings form submission
      isSettingsPage.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Get updated user data
        const userData = {
          fullName: document.getElementById('fullname').value,
          username: document.getElementById('username').value,
          email: document.getElementById('email').value
        };
        
        // Save to localStorage
        localStorage.setItem('collabdUserData', JSON.stringify(userData));
        
        alert('Settings saved successfully!');
      });
    }
    
    if (isWorkspacePage) {
      // Update username in workspace
      updateWorkspaceUsername();
    }
    
    // Set up profile picture upload on any page
    setupProfilePictureUpload();
    
    // Update profile pictures on any page
    updateProfilePictures();
  });