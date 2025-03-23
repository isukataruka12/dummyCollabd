// // Login functionality script

// // Function to handle form submission
// function handleLogin(event) {
//     event.preventDefault();
    
//     // Get form values
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     const rememberMe = document.getElementById('remember')?.checked || false;
    
//     // Basic validation
//     if (!email || !password) {
//         alert('Please enter both email and password');
//         return;
//     }
    
//     // In a real application, we would verify these credentials with a server
//     // For this demo, we'll check if there's user data in localStorage
//     const userData = localStorage.getItem('collabdUserData');
    
//     if (userData) {
//         const user = JSON.parse(userData);
        
//         // Mark user as logged in
//         localStorage.setItem('collabdLoggedIn', 'true');
        
//         // Show success message
//         alert(`Welcome back, ${user.fullName}! Redirecting to the dashboard...`);
        
//         // Redirect to home page
//         window.location.href = 'index.html';
//     } else {
//         // For demo purposes, allow login even without prior signup
//         alert('Login successful! Redirecting to the dashboard...');
        
//         // Create a default user profile
//         const defaultUser = {
//             fullName: 'John Doe',
//             email: email,
//             username: email.split('@')[0],
//             bio: 'Full-stack developer with a passion for clean code and user experience. Experienced with React, Node.js, and Python.',
//             location: 'San Francisco, CA',
//             github: 'johndoe',
//             discord: 'johndoe#1234',
//             profileVisible: true,
//             showEmail: true,
//             showOnlineStatus: false
//         };
        
//         // Save default user data to localStorage
//         localStorage.setItem('collabdUserData', JSON.stringify(defaultUser));
//         localStorage.setItem('collabdLoggedIn', 'true');
        
//         // Redirect to home page
//         window.location.href = 'index.html';
//     }
// }

// // Initialize the login form
// document.addEventListener('DOMContentLoaded', function() {
//     const loginForm = document.querySelector('form');
//     if (loginForm) {
//         loginForm.addEventListener('submit', handleLogin);
//     }
// });












// Login functionality script

// Function to handle form submission
function handleLogin(event) {
    event.preventDefault();
    
    // Get form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember')?.checked || false;
    
    // Basic validation
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    // In a real application, we would verify these credentials with a server
    // For this demo, we'll check if there's user data in localStorage
    const userData = localStorage.getItem('collabdUserData');
    
    if (userData) {
        const user = JSON.parse(userData);
        
        // Mark user as logged in
        localStorage.setItem('collabdLoggedIn', 'true');
        
        // Show success message
        alert(`Welcome back, ${user.fullName}! Redirecting to the dashboard...`);
        
        // Redirect to home page
        window.location.href = 'index.html';
    } else {
        // For demo purposes, allow login even without prior signup
        alert('Login successful! Redirecting to the dashboard...');
        
        // Create a default user profile
        const defaultUser = {
            fullName: 'John Doe',
            email: email,
            username: email.split('@')[0],
            bio: 'Full-stack developer with a passion for clean code and user experience. Experienced with React, Node.js, and Python.',
            location: 'San Francisco, CA',
            github: 'johndoe',
            discord: 'johndoe#1234',
            profileVisible: true,
            showEmail: true,
            showOnlineStatus: false
        };
        
        // Save default user data to localStorage
        localStorage.setItem('collabdUserData', JSON.stringify(defaultUser));
        localStorage.setItem('collabdLoggedIn', 'true');
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
}

// Initialize the login form
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});