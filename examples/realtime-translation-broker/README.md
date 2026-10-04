# Optional Realtime translation broker

This sample is for people who want to self-host the small server component recommended by OpenAI's browser Realtime flow. VDO.Ninja does not host or depend on it. Direct browser BYOK remains available.

The Worker keeps `OPENAI_API_KEY` in a Cloudflare secret and returns only a 60-second OpenAI translation client secret. It requires a separate `BROKER_ACCESS_TOKEN`, exact origin matching, a supported language, and a small request body. The OpenAI key and broker token are never logged.

## Set up

1. Edit `ALLOWED_ORIGINS` in `wrangler.jsonc`. Use exact origins, without paths or trailing slashes.
2. For `wrangler dev`, create an untracked `.dev.vars` file containing:

   ```dotenv
   OPENAI_API_KEY="your dedicated OpenAI project key"
   BROKER_ACCESS_TOKEN="a separate long random value"
   ```

3. From this directory, add both deployment secrets:

   ```console
   npx wrangler secret put OPENAI_API_KEY
   npx wrangler secret put BROKER_ACCESS_TOKEN
   ```

   Make the broker token a long random value that is different from the OpenAI key.

4. Test locally, then deploy to your own Cloudflare account if wanted:

   ```console
   npx wrangler dev
   npx wrangler deploy
   ```

5. In `translate.html`, expand **Optional self-hosted token broker**, enter the deployed `/session` URL and broker access token, then use **Save and open**.

The broker URL may appear in the generated account-holder link. The broker access token and OpenAI key do not.

## Security and cost controls

- Do not deploy this as an unauthenticated public proxy. Anyone with the broker token can spend against the OpenAI project until that token is rotated.
- Use a dedicated OpenAI project/key with a low project budget. A Worker does not replace OpenAI-side spend limits.
- Keep **Remember credentials across reloads** off unless the browser profile is trusted. With the default setting, the broker token is consumed once and then kept only in page memory.
- Add a Cloudflare rate-limiting rule for `POST /session` before sharing the broker with multiple people. Origin checking is browser isolation, not authentication; the bearer token is the actual gate.
- Rotate both secrets after suspected disclosure. Never put either value in `wrangler.jsonc`, source control, or generated links; keep local `.dev.vars` untracked.
