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

const toNumberString = s => s.replace(/\D/g, "");
const client = MTProto({ server, api });

export async function sendCode(phone) {
  console.info(phone);
  const normalPhone = toNumberString(phone);
  console.info(normalPhone);

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
      api_id: telegramApiId,
      api_hash: telegramAppKey
    });
  }
}

export async function signIn(phone, code, phoneHash) {
  const normalPhone = toNumberString(phone);
  const normalCode = toNumberString(code);
  if (isDebug()) {
    await setTimeout(() => {}, 1000);

    if (DebugKeys.phone == normalPhone) return { user: { id: 100 } };
    else throw new Error("Wrong number");
  } else {
    return await client("auth.signIn", {
      phone_number: normalPhone,
      phone_code_hash: phoneHash,
      phone_code: normalCode
    });
  }
}
