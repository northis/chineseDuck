export default { _word: 
   { value: '/word',
     actions: { post: ["admin"], put: ["admin"] } },
  _word_import: { value: '/word/import', actions: { post: ["write"] } },
  _word_folder__folderId_: 
   { value: '/word/folder/{folderId}',
     actions: { put: ["write"] } },
  _word__wordId__rename: 
   { value: '/word/{wordId}/rename',
     actions: { put: ["write"] } },
  _word__wordId__score: { value: '/word/{wordId}/score', actions: { put: ["admin"] } },
  _word__wordId_: 
   { value: '/word/{wordId}',
     actions: { get: ["read"], delete: ["write"] } },
  _word_user__userId__search__wordEntry_: 
   { value: '/word/user/{userId}/search/{wordEntry}',
     actions: { get: ["read"] } },
  _word__wordId__file__fileTypeId_: 
   { value: '/word/{wordId}/file/{fileTypeId}',
     actions: { get: ["read"] } },
  _folder: 
   { value: '/folder',
     actions: { post: ["write"], get: ["read"] } },
  _folder_user__userId_: 
   { value: '/folder/user/{userId}',
     actions: { get: ["admin"] } },
  _folder__folderId_: 
   { value: '/folder/{folderId}',
     actions: { delete: ["write"], put: ["write"] } },
  _user: 
   { value: '/user',
     actions: { post: ["admin"], get: ["read"] } },
  _user_auth: { value: '/user/auth', actions: { post: ["read"] } },
  _user_login: { value: '/user/login', actions: { post: ["read"] } },
  _user_logout: { value: '/user/logout', actions: { get: ["read","write"] } },
  _user__id_: 
   { value: '/user/{id}',
     actions: { get: ["admin"], put: ["admin"], delete: ["admin"] } },
  _service_datetime: { value: '/service/datetime', actions: { get: ["admin"] } } }