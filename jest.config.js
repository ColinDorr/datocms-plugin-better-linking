/** @type {import('jest').Config} */
const config = {
	testMatch: ["**/*.test.ts?(x)"],
	transform: {
		"^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": [
			"ts-jest",
			{
				tsconfig: "tsconfig.app.json",
			},
		],
	},
	moduleNameMapper: {
		"\\.module\\.css$": "<rootDir>/src/__mocks__/styleMock.ts",
		"\\.css$": "<rootDir>/src/__mocks__/styleMock.ts",
	},
	testEnvironment: "jsdom",
};

module.exports = config;
