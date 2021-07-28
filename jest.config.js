/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    "ts-jest": {
      "tsconfig": "tsconfig.json",
      "useESM": true,
    }
  },
  testPathIgnorePatterns: ["dist/"],
  transform: {},
  extensionsToTreatAsEsm: [".ts"]
};