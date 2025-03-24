// discord-redirect.js
document.addEventListener('DOMContentLoaded', function() {
    // Get Discord username from localStorage
    const userData = JSON.parse(localStorage.getItem('collabdUserData') || '{}');
    const discordUsername = userData.discord;
    
    console.log('Found Discord username:', discordUsername);
    
    // Find the Discord link by its icon and text
    const discordLinks = document.querySelectorAll('a, div, li');
    
    discordLinks.forEach(function(element) {
        // Check if element contains Discord text or icon
        const hasDiscordText = element.innerText && element.innerText.toLowerCase().includes('discord');
        const hasDiscordIcon = element.innerHTML && element.innerHTML.includes('fa-discord');
        const isDiscordNav = element.className && element.className.includes('discord');
        
        if (hasDiscordText || hasDiscordIcon || isDiscordNav) {
            console.log('Found Discord element:', element);
            
            // Add click event listener
            element.addEventListener('click', function(event) {
                // Only redirect if we have a Discord username
                if (discordUsername) {
                    console.log('Opening Discord profile');
                    
                    // Prevent default action
                    event.preventDefault();
                    event.stopPropagation();
                    
                    // Open Discord user profile
                    window.open(`https://discord.com/users/${discordUsername}`, '_blank');
                    
                    // Attempt to open Discord desktop app (if installed)
                    try {
                        // Attempt to open Discord desktop app with user profile
                        window.location.href = `discord://users/${discordUsername}`;
                    } catch (e) {
                        console.log('Discord desktop app not available');
                    }
                } else {
                    console.log('No Discord username found in user data');
                    alert('Please set your Discord username in settings first');
                }
            });
            
            // Make it look clickable
            element.style.cursor = 'pointer';
        }
    });
    
    // Also look for specific Discord navigation item
    const discordNavItems = document.querySelectorAll('.workspace-nav-item, [data-view="discord"]');
    discordNavItems.forEach(function(item) {
        if (item.innerText.includes('Discord') || item.innerHTML.includes('fa-discord')) {
            console.log('Found Discord nav item:', item);
            
            item.addEventListener('click', function(event) {
                if (discordUsername) {
                    console.log('Opening Discord profile from nav item');
                    
                    // Prevent default action
                    event.preventDefault();
                    event.stopPropagation();
                    
                    // Open Discord user profile
                    window.open(`https://discord.com/users/${discordUsername}`, '_blank');
                    
                    // Attempt to open Discord desktop app (if installed)
                    try {
                        // Attempt to open Discord desktop app with user profile
                        window.location.href = `discord://users/${discordUsername}`;
                    } catch (e) {
                        console.log('Discord desktop app not available');
                    }
                } else {
                    console.log('No Discord username found in user data');
                    alert('Please set your Discord username in settings first');
                }
            });
            
            // Make it look clickable
            item.style.cursor = 'pointer';
        }
    });
});