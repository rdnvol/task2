import resolveConfig from 'tailwindcss/resolveConfig';
import config from '../../../tailwind.config.cjs';

export const breakpoints = resolveConfig(config).theme.screens;
