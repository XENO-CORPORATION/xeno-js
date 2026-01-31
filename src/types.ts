// ============== Image Types ==============

export interface ImageData {
  url?: string;
  b64_json?: string;
  revised_prompt?: string;
}

export interface ImageResponse {
  created: number;
  data: ImageData[];
  model: string;
}

export interface ImageGenerateOptions {
  prompt: string;
  model?: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  guidance_scale?: number;
  seed?: number;
  n?: number;
  response_format?: 'url' | 'b64_json';
}

export interface ImageEditOptions {
  image: string;
  prompt: string;
  model?: string;
  mask?: string;
  n?: number;
}

// ============== Video Types ==============

export interface VideoData {
  url?: string;
  thumbnail_url?: string;
  duration?: number;
  status?: string;
}

export interface VideoResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created: number;
  data?: VideoData[];
  model: string;
  error?: string;
}

export interface VideoGenerateOptions {
  prompt: string;
  model?: string;
  image?: string;
  duration?: number;
  resolution?: '480p' | '720p' | '1080p' | '4k';
  fps?: number;
  aspect_ratio?: string;
  seed?: number;
  wait?: boolean;
  pollInterval?: number;
}

// ============== Music Types ==============

export interface MusicData {
  url?: string;
  duration?: number;
  title?: string;
  tags?: string[];
}

export interface MusicResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created: number;
  data?: MusicData[];
  model: string;
  error?: string;
}

export interface MusicGenerateOptions {
  prompt: string;
  model?: string;
  duration?: number;
  genre?: string;
  mood?: string;
  tempo?: number;
  lyrics?: string;
  instrumental?: boolean;
  seed?: number;
  wait?: boolean;
  pollInterval?: number;
}

// ============== Chat Types ==============

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content?: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface Choice {
  index: number;
  message: ChatMessage;
  finish_reason?: string | null;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface ChatCompletion {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: Choice[];
  usage?: Usage;
}

export interface DeltaMessage {
  role?: string;
  content?: string | null;
  tool_calls?: ToolCall[];
}

export interface StreamChoice {
  index: number;
  delta: DeltaMessage;
  finish_reason?: string | null;
}

export interface ChatCompletionChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: StreamChoice[];
}

export interface ChatCompletionOptions {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stop?: string | string[];
  stream?: boolean;
  tools?: Tool[];
  tool_choice?: string | { type: string; function: { name: string } };
  response_format?: { type: string };
  seed?: number;
  user?: string;
}

export interface Tool {
  type: 'function';
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
}

// ============== Model Types ==============

export interface Model {
  id: string;
  object: 'model';
  created: number;
  owned_by: string;
}

export interface ModelList {
  object: 'list';
  data: Model[];
}

// ============== Client Types ==============

export interface XenoClientOptions {
  apiKey?: string;
  baseURL?: string;
  timeout?: number;
  maxRetries?: number;
}
