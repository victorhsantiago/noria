# Skill: Conventional Commits

When creating Git commits in this workspace, strictly adhere to the [Conventional Commits](https://www.conventionalcommits.org/) standard to maintain a clear and readable project history.

## Format

`<type>[optional scope]: <description>`

## Allowed Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process, dependencies, or auxiliary tools

## Rules

1. The `<description>` MUST immediately follow the colon and space.
2. The `<description>` MUST be written in the imperative, present tense (e.g., "change" not "changed" nor "changes").
3. For breaking changes, append a `!` after the type/scope (e.g., `feat(api)!: remove v1 endpoints`).

## Examples

- `feat(ui): add new neumorphic Button component`
- `fix(web): prevent page.module.css from overriding theme variables`
- `docs: update component creation guidelines`
- `refactor(ui): move Button component to dedicated directory structure`
