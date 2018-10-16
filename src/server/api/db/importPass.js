import { mh } from "./index";
import { FileTypeEnum } from "./models";

async function ProcessDb() {
  const words = await mh.word.find({});

  for (const word of words) {
    const fullFile = await mh.wordFile.findOne({
      word_id: word._id,
      fileType: FileTypeEnum.full
    });

    word.full.id = fullFile._id;

    await mh.word.updateOne({ _id: word._id }, { full: word.full });

    const transFile = await mh.wordFile.findOne({
      word_id: word._id,
      fileType: FileTypeEnum.trans
    });

    word.trans.id = transFile._id;

    await mh.word.updateOne({ _id: word._id }, { trans: word.pron });

    const pronFile = await mh.wordFile.findOne({
      word_id: word._id,
      fileType: FileTypeEnum.pron
    });

    word.pron.id = pronFile._id;

    await mh.word.updateOne({ _id: word._id }, { pron: word.pron });

    const origFile = await mh.wordFile.findOne({
      word_id: word._id,
      fileType: FileTypeEnum.orig
    });

    word.orig.id = origFile._id;

    await mh.word.updateOne({ _id: word._id }, { orig: word.orig });
  }
  console.info("processing is completed");
}

async function CleanWordFiles() {
  await mh.wordFileOld.updateMany(
    {},
    {
      $unset: {
        word_id: 1,
        createDate: 1,
        height: 1,
        width: 1,
        fileType: 1
      }
    }
  );

  console.info("cleaning is completed");
}

async function ShareWords(idUserFrom, idUserTo) {
  const words = await mh.word.find({ owner_id: idUserFrom });

  for (const word of words) {
    const wordClone = JSON.parse(JSON.stringify(word));
    wordClone.owner_id = idUserTo;
    await mh.word.create(wordClone);
  }
  //await mh.word.insertMany(words);
  console.info("creation is completed");
}

ShareWords(83276694, 100);
// ProcessDb();
// CleanWordFiles();
