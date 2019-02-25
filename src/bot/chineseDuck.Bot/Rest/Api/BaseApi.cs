using ChineseDuck.Bot.Rest.Client;

namespace ChineseDuck.Bot.Rest.Api
{
    /// <summary>
    /// Abstract class with ApiClient
    /// </summary>
    public abstract class BaseApi
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="apiClient">An instance of ApiClient</param>
        protected BaseApi(ApiClient apiClient)
        {
            ApiClient = apiClient;
        }

        /// <summary>
        /// Gets or sets the API client.
        /// </summary>
        /// <value>An instance of the ApiClient</value>
        public ApiClient ApiClient { get; }
    }
}
