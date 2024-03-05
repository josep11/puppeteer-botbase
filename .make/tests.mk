## Run tests
test:
	npm test

## Run tests in CI mode.
test-ci:
	npm run test:ci

## Run test in tdd mode. Usage: make test-tdd PARAMS="tests/*helper*"
test-tdd:
	npm run test:tdd -- ${PARAMS}

## Run linting
lint:
	npm run lint

## Run linting fix
lint-fix:
	npm run lint:fix

## Run jest (wrapper). Usage: make jest PARAMS="-h"
jest:
	./node_modules/.bin/jest ${PARAMS}
