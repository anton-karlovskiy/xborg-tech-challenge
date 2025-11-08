import nextConfig from 'eslint-config-next';
import coreWebVitalsConfig from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextConfig,
  ...coreWebVitalsConfig
];

export default config;