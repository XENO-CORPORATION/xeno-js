import type { ImageResponse, ImageGenerateOptions, ImageEditOptions } from '../types';
import type { Xeno } from '../client';

export class ImageResource {
  private client: Xeno;

  constructor(client: Xeno) {
    this.client = client;
  }

  /**
   * Generate an image from a text prompt.
   */
  async generate(options: ImageGenerateOptions): Promise<ImageResponse> {
    const {
      prompt,
      model = 'flux-pro-1.1',
      negative_prompt,
      width = 1024,
      height = 1024,
      steps,
      guidance_scale,
      seed,
      n = 1,
      response_format = 'url',
      ...rest
    } = options;

    const payload: Record<string, unknown> = {
      model,
      prompt,
      n,
      size: `${width}x${height}`,
      response_format,
      ...rest,
    };

    if (negative_prompt) payload.negative_prompt = negative_prompt;
    if (steps) payload.steps = steps;
    if (guidance_scale) payload.guidance_scale = guidance_scale;
    if (seed !== undefined) payload.seed = seed;

    const response = await this.client._request('POST', '/images/generations', payload);
    return { model, ...response } as ImageResponse;
  }

  /**
   * Edit an existing image based on a prompt.
   */
  async edit(options: ImageEditOptions): Promise<ImageResponse> {
    const {
      image,
      prompt,
      model = 'flux-kontext',
      mask,
      n = 1,
      ...rest
    } = options;

    const payload: Record<string, unknown> = {
      model,
      image,
      prompt,
      n,
      ...rest,
    };

    if (mask) payload.mask = mask;

    const response = await this.client._request('POST', '/images/edits', payload);
    return { model, ...response } as ImageResponse;
  }

  /**
   * Generate variations of an existing image.
   */
  async variations(
    image: string,
    options: { model?: string; n?: number } = {}
  ): Promise<ImageResponse> {
    const { model = 'flux-pro-1.1', n = 1 } = options;

    const payload = { model, image, n };
    const response = await this.client._request('POST', '/images/variations', payload);
    return { model, ...response } as ImageResponse;
  }
}
