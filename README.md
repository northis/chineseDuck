# Chinese Duck Bot

[![Build Status](https://travis-ci.org/northis/chineseDuck.svg?branch=master)](https://travis-ci.org/northis/chineseDuck)

Telegram bot @ChineseDuckBot to study Chinese language via memorizing flashcards.

## Key features

- Generating flashcards based on users' vocabulary
- Tone highlighting with colors
- Auto-split word and phrases to syllables
- Web-part to view user's words
- Folders to group user's words
- Several modes how to learn the words - by viewing or by multipal-chioce tests
- Collection personal score
- Bulk import words from .csv file
- Webpart can work even if telegram addresses (https://t.me & so on) are blocked in your country.
- Pre-installed cards for HSK1, HSK2,... to bulk import to a separate folder.
  Now available HSK1-6 pre-installed folders: english & russain versions

<img src="images/learning.png" alt="Leadning in bot" height="400" />

## Commands

- /About - 🈴About this bot
- /Add - ➕Add a new chinese word
- /Default - 👌Set default mode
- /Delete - 🗑Remove a word from the dictionary
- /Edit - 🖌Edit an existing chinese word
- /Folder - 🗀Manage your current folder
- /Import - 🚛Import words from a file
- /Help - ❓List of available commands
- /LearnPronunciation - 📢Learn how to pronounce these words
- /LearnTranslation - 🇨🇳Learn what these words mean
- /LearnView - 🎓👀Just view these words
- /LearnWriting - 🖌Learn how to write these words
- /Mode - ⚙️Choose learn words mode
- /PreInstall - 🗀🕮Get pre-installed folders
- /Start - 🖐Welcome
- /View - 👀View a flash card
- /Web - 🌐Manage the web-part of the bot

## Roadmap

- Using webpart to manipulating the words
- Wiki-part
- Change domain
- More languages in csv templates
- Fix bugs & implement features
- Improve deploy & changelog

## API

You can find the description of Chinese Duck Bot Api on [our Swagger page](https://app.swaggerhub.com/apis/northis/chineseDuckApi/1.3).

## Deploying
### Requirements
- nodeJS 10+
- dotnetcore 2.1+
- docker compose 1.24+
### First run or force udpate

Create a `.env` file in the root of the project folder based on `.env.template.js` file, fill it with your own values and run
```sh
sudo start.sh
```

This script builds & deploys this system to docker containers. There will be 4 containers: mongo db server, front nginx web-server, back nodeJs api/website server, dotnetcore bot server.

### Common usage

```sh
# update from git
sudo update.sh

# run containers
docker-compose up

# stop containers
docker-compose stop
```

### Backup & restore
Mongo database is in `data/` folder. You can either save it directly or use these commands
```sh
mkdir -p backup
# backup
mongodump --uri mongodb://user:password@10.1.1.4:27017/chineseDuck --archive=backup/chineseDuck.archive
# restore with overwriting
mongorestore --uri mongodb://user:password@10.1.1.4:27017/chineseDuck --archive=backup/chineseDuck.archive --drop
```
You have to mongo 4.1+ installed

## Local running

```sh
# just run
npm run build-dev-run
dotnet src/bot/chineseDuck.BotService/bin/Debug/netcoreapp2.1/ChineseDuck.BotService.dll

# tests
npm run test
npm run test-client
```
The tests use in-memory db, you don't need to configure them at all. If the tests exits immediately after the start, may be it is because you have not `libcurl3`. Install it and try again. For testing you can use Travis CI configuration file `.travis.yml` too.