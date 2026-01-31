import type {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionOptions,
} from '../types';
import type { Xeno } from '../client';

class Completions {
  private client: Xeno;

  constructor(client: Xeno) {
    this.client = client;
  }

  /**
   * Create a chat completion.
   */
  async create(options: ChatCompletionOptions): Promise<ChatCompletion>;
  async create(
    options: ChatCompletionOptions & { stream: true }
  ): Promise<AsyncIterable<ChatCompletionChunk>>;
  async create(
    options: ChatCompletionOptions
  ): Promise<ChatCompletion | AsyncIterable<ChatCompletionChunk>> {
    const {
      messages,
      model = 'gpt-4o',
      temperature,
      top_p,
      max_tokens,
      stop,
      stream = false,
      tools,
      tool_choice,
      response_format,
      seed,
      user,
      ...rest
    } = options;

    const payload: Record<string, unknown> = {
      model,
      messages,
      ...rest,
    };

    if (temperature !== undefined) payload.temperature = temperature;
    if (top_p !== undefined) payload.top_p = top_p;
    if (max_tokens !== undefined) payload.max_tokens = max_tokens;
    if (stop !== undefined) payload.stop = stop;
    if (stream) payload.stream = true;
    if (tools) payload.tools = tools;
    if (tool_choice) payload.tool_choice = tool_choice;
    if (response_format) payload.response_format = response_format;
    if (seed !== undefined) payload.seed = seed;
    if (user) payload.user = user;

    if (stream) {
      return this.streamResponse(payload);
    }

    const response = await this.client._request('POST', '/chat/completions', payload);
    return response as ChatCompletion;
  }

  private async *streamResponse(
    payload: Record<string, unknown>
  ): AsyncIterable<ChatCompletionChunk> {
    const response = await this.client._requestStream('POST', '/chat/completions', payload);

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const data = trimmed.slice(6);
            if (data === '[DONE]') return;
            try {
              const chunk = JSON.parse(data) as ChatCompletionChunk;
              yield chunk;
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

export class ChatResource {
  public completions: Completions;

  constructor(client: Xeno) {
    this.completions = new Completions(client);
  }
}
