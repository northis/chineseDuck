export default { _word:
   { value: '/word',
     actions: { post: ["admin"], put: ["admin"] },
     express: '/word' },
  _word_folder__folderId_:
   { value: '/word/folder/{folderId}',
     actions: { put: ["write"] },
     express: '/word/folder/:folderId' },
  _word_folder__folderId__count__count_:
   { value: '/word/folder/{folderId}/count/{count}',
     actions: { get: ["write"] },
     express: '/word/folder/:folderId/count/:count' },
  _word_folder__folderId__user__userId__count__count_:
   { value: '/word/folder/{folderId}/user/{userId}/count/{count}',
     actions: { get: ["admin"] },
     express: '/word/folder/:folderId/user/:userId/count/:count' },
  _word__wordId__rename:
   { value: '/word/{wordId}/rename',
     actions: { put: ["write"] },
     express: '/word/:wordId/rename' },
  _word__wordId__score:
   { value: '/word/{wordId}/score',
     actions: { put: ["admin"] },
     express: '/word/:wordId/score' },
  _word__wordId_:
   { value: '/word/{wordId}',
     actions: { get: ["write"], delete: ["write"] },
     express: '/word/:wordId' },
  _word_user__userId__search__wordEntry_:
   { value: '/word/user/{userId}/search/{wordEntry}',
     actions: { get: ["admin"] },
     express: '/word/user/:userId/search/:wordEntry' },
  _word_user__userId__nextWord__mode_:
   { value: '/word/user/{userId}/nextWord/{mode}',
     actions: { put: ["admin"] },
     express: '/word/user/:userId/nextWord/:mode' },
  _word_user__userId__answers:
   { value: '/word/user/{userId}/answers',
     actions: { get: ["admin"] },
     express: '/word/user/:userId/answers' },
  _word_user__userId__currentWord:
   { value: '/word/user/{userId}/currentWord',
     actions: { get: ["admin"] },
     express: '/word/user/:userId/currentWord' },
  _word_file__fileId_:
   { value: '/word/file/{fileId}',
     actions: { get: ["read"], delete: ["admin"] },
     express: '/word/file/:fileId' },
  _word_file:
   { value: '/word/file',
     actions: { post: ["admin"] },
     express: '/word/file' },
  _folder:
   { value: '/folder',
     actions: { post: ["write"], get: ["write"] },
     express: '/folder' },
  _folder_template:
   { value: '/folder/template',
     actions: { get: ["write"] },
     express: '/folder/template' },
  _folder_template_user__userId_:
   { value: '/folder/template/user/{userId}',
     actions: { post: ["admin"] },
     express: '/folder/template/user/:userId' },
  _folder_user__userId_:
   { value: '/folder/user/{userId}',
     actions: { get: ["admin"], post: ["admin"] },
     express: '/folder/user/:userId' },
  _folder__folderId_:
   { value: '/folder/{folderId}',
     actions: { delete: ["write"], put: ["write"] },
     express: '/folder/:folderId' },
  _user:
   { value: '/user',
     actions: { post: ["admin"], get: ["write"] },
     express: '/user' },
  _user_login:
   { value: '/user/login',
     actions: { get: ["read"] },
     express: '/user/login' },
  _user_logout:
   { value: '/user/logout',
     actions: { get: ["write"] },
     express: '/user/logout' },
  _user__userId_:
   { value: '/user/{userId}',
     actions: { get: ["admin"], put: ["admin"], delete: ["admin"] },
     express: '/user/:userId' },
  _user_currentFolder__folderId_:
   { value: '/user/currentFolder/{folderId}',
     actions: { put: ["write"] },
     express: '/user/currentFolder/:folderId' },
  _service_datetime:
   { value: '/service/datetime',
     actions: { get: ["read"] },
     express: '/service/datetime' } }