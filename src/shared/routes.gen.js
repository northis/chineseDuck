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
  _user_auth:
   { value: '/user/auth',
     actions: { post: ["read"] },
     express: '/user/auth' },
  _user_login:
   { value: '/user/login',
     actions: { post: ["read"] },
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