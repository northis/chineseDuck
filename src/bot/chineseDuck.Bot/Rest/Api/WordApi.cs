using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces.Data;
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
        /// Delete file
        /// </summary>
        /// <param name="fileId">File id to delete</param>
        void DeleteFile(string fileId);

        /// <summary>
        /// Add file
        /// </summary>
        /// <param name="wordFileBytes">Word file that needs to be added to the store</param>
        /// <returns>File Id</returns>
        string AddFile(WordFileBytes wordFileBytes);

        /// <summary>
        /// Add a new word to the store 
        /// </summary>
        /// <param name="word">Word object that needs to be added to the store</param>
        void AddWord(IWord word);

        /// <summary>
        /// Delete word 
        /// </summary>
        /// <param name="wordId">Word id to delete</param>
        void DeleteWord(long wordId);

        /// <summary>
        /// Get word's flash card as png binary 
        /// </summary>
        /// <param name="fileId">File id</param>
        /// <returns>File's bytes</returns>
        byte[] GetWordCard(string fileId);

        /// <summary>
        ///  Get word by id
        /// </summary>
        /// <param name="wordId">Word id</param>
        /// <returns>Word</returns>
        IWord GetWordId(long wordId);

        /// <summary>
        /// Get words by word or character for user Get words by wordEntry for user
        /// </summary>
        /// <param name="wordEntry">Word entry</param>
        /// <param name="userId">User entry to match</param>
        /// <returns>Words</returns>
        IWord[] GetWordsByUser(string wordEntry, long userId);

        /// <summary>
        ///  Get words by folder id
        /// </summary>
        /// <param name="folderId">Folder id</param>
        /// <param name="count">Count of the words returned</param>
        /// <returns>Words</returns>
        IWord[] GetWordsFolderId(long folderId, long? count);

        /// <summary>
        /// Move words to another folder 
        /// </summary>
        /// <param name="folderId">Folder id to move in</param>
        /// <param name="wordIds">Word ids</param>
        void MoveWordsToFolder(long folderId, long[] wordIds);

        /// <summary>
        /// Rename words with another translation 
        /// </summary>
        /// <param name="wordId">Word id to rename</param>
        /// <param name="body">New translation</param>
        void RenameWord(long wordId, string body);

        /// <summary>
        /// Update user's score for word 
        /// </summary>
        /// <param name="wordId">Word id to rename</param>
        /// <param name="score">Score object that needs to be updated in the word</param>
        void ScoreWord(long wordId, IScore score);

        /// <summary>
        /// Update an existing word 
        /// </summary>
        /// <param name="word">Word object that needs to be updated in the store</param>
        void UpdateWord(IWord word);

        /// <summary>
        /// Set question to study for user and return right answer
        /// </summary>
        /// <param name="userId"> User entry to match</param>
        /// <param name="mode">Learn mode</param>
        /// <returns>Right answer</returns>
        IWord SetQuestionByUser(long userId, ELearnMode mode);

        /// <summary>
        /// Get answers for current question
        /// </summary>
        /// <param name="userId">User id to match</param>
        /// <returns>Answers</returns>
        IWord[] GetAnswersByUser(long userId);

        /// <summary>
        /// Get current learning word for the user
        /// </summary>
        /// <param name="userId"> User id to match</param>
        /// <returns>Current learning word for the user</returns>
        IWord GetCurrentWord(long userId);
    }

    /// <summary>
    /// Main implementation of the IWordApi
    /// </summary>
    public class WordApi : BaseApi, IWordApi
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="apiClient">An instance of ApiClient</param>
        public WordApi(ApiClient apiClient) : base(apiClient)
        {
        }

        public void DeleteFile(string fileId)
        {
            var path = $"/word/file/{fileId}";
            var response = ApiClient.CallApi(path, Method.DELETE);

            ApiClient.CheckResponse(response);
        }

        public string AddFile(WordFileBytes wordFileBytes)
        {
            var path = "/word/file";
            var postBody = ApiClient.Serialize(wordFileBytes);
            var response = ApiClient.CallApi(path, Method.POST, postBody);

            ApiClient.CheckResponse(response);
            return ApiClient.Deserialize<string>(response).Replace(@"""", "");
        }

        public void AddWord(IWord word)
        {
            var path = "/word";
            var postBody = ApiClient.Serialize(word);
            var response = ApiClient.CallApi(path, Method.POST, postBody);

            ApiClient.CheckResponse(response);
        }

        public void DeleteWord(long wordId)
        {
            var path = $"/word/{wordId}";
            var response = ApiClient.CallApi(path, Method.DELETE);

            ApiClient.CheckResponse(response);
        }

        public byte[] GetWordCard(string fileId)
        {
            var path = $"/word/file/{fileId}";
            var response = ApiClient.CallApi(path, Method.GET);

            ApiClient.CheckResponse(response);
            return response.RawBytes;
        }

        public IWord GetWordId(long wordId)
        {
            var path = $"/word/{wordId}";
            var response = ApiClient.CallApi(path, Method.GET);

            ApiClient.CheckResponse(response);
            return ApiClient.Deserialize<IWord>(response);
        }

        public IWord[] GetWordsByUser(string wordEntry, long userId)
        {
            var path = $"/word/user/{userId}/search/{wordEntry}"; //TODO wordEntry encode? 
            var response = ApiClient.CallApi(path, Method.GET);

            ApiClient.CheckResponse(response);
            return ApiClient.Deserialize<IWord[]>(response);
        }

        public IWord[] GetWordsFolderId(long folderId, long? count)
        {
            var path = count == null ? $"/word/folder/{folderId}/count/0" : $"/word/folder/{folderId}/count/{count}";
            var response = ApiClient.CallApi(path, Method.GET);

            ApiClient.CheckResponse(response);
            return ApiClient.Deserialize<IWord[]>(response);
        }

        public void MoveWordsToFolder(long folderId, long[] wordIds)
        {
            var path = $"/word/folder/{folderId}";
            var postBody = ApiClient.Serialize(wordIds);
            var response = ApiClient.CallApi(path, Method.PUT, postBody);

            ApiClient.CheckResponse(response);
        }

        public void RenameWord(long wordId, string body)
        {
            var path = "/word/{wordId}/rename";
            var postBody = ApiClient.Serialize(body);
            var response = ApiClient.CallApi(path, Method.PUT, postBody);

            ApiClient.CheckResponse(response);
        }

        public void ScoreWord(long wordId, IScore score)
        {
            var path = $"/word/{wordId}/score";
            var postBody = ApiClient.Serialize(score);
            var response = ApiClient.CallApi(path, Method.PUT, postBody);

            ApiClient.CheckResponse(response);
        }

        public void UpdateWord(IWord word)
        {
            var path = "/word";
            var postBody = ApiClient.Serialize(word);
            var response = ApiClient.CallApi(path, Method.PUT, postBody);

            ApiClient.CheckResponse(response);
        }

        public IWord SetQuestionByUser(long userId, ELearnMode mode)
        {
            var path = $"/word/user/{userId}/nextWord/{mode}";
            var response = ApiClient.CallApi(path, Method.PUT);

            ApiClient.CheckResponse(response);
            return ApiClient.Deserialize<Word>(response);
        }
        public IWord[] GetAnswersByUser(long userId)
        {
            var path = $"/word/user/{userId}/answers";
            var response = ApiClient.CallApi(path, Method.GET);

            ApiClient.CheckResponse(response);
            // ReSharper disable once CoVariantArrayConversion
            return ApiClient.Deserialize<Word[]>(response);
        }
        public IWord GetCurrentWord(long userId)
        {
            var path = $"/word/user/{userId}/currentWord";
            var response = ApiClient.CallApi(path, Method.GET);

            ApiClient.CheckResponse(response);
            return ApiClient.Deserialize<IWord>(response);
        }
    }
}
