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







// Settings functionality script

// Function to load user data into the settings form
function loadUserData() {
    const userData = localStorage.getItem('collabdUserData');
    
    if (userData) {
        const user = JSON.parse(userData);
        
        // Populate form fields with user data
        document.getElementById('fullname').value = user.fullName || '';
        document.getElementById('username').value = user.username || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('bio').value = user.bio || '';
        document.getElementById('location').value = user.location || '';
        document.getElementById('github').value = user.github || '';
        document.getElementById('discord').value = user.discord || '';
        
        // Set toggle switches based on user preferences
        const toggles = document.querySelectorAll('.switch input[type="checkbox"]');
        if (toggles.length >= 3) {
            toggles[0].checked = user.profileVisible !== false;
            toggles[1].checked = user.showEmail !== false;
            toggles[2].checked = user.showOnlineStatus === true;
        }
    }
}

// Function to save user settings
function saveUserSettings(event) {
    event.preventDefault();
    
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
    localStorage.setItem('collabdUserData', JSON.stringify(userData));
    
    // Show success message
    alert('Your settings have been saved successfully!');
}

// Function to handle disconnect actions
function disconnectService(service) {
    alert(`${service} has been disconnected from your account.`);
    // In a real application, we would make API calls to disconnect the service
}

// Initialize the settings page
document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    loadUserData();
    
    // Set up form submission
    const settingsForm = document.querySelector('form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', saveUserSettings);
    }
    
    // Set up disconnect buttons
    const vscodeBtn = document.querySelector('.btn-outline[onclick*="VSCode"]');
    if (vscodeBtn) {
        vscodeBtn.onclick = function() {
            disconnectService('Visual Studio Code');
            return false;
        };
    }
    
    const githubBtn = document.querySelector('.btn-outline[onclick*="GitHub"]');
    if (githubBtn) {
        githubBtn.onclick = function() {
            disconnectService('GitHub');
            return false;
        };
    }
    
    const discordBtn = document.querySelector('.btn-outline[onclick*="Discord"]');
    if (discordBtn) {
        discordBtn.onclick = function() {
            disconnectService('Discord');
            return false;
        };
    }
});