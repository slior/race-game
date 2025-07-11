/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        // Override tsconfig settings for tests
        tsconfig: {
          // Disable verbatimModuleSyntax for ts-jest to handle modules correctly
          verbatimModuleSyntax: false,
        },
      },
    ],
  },
}; 