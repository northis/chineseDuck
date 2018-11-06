import { getExpressApp } from "./_first.test";
import request from "supertest";
let app = null;

before(done => {
  app = getExpressApp();
  done();
});

describe("web api tests", function() {
  it("test1", function(done) {
    // request(app)
    //   .get("/api/v1/")
    //   .expect("Hello Test")
    //   .end(done);

    done();
  });
});
