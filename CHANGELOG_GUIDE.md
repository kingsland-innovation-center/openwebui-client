# Changelog Guide

This project uses [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) with the Angular preset to automatically generate changelog entries from git commit messages.

## How It Works

The `version` script in `package.json` automatically generates changelog entries when you run `npm version`:

```json
"version": "conventional-changelog -p angular -i CHANGELOG.md -s && git add CHANGELOG.md"
```

This script:
1. Reads git commit history since the last tag
2. Parses commits following [Conventional Commits](https://www.conventionalcommits.org/) format
3. Generates changelog entries and prepends them to `CHANGELOG.md`
4. Stages the updated `CHANGELOG.md` file for commit

## Commit Message Format

To ensure your commits appear in the changelog, use the Conventional Commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, missing semi colons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Changes to build process or auxiliary tools
- `ci`: Changes to CI configuration files and scripts
- `build`: Changes that affect the build system or external dependencies

### Examples

```bash
# Feature
git commit -m "feat: add support for streaming responses"

# Bug fix
git commit -m "fix: handle timeout errors correctly"

# Breaking change
git commit -m "feat(api): change response format

BREAKING CHANGE: Response format changed from array to object"

# With scope
git commit -m "feat(client): add retry logic for failed requests"
```

## Versioning Workflow

### Local Development

1. Make your changes and commit using conventional commit format:
   ```bash
   git commit -m "feat: add new feature"
   ```

2. When ready to release, bump the version:
   ```bash
   npm version patch  # for bug fixes (1.1.0 -> 1.1.1)
   npm version minor   # for new features (1.1.0 -> 1.2.0)
   npm version major  # for breaking changes (1.1.0 -> 2.0.0)
   ```

3. The `version` script will:
   - Generate changelog entries from commits since last tag
   - Update `CHANGELOG.md`
   - Stage `CHANGELOG.md` for commit
   - Bump version in `package.json`
   - Create a git commit with the version bump

4. Push the changes:
   ```bash
   git push && git push --tags
   ```

### CI/CD Workflow

The GitHub Actions workflow automatically handles changelog generation:

1. When you trigger the "Publish to npm" workflow manually:
   - It bumps the version using `npm version`
   - The `version` script automatically generates the changelog
   - Commits and pushes the changes
   - Publishes to npm

2. When you create a GitHub release:
   - The workflow publishes the current version from `package.json`
   - Make sure to generate the changelog manually before creating the release if needed

## Manual Changelog Generation

To generate the changelog without bumping the version:

```bash
npm run version
```

This will update `CHANGELOG.md` with entries from commits since the last git tag.

## Changelog Format

The generated changelog follows the Angular format:

```markdown
# Changelog

## [1.2.0] - 2024-01-15

### Features
- Add support for streaming responses
- Implement retry logic for failed requests

### Bug Fixes
- Fix timeout error handling
- Resolve memory leak in file upload

### Breaking Changes
- Change response format from array to object
```

## Best Practices

1. **Always use conventional commit format** - This ensures your commits appear in the changelog
2. **Write clear commit messages** - The commit message becomes the changelog entry
3. **Use scopes when appropriate** - Helps organize changelog entries
4. **Mark breaking changes** - Use `BREAKING CHANGE:` in the commit footer
5. **Review generated changelog** - Before publishing, review the generated changelog entries

## Troubleshooting

### Changelog is empty

- Make sure you have git tags for previous versions
- Check that your commits follow the conventional commit format
- Verify you have commits since the last tag

### Changelog includes unwanted commits

- Use `--release-count` option to limit entries
- Filter commits by type using conventional-changelog options
- Manually edit `CHANGELOG.md` if needed

### Version script fails

- Ensure `conventional-changelog-cli` is installed
- Check that `CHANGELOG.md` exists
- Verify git is initialized and you have commits

