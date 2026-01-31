import type { MusicResponse, MusicGenerateOptions } from '../types';
import type { Xeno } from '../client';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MusicResource {
  private client: Xeno;

  constructor(client: Xeno) {
    this.client = client;
  }

  /**
   * Generate a music track from a text prompt.
   */
  async generate(options: MusicGenerateOptions): Promise<MusicResponse> {
    const {
      prompt,
      model = 'suno-v4',
      duration = 120,
      genre,
      mood,
      tempo,
      lyrics,
      instrumental = false,
      seed,
      wait = true,
      pollInterval = 3000,
      ...rest
    } = options;

    const payload: Record<string, unknown> = {
      model,
      prompt,
      duration,
      instrumental,
      ...rest,
    };

    if (genre) payload.genre = genre;
    if (mood) payload.mood = mood;
    if (tempo) payload.tempo = tempo;
    if (lyrics) payload.lyrics = lyrics;
    if (seed !== undefined) payload.seed = seed;

    const response = await this.client._request('POST', '/music/generations', payload);
    let result = { model, ...response } as MusicResponse;

    if (wait && ['pending', 'processing'].includes(result.status)) {
      result = await this.waitForCompletion(result.id, pollInterval);
    }

    return result;
  }

  /**
   * Get the status of a music generation.
   */
  async get(musicId: string): Promise<MusicResponse> {
    const response = await this.client._request('GET', `/music/generations/${musicId}`);
    return response as unknown as MusicResponse;
  }

  private async waitForCompletion(
    musicId: string,
    pollInterval: number
  ): Promise<MusicResponse> {
    while (true) {
      const result = await this.get(musicId);
      if (['completed', 'failed'].includes(result.status)) {
        return result;
      }
      await sleep(pollInterval);
    }
  }
}
