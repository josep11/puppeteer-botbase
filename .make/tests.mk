## Run tests
test:
	npm test

## Run tests in CI mode.
test-ci:
	npm run test:ci

## Run test in tdd mode. Usage: make test-tdd PARAMS="test/*helper*"
test-tdd:
	npm run test:fast -- ${PARAMS}

## Run linting
lint:
	npm run lint

## Run mocha (wrapper). Usage: make mocha PARAMS="-h"
mocha:
	./node_modules/.bin/mocha ${PARAMS}