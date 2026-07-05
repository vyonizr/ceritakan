# SDD: Test Suite for ceritakan

## Problem

Zero test coverage today. The app is small (1 API route, 5 helpers, 8 mostly-presentational components), but a few pieces have real logic that can silently break: bounds math in the random helpers, the "unseen questions" filter in the API route, and `setErrorResponse`'s throw contract. None of these are covered by TypeScript's type checker.

## Decision: scope

Test **logic, not markup**. Skip component/UI tests for now — components here are mostly JSX + framer-motion/react-joyride wiring with no branching logic, so RTL tests would mock the interesting parts and assert on styling, which is low value for a one-person project. Revisit if components grow real conditional behavior.

In scope:
- `src/helpers/*` (getRandomFloat, getRandomIntInclusive, regex, setErrorResponse)
- `src/pages/api/questions/random.ts` (handler logic, given a request/response double)

Out of scope (for now):
- Component rendering tests
- E2E/browser tests

## Tool choice: Vitest

Ladder check: stdlib has no test runner. Of installed deps, none run tests. Between Jest and Vitest (both would be new deps):

- Vitest needs no Babel/ts-jest transform config — it uses the project's existing `tsconfig.json` (`bundler` resolution, `paths: src/*`) out of the box via esbuild.
- Faster, single binary, ESM-native — matches `"module": "esnext"` already in tsconfig.
- Jest would need `ts-jest` or `babel-jest` plus a separate moduleNameMapper for the `src/*` path alias.

Vitest is the smaller diff. Use it.

## Setup

```bash
npm i -D vitest
```

`vitest.config.ts` at repo root:

```ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: { src: path.resolve(__dirname, './src') },
  },
  test: {
    environment: 'node',
  },
})
```

`package.json`:

```json
"scripts": {
  "test": "vitest run"
}
```

No test framework config beyond this — no coverage thresholds, no setup files, until something needs one.

## Test files

One file per module under test, colocated (`*.test.ts` next to source — no separate `__tests__` tree, keeps diffs small):

- `src/helpers/getRandomFloat.test.ts` — result stays within [min, max], respects default args, rounds to 1 decimal
- `src/helpers/getRandomIntInclusive.test.ts` — result stays within [min, max] inclusive, integer, respects default args
- `src/helpers/regex.test.ts` — `REGEX_COMMA_SEPARATED_NUMBER` matches "1,2,3" and "5", rejects "1,,2", "a,b", trailing comma
- `src/helpers/setErrorResponse.test.ts` — throws an `Error` with `statusCode` and `name` set as passed; defaults `name` to `'CustomError'`
- `src/pages/api/questions/random.test.ts` — mock `getQuestions`, assert: excludes ids in `r_ids` (query and body), returns `{status:'success', data:{}}` when none unseen, returns a question shape with topic data otherwise

No mocking library needed — `vi.mock` (built into Vitest) covers stubbing `getQuestions`, and a plain object literal covers the `NextApiResponse` double (`status`/`json` spies via `vi.fn()`).

## Non-goals / explicitly deferred

- CI wiring — add a GitHub Actions step once there's a CI file to add it to; none exists today.
- Coverage reporting — add `--coverage` when someone asks "how much is covered," not preemptively.
- Component tests — revisit if a component grows a conditional/branch worth breaking.
