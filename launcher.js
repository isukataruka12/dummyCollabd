// launcher.js - Handles launching of VSCode, Discord, and GitHub from the workspace

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the launcher
    initLauncher();
});

function initLauncher() {
    // Create launchers in the workspace
    createLaunchers();
    
    // Set up event listeners for workspace items
    setupWorkspaceListeners();
    
    // Initialize context menu for project items
    initProjectContextMenu();
}

function createLaunchers() {
    // Check if we're on the workspace page
    const workspaceContainer = document.querySelector('.workspace-container');
    if (!workspaceContainer) return;
    
    // Create the launcher container if it doesn't exist
    let launcherContainer = document.querySelector('.service-launchers');
    
    if (!launcherContainer) {
        launcherContainer = document.createElement('div');
        launcherContainer.className = 'service-launchers';
        
        // Add launcher buttons
        launcherContainer.innerHTML = `
            <div class="launcher-title">Quick Launch</div>
            <div class="launcher-buttons">
                <button id="launch-vscode" class="launcher-btn vscode-launcher" title="Open in VS Code">
                    <i class="fas fa-code"></i>
                    <span>VS Code</span>
                </button>
                <button id="launch-github" class="launcher-btn github-launcher" title="Open in GitHub">
                    <i class="fab fa-github"></i>
                    <span>GitHub</span>
                </button>
                <button id="launch-discord" class="launcher-btn discord-launcher" title="Open in Discord">
                    <i class="fab fa-discord"></i>
                    <span>Discord</span>
                </button>
            </div>
        `;
        
        // Add styles for the launcher
        const style = document.createElement('style');
        style.textContent = `
            .service-launchers {
                position: fixed;
                bottom: 20px;
                left: 20px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 10px;
                z-index: 1000;
                transition: transform 0.3s ease;
            }
            
            .service-launchers:hover {
                transform: translateY(-5px);
            }
            
            .launcher-title {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 10px;
                text-align: center;
                color: #333;
            }
            
            .launcher-buttons {
                display: flex;
                gap: 10px;
            }
            
            .launcher-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: #f5f5f5;
                border: none;
                border-radius: 8px;
                padding: 10px;
                cursor: pointer;
                transition: all 0.2s ease;
                width: 70px;
                height: 70px;
            }
            
            .launcher-btn i {
                font-size: 24px;
                margin-bottom: 5px;
            }
            
            .launcher-btn span {
                font-size: 12px;
            }
            
            .vscode-launcher {
                background-color: #007acc;
                color: white;
            }
            
            .vscode-launcher:hover {
                background-color: #0062a3;
            }
            
            .github-launcher {
                background-color: #24292e;
                color: white;
            }
            
            .github-launcher:hover {
                background-color: #1b1f23;
            }
            
            .discord-launcher {
                background-color: #7289da;
                color: white;
            }
            
            .discord-launcher:hover {
                background-color: #5b73c7;
            }
            
            /* Context menu styles */
            .project-context-menu {
                position: absolute;
                background-color: white;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 5px 0;
                z-index: 1001;
                display: none;
            }
            
            .project-context-menu.show {
                display: block;
            }
            
            .context-menu-item {
                padding: 8px 15px;
                cursor: pointer;
                transition: background-color 0.2s;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .context-menu-item:hover {
                background-color: #f5f5f5;
            }
            
            .context-menu-item i {
                width: 20px;
                text-align: center;
            }
        `;
        
        document.head.appendChild(style);
        
        // Add to workspace container
        workspaceContainer.appendChild(launcherContainer);
        
        // Setup event listeners for launcher buttons
        document.getElementById('launch-vscode').addEventListener('click', function() {
            // Get active project if any
            const activeProject = document.querySelector('.workspace-projects ul li a.active');
            const projectName = activeProject ? activeProject.textContent : null;
            
            redirectToVSCode(projectName);
        });
        
        document.getElementById('launch-github').addEventListener('click', function() {
            redirectToGitHub();
        });
        
        document.getElementById('launch-discord').addEventListener('click', function() {
            redirectToDiscord('Collabd');
        });
    }
}

function setupWorkspaceListeners() {
    // Add right-click context menu to project items
    const projectItems = document.querySelectorAll('.workspace-projects ul li a');
    
    projectItems.forEach(item => {
        item.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            
            // Get project name
            const projectName = this.textContent;
            
            // Show context menu
            showProjectContextMenu(e.pageX, e.pageY, projectName);
        });
    });
    
    // Close context menu when clicking elsewhere
    document.addEventListener('click', function() {
        hideProjectContextMenu();
    });
}

function initProjectContextMenu() {
    // Create context menu if it doesn't exist
    let contextMenu = document.querySelector('.project-context-menu');
    
    if (!contextMenu) {
        contextMenu = document.createElement('div');
        contextMenu.className = 'project-context-menu';
        
        // Add menu items
        contextMenu.innerHTML = `
            <div class="context-menu-item" id="open-vscode-context">
                <i class="fas fa-code"></i> Open in VS Code
            </div>
            <div class="context-menu-item" id="open-github-context">
                <i class="fab fa-github"></i> View on GitHub
            </div>
            <div class="context-menu-item" id="open-discord-context">
                <i class="fab fa-discord"></i> Discuss on Discord
            </div>
        `;
        
        // Add to body
        document.body.appendChild(contextMenu);
    }
}

function showProjectContextMenu(x, y, projectName) {
    // Get the context menu
    const contextMenu = document.querySelector('.project-context-menu');
    if (!contextMenu) return;
    
    // Position the menu
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    
    // Show the menu
    contextMenu.classList.add('show');
    
    // Set data attribute for project name
    contextMenu.setAttribute('data-project', projectName);
    
    // Set up event listeners for menu items
    document.getElementById('open-vscode-context').onclick = function(e) {
        e.stopPropagation();
        redirectToVSCode(projectName);
        hideProjectContextMenu();
    };
    
    document.getElementById('open-github-context').onclick = function(e) {
        e.stopPropagation();
        redirectToGitHub(null, projectName);
        hideProjectContextMenu();
    };
    
    document.getElementById('open-discord-context').onclick = function(e) {
        e.stopPropagation();
        // Redirect to project-specific channel if available
        redirectToDiscord('Collabd', projectName.toLowerCase().replace(/\s+/g, '-'));
        hideProjectContextMenu();
    };
}

function hideProjectContextMenu() {
    // Hide the context menu
    const contextMenu = document.querySelector('.project-context-menu');
    if (contextMenu) {
        contextMenu.classList.remove('show');
    }
}

// Add floating app launcher to all pages
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're not on the workspace page (already has launchers)
    if (!document.querySelector('.workspace-container')) {
        // Create mini launcher
        const miniLauncher = document.createElement('div');
        miniLauncher.className = 'mini-launcher';
        
        // Add buttons
        miniLauncher.innerHTML = `
            <button class="mini-launcher-btn vscode-launcher" title="Open VS Code">
                <i class="fas fa-code"></i>
            </button>
            <button class="mini-launcher-btn github-launcher" title="Open GitHub">
                <i class="fab fa-github"></i>
            </button>
            <button class="mini-launcher-btn discord-launcher" title="Open Discord">
                <i class="fab fa-discord"></i>
            </button>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .mini-launcher {
                position: fixed;
                bottom: 20px;
                right: 20px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                z-index: 1000;
            }
            
            .mini-launcher-btn {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .mini-launcher-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
            }
            
            .mini-launcher-btn i {
                font-size: 20px;
            }
            
            .mini-launcher .vscode-launcher {
                background-color: #007acc;
                color: white;
            }
            
            .mini-launcher .github-launcher {
                background-color: #24292e;
                color: white;
            }
            
            .mini-launcher .discord-launcher {
                background-color: #7289da;
                color: white;
            }
        `;
        
        document.head.appendChild(style);
        
        // Add to body
        document.body.appendChild(miniLauncher);
        
        // Set up event listeners
        const vsCodeBtn = miniLauncher.querySelector('.vscode-launcher');
        const githubBtn = miniLauncher.querySelector('.github-launcher');
        const discordBtn = miniLauncher.querySelector('.discord-launcher');
        
        vsCodeBtn.addEventListener('click', function() {
            redirectToVSCode();
        });
        
        githubBtn.addEventListener('click', function() {
            redirectToGitHub();
        });
        
        discordBtn.addEventListener('click', function() {
            redirectToDiscord();
        });
    }
});