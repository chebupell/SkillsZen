import Groq from 'groq-sdk'

type ChatMessage = Groq.Chat.ChatCompletionMessageParam

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
})

export async function getGroqChatCompletion(messages: ChatMessage[]) {
  return await groq.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a helpful developer assistant. Use markdown.' },
      ...messages,
    ],
    model: 'llama-3.3-70b-versatile',
  })
}
