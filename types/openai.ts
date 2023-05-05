export type ChatGPTAgent = "user" | "system" | "assistant"
export interface ChatGPTMessage {
  role: ChatGPTAgent
  content: string
}

export interface OpenAIStreamPayload {
  model: "gpt-3.5-turbo" | "gpt-4"
  messages: ChatGPTMessage[]
  temperature: number
  max_tokens: number
  stream: boolean
}
