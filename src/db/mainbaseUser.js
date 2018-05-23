use chineseDuck
db.createUser(
  {
    user: "apiUser",
    pwd: "qipassword",
    roles: [ { role: "readWrite", db: "chineseDuck" } ]
  }
)