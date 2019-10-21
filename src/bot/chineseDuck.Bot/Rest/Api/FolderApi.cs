using System.Collections.Generic;
using System.Linq;
using ChineseDuck.Bot.Interfaces.Data;
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
        void CreateFolder (IFolder folder);

        /// <summary>
        /// Create folder for specified user 
        /// </summary>
        /// <param name="userId">User id</param>
        /// <param name="folder">Created folder object</param>
        void CreateFolderForUser (long userId, IFolder folder);

        /// <summary>
        /// Delete folder 
        /// </summary>
        /// <param name="folderId">The folder id that needs to be deleted.</param>
        void DeleteFolder (long folderId);

        /// <summary>
        /// Get folders for current user 
        /// </summary>
        /// <returns>Folders for current user </returns>
        IFolder[] GetFoldersForCurrentUser ();

        /// <summary>
        /// Get folders for user 
        /// </summary>
        /// <param name="userId">User id</param>
        /// <returns>Folders for user</returns>
        IFolder[] GetFoldersForUser (long userId);

        /// <summary>
        ///  Get words by folder id
        /// </summary>
        /// <param name="folderId">Folder id</param>
        /// <returns>Words for folder id</returns>
        IWord[] GetWordsFolderId (long folderId);

        /// <summary>
        /// Update folder (rename) 
        /// </summary>
        /// <param name="folderId">The folder id that needs to be deleted.</param>
        /// <param name="folder">folder with new name</param>
        void UpdateFolder (long folderId, IFolder folder);

        /// <summary>
        /// Get pre-installed folders
        /// </summary>
        /// <returns>Template folders</returns>
        IFolder[] GetTemplateFolders();

        /// <summary>
        /// Adds specified template folders to user's.
        /// </summary>
        void AddTemplateFolders(long userId, long[] folderIds);
    }

    /// <summary>
    /// Main implementation of the IFolderApi
    /// </summary>
    public class FolderApi : BaseApi, IFolderApi
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="apiClient">An instance of ApiClient</param>
        public FolderApi(ApiClient apiClient) : base(apiClient)
        {
        }
             
        public void CreateFolder (IFolder folder)
        {
            var path = "/folder";
            var postBody = ApiClient.Serialize(folder);
            var response = ApiClient.CallApi(path, Method.POST, postBody);

            ApiClient.CheckResponse(response);
        }
          
        public void CreateFolderForUser (long userId, IFolder folder)
        {
            var path = $"/folder/user/{userId}";
            var postBody = ApiClient.Serialize(folder);
            var response = ApiClient.CallApi(path, Method.POST, postBody);

            ApiClient.CheckResponse(response);
        }
             
        public void DeleteFolder (long folderId)
        {
            var path = $"/folder/{folderId}";
            var response = ApiClient.CallApi(path, Method.DELETE);

            ApiClient.CheckResponse(response);
        }
           
        public IFolder[] GetFoldersForCurrentUser()
        {
            var path = "/folder";
            var response = ApiClient.CallApi(path, Method.GET);

            ApiClient.CheckResponse(response);
            return ApiClient.Deserialize<List<Folder>>(response).Cast<IFolder>().ToArray();
        }
              
        public IFolder[] GetFoldersForUser (long userId)
        {
            var path = $"/folder/user/{userId}";
            var response = ApiClient.CallApi(path, Method.GET);

            ApiClient.CheckResponse(response);
            return ApiClient.Deserialize<List<Folder>>(response).Cast<IFolder>().ToArray();
        }
               
        public IWord[] GetWordsFolderId (long folderId)
        {
            var path = $"/word/folder/{folderId}";
            var response = ApiClient.CallApi(path, Method.GET);

            ApiClient.CheckResponse(response);
            return ApiClient.Deserialize<List<Word>>(response).Cast<IWord>().ToArray();
        }
    
        /// <summary>
        /// Update folder (rename) 
        /// </summary>
        /// <param name="folderId">The folder id that needs to be deleted.</param> 
        /// <param name="folder">folder with new name</param> 
        public void UpdateFolder (long folderId, IFolder folder)
        {
            var path = $"/folder/{folderId}";
            var postBody = ApiClient.Serialize(folder);
    
            var response = ApiClient.CallApi(path, Method.PUT, postBody);
            ApiClient.CheckResponse(response);
        }

        public IFolder[] GetTemplateFolders()
        {
            var path = "/folder/template";
            var response = ApiClient.CallApi(path, Method.GET);

            ApiClient.CheckResponse(response);
            return ApiClient.Deserialize<List<Folder>>(response).Cast<IFolder>().ToArray();
        }

        public void AddTemplateFolders(long userId, long[] folderIds)
        {
            var path = $"/folder/template/user/{userId}";
            var postBody = ApiClient.Serialize(folderIds);
            var response = ApiClient.CallApi(path, Method.POST, postBody);

            ApiClient.CheckResponse(response);
        }
    }
}
