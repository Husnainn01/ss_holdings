#!/bin/bash

# Navigate to the backend directory
cd "$(dirname "$0")"

# Run the server with ts-node
echo "Starting server..."
npx ts-node src/index.ts
