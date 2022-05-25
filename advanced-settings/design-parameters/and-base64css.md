---
description: >-
  Lets you add css to the URL, but as a single string, so no external reference
  to a file is needed
---

# \&base64css

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Aliases

* `&b64css`
* `&cssbase64`
* `&cssb64`

## Options

| Value    | Description          |
| -------- | -------------------- |
| (string) | Custom base64 string |

## Details

This command lets you add css to VDO.Ninja via the URL, but as a single string, so no external reference to a file is needed.&#x20;

Example usage:\
[`https://vdo.ninja/beta/?base64css=JTIzbWFpbm1lbnUlN0JiYWNrZ3JvdW5kLWNvbG9yJTNBJTIwcGluayUzQiUyMCVFMiU5RCVBNA`](https://vdo.ninja/beta/?base64css=JTIzbWFpbm1lbnUlN0JiYWNrZ3JvdW5kLWNvbG9yJTNBJTIwcGluayUzQiUyMCVFMiU5RCVBNA)\
\
You can create the base64 encoding using `btoa(encodeURIComponent(csshere))`, for example `window.btoa(encodeURIComponent("#mainmenu{background-color: pink; ❤" ));`

Will return the base64 encoded string required. Special non-latin characters are supported with this approach; not just latin characters.

The [https://invite.vdo.ninja/](https://invite.vdo.ninja/) tool has an option to do these base64 encoding steps under "General Options".

## Related

{% content-ref url="css.md" %}
[css.md](css.md)
{% endcontent-ref %}
