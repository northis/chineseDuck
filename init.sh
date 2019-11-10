#!/bin/bash
#root db admin in mongo
MONGO_ADMIN_USER="admin"
MONGO_ADMIN_PASSWORD="pwd"

#main user in db for API
MONGO_API_USER="apiUser"
MONGO_API_PASSWORD="qipassword"

#telegram bot token
TELEGRAM_BOT_KEY="100000001:BAAAAAAAAAAAAA_AAAAAAAAAAAAAAAAAAAB"

#address for Webhooks in bot, API and web-UI.
PUBLIC_URL="new-site.com"

#secret bot command for administrative purposes
SERVICE_COMMAND="pwd"

cd config

#replace keys.js
sed -e "s/user:password@servername/$MONGO_API_USER:$MONGO_API_PASSWORD/;\
 s/TELEGRAM_BOT_KEY/$TELEGRAM_BOT_KEY/" keys.template.js > keys.js

#replace appsettings.json
sed -e "s/webpartsite.com/$PUBLIC_URL/; s/TELEGRAM_BOT_KEY/$TELEGRAM_BOT_KEY/;\
s/PWD/$SERVICE_COMMAND/" appsettings.template.json > appsettings.json

#replace db.js
sed -e "s/adminUser/$MONGO_ADMIN_USER/; s/adminPassword/$MONGO_ADMIN_PASSWORD/;\
s/apiUser/$MONGO_API_USER/;s/apiPassword/$MONGO_API_PASSWORD/" db.template.js > db.js

#replace websrv.conf
sed -e "s/SERVER_NAME/$PUBLIC_URL/; s/TELEGRAM_BOT_KEY/$TELEGRAM_BOT_KEY/" \
websrv.template.conf > websrv.conf

cd ..
# we don't want to publish changes in this file
git update-index --assume-unchanged init.sh
exit

