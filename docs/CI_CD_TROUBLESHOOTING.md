# CI/CD Troubleshooting Guide

## Issue: NPM Cache Error in GitHub Actions

### Problem Description

**Error Message:**
```
Error: Some specified paths were not resolved, unable to cache dependencies.
```

**Root Cause:**
The GitHub Actions workflow was configured to cache npm dependencies using `package-lock.json` as the cache key:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
    cache-dependency-path: portfolio-frontend/package-lock.json  # ❌ This file doesn't exist!
```

However, `package-lock.json` was not committed to the repository, causing the cache setup to fail.

---

## Solution Implemented

### Short-term Fix (Current)

✅ **Removed cache configuration from workflow** [commit: 76d66531]

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    # Removed cache configuration
```

✅ **Changed `npm ci` to `npm install`**

```yaml
- name: Install dependencies
  working-directory: portfolio-frontend
  run: npm install  # Works without package-lock.json
```

**Trade-offs:**
- ✅ **Pro**: Pipeline works immediately
- ❌ **Con**: No caching = slower builds (~30-60s longer)
- ❌ **Con**: Non-deterministic installs (versions can vary)

---

## Recommended Long-term Solution

### Option 1: Commit package-lock.json (Recommended)

**Benefits:**
- ✅ Deterministic installs (same versions everywhere)
- ✅ Faster CI/CD with caching
- ✅ Better security (audit specific versions)
- ✅ Industry standard practice

**Steps:**

1. **Generate package-lock.json locally:**
   ```bash
   cd portfolio-frontend
   rm -f package-lock.json  # Remove if exists
   npm install              # Generates fresh package-lock.json
   ```

2. **Update .gitignore:**
   ```bash
   # Remove package-lock.json from .gitignore if present
   # It SHOULD be committed!
   ```

3. **Commit the file:**
   ```bash
   git add portfolio-frontend/package-lock.json
   git commit -m "Add package-lock.json for deterministic installs"
   git push
   ```

4. **Update CI/CD workflow:**
   ```yaml
   - name: Setup Node.js
     uses: actions/setup-node@v4
     with:
       node-version: '20'
       cache: 'npm'
       cache-dependency-path: portfolio-frontend/package-lock.json
   
   - name: Install dependencies
     working-directory: portfolio-frontend
     run: npm ci  # Faster and more reliable
   ```

---

### Option 2: Use Alternative Caching

If you don't want to commit package-lock.json (not recommended):

```yaml
- name: Cache node_modules
  uses: actions/cache@v3
  with:
    path: portfolio-frontend/node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('portfolio-frontend/package.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

- name: Install dependencies
  working-directory: portfolio-frontend
  run: npm install
```

**Trade-offs:**
- ✅ Works without package-lock.json
- ❌ Still non-deterministic
- ❌ Cache based on package.json only (less precise)

---

## Why package-lock.json Should Be Committed

### 1. **Deterministic Installs**

Without package-lock.json:
```json
// package.json
"dependencies": {
  "react": "^18.2.0"  // Could install 18.2.0, 18.2.1, 18.3.0, etc.
}
```

- Developer A installs: `react@18.2.0`
- Developer B installs: `react@18.3.0` (released yesterday)
- CI/CD installs: `react@18.2.5`
- ❌ **Different versions = potential bugs!**

With package-lock.json:
```json
// package-lock.json
"react": {
  "version": "18.2.0",  // Exact version locked
  "resolved": "https://registry.npmjs.org/react/-/react-18.2.0.tgz",
  "integrity": "sha512-..."
}
```

- Everyone gets: `react@18.2.0`
- ✅ **Same version everywhere!**

---

### 2. **Performance: npm ci vs npm install**

| Command | With package-lock.json | Without package-lock.json |
|---------|------------------------|---------------------------|
| `npm ci` | ✅ 10-20 seconds | ❌ Won't work |
| `npm install` | ⚠️ 30-40 seconds | ❌ 40-60 seconds |

**npm ci benefits:**
- Deletes node_modules and reinstalls from scratch
- Uses exact versions from package-lock.json
- 2-3x faster than npm install
- Fails if package.json and package-lock.json are out of sync

---

### 3. **Security**

**With package-lock.json:**
```bash
npm audit fix  # Updates package-lock.json with secure versions
git commit -m "Security: update dependencies"
```
- ✅ Team reviews security fixes
- ✅ Controlled updates
- ✅ Full audit trail

**Without package-lock.json:**
- ❌ Security updates applied randomly
- ❌ No visibility into what changed
- ❌ Could break production

---

### 4. **CI/CD Caching**

**With caching (needs package-lock.json):**
```
Build time: ~2 minutes
  - Cache restore: 5s
  - npm ci: 15s
  - Build: 90s
```

**Without caching:**
```
Build time: ~4 minutes
  - npm install: 60s
  - Build: 90s
  - Security audit: 30s
```

**Savings:** ~50% faster builds = more deploys, faster feedback

---

## Common CI/CD Issues and Fixes

### Issue 1: "Cannot find module"

**Cause:** Dependencies not installed correctly

**Fix:**
```yaml
- name: Clean install
  run: |
    rm -rf node_modules package-lock.json
    npm install
```

---

### Issue 2: "Build failed - out of memory"

**Cause:** Node.js heap size too small for large builds

**Fix:**
```yaml
- name: Build with more memory
  run: NODE_OPTIONS="--max-old-space-size=4096" npm run build
  env:
    NODE_ENV: production
```

---

### Issue 3: "ESLint errors"

**Cause:** Code doesn't pass linting

**Fix options:**

1. **Fix the code (recommended):**
   ```bash
   npm run lint -- --fix
   ```

2. **Make it non-blocking:**
   ```yaml
   - name: Run ESLint
     run: npm run lint || true
     continue-on-error: true
   ```

3. **Disable in CI (not recommended):**
   ```bash
   NEXT_ESLINT_CONFIG_DISABLE=true npm run build
   ```

---

### Issue 4: "Docker build fails"

**Cause:** Missing files or incorrect context

**Fix:**
```yaml
- name: Debug Docker context
  run: |
    echo "Files in context:"
    ls -la portfolio-frontend/
    echo "Dockerfile content:"
    cat portfolio-frontend/Dockerfile
```

---

### Issue 5: "AWS ECR login fails"

**Cause:** Invalid credentials or permissions

**Check:**
```bash
# Verify secrets are set in GitHub
# Settings > Secrets and variables > Actions
# - AWS_ACCESS_KEY_ID
# - AWS_SECRET_ACCESS_KEY
# - AWS_ACCOUNT_ID
```

**Test locally:**
```bash
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin \
  YOUR_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com
```

---

## Workflow Optimization Tips

### 1. **Parallel Jobs**

Run independent jobs in parallel:

```yaml
jobs:
  build-frontend:
    needs: security-scan  # Wait for security
  
  build-chatbot:
    needs: security-scan  # Wait for security
  
  # These run in parallel!
```

---

### 2. **Conditional Execution**

Skip unnecessary steps:

```yaml
# Only run on push, not PRs
if: github.event_name == 'push'

# Only on main branch
if: github.ref == 'refs/heads/main'

# Only if files changed
if: contains(github.event.head_commit.modified, 'portfolio-frontend/')
```

---

### 3. **Matrix Builds**

Test multiple versions:

```yaml
strategy:
  matrix:
    node-version: [18, 20, 21]
    os: [ubuntu-latest, windows-latest]

steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node-version }}
```

---

### 4. **Build Artifacts**

Share build outputs between jobs:

```yaml
# Job 1: Build
- name: Upload build artifacts
  uses: actions/upload-artifact@v3
  with:
    name: build-output
    path: portfolio-frontend/.next/

# Job 2: Test
- name: Download build artifacts
  uses: actions/download-artifact@v3
  with:
    name: build-output
    path: portfolio-frontend/.next/
```

---

## Debugging CI/CD Failures

### Enable Debug Logging

**In workflow file:**
```yaml
env:
  ACTIONS_STEP_DEBUG: true
  ACTIONS_RUNNER_DEBUG: true
```

**Or set in GitHub:**
- Settings > Secrets and variables > Actions
- Add: `ACTIONS_STEP_DEBUG` = `true`

---

### SSH into Runner (for private repos)

```yaml
- name: Setup tmate session
  uses: mxschmitt/action-tmate@v3
  if: failure()
```

Gets you an SSH session to debug live!

---

### Local Testing

**Use act to run workflows locally:**

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run workflow
act push

# Run specific job
act -j build-frontend
```

---

## Current Workflow Status

### ✅ Working (after fix)
- Security scanning (TruffleHog, tfsec, Checkov)
- CodeQL analysis
- Frontend build and Docker image push
- Chatbot build and Docker image push
- Kubernetes manifest updates

### ⚠️ Suboptimal (but working)
- No npm caching (slower builds)
- `npm install` instead of `npm ci` (non-deterministic)

### 🛠️ Recommended Next Steps
1. Commit package-lock.json
2. Re-enable npm caching
3. Switch to `npm ci`
4. Add integration tests
5. Add deployment smoke tests

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm ci vs npm install](https://docs.npmjs.com/cli/v9/commands/npm-ci)
- [Why commit package-lock.json](https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json)
- [GitHub Actions Cache](https://github.com/actions/cache)
- [Debugging GitHub Actions](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/enabling-debug-logging)

---

## Summary

**Problem:** Missing package-lock.json caused cache setup failure  
**Quick Fix:** Removed cache, using `npm install`  
**Long-term Solution:** Commit package-lock.json and use `npm ci`  
**Impact:** Build works but ~2x slower without caching  
**Recommendation:** Generate and commit package-lock.json
