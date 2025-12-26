// OpenRouter API Client
// https://openrouter.ai - Access multiple AI models through one API

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenRouterGenerateOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

// Modelos disponibles en OpenRouter (algunos ejemplos económicos)
export const OPENROUTER_MODELS = {
  // Modelos gratuitos o muy económicos
  GEMMA_7B: 'google/gemma-7b-it:free',
  LLAMA_3_8B: 'meta-llama/llama-3-8b-instruct:free',
  MISTRAL_7B: 'mistralai/mistral-7b-instruct:free',
  // Modelos de pago pero económicos
  GPT_4O_MINI: 'openai/gpt-4o-mini',
  GPT_4O: 'openai/gpt-4o',
  CLAUDE_HAIKU: 'anthropic/claude-3-haiku',
  CLAUDE_SONNET: 'anthropic/claude-3.5-sonnet',
  DEEPSEEK_CHAT: 'deepseek/deepseek-chat',
  GEMINI_FLASH: 'google/gemini-flash-1.5',
} as const;

export class OpenRouterClient {
  private apiKey: string;
  private baseUrl: string = 'https://openrouter.ai/api/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateText(
    systemPrompt: string,
    userPrompt: string,
    options: OpenRouterGenerateOptions = {}
  ): Promise<string> {
    const {
      model = OPENROUTER_MODELS.GPT_4O_MINI, // Modelo económico por defecto
      temperature = 0.7,
      maxTokens = 4096,
    } = options;

    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    try {
      console.log('[OpenRouter] Calling API with model:', model);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://smart-student.app',
          'X-Title': 'Smart Student',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[OpenRouter] API Error:', response.status, errorText);
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
      }

      const data: OpenRouterResponse = await response.json();
      
      console.log('[OpenRouter] Response received, model:', data.model, 'tokens:', data.usage?.total_tokens);
      
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      }

      throw new Error('No response content from OpenRouter');
    } catch (error) {
      console.error('[OpenRouter] Error:', error);
      throw error;
    }
  }
}

// Singleton instance
let openRouterInstance: OpenRouterClient | null = null;

export function getOpenRouterClient(): OpenRouterClient | null {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey || apiKey.length < 10) {
    console.log('[OpenRouter] No valid API key found');
    return null;
  }

  if (!openRouterInstance) {
    openRouterInstance = new OpenRouterClient(apiKey);
    console.log('[OpenRouter] Client initialized');
  }

  return openRouterInstance;
}

export function hasOpenRouterApiKey(): boolean {
  const apiKey = process.env.OPENROUTER_API_KEY;
  return Boolean(apiKey && apiKey.length > 10);
}
