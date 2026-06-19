import Dypnsapi20170525, * as dypnsapi from "@alicloud/dypnsapi20170525";
import OpenApi, * as openapi from "@alicloud/openapi-client";
import Util, * as $Util from "@alicloud/tea-util";

type SmsMode = "aliyun" | "development";

type SmsResult = {
  mode: SmsMode;
  code: string;
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

function createLocalCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendLoginSms(phone: string): Promise<SmsResult> {
  const config = getAliyunSmsConfig();

  if (!config) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`短信服务未配置：缺少 ${getMissingAliyunSmsEnvKeys().join(", ")}`);
    }

    return { mode: "development", code: createLocalCode() };
  }

  const client = new Dypnsapi20170525(
    new openapi.Config({
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      endpoint: "dypnsapi.aliyuncs.com"
    })
  );

  const request = new dypnsapi.SendSmsVerifyCodeRequest({
    phoneNumber: phone,
    countryCode: "86",
    signName: config.signName,
    templateCode: config.templateCode,
    templateParam: JSON.stringify({ code: "##code##", min: "5" }),
    codeLength: 6,
    codeType: 1,
    returnVerifyCode: true,
    validTime: 300
  });

  const runtime = new $Util.RuntimeOptions({});
  const response = await client.sendSmsVerifyCodeWithOptions(request, runtime);
  const body = response.body;

  if (body?.code !== "OK" || body?.success === false) {
    throw new Error(body?.message || "短信发送失败。");
  }

  const verifyCode = body?.model?.verifyCode;
  if (!verifyCode) {
    throw new Error("短信服务未返回验证码，请检查号码认证服务模板配置。");
  }

  return { mode: "aliyun", code: verifyCode };
}
