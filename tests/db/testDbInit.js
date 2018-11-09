import * as testEntities from "./testEntities";
import mh from "../../src/server/api/db";

export const init = async () => {
    console.log("Start test db init");
    const userWrite = await mh.user.create(testEntities.userWrite);
    // await mh.user.create(testEntities.userAdmin);
    const userWriteFolder = testEntities.folderTemplate;

    userWriteFolder.owner_id = userWrite._id;

    await mh.folder.create(testEntities.folderTemplate);
    // await mh.word.create(testEntities.wordBreakfast);
    // await mh.word.create(testEntities.wordDinner);
    // await mh.word.create(testEntities.wordSupper);
    console.log("Finish test db init");
}