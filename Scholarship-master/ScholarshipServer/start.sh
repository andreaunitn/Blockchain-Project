#!/bin/bash

# Run Truffle compile
truffle compile

# Directory paths
sourceDir="./build/contracts"
destinationDir="./UI/contracts"

# Create the destination directory if it doesn't exist
mkdir -p "$destinationDir"

# Move the compiled JSON files to the destination directory
mv "$sourceDir"/*.json "$destinationDir"

echo "Compilation completed. Compiled JSON files moved to $destinationDir directory."

node Dindex.js
