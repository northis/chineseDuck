using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using ChineseDuck.Bot.Interfaces.Data;
using ChineseDuck.Bot.Rest.Client;
using ChineseDuck.Bot.Rest.Model;
using RestSharp;

namespace ChineseDuck.Bot.Rest.Api
{
    /// <summary>
    /// Represents a collection of functions to interact with the API endpoints
    /// </summary>
    public interface IUserApi
    {
        /// <summary>
        /// Send the auth code to user via sms 
        /// </summary>
        /// <param name="body">The user phone for auth</param>
        /// <returns>ApiUser</returns>
        ApiUser AuthUser (string body);
        /// <summary>
        /// Create user 
        /// </summary>
        /// <param name="user">Created user object</param>
        /// <returns></returns>
        void CreateUser (IUser user);
        /// <summary>
        /// Delete user This can only be done by the logged in user.
        /// </summary>
        /// <param name="id">The user id that needs to be deleted.</param>
        /// <returns></returns>
        void DeleteUser (long? id);
        /// <summary>
        /// Get user by user id 
        /// </summary>
        /// <param name="userId">The user id that needs to be fetched. Use 0 for testing.</param>
        /// <returns>User</returns>
        User GetUserById (long? userId);
        /// <summary>
        /// Get user according to token in header 
        /// </summary>
        /// <param name="connectSid">user token</param>
        /// <returns>User</returns>
        User GetUserByToken (string connectSid);
        /// <summary>
        /// Logs user into the system 
        /// </summary>
        /// <param name="apiUser">The user object for auth</param>
        /// <returns></returns>
        void LoginUser (ApiUser apiUser);
        /// <summary>
        /// Erase the user token, so user have to recreate it next time 
        /// </summary>
        /// <returns></returns>
        void LogoutUser ();
        /// <summary>
        /// Set current folder for user This can only be done by the logged in user.
        /// </summary>
        /// <param name="folderId">The user id that needs to be updated.</param>
        /// <returns></returns>
        void SetCurrentFolder (long? folderId);
        /// <summary>
        /// Update user This can only be done by the logged in user.
        /// </summary>
        /// <param name="userId">The user id that needs to be updated.</param>
        /// <param name="user">Updated user object</param>
        /// <returns></returns>
        void UpdateUser (long? userId, User user);
    }
  
    /// <summary>
    /// Represents a collection of functions to interact with the API endpoints
    /// </summary>
    public class UserApi : IUserApi
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="UserApi"/> class.
        /// </summary>
        /// <param name="apiClient"> an instance of ApiClient (optional)</param>
        /// <returns></returns>
        public UserApi(ApiClient apiClient = null)
        {
            if (apiClient == null) // use the default one in Configuration
                ApiClient = Configuration.DefaultApiClient; 
            else
                ApiClient = apiClient;
        }
    
        /// <summary>
        /// Initializes a new instance of the <see cref="UserApi"/> class.
        /// </summary>
        /// <returns></returns>
        public UserApi(string basePath)
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
        /// Send the auth code to user via sms 
        /// </summary>
        /// <param name="body">The user phone for auth</param> 
        /// <returns>ApiUser</returns>            
        public ApiUser AuthUser (string body)
        {
            
            // verify the required parameter 'body' is set
            if (body == null) throw new ApiException(400, "Missing required parameter 'body' when calling AuthUser");
            
    
            var path = "/user/auth";
            path = path.Replace("{format}", "json");
                
            var queryParams = new Dictionary<string, string>();
            var headerParams = new Dictionary<string, string>();
            var formParams = new Dictionary<string, string>();
            var fileParams = new Dictionary<string, FileParameter>();
            string postBody = null;
    
                                                postBody = ApiClient.Serialize(body); // http body (model) parameter
    
            // authentication setting, if any
            string[] authSettings = { "cookieAuth" };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.POST, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if ((int)response.StatusCode >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling AuthUser: " + response.Content, response.Content);
            if (response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling AuthUser: " + response.ErrorMessage, response.ErrorMessage);

            return (ApiUser) ApiClient.Deserialize(response.Content, typeof(ApiUser), response.Headers);
        }
    
        /// <summary>
        /// Create user 
        /// </summary>
        /// <param name="user">Created user object</param> 
        /// <returns></returns>            
        public void CreateUser (IUser user)
        {
            
            // verify the required parameter 'user' is set
            if (user == null) throw new ApiException(400, "Missing required parameter 'user' when calling CreateUser");
            
    
            var path = "/user";
            path = path.Replace("{format}", "json");
                
            var queryParams = new Dictionary<string, string>();
            var headerParams = new Dictionary<string, string>();
            var formParams = new Dictionary<string, string>();
            var fileParams = new Dictionary<string, FileParameter>();
            string postBody = null;
    
            postBody = ApiClient.Serialize(user); // http body (model) parameter
    
            // authentication setting, if any
            string[] authSettings = { "cookieAuth" };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.POST, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if ((int)response.StatusCode >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling CreateUser: " + response.Content, response.Content);
            if (response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling CreateUser: " + response.ErrorMessage, response.ErrorMessage);
        }
    
        /// <summary>
        /// Delete user This can only be done by the logged in user.
        /// </summary>
        /// <param name="id">The user id that needs to be deleted.</param> 
        /// <returns></returns>            
        public void DeleteUser (long? id)
        {
            
            // verify the required parameter 'id' is set
            if (id == null) throw new ApiException(400, "Missing required parameter 'id' when calling DeleteUser");
            
    
            var path = "/user/{userId}";
            path = path.Replace("{format}", "json");
            path = path.Replace("{" + "id" + "}", ApiClient.ParameterToString(id));
    
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
                throw new ApiException ((int)response.StatusCode, "Error calling DeleteUser: " + response.Content, response.Content);
            if (response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling DeleteUser: " + response.ErrorMessage, response.ErrorMessage);
        }
    
        /// <summary>
        /// Get user by user id 
        /// </summary>
        /// <param name="userId">The user id that needs to be fetched. Use 0 for testing.</param> 
        /// <returns>User</returns>            
        public User GetUserById (long? userId)
        {
            
            // verify the required parameter 'userId' is set
            if (userId == null) throw new ApiException(400, "Missing required parameter 'userId' when calling GetUserById");
            
    
            var path = "/user/{userId}";
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
                throw new ApiException ((int)response.StatusCode, "Error calling GetUserById: " + response.Content, response.Content);
            if (response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling GetUserById: " + response.ErrorMessage, response.ErrorMessage);

            return (User) ApiClient.Deserialize(response.Content, typeof(User), response.Headers);
        }
    
        /// <summary>
        /// Get user according to token in header 
        /// </summary>
        /// <param name="connectSid">user token</param> 
        /// <returns>User</returns>            
        public User GetUserByToken (string connectSid)
        {
            
            // verify the required parameter 'connectSid' is set
            if (connectSid == null) throw new ApiException(400, "Missing required parameter 'connectSid' when calling GetUserByToken");
            
    
            var path = "/user";
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
                throw new ApiException ((int)response.StatusCode, "Error calling GetUserByToken: " + response.Content, response.Content);
            if (response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling GetUserByToken: " + response.ErrorMessage, response.ErrorMessage);

            return (User) ApiClient.Deserialize(response.Content, typeof(User), response.Headers);
        }
    
        /// <summary>
        /// Logs user into the system 
        /// </summary>
        /// <param name="apiUser">The user object for auth</param> 
        /// <returns></returns>            
        public void LoginUser (ApiUser apiUser)
        {
            
            // verify the required parameter 'apiUser' is set
            if (apiUser == null) throw new ApiException(400, "Missing required parameter 'apiUser' when calling LoginUser");
            
    
            var path = "/user/login";
            path = path.Replace("{format}", "json");
                
            var queryParams = new Dictionary<string, string>();
            var headerParams = new Dictionary<string, string>();
            var formParams = new Dictionary<string, string>();
            var fileParams = new Dictionary<string, FileParameter>();

            var postBody = ApiClient.Serialize(apiUser);
    
            // authentication setting, if any
            string[] authSettings = { "cookieAuth" };
    
            // make the HTTP request
            var response = (IRestResponse) ApiClient.CallApi(path, Method.POST, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if ((int)response.StatusCode >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling LoginUser: " + response.Content, response.Content);
            if (response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling LoginUser: " + response.ErrorMessage, response.ErrorMessage);

            var authCookie = response.Headers.FirstOrDefault(a => a.Name == "Set-Cookie");

            if (authCookie != null)
            {
                if(ApiClient.RestClient.CookieContainer == null)
                    ApiClient.RestClient.CookieContainer = new CookieContainer();

                ApiClient.RestClient.CookieContainer.SetCookies(new Uri(ApiClient.BasePath),
                    authCookie.Value.ToString());
            }
        }
    
        /// <summary>
        /// Erase the user token, so user have to recreate it next time 
        /// </summary>
        /// <returns></returns>            
        public void LogoutUser ()
        {
            
    
            var path = "/user/logout";
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
                throw new ApiException ((int)response.StatusCode, "Error calling LogoutUser: " + response.Content, response.Content);
            if (response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling LogoutUser: " + response.ErrorMessage, response.ErrorMessage);
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
            if (response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling SetCurrentFolder: " + response.ErrorMessage, response.ErrorMessage);
        }
    
        /// <summary>
        /// Update user This can only be done by the logged in user.
        /// </summary>
        /// <param name="userId">The user id that needs to be updated.</param> 
        /// <param name="user">Updated user object</param> 
        /// <returns></returns>            
        public void UpdateUser (long? userId, User user)
        {
            
            // verify the required parameter 'userId' is set
            if (userId == null) throw new ApiException(400, "Missing required parameter 'userId' when calling UpdateUser");
            
            // verify the required parameter 'user' is set
            if (user == null) throw new ApiException(400, "Missing required parameter 'user' when calling UpdateUser");
            
    
            var path = "/user/{userId}";
            path = path.Replace("{format}", "json");
            path = path.Replace("{" + "userId" + "}", ApiClient.ParameterToString(userId));
    
            var queryParams = new Dictionary<string, string>();
            var headerParams = new Dictionary<string, string>();
            var formParams = new Dictionary<string, string>();
            var fileParams = new Dictionary<string, FileParameter>();
            string postBody = null;
    
                                                postBody = ApiClient.Serialize(user); // http body (model) parameter
    
            // authentication setting, if any
            string[] authSettings = { "cookieAuth" };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.PUT, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if ((int)response.StatusCode >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling UpdateUser: " + response.Content, response.Content);
            if (response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling UpdateUser: " + response.ErrorMessage, response.ErrorMessage);
        }
    
    }
}
