import { ConfigInterface } from './config';
import { ProductionConfig } from './config.production';
import { StagingConfig } from './config.staging';

const productionModeOn = process.env.NODE_ENV === 'production';
function getConfig(): ConfigInterface {
  if (productionModeOn) {
    return ProductionConfig;
  }
  return StagingConfig;
}

export const Config: ConfigInterface = getConfig();
export const isTesting = productionModeOn ? 0 : 1;