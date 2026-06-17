import OpenAI from "openai";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  assertCanGenerate,
  consumeGeneration,
  getUserBySession
} from "@/lib/auth";
import { buildScriptPrompt, normalizeScriptResult, type ScriptFormInput } from "@/lib/script";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "服务器未配置 OPENAI_API_KEY。" }, { status: 500 });
  }

  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  let user;

  try {
    user = await getUserBySession(token);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "服务器数据库未配置。" },
      { status: 500 }
    );
  }

  if (!user) {
    return NextResponse.json({ error: "请先手机号登录。" }, { status: 401 });
  }

  try {
    await assertCanGenerate(user.phone);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "免费生成次数已用完。" },
      { status: 403 }
    );
  }

  const body = (await request.json()) as Partial<ScriptFormInput>;
  const validationError = validateInput(body);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_API_BASE_URL || process.env.OPENAI_BASE_URL
    });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "你是专业中文短视频策划师，擅长生成可执行脚本、分镜、旁白和 AI 视频提示词。"
        },
        {
          role: "user",
          content: buildScriptPrompt(body as ScriptFormInput)
        }
      ]
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "AI 未返回内容，请重试。" }, { status: 502 });
    }

    const result = normalizeScriptResult(JSON.parse(content));
    const updatedUser = await consumeGeneration(user.phone);
    return NextResponse.json({ result, user: updatedUser });
  } catch (error) {
    const message = error instanceof Error ? error.message : "生成失败，请稍后重试。";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function validateInput(input: Partial<ScriptFormInput>) {
  const fields: Array<keyof ScriptFormInput> = ["topic", "videoType", "duration", "platform", "style"];

  for (const field of fields) {
    if (typeof input[field] !== "string" || input[field]?.trim().length === 0) {
      return "请填写完整表单后再生成。";
    }
  }

  if ((input.topic?.length ?? 0) > 120) {
    return "视频主题请控制在 120 字以内。";
  }

  return null;
}
