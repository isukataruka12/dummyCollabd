// // Main JavaScript for Collabd platform

// // Function to check login status and update UI accordingly
// function checkLoginStatus() {
//     const isLoggedIn = localStorage.getItem('collabdLoggedIn') === 'true';
//     const userData = localStorage.getItem('collabdUserData');
//     const user = userData ? JSON.parse(userData) : null;
    
//     // Get navigation elements
//     const navLinks = document.querySelector('.nav-links');
//     if (!navLinks) return;
    
//     // Get login and signup links
//     const loginLink = Array.from(navLinks.querySelectorAll('a')).find(link => 
//         link.textContent.trim().toLowerCase() === 'login'
//     );
    
//     const signupLink = Array.from(navLinks.querySelectorAll('a')).find(link => 
//         link.textContent.trim().toLowerCase() === 'sign up'
//     );
    
//     if (isLoggedIn && user) {
//         // User is logged in, update UI
        
//         // Replace login/signup links with user profile if they exist
//         if (loginLink && loginLink.parentNode) {
//             const userProfileItem = document.createElement('li');
//             const userProfileLink = document.createElement('a');
//             userProfileLink.href = 'settings.html';
//             userProfileLink.textContent = user.fullName || 'My Profile';
//             userProfileItem.appendChild(userProfileLink);
            
//             loginLink.parentNode.parentNode.replaceChild(userProfileItem, loginLink.parentNode);
//         }
        
//         if (signupLink && signupLink.parentNode) {
//             const logoutItem = document.createElement('li');
//             const logoutLink = document.createElement('a');
//             logoutLink.href = '#';
//             logoutLink.textContent = 'Logout';
//             logoutLink.onclick = function() {
//                 handleLogout();
//                 return false;
//             };
//             logoutItem.appendChild(logoutLink);
            
//             signupLink.parentNode.parentNode.replaceChild(logoutItem, signupLink.parentNode);
//         }
//     }
// }

// // Function to handle logout
// function handleLogout() {
//     // Clear logged in status
//     localStorage.setItem('collabdLoggedIn', 'false');
    
//     // Show logout message
//     alert('You have been logged out successfully.');
    
//     // Redirect to home page
//     window.location.href = 'index.html';
// }

// // Initialize on all pages
// document.addEventListener('DOMContentLoaded', function() {
//     // Check login status and update UI
//     checkLoginStatus();
// });






// Main JavaScript for Collabd platform with Firebase Auth

import { auth, onAuthStateChanged, signOut, database, ref, get, child } from './firebase-config.js';

// Function to update UI based on authentication state
async function updateUIOnAuthStateChanged(user) {
    // Get navigation elements
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    
    // Get login and signup links
    const loginLink = Array.from(navLinks.querySelectorAll('a')).find(link => 
        link.textContent.trim().toLowerCase() === 'login'
    );
    
    const signupLink = Array.from(navLinks.querySelectorAll('a')).find(link => 
        link.textContent.trim().toLowerCase() === 'sign up'
    );
    
    if (user) {
        // User is logged in
        console.log('User is logged in:', user.uid);
        
        try {
            // Get user data from the database
            const dbRef = ref(database);
            const snapshot = await get(child(dbRef, `users/${user.uid}`));
            
            if (snapshot.exists()) {
                const userData = snapshot.val();
                
                // Store user data in localStorage for easy access across pages
                localStorage.setItem('collabdUserData', JSON.stringify(userData));
                localStorage.setItem('collabdLoggedIn', 'true');
                
                // Replace login/signup links with user profile if they exist
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
            } else {
                console.log('No user data found');
                // Handle case where user is authenticated but no profile data exists
                // This could happen if database write failed during signup
                localStorage.removeItem('collabdUserData');
                localStorage.setItem('collabdLoggedIn', 'false');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    } else {
        // User is not logged in
        console.log('User is not logged in');
        localStorage.removeItem('collabdUserData');
        localStorage.setItem('collabdLoggedIn', 'false');
        
        // Restore original login/signup links if they're not there
        // This helps when logging out on the same page
        window.location.reload();
    }
}

// Function to handle logout
async function handleLogout() {
    try {
        // Sign out from Firebase
        await signOut(auth);
        
        // Clear local storage
        localStorage.removeItem('collabdUserData');
        localStorage.setItem('collabdLoggedIn', 'false');
        
        // Show logout message
        alert('You have been logged out successfully.');
        
        // Redirect to home page
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error signing out:', error);
        alert('An error occurred while signing out. Please try again.');
    }
}

// Initialize on all pages
document.addEventListener('DOMContentLoaded', function() {
    // Set up authentication state observer
    onAuthStateChanged(auth, updateUIOnAuthStateChanged);
});

// Export the function for HTML onclick attribute
window.handleLogout = handleLogout;