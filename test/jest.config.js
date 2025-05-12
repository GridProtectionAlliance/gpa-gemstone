/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: "node",
    testTimeout: 30000,
    setupFilesAfterEnv: ['./src/__tests__/setup/globalSetup.ts'],
    transform: {
        "^.+\.tsx?$": ["ts-jest",{}],
    },
};