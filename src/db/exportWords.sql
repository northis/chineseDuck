SELECT w.Id as _id, w.OriginalWord as originalWord, w.Pronunciation as pronunciation, w.LastModified as lastModified , w.Translation as translation, w.Usage as usage, w.IdOwner as owner_id, 0 as folder_id, w.SyllablesCount as syllablesCount, sc.IsInLearnMode as 'score.isInLearnMode',
  sc.LastLearned as 'score.lastLearned',
  sc.LastLearnMode as 'score.lastLearnMode',
  sc.LastView as 'score.lastView',
  sc.OriginalWordCount as 'score.originalWordCount',
  sc.OriginalWordSuccessCount as 'score.originalWordSuccessCount',
  sc.PronunciationCount as 'score.pronunciationCount',
  sc.PronunciationSuccessCount as 'score.pronunciationSuccessCount',
  sc.RightAnswerNumber as 'score.rightAnswerNumber',
  sc.TranslationCount as 'score.translationCount',
  sc.TranslationSuccessCount as 'score.translationSuccessCount',
  sc.ViewCount as 'score.viewCount',
  wordA.Height as 'full.height',
  wordA.Width as 'full.weight',
  wordA.CreateDate as 'full.createDate',

  wordO.Height as 'orig.height',
  wordO.Width as 'orig.weight',
  wordO.CreateDate as 'orig.createDate',

  wordP.Height as 'pron.height',
  wordP.Width as 'pron.weight',
  wordP.CreateDate as 'pron.createDate',

  wordT.Height as 'trans.height',
  wordT.Width as 'trans.weight',
  wordT.CreateDate as 'trans.createDate'
from
  [LearnChinese].[dbo].[Word] w join [LearnChinese].[dbo].[Score] sc on (sc.IdWord = w.Id)
  join [LearnChinese].[dbo].WordFileA wordA on (w.Id = wordA.IdWord)
  join [LearnChinese].[dbo].WordFileO wordO on (w.Id = wordO.IdWord)
  join [LearnChinese].[dbo].WordFileP wordP on (w.Id = wordP.IdWord)
  join [LearnChinese].[dbo].WordFileT wordT on (w.Id = wordT.IdWord)

where sc.IdUser <> 71881429 and sc.IdUser <> 83276694 and w.IdOwner <> 71881429 and w.IdOwner <> 83276694
FOR JSON PATH