using System;
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
    /// Main implementation of the IServiceApi
    /// </summary>
    public class ServiceApi : BaseApi, IServiceApi
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="apiClient">An instance of ApiClient</param>
        public ServiceApi(ApiClient apiClient) : base(apiClient)
        {
        }

        /// <summary>
        /// Get system datetime 
        /// </summary>
        /// <returns>System datetime </returns>            
        public DateTime? GetDatetime ()
        {
            var path = "/service/datetime";
            var response = ApiClient.CallApi(path, Method.GET);

            ApiClient.CheckResponse(response);
            return ApiClient.Deserialize<DateTime?>(response);
        }
    }
}
