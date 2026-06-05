# Skill: Component Creation

When creating new UI components in this workspace, strictly adhere to the following file structure convention:

1. **Dedicated Folder**: Every component MUST live in its own dedicated folder named after the component (e.g., `src/component-name/`).
2. **Barrel Export**: The component folder MUST contain an `index.ts` file that exports the component and its associated types.
3. **Internal Files**: The component's implementation (`component-name.tsx`) and styling (`component-name.css`) should reside alongside `index.ts` within the folder.
4. **Package Export**: The package's main `src/index.ts` file should export the component via the folder's barrel file (`export * from './component-name';`).

## Example Structure

```
src/
  button/
    button.tsx
    button.css
    index.ts
  index.ts
```
