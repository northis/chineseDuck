db.auth('admin', 'adminPassword');
db.createUser(
  {
    user: "apiUser",
    pwd: "apiPassword",
    roles: [{ role: "readWrite", db: "chineseDuck" }]
  }
);