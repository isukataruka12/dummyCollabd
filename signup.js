// Signup functionality script

// Function to handle form submission
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
    
    // In a real application, we would send this data to a server
    // For this demo, we'll save it to localStorage
    const userData = {
        fullName: fullName,
        email: email,
        username: email.split('@')[0], // Generate a username from email
        bio: '',
        location: '',
        github: '',
        discord: '',
        profileVisible: true,
        showEmail: true,
        showOnlineStatus: false
    };
    
    // Save user data to localStorage
    localStorage.setItem('collabdUserData', JSON.stringify(userData));
    
    // Show success message
    alert('Account created successfully! Redirecting to login page...');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Initialize the signup form
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});