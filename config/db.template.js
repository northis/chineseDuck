use admin
db.createUser(
  {
    user: "admin",
    pwd: "supassword",
    roles: [{ role: "root", db: "admin" }]
  }
);
use chineseDuck
db.createUser(
  {
    user: "apiUser",
    pwd: "qipassword",
    roles: [{ role: "readWrite", db: "chineseDuck" }]
  }
);