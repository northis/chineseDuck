db.auth('adminUser', 'adminPassword');
db.createUser(
  {
    user: "apiUser",
    pwd: "apiPassword",
    roles: [{ role: "readWrite", db: "chineseDuck" }]
  }
);