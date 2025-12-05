# CI/CD Workflows

This directory contains GitHub Actions workflows for continuous integration and deployment.

## Workflows

### CI (`ci.yml`)

Runs on every push and pull request to `main` and `develop` branches.

**Jobs:**
- **Test**: Runs tests across multiple Node.js versions (18.x, 20.x, 22.x)
  - Installs dependencies
  - Builds the project
  - Runs test suite
  - Generates coverage reports
- **Build**: Verifies the build process produces correct artifacts

### Publish (`publish.yml`)

Publishes the package to npm when:
- A GitHub release is created
- Manually triggered via workflow_dispatch

**Steps:**
1. Checks out code
2. Sets up Node.js
3. Installs dependencies
4. Runs tests
5. Builds the project
6. Bumps version (if manual trigger)
7. Publishes to npm
8. Creates Git tag and GitHub release (if manual trigger)

## Setup

### Required Secrets

Add the following secrets to your GitHub repository:

- `NPM_TOKEN`: npm authentication token with publish permissions
  - Generate at: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
  - Required scope: `write:packages` or `publish`

### Manual Publishing

To manually publish a new version:

1. Go to Actions → Publish to npm
2. Click "Run workflow"
3. Select version type:
   - `patch` - 1.1.0 → 1.1.1
   - `minor` - 1.1.0 → 1.2.0
   - `major` - 1.1.0 → 2.0.0
   - Or specific version like `1.2.3`
4. Click "Run workflow"

### Automatic Publishing

Create a GitHub release to automatically publish:
- Tag format: `v1.2.3` (optional, will use package.json version)
- The workflow will publish the current version from package.json

## Testing Locally

Before pushing, test locally:

```bash
cd open-web-ui-client
npm install
npm test
npm run test:coverage
npm run build
```

