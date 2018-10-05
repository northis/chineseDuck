export default { _word:
   { value: '/word',
     actions: { put: ["admin"], post: ["admin"] },
     express: '/word' },
  _word_import:
   { value: '/word/import',
     actions: { post: ["write"] },
     express: '/word/import' },
  _word_folder__folderId_:
   { value: '/word/folder/{folderId}',
     actions: { get: ["read"], put: ["write"] },
     express: '/word/folder/:folderId' },
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
     actions: { get: ["read"], delete: ["write"] },
     express: '/word/:wordId' },
  _word_user__userId__search__wordEntry_:
   { value: '/word/user/{userId}/search/{wordEntry}',
     actions: { get: ["read"] },
     express: '/word/user/:userId/search/:wordEntry' },
  _word_file__fileId_:
   { value: '/word/file/{fileId}',
     actions: { get: ["read"] },
     express: '/word/file/:fileId' },
  _folder:
   { value: '/folder',
     actions: { get: ["read"], post: ["write"] },
     express: '/folder' },
  _folder_user__userId_:
   { value: '/folder/user/{userId}',
     actions: { get: ["admin"] },
     express: '/folder/user/:userId' },
  _folder__folderId_:
   { value: '/folder/{folderId}',
     actions: { put: ["write"], delete: ["write"] },
     express: '/folder/:folderId' },
  _user:
   { value: '/user',
     actions: { get: ["read"], post: ["admin"] },
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
     actions: { get: ["read","write"] },
     express: '/user/logout' },
  _user__id_:
   { value: '/user/{id}',
     actions: { get: ["admin"], put: ["admin"], delete: ["admin"] },
     express: '/user/:id' },
  _user_currentFolder__folderId_:
   { value: '/user/currentFolder/{folderId}',
     actions: { put: ["write"] },
     express: '/user/currentFolder/:folderId' },
  _service_datetime:
   { value: '/service/datetime',
     actions: { get: ["admin"] },
     express: '/service/datetime' } }