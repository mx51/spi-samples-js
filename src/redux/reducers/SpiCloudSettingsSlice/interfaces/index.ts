export type SpiCloudEnvironment = 'dev' | 'qa' | 'live' | 'other';
export interface ISpiCloudSettingsProps {
  dev: {
    apiBaseUrl: string;
    apiKey: string;
    secretPartA: string;
  };
  qa: {
    apiBaseUrl: string;
    apiKey: string;
    secretPartA: string;
  };
  live: {
    apiBaseUrl: string;
    apiKey: string;
    secretPartA: string;
  };
  other: {
    apiBaseUrl: string;
    apiKey: string;
    secretPartA: string;
  };
}
