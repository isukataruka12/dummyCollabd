// vscode-integration.js
class VSCodeIntegration {
    constructor() {
      this.container = null;
      this.connected = localStorage.getItem('vsCodeConnected') === 'true';
      this.activeFile = null;
      this.currentRepo = null;
    }
    
    init(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
      
      this.renderInitialUI();
      if (this.connected) {
        this.showEditor();
      }
    }
    
    renderInitialUI() {
      this.container.innerHTML = `
        <div class="vscode-section">
          <div class="section-header">
            <h2><i class="fas fa-code"></i> VS Code Integration</h2>
          </div>
          <div id="vscode-content" class="section-content">
            ${this.connected ? 
              '<div class="loading">Loading editor...</div>' : 
              `
              <div class="auth-required">
                <p>Connect VS Code to edit your code directly in the browser.</p>
                <button id="vscode-connect" class="btn">Connect VS Code</button>
              </div>
              `
            }
          </div>
        </div>
      `;
      
      if (!this.connected) {
        document.getElementById('vscode-connect').addEventListener('click', () => this.connectVSCode());
      }
    }
    
    connectVSCode() {
      // In a real implementation, you would use VS Code's extension API
      // For demo purposes, simulate connection
      this.connected = true;
      localStorage.setItem('vsCodeConnected', 'true');
      
      alert('VS Code connected successfully!');
      this.showEditor();
    }
    
    showEditor(file = null) {
      this.activeFile = file || this.activeFile || {
        name: 'App.js',
        path: '/src/App.js',
        content: `import React from 'react';
  import './App.css';
  
  function App() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to Collabd</h1>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header>
      </div>
    );
  }
  
  export default App;`
      };
      
      const contentContainer = document.getElementById('vscode-content');
      
      contentContainer.innerHTML = `
        <div class="vscode-editor">
          <div class="editor-sidebar">
            <div class="sidebar-header">
              <h3>${this.currentRepo || 'My Project'}</h3>
            </div>
            <div class="file-explorer">
              <div class="folder">
                <div class="folder-name"><i class="fas fa-folder-open"></i> src</div>
                <div class="folder-content">
                  <div class="file ${this.activeFile.name === 'App.js' ? 'active' : ''}" data-file="App.js">
                    <i class="fab fa-react"></i> App.js
                  </div>
                  <div class="file ${this.activeFile.name === 'App.css' ? 'active' : ''}" data-file="App.css">
                    <i class="fas fa-file-code"></i> App.css
                  </div>
                  <div class="file ${this.activeFile.name === 'index.js' ? 'active' : ''}" data-file="index.js">
                    <i class="fab fa-js"></i> index.js
                  </div>
                </div>
              </div>
              <div class="folder">
                <div class="folder-name"><i class="fas fa-folder"></i> public</div>
              </div>
              <div class="file ${this.activeFile.name === 'package.json' ? 'active' : ''}" data-file="package.json">
                <i class="fas fa-file-code"></i> package.json
              </div>
              <div class="file ${this.activeFile.name === 'README.md' ? 'active' : ''}" data-file="README.md">
                <i class="fas fa-file-alt"></i> README.md
              </div>
            </div>
          </div>
          <div class="editor-main">
            <div class="editor-tabs">
              <div class="tab active">
                <span>${this.activeFile.name}</span>
                <button class="close-tab">&times;</button>
              </div>
              <div class="new-tab">+</div>
            </div>
            <div class="editor-area">
              <pre id="code-editor" class="code-editor" contenteditable="true">${this.escapeHtml(this.activeFile.content)}</pre>
            </div>
          </div>
        </div>
      `;
      
      // Set up event listeners
      document.querySelectorAll('.file').forEach(fileEl => {
        fileEl.addEventListener('click', (e) => {
          const fileName = e.target.getAttribute('data-file');
          if (fileName) {
            this.openFile(fileName);
          }
        });
      });
      
      // In a real implementation, you would initialize Monaco Editor here
      this.setupSimpleCodeEditor();
    }
    
    setupSimpleCodeEditor() {
      const codeEditor = document.getElementById('code-editor');
      if (!codeEditor) return;
      
      // Add simple syntax highlighting (very basic)
      codeEditor.addEventListener('input', () => {
        const content = codeEditor.innerText;
        this.activeFile.content = content;
        
        // Apply basic syntax highlighting
        const highlighted = this.highlightSyntax(content);
        
        // Preserve cursor position
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const cursorPosition = range.startOffset;
        
        codeEditor.innerHTML = highlighted;
        
        // Restore cursor position
        if (codeEditor.firstChild) {
          const newRange = document.createRange();
          newRange.setStart(codeEditor.firstChild, Math.min(cursorPosition, codeEditor.firstChild.length));
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      });
    }
    
    highlightSyntax(code) {
      // Very basic syntax highlighting for demo purposes
      return code
        .replace(/\b(import|export|from|function|return|const|let|var|if|else|for|while)\b/g, '<span style="color: #c586c0;">$1</span>')
        .replace(/\b(React)\b/g, '<span style="color: #4ec9b0;">$1</span>')
        .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span style="color: #ce9178;">$&</span>')
        .replace(/(&lt;[^&]*&gt;)/g, '<span style="color: #569cd6;">$1</span>');
    }
    
    openFile(fileName) {
      // In a real implementation, fetch file content from server/API
      // For demo, simulate different file contents
      const files = {
        'App.js': `import React from 'react';
  import './App.css';
  
  function App() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to Collabd</h1>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header>
      </div>
    );
  }
  
  export default App;`,
        'App.css': `.App {
    text-align: center;
  }
  
  .App-header {
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
  }`,
        'index.js': `import React from 'react';
  import ReactDOM from 'react-dom';
  import './index.css';
  import App from './App';
  
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );`,
        'package.json': `{
    "name": "collabd-app",
    "version": "0.1.0",
    "private": true,
    "dependencies": {
      "react": "^17.0.2",
      "react-dom": "^17.0.2",
      "react-scripts": "4.0.3"
    },
    "scripts": {
      "start": "react-scripts start",
      "build": "react-scripts build",
      "test": "react-scripts test",
      "eject": "react-scripts eject"
    }
  }`,
        'README.md': `# Collabd App
  
  This project was created with Collabd, combining GitHub, VS Code, and Discord.
  
  ## Available Scripts
  
  In the project directory, you can run:
  
  ### \`npm start\`
  
  Runs the app in the development mode.
  Open [http://localhost:3000](http://localhost:3000) to view it in the browser.`
      };
      
      this.activeFile = {
        name: fileName,
        path: fileName.includes('.') ? `/${fileName}` : `/src/${fileName}`,
        content: files[fileName] || `// ${fileName} content goes here`
      };
      
      this.showEditor();
    }
    
    openRepository(repoName) {
      this.currentRepo = repoName;
      
      // In a real implementation, fetch repo files from GitHub API
      // For demo, use default files
      this.activeFile = {
        name: 'App.js',
        path: '/src/App.js',
        content: `import React from 'react';
  import './App.css';
  
  // Repository: ${repoName}
  function App() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to ${repoName}</h1>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header>
      </div>
    );
  }
  
  export default App;`
      };
      
      this.showEditor();
      
      // Ensure VS Code section is visible
      const vsCodeSection = document.getElementById('vscode-container');
      if (vsCodeSection) {
        vsCodeSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  }
  
  // Initialize VS Code integration
  document.addEventListener('DOMContentLoaded', function() {
    window.vsCodeIntegration = new VSCodeIntegration();
    window.vsCodeIntegration.init('vscode-container');
  });