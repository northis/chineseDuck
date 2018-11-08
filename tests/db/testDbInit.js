import * as testEntities from "./testEntities";
import mh from "../../src/server/api/db";

export const init = async () => {
    console.log("Start test db init");
    // console.log(testEntities.userWrite);
    await mh.user.create(testEntities.userWrite);
    console.log("Finish test db init");
}