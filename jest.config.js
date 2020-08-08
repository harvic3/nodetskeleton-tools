module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "coverage",
  modulePathIgnorePatterns: [
    "./src/locals/test/locals/",
    "./src/locals/package.json",
    "./src/mapper/package.json",
    "./src/result/package.json",
    "./src/validator/package.json",
    "./src/locals/test/locals/resources",
    "./src/result/test/resultCodes.json",
  ],
};
