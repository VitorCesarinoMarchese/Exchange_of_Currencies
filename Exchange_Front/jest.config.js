// jest.config.js
module.exports = {
    testEnvironment: "jsdom", // Needed for testing React components
    transform: {
      "^.+\\.[t|j]sx?$": "babel-jest", // for transpiling JSX/TSX files
    },
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"], // For jest-dom matchers
  };
  