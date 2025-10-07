export type ElasticsearchConfig = {
  node: string;
  username?: string;
  password?: string;
  apiKey?: string;
  maxRetries: number;
  requestTimeout: number;
  pingTimeout: number;
  articleIndex: string;
};
