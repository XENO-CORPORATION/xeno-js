import type { VideoResponse, VideoGenerateOptions } from '../types';
import type { Xeno } from '../client';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class VideoResource {
  private client: Xeno;

  constructor(client: Xeno) {
    this.client = client;
  }

  /**
   * Generate a video from a text prompt.
   */
  async generate(options: VideoGenerateOptions): Promise<VideoResponse> {
    const {
      prompt,
      model = 'veo-3.1',
      image,
      duration = 5,
      resolution = '1080p',
      fps = 24,
      aspect_ratio,
      seed,
      wait = true,
      pollInterval = 2000,
      ...rest
    } = options;

    const payload: Record<string, unknown> = {
      model,
      prompt,
      duration,
      resolution,
      fps,
      ...rest,
    };

    if (image) payload.image = image;
    if (aspect_ratio) payload.aspect_ratio = aspect_ratio;
    if (seed !== undefined) payload.seed = seed;

    const response = await this.client._request('POST', '/video/generations', payload);
    let result = { model, ...response } as VideoResponse;

    if (wait && ['pending', 'processing'].includes(result.status)) {
      result = await this.waitForCompletion(result.id, pollInterval);
    }

    return result;
  }

  /**
   * Get the status of a video generation.
   */
  async get(videoId: string): Promise<VideoResponse> {
    const response = await this.client._request('GET', `/video/generations/${videoId}`);
    return response as unknown as VideoResponse;
  }

  private async waitForCompletion(
    videoId: string,
    pollInterval: number
  ): Promise<VideoResponse> {
    while (true) {
      const result = await this.get(videoId);
      if (['completed', 'failed'].includes(result.status)) {
        return result;
      }
      await sleep(pollInterval);
    }
  }
}
