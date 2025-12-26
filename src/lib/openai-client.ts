// OpenAI API Client
// https://api.openai.com

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
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

export interface OpenAIGenerateOptions {
  model?: 'gpt-4o-mini' | 'gpt-4o' | 'gpt-4-turbo' | 'gpt-3.5-turbo';
  temperature?: number;
  maxTokens?: number;
}

export class OpenAIClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateText(
    systemPrompt: string,
    userPrompt: string,
    options: OpenAIGenerateOptions = {}
  ): Promise<string> {
    const {
      model = 'gpt-4o-mini', // Modelo económico y eficiente
      temperature = 0.7,
      maxTokens = 4096,
    } = options;

    const messages: OpenAIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    try {
      console.log('[OpenAI] Calling API with model:', model);
      
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
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[OpenAI] API Error:', response.status, errorText);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data: OpenAIResponse = await response.json();
      
      console.log('[OpenAI] Response received, tokens used:', data.usage?.total_tokens);
      
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      }

      throw new Error('No response content from OpenAI');
    } catch (error) {
      console.error('[OpenAI] Error:', error);
      throw error;
    }
  }
}

// Singleton instance
let openaiInstance: OpenAIClient | null = null;

export function getOpenAIClient(): OpenAIClient | null {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey || apiKey.length < 10) {
    console.log('[OpenAI] No valid API key found');
    return null;
  }

  if (!openaiInstance) {
    openaiInstance = new OpenAIClient(apiKey);
    console.log('[OpenAI] Client initialized');
  }

  return openaiInstance;
}

export function hasOpenAIApiKey(): boolean {
  const apiKey = process.env.OPENAI_API_KEY;
  return Boolean(apiKey && apiKey.length > 10);
}
