# @gpa-gemstone/test

Testing package for GPA Gemstone libraries.

## Install Dependencies

```bash
npm ci
```

## Run All Tests

```bash
npm run tester
```

## Run Tests Using A Template

Replace the path with your target file, e.g.:

```bash
npx start-server-and-test "serve" "http-get://localhost:8085" "jest src/__tests__/path/to/YourTest.test.ts --runInBand --detectOpenHandles"
```