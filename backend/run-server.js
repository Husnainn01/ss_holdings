#!/usr/bin/env node

// This script runs the server with ts-node
const { spawn } = require('child_process');
const path = require('path');

// Get the path to the index.ts file
const indexPath = path.join(__dirname, 'src', 'index.ts');

// Run the server with ts-node
const server = spawn('npx', ['ts-node', indexPath], {
  stdio: 'inherit',
  shell: true
});

// Handle process exit
process.on('SIGINT', () => {
  server.kill('SIGINT');
  process.exit(0);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});
