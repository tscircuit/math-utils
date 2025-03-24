# CLAUDE.md - @tscircuit/math-utils

## Commands
- Build: `bun run build`
- Lint: `bunx @biomejs/biome check --apply .`
- Format: `bunx @biomejs/biome format --write .`
- Run tests: `bun test`
- Run single test: `bun test tests/file.test.ts` or `bun test -t "test description"`

## Code Style
- **Formatting**: Uses Biome with 2-space indentation
- **File naming**: kebab-case (e.g., `line-intersections.ts`)
- **Typing**: Strong typing with TypeScript, `strict: true`
- **Imports**: ESM format, organized by Biome
- **Semicolons**: Only as needed (ASI-friendly)
- **JSX**: Double quotes, no trailing commas
- **Function style**: Arrow functions with parentheses
- **Error handling**: Return explicit error values, avoid throwing
- **Comments**: Minimal, descriptive when needed
- **Testing**: Uses Bun test runner with `expect`, `test`, and `describe`

## Project Structure
- `/src`: Source code with ESM exports
- `/tests`: Bun-based test files
- `Point` interface for geometric coordinates