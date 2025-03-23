// Firebase configuration - Simplified non-module version

// Your web app's Firebase configuration
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
  
  // Initialize Firebase (will be done after the Firebase SDK is loaded)
  let app, auth, database, analytics;
  
  // Function to initialize Firebase
  function initializeFirebase() {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    database = firebase.database();
    analytics = firebase.analytics();
    
    // Set up auth state listener
    auth.onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in
        console.log("User is signed in:", user.uid);
        getUserData(user.uid);
      } else {
        // User is signed out
        console.log("User is signed out");
        localStorage.removeItem('collabdUserData');
        localStorage.setItem('collabdLoggedIn', 'false');
        updateUIForLoggedOutUser();
      }
    });
  }
  
  // Function to get user data from Firebase
  function getUserData(uid) {
    const userRef = database.ref('users/' + uid);
    userRef.once('value').then(function(snapshot) {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        localStorage.setItem('collabdUserData', JSON.stringify(userData));
        localStorage.setItem('collabdLoggedIn', 'true');
        updateUIForLoggedInUser(userData);
      } else {
        console.log("No user data available");
      }
    }).catch(function(error) {
      console.error("Error getting user data:", error);
    });
  }
  
  // Function to update UI for logged in user
  function updateUIForLoggedInUser(userData) {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    
    // Get login and signup links
    const loginLink = Array.from(navLinks.querySelectorAll('a')).find(link => 
        link.textContent.trim().toLowerCase() === 'login'
    );
    
    const signupLink = Array.from(navLinks.querySelectorAll('a')).find(link => 
        link.textContent.trim().toLowerCase() === 'sign up'
    );
    
    if (loginLink && loginLink.parentNode) {
      const userProfileItem = document.createElement('li');
      const userProfileLink = document.createElement('a');
      userProfileLink.href = 'settings.html';
      userProfileLink.textContent = userData.fullName || 'My Profile';
      userProfileItem.appendChild(userProfileLink);
      
      loginLink.parentNode.parentNode.replaceChild(userProfileItem, loginLink.parentNode);
    }
    
    if (signupLink && signupLink.parentNode) {
      const logoutItem = document.createElement('li');
      const logoutLink = document.createElement('a');
      logoutLink.href = '#';
      logoutLink.textContent = 'Logout';
      logoutLink.onclick = function() {
        handleLogout();
        return false;
      };
      logoutItem.appendChild(logoutLink);
      
      signupLink.parentNode.parentNode.replaceChild(logoutItem, signupLink.parentNode);
    }
    
    // If on settings page, load user data into form
    if (window.location.pathname.includes('settings.html')) {
      loadUserDataIntoSettingsForm(userData);
    }
  }
  
  // Function to update UI for logged out user
  function updateUIForLoggedOutUser() {
    // On most pages, we'll just leave the login/signup links as they are
    
    // If on settings page, redirect to login
    if (window.location.pathname.includes('settings.html')) {
      alert('Please log in to view settings');
      window.location.href = 'login.html';
    }
  }
  
  // Function to handle signup
  function handleSignup(event) {
    event.preventDefault();
    
    // Get form values
    const fullName = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const termsChecked = document.getElementById('terms').checked;
    
    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      alert('Please fill out all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (!termsChecked) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    // Create the user in Firebase Authentication
    auth.createUserWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        // User created successfully
        const user = userCredential.user;
        
        // Create a username from email
        const username = email.split('@')[0];
        
        // Prepare user data for the database
        const userData = {
          uid: user.uid,
          fullName: fullName,
          email: email,
          username: username,
          bio: '',
          location: '',
          github: '',
          discord: '',
          profileVisible: true,
          showEmail: true,
          showOnlineStatus: false,
          createdAt: new Date().toISOString()
        };
        
        // Store user data in Firebase Realtime Database
        return database.ref('users/' + user.uid).set(userData)
          .then(function() {
            // Show success message
            alert('Account created successfully! You can now log in.');
            
            // Redirect to login page
            window.location.href = 'login.html';
          });
      })
      .catch(function(error) {
        // Handle errors
        let errorMessage = 'An error occurred during signup.';
        
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already registered. Please log in or use a different email.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak. Please use at least 6 characters.';
            break;
          default:
            errorMessage = error.message;
        }
        
        alert(errorMessage);
        console.error('Signup Error:', error);
      });
  }
  
  // Function to handle login
  function handleLogin(event) {
    event.preventDefault();
    
    // Get form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    
    // Sign in with Firebase Authentication
    auth.signInWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        // User signed in successfully
        const user = userCredential.user;
        
        // Data loading will be handled by the auth state listener
        alert('Login successful! Redirecting to the dashboard...');
        window.location.href = 'index.html';
      })
      .catch(function(error) {
        // Handle errors
        let errorMessage = 'An error occurred during login.';
        
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = 'Invalid email or password. Please try again.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled. Please contact support.';
            break;
          default:
            errorMessage = error.message;
        }
        
        alert(errorMessage);
        console.error('Login Error:', error);
      });
  }
  
  // Function to handle logout
  function handleLogout() {
    auth.signOut()
      .then(function() {
        // Sign-out successful
        localStorage.removeItem('collabdUserData');
        localStorage.setItem('collabdLoggedIn', 'false');
        
        alert('You have been logged out successfully.');
        window.location.href = 'index.html';
      })
      .catch(function(error) {
        // An error happened
        console.error('Error signing out:', error);
        alert('An error occurred while logging out. Please try again.');
      });
  }
  
  // Function to load user data into settings form
  function loadUserDataIntoSettingsForm(userData) {
    if (!userData) {
      const storedUserData = localStorage.getItem('collabdUserData');
      if (storedUserData) {
        userData = JSON.parse(storedUserData);
      } else {
        return;
      }
    }
    
    // Populate form fields with user data
    document.getElementById('fullname').value = userData.fullName || '';
    document.getElementById('username').value = userData.username || '';
    document.getElementById('email').value = userData.email || '';
    document.getElementById('bio').value = userData.bio || '';
    document.getElementById('location').value = userData.location || '';
    document.getElementById('github').value = userData.github || '';
    document.getElementById('discord').value = userData.discord || '';
    
    // Set toggle switches based on user preferences
    const toggles = document.querySelectorAll('.switch input[type="checkbox"]');
    if (toggles.length >= 3) {
      toggles[0].checked = userData.profileVisible !== false;
      toggles[1].checked = userData.showEmail !== false;
      toggles[2].checked = userData.showOnlineStatus === true;
    }
  }
  
  // Function to save user settings
  function saveUserSettings(event) {
    event.preventDefault();
    
    if (!auth.currentUser) {
      alert('Please log in to update settings');
      window.location.href = 'login.html';
      return;
    }
    
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
    
    // Basic validation
    if (!fullName || !username || !email) {
      alert('Name, username and email are required fields');
      return;
    }
    
    // Get user data from localStorage first (to maintain any fields we're not updating)
    const storedUserData = localStorage.getItem('collabdUserData');
    let existingData = {};
    if (storedUserData) {
      existingData = JSON.parse(storedUserData);
    }
    
    // Create updated user data object
    const userData = {
      ...existingData,
      fullName: fullName,
      username: username,
      email: email,
      bio: bio,
      location: location,
      github: github,
      discord: discord,
      profileVisible: profileVisible,
      showEmail: showEmail,
      showOnlineStatus: showOnlineStatus,
      updatedAt: new Date().toISOString()
    };
    
    // Update user data in Firebase Realtime Database
    database.ref('users/' + auth.currentUser.uid).update(userData)
      .then(function() {
        // Update local storage
        localStorage.setItem('collabdUserData', JSON.stringify(userData));
        
        alert('Your settings have been saved successfully!');
      })
      .catch(function(error) {
        console.error('Error saving settings:', error);
        alert('Error saving settings: ' + error.message);
      });
  }
  
  // Function to disconnect a service
  function disconnectService(service) {
    if (!auth.currentUser) {
      alert('Please log in to manage connected services');
      return;
    }
    
    alert(`${service} has been disconnected from your account.`);
    
    // In a real app, you would update the database here
    // database.ref('userServices/' + auth.currentUser.uid + '/' + service.toLowerCase()).update({
    //   connected: false,
    //   disconnectedAt: new Date().toISOString()
    // });
  }
  
  // Export functions to window object for HTML onclick attributes
  window.handleSignup = handleSignup;
  window.handleLogin = handleLogin;
  window.handleLogout = handleLogout;
  window.saveUserSettings = saveUserSettings;
  window.disconnectService = disconnectService;
  window.initializeFirebase = initializeFirebase;