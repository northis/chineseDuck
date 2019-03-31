#!/bin/bash
echo "Pulling from the repository..."
git pull
echo "Stopping containers..."
docker stop bot_netcore
docker stop chinese_duck_node
echo "Removing containers..."
docker rm bot_netcore
docker rm chinese_duck_node
# echo "Removing images..."
# docker image rm bot:latest
# docker image rm api_node:latest
echo "Building node api..."
npm install
npm run build
docker build -t api_node .
echo "Building bot..."
dotnet build
dotnet publish
docker build -t bot ./src/bot/chineseDuck.BotService
echo "Running containers..."
docker run --name=chinese_duck_node --restart=unless-stopped --net udd3rnet --ip 10.1.1.6 api_node:latest &
docker run --name=bot_netcore --restart=unless-stopped --net udd3rnet --ip 10.1.1.7 bot:latest &
exit

