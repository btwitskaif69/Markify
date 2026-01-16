---
name: vercel-deployment
description: Guides Vercel deployment configurations, routing fixes (SPA fallbacks), serverless functions, edge config, environment variables, and production debugging. Use when encountering 404s, routing issues, or deployment configuration problems.
---

# Vercel Deployment Skill

This skill provides expert guidance for Vercel deployments, focusing on React/Vite SPAs.

## Core Capabilities

### SPA Routing Configuration
When deploying SPAs (React, Vue, Vite apps), the `vercel.json` must be configured to serve `index.html` for all client-side routes.

**Correct SPA rewrite pattern:**
```json
{
  "rewrites": [
    {
      "source": "/((?!assets|images|api|favicon|robots.txt|sitemap.xml).*)",
      "destination": "/index.html"
    }
  ]
}
```

**Key Rules:**
- Only exclude static files and API routes from the SPA fallback
- Never exclude client-side page routes (e.g., /features, /pricing)
- Use negative lookahead `(?!...)` for exclusions

### Common 404 Issues

1. **Direct URL access returns 404**: The rewrite rule is excluding SPA routes
   - Fix: Remove page routes from the negative lookahead, keep only static files
   
2. **API routes not working**: Missing rewrites to serverless functions
   - Fix: Add explicit API rewrites before the SPA fallback

3. **Static assets 404**: Assets directory not properly excluded
   - Fix: Ensure `assets` is in the negative lookahead

### Environment Variables
- Use `vercel env pull` to sync local `.env` with Vercel
- Prefix client-side vars with `VITE_` for Vite projects
- Never commit `.env` files with sensitive data

### Headers Configuration
For optimal caching:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### Debugging Checklist
1. Check `vercel.json` rewrite patterns
2. Verify build output directory matches `outputDirectory`
3. Ensure `buildCommand` is correct
4. Review function logs in Vercel dashboard
5. Test locally with `vercel dev`
