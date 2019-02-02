import { ConfigInterface } from './config';
import { ProductionConfig } from './config.production';

const productionModeOn = process.env.NODE_ENV === 'production';

export const Config: ConfigInterface = ProductionConfig;
export const isTesting = productionModeOn ? 0 : 1;
