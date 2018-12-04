using System.Collections.Generic;
using ChineseDuck.Bot.Rest.Client;
using ChineseDuck.Bot.Rest.Model;
using RestSharp;

namespace ChineseDuck.Bot.Rest.Api
{
    /// <summary>
    /// Represents a collection of functions to interact with the API endpoints
    /// </summary>
    public interface IFolderApi
    {
        /// <summary>
        /// Create folder 
        /// </summary>
        /// <param name="folder">Created folder object</param>
        /// <returns></returns>
        void CreateFolder (Folder folder);
        /// <summary>
        /// Create folder for specified user 
        /// </summary>
        /// <param name="userId">User id</param>
        /// <param name="folder">Created folder object</param>
        /// <returns></returns>
        void CreateFolderForUser (long? userId, Folder folder);
        /// <summary>
        /// Delete folder 
        /// </summary>
        /// <param name="folderId">The folder id that needs to be deleted.</param>
        /// <returns></returns>
        void DeleteFolder (long? folderId);
        /// <summary>
        /// Get folders for current user 
        /// </summary>
        /// <returns>List&lt;Folder&gt;</returns>
        List<Folder> GetFoldersForCurrentUser ();
        /// <summary>
        /// Get folders for user 
        /// </summary>
        /// <param name="userId">User id</param>
        /// <returns>List&lt;Folder&gt;</returns>
        List<Folder> GetFoldersForUser (long? userId);
        /// <summary>
        ///  Get words by folder id
        /// </summary>
        /// <param name="folderId">Folder id</param>
        /// <returns>List&lt;Word&gt;</returns>
        List<Word> GetWordsFolderId (long? folderId);
        /// <summary>
        /// Move words to another folder 
        /// </summary>
        /// <param name="folderId">Folder id to move in</param>
        /// <param name="requestBody">Word ids</param>
        /// <returns></returns>
        void MoveWordsToFolder (long? folderId, List<long?> requestBody);
        /// <summary>
        /// Set current folder for user This can only be done by the logged in user.
        /// </summary>
        /// <param name="folderId">The user id that needs to be updated.</param>
        /// <returns></returns>
        void SetCurrentFolder (long? folderId);
        /// <summary>
        /// Update folder (rename) 
        /// </summary>
        /// <param name="folderId">The folder id that needs to be deleted.</param>
        /// <param name="folder">folder with new name</param>
        /// <returns></returns>
        void UpdateFolder (long? folderId, Folder folder);
    }
  
    /// <summary>
    /// Represents a collection of functions to interact with the API endpoints
    /// </summary>
    public class FolderApi : IFolderApi
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="FolderApi"/> class.
        /// </summary>
        /// <param name="apiClient"> an instance of ApiClient (optional)</param>
        /// <returns></returns>
        public FolderApi(ApiClient apiClient = null)
        {
            if (apiClient == null) // use the default one in Configuration
                ApiClient = Configuration.DefaultApiClient; 
            else
                ApiClient = apiClient;
        }
    
        /// <summary>
        /// Initializes a new instance of the <see cref="FolderApi"/> class.
        /// </summary>
        /// <returns></returns>
        public FolderApi(string basePath)
        {
            ApiClient = new ApiClient(basePath);
        }
    
        /// <summary>
        /// Sets the base path of the API client.
        /// </summary>
        /// <param name="basePath">The base path</param>
        /// <value>The base path</value>
        public void SetBasePath(string basePath)
        {
            ApiClient.BasePath = basePath;
        }
    
        /// <summary>
        /// Gets the base path of the API client.
        /// </summary>
        /// <param name="basePath">The base path</param>
        /// <value>The base path</value>
        public string GetBasePath(string basePath)
        {
            return ApiClient.BasePath;
        }
    
        /// <summary>
        /// Gets or sets the API client.
        /// </summary>
        /// <value>An instance of the ApiClient</value>
        public ApiClient ApiClient {get; set;}
    
        /// <summary>
        /// Create folder 
        /// </summary>
        /// <param name="folder">Created folder object</param> 
        /// <returns></returns>            
        public void CreateFolder (Folder folder)
        {
            
            // verify the required parameter 'folder' is set
            if (folder == null) throw new ApiException(400, "Missing required parameter 'folder' when calling CreateFolder");
            
    
            var path = "/folder";
            path = path.Replace("{format}", "json");
                
            var queryParams = new Dictionary<string, string>();
            var headerParams = new Dictionary<string, string>();
            var formParams = new Dictionary<string, string>();
            var fileParams = new Dictionary<string, FileParameter>();
            string postBody = null;
    
                                                postBody = ApiClient.Serialize(folder); // http body (model) parameter
    
            // authentication setting, if any
            string[] authSettings = { "cookieAuth" };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.POST, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if ((int)response.StatusCode >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling CreateFolder: " + response.Content, response.Content);
            if ((int)response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling CreateFolder: " + response.ErrorMessage, response.ErrorMessage);
        }
    
        /// <summary>
        /// Create folder for specified user 
        /// </summary>
        /// <param name="userId">User id</param> 
        /// <param name="folder">Created folder object</param> 
        /// <returns></returns>            
        public void CreateFolderForUser (long? userId, Folder folder)
        {
            
            // verify the required parameter 'userId' is set
            if (userId == null) throw new ApiException(400, "Missing required parameter 'userId' when calling CreateFolderForUser");
            
            // verify the required parameter 'folder' is set
            if (folder == null) throw new ApiException(400, "Missing required parameter 'folder' when calling CreateFolderForUser");
            
    
            var path = "/folder/user/{userId}";
            path = path.Replace("{format}", "json");
            path = path.Replace("{" + "userId" + "}", ApiClient.ParameterToString(userId));
    
            var queryParams = new Dictionary<string, string>();
            var headerParams = new Dictionary<string, string>();
            var formParams = new Dictionary<string, string>();
            var fileParams = new Dictionary<string, FileParameter>();
            string postBody = null;
    
                                                postBody = ApiClient.Serialize(folder); // http body (model) parameter
    
            // authentication setting, if any
            string[] authSettings = { "cookieAuth" };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.POST, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if ((int)response.StatusCode >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling CreateFolderForUser: " + response.Content, response.Content);
            if ((int)response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling CreateFolderForUser: " + response.ErrorMessage, response.ErrorMessage);
        }
    
        /// <summary>
        /// Delete folder 
        /// </summary>
        /// <param name="folderId">The folder id that needs to be deleted.</param> 
        /// <returns></returns>            
        public void DeleteFolder (long? folderId)
        {
            
            // verify the required parameter 'folderId' is set
            if (folderId == null) throw new ApiException(400, "Missing required parameter 'folderId' when calling DeleteFolder");
            
    
            var path = "/folder/{folderId}";
            path = path.Replace("{format}", "json");
            path = path.Replace("{" + "folderId" + "}", ApiClient.ParameterToString(folderId));
    
            var queryParams = new Dictionary<string, string>();
            var headerParams = new Dictionary<string, string>();
            var formParams = new Dictionary<string, string>();
            var fileParams = new Dictionary<string, FileParameter>();
            string postBody = null;
    
                                                    
            // authentication setting, if any
            string[] authSettings = { "cookieAuth" };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.DELETE, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if ((int)response.StatusCode >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling DeleteFolder: " + response.Content, response.Content);
            if ((int)response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling DeleteFolder: " + response.ErrorMessage, response.ErrorMessage);
        }
    
        /// <summary>
        /// Get folders for current user 
        /// </summary>
        /// <returns>List&lt;Folder&gt;</returns>            
        public List<Folder> GetFoldersForCurrentUser ()
        {
            
    
            var path = "/folder";
            path = path.Replace("{format}", "json");
                
            var queryParams = new Dictionary<string, string>();
            var headerParams = new Dictionary<string, string>();
            var formParams = new Dictionary<string, string>();
            var fileParams = new Dictionary<string, FileParameter>();
            string postBody = null;
    
                                                    
            // authentication setting, if any
            string[] authSettings = { "cookieAuth" };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.GET, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if ((int)response.StatusCode >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling GetFoldersForCurrentUser: " + response.Content, response.Content);
            if ((int)response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling GetFoldersForCurrentUser: " + response.ErrorMessage, response.ErrorMessage);

            return (List<Folder>) ApiClient.Deserialize(response.Content, typeof(List<Folder>), response.Headers);
        }
    
        /// <summary>
        /// Get folders for user 
        /// </summary>
        /// <param name="userId">User id</param> 
        /// <returns>List&lt;Folder&gt;</returns>            
        public List<Folder> GetFoldersForUser (long? userId)
        {
            
            // verify the required parameter 'userId' is set
            if (userId == null) throw new ApiException(400, "Missing required parameter 'userId' when calling GetFoldersForUser");
            
    
            var path = "/folder/user/{userId}";
            path = path.Replace("{format}", "json");
            path = path.Replace("{" + "userId" + "}", ApiClient.ParameterToString(userId));
    
            var queryParams = new Dictionary<string, string>();
            var headerParams = new Dictionary<string, string>();
            var formParams = new Dictionary<string, string>();
            var fileParams = new Dictionary<string, FileParameter>();
            string postBody = null;
    
                                                    
            // authentication setting, if any
            string[] authSettings = { "cookieAuth" };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.GET, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if ((int)response.StatusCode >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling GetFoldersForUser: " + response.Content, response.Content);
            if ((int)response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling GetFoldersForUser: " + response.ErrorMessage, response.ErrorMessage);

            return (List<Folder>) ApiClient.Deserialize(response.Content, typeof(List<Folder>), response.Headers);
        }
    
        /// <summary>
        ///  Get words by folder id
        /// </summary>
        /// <param name="folderId">Folder id</param> 
        /// <returns>List&lt;Word&gt;</returns>            
        public List<Word> GetWordsFolderId (long? folderId)
        {
            
            // verify the required parameter 'folderId' is set
            if (folderId == null) throw new ApiException(400, "Missing required parameter 'folderId' when calling GetWordsFolderId");
            
    
            var path = "/word/folder/{folderId}";
            path = path.Replace("{format}", "json");
            path = path.Replace("{" + "folderId" + "}", ApiClient.ParameterToString(folderId));
    
            var queryParams = new Dictionary<string, string>();
            var headerParams = new Dictionary<string, string>();
            var formParams = new Dictionary<string, string>();
            var fileParams = new Dictionary<string, FileParameter>();
            string postBody = null;
    
                                                    
            // authentication setting, if any
            string[] authSettings = { "cookieAuth" };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.GET, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if ((int)response.StatusCode >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling GetWordsFolderId: " + response.Content, response.Content);
            if ((int)response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling GetWordsFolderId: " + response.ErrorMessage, response.ErrorMessage);

            return (List<Word>) ApiClient.Deserialize(response.Content, typeof(List<Word>), response.Headers);
        }
    
        /// <summary>
        /// Move words to another folder 
        /// </summary>
        /// <param name="folderId">Folder id to move in</param> 
        /// <param name="requestBody">Word ids</param> 
        /// <returns></returns>            
        public void MoveWordsToFolder (long? folderId, List<long?> requestBody)
        {
            
            // verify the required parameter 'folderId' is set
            if (folderId == null) throw new ApiException(400, "Missing required parameter 'folderId' when calling MoveWordsToFolder");
            
            // verify the required parameter 'requestBody' is set
            if (requestBody == null) throw new ApiException(400, "Missing required parameter 'requestBody' when calling MoveWordsToFolder");
            
    
            var path = "/word/folder/{folderId}";
            path = path.Replace("{format}", "json");
            path = path.Replace("{" + "folderId" + "}", ApiClient.ParameterToString(folderId));
    
            var queryParams = new Dictionary<string, string>();
            var headerParams = new Dictionary<string, string>();
            var formParams = new Dictionary<string, string>();
            var fileParams = new Dictionary<string, FileParameter>();
            string postBody = null;
    
                                                postBody = ApiClient.Serialize(requestBody); // http body (model) parameter
    
            // authentication setting, if any
            string[] authSettings = { "cookieAuth" };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.PUT, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if ((int)response.StatusCode >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling MoveWordsToFolder: " + response.Content, response.Content);
            if ((int)response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling MoveWordsToFolder: " + response.ErrorMessage, response.ErrorMessage);
        }
    
        /// <summary>
        /// Set current folder for user This can only be done by the logged in user.
        /// </summary>
        /// <param name="folderId">The user id that needs to be updated.</param> 
        /// <returns></returns>            
        public void SetCurrentFolder (long? folderId)
        {
            
            // verify the required parameter 'folderId' is set
            if (folderId == null) throw new ApiException(400, "Missing required parameter 'folderId' when calling SetCurrentFolder");
            
    
            var path = "/user/currentFolder/{folderId}";
            path = path.Replace("{format}", "json");
            path = path.Replace("{" + "folderId" + "}", ApiClient.ParameterToString(folderId));
    
            var queryParams = new Dictionary<string, string>();
            var headerParams = new Dictionary<string, string>();
            var formParams = new Dictionary<string, string>();
            var fileParams = new Dictionary<string, FileParameter>();
            string postBody = null;
    
                                                    
            // authentication setting, if any
            string[] authSettings = { "cookieAuth" };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.PUT, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if ((int)response.StatusCode >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling SetCurrentFolder: " + response.Content, response.Content);
            if ((int)response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling SetCurrentFolder: " + response.ErrorMessage, response.ErrorMessage);
        }
    
        /// <summary>
        /// Update folder (rename) 
        /// </summary>
        /// <param name="folderId">The folder id that needs to be deleted.</param> 
        /// <param name="folder">folder with new name</param> 
        /// <returns></returns>            
        public void UpdateFolder (long? folderId, Folder folder)
        {
            
            // verify the required parameter 'folderId' is set
            if (folderId == null) throw new ApiException(400, "Missing required parameter 'folderId' when calling UpdateFolder");
            
            // verify the required parameter 'folder' is set
            if (folder == null) throw new ApiException(400, "Missing required parameter 'folder' when calling UpdateFolder");
            
    
            var path = "/folder/{folderId}";
            path = path.Replace("{format}", "json");
            path = path.Replace("{" + "folderId" + "}", ApiClient.ParameterToString(folderId));
    
            var queryParams = new Dictionary<string, string>();
            var headerParams = new Dictionary<string, string>();
            var formParams = new Dictionary<string, string>();
            var fileParams = new Dictionary<string, FileParameter>();
            string postBody = null;
    
                                                postBody = ApiClient.Serialize(folder); // http body (model) parameter
    
            // authentication setting, if any
            string[] authSettings = { "cookieAuth" };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.PUT, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if ((int)response.StatusCode >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling UpdateFolder: " + response.Content, response.Content);
            if ((int)response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling UpdateFolder: " + response.ErrorMessage, response.ErrorMessage);
        }
    
    }
}
