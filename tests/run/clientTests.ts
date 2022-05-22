import { expect } from "chai";
import * as JsSearch from "js-search";
import "mocha";
import { Tokenizer } from "../../src/client/services/Tokenizer";

describe("js search", () => {
  it("parse array", () => {
    const docs = [
      {
        _id: 0,
        foo: "我的好人"
      },
      {
        _id: 1,
        foo: "对不起"
      }
    ];

    const search = new JsSearch.Search("_id");
    search.tokenizer = new Tokenizer();
    search.addDocuments(docs);
    search.addIndex("foo");

    const res = search.search("我的好人");
    expect(res[0]).to.equal(docs[0]);
  });
});
