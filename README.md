# Xeno AI JavaScript/TypeScript SDK

[![npm version](https://badge.fury.io/js/xeno-ai.svg)](https://www.npmjs.com/package/xeno-ai)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The official JavaScript/TypeScript SDK for [Xeno API](https://xenostudio.ai) - access 80+ AI models for text, image, and video generation with a single API.

## Installation

```bash
npm install xeno-ai

# Or using yarn/pnpm
yarn add xeno-ai
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

## Chat Completions (LLM)

```typescript
// Chat completion
const response = await client.chat.completions.create({
  model: 'claude-sonnet-4-5',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Explain quantum computing in simple terms.' },
  ],
});
console.log(response.choices[0].message.content);

// Streaming
const stream = await client.chat.completions.create({
  model: 'gemini-2.5-pro',
  messages: [{ role: 'user', content: 'Write a poem about AI' }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0].delta.content || '');
}
```

### Available Text Models

| Model | Description |
|-------|-------------|
| `claude-opus-4-6-thinking` | Claude Opus 4.6 with extended thinking |
| `claude-opus-4-5-thinking` | Claude Opus 4.5 with extended thinking |
| `claude-sonnet-4-5` | Claude Sonnet 4.5 - Fast and capable |
| `claude-sonnet-4-5-thinking` | Claude Sonnet 4.5 with extended thinking |
| `gemini-2.5-pro` | Gemini 2.5 Pro |
| `gemini-2.5-flash` | Gemini 2.5 Flash - Fast responses |
| `gemini-2.5-flash-lite` | Gemini 2.5 Flash Lite - Fastest |
| `gemini-2.5-flash-thinking` | Gemini 2.5 Flash with thinking |
| `gemini-3-flash` | Gemini 3 Flash |
| `gemini-3-pro-high` | Gemini 3 Pro High quality |
| `gemini-3-pro-image` | Gemini 3 Pro with image understanding |
| `gemini-3-pro-low` | Gemini 3 Pro Low latency |

## Image Generation

```typescript
// Generate an image
const image = await client.image.generate({
  model: 'flux-2-max',
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

### Available Image Models (37)

**Flux Models**
| Model | Description |
|-------|-------------|
| `flux-2-max` | Flux.2 Max - Highest quality |
| `flux-2` | Flux.2 Standard |
| `flux-2-flex` | Flux.2 Flex - Flexible aspect ratios |
| `flux-2-klein` | Flux.2 Klein - Compact |
| `flux-dev` | Flux Dev |
| `flux-kontext` | Flux Kontext - Image editing |
| `flux-kontext-high` | Flux Kontext High quality |
| `flux-pro-plus` | Flux Pro Plus |
| `flux-realism` | Flux Realism - Photorealistic |

**GPT Image Models**
| Model | Description |
|-------|-------------|
| `gpt-high` | GPT Image - High quality |
| `gpt-medium` | GPT Image - Medium quality |
| `gpt-1-5-high` | GPT 1.5 Image - High quality |
| `gpt-1-5-medium` | GPT 1.5 Image - Medium quality |

**Google Imagen**
| Model | Description |
|-------|-------------|
| `imagen4-ultra` | Imagen 4 Ultra - Highest quality |
| `imagen4` | Imagen 4 |
| `imagen4-fast` | Imagen 4 Fast |
| `imagen3` | Imagen 3 |

**Other Models**
| Model | Description |
|-------|-------------|
| `ideogram` | Ideogram - Text rendering |
| `grok` | Grok image generation |
| `qwen` | Qwen image generation |
| `mystic-2-5` | Mystic 2.5 |
| `reve` | Reve |
| `runway-gen4` | Runway Gen4 |
| `seedream-4-5` | Seedream 4.5 |

## Video Generation

```typescript
// Generate a video
const video = await client.video.generate({
  model: 'google-veo3',
  prompt: 'A drone shot flying over mountains at sunrise',
});
console.log(video.data?.[0].url);

// Image to video
const video = await client.video.generate({
  model: 'kling-30',
  prompt: 'Make the water flow',
  image: 'https://example.com/landscape.jpg',
});
```

### Available Video Models (34)

**Google Veo**
| Model | Description |
|-------|-------------|
| `google-veo3_1` | Google Veo 3.1 - Latest |
| `google-veo3_1-fast` | Google Veo 3.1 Fast |
| `google-veo3` | Google Veo 3 |
| `google-veo3-fast` | Google Veo 3 Fast |
| `google-veo2` | Google Veo 2 |

**Kling**
| Model | Description |
|-------|-------------|
| `kling-30` | Kling 3.0 - Latest |
| `kling-26` | Kling 2.6 |
| `kling-25` | Kling 2.5 |
| `kling-21` | Kling 2.1 |
| `kling-21-master` | Kling 2.1 Master |
| `kling-omni1` | Kling Omni 1 |
| `kling-motion-control` | Kling Motion Control |

**Runway**
| Model | Description |
|-------|-------------|
| `runway-gen45` | Runway Gen4.5 |
| `runway-std` | Runway Standard |
| `runway-act-two` | Runway Act Two |

**OpenAI Sora**
| Model | Description |
|-------|-------------|
| `openai-sora2-pro` | Sora 2 Pro |
| `openai-sora2-standard` | Sora 2 Standard |

**Minimax**
| Model | Description |
|-------|-------------|
| `minimax-video-2_3` | Minimax Video 2.3 |
| `minimax-video-2_3-fast` | Minimax Video 2.3 Fast |
| `minimax-video-02` | Minimax Video 02 |

**Other Models**
| Model | Description |
|-------|-------------|
| `bytedance-seedance-pro-1.5` | ByteDance Seedance Pro 1.5 |
| `wan-2-6` | Wan 2.6 |
| `pixverse-5-5` | Pixverse 5.5 |
| `ltx-ltx2-pro` | LTX 2 Pro |

## Music Generation

```typescript
// Generate a music track
const music = await client.music.generate({
  model: 'suno-v4',
  prompt: 'An upbeat electronic track with synths and drums',
  duration: 120,
});
console.log(music.data?.[0].url);
```

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
    model: 'flux-2-max',
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
  baseURL: 'https://api.xenostudio.ai/v1', // Custom endpoint
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
  baseURL: 'https://api.xenostudio.ai/v1',
});

const response = await client.chat.completions.create({
  model: 'claude-sonnet-4-5',
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

## Links

- [Documentation](https://xenostudio.ai/docs)
- [API Reference](https://xenostudio.ai/docs/api)
- [Dashboard](https://xenostudio.ai/dashboard)
- [npm - xeno-ai](https://www.npmjs.com/package/xeno-ai)
- [GitHub](https://github.com/XENO-CORPORATION/xeno-js)

## Changelog

### v0.1.1 (2026-02-08)
- Updated API base URL to api.xenostudio.ai
- Added 80+ AI models including Claude, Gemini, Flux, Veo, Kling, and more
- Improved documentation with complete model listings

### v0.1.0 (2026-01-31)
- Initial release
- Image generation (generate, edit, variations)
- Video generation with async polling
- Music generation with async polling
- Chat completions with streaming
- Full TypeScript support with type definitions
- ESM and CommonJS builds

## License

MIT
