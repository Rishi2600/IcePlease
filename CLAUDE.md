# IcePlease project rules

These rules apply to this project only.

## Git

- **One branch per category.** Each category of work (a UI refactor, audit fixes, and so on) gets a single branch, and all of that work stays on it. Never push directly to `main`.
- **Commit and push automatically.** On the category branch, commit and push after about 150 lines of change or one small addition or modification, whichever comes first.
- **One-line commit messages.** Do not add `Co-Authored-By` or any other Claude attribution.

## Code

- Keep the code simple and readable.
- Add comments only where needed, and keep them to the point.

## Docs

- `README.md` and `CLAUDE.md` stay in the repo root. All other docs go in `docs/`, which is gitignored and never pushed.
