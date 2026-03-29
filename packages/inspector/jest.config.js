/** @type {import('jest').Config} */
export default {
  preset: "ts-jest/presets/default-esm",
  // jsdom gives us a real document/window for DOM tests
  testEnvironment: "jest-environment-jsdom",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          module: "ESNext",
          moduleResolution: "bundler",
        },
      },
    ],
  },
};
