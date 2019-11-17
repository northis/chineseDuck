#!/bin/bash

# Load up .env
set -o allexport
[[ -f .env ]] && source .env
set +o allexport

cd config

#replace keys.js
sed -e "s/USER:PASSWORD/$MONGO_API_USER:$MONGO_API_PASSWORD/;\
 s/TELEGRAM_BOT_KEY/$TELEGRAM_BOT_KEY/; s/SESSION_PASS/$SESSION_PASSWORD/" \
keys.template.js > keys.js

#replace appsettings.json
sed -e "s/webpartsite.com/$PUBLIC_URL/; s/TELEGRAM_BOT_KEY/$TELEGRAM_BOT_KEY/;\
s/PWD/$SERVICE_COMMAND/" appsettings.template.json > appsettings.json

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
dotnet build -c release
dotnet publish -c release
cd ../../..

echo "Running containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d # --force-recreate
echo "Reloading proxy nginx server..."
docker exec duck_web nginx -s reload
exit

