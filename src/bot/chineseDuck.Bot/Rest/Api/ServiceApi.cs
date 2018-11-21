using System;
using System.Collections.Generic;
using ChineseDuck.Bot.Rest.Client;
using RestSharp;

namespace ChineseDuck.Bot.Rest.Api
{
    /// <summary>
    /// Represents a collection of functions to interact with the API endpoints
    /// </summary>
    public interface IServiceApi
    {
        /// <summary>
        /// Get system datetime 
        /// </summary>
        /// <returns>DateTime?</returns>
        DateTime? GetDatetime ();
    }
  
    /// <summary>
    /// Represents a collection of functions to interact with the API endpoints
    /// </summary>
    public class ServiceApi : IServiceApi
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ServiceApi"/> class.
        /// </summary>
        /// <param name="apiClient"> an instance of ApiClient (optional)</param>
        /// <returns></returns>
        public ServiceApi(ApiClient apiClient = null)
        {
            if (apiClient == null) // use the default one in Configuration
                ApiClient = Configuration.DefaultApiClient; 
            else
                ApiClient = apiClient;
        }
    
        /// <summary>
        /// Initializes a new instance of the <see cref="ServiceApi"/> class.
        /// </summary>
        /// <returns></returns>
        public ServiceApi(string basePath)
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
        /// Get system datetime 
        /// </summary>
        /// <returns>DateTime?</returns>            
        public DateTime? GetDatetime ()
        {
            
    
            var path = "/service/datetime";
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
                throw new ApiException ((int)response.StatusCode, "Error calling GetDatetime: " + response.Content, response.Content);
            if ((int)response.StatusCode == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling GetDatetime: " + response.ErrorMessage, response.ErrorMessage);

            return (DateTime?) ApiClient.Deserialize(response.Content, typeof(DateTime?), response.Headers);
        }
    
    }
}
