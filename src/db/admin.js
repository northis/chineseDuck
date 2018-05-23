use admin
db.createUser(
  {
    user: "admin",
    pwd: "supassword",
    roles: [ { role: "root", db: "admin" } ]
  }
)