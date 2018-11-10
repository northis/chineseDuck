import MTProto from "telegram-mtproto";
import { isDebug, DebugKeys, Keys } from "../../../config/common";

const api = {
  layer: 57,
  initConnection: 0x69796de9,
  api_id: Keys.telegramApiId
};

const server = {
  dev: isDebug()
};

const toNumberString = s => s.replace(/\D/g, "");
const client = MTProto({ server, api });

export async function sendCode(phone) {
  const normalPhone = toNumberString(phone);

  if (isDebug()) {
    await setTimeout(() => {}, 1000);
    return {
      phone_code_hash:
        normalPhone == DebugKeys.phone ? DebugKeys.phone_code_hash : ""
    };
  } else {
    return await client("auth.sendCode", {
      phone_number: normalPhone,
      current_number: false,
      api_id: Keys.telegramApiId,
      api_hash: Keys.telegramAppKey
    });
  }
}

export async function signIn(phone, code, phoneHash) {
  const normalPhone = toNumberString(phone);
  const normalCode = toNumberString(code);
  if (isDebug()) {
    await setTimeout(() => {}, 1000);

    if (DebugKeys.phone == normalPhone && DebugKeys.phone_code == normalCode)
      return { user: { id: DebugKeys.user_id } };
    else throw new Error("Wrong number");
  } else {
    return await client("auth.signIn", {
      phone_number: normalPhone,
      phone_code_hash: phoneHash,
      phone_code: normalCode
    });
  }
}
