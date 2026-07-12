<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Pre-commit verification

Before finishing code changes or committing, run:

```bash
npm run lint && npm test && npm run build
```

Never skip `npm run lint` — `npm run build` does not run ESLint.
