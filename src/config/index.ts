import { ConfigInterface } from './config';
import { ProductionConfig } from './config.production';
import { StagingConfig } from './config.staging';

function getConfig(): ConfigInterface {
  if (__DEV__) {
    return StagingConfig;
  }
  return ProductionConfig;
}

export const Config: ConfigInterface = getConfig();
