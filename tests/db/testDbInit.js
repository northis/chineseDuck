import * as testEntities from "./testEntities";
import mh from "../../src/server/api/db";
import { DebugKeys } from "../../config/common";

export const init = async () => {
  let userWrite = testEntities.userWrite;
  userWrite._id = DebugKeys.user_id;

  await createUser(userWrite);
  await createUser(testEntities.userAdmin);
};

export const wipeCollections = async () => {
  await mh.user.remove({});
  await mh.word.remove({});
  await mh.folder.remove({});
};

const createUser = async userEntity => {
  const userDb = await mh.user.create(userEntity);
  const folder = testEntities.folderTemplate;
  folder.owner_id = userDb._id;
  folder.wordsCount = 2;
  const folderDb = await mh.folder.create(folder);

  await mh.user.updateOne(
    { _id: userDb._id },
    { currentFolder_id: folderDb._id }
  );

  await mh.word.create(
    await setWord(testEntities.wordBreakfast, userDb._id, folderDb._id)
  );

  await mh.word.create(
    await setWord(testEntities.wordDinner, userDb._id, folderDb._id)
  );
  // await mh.word.create(
  //   await setWord(testEntities.wordSupper, userDb._id, folderDb._id)
  // );

  return userDb;
};

export async function setWord(word, idUser, idFolder) {
  let wordFile = await mh.wordFile.create(testEntities.wordFileInfoTemplate);
  word.full.id = wordFile.id;
  wordFile = await mh.wordFile.create(testEntities.wordFileInfoTemplate);
  word.trans.id = wordFile.id;
  wordFile = await mh.wordFile.create(testEntities.wordFileInfoTemplate);
  word.pron.id = wordFile.id;
  wordFile = await mh.wordFile.create(testEntities.wordFileInfoTemplate);
  word.orig.id = wordFile.id;

  word.owner_id = idUser;
  word.folder_id = idFolder;
  return word;
}
