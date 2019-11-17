#!/bin/bash
#root db admin in mongo
MONGO_ADMIN_PASSWORD="mopassword"

#main user in db for API
MONGO_API_USER="apiUser"
MONGO_API_PASSWORD="qipassword"

#telegram bot token
TELEGRAM_BOT_KEY="100000001:BAAAAAAAAAAAAA_AAAAAAAAAAAAAAAAAAAB"

#address for Webhooks in bot, API and web-UI.
PUBLIC_URL="new-site.com"
#secret bot command for administrative purposes
CERT_EMAIL="north@live.ru"

#secret bot command for administrative purposes
SERVICE_COMMAND="pepyaka"

#secret bot command for administrative purposes
SESSION_PASSWORD="toporno"

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

# we don't want to publish changes in this file
git update-index --assume-unchanged init.sh
npm install
npm run build
cd src/bot/chineseDuck.BotService
dotnet build -c release
dotnet publish -c release
cd ../../..

docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d # --force-recreate
docker exec websrv nginx -s reload
exit

