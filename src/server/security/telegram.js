import { createHmac, createHash } from "crypto";
import { Keys } from "../../../config/common";

const key = createHash("sha256")
  .update(Keys.telegramBotKey)
  .digest();

export const checkLogin = data => {
  data = JSON.parse(JSON.stringify(data));
  let input_hash = data.hash;
  delete data.hash;
  let array = [];
  for (let key in data) {
    array.push(key + "=" + data[key]);
  }
  array = array.sort();

  let check_string = array.join("\n");
  let check_hash = sign(check_string);

  if (check_hash == input_hash) return data;
  return null;
};

export const sign = inputString => {
  return createHmac("sha256", key)
    .update(inputString)
    .digest("hex");
};
