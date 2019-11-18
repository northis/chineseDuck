use admin;
db.auth('admin', 'adminPassword');
use chineseDuck;
db.createUser(
  {
    user: "apiUser",
    pwd: "apiPassword",
    roles: [{ role: "readWrite", db: "chineseDuck" }]
  }
);