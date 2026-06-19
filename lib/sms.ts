import Dysmsapi20170525, * as dysmsapi from "@alicloud/dysmsapi20170525";
import OpenApi, * as openapi from "@alicloud/openapi-client";
import Util, * as $Util from "@alicloud/tea-util";

type SmsMode = "aliyun" | "development";

type SmsResult = {
  mode: SmsMode;
};

const aliyunSmsEnvKeys = [
  "ALIYUN_ACCESS_KEY_ID",
  "ALIYUN_ACCESS_KEY_SECRET",
  "ALIYUN_SMS_SIGN_NAME",
  "ALIYUN_SMS_TEMPLATE_CODE"
] as const;

function getAliyunSmsConfig() {
  const accessKeyId = process.env.ALIYUN_ACCESS_KEY_ID;
  const accessKeySecret = process.env.ALIYUN_ACCESS_KEY_SECRET;
  const signName = process.env.ALIYUN_SMS_SIGN_NAME;
  const templateCode = process.env.ALIYUN_SMS_TEMPLATE_CODE;

  if (!accessKeyId || !accessKeySecret || !signName || !templateCode) {
    return null;
  }

  return {
    accessKeyId,
    accessKeySecret,
    signName,
    templateCode
  };
}

export function isAliyunSmsConfigured() {
  return Boolean(getAliyunSmsConfig());
}

export function getMissingAliyunSmsEnvKeys() {
  return aliyunSmsEnvKeys.filter((key) => !process.env[key]);
}

export async function sendLoginSms(phone: string, code: string): Promise<SmsResult> {
  const config = getAliyunSmsConfig();

  if (!config) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`短信服务未配置：缺少 ${getMissingAliyunSmsEnvKeys().join(", ")}`);
    }

    return { mode: "development" };
  }

  const client = new Dysmsapi20170525(
    new openapi.Config({
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      endpoint: "dysmsapi.aliyuncs.com"
    })
  );

  const request = new dysmsapi.SendSmsRequest({
    phoneNumbers: phone,
    signName: config.signName,
    templateCode: config.templateCode,
    templateParam: JSON.stringify({ code })
  });

  const runtime = new $Util.RuntimeOptions({});
  const response = await client.sendSmsWithOptions(request, runtime);
  const body = response.body;

  if (body?.code !== "OK") {
    throw new Error(body?.message || "短信发送失败");
  }

  return { mode: "aliyun" };
}
