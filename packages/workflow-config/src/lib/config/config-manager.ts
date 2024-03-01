import { deepMerge } from '@workflow/common';
import { IConfiguration } from '@everbyte/contracts';
import { initialConfiguration } from './configuration';

let initialConfig: IConfiguration = initialConfiguration;

/**
 * Override the default config by merging in the provided values.
 *
 */
export const setConfig = (providedConfig: Partial<IConfiguration>): void => {
  initialConfig = deepMerge(initialConfig, providedConfig);
};

/**
 * Returns the app Initial config object.
 *
 */
export const getConfig = (): Readonly<IConfiguration> => {
  return initialConfig;
};
