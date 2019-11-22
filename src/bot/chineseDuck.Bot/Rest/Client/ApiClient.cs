using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using RestSharp;

namespace ChineseDuck.Bot.Rest.Client {
    /// <summary>
    /// API client is mainly responsible for making the HTTP call to the API backend.
    /// </summary>
    public class ApiClient {
        /// <summary>
        /// Initializes a new instance of the <see cref="ApiClient" /> class.
        /// </summary>
        /// <param name="basePath">The base path.</param>
        public ApiClient (string basePath) {
            BasePath = basePath;
            RestClient = new RestClient (BasePath) { FollowRedirects = false };
            DefaultHeaders = new Dictionary<string, string> ();
        }

        /// <summary>
        /// Fires when an authentication required.
        /// </summary>
        public event EventHandler OnAuthenticationRequest;

        /// <summary>
        /// Gets or sets the base path.
        /// </summary>
        /// <value>The base path</value>
        public string BasePath { get; set; }

        /// <summary>
        /// Gets or sets the RestClient.
        /// </summary>
        /// <value>An instance of the RestClient</value>
        public RestClient RestClient { get; set; }

        /// <summary>
        /// Gets or sets the default headers.
        /// </summary>
        public Dictionary<string, string> DefaultHeaders { get; set; }

        /// <summary>
        /// Makes the HTTP request (Sync).
        /// </summary>
        /// <param name="path">URL path.</param>
        /// <param name="method">HTTP method.</param>
        /// <param name="postBody">HTTP body (POST request).</param>
        /// <param name="useAuthenticate">If true, it will try to authenticate via calling OnAuthenticationRequest event.</param>
        /// <returns>Response</returns>
        public IRestResponse CallApi(string path, Method method, string postBody = null, bool useAuthenticate = true)
        {
            var request = new RestRequest(path, method);

            // add default header, if any
            foreach (var defaultHeader in DefaultHeaders)
                request.AddHeader(defaultHeader.Key, defaultHeader.Value);

            if (postBody != null)
                request.AddParameter("application/json", postBody, ParameterType.RequestBody);

            var res = RestClient.Execute(request);

            if (useAuthenticate && (res.StatusCode == HttpStatusCode.Unauthorized ||
                                    res.StatusCode == HttpStatusCode.Forbidden))
            {
                if (OnAuthenticationRequest != null)
                {
                    OnAuthenticationRequest(this, EventArgs.Empty);
                    res = RestClient.Execute(request);
                }
            }

            return res;
        }

        /// <summary>
        /// Deserialize the JSON string into proper object of type T.
        /// </summary>
        /// <typeparam name="T">The type of the object</typeparam>
        /// <param name="response">Response</param>
        /// <returns>Object representation of the JSON string.</returns>
        public T Deserialize<T>(IRestResponse response)
        {
            return (T) Deserialize(response.Content, typeof(T), response.Headers);
        }

        /// <summary>
        /// Deserialize the JSON string into a proper object.
        /// </summary>
        /// <param name="content">HTTP body (e.g. string, JSON).</param>
        /// <param name="type">Object type.</param>
        /// <param name="headers">HTTP headers.</param>
        /// <returns>Object representation of the JSON string.</returns>
        public object Deserialize(string content, Type type, IList<Parameter> headers = null)
        {
            if (type == typeof(object))
            {
                return content;
            }

            if (type == typeof(Stream))
            {
                var filePath = string.IsNullOrEmpty(Configuration.TempFolderPath)
                    ? Path.GetTempPath()
                    : Configuration.TempFolderPath;

                var fileName = filePath + Guid.NewGuid();
                if (headers != null)
                {
                    var regex = new Regex(@"Content-Disposition:.*filename=['""]?([^'""\s]+)['""]?$");
                    var match = regex.Match(headers.ToString());
                    if (match.Success)
                        fileName = filePath + match.Value.Replace("\"", "").Replace("'", "");
                }

                File.WriteAllText(fileName, content);
                return new FileStream(fileName, FileMode.Open);
            }

            if (type.Name.StartsWith("System.Nullable`1[[System.DateTime")) // return a datetime object
            {
                return DateTime.Parse(content, null, System.Globalization.DateTimeStyles.RoundtripKind);
            }

            if (type == typeof(string) || type.Name.StartsWith("System.Nullable")) // return primitive type
            {
                return ConvertType(content, type);
            }

            // at this point, it must be a model (json)
            try
            {
                return JsonConvert.DeserializeObject(content, type);
            }
            catch (IOException e)
            {
                throw new ApiException(500, e.Message);
            }
        }

        /// <summary>
        /// Serialize an object into JSON string.
        /// </summary>
        /// <param name="obj">Object.</param>
        /// <returns>JSON string.</returns>
        public string Serialize(object obj)
        {
            try
            {
                return obj != null ? JsonConvert.SerializeObject(obj) : null;
            }
            catch (Exception e)
            {
                throw new ApiException(500, e.Message);
            }
        }

        /// <summary>
        /// Dynamically cast the object into target type.
        /// </summary>
        /// <param name="fromObject">Object to be cast</param>
        /// <param name="toObject">Target type</param>
        /// <returns>Cast object</returns>
        public static object ConvertType(object fromObject, Type toObject)
        {
            return Convert.ChangeType(fromObject, toObject);
        }

        /// <summary>
        /// Check the response for possible errors and throw it if they exist.
        /// </summary>
        /// <param name="response">The response</param>
        /// <param name="callerMethod">The calling method.</param>
        public void CheckResponse(IRestResponse response, [CallerMemberName] string callerMethod = null)
        {
            if ((int) response.StatusCode >= 400)
                throw new ApiException((int) response.StatusCode, $"Error calling {callerMethod}: {response.Content}",
                    response.Content);
            if (response.StatusCode == 0 && response.StatusCode != HttpStatusCode.Found)
                throw new ApiException((int) response.StatusCode,
                    $"Error calling  {callerMethod}: {response.ErrorMessage}", response.ErrorMessage);
        }
    }
}