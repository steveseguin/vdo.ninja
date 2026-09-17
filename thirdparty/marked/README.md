# Documentation Markdown libraries

Local browser dependencies for `docs.html`, preserving the versions previously loaded from the CDN:

| File | Upstream package | License |
| --- | --- | --- |
| `marked-12.0.1.umd.js` | [marked 12.0.1](https://www.npmjs.com/package/marked/v/12.0.1) | MIT; additional Markdown notice in `marked.LICENSE.md` |
| `marked-gfm-heading-id-3.1.3.umd.js` | [marked-gfm-heading-id 3.1.3](https://www.npmjs.com/package/marked-gfm-heading-id/v/3.1.3) | MIT; bundled github-slugger is ISC |
| `marked-base-url-1.1.3.umd.js` | [marked-base-url 1.1.3](https://www.npmjs.com/package/marked-base-url/v/1.1.3) | MIT |

The two extensions are unchanged copies of `package/lib/index.umd.js` from their npm release archives. The heading extension includes github-slugger; its notice is retained in `github-slugger.LICENSE`. All upstream copyright and license notices remain applicable.

Marked is derived from `package/lib/marked.umd.js` in its npm release archive. Its optional chaining, nullish coalescing and class fields are lowered ahead of time so the delivered file uses ES2019 syntax. No parser options or runtime dependencies were added. The upstream source-map reference is omitted because that map would not describe the converted file.

To reproduce the Marked conversion outside the release checkout, use esbuild 0.25.12's `transformSync` on the upstream UMD source with:

```js
{
    target: ["es2019", "chrome75"],
    legalComments: "inline",
    banner: notice + "\n// Syntax lowered from marked 12.0.1 with esbuild 0.25.12; see README.md.",
    minify: false
}
```

Here `notice` is the upstream source's first comment, through its closing `*/`. Write the returned `code` as `marked-12.0.1.umd.js`. Serving this directory needs no build tools or package installation.
