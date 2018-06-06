import MTProto from "telegram-mtproto";
import { telegramApiId, telegramAppKey } from "../../../apiKeys";
import { isDebug, DebugKeys } from "../../../config/common";

const api = {
  layer: 57,
  initConnection: 0x69796de9,
  api_id: telegramApiId
};

const server = {
  dev: isDebug()
};

const client = MTProto({ server, api });

export async function sendCode(phone) {
  if (isDebug()) {
    await setTimeout(() => {}, 1000);
    return {
      phone_code_hash: phone == DebugKeys.phone ? DebugKeys.phone_code_hash : ""
    };
  } else {
    return await client("auth.sendCode", {
      phone_number: phone,
      current_number: false,
      api_id: telegramApiId,
      api_hash: telegramAppKey
    });
  }
}

export async function signIn(phone, code, phoneHash) {
  if (isDebug()) {
    await setTimeout(() => {}, 1000);

    if (DebugKeys.phone == phone) return { user: { id: 100 } };
    else throw new Error("Wrong number");
  } else {
    return await client("auth.signIn", {
      phone_number: phone.replace("+", ""),
      phone_code_hash: phoneHash,
      phone_code: code
    });
  }
}
