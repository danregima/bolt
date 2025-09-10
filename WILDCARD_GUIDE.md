# Bolt Wildcard Guide

This guide explains how wildcard patterns work in Bolt for workspace configuration and filtering.

## Overview

Bolt uses glob patterns (wildcards) to match files and directories. These patterns are used in:
- Workspace configuration (`bolt.workspaces` in package.json)
- Filtering workspaces with `--only` and `--ignore` flags
- File-system based filtering with `--only-fs` and `--ignore-fs` flags

## Basic Wildcard Patterns

### Single Character Wildcards

- `?` - Matches any single character
  ```json
  {
    "bolt": {
      "workspaces": ["package?"]
    }
  }
  ```
  Matches: `package1`, `packageA`, but not `package` or `package12`

### Multi-Character Wildcards

- `*` - Matches any number of characters within a single directory level
  ```json
  {
    "bolt": {
      "workspaces": ["packages/*"]
    }
  }
  ```
  Matches: `packages/foo`, `packages/bar`, `packages/my-app`

- `**` - Matches any number of directories (recursive)
  ```json
  {
    "bolt": {
      "workspaces": ["packages/**"]
    }
  }
  ```
  Matches: `packages/foo`, `packages/utils/bar`, `packages/apps/web/client`

## Character Sets and Ranges

### Bracket Notation `[characters]`

- `[abc]` - Matches any single character from the set
  ```json
  {
    "bolt": {
      "workspaces": ["package[123]"]
    }
  }
  ```
  Matches: `package1`, `package2`, `package3`

- `[a-z]` - Matches any character in the range
  ```json
  {
    "bolt": {
      "workspaces": ["package[a-z]"]
    }
  }
  ```
  Matches: `packagea`, `packageb`, ..., `packagez`

- `[0-9]` - Matches any digit
  ```json
  {
    "bolt": {
      "workspaces": ["version[0-9]"]
    }
  }
  ```
  Matches: `version1`, `version2`, ..., `version9`

### Negated Character Sets `[!characters]`

- `[!abc]` - Matches any character NOT in the set
  ```json
  {
    "bolt": {
      "workspaces": ["package[!0-9]"]
    }
  }
  ```
  Matches: `packagea`, `packageB`, but not `package1`

## Choice Patterns `{option1,option2}`

- `{utils,apps}` - Matches either option
  ```json
  {
    "bolt": {
      "workspaces": ["{utils,apps}/*"]
    }
  }
  ```
  Matches: `utils/logger`, `apps/web`, `apps/mobile`

- Multiple choices with paths:
  ```json
  {
    "bolt": {
      "workspaces": ["packages/{frontend,backend}/*"]
    }
  }
  ```
  Matches: `packages/frontend/web`, `packages/backend/api`

## Complex Nested Patterns

### Understanding the Example: `../{org[i]}/{pro[j]}/{wor[k]}/{use[r]}/[utils,apps]`

This complex pattern breaks down as follows:

1. `../` - Go up one directory level
2. `{org[i]}` - Match directories like `orga`, `orgb`, `orgc`, etc.
3. `{pro[j]}` - Match directories like `proa`, `prob`, `proc`, etc.
4. `{wor[k]}` - Match directories like `wora`, `worb`, `worc`, etc.
5. `{use[r]}` - Match directories like `usea`, `useb`, `usec`, etc.
6. `[utils,apps]` - This is incorrect syntax - should be `{utils,apps}`

**Corrected pattern:** `../{org[a-z]}/{pro[a-z]}/{wor[a-z]}/{use[a-z]}/{utils,apps}`

This would match paths like:
- `../orga/proa/wora/usea/utils`
- `../orgb/prob/worb/useb/apps`
- `../orgc/proc/worc/usec/utils`

### Practical Nested Examples

```json
{
  "bolt": {
    "workspaces": [
      "packages/{frontend,backend}/**",
      "tools/{build,test}/*",
      "services/*/src"
    ]
  }
}
```

This configuration matches:
- All packages under frontend or backend (recursively)
- Direct children of build or test tools
- The src directory of any service

## Real-World Workspace Configurations

### Simple Monorepo
```json
{
  "bolt": {
    "workspaces": ["packages/*"]
  }
}
```

### Organized by Type
```json
{
  "bolt": {
    "workspaces": [
      "apps/*",
      "libs/*",
      "tools/*"
    ]
  }
}
```

### Complex Multi-Level Organization
```json
{
  "bolt": {
    "workspaces": [
      "packages/{frontend,backend}/*",
      "shared/{utils,components}/*",
      "tools/{build,test,docs}/*",
      "services/*/packages/*"
    ]
  }
}
```

### Excluding Patterns with Negation
```json
{
  "bolt": {
    "workspaces": [
      "packages/*",
      "!packages/legacy*",
      "!packages/*/node_modules"
    ]
  }
}
```

## Alternative Workspace Configuration

Bolt also supports alternative configuration formats. For example:

```json
{
  "name": "my-project",
  "opencog": {
    "atomspaces": [
      "cogutils/*",
      "cogservers/*"
    ]
  }
}
```

Any top-level configuration section with `workspaces` or `atomspaces` fields will be recognized.

## Using Wildcards with Bolt Commands

### Filtering Workspaces by Name
```bash
# Run tests only in packages matching pattern
bolt ws --only="*-utils" run test

# Exclude packages matching pattern
bolt ws --ignore="*-legacy" run build
```

### Filtering by File System Path
```bash
# Only packages in specific directories
bolt ws --only-fs="frontend/*" run build

# Exclude specific directories
bolt ws --ignore-fs="packages/legacy/*" run test
```

### Complex Filtering
```bash
# Combine multiple filters
bolt ws --only="*-app" --ignore-fs="packages/old/*" run start
```

## Common Patterns and Use Cases

### 1. Scope-based Organization
```json
{
  "bolt": {
    "workspaces": [
      "@myorg/apps/*",
      "@myorg/libs/*",
      "@myorg/tools/*"
    ]
  }
}
```

### 2. Environment-specific Packages
```json
{
  "bolt": {
    "workspaces": [
      "packages/{dev,staging,prod}/*",
      "shared/*"
    ]
  }
}
```

### 3. Platform-specific Organization
```json
{
  "bolt": {
    "workspaces": [
      "packages/{web,mobile,desktop}/**",
      "shared/{utils,types}/*"
    ]
  }
}
```

## Best Practices

1. **Start Simple**: Begin with basic patterns like `packages/*` and evolve as needed
2. **Be Specific**: Use specific patterns to avoid accidentally including unwanted directories
3. **Use Negation**: Exclude directories you don't want with `!` patterns
4. **Test Patterns**: Use `bolt ws` commands to verify your patterns match expected packages
5. **Document Complex Patterns**: Add comments in your package.json to explain complex patterns

## Troubleshooting

### Common Issues

1. **Pattern doesn't match**: Use `bolt ws` to list matched workspaces and verify your pattern
2. **Too many matches**: Add more specific patterns or use negation to exclude unwanted matches
3. **Nested workspaces not found**: Make sure to use `**` for recursive matching

### Debugging Commands

```bash
# List all workspaces
bolt ws

# Test pattern matching
bolt ws --only="your-pattern" 

# Check specific directory
bolt ws --only-fs="path/*"
```

## Advanced Pattern Examples

Here are specific examples of workspace patterns and their explanations:

### Deep Recursive Matching
```json
{
  "bolt": {
    "workspaces": ["**/bolt/"]
  }
}
```
**Explanation**: Matches any directory named `bolt` at any depth in the file system. The `**` recursively searches through all subdirectories, and `/` at the end specifically matches directories (not files).

**Matches**:
- `packages/bolt/`
- `src/tools/bolt/`
- `deep/nested/structure/bolt/`
- `bolt/` (in current directory)

### Universal Matching
```json
{
  "bolt": {
    "workspaces": ["**"]
  }
}
```
**Explanation**: Matches absolutely everything recursively - all directories and subdirectories from the current location. This is the most permissive pattern possible.

**Matches**: Every directory and subdirectory in your project (use with caution!)

### Single Character Wildcard with Paths
```json
{
  "bolt": {
    "workspaces": ["org?/bolt/**"]
  }
}
```
**Explanation**: Matches directories that start with "org" followed by exactly one character, then contains a `bolt` directory, and includes everything under that `bolt` directory recursively.

**Matches**:
- `org1/bolt/package.json`
- `orgA/bolt/src/index.js`
- `org_/bolt/utils/helper.js`

**Does NOT match**:
- `org/bolt/` (missing character after "org")
- `org12/bolt/` (too many characters after "org")

### Relative Path Navigation
```json
{
  "bolt": {
    "workspaces": ["../../bolt/**"]
  }
}
```
**Explanation**: Navigates up two directory levels (`../../`) from the current package.json location, then matches the `bolt` directory and everything under it recursively.

**Example**: If your package.json is in `/project/apps/web/package.json`, this pattern will look for `/project/bolt/**`

**Matches**:
- `../../bolt/packages/utils`
- `../../bolt/src/components`
- `../../bolt/tools/build`

### Double Array Notation
```json
{
  "bolt": {
    "workspaces": [["bolt/**"]]
  }
}
```
**Explanation**: This uses double array notation, which is a special Bolt syntax for workspace groups or alternative configuration formats. The inner array `["bolt/**"]` is treated as a single workspace pattern group.

**Note**: This is advanced syntax - in most cases, you should use the single array format: `["bolt/**"]`

## Technical Details

Bolt uses the following libraries for glob pattern matching:
- [`multimatch`](https://github.com/sindresorhus/multimatch) - For pattern matching
- [`globby`](https://github.com/sindresorhus/globby) - For file system globbing
- [`minimatch`](https://github.com/isaacs/minimatch) - Core pattern matching engine

These follow standard Unix shell globbing rules with some enhancements for JavaScript environments.