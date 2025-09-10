# Bolt.new Web Interface

This is a demo implementation inspired by [bolt.new](https://bolt.new) - an AI-powered web development environment.

## What is this?

This adds a web interface to the existing Bolt package manager that demonstrates concepts from bolt.new:

- **Chat Interface**: Interact with a simulated AI assistant
- **File Editor**: View and edit generated code files
- **Live Demo**: See how AI can generate project files
- **Modern UI**: Clean, responsive interface inspired by bolt.new

## How to run

```bash
# Simple standalone version (no dependencies required)
node bolt-web-simple.js web

# Then open http://localhost:3000 in your browser
```

## Features Demonstrated

- **AI Chat**: Type requests like "Create a React todo app" 
- **Code Generation**: AI generates example files based on your requests
- **File Management**: Switch between generated files with tabs
- **Live Editing**: Edit files directly in the browser

## Example Prompts to Try

- "Create a React todo app"
- "Build a simple landing page" 
- "Make a JavaScript calculator"
- "Create a Node.js API server"

## Technical Implementation

- **Backend**: Simple Node.js HTTP server
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **No external dependencies**: Works without npm install
- **Mock AI**: Simulated responses for demonstration

## Limitations

This is a demo implementation with:
- Simulated AI responses (not real AI)
- In-memory file storage only
- No actual code execution
- No deployment functionality

For a full AI-powered development environment, see the actual [bolt.new](https://bolt.new).

## Integration with Bolt CLI

This web interface is designed to complement the existing Bolt package manager:

- All existing Bolt CLI commands continue to work
- Web interface is an optional addition
- Uses the same project structure concepts
- Can be used alongside workspace management

## Screenshots

The interface features:
1. A chat panel for AI interaction
2. File tabs for switching between generated files  
3. Code editor with syntax highlighting
4. Modern UI inspired by bolt.new

See the demo in action at http://localhost:3000 after running the server.