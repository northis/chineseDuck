var lines = [];

db.words.find().forEach(function(a) {
  lines.push(a.full.id);
  lines.push(a.trans.id);
  lines.push(a.pron.id);
  lines.push(a.orig.id);
});

print(lines.length);
var wordFiles = [];
db.wordFiles.find({}, { _id: 1 }).forEach(function(wFile) {
  var val = wFile._id.valueOf();
  if (!lines.includes(val)) wordFiles.push(wFile._id);
});
print(wordFiles.length);
db.wordFiles.deleteMany(
  {
    _id: {
      $in: wordFiles
    }
  },
  function(err) {}
);
var cnt = db.wordFiles.find({}).count();
print(cnt);
