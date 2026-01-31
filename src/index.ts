/**
 * Xeno AI SDK - Access 100+ AI models with a single API
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
 *
 * // Chat completion
 * const response = await client.chat.completions.create({
 *   model: 'gpt-4o',
 *   messages: [{ role: 'user', content: 'Hello!' }]
 * });
 * ```
 */

export { Xeno, Xeno as default } from './client';

// Types
export type {
  XenoClientOptions,
  // Image
  ImageData,
  ImageResponse,
  ImageGenerateOptions,
  ImageEditOptions,
  // Video
  VideoData,
  VideoResponse,
  VideoGenerateOptions,
  // Music
  MusicData,
  MusicResponse,
  MusicGenerateOptions,
  // Chat
  ChatMessage,
  Choice,
  Usage,
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionOptions,
  Tool,
  ToolCall,
  // Models
  Model,
  ModelList,
} from './types';

// Errors
export {
  XenoError,
  AuthenticationError,
  RateLimitError,
  APIError,
  InvalidRequestError,
  InsufficientCreditsError,
} from './errors';
