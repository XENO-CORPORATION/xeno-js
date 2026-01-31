import type { Model, ModelList } from '../types';
import type { Xeno } from '../client';

export class ModelsResource {
  private client: Xeno;

  constructor(client: Xeno) {
    this.client = client;
  }

  /**
   * List all available models.
   */
  async list(): Promise<ModelList> {
    const response = await this.client._request('GET', '/models');
    return response as unknown as ModelList;
  }

  /**
   * Get details about a specific model.
   */
  async retrieve(modelId: string): Promise<Model> {
    const response = await this.client._request('GET', `/models/${modelId}`);
    return response as unknown as Model;
  }
}
