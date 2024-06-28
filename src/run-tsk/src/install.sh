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

# Create resources
echo "NODE_ENV=development
SERVICE_CONTEXT=
SERVER_ROOT=/api
SERVER_HOST=localhost
SERVER_PORT=3003
ORIGINS=http://localhost:3003
ENCRYPTION_KEY=JUS9192ZliRlDBWm0BmmJoZO1PbNkZt3kiXNlaGLkIT49uEdgGe79TPCbr0D
ENCRYPTION_ITERATIONS=4e4
ENCRYPTION_KEY_SIZE=128
JWT_SECRET_KEY=2NtC29d33z1AF1HdPSpn" > .env

echo "Your project $1 is ready"
echo "Now go to the project directory typing 'cd $1'"
echo " And type 'npm run dev' to start the server"
echo " And then try typing 'npm run tsk help' to see the available commands to support your development"
echo "Happy coding!"
