import type { Config } from '@jest/types';

// By default, all files inside `node_modules` are not transformed. But some 3rd party
// modules are published as untranspiled, Jest will not understand the code in these modules.
// To overcome this, exclude these modules in the ignore pattern.

const untranspiledModulePatterns = [
  '((jest-)?react-native',
  '@react-native(-community)?)',
  'expo(nent)?',
  '@expo(nent)?/.*',
  '@expo-google-fonts/.*',
  'react-navigation',
  '@react-native/.*',
  '@react-navigation/.*',
  '@unimodules/.*',
  'unimodules',
  'sentry-expo',
  'native-base',
  'react-native-svg',
];

const config: Config.InitialOptions = {
  coverageReporters: ['json', 'json-summary', 'lcov'],
  projects: [
    {
      preset: 'jest-expo/android',
    },
    {
      preset: 'jest-expo/ios',
    },
    {
      preset: 'jest-expo/web',
    },
  ],
  testMatch: [
    '**/__tests__/**/*[.-]test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  transformIgnorePatterns: [
    `node_modules/(?!${untranspiledModulePatterns.join('|')})`,
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
};

export default config;
