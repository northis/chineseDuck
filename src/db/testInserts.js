var owner = NumberLong(100);

function getNextSequence(name) {
  var ret = db.counters.findAndModify({
    query: { _id: name },
    update: { $inc: { seq: 1 } },
    new: true,
    upsert: true
  });

  return ret.seq;
}
for (var counter = 1; counter < 100; counter++) {
  var id = getNextSequence("folderid");
  db.folders.insert({
    _id: NumberLong(id),
    name:
      "Folder " +
      id.toLocaleString("en-US", {
        minimumIntegerDigits: 4,
        useGrouping: false
      }),
    owner_id: owner,
    createDate: ISODate()
  });
}
