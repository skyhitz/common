import { ConfigInterface } from './config';
import { ProductionConfig } from './config.production';
import { StagingConfig } from './config.staging';

const productionModeOn = process.env.SKYHITZ_ENV === 'production';
export const isTesting = productionModeOn ? 0 : 1;

let config: ConfigInterface = ProductionConfig;

if (isTesting) {
  config = StagingConfig;
}

export const Config = config;
