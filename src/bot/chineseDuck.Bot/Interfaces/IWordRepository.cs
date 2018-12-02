﻿using System;
using System.Linq;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces.Data;
using ChineseDuck.Bot.ObjectModels;

namespace ChineseDuck.Bot.Interfaces
{
    public interface IWordRepository
    {
        void AddFriendUser(long ownerUserId, long friendUserId);

        void AddUser(IUser user);

        void AddWord(IWord word, long idUser);

        void DeleteWord(long wordId);

        void EditWord(IWord word);

        IQueryable<WordSearchResult> FindFlashCard(string searchString, long userId);

        WordStatistic GetCurrentUserWordStatistic(long userId);

        IQueryable<WordSearchResult> GetLastWords(long idUser, int topCount);

        EGettingWordsStrategy GetLearnMode(long userId);

        LearnUnit GetNextWord(WordSettings settings);

        DateTime GetRepositoryTime();

        string GetUserCommand(long userId);

        IQueryable<IUser> GetUserFriends(long userId);

        IQueryable<IUser> GetUsers();

        WordStatistic GetUserWordStatistic(long userId, long wordId);

        IWord GetWord(string wordOriginal);

        byte[] GetWordFlashCard(long fileId);

        bool IsUserExist(long userId);

        void RemoveFriendUser(long ownerUserId, long friendUserId);

        void RemoveUser(long userId);

        void SetLearnMode(long userId, EGettingWordsStrategy mode);

        void SetScore(IScore score);

        void SetUserCommand(long userId, string command);
    }
}