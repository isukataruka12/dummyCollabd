// user-profile.js - Handles user profile data across all pages

// User profile management
const UserProfile = {
    // Get current user profile from localStorage
    getCurrentUser: function() {
        const userData = localStorage.getItem('collabdUserData');
        if (userData) {
            return JSON.parse(userData);
        }
        return null;
    },
    
    // Save user profile to localStorage
    saveUserData: function(userData) {
        localStorage.setItem('collabdUserData', JSON.stringify(userData));
        
        // Dispatch event to notify all pages of the update
        const event = new CustomEvent('user-profile-updated', { detail: userData });
        window.dispatchEvent(event);
        
        return userData;
    },
    
    // Update specific user properties
    updateUser: function(properties) {
        const currentUser = this.getCurrentUser() || {};
        const updatedUser = { ...currentUser, ...properties };
        this.saveUserData(updatedUser);
        return updatedUser;
    },
    
    // Check if user is logged in
    isLoggedIn: function() {
        return !!this.getCurrentUser();
    },
    
    // Generate a consistent avatar URL based on username or use custom uploaded image
    getProfileImageUrl: function() {
        const user = this.getCurrentUser();
        if (!user) return 'https://i.pravatar.cc/150?img=5'; // Default avatar
        
        // If user has uploaded a custom profile image
        if (user.profileImage) {
            return user.profileImage;
        }
        
        // Generate consistent avatar based on username
        const hash = user.username ? user.username.charCodeAt(0) % 70 || 5 : 5;
        return `https://i.pravatar.cc/150?img=${hash}`;
    },
    
    // Upload and save profile image
    saveProfileImage: function(imageDataUrl) {
        const user = this.getCurrentUser();
        if (!user) return false;
        
        // Save image data URL to user profile
        user.profileImage = imageDataUrl;
        this.saveUserData(user);
        
        // Update all profile images on the page
        this.updateProfileImagesInDOM();
        
        return true;
    },
    
    // Update all profile images in the current page
    updateProfileImagesInDOM: function() {
        const profileImgUrl = this.getProfileImageUrl();
        
        // Update all profile image elements
        const profileImgElements = document.querySelectorAll('.profile-pic');
        profileImgElements.forEach(img => {
            img.src = profileImgUrl;
        });
    },
    
    // Initialize profile data in the current page
    initProfileData: function() {
        const user = this.getCurrentUser();
        if (!user) return;
        
        // Update profile images
        this.updateProfileImagesInDOM();
        
        // Update username displays
        const usernameElements = document.querySelectorAll('.user-profile span, #sidebar-username, #nav-username');
        usernameElements.forEach(elem => {
            if (elem) elem.textContent = user.username || 'User';
        });
        
        // Update email if present
        const emailElements = document.querySelectorAll('#sidebar-email');
        emailElements.forEach(elem => {
            if (elem) elem.textContent = user.email || 'user@example.com';
        });
        
        // If on settings page, populate form fields
        if (document.getElementById('fullname')) {
            document.getElementById('fullname').value = user.fullName || '';
            document.getElementById('username').value = user.username || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('bio').value = user.bio || '';
            document.getElementById('location').value = user.location || '';
            document.getElementById('github').value = user.github || '';
            document.getElementById('discord').value = user.discord || '';
            
            // Set toggle switches if available
            const profileVisibilityToggle = document.getElementById('profile-visibility');
            if (profileVisibilityToggle) {
                profileVisibilityToggle.checked = user.profileVisible !== false;
            }
            
            const emailVisibilityToggle = document.getElementById('email-visibility');
            if (emailVisibilityToggle) {
                emailVisibilityToggle.checked = user.showEmail !== false;
            }
            
            const onlineStatusToggle = document.getElementById('online-status');
            if (onlineStatusToggle) {
                onlineStatusToggle.checked = user.showOnlineStatus === true;
            }
        }
    }
};

// Service integrations management
const ServiceIntegration = {
    // Connect a service
    connectService: function(service, username) {
        // Get current connection statuses
        const connections = JSON.parse(localStorage.getItem('serviceConnections') || '{}');
        
        // Update connection status
        connections[service.toLowerCase()] = {
            connected: true,
            username: username,
            connectedAt: new Date().toISOString()
        };
        
        // Save updated connections
        localStorage.setItem('serviceConnections', JSON.stringify(connections));
        
        // Update user data with service username
        if (service.toLowerCase() === 'github' || service.toLowerCase() === 'discord') {
            const userData = UserProfile.getCurrentUser() || {};
            userData[service.toLowerCase()] = username;
            UserProfile.saveUserData(userData);
        }
        
        return connections[service.toLowerCase()];
    },
    
    // Disconnect a service
    disconnectService: function(service) {
        // Get current connection statuses
        const connections = JSON.parse(localStorage.getItem('serviceConnections') || '{}');
        
        // Update connection status
        if (connections[service.toLowerCase()]) {
            connections[service.toLowerCase()].connected = false;
            connections[service.toLowerCase()].disconnectedAt = new Date().toISOString();
        }
        
        // Save updated connections
        localStorage.setItem('serviceConnections', JSON.stringify(connections));
        
        return connections;
    },
    
    // Check if a service is connected
    isServiceConnected: function(service) {
        const connections = JSON.parse(localStorage.getItem('serviceConnections') || '{}');
        return connections[service.toLowerCase()]?.connected === true;
    },
    
    // Get all service connections
    getAllConnections: function() {
        return JSON.parse(localStorage.getItem('serviceConnections') || '{}');
    }
};

// Profile image upload handler
function setupProfileImageUpload() {
    const changePhotoBtns = document.querySelectorAll('.change-photo-btn');
    
    changePhotoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showProfileImageUploadModal();
        });
    });
}

// Show profile image upload modal
function showProfileImageUploadModal() {
    // Create modal if it doesn't exist
    if (!document.getElementById('profile-upload-modal')) {
        const modal = document.createElement('div');
        modal.id = 'profile-upload-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Update Profile Picture</h2>
                <div class="upload-options">
                    <div class="upload-option">
                        <button id="camera-upload" class="btn">
                            <i class="fas fa-camera"></i> Take Photo
                        </button>
                    </div>
                    <div class="upload-option">
                        <button id="file-upload-btn" class="btn">
                            <i class="fas fa-file-upload"></i> Upload File
                        </button>
                        <input type="file" id="file-upload" accept="image/*" style="display: none;">
                    </div>
                </div>
                <div class="preview-container" style="display: none;">
                    <div class="preview-wrapper">
                        <img id="preview-image" src="" alt="Preview">
                    </div>
                    <div class="preview-actions">
                        <button id="cancel-upload" class="btn btn-outline">Cancel</button>
                        <button id="save-profile-image" class="btn btn-primary">Save</button>
                    </div>
                </div>
                <div id="camera-container" style="display: none;">
                    <video id="camera-preview" autoplay playsinline></video>
                    <div class="camera-actions">
                        <button id="take-photo" class="btn btn-primary">
                            <i class="fas fa-camera"></i> Capture
                        </button>
                        <button id="cancel-camera" class="btn btn-outline">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add modal styles if not already in the document
        if (!document.getElementById('modal-styles')) {
            const style = document.createElement('style');
            style.id = 'modal-styles';
            style.textContent = `
                .modal {
                    display: none;
                    position: fixed;
                    z-index: 1000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    align-items: center;
                    justify-content: center;
                }
                
                .modal-content {
                    background-color: #fff;
                    border-radius: 8px;
                    max-width: 500px;
                    width: 100%;
                    padding: 20px;
                    position: relative;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                }
                
                .close-modal {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                }
                
                .modal h2 {
                    margin-top: 0;
                    color: #333;
                }
                
                .upload-options {
                    display: flex;
                    gap: 15px;
                    margin: 20px 0;
                }
                
                .upload-option {
                    flex: 1;
                }
                
                .upload-option .btn {
                    width: 100%;
                    padding: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                
                .preview-container {
                    margin-top: 20px;
                }
                
                .preview-wrapper {
                    width: 150px;
                    height: 150px;
                    margin: 0 auto 20px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 3px solid #f0f0f0;
                }
                
                #preview-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .preview-actions {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                }
                
                #camera-container {
                    margin-top: 20px;
                }
                
                #camera-preview {
                    width: 100%;
                    max-height: 300px;
                    background-color: #f0f0f0;
                    border-radius: 4px;
                    margin-bottom: 15px;
                }
                
                .camera-actions {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Set up event listeners for the modal
        setupProfileUploadModalEvents();
    }
    
    // Show the modal
    const modal = document.getElementById('profile-upload-modal');
    modal.style.display = 'flex';
}

// Set up event listeners for profile upload modal
function setupProfileUploadModalEvents() {
    const modal = document.getElementById('profile-upload-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const fileUploadBtn = document.getElementById('file-upload-btn');
    const fileUploadInput = document.getElementById('file-upload');
    const cameraUploadBtn = document.getElementById('camera-upload');
    const previewContainer = modal.querySelector('.preview-container');
    const previewImage = document.getElementById('preview-image');
    const cancelUploadBtn = document.getElementById('cancel-upload');
    const saveProfileImageBtn = document.getElementById('save-profile-image');
    const cameraContainer = document.getElementById('camera-container');
    const cameraPreview = document.getElementById('camera-preview');
    const takePhotoBtn = document.getElementById('take-photo');
    const cancelCameraBtn = document.getElementById('cancel-camera');
    
    let stream = null;
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        stopCameraStream();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            stopCameraStream();
        }
    });
    
    // File upload button click
    fileUploadBtn.addEventListener('click', function() {
        fileUploadInput.click();
    });
    
    // File selected
    fileUploadInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewContainer.style.display = 'block';
                cameraContainer.style.display = 'none';
                document.querySelector('.upload-options').style.display = 'none';
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Camera upload button click
    cameraUploadBtn.addEventListener('click', function() {
        startCamera();
    });
    
    // Take photo button click
    takePhotoBtn.addEventListener('click', function() {
        takePhoto();
    });
    
    // Cancel camera button click
    cancelCameraBtn.addEventListener('click', function() {
        stopCameraStream();
        cameraContainer.style.display = 'none';
        document.querySelector('.upload-options').style.display = 'flex';
    });
    
    // Cancel upload button click
    cancelUploadBtn.addEventListener('click', function() {
        previewContainer.style.display = 'none';
        document.querySelector('.upload-options').style.display = 'flex';
        fileUploadInput.value = '';
    });
    
    // Save profile image button click
    saveProfileImageBtn.addEventListener('click', function() {
        UserProfile.saveProfileImage(previewImage.src);
        modal.style.display = 'none';
    });
    
    // Start camera stream
    function startCamera() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function(mediaStream) {
                    stream = mediaStream;
                    cameraPreview.srcObject = mediaStream;
                    cameraContainer.style.display = 'block';
                    document.querySelector('.upload-options').style.display = 'none';
                })
                .catch(function(error) {
                    console.error('Error accessing camera:', error);
                    alert('Unable to access camera. Please check your camera permissions or try uploading a file instead.');
                });
        } else {
            alert('Your browser does not support camera access. Please try uploading a file instead.');
        }
    }
    
    // Stop camera stream
    function stopCameraStream() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
    }
    
    // Take photo from camera
    function takePhoto() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Set canvas dimensions to match video dimensions
        canvas.width = cameraPreview.videoWidth;
        canvas.height = cameraPreview.videoHeight;
        
        // Draw video frame to canvas
        context.drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);
        
        // Get image data URL
        const imageDataUrl = canvas.toDataURL('image/png');
        
        // Display in preview
        previewImage.src = imageDataUrl;
        previewContainer.style.display = 'block';
        cameraContainer.style.display = 'none';
        
        // Stop camera stream
        stopCameraStream();
    }
}

// Initialize user profile on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize user profile data
    UserProfile.initProfileData();
    
    // Setup profile image upload
    setupProfileImageUpload();
    
    // Listen for profile updates from other pages
    window.addEventListener('user-profile-updated', function(e) {
        UserProfile.initProfileData();
    });
    
    // Handle signup form submission if on signup page
    const signupForm = document.querySelector('.signup-form, form[onsubmit*="handleSignup"]');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data - try different possible IDs based on HTML structure
            const fullName = document.getElementById('fullname')?.value;
            const username = document.getElementById('username')?.value || fullName; // Use fullname as fallback
            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;
            const confirmPassword = document.getElementById('confirm-password')?.value;
            
            // Basic validation
            if (!fullName || !email || !password) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }
            
            // Get optional integration data
            let githubUsername = '';
            let discordUsername = '';
            let connectVSCode = false;
            
            // Try to get integration data if the fields exist
            if (document.getElementById('github-username')) {
                githubUsername = document.getElementById('github-username').value;
            }
            
            if (document.getElementById('discord-username')) {
                discordUsername = document.getElementById('discord-username').value;
            }
            
            if (document.getElementById('vscode-connect')) {
                connectVSCode = document.getElementById('vscode-connect').checked;
            }
            
            // Create user data object
            const userData = {
                fullName: fullName,
                username: username || fullName.split(' ')[0].toLowerCase(), // Generate username if not provided
                email: email,
                bio: '',
                location: '',
                github: githubUsername,
                discord: discordUsername,
                profileVisible: true,
                showEmail: true,
                showOnlineStatus: false,
                signupDate: new Date().toISOString()
            };
            
            // Save user data
            UserProfile.saveUserData(userData);
            
            // Setup service connections
            if (connectVSCode) {
                ServiceIntegration.connectService('vscode', username);
            }
            
            if (githubUsername) {
                ServiceIntegration.connectService('github', githubUsername);
            }
            
            if (discordUsername) {
                ServiceIntegration.connectService('discord', discordUsername);
            }
            
            // Show success message and redirect
            alert('Account created successfully! Redirecting to workspace...');
            setTimeout(() => {
                window.location.href = 'workspace.html';
            }, 1000);
        });
    }
    
    // Handle settings form submission if on settings page
    const settingsForm = document.querySelector('form[onsubmit*="saveUserSettings"], #settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get user data
            const fullName = document.getElementById('fullname')?.value;
            const username = document.getElementById('username')?.value;
            const email = document.getElementById('email')?.value;
            const bio = document.getElementById('bio')?.value;
            const location = document.getElementById('location')?.value;
            const github = document.getElementById('github')?.value;
            const discord = document.getElementById('discord')?.value;
            
            // Get privacy settings
            let profileVisible = true;
            let showEmail = true;
            let showOnlineStatus = false;
            
            // Try to get toggle values if they exist
            if (document.getElementById('profile-visibility')) {
                profileVisible = document.getElementById('profile-visibility').checked;
            }
            
            if (document.getElementById('email-visibility')) {
                showEmail = document.getElementById('email-visibility').checked;
            }
            
            if (document.getElementById('online-status')) {
                showOnlineStatus = document.getElementById('online-status').checked;
            }
            
            // Create updated user data
            const userData = {
                fullName: fullName,
                username: username,
                email: email,
                bio: bio || '',
                location: location || '',
                github: github || '',
                discord: discord || '',
                profileVisible: profileVisible,
                showEmail: showEmail,
                showOnlineStatus: showOnlineStatus
            };
            
            // Save updated user data
            UserProfile.saveUserData(userData);
            
            // Update service connections
            if (github) {
                ServiceIntegration.connectService('github', github);
            }
            
            if (discord) {
                ServiceIntegration.connectService('discord', discord);
            }
            
            // Show success message
            alert('Your settings have been saved successfully!');
        });
    }
    
    // Handle service connection buttons if on settings page
    const connectVSCodeBtn = document.getElementById('connect-vscode');
    if (connectVSCodeBtn) {
        connectVSCodeBtn.addEventListener('click', function() {
            const user = UserProfile.getCurrentUser();
            if (user) {
                ServiceIntegration.connectService('vscode', user.username);
                alert('VS Code connected successfully!');
                updateConnectionStatus();
            }
        });
    }
    
    const connectGitHubBtn = document.getElementById('connect-github');
    if (connectGitHubBtn) {
        connectGitHubBtn.addEventListener('click', function() {
            const githubUsername = document.getElementById('github')?.value;
            if (githubUsername) {
                ServiceIntegration.connectService('github', githubUsername);
                alert('GitHub connected successfully!');
                updateConnectionStatus();
            } else {
                alert('Please enter your GitHub username.');
            }
        });
    }
    
    const connectDiscordBtn = document.getElementById('connect-discord');
    if (connectDiscordBtn) {
        connectDiscordBtn.addEventListener('click', function() {
            const discordUsername = document.getElementById('discord')?.value;
            if (discordUsername) {
                ServiceIntegration.connectService('discord', discordUsername);
                alert('Discord connected successfully!');
                updateConnectionStatus();
            } else {
                alert('Please enter your Discord username.');
            }
        });
    }
});

// Update connection status indicators on settings page
function updateConnectionStatus() {
    const connections = ServiceIntegration.getAllConnections();
    
    ['vscode', 'github', 'discord'].forEach(service => {
        const statusElem = document.querySelector(`.${service}-status`);
        if (statusElem) {
            const isConnected = connections[service]?.connected === true;
            statusElem.textContent = isConnected ? 'Connected' : 'Not Connected';
            statusElem.className = `integration-status ${service}-status ${isConnected ? 'connected' : 'not-connected'}`;
            
            // Show/hide buttons based on connection status
            const connectBtn = document.getElementById(`connect-${service}`);
            const disconnectBtn = document.getElementById(`disconnect-${service}`);
            
            if (connectBtn) connectBtn.style.display = isConnected ? 'none' : 'inline-block';
            if (disconnectBtn) disconnectBtn.style.display = isConnected ? 'inline-block' : 'none';
        }
    });
}

// Function to handle disconnecting services
function disconnectService(serviceName) {
    ServiceIntegration.disconnectService(serviceName.toLowerCase());
    alert(`${serviceName} has been disconnected from your account.`);
    updateConnectionStatus();
}

// Handle signup function (used in inline onsubmit handlers)
function handleSignup(event) {
    event.preventDefault();
    
    // Get form data
    const fullName = document.getElementById('fullname')?.value;
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;
    
    // Basic validation
    if (!fullName || !email || !password) {
        alert('Please fill in all required fields.');
        return false;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return false;
    }
    
    // Generate username from full name
    const username = fullName.split(' ')[0].toLowerCase();
    
    // Create user data
    const userData = {
        fullName: fullName,
        username: username,
        email: email,
        bio: '',
        location: '',
        github: '',
        discord: '',
        profileVisible: true,
        showEmail: true,
        showOnlineStatus: false,
        signupDate: new Date().toISOString()
    };
    
    // Save user data
    UserProfile.saveUserData(userData);
    
    // Show success message and redirect
    alert('Account created successfully! Redirecting to workspace...');
    setTimeout(() => {
        window.location.href = 'workspace.html';
    }, 1000);
    
    return false;
}