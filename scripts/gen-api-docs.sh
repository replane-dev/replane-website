#!/bin/bash

# Check if an argument was provided
if [ $# -eq 0 ]; then
    echo "Error: Please provide an API spec ID (e.g., 'replane')"
    echo "Usage: npm run gen-api-docs replane"
    exit 1
fi

# Generate API docs
npx docusaurus gen-api-docs "$@"

# Check if docusaurus command succeeded
if [ $? -eq 0 ]; then
    # Fix double slashes in paths
    find docs/api -name '*.api.mdx' -type f -exec sed -i '' 's|path={"/\([^"]*\)"}|path={"\1"}|g' {} \;
    echo "✅ API docs generated and paths fixed!"
else
    echo "❌ Failed to generate API docs"
    exit 1
fi
