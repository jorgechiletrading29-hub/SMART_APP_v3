// DeepSeek API Client - Compatible with OpenAI API format
// https://api.deepseek.com

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
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

export interface DeepSeekGenerateOptions {
  model?: 'deepseek-chat' | 'deepseek-reasoner';
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export class DeepSeekClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.deepseek.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateText(
    systemPrompt: string,
    userPrompt: string,
    options: DeepSeekGenerateOptions = {}
  ): Promise<string> {
    const {
      model = 'deepseek-chat',
      temperature = 0.7,
      maxTokens = 4096,
      stream = false,
    } = options;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    try {
      console.log('[DeepSeek] Calling API with model:', model);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[DeepSeek] API Error:', response.status, errorText);
        throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
      }

      const data: DeepSeekResponse = await response.json();
      
      console.log('[DeepSeek] Response received, tokens used:', data.usage?.total_tokens);
      
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      }

      throw new Error('No response content from DeepSeek');
    } catch (error) {
      console.error('[DeepSeek] Error:', error);
      throw error;
    }
  }
}

// Singleton instance
let deepseekInstance: DeepSeekClient | null = null;

export function getDeepSeekClient(): DeepSeekClient | null {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey || apiKey.length < 10) {
    console.log('[DeepSeek] No valid API key found');
    return null;
  }

  if (!deepseekInstance) {
    deepseekInstance = new DeepSeekClient(apiKey);
    console.log('[DeepSeek] Client initialized');
  }

  return deepseekInstance;
}

export function hasDeepSeekApiKey(): boolean {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  return Boolean(apiKey && apiKey.length > 10);
}
