import { IScore } from "../types/interfaces";

export const scoreToString = (score: IScore): string => {
  const original =
    (score.originalWordSuccessCount || 0) / (score.originalWordCount || 1);
  const pronunciation =
    (score.pronunciationSuccessCount || 0) / (score.pronunciationCount || 1);
  const translation =
    (score.translationSuccessCount || 0) / (score.translationCount || 1);

    return `🖌${original}, 📢${pronunciation}, 🇨🇳 ${translation}, 👀${
    score.viewCount
  }`;
};
