import * as helpers from "../../config/helpers";

before(done => {
  done();
});

after(() => {});

describe("Helper tests", function() {
  it("updateRoutesFromSwagger", async function() {
    helpers.updateRoutesFromSwagger();
    //expect(userObj.username).to.eql(insertedUser.username);
  });
});
