import * as JsSearch from "js-search";
export class Tokenizer implements JsSearch.ITokenizer {
  public tokenize(text: string): string[] {
    return [text];
  }
}
