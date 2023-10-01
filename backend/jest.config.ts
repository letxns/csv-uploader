module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['@babel/register'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Transformar arquivos .ts e .tsx usando ts-jest
  },
};
