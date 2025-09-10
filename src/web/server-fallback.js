'use strict';

// Try to use express if available, otherwise use built-in http
var http = require('http');
var url = require('url');
var path = require('path');

// Simple in-memory storage for projects (in real app, this would be persistent)
var projects = {};

function startWebServer(cwd, port) {
  return new Promise(function(resolve, reject) {
    
    // Try to use Express if available
    try {
      var express = require('express');
      return startExpressServer(cwd, port, resolve, reject);
    } catch (err) {
      console.log('Express not available, using built-in http server...');
      return startHttpServer(cwd, port, resolve, reject);
    }
  });
}

function startExpressServer(cwd, port, resolve, reject) {
  var express = require('express');
  var app = express();
  
  // Middleware
  app.use(express.json());
  
  // Serve the main HTML page
  app.get('/', function(req, res) {
    res.send(getIndexHtml());
  });
  
  // API endpoint for chat (mock AI responses)
  app.post('/api/chat', function(req, res) {
    var message = req.body.message;
    var projectId = req.body.projectId;
    
    // Simple mock AI responses
    var responses = [
      "I'll help you create that! Let me generate the code for you.",
      "Great idea! I'll build a React component with that functionality.",
      "I'll create a new file with the requested features.",
      "Let me add those dependencies and implement the functionality.",
      "I'll update the code to include your requested changes."
    ];
    
    var response = responses[Math.floor(Math.random() * responses.length)];
    
    // Simulate some work being done
    setTimeout(function() {
      res.json({
        response: response,
        files: generateMockFiles(message),
        preview: "Project preview would appear here"
      });
    }, 1000);
  });
  
  var server = app.listen(port, function(err) {
    if (err) {
      reject(err);
    } else {
      console.log('🚀 Bolt.new web interface running at http://localhost:' + port);
      console.log('💡 This is a demo implementation inspired by bolt.new');
      resolve();
    }
  });
  
  setupShutdownHandler(server);
}

function startHttpServer(cwd, port, resolve, reject) {
  var server = http.createServer(function(req, res) {
    var parsedUrl = url.parse(req.url, true);
    var pathname = parsedUrl.pathname;
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    if (pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(getIndexHtml());
    } else if (pathname === '/api/chat' && req.method === 'POST') {
      var body = '';
      req.on('data', function(chunk) {
        body += chunk;
      });
      req.on('end', function() {
        try {
          var data = JSON.parse(body);
          var message = data.message;
          
          var responses = [
            "I'll help you create that! Let me generate the code for you.",
            "Great idea! I'll build a React component with that functionality.",
            "I'll create a new file with the requested features.",
            "Let me add those dependencies and implement the functionality.",
            "I'll update the code to include your requested changes."
          ];
          
          var response = responses[Math.floor(Math.random() * responses.length)];
          
          setTimeout(function() {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              response: response,
              files: generateMockFiles(message),
              preview: "Project preview would appear here"
            }));
          }, 1000);
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });
  
  server.listen(port, function(err) {
    if (err) {
      reject(err);
    } else {
      console.log('🚀 Bolt.new web interface running at http://localhost:' + port);
      console.log('💡 This is a demo implementation inspired by bolt.new (using built-in http server)');
      resolve();
    }
  });
  
  setupShutdownHandler(server);
}

function setupShutdownHandler(server) {
  // Handle server shutdown gracefully
  process.on('SIGINT', function() {
    console.log('\n🛑 Shutting down web server...');
    server.close(function() {
      process.exit(0);
    });
  });
}

function generateMockFiles(message) {
  // Generate some mock files based on the message
  if (message.toLowerCase().includes('react')) {
    return {
      'App.js': "import React from 'react';\n\nfunction App() {\n  return (\n    <div className=\"App\">\n      <h1>Hello from React!</h1>\n      <p>Generated based on your request: \"" + message + "\"</p>\n    </div>\n  );\n}\n\nexport default App;",
      'package.json': "{\n  \"name\": \"my-react-app\",\n  \"version\": \"1.0.0\",\n  \"dependencies\": {\n    \"react\": \"^18.2.0\",\n    \"react-dom\": \"^18.2.0\"\n  }\n}"
    };
  }
  
  return {
    'index.html': "<!DOCTYPE html>\n<html>\n<head>\n  <title>Generated Project</title>\n</head>\n<body>\n  <h1>Project based on: \"" + message + "\"</h1>\n  <p>This is a demo file generated by Bolt.new example.</p>\n</body>\n</html>"
  };
}

function getIndexHtml() {
  return "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Bolt.new - AI-Powered Development</title>\n    <style>\n        * {\n            margin: 0;\n            padding: 0;\n            box-sizing: border-box;\n        }\n        body {\n            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n            height: 100vh;\n            display: flex;\n            flex-direction: column;\n        }\n        .header {\n            background: rgba(255, 255, 255, 0.1);\n            backdrop-filter: blur(10px);\n            padding: 1rem;\n            border-bottom: 1px solid rgba(255, 255, 255, 0.2);\n        }\n        .header h1 {\n            color: white;\n            font-size: 1.5rem;\n            font-weight: 600;\n        }\n        .header p {\n            color: rgba(255, 255, 255, 0.8);\n            margin-top: 0.25rem;\n        }\n        .container {\n            display: flex;\n            flex: 1;\n            overflow: hidden;\n        }\n        .chat-panel {\n            width: 40%;\n            background: white;\n            display: flex;\n            flex-direction: column;\n            border-right: 1px solid #e5e7eb;\n        }\n        .editor-panel {\n            width: 60%;\n            background: #1e1e1e;\n            display: flex;\n            flex-direction: column;\n        }\n        .chat-messages {\n            flex: 1;\n            padding: 1rem;\n            overflow-y: auto;\n        }\n        .message {\n            margin-bottom: 1rem;\n            padding: 0.75rem;\n            border-radius: 0.5rem;\n        }\n        .message.user {\n            background: #f3f4f6;\n            margin-left: 2rem;\n        }\n        .message.ai {\n            background: #dbeafe;\n            margin-right: 2rem;\n        }\n        .chat-input {\n            padding: 1rem;\n            border-top: 1px solid #e5e7eb;\n        }\n        .chat-input textarea {\n            width: 100%;\n            padding: 0.75rem;\n            border: 1px solid #d1d5db;\n            border-radius: 0.375rem;\n            resize: vertical;\n            min-height: 60px;\n        }\n        .chat-input button {\n            margin-top: 0.5rem;\n            background: #3b82f6;\n            color: white;\n            border: none;\n            padding: 0.75rem 1.5rem;\n            border-radius: 0.375rem;\n            cursor: pointer;\n        }\n        .chat-input button:hover {\n            background: #2563eb;\n        }\n        .chat-input button:disabled {\n            background: #9ca3af;\n            cursor: not-allowed;\n        }\n        .editor-header {\n            background: #2d2d2d;\n            color: white;\n            padding: 0.75rem;\n            border-bottom: 1px solid #404040;\n        }\n        .file-tabs {\n            display: flex;\n            gap: 0.5rem;\n        }\n        .file-tab {\n            background: #404040;\n            color: white;\n            padding: 0.5rem 1rem;\n            border-radius: 0.25rem 0.25rem 0 0;\n            cursor: pointer;\n            border: none;\n        }\n        .file-tab.active {\n            background: #1e1e1e;\n        }\n        .editor-content {\n            flex: 1;\n            background: #1e1e1e;\n            color: #d4d4d4;\n            font-family: 'Monaco', 'Menlo', monospace;\n            font-size: 14px;\n        }\n        .editor-textarea {\n            width: 100%;\n            height: 100%;\n            background: transparent;\n            color: inherit;\n            border: none;\n            padding: 1rem;\n            font-family: inherit;\n            font-size: inherit;\n            resize: none;\n            outline: none;\n        }\n        .preview-panel {\n            flex: 1;\n            background: white;\n            padding: 1rem;\n            overflow-y: auto;\n        }\n        .loading {\n            display: none;\n            color: #6b7280;\n            font-style: italic;\n        }\n        .loading.show {\n            display: block;\n        }\n    </style>\n</head>\n<body>\n    <div class=\"header\">\n        <h1>⚡ Bolt.new Example</h1>\n        <p>AI-powered web development environment (Demo implementation)</p>\n    </div>\n    \n    <div class=\"container\">\n        <div class=\"chat-panel\">\n            <div class=\"chat-messages\" id=\"chatMessages\">\n                <div class=\"message ai\">\n                    <strong>Bolt AI:</strong> Hello! I'm a demo version of an AI assistant. Tell me what you'd like to build and I'll generate some example code for you!\n                </div>\n            </div>\n            <div class=\"chat-input\">\n                <textarea id=\"messageInput\" placeholder=\"Describe what you want to build...\"></textarea>\n                <button onclick=\"sendMessage()\" id=\"sendButton\">Send Message</button>\n                <div class=\"loading\" id=\"loading\">AI is thinking...</div>\n            </div>\n        </div>\n        \n        <div class=\"editor-panel\">\n            <div class=\"editor-header\">\n                <div class=\"file-tabs\" id=\"fileTabs\">\n                    <button class=\"file-tab active\" onclick=\"showFile('welcome')\">README.md</button>\n                </div>\n            </div>\n            <div class=\"editor-content\">\n                <textarea class=\"editor-textarea\" id=\"fileContent\"># Welcome to Bolt.new Example\n\nThis is a demo implementation inspired by bolt.new.\n\n## Features\n- Chat with AI to describe your project\n- View generated files in the editor\n- See a live preview of your project\n\n## How to use\n1. Type a message in the chat describing what you want to build\n2. The AI will generate example code\n3. View and edit the files in this editor\n4. See the preview on the right\n\nTry asking for:\n- \"Create a React todo app\"\n- \"Build a simple landing page\"\n- \"Make a JavaScript calculator\"\n\n**Note:** This is a demo with simulated AI responses.</textarea>\n            </div>\n        </div>\n    </div>\n\n    <script>\n        let currentFile = 'welcome';\n        let files = {\n            'welcome': '# Welcome to Bolt.new Example\\n\\nThis is a demo implementation inspired by bolt.new.\\n\\n## Features\\n- Chat with AI to describe your project\\n- View generated files in the editor\\n- See a live preview of your project\\n\\n## How to use\\n1. Type a message in the chat describing what you want to build\\n2. The AI will generate example code\\n3. View and edit the files in this editor\\n4. See the preview on the right\\n\\nTry asking for:\\n- \"Create a React todo app\"\\n- \"Build a simple landing page\"\\n- \"Make a JavaScript calculator\"\\n\\n**Note:** This is a demo with simulated AI responses.'\n        };\n\n        async function sendMessage() {\n            const input = document.getElementById('messageInput');\n            const message = input.value.trim();\n            if (!message) return;\n\n            const sendButton = document.getElementById('sendButton');\n            const loading = document.getElementById('loading');\n            \n            sendButton.disabled = true;\n            loading.classList.add('show');\n\n            // Add user message\n            addMessage(message, 'user');\n            input.value = '';\n\n            try {\n                const response = await fetch('/api/chat', {\n                    method: 'POST',\n                    headers: { 'Content-Type': 'application/json' },\n                    body: JSON.stringify({ message, projectId: 'demo' })\n                });\n\n                const data = await response.json();\n                \n                // Add AI response\n                addMessage(data.response, 'ai');\n                \n                // Update files if any were generated\n                if (data.files) {\n                    updateFiles(data.files);\n                }\n            } catch (error) {\n                addMessage('Sorry, there was an error processing your request.', 'ai');\n            } finally {\n                sendButton.disabled = false;\n                loading.classList.remove('show');\n            }\n        }\n\n        function addMessage(content, type) {\n            const messagesDiv = document.getElementById('chatMessages');\n            const messageDiv = document.createElement('div');\n            messageDiv.className = \\`message \\${type}\\`;\n            messageDiv.innerHTML = \\`<strong>\\${type === 'user' ? 'You' : 'Bolt AI'}:</strong> \\${content}\\`;\n            messagesDiv.appendChild(messageDiv);\n            messagesDiv.scrollTop = messagesDiv.scrollHeight;\n        }\n\n        function updateFiles(newFiles) {\n            Object.assign(files, newFiles);\n            updateFileTabs();\n            if (Object.keys(newFiles).length > 0) {\n                const firstNewFile = Object.keys(newFiles)[0];\n                showFile(firstNewFile);\n            }\n        }\n\n        function updateFileTabs() {\n            const tabsDiv = document.getElementById('fileTabs');\n            tabsDiv.innerHTML = '';\n            \n            Object.keys(files).forEach(filename => {\n                const button = document.createElement('button');\n                button.className = \\`file-tab \\${currentFile === filename ? 'active' : ''}\\`;\n                button.textContent = filename;\n                button.onclick = () => showFile(filename);\n                tabsDiv.appendChild(button);\n            });\n        }\n\n        function showFile(filename) {\n            currentFile = filename;\n            document.getElementById('fileContent').value = files[filename] || '';\n            updateFileTabs();\n        }\n\n        // Handle Enter key in chat input\n        document.getElementById('messageInput').addEventListener('keydown', function(e) {\n            if (e.key === 'Enter' && !e.shiftKey) {\n                e.preventDefault();\n                sendMessage();\n            }\n        });\n\n        // Save file changes\n        document.getElementById('fileContent').addEventListener('input', function(e) {\n            files[currentFile] = e.target.value;\n        });\n    </script>\n</body>\n</html>";\n}\n\nmodule.exports = { startWebServer };