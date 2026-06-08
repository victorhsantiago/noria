# Code Quality Checks

Whenever you finish a task, or before making any final commits to the Noria monorepo, you MUST automatically perform the following checks and fix any problem before proceeding:

1. **Run Linter:**
   - Run `pnpm lint`.
   - If there are any ESLint problem (errors or warnings), YOU MUST FIX THEM proactively before committing. You should also run `pnpm lint --fix` to auto-fix where possible.

2. **Run TypeScript Checker:**
   - Check for TypeScript compilation problems by running `pnpm tscheck`.
   - If there are any TypeScript problems, YOU MUST FIX THEM proactively before committing.

3. **Commit Process:**
   - Only proceed with `git commit` once both the linter and the typechecker pass with 0 problems. Do not ask for user permission to fix these problem, simply fix them.
