#!/bin/bash
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
   exit 1
fi

if ! [ -x "$(command -v docker-compose)" ]; then
    echo "Please, install docker compose"
   exit 1
fi

# Load up .env
echo "Loading from your .env file..."
set -o allexport
[[ -f .env ]] && source .env
set +o allexport

cd config
echo "Applying the settings..."

#replace keys.js
sed -e "s/USER:PASSWORD/$MONGO_API_USER:$MONGO_API_PASSWORD/;\
 s/TELEGRAM_BOT_KEY/$TELEGRAM_BOT_KEY/; s/SESSION_PASS/$SESSION_PASSWORD/" \
keys.template.js > keys.js

#replace appsettings.json
sed -r -e "s/webpartsite.com/$PUBLIC_URL/; s/TELEGRAM_BOT_KEY/$TELEGRAM_BOT_KEY/; \
s/PWD/$SERVICE_COMMAND/; s/(\"AdminUserId\":\s)([0-9]+)/\1$ADMIN_USER_ID/g; \
s/(\"ServerUserId\":\s)([0-9]+)/\1$SERVER_USER_ID/g; s/(\"UserId\":\s)([0-9]+)/\1$USER_ID/g" appsettings.template.json > appsettings.json

#replace db.js
sed -e "s/adminPassword/$MONGO_ADMIN_PASSWORD/;\
s/apiUser/$MONGO_API_USER/;s/apiPassword/$MONGO_API_PASSWORD/" db.template.js > db.js

#replace websrv.conf
sed -e "s/SERVER_NAME/$PUBLIC_URL/; s/TELEGRAM_BOT_KEY/$TELEGRAM_BOT_KEY/" \
websrv.template.conf > websrv.conf

cd ..
#replace docker-compose.prod.yml
sed -e "s/CERT_EMAIL/$CERT_EMAIL/; s/MONGO_INITDB_ROOT_PASSWORD=pwd/\
 MONGO_INITDB_ROOT_PASSWORD=$MONGO_ADMIN_PASSWORD/; \
 s/PUBLIC_URL/$PUBLIC_URL/" docker-compose.yml > docker-compose.prod.yml

echo "Building node api & bot..."
npm install
npm run build
cd src/bot/chineseDuck.BotService
dotnet publish -c release /p:NoBuild=false
cd ../../..

echo "Running containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d --force-recreate

echo "Reloading proxy nginx server..."
sleep .10
docker exec duck_web nginx -s reload
exit

