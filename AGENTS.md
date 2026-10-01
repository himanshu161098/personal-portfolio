# Agent Instructions & Workflow Rules

## Mandatory Automatic Git Push Rule
- **Rule**: Whenever any file in this repository (`e:\Level 1\Personal Portfolio`) is created, edited, refactored, or updated, the assistant **MUST** automatically:
  1. Stage the changes: `git add -A`
  2. Create a meaningful commit: `git commit -m "..."`
  3. Push immediately to GitHub: `git push origin main`
- **Execution**: Do not wait for the user to prompt for a commit/push. Always execute this workflow automatically at the end of making any code or content changes.
