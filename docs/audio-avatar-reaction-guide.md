# Audio Avatar Reaction Guide for VDO.Ninja

How to make your avatar image pulse or react to audio when the camera is disabled.

---

## Quick Answer

Use **`&meterstyle=5`** combined with **`&bgimage`** on your **viewer/OBS browser source URL**.

```
https://vdo.ninja/?view=STREAMID&meterstyle=5&bgimage=./media/avatar1.png
```

This makes the background image pulse larger when the guest speaks.

---

## How It Works

When using `&meterstyle=5`, the system automatically animates your avatar:

| Audio Level | Effect |
|-------------|--------|
| Silent | Image at base size |
| Talking | Image grows larger |
| Loud/Screaming | Image grows even larger |

The transitions are smooth (0.5 second ease) creating a nice pulsing effect.

---

## Where to Add the Parameters

**Add these parameters to the VIEWER side** (the OBS browser source / where you're watching the feed).

The guest pushing audio doesn't need any special parameters - they just need to have their camera off and be pushing audio.

### Example URLs

**OBS Browser Source (viewing a specific stream):**
```
https://vdo.ninja/?view=guestStreamID&meterstyle=5&bgimage=https://example.com/myavatar.png
```

**Viewing from a room:**
```
https://vdo.ninja/?view=guestStreamID&room=myroom&meterstyle=5&bgimage=./media/avatar1.png
```

---

## Alternative: Multiple Avatar States

For even more control, use different images for different audio levels:

```
https://vdo.ninja/?view=STREAMID&bgimage=./media/avatar1.png&bgimage2=./media/avatar2.png&bgimage3=./media/avatar3.png
```

| Parameter | When Shown |
|-----------|------------|
| `&bgimage` | Silent (not speaking) |
| `&bgimage2` | Talking (moderate audio) |
| `&bgimage3` | Loud/Screaming (high audio) |

When you use `&bgimage2` or `&bgimage3`, the system automatically enables the switching behavior - no need to add `&meterstyle` separately.

VDO.Ninja includes sample avatar images in the `/media/` folder (`avatar1.png`, `avatar2.png`, `avatar3.png`) that you can use for testing.

---

## Meterstyle Reference

| Value | Description |
|-------|-------------|
| `1` | Vertical VU-style bar meter (director default) |
| `2` | Green border around video when talking |
| `3` | Small green dot in top-right corner (guest default) |
| `4` | No visible meter, but sets `data-loudness` attribute for custom CSS |
| **`5`** | **Background image pulses/grows when speaking** |

---

## Why Other Combinations Don't Work

- **`&style=2`** shows an animated audio waveform, not image pulsing
- **`&style=3`** enables audio meters, but you need `&meterstyle=5` specifically for image pulsing
- **`&meterstyle=1,2,3`** show bars, borders, or dots - not image pulsing

---

## URL Encoding Note

If your image URL contains special characters, you may need to URL-encode it.

**Original URL:**
```
https://example.com/my avatar.png
```

**Encoded URL:**
```
https%3A%2F%2Fexample.com%2Fmy%20avatar.png
```

You can encode URLs at: https://www.urlencoder.org/

---

## Official Documentation

- [&meterstyle documentation](https://docs.vdo.ninja/advanced-settings/design-parameters/meterstyle)
- [&bgimage documentation](https://docs.vdo.ninja/advanced-settings/design-parameters/and-bgimage)
- [&style documentation](https://docs.vdo.ninja/advanced-settings/design-parameters/style)

---

## Summary

1. Add `&meterstyle=5&bgimage=YOUR_IMAGE_URL` to your **OBS browser source / viewer URL**
2. The guest only needs to push audio (camera can be off)
3. For multiple avatar states, use `&bgimage`, `&bgimage2`, and `&bgimage3` together
