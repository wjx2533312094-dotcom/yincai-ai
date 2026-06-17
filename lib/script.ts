export type ScriptFormInput = {
  topic: string;
  videoType: string;
  duration: string;
  platform: string;
  style: string;
};

export type StoryboardRow = {
  shot: string;
  scene: string;
  visual: string;
  copy: string;
  duration: string;
};

export type ScriptResult = {
  title: string;
  hook: string;
  fullScript: string;
  storyboard: StoryboardRow[];
  voiceover: string;
  comfyuiPrompt: string;
  runwayPrompt: string;
};

const requiredStringFields = [
  "title",
  "hook",
  "fullScript",
  "voiceover",
  "comfyuiPrompt",
  "runwayPrompt"
] as const;

export function buildScriptPrompt(input: ScriptFormInput) {
  return `你是一名中文短视频策划专家，请根据用户需求生成适合直接拍摄和 AI 视频生成的短视频脚本。

用户需求：
- 视频主题：${input.topic}
- 视频类型：${input.videoType}
- 视频时长：${input.duration}
- 发布平台：${input.platform}
- 内容风格：${input.style}

请只返回严格 JSON，不要 Markdown，不要解释。JSON 结构必须完全符合：
{
  "title": "中文标题",
  "hook": "开头3秒钩子",
  "fullScript": "完整脚本文案，按时间顺序组织",
  "storyboard": [
    {
      "shot": "镜头编号",
      "scene": "场景",
      "visual": "画面描述",
      "copy": "屏幕字幕或关键台词",
      "duration": "镜头时长"
    }
  ],
  "voiceover": "完整旁白",
  "comfyuiPrompt": "适合 ComfyUI 文生图/图生视频的英文提示词，包含主体、场景、镜头、光线、风格",
  "runwayPrompt": "适合 Runway 的英文视频生成提示词，包含运动、镜头、节奏、画面变化"
}

生成要求：
1. 内容必须适合中文用户和 ${input.platform} 平台语境。
2. 钩子必须在 3 秒内制造好奇、冲突或明确收益。
3. 分镜数量要匹配 ${input.duration}，镜头时长之和接近总时长。
4. 脚本要可执行，不要空泛营销词。
5. ComfyUI 和 Runway 提示词必须可直接复制使用。`;
}

export function normalizeScriptResult(value: unknown): ScriptResult {
  if (!isRecord(value)) {
    throw new Error("AI 返回格式不完整，请重试。");
  }

  for (const field of requiredStringFields) {
    if (typeof value[field] !== "string" || value[field].trim().length === 0) {
      throw new Error("AI 返回格式不完整，请重试。");
    }
  }

  if (!Array.isArray(value.storyboard)) {
    throw new Error("AI 返回格式不完整，请重试。");
  }

  return {
    title: requiredText(value, "title"),
    hook: requiredText(value, "hook"),
    fullScript: requiredText(value, "fullScript"),
    storyboard: value.storyboard.map(normalizeStoryboardRow),
    voiceover: requiredText(value, "voiceover"),
    comfyuiPrompt: requiredText(value, "comfyuiPrompt"),
    runwayPrompt: requiredText(value, "runwayPrompt")
  };
}

function normalizeStoryboardRow(value: unknown): StoryboardRow {
  if (!isRecord(value)) {
    return { shot: "", scene: "", visual: "", copy: "", duration: "" };
  }

  return {
    shot: toText(value.shot),
    scene: toText(value.scene),
    visual: toText(value.visual),
    copy: toText(value.copy),
    duration: toText(value.duration)
  };
}

function toText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function requiredText(value: Record<string, unknown>, field: (typeof requiredStringFields)[number]) {
  const text = value[field];
  if (typeof text !== "string" || text.trim().length === 0) {
    throw new Error("AI 返回格式不完整，请重试。");
  }

  return text.trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
