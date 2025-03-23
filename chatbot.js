// Simplified Chatbot with built-in responses

class CollabdChatbot {
    constructor() {
      this.container = null;
      this.button = null;
      this.window = null;
      this.messagesContainer = null;
      this.inputField = null;
      this.suggestionsContainer = null;
      this.sendButton = null;
      this.isOpen = false;
      this.isTyping = false;
      this.contextHistory = [];
      
      // Predefined suggestions
      this.suggestions = [
        "What is Collabd?",
        "How do I start a project?",
        "Help with coding",
        "Best programming languages",
        "Tell me a joke"
      ];
      
      // Knowledge base for responses
      this.knowledgeBase = {
        "hello": [
          "Hello! How can I help you today?",
          "Hi there! What can I assist you with?",
          "Hey! What would you like to know about?"
        ],
        "hi": [
          "Hi! How can I help you with your Collabd project?",
          "Hello there! What can I assist you with today?",
          "Hey! What's on your mind?"
        ],
        "help": [
          "I'm here to help! You can ask me about coding, projects, or using Collabd features. What do you need assistance with?",
          "I'd be happy to help. What specific question do you have?",
          "How can I assist you today? You can ask about projects, coding, or Collabd features."
        ],
        "coding": [
          "Coding is the process of creating instructions for computers using programming languages. What specific coding topic are you interested in?",
          "I can help with various coding topics like JavaScript, Python, HTML, CSS and more. What would you like to know?",
          "Coding is an essential skill for software development. Are you looking for tips on a specific language or concept?"
        ],
        "javascript": [
          "JavaScript is a versatile programming language mainly used for web development. It allows you to add interactive elements to websites. What specifically would you like to know about JavaScript?",
          "JavaScript is one of the most popular programming languages. It's essential for front-end web development and can also be used for back-end with Node.js. Do you have a specific JavaScript question?",
          "JavaScript is a powerful language that runs in browsers. It's used for creating interactive web applications. What aspect of JavaScript are you interested in?"
        ],
        "python": [
          "Python is a high-level programming language known for its readability and simplicity. It's widely used in data science, AI, and web development. What would you like to know about Python?",
          "Python is one of the most beginner-friendly programming languages. It's versatile and powerful, used in everything from web development to machine learning. Do you have a specific Python question?",
          "Python is a popular language that emphasizes code readability. It's great for beginners and experts alike. What Python topic are you interested in?"
        ],
        "collabd": [
          "Collabd is a collaborative development platform that integrates VSCode, GitHub, and Discord into a single platform. It streamlines your development workflow and makes team collaboration easier.",
          "Collabd brings together the tools developers love - VSCode for coding, GitHub for version control, and Discord for communication - all in one seamless platform.",
          "Collabd is designed to simplify collaborative coding. It combines coding tools, version control, and team communication in one integrated environment."
        ],
        "project": [
          "To start a new project in Collabd, click the 'Create New Project' button on the Projects page. You'll need to provide a title, description, and any relevant tags.",
          "Projects in Collabd allow you to organize your work and collaborate with others. You can create one from the Projects page and invite team members to join.",
          "Managing projects in Collabd is easy. You can track progress, assign tasks, and collaborate in real-time with your team members."
        ],
        "joke": [
          "Why do programmers prefer dark mode? Because light attracts bugs!",
          "Why did the developer go broke? Because he used up all his cache!",
          "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
          "Why was the JavaScript developer sad? Because he didn't know how to Object.create(happiness)!"
        ]
      };
    }
  
    // Initialize the chatbot UI
    init() {
      this.createChatbotUI();
      this.setupEventListeners();
      this.loadChatHistory();
    }
  
    // Create the chatbot UI elements
    createChatbotUI() {
      // Create the main container
      this.container = document.createElement('div');
      this.container.className = 'chatbot-container';
      
      // Create the chatbot window
      this.window = document.createElement('div');
      this.window.className = 'chatbot-window';
      
      // Create the chatbot header
      const header = document.createElement('div');
      header.className = 'chatbot-header';
      
      const headerTitle = document.createElement('div');
      headerTitle.className = 'chatbot-header-title';
      headerTitle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
        <span>Collabd Assistant</span>
      `;
      
      const closeButton = document.createElement('div');
      closeButton.className = 'chatbot-close';
      closeButton.innerHTML = '✕';
      
      header.appendChild(headerTitle);
      header.appendChild(closeButton);
      
      // Create messages container
      this.messagesContainer = document.createElement('div');
      this.messagesContainer.className = 'chatbot-messages';
      
      // Create suggestions container
      this.suggestionsContainer = document.createElement('div');
      this.suggestionsContainer.className = 'chatbot-suggestions';
      
      // Create input container
      const inputContainer = document.createElement('div');
      inputContainer.className = 'chatbot-input-container';
      
      this.inputField = document.createElement('textarea');
      this.inputField.className = 'chatbot-input';
      this.inputField.placeholder = 'Type your message...';
      this.inputField.rows = 1;
      
      this.sendButton = document.createElement('button');
      this.sendButton.className = 'chatbot-send';
      this.sendButton.disabled = true;
      this.sendButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      `;
      
      inputContainer.appendChild(this.inputField);
      inputContainer.appendChild(this.sendButton);
      
      // Create the toggle button
      this.button = document.createElement('div');
      this.button.className = 'chatbot-button';
      this.button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      `;
      
      // Assemble the chatbot UI
      this.window.appendChild(header);
      this.window.appendChild(this.messagesContainer);
      this.window.appendChild(this.suggestionsContainer);
      this.window.appendChild(inputContainer);
      
      this.container.appendChild(this.window);
      this.container.appendChild(this.button);
      
      // Add to the document
      document.body.appendChild(this.container);
      
      // Add initial suggestions
      this.displaySuggestions(this.suggestions);
    }
  
    // Set up event listeners for user interactions
    setupEventListeners() {
      // Toggle chatbot window
      this.button.addEventListener('click', () => {
        this.toggleChatWindow();
      });
      
      // Close chatbot window
      this.window.querySelector('.chatbot-close').addEventListener('click', () => {
        this.toggleChatWindow(false);
      });
      
      // Send message on button click
      this.sendButton.addEventListener('click', () => {
        this.sendMessage();
      });
      
      // Send message on Enter key (but allow Shift+Enter for new lines)
      this.inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (!this.sendButton.disabled) {
            this.sendMessage();
          }
        }
      });
      
      // Enable/disable send button based on input
      this.inputField.addEventListener('input', () => {
        this.sendButton.disabled = this.inputField.value.trim() === '';
        
        // Auto-resize textarea
        this.inputField.style.height = 'auto';
        this.inputField.style.height = (this.inputField.scrollHeight) + 'px';
      });
    }
  
    // Toggle chat window open/closed
    toggleChatWindow(forceState = null) {
      const newState = forceState !== null ? forceState : !this.isOpen;
      this.isOpen = newState;
      
      if (this.isOpen) {
        this.window.classList.add('active');
        // Only show greeting if this is the first time opening or messages are empty
        if (this.messagesContainer.children.length === 0) {
          this.showGreeting();
        }
      } else {
        this.window.classList.remove('active');
      }
    }
  
    // Display a greeting message when the chatbot is first opened
    showGreeting() {
      const greeting = "Hello! I'm your Collabd assistant. How can I help you today?";
      this.addBotMessage(greeting);
    }
  
    // Send a user message
    sendMessage() {
      const message = this.inputField.value.trim();
      if (message === '') return;
      
      // Add user message to chat
      this.addUserMessage(message);
      
      // Clear input field and reset height
      this.inputField.value = '';
      this.inputField.style.height = 'auto';
      this.sendButton.disabled = true;
      
      // Process the message and generate a response
      this.processUserMessage(message);
    }
  
    // Process user message and generate a response
    async processUserMessage(message) {
      // Start typing indicator
      this.showTypingIndicator();
      
      // Simulate typing delay for more natural interaction
      setTimeout(() => {
        // Hide typing indicator
        this.hideTypingIndicator();
        
        // Generate response
        const response = this.generateResponse(message);
        
        // Add bot response to chat
        this.addBotMessage(response);
        
        // Update suggestions
        this.updateSuggestions(message, response);
        
        // Save chat history
        this.saveChatHistory(message, response);
      }, 1000 + Math.random() * 1000);
    }
  
    // Generate a response based on the message
    generateResponse(message) {
      const lowerMessage = message.toLowerCase();
      
      // First, check if message contains any of our known keywords
      for (const [keyword, responses] of Object.entries(this.knowledgeBase)) {
        if (lowerMessage.includes(keyword)) {
          return this.getRandomItem(responses);
        }
      }
      
      // General response for questions we don't have specific answers for
      if (lowerMessage.endsWith('?')) {
        return "That's an interesting question! While I have knowledge about programming and Collabd features, I don't have all the answers. For more specific help, you might want to check the documentation or contact support.";
      }
      
      // Default response
      return "I understand you're interested in this topic. While I have limited knowledge, I'd be happy to help with questions about Collabd, programming, or project management. Is there something specific about these topics you'd like to know?";
    }
  
    // Get a random item from an array
    getRandomItem(array) {
      return array[Math.floor(Math.random() * array.length)];
    }
  
    // Add a user message to the chat
    addUserMessage(message) {
      const messageElement = document.createElement('div');
      messageElement.className = 'chatbot-message user';
      messageElement.textContent = message;
      
      this.messagesContainer.appendChild(messageElement);
      this.scrollToBottom();
    }
  
    // Add a bot message to the chat
    addBotMessage(message) {
      const messageElement = document.createElement('div');
      messageElement.className = 'chatbot-message bot';
      
      // Convert markdown-style code blocks to HTML
      const formattedMessage = this.formatMessage(message);
      messageElement.innerHTML = formattedMessage;
      
      this.messagesContainer.appendChild(messageElement);
      this.scrollToBottom();
    }
  
    // Format message with markdown-style code blocks
    formatMessage(message) {
      // Convert code blocks with ```
      let formatted = message.replace(/```([\s\S]*?)```/g, (match, code) => {
        return `<pre>${this.escapeHTML(code.trim())}</pre>`;
      });
      
      // Convert inline code with `
      formatted = formatted.replace(/`([^`]+)`/g, (match, code) => {
        return `<code>${this.escapeHTML(code)}</code>`;
      });
      
      // Convert newlines to <br>
      formatted = formatted.replace(/\n/g, '<br>');
      
      return formatted;
    }
  
    // Escape HTML special characters
    escapeHTML(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  
    // Show typing indicator
    showTypingIndicator() {
      if (this.isTyping) return;
      
      this.isTyping = true;
      
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'chatbot-typing';
      typingIndicator.innerHTML = `
        <div class="chatbot-typing-dot"></div>
        <div class="chatbot-typing-dot"></div>
        <div class="chatbot-typing-dot"></div>
      `;
      
      this.messagesContainer.appendChild(typingIndicator);
      this.scrollToBottom();
    }
  
    // Hide typing indicator
    hideTypingIndicator() {
      this.isTyping = false;
      
      const typingIndicator = this.messagesContainer.querySelector('.chatbot-typing');
      if (typingIndicator) {
        typingIndicator.remove();
      }
    }
  
    // Scroll to the bottom of the messages container
    scrollToBottom() {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  
    // Display suggestion buttons
    displaySuggestions(suggestions) {
      this.suggestionsContainer.innerHTML = '';
      
      suggestions.forEach(suggestion => {
        const suggestionButton = document.createElement('div');
        suggestionButton.className = 'chatbot-suggestion';
        suggestionButton.textContent = suggestion;
        
        suggestionButton.addEventListener('click', () => {
          this.inputField.value = suggestion;
          this.sendButton.disabled = false;
          this.sendMessage();
        });
        
        this.suggestionsContainer.appendChild(suggestionButton);
      });
    }
  
    // Update suggestions based on the conversation
    updateSuggestions(message, response) {
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('javascript') || lowerMessage.includes('js')) {
        this.displaySuggestions([
          "What is JavaScript used for?",
          "JavaScript vs Python",
          "Best JavaScript frameworks",
          "JavaScript tips for beginners"
        ]);
      } else if (lowerMessage.includes('python')) {
        this.displaySuggestions([
          "Python for data science",
          "Python vs JavaScript",
          "Best Python libraries",
          "How to learn Python fast"
        ]);
      } else if (lowerMessage.includes('project') || lowerMessage.includes('collabd')) {
        this.displaySuggestions([
          "How to start a project",
          "Invite team members",
          "Project management tips",
          "Integration features"
        ]);
      } else if (lowerMessage.includes('help') || lowerMessage.includes('learn')) {
        this.displaySuggestions([
          "Programming resources",
          "Best coding practices",
          "Debugging tips",
          "Learning roadmap"
        ]);
      } else {
        // Default suggestions
        this.displaySuggestions([
          "Tell me about Collabd",
          "How to use the platform",
          "Coding best practices",
          "Popular programming languages"
        ]);
      }
    }
  
    // Save chat history to localStorage
    saveChatHistory(userMessage, botResponse) {
      const chatHistory = localStorage.getItem('collabdChatHistory') ? 
        JSON.parse(localStorage.getItem('collabdChatHistory')) : [];
      
      chatHistory.push(
        { role: 'user', content: userMessage },
        { role: 'assistant', content: botResponse }
      );
      
      // Keep only the last 20 messages
      const trimmedHistory = chatHistory.slice(-20);
      
      localStorage.setItem('collabdChatHistory', JSON.stringify(trimmedHistory));
    }
  
    // Load chat history from localStorage
    loadChatHistory() {
      const chatHistory = localStorage.getItem('collabdChatHistory');
      
      if (chatHistory) {
        const messages = JSON.parse(chatHistory);
        
        messages.forEach(message => {
          if (message.role === 'user') {
            this.addUserMessage(message.content);
          } else if (message.role === 'assistant') {
            this.addBotMessage(message.content);
          }
        });
      }
    }
  
    // Clear chat history
    clearChatHistory() {
      localStorage.removeItem('collabdChatHistory');
      this.messagesContainer.innerHTML = '';
      this.showGreeting();
    }
  }
  
  // Initialize the chatbot when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    const chatbot = new CollabdChatbot();
    chatbot.init();
    
    // Make chatbot accessible globally
    window.collabdChatbot = chatbot;
  });