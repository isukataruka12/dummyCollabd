document.addEventListener('DOMContentLoaded', function() {
    // Get GitHub username from localStorage
    const userData = JSON.parse(localStorage.getItem('collabdUserData') || '{}');
    const githubUsername = userData.github;
    
    console.log('Found GitHub username:', githubUsername);
    
    // Find the GitHub link by its icon and text
    const githubLinks = document.querySelectorAll('a, div, li');
    
    githubLinks.forEach(function(element) {
      // Check if element contains GitHub text or icon
      const hasGitHubText = element.innerText && element.innerText.toLowerCase().includes('github');
      const hasGitHubIcon = element.innerHTML && element.innerHTML.includes('fa-github');
      const isGitHubNav = element.className && element.className.includes('github');
      
      if (hasGitHubText || hasGitHubIcon || isGitHubNav) {
        console.log('Found GitHub element:', element);
        
        // Add click event listener
        element.addEventListener('click', function(event) {
          // Only redirect if we have a GitHub username
          if (githubUsername) {
            console.log('Redirecting to GitHub profile:', githubUsername);
            
            // Prevent default action
            event.preventDefault();
            event.stopPropagation();
            
            // Open GitHub profile in new tab
            window.open('https://github.com/' + githubUsername, '_blank');
          } else {
            console.log('No GitHub username found in user data');
            alert('Please set your GitHub username in settings first');
          }
        });
        
        // Make it look clickable
        element.style.cursor = 'pointer';
      }
    });
    
    // Also look for specific GitHub navigation item shown in screenshot
    const githubNavItems = document.querySelectorAll('.workspace-nav-item, [data-view="github"]');
    githubNavItems.forEach(function(item) {
      if (item.innerText.includes('GitHub') || item.innerHTML.includes('fa-github')) {
        console.log('Found GitHub nav item:', item);
        
        item.addEventListener('click', function(event) {
          if (githubUsername) {
            console.log('Redirecting to GitHub profile from nav item:', githubUsername);
            
            // Prevent default action
            event.preventDefault();
            event.stopPropagation();
            
            // Open GitHub profile in new tab
            window.open('https://github.com/' + githubUsername, '_blank');
          } else {
            console.log('No GitHub username found in user data');
            alert('Please set your GitHub username in settings first');
          }
        });
        
        // Make it look clickable
        item.style.cursor = 'pointer';
      }
    });
  });