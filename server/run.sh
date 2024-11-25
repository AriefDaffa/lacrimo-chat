#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Run drizzle-kit push
echo "Running drizzle-kit push..."
bun x drizzle-kit push

# Start the development server
echo "Starting development server..."
bun dev
