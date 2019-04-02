# Chinese Duck Bot

[![Build Status](https://travis-ci.org/northis/chineseDuck.svg?branch=master)](https://travis-ci.org/northis/chineseDuck)

Telegram bot @ChineseDuckBot to study Chinese language via memorizing the flashcards.

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

## Roadmap

- Pre-installed cards for HSK1, HSK2,... to bulk import to a separate folder.
- Using webpart to manipulating the words

## API

You can find the description of Chinese Duck Bot Api on [our Swagger page](https://app.swaggerhub.com/apis/northis/chineseDuckApi/1.1.1-oas3).

## Build

1. Create a `keys.js` file in the root of the project folder based on `keys.template.js` file.
2. In `src/bot/chineseDuck.BotService/` folder, create an `appsettings.json` file based on `appsettings.template.json` file.
3. Configure these files according your data - logins, passwords, machine names, etc.
4. Be sure you have installed NodeJS 10+ & dotnet core 2.1+ on your machine.
5. Restore all the dependencies & build the project

```
npm install
npm run build
cd src/bot/chineseDuck.BotService
dotnet build
dotnet publish
```

## Local running

```
npm run build-dev-run
dotnet src/bot/chineseDuck.BotService/bin/Debug/netcoreapp2.1/ChineseDuck.BotService.dll
```

## Running the tests

```
npm run test
```

The tests use in-memory db, you don't need to configure them at all. If the tests exits immediately after the start, may be it is because you have not `libcurl3`. Install it and try again.

## Deploying to Docker

This is at least one way how to deploy, if you are good on it, may be you'll find the better way.

1. Be sure you have Docker installed on your machine
2. Create a subnet to communicating between containers

```
docker network create --subnet=10.1.1.0/24 udd3rnet
```

3. There will be 4 containers: mongo db server, front nginx web-server, back nodeJs api/website server, dotnetcore bot server

### Mongo db

Let's create a mongo db image `mongo:latest`

```
docker pull mongo
```

and container `mongoDb` using `admin\pwd` credentials on `10.1.1.4` address

```
docker run --name mongoDb --restart=unless-stopped --net udd3rnet --ip 10.1.1.4 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=pwd -d mongo:latest
```

We can connect to this mongo db and create initial user, password-hash can be set with `bcrypt` library.
You can use this `main_admin` with `_id=1` in dotnetbot\import `appsettings.json` config files.

```js

use DbName;
db.createUser(
  {
    user: "mainUser",
    pwd: "pwd",
    roles: [ { role: "readWrite", db: "DbName" } ]
  }
)

db.users.insert({
  _id: 1,
  username: "main_admin",
  who: "admin",
  mode: "Random",
  currentFolder_id: 0,
  currentWord_id: 0,
});

```

### Front nginx web-server

Run the Nginx web-server

```
docker pull nginx
docker run --name=websrv --net udd3rnet --ip 10.1.1.5 --env="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" --env="NGINX_VERSION=1.15.7-1~stretch" --env="NJS_VERSION=1.15.7.0.2.6-1~stretch" -p 443:443 -p 80:80 --restart=unless-stopped  --detach=true nginx -g 'daemon off;'
```

Ports 443 & 80 are opened for webpart & bot.
Now we have to set the certificate for SSL on this webserver by copying its files

```
docker cp CAbundle.crt websrv:/etc/nginx/ssl/CAbundle.crt
docker cp private.key websrv:/etc/nginx/ssl/private.key
```

Prepare the webserver to proxying the requests to the api container & bot.

```conf

server {
    listen       80;
    server_name  webpartsite.com;
    return      301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name  webpartsite.com;

    # certs settings
    ssl_certificate /etc/nginx/ssl/CAbundle.crt;
    ssl_certificate_key /etc/nginx/ssl/private.key;

    # we use Webhooks, so we have to set it here to pass requests to bot on 10.1.1.7:8080
    location /000000000:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/ {
	rewrite ^/000000000:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/(.*) /$1 break;
        proxy_pass http://10.1.1.7:8080;
    }

    # Main webpart on 10.1.1.6:3000
    location / {
	proxy_pass  http://10.1.1.6:3000;
	proxy_set_header Host $host;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Copy it to the container & reload nginx

```
docker cp default.conf websrv:/etc/nginx/conf.d/default.conf
docker exec websrv nginx -s reload
```

### Back nodeJs api/website

Let's create a node image `chinese_duck_node:latest` from the project's folder

```
npm install
npm run build
docker build -t chinese_duck_node:latest .
```

Make sure you have created `keys.js` file & run

```
docker run --name=chinese_duck_node --restart=unless-stopped --net udd3rnet --ip 10.1.1.6 chinese_duck_node:latest
```

### Dotnetcore bot

Let's create a node image `bot:latest` from the project's folder

```
cd src/bot/chineseDuck.BotService
dotnet build
dotnet publish
cd ../../../
docker build -t bot:latest .
```

Make sure you have created `appsettings.json` file & run

```
docker run --name=bot_netcore --restart=unless-stopped --net udd3rnet --ip 10.1.1.7 bot:latest
```

## Import from SQL db

If you want to run import from the previous version of the Bot (https://github.com/northis/YellowDuck), go to `src\bot\chineseDuck.Import` folder and add a `appsettings.json` based on `appsettings.template.json`.
