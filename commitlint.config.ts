import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // German subjects start with capitalised nouns, so no case rule is enforced.
    'subject-case': [0, 'always', []],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [0, 'always', 0],
    'footer-max-line-length': [0, 'always', 0],
  },
};

export default config;
