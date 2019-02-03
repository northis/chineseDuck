using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using RestSharp;

namespace ChineseDuck.Bot.Rest.Client
{
    /// <summary>
    /// API client is mainly responsible for making the HTTP call to the API backend.
    /// </summary>
    public class ApiClient
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ApiClient" /> class.
        /// </summary>
        /// <param name="basePath">The base path.</param>
        public ApiClient(string basePath="https://chineseduck.online/api/v1")
        {
            BasePath = basePath;
            RestClient = new RestClient(BasePath);
            DefaultHeaders = new Dictionary<string, string>();
        }
    
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
        /// <returns>Response</returns>
        public IRestResponse CallApi(string path, Method method, string postBody = null)
        {
            var request = new RestRequest(path, method);
   
            // add default header, if any
            foreach(var defaultHeader in DefaultHeaders)
                request.AddHeader(defaultHeader.Key, defaultHeader.Value);

            if (postBody != null)
                request.AddParameter("application/json", postBody, ParameterType.RequestBody);

            return RestClient.Execute(request);
        }
    
        /// <summary>
        /// If parameter is DateTime, output in a formatted string (default ISO 8601), customizable with Configuration.DateTime.
        /// If parameter is a list of string, join the list with ",".
        /// Otherwise just return the string.
        /// </summary>
        /// <param name="obj">The parameter (header, path, query, form).</param>
        /// <returns>Formatted string.</returns>
        public string ParameterToString(object obj)
        {
            if (obj is DateTime time)
                // Return a formatted date string - Can be customized with Configuration.DateTimeFormat
                // Defaults to an ISO 8601, using the known as a Round-trip date/time pattern ("o")
                // https://msdn.microsoft.com/en-us/library/az4se3k1(v=vs.110).aspx#Anchor_8
                // For example: 2009-06-15T13:45:30.0000000
                return time.ToString (Configuration.DateTimeFormat);

            if (obj is List<string> list)
                return string.Join(",", list.ToArray());
            return Convert.ToString (obj);
        }

        /// <summary>
        /// Deserialize the JSON string into proper object of type T.
        /// </summary>
        /// <typeparam name="T">The type of the object</typeparam>
        /// <param name="response">Response</param>
        /// <returns>Object representation of the JSON string.</returns>
        public T Deserialize<T>(IRestResponse response)
        {
            return (T)Deserialize(response.Content, typeof(T), response.Headers);
        }

        /// <summary>
        /// Deserialize the JSON string into a proper object.
        /// </summary>
        /// <param name="content">HTTP body (e.g. string, JSON).</param>
        /// <param name="type">Object type.</param>
        /// <param name="headers">HTTP headers.</param>
        /// <returns>Object representation of the JSON string.</returns>
        public object Deserialize(string content, Type type, IList<Parameter> headers=null)
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
                return DateTime.Parse(content,  null, System.Globalization.DateTimeStyles.RoundtripKind);
            }

            if (type == typeof(string) || type.Name.StartsWith("System.Nullable")) // return primitive type
            {
                return ConvertType(content, type); 
            }
    
            // at this point, it must be a model (json)
            try
            {
                return JsonConvert.DeserializeObject(content, type, new JsonSerializerSettings(){ });
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
        public static object ConvertType(object fromObject, Type toObject) {
            return Convert.ChangeType(fromObject, toObject);
        }

        /// <summary>
        /// Check the response for possible errors and throw it if they exist.
        /// </summary>
        /// <param name="response">The response</param>
        /// <param name="callerMethod">The calling method.</param>
        public void CheckResponse(IRestResponse response, [CallerMemberName]string callerMethod = null)
        {
            if ((int)response.StatusCode >= 400)
                throw new ApiException((int)response.StatusCode, $"Error calling {callerMethod}: {response.Content}", response.Content);
            if (response.StatusCode == 0)
                throw new ApiException((int) response.StatusCode,
                    $"Error calling  {callerMethod}: {response.ErrorMessage}", response.ErrorMessage);
        }
    }
}
