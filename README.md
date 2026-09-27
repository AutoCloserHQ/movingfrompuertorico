# MovingFromPuertoRico.com

Static, mobile-first Puerto Rico to mainland moving site operated by ModelMoving.

## Structure

- 24 indexable pages, including eight destination guides, four Puerto Rico origin guides, planning resources and a Spanish entry page.
- `assets/site.js` handles route selection, checklist and timeline, attribution and the three-step quote request.
- `assets/analytics.js` sends page-path-only GA4 views and controlled form events. Configure GA4 enhanced measurement so it does not automatically collect form-field values.
- `tools/build.mjs` generates the HTML pages, sitemap, robots file, CNAME and 404 page. Run `node tools/build.mjs` after editing page source.
- `tools/verify.mjs` checks sitemap entries, canonicals and local links. Run `node tools/verify.mjs`. With a local server on port 8077 and Playwright Chromium installed, `node tools/verify.mjs --browser` also checks narrow widths and mocked submissions. Never use actual customer contact information for tests.

## Publishing

Deploy from `main` and `/(root)` in GitHub Pages. Custom domain is `movingfrompuertorico.com` through `CNAME`. GoDaddy apex A records point to the GitHub Pages addresses and `www` is a CNAME to `autocloserhq.github.io`.

Before promoting the site, check the live site on a phone and make one deliberately marked real form submission to confirm receipt in the ModelMoving workflow. The automated checks do not deliver real leads. Confirm HTTPS and the sitemap after Pages deployment.
