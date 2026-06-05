# Pre-Commit Code Quality Checks

Whenever you are asked to "compose commits", "commit changes", or before making any final commits to the Noria monorepo, you MUST automatically perform the following checks and fix any problem before proceeding:

1. **Run Linter:**
   - Run `pnpm lint` in the modified packages (e.g., `cd apps/web && pnpm lint`).
   - If there are any ESLint problem, YOU MUST FIX THEM proactively before committing. You should also run `pnpm lint --fix` to auto-fix where possible.

2. **Run TypeScript Checker:**
   - Check for TypeScript compilation problems in the modified packages (e.g., by running `pnpm tsc --noEmit` inside the package directory).
   - If there are any TypeScript problems, YOU MUST FIX THEM proactively before committing.

3. **Commit Process:**
   - Only proceed with `git commit` once both the linter and the typechecker pass with 0 problems. Do not ask for user permission to fix these problem, simply fix them.
