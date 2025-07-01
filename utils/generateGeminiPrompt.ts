import { Insight, UIStyle } from '../lib/types'

export interface GeminiPromptInput {
  insight: Insight
  uiStyle: UIStyle
}

export function generateGeminiPrompt(input: GeminiPromptInput): string {
  const { insight, uiStyle } = input

  // 構造化データを整理
  const why = insight.vision || "innovative solution"
  const who = insight.target || "target users"
  const what = insight.features?.join(", ") || "key features"
  const how = insight.value || "valuable service"
  const impact = insight.motivation || "positive impact"

  // UIスタイル情報を整理
  const styleName = uiStyle.name || "modern"
  const styleDescription = uiStyle.description || "clean and professional"
  const primaryColor = uiStyle.colors?.primary || "#3B82F6"
  const secondaryColor = uiStyle.colors?.secondary || "#8B5CF6"
  const category = uiStyle.category || "modern"
  const personality = uiStyle.personality?.join(", ") || "clean, professional"

  // 英語プロンプトを生成（1文）
  const prompt = `Create a complete web application with HTML, CSS, and JavaScript that embodies "${why}" for ${who}, featuring ${what} to deliver ${how} and achieve ${impact}, using a ${styleName} ${category} design style that is ${styleDescription} with ${personality} personality, primary color ${primaryColor} and secondary color ${secondaryColor}, ensuring responsive design and modern user experience.`

  return prompt
}

// 使用例（テスト用）
export function generateGeminiPromptExample(): string {
  const exampleInput: GeminiPromptInput = {
    insight: {
      vision: "make learning fun and accessible",
      target: "students and lifelong learners",
      features: ["interactive lessons", "progress tracking", "gamification"],
      value: "personalized learning experience",
      motivation: "bridge the education gap"
    },
    uiStyle: {
      id: "modern-minimal",
      name: "Modern Minimal",
      description: "clean and focused design",
      category: "modern",
      colors: {
        primary: "#2563EB",
        secondary: "#7C3AED",
        accent: "#F59E0B",
        background: "#FFFFFF",
        text: "#1F2937"
      },
      typography: {
        heading: "Inter",
        body: "Inter"
      },
      spacing: "comfortable",
      personality: ["clean", "professional", "accessible"]
    }
  }

  return generateGeminiPrompt(exampleInput)
}