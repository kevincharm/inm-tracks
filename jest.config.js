module.exports = {
    preset: 'ts-jest/presets/js-with-ts',
    testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/src/lib/jest.setup.ts'],
    setupFilesAfterEnv: [
        '<rootDir>/src/lib/jest.setupAfterEnv.ts',
        '<rootDir>/src/lib/mock-server.ts',
    ],
    // Ref: https://stackoverflow.com/questions/46898638/importing-images-breaks-jest-test
    moduleNameMapper: {
        '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/src/lib/fileMock.ts',
    },
}
