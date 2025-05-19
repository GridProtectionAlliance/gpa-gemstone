/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    setupFiles: ['<rootDir>/jest.setup.ts'],
    testEnvironment: "jsdom",
    testTimeout: 30000,
    transform: {
        "^.+\.tsx?$": ["ts-jest",{}],
    },
};