class DiscordIntegration {
    constructor() {
      this.container = null;
      this.connected = localStorage.getItem('discordConnected') === 'true';
      this.currentServer = localStorage.getItem('discordServer') || 'Collabd';
      this.currentChannel = localStorage.getItem('discordChannel') || 'general';
      this.messages = JSON.parse(localStorage.getItem('discordMessages') || '[]');
      this.users = [
        { id: 1, username: 'dev_alice', avatar: 'https://i.pravatar.cc/150?img=1', status: 'online' },
        { id: 2, username: 'dev_bob', avatar: 'https://i.pravatar.cc/150?img=2', status: 'idle' },
        { id: 3, username: 'dev_charlie', avatar: 'https://i.pravatar.cc/150?img=3', status: 'dnd' },
        { id: 4, username: 'dev_dana', avatar: 'https://i.pravatar.cc/150?img=4', status: 'offline' },
        { id: 5, username: 'dev_you', avatar: 'https://i.pravatar.cc/150?img=5', status: 'online' }
      ];
      this.channels = [
        { id: 1, name: 'general', type: 'text', unread: true },
        { id: 2, name: 'development', type: 'text', unread: false },
        { id: 3, name: 'github', type: 'text', unread: true },
        { id: 4, name: 'vscode-help', type: 'text', unread: false },
        { id: 5, name: 'Voice Chat', type: 'voice', users: [1, 3] }
      ];
      this.servers = [
        { id: 1, name: 'Collabd', icon: 'C', channels: [1, 2, 3, 4, 5] },
        { id: 2, name: 'Project Alpha', icon: 'A', channels: [1, 2] }
      ];
      
      // Initialize with default messages if none exist
      if (this.messages.length === 0) {
        this.messages = [
          { id: 1, userId: 1, channelId: 1, content: 'Hey team, I just pushed a new commit to the main branch', timestamp: new Date(Date.now() - 3600000).toISOString(), reactions: [{emoji: '👍', count: 2}] },
          { id: 2, userId: 3, channelId: 1, content: 'Great! I\'ll review it soon', timestamp: new Date(Date.now() - 3400000).toISOString(), reactions: [] },
          { id: 3, userId: 2, channelId: 1, content: 'I\'m working on the new feature, should be ready by tomorrow', timestamp: new Date(Date.now() - 2800000).toISOString(), reactions: [{emoji: '🚀', count: 1}] },
          { id: 4, userId: 1, channelId: 1, content: 'Just created issue #42: Fix navigation responsiveness', timestamp: new Date(Date.now() - 1600000).toISOString(), reactions: [], githubLink: true }
        ];
        localStorage.setItem('discordMessages', JSON.stringify(this.messages));
      }
    }
    
    init(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
      
      this.renderInitialUI();
      if (this.connected) {
        this.showDiscordInterface();
      }
      
      // Listen for GitHub and VS Code events to relay to Discord
      window.addEventListener('github-event', (e) => this.handleGitHubEvent(e.detail));
      window.addEventListener('vscode-event', (e) => this.handleVSCodeEvent(e.detail));
    }
    
    renderInitialUI() {
      this.container.innerHTML = `
        <div class="discord-section">
          <div class="section-header">
            <h2><i class="fab fa-discord"></i> Discord Integration</h2>
          </div>
          <div id="discord-content" class="section-content">
            ${this.connected ? 
              '<div class="loading">Loading Discord...</div>' : 
              `
              <div class="auth-required">
                <p>Connect Discord to collaborate with your team in real-time.</p>
                <button id="discord-connect" class="btn">Connect Discord</button>
              </div>
              `
            }
          </div>
        </div>
      `;
      
      if (!this.connected) {
        document.getElementById('discord-connect').addEventListener('click', () => this.connectDiscord());
      }
    }
    
    connectDiscord() {
      // In a real implementation, you would use Discord OAuth
      // For demo purposes, simulate connection
      this.connected = true;
      localStorage.setItem('discordConnected', 'true');
      
      alert('Discord connected successfully!');
      this.showDiscordInterface();
    }
    
    showDiscordInterface() {
      const contentContainer = document.getElementById('discord-content');
      
      contentContainer.innerHTML = `
        <div class="discord-interface">
          <div class="discord-servers">
            ${this.servers.map(server => `
              <div class="server-icon ${this.currentServer === server.name ? 'active' : ''}" 
                   data-server="${server.name}" title="${server.name}">
                ${server.icon}
              </div>
            `).join('')}
            <div class="server-icon add-server" title="Add a Server">+</div>
          </div>
          <div class="discord-main">
            <div class="discord-channels">
              <div class="server-header">
                <h3>${this.currentServer}</h3>
                <i class="fas fa-cog"></i>
              </div>
              <div class="channels-list">
                <div class="channel-category">TEXT CHANNELS</div>
                ${this.channels.filter(c => c.type === 'text').map(channel => `
                  <div class="channel ${this.currentChannel === channel.name ? 'active' : ''}" data-channel="${channel.name}">
                    <i class="fas fa-hashtag"></i> ${channel.name}
                    ${channel.unread ? '<span class="unread-indicator"></span>' : ''}
                  </div>
                `).join('')}
                <div class="channel-category">VOICE CHANNELS</div>
                ${this.channels.filter(c => c.type === 'voice').map(channel => `
                  <div class="voice-channel">
                    <div class="channel-name">
                      <i class="fas fa-volume-up"></i> ${channel.name}
                    </div>
                    ${channel.users ? `
                      <div class="voice-users">
                        ${channel.users.map(userId => {
                          const user = this.users.find(u => u.id === userId);
                          return user ? `
                            <div class="voice-user" title="${user.username}">
                              <img src="${user.avatar}" alt="${user.username}" class="mini-avatar">
                              <span class="speaking-indicator"></span>
                            </div>
                          ` : '';
                        }).join('')}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
              <div class="user-panel">
                <div class="current-user">
                  <img src="${this.users[4].avatar}" alt="Your avatar" class="user-avatar">
                  <div class="user-info">
                    <div class="username">${this.users[4].username}</div>
                    <div class="status ${this.users[4].status}">#1234</div>
                  </div>
                  <div class="user-controls">
                    <i class="fas fa-microphone"></i>
                    <i class="fas fa-headphones"></i>
                    <i class="fas fa-cog"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="discord-chat">
              <div class="chat-header">
                <i class="fas fa-hashtag"></i>
                <h3>${this.currentChannel}</h3>
                <div class="channel-description">Team chat for ${this.currentChannel}</div>
                <div class="chat-controls">
                  <i class="fas fa-bell"></i>
                  <i class="fas fa-users"></i>
                  <i class="fas fa-search"></i>
                </div>
              </div>
              <div class="chat-messages" id="discord-messages">
                ${this.renderMessages()}
              </div>
              <div class="message-input">
                <div class="input-wrapper">
                  <div class="file-upload">
                    <i class="fas fa-plus-circle"></i>
                  </div>
                  <input type="text" id="msg-input" placeholder="Message #${this.currentChannel}">
                  <div class="emoji-picker">
                    <i class="far fa-smile"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="discord-members">
              <div class="members-list">
                <div class="member-category">ONLINE — ${this.users.filter(u => u.status === 'online').length}</div>
                ${this.users.filter(u => u.status === 'online').map(user => `
                  <div class="member">
                    <img src="${user.avatar}" alt="${user.username}" class="member-avatar">
                    <div class="member-info">
                      <div class="member-name">${user.username}</div>
                      <div class="member-status">${user.id === 5 ? 'You' : 'Working on code'}</div>
                    </div>
                  </div>
                `).join('')}
                <div class="member-category">IDLE — ${this.users.filter(u => u.status === 'idle').length}</div>
                ${this.users.filter(u => u.status === 'idle').map(user => `
                  <div class="member">
                    <img src="${user.avatar}" alt="${user.username}" class="member-avatar">
                    <div class="member-info">
                      <div class="member-name">${user.username}</div>
                      <div class="member-status">Away</div>
                    </div>
                  </div>
                `).join('')}
                <div class="member-category">DO NOT DISTURB — ${this.users.filter(u => u.status === 'dnd').length}</div>
                ${this.users.filter(u => u.status === 'dnd').map(user => `
                  <div class="member">
                    <img src="${user.avatar}" alt="${user.username}" class="member-avatar">
                    <div class="member-info">
                      <div class="member-name">${user.username}</div>
                      <div class="member-status">In a meeting</div>
                    </div>
                  </div>
                `).join('')}
                <div class="member-category">OFFLINE — ${this.users.filter(u => u.status === 'offline').length}</div>
                ${this.users.filter(u => u.status === 'offline').map(user => `
                  <div class="member">
                    <img src="${user.avatar}" alt="${user.username}" class="member-avatar">
                    <div class="member-info">
                      <div class="member-name">${user.username}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Set up event listeners
      this.setupEventListeners();
    }
    
    renderMessages() {
      // Filter messages for current channel
      const channelId = this.channels.find(c => c.name === this.currentChannel)?.id;
      const channelMessages = this.messages.filter(m => m.channelId === channelId);
      
      if (channelMessages.length === 0) {
        return `<div class="no-messages">No messages yet in #${this.currentChannel}. Start the conversation!</div>`;
      }
      
      return channelMessages.map(message => {
        const user = this.users.find(u => u.id === message.userId);
        if (!user) return '';
        
        const date = new Date(message.timestamp);
        const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        
        let messageContent = message.content;
        
        // Special formatting for GitHub links
        if (message.githubLink) {
          messageContent = messageContent.replace(/#(\d+)/g, '<a href="#" class="github-issue">#$1</a>');
        }
        
        // Format code blocks
        messageContent = messageContent.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        return `
          <div class="message ${message.githubLink ? 'github-message' : ''}">
            <img src="${user.avatar}" alt="${user.username}" class="message-avatar">
            <div class="message-content">
              <div class="message-header">
                <div class="message-author">${user.username}</div>
                <div class="message-time" title="${dateStr}">${timeStr}</div>
              </div>
              <div class="message-text">${messageContent}</div>
              ${message.reactions.length > 0 ? `
                <div class="message-reactions">
                  ${message.reactions.map(reaction => `
                    <div class="reaction">
                      <span class="emoji">${reaction.emoji}</span>
                      <span class="count">${reaction.count}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');
    }
    
    setupEventListeners() {
      // Server selection
      document.querySelectorAll('.server-icon:not(.add-server)').forEach(server => {
        server.addEventListener('click', (e) => {
          const serverName = e.target.getAttribute('data-server');
          if (serverName) {
            this.currentServer = serverName;
            localStorage.setItem('discordServer', serverName);
            this.showDiscordInterface();
          }
        });
      });
      
      // Channel selection
      document.querySelectorAll('.channel').forEach(channel => {
        channel.addEventListener('click', (e) => {
          const channelName = e.target.getAttribute('data-channel');
          if (channelName) {
            this.currentChannel = channelName;
            localStorage.setItem('discordChannel', channelName);
            // Remove unread indicator
            const channelObj = this.channels.find(c => c.name === channelName);
            if (channelObj) {
              channelObj.unread = false;
            }
            this.showDiscordInterface();
          }
        });
      });
      
      // Message sending
      const msgInput = document.getElementById('msg-input');
      if (msgInput) {
        msgInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && msgInput.value.trim()) {
            this.sendMessage(msgInput.value);
            msgInput.value = '';
          }
        });
      }
      
      // Add server button
      document.querySelector('.add-server')?.addEventListener('click', () => {
        const serverName = prompt('Enter server name:');
        if (serverName && serverName.trim()) {
          this.addServer(serverName);
        }
      });
    }
    
    sendMessage(content) {
      const channelId = this.channels.find(c => c.name === this.currentChannel)?.id;
      if (!channelId) return;
      
      const newMessage = {
        id: this.messages.length + 1,
        userId: 5, // Current user (you)
        channelId: channelId,
        content: content,
        timestamp: new Date().toISOString(),
        reactions: []
      };
      
      this.messages.push(newMessage);
      localStorage.setItem('discordMessages', JSON.stringify(this.messages));
      
      // Refresh the message area
      const messagesContainer = document.getElementById('discord-messages');
      if (messagesContainer) {
        messagesContainer.innerHTML = this.renderMessages();
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
    
    addServer(serverName) {
      const newServer = {
        id: this.servers.length + 1,
        name: serverName,
        icon: serverName.charAt(0).toUpperCase(),
        channels: [1, 2] // Default channels
      };
      
      this.servers.push(newServer);
      this.currentServer = serverName;
      localStorage.setItem('discordServer', serverName);
      
      this.showDiscordInterface();
    }
    
    handleGitHubEvent(event) {
      if (!event || !this.connected) return;
      
      // Format GitHub event as a Discord message
      let content = '';
      let channelId = this.channels.find(c => c.name === 'github')?.id || 1;
      
      switch (event.type) {
        case 'commit':
          content = `Just pushed a commit to ${event.repo}: "${event.message}"`;
          break;
        case 'pull_request':
          content = `Created a new pull request on ${event.repo}: "${event.title}"`;
          break;
        case 'issue':
          content = `Created issue #${event.number} on ${event.repo}: "${event.title}"`;
          break;
        default:
          content = `GitHub activity: ${JSON.stringify(event)}`;
      }
      
      const newMessage = {
        id: this.messages.length + 1,
        userId: 5, // Current user
        channelId: channelId,
        content: content,
        timestamp: new Date().toISOString(),
        reactions: [],
        githubLink: true
      };
      
      this.messages.push(newMessage);
      localStorage.setItem('discordMessages', JSON.stringify(this.messages));
      
      // Mark channel as unread if not the current channel
      if (this.channels.find(c => c.id === channelId)?.name !== this.currentChannel) {
        const channelToUpdate = this.channels.find(c => c.id === channelId);
        if (channelToUpdate) {
          channelToUpdate.unread = true;
        }
      }
      
      // Refresh interface if needed
      if (this.currentChannel === 'github') {
        const messagesContainer = document.getElementById('discord-messages');
        if (messagesContainer) {
          messagesContainer.innerHTML = this.renderMessages();
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      } else {
        // Just update the unread status
        this.showDiscordInterface();
      }
      
      // Notify user
      this.showNotification('GitHub', content);
    }
    
    handleVSCodeEvent(event) {
      if (!event || !this.connected) return;
      
      // Format VS Code event as a Discord message
      let content = '';
      let channelId = this.channels.find(c => c.name === 'development')?.id || 1;
      
      switch (event.type) {
        case 'file_edit':
          content = `Just edited ${event.file}`;
          break;
        case 'debug':
          content = `Started debugging ${event.project}`;
          break;
        case 'terminal':
          content = `Terminal command: \`${event.command}\``;
          break;
        default:
          content = `VS Code activity: ${JSON.stringify(event)}`;
      }
      
      const newMessage = {
        id: this.messages.length + 1,
        userId: 5, // Current user
        channelId: channelId,
        content: content,
        timestamp: new Date().toISOString(),
        reactions: []
      };
      
      this.messages.push(newMessage);
      localStorage.setItem('discordMessages', JSON.stringify(this.messages));
      
      // Mark channel as unread if not the current channel
      if (this.channels.find(c => c.id === channelId)?.name !== this.currentChannel) {
        const channelToUpdate = this.channels.find(c => c.id === channelId);
        if (channelToUpdate) {
          channelToUpdate.unread = true;
        }
      }
      
      // Refresh interface if needed
      if (this.currentChannel === 'development') {
        const messagesContainer = document.getElementById('discord-messages');
        if (messagesContainer) {
          messagesContainer.innerHTML = this.renderMessages();
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      } else {
        // Just update the unread status
        this.showDiscordInterface();
      }
    }
    
    showNotification(title, message) {
      // Check if browser supports notifications
      if (!("Notification" in window)) {
        console.log("This browser does not support desktop notifications");
        return;
      }
      
      // Check if permission is already granted
      if (Notification.permission === "granted") {
        new Notification(title, { body: message });
      }
      // Otherwise, ask for permission
      else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification(title, { body: message });
          }
        });
      }
    }
    
    // Method to be called from other components
    relayMessage(message, channelName = 'general') {
      const channelId = this.channels.find(c => c.name === channelName)?.id;
      if (!channelId || !this.connected) return;
      
      const newMessage = {
        id: this.messages.length + 1,
        userId: 5, // Current user
        channelId: channelId,
        content: message,
        timestamp: new Date().toISOString(),
        reactions: []
      };
      
      this.messages.push(newMessage);
      localStorage.setItem('discordMessages', JSON.stringify(this.messages));
      
      // Mark channel as unread if not the current channel
      if (channelName !== this.currentChannel) {
        const channelToUpdate = this.channels.find(c => c.name === channelName);
        if (channelToUpdate) {
          channelToUpdate.unread = true;
        }
        
        // Refresh interface to show unread indicator
        this.showDiscordInterface();
      } else {
        // Refresh messages
        const messagesContainer = document.getElementById('discord-messages');
        if (messagesContainer) {
          messagesContainer.innerHTML = this.renderMessages();
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }
    }
  }
  
  // Initialize Discord integration
  document.addEventListener('DOMContentLoaded', function() {
    window.discordIntegration = new DiscordIntegration();
    window.discordIntegration.init('discord-container');
  });