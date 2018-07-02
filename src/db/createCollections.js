use chineseDuck

db.createCollection("users")

db.createCollection("wordFiles")

db.createCollection("folders")

db.folders.createIndex(
    { owner_id: 1, name: "" }, { unique: true }
)

db.folders.createIndex({ name: "text" })

db.createCollection("words")

db.words.createIndex(
    { originalWord: "text", owner_id: 1 },
    { language_override: "hans" })

db.words.createIndex(
    { lastModified: -1 })


db.counters.insert(
    {
        _id: "userid",
        seq: 0
    }
)