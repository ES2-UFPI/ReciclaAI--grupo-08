module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/testes/jest.setup.ts'], // <-- ajuste aqui
  transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
}