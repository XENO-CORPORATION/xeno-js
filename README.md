# Xeno AI JavaScript/TypeScript SDK

The official JavaScript/TypeScript SDK for [Xeno API](https://xeno-studio.com) - access 100+ AI models for image, video, music, and text generation with a single API.

## Installation

```bash
npm install xeno-ai
# or
yarn add xeno-ai
# or
pnpm add xeno-ai
```

## Quick Start

```typescript
import Xeno from 'xeno-ai';

// Initialize client
const client = new Xeno({ apiKey: 'your-api-key' });

// Or use environment variable: XENO_API_KEY
const client = new Xeno();
```

## Image Generation

```typescript
// Generate an image
const image = await client.image.generate({
  model: 'flux-pro-1.1',
  prompt: 'A futuristic cityscape at sunset',
  width: 1024,
  height: 1024,
});
console.log(image.data[0].url);

// Edit an image
const edited = await client.image.edit({
  model: 'flux-kontext',
  image: 'https://example.com/image.jpg',
  prompt: 'Add a rainbow in the sky',
});
```

### Available Image Models
- `flux-pro-1.1` - High quality, fast generation
- `flux-kontext` - Image editing and variations
- `dall-e-3` - OpenAI's DALL-E 3
- `4o-image` - GPT-4o image generation
- `stable-diffusion-xl` - Stability AI SDXL

## Video Generation

```typescript
// Generate a video
const video = await client.video.generate({
  model: 'veo-3.1',
  prompt: 'A drone shot flying over mountains at sunrise',
  duration: 5,
  resolution: '1080p',
});
console.log(video.data?.[0].url);

// Image to video
const video = await client.video.generate({
  model: 'runway-aleph',
  prompt: 'Make the water flow',
  image: 'https://example.com/landscape.jpg',
});
```

### Available Video Models
- `veo-3.1` - Google's latest video model
- `runway-aleph` - Runway's multi-task video model
- `runway-gen-3` - Runway Gen-3
- `minimax-video-01` - Minimax video generation
- `kling-v2.1` - Kling video model

## Music Generation

```typescript
// Generate a music track
const music = await client.music.generate({
  model: 'suno-v4',
  prompt: 'An upbeat electronic track with synths and drums',
  duration: 120,
  genre: 'electronic',
});
console.log(music.data?.[0].url);

// With custom lyrics
const music = await client.music.generate({
  model: 'suno-v4',
  prompt: 'A pop ballad about summer love',
  lyrics: 'Walking on the beach, sun shining bright...',
  duration: 180,
});
```

### Available Music Models
- `suno-v4` - Latest Suno model
- `suno-v3.5` - Suno v3.5
- `udio` - Udio music generation

## Chat Completions (LLM)

```typescript
// Chat completion
const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Explain quantum computing in simple terms.' },
  ],
});
console.log(response.choices[0].message.content);

// Streaming
const stream = await client.chat.completions.create({
  model: 'claude-3.5-sonnet',
  messages: [{ role: 'user', content: 'Write a poem about AI' }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0].delta.content || '');
}
```

### Available LLM Models
- `gpt-4o` - OpenAI GPT-4o
- `claude-3.5-sonnet` - Anthropic Claude 3.5 Sonnet
- `claude-3-opus` - Anthropic Claude 3 Opus
- `gemini-pro` - Google Gemini Pro
- `llama-3.1-405b` - Meta Llama 3.1 405B

## Error Handling

```typescript
import Xeno, {
  XenoError,
  AuthenticationError,
  RateLimitError,
  InsufficientCreditsError,
} from 'xeno-ai';

try {
  const image = await client.image.generate({
    model: 'flux-pro-1.1',
    prompt: '...',
  });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.log('Invalid API key');
  } else if (error instanceof RateLimitError) {
    console.log(`Rate limited. Retry after ${error.retryAfter} seconds`);
  } else if (error instanceof InsufficientCreditsError) {
    console.log('Not enough credits. Please top up.');
  } else if (error instanceof XenoError) {
    console.log(`API error: ${error.message}`);
  }
}
```

## Configuration

```typescript
const client = new Xeno({
  apiKey: 'your-api-key',
  baseURL: 'https://api.xeno-studio.com/v1', // Custom endpoint
  timeout: 60000, // Request timeout in milliseconds
  maxRetries: 2, // Number of retries on failure
});
```

## Using with OpenAI SDK

The Xeno API is OpenAI-compatible, so you can also use the OpenAI SDK:

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'your-xeno-api-key',
  baseURL: 'https://api.xeno-studio.com/v1',
});

const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

## TypeScript Support

This SDK is written in TypeScript and provides full type definitions out of the box.

```typescript
import Xeno, { ImageResponse, ChatCompletion, VideoResponse } from 'xeno-ai';

const client = new Xeno({ apiKey: 'your-api-key' });

// All responses are fully typed
const image: ImageResponse = await client.image.generate({
  prompt: 'A sunset',
});
```

## License

MIT
