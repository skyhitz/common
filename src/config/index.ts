import { ConfigInterface } from './config';
import { ProductionConfig } from './config.production';
import { StagingConfig } from './config.staging';
declare const __DEV__: boolean;

const productionModeOn = process.env.SKYHITZ_ENV === 'production' || !__DEV__;
export const isTesting = productionModeOn ? 0 : 1;

let config: ConfigInterface = ProductionConfig;

if (isTesting) {
  config = StagingConfig;
}

export const Config = config;
