---
description: Set up two-way, speech-to-speech translation in a VDO.Ninja room with one account holder and simple reusable links for everyone else.
---

# Live audio translation

VDO.Ninja can translate live speech into another spoken language. One person supplies the translation account and API key. Everyone else joins with a normal VDO.Ninja link and can choose the language they want to hear.

This is an early alpha feature. It currently uses OpenAI's `gpt-realtime-translate` service, although the VDO.Ninja translation layer is designed so another provider can be added later.

Last reviewed against source: September 9, 2026. The setup-page validation fixes described below are pending deployment; an older hosted copy may not yet show the new messages.

{% hint style="warning" %}
Tell everyone in the call before enabling translation. Audio selected for translation is sent to OpenAI by the account holder's browser. Review OpenAI's privacy, retention, and billing terms before using it with private, medical, legal, financial, or confidential conversations.
{% endhint %}

## What this version does

The simplest way to think about it is that the person with the OpenAI account becomes the translation hub:

1. Each participant tells the account holder which language they want to hear.
2. The account holder's outgoing voice is translated for those participants.
3. Each participant's incoming voice is translated for the account holder.
4. Participants with the same requested language share one translated version of the account holder's voice.

It is two-way between the account holder and each participant. It does not yet translate one guest directly for another guest. In a group room, guests still receive the other guests' normal VDO.Ninja audio.

If two people select the same language, their audio is left alone. OpenAI automatically detects the language being spoken for the translation sessions that are needed.

## What you need

The account holder needs:

* A normal VDO.Ninja room, director, guest, or push link.
* An [OpenAI API account](https://platform.openai.com/) with billing enabled and access to `gpt-realtime-translate`. A ChatGPT subscription by itself is not the same as API billing.
* An OpenAI API key from the [API keys page](https://platform.openai.com/api-keys).
* A current browser with WebRTC and Web Audio support. Chrome or Edge is the safest starting point for this alpha.

Other participants do not need an OpenAI account, API key, extension, application, virtual audio cable, or translation worker.

## Set it up

### 1. Open the setup page

Go to [vdo.ninja/translate.html](https://vdo.ninja/translate.html).

If you are already using the account-holder link, open **Settings**, choose **User**, and click **Configure** beside the translation language. The setup page will remember the VDO.Ninja link you came from without placing that link in a server request. Participants only see the language and Stop controls; they are not asked to configure an account.

### 2. Enter the account details

Choose **OpenAI**, paste the API key, and select the language the account holder wants to hear.

Leave **Remember credentials across reloads (not recommended)** unchecked for the default behavior. **Save settings** stages the credentials in this tab's session storage. **Save and open** opens the account-holder link in the same tab; the translation page consumes the staged credentials once and keeps them in page memory. Reloading that page requires entering them again.

Checking **Remember credentials across reloads** explicitly opts into browser local storage. Use it only in a browser profile you trust. **Forget credentials** removes the saved API key and broker access token. It does not stop translation already running in another tab; use **Stop** there as well.

Choose how the original voice should sound:

* **Replace with translation** plays only the translated voice.
* **Keep quietly underneath** plays the original voice quietly beneath the translation.
* **Play both** plays the original and translated voices together.

Click **Save settings**.

<figure><img src="../.gitbook/assets/live-translation-setup.png" alt="Earlier VDO.Ninja live translation setup showing the masked API key and language and audio controls"><figcaption><p>Earlier alpha interface; credential labels and defaults have changed. Keep Remember credentials unchecked for the current one-time handoff.</p></figcaption></figure>

### Optional: use a self-hosted token broker

Instead of entering an OpenAI API key in the browser, expand **Optional self-hosted token broker** and enter:

* **Broker session URL**: the broker's HTTPS session endpoint. HTTP is allowed only for local testing on localhost, 127.0.0.1, or ::1. Do not embed credentials or a fragment in this URL.
* **Broker access token**: a separate secret that protects access to that broker. This is not your OpenAI API key.

When a broker URL is configured, it takes precedence over direct API-key mode and requires its access token. Clear the broker URL to return to direct API-key mode. The broker keeps the OpenAI key server-side and supplies short-lived client secrets to the browser. The broker access token follows the same one-time handoff or explicit persistence choice described above.

An optional [self-hosted broker example](https://github.com/obsninja/obsninja/tree/master/examples/realtime-translation-broker) includes setup instructions and authentication requirements. VDO.Ninja does not operate a shared broker. Only use a broker you trust: its access token authorizes requests against the associated account. Keep secrets out of the broker URL, which can appear in generated account-holder links.

### 3. Make the account-holder link

Paste the account holder's normal VDO.Ninja link into **Normal account-holder link**. This can be a director link, a reusable room link, or another link that person normally uses.

Click **Save and open** to start with the credentials entered here. With persistence disabled, use this same tab so the one-time handoff is available.

You can also copy the generated **Translation-enabled account-holder link**, but it carries settings only, never the API key or broker access token. Another browser or site needs its own setup. Credentials are scoped to the exact origin (scheme, hostname, and port), so a key saved on vdo.ninja is not available on another deployment or on localhost.

The updated setup page rejects non-HTTP(S) links and URLs containing a username or password. **Save and open** also checks for the required credential and prevents navigation to another origin. Run setup on the destination site instead. Generated links remove pasted `translationkey` and `translationbrokertoken` query or fragment parameters; never put secrets in links yourself.

### 4. Make the participant link

Choose the participant's starting language, then paste the normal guest or participant invite into **Normal participant link**. Leave it on **Auto** when you want each participant's browser or operating-system language to be used.

Copy the generated **Translation-ready participant link** and send it to the participants. It contains a preferred-language setting but no API key and no OpenAI account information.

The same reusable participant link can be sent again later.

### 5. Join and test

Use **Save and open** in the setup tab for the account holder. Ask the participant to open their participant link.

Use headphones for the first test. Have each person say a short sentence, then pause. Translation is streamed while they speak, but it is not instantaneous.

For a real event, test names, numbers, dates, technical terms, accents, overlapping speech, and every language pair you plan to use.

## Choosing a language inside VDO.Ninja

The default is **Auto**, which uses the browser or operating system language. A participant can change it without visiting the setup page:

1. Open **Settings**.
2. Choose **User**.
3. Change **Preferred spoken language**.

<figure><img src="../.gitbook/assets/live-translation-language-setting.png" alt="VDO.Ninja User settings showing the preferred spoken language selector, Configure button, Stop button, and current language status"><figcaption><p>The small User setting is the only in-room translation interface.</p></figcaption></figure>

The supported output choices in this alpha are English, Spanish, Portuguese, French, Japanese, Russian, Chinese, German, Korean, Hindi, Indonesian, Vietnamese, and Italian.

## URL options

Language, provider, and audio behavior can be configured by URL. Credentials must be supplied separately through setup; the page also manages their storage and handoff.

| Option | Purpose | Example |
| --- | --- | --- |
| `&translate=1` | Makes this browser the translation account holder | `&translate=1` |
| `&translatelang=` | Language this person wants to hear | `&translatelang=es` |
| `&translationprovider=` | Translation provider | `&translationprovider=openai` |
| `&translateaudio=` | Original-audio mode: `replace`, `duck`, or `mix` | `&translateaudio=duck` |
| `&translationbroker=` | Optional public broker session URL; its access token is supplied separately | `&translationbroker=https%3A%2F%2Fbroker.example%2Fsession` |

Account-holder example:

`https://vdo.ninja/?director=ROOMNAME&translate=1&translatelang=en&translationprovider=openai&translateaudio=replace`

Participant example:

`https://vdo.ninja/?room=ROOMNAME&translatelang=es`

Do not add an API key to a URL. VDO.Ninja does not support an API-key URL option.

## Privacy and API-key security

Normal VDO.Ninja media continues to use VDO.Ninja's usual media paths. The account holder's browser creates additional direct WebRTC connections to OpenAI for only the audio tracks that need translation.

For incoming participant speech, the participant first sends audio to the account holder through VDO.Ninja. The account holder's browser then sends a copy of that audio to OpenAI. This is why participant notice and consent matter.

The API key:

* Is entered only in the account holder's browser.
* In direct API-key mode, is sent directly to OpenAI to create short-lived translation credentials. In broker mode, stays on the broker server instead.
* Is not sent to VDO.Ninja's server or to other room participants.
* Is not placed in generated links.
* By default, is staged in tab session storage until the translation page consumes it once, then kept only in that page's memory. It does not survive a reload after consumption.
* Is stored in browser local storage only when **Remember credentials across reloads** is checked. The broker access token uses the same storage choice.

{% hint style="danger" %}
Direct bring-your-own-key mode exposes the supplied key to the account-holder page while translation runs. The optional broker keeps the standard key server-side, but its browser access token is still sensitive. Use a dedicated API project/key with appropriate spending controls, do not use an administrator key, and click **Forget credentials** when using a computer you do not control.
{% endhint %}

## Cost and session count

OpenAI charges the account that owns the key. Check the current [model and pricing information](https://developers.openai.com/api/docs/models/gpt-realtime-translate) before a long event.

VDO.Ninja avoids translating the same account-holder stream repeatedly when several participants request the same language. It reuses one output translation per requested language.

Incoming participant tracks stay separate. If five participants need translation into the account holder's language, that can require five incoming translation sessions. More participants and more distinct languages therefore cost more.

## Audio controls and recording

Translated audio stays inside the existing VDO.Ninja media elements and audio path:

* Per-participant volume and speaker mute continue to apply.
* Muting the account holder's microphone also mutes the translated outgoing tracks.
* Incoming source-track loudness meters and active-speaker detection remain active while translated audio plays.
* A local recording of a remote participant records the audio currently being played for that participant. Wait for translation to become active before starting the recording if the recording should contain translated audio.
* VDO.Ninja delays a translation track swap until an already-running local recording stops. It also refuses a language change while a remote local recording is active, preventing the browser's `MediaRecorder` from being broken by a track-set change.

## Latency and lip sync

Speech translation necessarily arrives after the original speaker starts talking. In **Replace** mode, the translated voice can therefore trail the video. **Duck** and **Mix** modes can sound like an echo because the original voice arrives first.

This alpha does not automatically delay video to match translated audio. Automatic audio/video synchronization may be explored later, but it would add latency and needs real-world testing before becoming a default.

## Stopping or recovering

Click **Stop** in **Settings** → **User** to close translation sessions and restore original audio. **Configure** reopens the setup page. **Forget credentials** on that page removes stored API keys and broker tokens; it does not revoke the credentials at their provider or clear another running page's memory.

If a live translation session ends or disconnects, VDO.Ninja temporarily restores original audio and retries the affected translation up to five times with increasing delays and jitter. A connection that remains stable for 60 seconds resets that retry budget. After retries are exhausted, reconnect or open **Configure** to try again. Credential, account, or language errors may require correction instead of retries. With the default one-time handoff, re-enter credentials through setup after reloading.

## Troubleshooting

### It says an API key is needed

Open **Configure**, enter the key, and use **Save and open** in that same tab. The default handoff is consumed once, so reloading the translation page requires setup again. A copied link does not transfer credentials to another browser or origin.

### It says credentials cannot be passed to another site

Open `translate.html` on the site hosting the account-holder link and configure it there. Check the scheme, hostname, and port: localhost and 127.0.0.1 are different origins, as are HTTP and HTTPS.

### The broker does not connect

Check the session URL, its separate access token, and the broker's allowed origins. Use HTTPS except for loopback testing, and enter the token in its password field rather than the URL. To use an API key directly instead, clear the broker URL and save the settings.

### Copy link does not work

Select the generated link and copy it manually if clipboard access is unavailable. An empty output means the base link or, for the account holder, broker URL needs correction. The updated setup page reports unsuccessful clipboard fallback instead of claiming the link was copied.

### The guest hears the original voice

Check that:

* The account holder used the link containing `&translate=1`.
* The participant used a link containing `&translatelang=`.
* The two people did not select the same language.
* The API account has billing and access to `gpt-realtime-translate`.

### Guests cannot understand one another

That is a current design limit. This first version translates between the account holder and each participant, not every guest-to-guest path in a mesh room.

### The translated voice is behind the video

Some delay is expected. Try short phrases and avoid people talking over one another. There is not yet automatic video delay for lip synchronization.

## Technical reference

OpenAI describes the model, WebRTC browser flow, one-session-per-output-language pattern, and separate-track approach for conversational calls in its [Realtime translation guide](https://developers.openai.com/api/docs/guides/realtime-translation).
