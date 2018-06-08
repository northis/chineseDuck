export default { _word: { value: '/word', actions: { post: 'post', put: 'put' } },
  _word_import: { value: '/word/import', actions: { post: 'post' } },
  _word_folder__folderId_: { value: '/word/folder/{folderId}', actions: { put: 'put' } },
  _word__wordId__rename: { value: '/word/{wordId}/rename', actions: { put: 'put' } },
  _word__wordId__score: { value: '/word/{wordId}/score', actions: { put: 'put' } },
  _word__wordId_: 
   { value: '/word/{wordId}',
     actions: { get: 'get', delete: 'delete' } },
  _word_user__userId__search__wordEntry_: 
   { value: '/word/user/{userId}/search/{wordEntry}',
     actions: { get: 'get' } },
  _word__wordId__file__fileTypeId_: 
   { value: '/word/{wordId}/file/{fileTypeId}',
     actions: { get: 'get' } },
  _folder: { value: '/folder', actions: { post: 'post' } },
  _folder_user__userId_: { value: '/folder/user/{userId}', actions: { get: 'get' } },
  _folder__folderId_: 
   { value: '/folder/{folderId}',
     actions: { delete: 'delete', put: 'put' } },
  _user: { value: '/user', actions: { post: 'post', get: 'get' } },
  _user_auth: { value: '/user/auth', actions: { post: 'post' } },
  _user_login: { value: '/user/login', actions: { post: 'post' } },
  _user_logout: { value: '/user/logout', actions: { get: 'get' } },
  _user__id_: 
   { value: '/user/{id}',
     actions: { get: 'get', put: 'put', delete: 'delete' } },
  _service_datetime: { value: '/service/datetime', actions: { get: 'get' } } }