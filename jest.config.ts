module.exports = {
  roots: ["<rootDir>/src", "<rootDir>/__tests__"], // Adjust based on your project structure
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
  },
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/src/(.*)$": "<rootDir>/src/$1",
    "^@/test/(.*)$": "<rootDir>/__tests__/$1",
  },
  testMatch: ["**/*.test.ts"],
  coverageReporters: ["json-summary", "text", "lcov"],
  collectCoverage: true,
  collectCoverageFrom: ["./src/**"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
