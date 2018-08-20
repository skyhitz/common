import { ConfigInterface } from './config';
import { ProductionConfig } from './config.production';
import { StagingConfig } from './config.staging';

function getConfig(): ConfigInterface {
  if (process.env.NODE_ENV === 'production') {
    return ProductionConfig;
  }
  return StagingConfig;
}

export const Config: ConfigInterface = getConfig();
