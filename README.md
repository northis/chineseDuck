## Chinese Duck Bot

Telegram bot @ChineseDuckBot to study Chinese language via memorizing the flashcards.
# Key features
* Generating flashcards based on users' vocabulary
* Tone highlighting with colors
* Auto-split word and phrases to syllables
* Web-part to view user's words
* Folders to group user's words
* Several modes how to learn the words - by viewing or by multipal-chioce tests
* Collection personal score
* Bulk import words from .csv file
* Webpart can work even if telegram addresses (https://t.me & so on) are blocked in your country.

# Roadmap
* Pre-installed cards for HSK1, HSK2,... to bulk import to a separate folder.
* Using webpart to manipulating the words

Usage:
npm run build-dev (dev build)
npm run build-prod (production build)
npm run tests (for tests)

To run, create a `keys.js` file in the root of the project folder. The template is like that

```
export const Keys = {

 telegramApiId: 000000,

 telegramAppKey: "00000000000000000",

 mongoDbString: "mongodb://user:password@localhost:27017/chineseDuck",

 sessionsPass: "password"

};

```
