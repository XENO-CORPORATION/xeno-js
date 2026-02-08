import type { XenoClientOptions } from './types';
import {
  XenoError,
  AuthenticationError,
  RateLimitError,
  APIError,
  InvalidRequestError,
  InsufficientCreditsError,
} from './errors';
import { ImageResource } from './resources/image';
import { VideoResource } from './resources/video';
import { MusicResource } from './resources/music';
import { ChatResource } from './resources/chat';
import { ModelsResource } from './resources/models';

const DEFAULT_BASE_URL = 'https://api.xenostudio.ai/v1';
const DEFAULT_TIMEOUT = 60000;

/**
 * Xeno API Client
 *
 * @example
 * ```typescript
 * import Xeno from 'xeno-ai';
 *
 * const client = new Xeno({ apiKey: 'your-api-key' });
 *
 * // Generate an image
 * const image = await client.image.generate({
 *   model: 'flux-pro-1.1',
 *   prompt: 'A futuristic cityscape at sunset'
 * });
 * console.log(image.data[0].url);
 *
 * // Chat completion
 * const response = await client.chat.completions.create({
 *   model: 'gpt-4o',
 *   messages: [{ role: 'user', content: 'Hello!' }]
 * });
 * console.log(response.choices[0].message.content);
 * ```
 */
export class Xeno {
  private apiKey: string;
  private baseURL: string;
  private timeout: number;
  private maxRetries: number;

  public image: ImageResource;
  public video: VideoResource;
  public music: MusicResource;
  public chat: ChatResource;
  public models: ModelsResource;

  constructor(options: XenoClientOptions = {}) {
    const apiKey = options.apiKey || process.env.XENO_API_KEY;
    if (!apiKey) {
      throw new AuthenticationError(
        'API key is required. Pass apiKey option or set XENO_API_KEY environment variable.'
      );
    }

    this.apiKey = apiKey;
    this.baseURL = (options.baseURL || process.env.XENO_BASE_URL || DEFAULT_BASE_URL).replace(
      /\/$/,
      ''
    );
    this.timeout = options.timeout || DEFAULT_TIMEOUT;
    this.maxRetries = options.maxRetries ?? 2;

    // Initialize resources
    this.image = new ImageResource(this);
    this.video = new VideoResource(this);
    this.music = new MusicResource(this);
    this.chat = new ChatResource(this);
    this.models = new ModelsResource(this);
  }

  private getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'xeno-js/0.1.0',
    };
  }

  private handleErrorResponse(status: number, data: Record<string, unknown>): never {
    const errorMessage =
      (data.error as Record<string, string>)?.message ||
      (data as Record<string, string>).message ||
      'Unknown error';

    switch (status) {
      case 401:
        throw new AuthenticationError(errorMessage, status);
      case 429: {
        throw new RateLimitError(errorMessage, status);
      }
      case 400:
        throw new InvalidRequestError(errorMessage, status);
      case 402:
        throw new InsufficientCreditsError(errorMessage, status);
      default:
        throw new APIError(errorMessage, status);
    }
  }

  /** @internal */
  async _request(
    method: string,
    path: string,
    body?: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const url = `${this.baseURL}${path}`;
    const headers = this.getHeaders();

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = (await response.json()) as Record<string, unknown>;

        if (!response.ok) {
          this.handleErrorResponse(response.status, data);
        }

        return data;
      } catch (error) {
        if (error instanceof XenoError) throw error;
        if (attempt === this.maxRetries) {
          throw new XenoError(`Request failed: ${(error as Error).message}`);
        }
      }
    }

    throw new XenoError('Request failed after retries');
  }

  /** @internal */
  async _requestStream(
    method: string,
    path: string,
    body?: Record<string, unknown>
  ): Promise<Response> {
    const url = `${this.baseURL}${path}`;
    const headers = this.getHeaders();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = (await response.json()) as Record<string, unknown>;
        this.handleErrorResponse(response.status, data);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof XenoError) throw error;
      throw new XenoError(`Request failed: ${(error as Error).message}`);
    }
  }
}

export default Xeno;
