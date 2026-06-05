---
name: React Hook Form
description: Guidelines and best practices for using React Hook Form (RHF) in the project, particularly regarding performance, memoization, and React Compiler compatibility.
---

# React Hook Form (RHF) Best Practices

When working with React Hook Form in this project, follow these guidelines to ensure maximum performance and compatibility with React's experimental Compiler.

## 1. Use `useWatch` instead of `watch()`

React 19's experimental React Compiler automatically memoizes components to optimize performance. However, extracting and calling the `watch()` function directly from the `useForm` return object can break the rules the compiler relies on to safely memoize the component, leading to a "stale UI" or "incompatible library" warning.

**❌ Avoid this:**
```tsx
const { watch } = useForm();
const selectedValue = watch("fieldName");
```

**✅ Do this instead:**
Use the dedicated `useWatch` hook from `react-hook-form`. This safely isolates the field subscription and keeps re-renders compatible with the compiler's memoization optimizations.

```tsx
import { useForm, useWatch } from "react-hook-form";

// Note: control must be passed to useWatch
const { control } = useForm();
const selectedValue = useWatch({ control, name: "fieldName" });
```
