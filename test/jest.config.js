/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    setupFiles: ['<rootDir>/jest.setup.ts'],
    testEnvironment: "node",
    testTimeout: 30000,
    transform: {
        "^.+\.tsx?$": ["ts-jest",{}],
    },
    bail: true
};