using System;
using System.Linq;
using System.Net;
using chineseDuck.Bot.Security;
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
        void CreateUser (IUser user);

        /// <summary>
        /// Delete user This can only be done by the logged in user.
        /// </summary>
        /// <param name="userId">The user id that needs to be deleted.</param>
        /// <returns></returns>
        void DeleteUser (long userId);

        /// <summary>
        /// Get user by user id 
        /// </summary>
        /// <param name="userId">The user id that needs to be fetched. Use 0 for testing.</param>
        /// <returns>User</returns>
        IUser GetUserById (long userId);

        /// <summary>
        /// Get user according to token in header 
        /// </summary>
        IUser GetUserByToken ();

        /// <summary>
        /// Logs user into the system 
        /// </summary>
        /// <param name="apiUser">The user object for auth</param>
        void LoginUser (ApiUser apiUser);

        /// <summary>
        /// Erase the user token, so user have to recreate it next time 
        /// </summary>
        void LogoutUser();

        /// <summary>
        /// Set current folder for user This can only be done by the logged in user.
        /// </summary>
        /// <param name="folderId">The user id that needs to be updated.</param>
        void SetCurrentFolder(long folderId);

        /// <summary>
        /// Update user This can only be done by the logged in user.
        /// </summary>
        /// <param name="userId">The user id that needs to be updated.</param>
        /// <param name="user">Updated user object</param>
        void UpdateUser(long userId, IUser user);
    }

    /// <summary>
    /// Main implementation of the IUserApi
    /// </summary>
    public class UserApi : BaseApi, IUserApi
    {
        private readonly AuthSigner _authSigner;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="apiClient">An instance of ApiClient</param>
        /// <param name="authSigner">Authentication signer class for security</param>
        public UserApi(ApiClient apiClient, AuthSigner authSigner) : base(apiClient)
        {
            _authSigner = authSigner;
        }
           
        public ApiUser AuthUser (string body)
        {
            var path = "/user/auth";
            var postBody = ApiClient.Serialize(body);
            var response = ApiClient.CallApi(path, Method.POST, postBody);

            ApiClient.CheckResponse(response);
            return ApiClient.Deserialize<ApiUser>(response);
        }
              
        public void CreateUser (IUser user)
        {
            var path = "/user";
            var postBody =  ApiClient.Serialize(user);
            var response = ApiClient.CallApi(path, Method.POST, postBody);

            ApiClient.CheckResponse(response);
        }
            
        public void DeleteUser (long userId)
        {
            var path = $"/user/{userId}";
            var response = ApiClient.CallApi(path, Method.DELETE);

            ApiClient.CheckResponse(response);
        }
            
        public IUser GetUserById (long userId)
        {
            var path = $"/user/{userId}";
            var response = ApiClient.CallApi(path, Method.GET);

            ApiClient.CheckResponse(response);
            return ApiClient.Deserialize<User>(response);
        }
           
        public IUser GetUserByToken ()
        {
            var path = "/user";
            var response = ApiClient.CallApi(path, Method.GET);

            ApiClient.CheckResponse(response);
            return ApiClient.Deserialize<User>(response);
        }
            
        public void LoginUser (ApiUser apiUser)
        {
            var path = _authSigner.GetAuthUrl(apiUser.Id);
            var response = ApiClient.CallApi(path, Method.GET);

            ApiClient.CheckResponse(response);

            var authCookie = response.Headers.FirstOrDefault(a => a.Name == "Set-Cookie");
            if (authCookie == null)
                return;

            if(ApiClient.RestClient.CookieContainer == null)
                ApiClient.RestClient.CookieContainer = new CookieContainer();

            ApiClient.RestClient.CookieContainer.SetCookies(new Uri(ApiClient.BasePath),
                authCookie.Value.ToString());
        }
             
        public void LogoutUser()
        {
            var path = "/user/logout";
            var response = ApiClient.CallApi(path, Method.GET);

            ApiClient.CheckResponse(response);
        }
         
        public void SetCurrentFolder (long folderId)
        {
            var path = $"/user/currentFolder/{folderId}";
            var response = ApiClient.CallApi(path, Method.PUT);

            ApiClient.CheckResponse(response);
        }
            
        public void UpdateUser (long userId, IUser user)
        {
            var path = $"/user/{userId}";
            var postBody = ApiClient.Serialize(user);
            var response = ApiClient.CallApi(path, Method.PUT, postBody);

            ApiClient.CheckResponse(response);
        }
    }
}
