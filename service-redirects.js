// service-redirects.js - Handle redirects to VSCode and Discord

// Configuration for external service URLs
const SERVICE_URLS = {
    vscode: {
        // VS Code online URL
        online: 'https://vscode.dev/',
        // VS Code desktop protocol (will prompt to open VS Code desktop if installed)
        desktop: 'vscode://',
        // VS Code download page fallback
        download: 'https://code.visualstudio.com/download'
    },
    discord: {
        // Discord web app
        web: 'https://discord.com/app',
        // Discord user profile format (requires username)
        user: 'https://discord.com/users/',
        // Discord server invite format (requires invite code)
        server: 'https://discord.gg/',
        // Discord desktop protocol (will open Discord app if installed)
        desktop: 'discord://',
        // Discord download page fallback
        download: 'https://discord.com/download'
    },
    github: {
        // GitHub profile format (requires username)
        user: 'https://github.com/',
        // GitHub repository format (requires username/repo)
        repo: 'https://github.com/'
    }
};

// Check if a desktop application is installed
async function isAppInstalled(protocol) {
    try {
        // Create a hidden iframe to test if the protocol is handled
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        // Set a timeout to detect if protocol was handled
        const protocolCheck = new Promise((resolve) => {
            // Set timeout to check if app is installed
            const timeoutId = setTimeout(() => {
                resolve(false);
            }, 500);
            
            // Listen for blur event that happens when app opens
            window.addEventListener('blur', () => {
                clearTimeout(timeoutId);
                resolve(true);
            }, { once: true });
        });
        
        // Try to navigate to the protocol in the iframe
        iframe.contentWindow.location.href = protocol;
        
        // Check if the protocol was handled
        const result = await protocolCheck;
        
        // Clean up iframe
        document.body.removeChild(iframe);
        
        return result;
    } catch (error) {
        console.error('Error checking if app is installed:', error);
        return false;
    }
}

// Redirect to VSCode (tries desktop app first, falls back to web)
async function redirectToVSCode(project = null) {
    try {
        // Get current user data
        const userData = JSON.parse(localStorage.getItem('collabdUserData') || '{}');
        
        // Check if VS Code desktop app is installed
        const isDesktopAppInstalled = await isAppInstalled(SERVICE_URLS.vscode.desktop);
        
        if (isDesktopAppInstalled) {
            // If we have a project, try to open it in VS Code
            if (project) {
                window.location.href = `${SERVICE_URLS.vscode.desktop}${encodeURIComponent(project)}`;
            } else {
                window.location.href = SERVICE_URLS.vscode.desktop;
            }
        } else {
            // Fall back to VS Code web
            if (project) {
                window.open(`${SERVICE_URLS.vscode.online}#${encodeURIComponent(project)}`, '_blank');
            } else {
                window.open(SERVICE_URLS.vscode.online, '_blank');
            }
        }
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('vscode-redirect', {
            detail: { project: project }
        }));
        
        return true;
    } catch (error) {
        console.error('Error redirecting to VS Code:', error);
        
        // Fall back to VS Code online
        window.open(SERVICE_URLS.vscode.online, '_blank');
        return false;
    }
}

// Redirect to Discord (tries desktop app first, falls back to web)
async function redirectToDiscord(server = null, channel = null) {
    try {
        // Get current user data and connections
        const userData = JSON.parse(localStorage.getItem('collabdUserData') || '{}');
        const connections = JSON.parse(localStorage.getItem('serviceConnections') || '{}');
        
        // If no Discord connection, redirect to Discord download page
        if (!userData.discord && (!connections.discord || !connections.discord.connected)) {
            window.open(SERVICE_URLS.discord.download, '_blank');
            return false;
        }
        
        // Check if Discord desktop app is installed
        const isDesktopAppInstalled = await isAppInstalled(SERVICE_URLS.discord.desktop);
        
        if (isDesktopAppInstalled) {
            // If we have a server and channel, try to open it in Discord
            if (server && channel) {
                window.location.href = `${SERVICE_URLS.discord.desktop}/channels/${encodeURIComponent(server)}/${encodeURIComponent(channel)}`;
            } else if (server) {
                window.location.href = `${SERVICE_URLS.discord.desktop}/channels/${encodeURIComponent(server)}`;
            } else {
                window.location.href = SERVICE_URLS.discord.desktop;
            }
        } else {
            // Fall back to Discord web app
            if (server && channel) {
                window.open(`${SERVICE_URLS.discord.web}/channels/${encodeURIComponent(server)}/${encodeURIComponent(channel)}`, '_blank');
            } else if (server) {
                window.open(`${SERVICE_URLS.discord.web}/channels/${encodeURIComponent(server)}`, '_blank');
            } else {
                window.open(SERVICE_URLS.discord.web, '_blank');
            }
        }
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('discord-redirect', {
            detail: { server: server, channel: channel }
        }));
        
        return true;
    } catch (error) {
        console.error('Error redirecting to Discord:', error);
        
        // Fall back to Discord web app
        window.open(SERVICE_URLS.discord.web, '_blank');
        return false;
    }
}

// Redirect to Github profile or repo
function redirectToGitHub(username = null, repo = null) {
    try {
        // Get current user data and connections
        const userData = JSON.parse(localStorage.getItem('collabdUserData') || '{}');
        const connections = JSON.parse(localStorage.getItem('serviceConnections') || '{}');
        
        // Determine GitHub username to use
        let githubUsername = username;
        
        if (!githubUsername) {
            // Try to get username from connections or user data
            githubUsername = connections.github?.username || userData.github || userData.github_username;
            
            // If still no username, redirect to GitHub home
            if (!githubUsername) {
                window.open('https://github.com', '_blank');
                return false;
            }
        }
        
        // Redirect to repo if provided
        if (repo) {
            window.open(`${SERVICE_URLS.github.repo}${encodeURIComponent(githubUsername)}/${encodeURIComponent(repo)}`, '_blank');
        } else {
            // Otherwise redirect to user profile
            window.open(`${SERVICE_URLS.github.user}${encodeURIComponent(githubUsername)}`, '_blank');
        }
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('github-redirect', {
            detail: { username: githubUsername, repo: repo }
        }));
        
        return true;
    } catch (error) {
        console.error('Error redirecting to GitHub:', error);
        
        // Fall back to GitHub home
        window.open('https://github.com', '_blank');
        return false;
    }
}

// Initialize service redirects
document.addEventListener('DOMContentLoaded', function() {
    // Find all VSCode-related elements in the workspace
    const vsCodeElements = document.querySelectorAll('.workspace-nav-item[data-view="vscode"], .vscode-item, [data-service="vscode"]');
    
    vsCodeElements.forEach(element => {
        element.addEventListener('click', function(e) {
            // Let links with explicit href attribute work normally
            if (e.target.tagName === 'A' && e.target.getAttribute('href') && !e.target.getAttribute('href').startsWith('#')) {
                return;
            }
            
            // Prevent default action
            e.preventDefault();
            
            // Get project info if available
            const projectName = element.getAttribute('data-project') || 
                document.querySelector('.workspace-projects ul li a.active')?.textContent;
            
            // Redirect to VSCode
            redirectToVSCode(projectName);
        });
    });
    
    // Find all Discord-related elements in the workspace
    const discordElements = document.querySelectorAll('.workspace-nav-item[data-view="discord"], .discord-item, [data-service="discord"]');
    
    discordElements.forEach(element => {
        element.addEventListener('click', function(e) {
            // Let links with explicit href attribute work normally
            if (e.target.tagName === 'A' && e.target.getAttribute('href') && !e.target.getAttribute('href').startsWith('#')) {
                return;
            }
            
            // Prevent default action
            e.preventDefault();
            
            // Get server and channel info if available
            const server = element.getAttribute('data-server') || 'Collabd';
            const channel = element.getAttribute('data-channel');
            
            // Redirect to Discord
            redirectToDiscord(server, channel);
        });
    });
    
    // Find all GitHub-related elements in the workspace
    const githubElements = document.querySelectorAll('.workspace-nav-item[data-view="github"], .github-item, [data-service="github"]');
    
    githubElements.forEach(element => {
        element.addEventListener('click', function(e) {
            // Let links with explicit href attribute work normally
            if (e.target.tagName === 'A' && e.target.getAttribute('href') && !e.target.getAttribute('href').startsWith('#')) {
                return;
            }
            
            // Prevent default action
            e.preventDefault();
            
            // Get username and repo info if available
            const username = element.getAttribute('data-username');
            const repo = element.getAttribute('data-repo');
            
            // Redirect to GitHub
            redirectToGitHub(username, repo);
        });
    });
    
    // Add redirect hooks to service buttons in settings
    setupSettingsRedirectButtons();
});

// Set up redirect buttons in settings page
function setupSettingsRedirectButtons() {
    // Add open app buttons next to service connections
    const serviceSettings = document.querySelectorAll('.integration-section');
    
    serviceSettings.forEach(section => {
        // Determine which service this section is for
        let serviceName = '';
        if (section.querySelector('.vscode-status')) {
            serviceName = 'vscode';
        } else if (section.querySelector('.github-status')) {
            serviceName = 'github';
        } else if (section.querySelector('.discord-status')) {
            serviceName = 'discord';
        }
        
        if (!serviceName) return;
        
        // Create a button to open the service
        const openButton = document.createElement('button');
        openButton.className = 'btn btn-small';
        openButton.textContent = `Open ${serviceName.toUpperCase()}`;
        openButton.style.marginLeft = '10px';
        
        // Add event listener
        openButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            switch (serviceName) {
                case 'vscode':
                    redirectToVSCode();
                    break;
                case 'github':
                    redirectToGitHub();
                    break;
                case 'discord':
                    redirectToDiscord();
                    break;
            }
        });
        
        // Find a good place to add the button
        const statusElement = section.querySelector(`.${serviceName}-status`);
        if (statusElement) {
            statusElement.parentNode.appendChild(openButton);
        }
    });
}