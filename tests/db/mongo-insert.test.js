import { Users, /*Folders, WordFiles, Words,*/ connectItem  } from "../../src/server/api/db";
import { RightEnum, /*FileTypeEnum, LearnModeEnum, Words,*/ } from "../../src/server/api/db/models";
import { expect } from "chai";
import * as setup from "./setup";
import * as teardown from "./teardown";

let connection;
let db;

before(async done => {
  setup.default();

  db.on('error', console.error.bind(console, 'connection error'));
  db.once('open', function() {
    console.info('We are connected to test database!');
    done();
  });
  connection = connectItem;
  db = await connection.db(global.__MONGO_DB_NAME__);
});

after(async done => {
  await teardown.default();
  await db.close();
  await connection.close(done);
});

it("should insert a doc into collection", async () => {

  var user = new Users({ username: "username", tokenHash: "tokenHash", sessionId: "sessionId", lastCommand: "lastCommand", joinDate : Date.UTC(Date.now), who: RightEnum.write, mode: "mode" });
  await user.save(function(err) {
    if (err) console.error(err);
    // saved!
  });

  const insertedUser = await Users.findOne({ _id: user._id });
  expect(insertedUser).toEqual(user);
});

