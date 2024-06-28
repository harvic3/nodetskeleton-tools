#!/bin/bash
if [ $# -eq 0 ]; then
  echo "Error: project-name is required"
  exit 1
fi

# Print the current directory
echo "Working on directory: $PWD"

# Clone the repository from https://github.com/harvic3/nodetskeleton.git
echo "Cloning the nodetskeleton from origin"
git clone https://github.com/harvic3/nodetskeleton.git

# rename the current directory name nodetskeleton to the project-name provided
echo "Preparing your project $1"
mv nodetskeleton $1
rm -rf nodetskeleton

# Install dependencies
echo "Installing dependencies"
cd $1
pnpm --version || npm install -g pnpm
pnpm install

echo "Project $1 is ready"
echo "Now go to the project directory typing 'cd $1'"
echo " And try typing 'npm run tsk help' to see the available commands"
echo "Happy coding!"
