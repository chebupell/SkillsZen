export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: string
}

export interface GroqChoice {
  message: {
    content: string;
    role: string;
  };
}

export interface GroqResponse {
  choices: GroqChoice[];
  id: string;
  model: string;
}
