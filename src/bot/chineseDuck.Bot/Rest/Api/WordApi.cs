using System.Collections.Generic;
using ChineseDuck.Bot.Rest.Client;
using ChineseDuck.Bot.Rest.Model;
using RestSharp;

namespace ChineseDuck.Bot.Rest.Api
{
    /// <summary>
    /// Represents a collection of functions to interact with the API endpoints
    /// </summary>
    public interface IWordApi
    {
        /// <summary>
        /// Add a new word to the store 
        /// </summary>
        /// <param name="word">Word object that needs to be added to the store</param>
        /// <returns></returns>
        void AddWord (Word word);
        /// <summary>
        /// Delete word 
        /// </summary>
        /// <param name="wordId">Word id to delete</param>
        /// <returns></returns>
        void DeleteWord (long? wordId);
        /// <summary>
        /// Get word&#39;s flash card as png binary 
        /// </summary>
        /// <param name="fileId">File id</param>
        /// <returns>byte[]</returns>
        byte[] GetWordCard (string fileId);
        /// <summary>
        ///  Get word by id
        /// </summary>
        /// <param name="wordId">Word id</param>
        /// <returns>Word</returns>
        Word GetWordId (long? wordId);
        /// <summary>
        /// Get words by word or character for user Get words by wordEntry for user
        /// </summary>
        /// <param name="wordEntry">Word entry</param>
        /// <param name="userId">User entry to match</param>
        /// <returns>List&lt;Word&gt;</returns>
        List<Word> GetWordsByUser (string wordEntry, long? userId);
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
        /// Rename words with another translation 
        /// </summary>
        /// <param name="wordId">Word id to rename</param>
        /// <param name="body">New translation</param>
        /// <returns></returns>
        void RenameWord (long? wordId, string body);
        /// <summary>
        /// Update user&#39;s score for word 
        /// </summary>
        /// <param name="wordId">Word id to rename</param>
        /// <param name="score">Score object that needs to be updated in the word</param>
        /// <returns></returns>
        void ScoreWord (long? wordId, Score score);
        /// <summary>
        /// Update an existing word 
        /// </summary>
        /// <param name="word">Word object that needs to be updated in the store</param>
        /// <returns></returns>
        void UpdateWord (Word word);
    }
  
    /// <summary>
    /// Represents a collection of functions to interact with the API endpoints
    /// </summary>
    public class WordApi : IWordApi
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="WordApi"/> class.
        /// </summary>
        /// <param name="apiClient"> an instance of ApiClient (optional)</param>
        /// <returns></returns>
        public WordApi(ApiClient apiClient = null)
        {
            if (apiClient == null) // use the default one in Configuration
                ApiClient = Configuration.DefaultApiClient; 
            else
                ApiClient = apiClient;
        }
    
        /// <summary>
        /// Initializes a new instance of the <see cref="WordApi"/> class.
        /// </summary>
        /// <returns></returns>
        public WordApi(string basePath)
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
        /// Add a new word to the store 
        /// </summary>
        /// <param name="word">Word object that needs to be added to the store</param> 
        /// <returns></returns>            
        public void AddWord (Word word)
        {
            
            // verify the required parameter 'word' is set
            if (word == null) throw new ApiException(400, "Missing required parameter 'word' when calling AddWord");
            
    
            var path = "/word";
            path = path.Replace("{format}", "json");
                
            var queryParams = new Dictionary<string, string>();
            var headerParams = new Dictionary<string, string>();
            var formParams = new Dictionary<string, string>();
            var fileParams = new Dictionary<string, FileParameter>();
            string postBody = null;
    
                                                postBody = ApiClient.Serialize(word); // http body (model) parameter
    
            // authentication setting, if any
            string[] authSettings = { "cookieAuth" };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.POST, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if ((int)response.StatusCode >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling AddWord: " + response.Content, response.Content);
            if ((int)response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling AddWord: " + response.ErrorMessage, response.ErrorMessage);
        }
    
        /// <summary>
        /// Delete word 
        /// </summary>
        /// <param name="wordId">Word id to delete</param> 
        /// <returns></returns>            
        public void DeleteWord (long? wordId)
        {
            
            // verify the required parameter 'wordId' is set
            if (wordId == null) throw new ApiException(400, "Missing required parameter 'wordId' when calling DeleteWord");
            
    
            var path = "/word/{wordId}";
            path = path.Replace("{format}", "json");
            path = path.Replace("{" + "wordId" + "}", ApiClient.ParameterToString(wordId));
    
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
                throw new ApiException ((int)response.StatusCode, "Error calling DeleteWord: " + response.Content, response.Content);
            if ((int)response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling DeleteWord: " + response.ErrorMessage, response.ErrorMessage);
        }
    
        /// <summary>
        /// Get word&#39;s flash card as png binary 
        /// </summary>
        /// <param name="fileId">File id</param> 
        /// <returns>byte[]</returns>            
        public byte[] GetWordCard (string fileId)
        {
            
            // verify the required parameter 'fileId' is set
            if (fileId == null) throw new ApiException(400, "Missing required parameter 'fileId' when calling GetWordCard");
            
    
            var path = "/word/file/{fileId}";
            path = path.Replace("{format}", "json");
            path = path.Replace("{" + "fileId" + "}", ApiClient.ParameterToString(fileId));
    
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
                throw new ApiException ((int)response.StatusCode, "Error calling GetWordCard: " + response.Content, response.Content);
            if ((int)response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling GetWordCard: " + response.ErrorMessage, response.ErrorMessage);

            return (byte[]) ApiClient.Deserialize(response.Content, typeof(byte[]), response.Headers);
        }
    
        /// <summary>
        ///  Get word by id
        /// </summary>
        /// <param name="wordId">Word id</param> 
        /// <returns>Word</returns>            
        public Word GetWordId (long? wordId)
        {
            
            // verify the required parameter 'wordId' is set
            if (wordId == null) throw new ApiException(400, "Missing required parameter 'wordId' when calling GetWordId");
            
    
            var path = "/word/{wordId}";
            path = path.Replace("{format}", "json");
            path = path.Replace("{" + "wordId" + "}", ApiClient.ParameterToString(wordId));
    
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
                throw new ApiException ((int)response.StatusCode, "Error calling GetWordId: " + response.Content, response.Content);
            if ((int)response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling GetWordId: " + response.ErrorMessage, response.ErrorMessage);

            return (Word) ApiClient.Deserialize(response.Content, typeof(Word), response.Headers);
        }
    
        /// <summary>
        /// Get words by word or character for user Get words by wordEntry for user
        /// </summary>
        /// <param name="wordEntry">Word entry</param> 
        /// <param name="userId">User entry to match</param> 
        /// <returns>List&lt;Word&gt;</returns>            
        public List<Word> GetWordsByUser (string wordEntry, long? userId)
        {
            
            // verify the required parameter 'wordEntry' is set
            if (wordEntry == null) throw new ApiException(400, "Missing required parameter 'wordEntry' when calling GetWordsByUser");
            
            // verify the required parameter 'userId' is set
            if (userId == null) throw new ApiException(400, "Missing required parameter 'userId' when calling GetWordsByUser");
            
    
            var path = "/word/user/{userId}/search/{wordEntry}";
            path = path.Replace("{format}", "json");
            path = path.Replace("{" + "wordEntry" + "}", ApiClient.ParameterToString(wordEntry));
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
                throw new ApiException ((int)response.StatusCode, "Error calling GetWordsByUser: " + response.Content, response.Content);
            if ((int)response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling GetWordsByUser: " + response.ErrorMessage, response.ErrorMessage);

            return (List<Word>) ApiClient.Deserialize(response.Content, typeof(List<Word>), response.Headers);
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
        /// Rename words with another translation 
        /// </summary>
        /// <param name="wordId">Word id to reaname</param> 
        /// <param name="body">New translation</param> 
        /// <returns></returns>            
        public void RenameWord (long? wordId, string body)
        {
            
            // verify the required parameter 'wordId' is set
            if (wordId == null) throw new ApiException(400, "Missing required parameter 'wordId' when calling RenameWord");
            
            // verify the required parameter 'body' is set
            if (body == null) throw new ApiException(400, "Missing required parameter 'body' when calling RenameWord");
            
    
            var path = "/word/{wordId}/rename";
            path = path.Replace("{format}", "json");
            path = path.Replace("{" + "wordId" + "}", ApiClient.ParameterToString(wordId));
    
            var queryParams = new Dictionary<string, string>();
            var headerParams = new Dictionary<string, string>();
            var formParams = new Dictionary<string, string>();
            var fileParams = new Dictionary<string, FileParameter>();
            string postBody = null;
    
                                                postBody = ApiClient.Serialize(body); // http body (model) parameter
    
            // authentication setting, if any
            string[] authSettings = { "cookieAuth" };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.PUT, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if ((int)response.StatusCode >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling RenameWord: " + response.Content, response.Content);
            if ((int)response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling RenameWord: " + response.ErrorMessage, response.ErrorMessage);
        }
    
        /// <summary>
        /// Update user&#39;s score for word 
        /// </summary>
        /// <param name="wordId">Word id to reaname</param> 
        /// <param name="score">Score object that needs to be updated in the word</param> 
        /// <returns></returns>            
        public void ScoreWord (long? wordId, Score score)
        {
            
            // verify the required parameter 'wordId' is set
            if (wordId == null) throw new ApiException(400, "Missing required parameter 'wordId' when calling ScoreWord");
            
            // verify the required parameter 'score' is set
            if (score == null) throw new ApiException(400, "Missing required parameter 'score' when calling ScoreWord");
            
    
            var path = "/word/{wordId}/score";
            path = path.Replace("{format}", "json");
            path = path.Replace("{" + "wordId" + "}", ApiClient.ParameterToString(wordId));
    
            var queryParams = new Dictionary<string, string>();
            var headerParams = new Dictionary<string, string>();
            var formParams = new Dictionary<string, string>();
            var fileParams = new Dictionary<string, FileParameter>();
            string postBody = null;
    
                                                postBody = ApiClient.Serialize(score); // http body (model) parameter
    
            // authentication setting, if any
            string[] authSettings = { "cookieAuth" };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.PUT, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if ((int)response.StatusCode >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling ScoreWord: " + response.Content, response.Content);
            if ((int)response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling ScoreWord: " + response.ErrorMessage, response.ErrorMessage);
        }
    
        /// <summary>
        /// Update an existing word 
        /// </summary>
        /// <param name="word">Word object that needs to be updated in the store</param> 
        /// <returns></returns>            
        public void UpdateWord (Word word)
        {
            
            // verify the required parameter 'word' is set
            if (word == null) throw new ApiException(400, "Missing required parameter 'word' when calling UpdateWord");
            
    
            var path = "/word";
            path = path.Replace("{format}", "json");
                
            var queryParams = new Dictionary<string, string>();
            var headerParams = new Dictionary<string, string>();
            var formParams = new Dictionary<string, string>();
            var fileParams = new Dictionary<string, FileParameter>();
            string postBody = null;
    
                                                postBody = ApiClient.Serialize(word); // http body (model) parameter
    
            // authentication setting, if any
            string[] authSettings = { "cookieAuth" };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.PUT, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if ((int)response.StatusCode >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling UpdateWord: " + response.Content, response.Content);
            if ((int)response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling UpdateWord: " + response.ErrorMessage, response.ErrorMessage);
        }
    
    }
}
