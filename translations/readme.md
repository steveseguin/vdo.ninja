Welcome to the translation / language section of VDO.Ninja

Each `.json` file here holds one interface language, named by its language code (for example `de.json` or `pt-br.json`). `blank.json` is a minimal template with little or no VDO.Ninja branding.

## Choose a language

- Add `&ln=ru` (or `&language=ru`) to a link.
- On your own deployment, set a default with `session.language` in the settings block of `index.html` (`"auto"` uses the browser's language), or with a `data-translation` attribute on the `main-js` script tag:

  ```
  <script type="text/javascript" id="main-js" src="./main.js" data-translation="blank"></script>
  ```

  The order of priority is the URL parameter, then `session.language`, then a language saved in the browser from an earlier choice, then `data-translation`.

Translation values can contain HTML, such as image links, so a translation file also allows basic customization.

## Update translations

- **`translate.js`:** open VDO.Ninja from your copy of the code, then paste the script's contents into the browser console and press Enter. It downloads each language file, keeping existing entries and adding new keys, in English, at the end of each section. Translate the new entries and submit them as a pull request.
- **GitHub Actions:** the manual "Translate missing keys" workflow fills missing keys with machine translation and opens a draft pull request. Pull requests to `develop` run `.github/ci-validateTranslations.js` and `.github/ci-checkTranslationKeys.js`.

## Podcast Studio

The Podcast Studio (`?podcast`) reads the same language files. Its text is keyed by the English wording: in `innerHTML` the key is `podcast-` followed by the text in lower case with every run of other characters replaced by `-` (`Start Recording` becomes `podcast-start-recording`), and tooltips and placeholders use the usual `titles` and `placeholders` keys. Values in `{braces}` are filled in by the studio, so keep them as they are. A missing key shows the English text. `it.json` holds the full set and works as a reference for other languages.
