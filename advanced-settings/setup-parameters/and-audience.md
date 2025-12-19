---
description: Secure Public Stream Publishing
---

# \&audience

## Audience Tokens (`&audience`) in VDO.Ninja

The `&audience` parameter in **VDO.Ninja** enables secure public stream publishing.

**In practice:**\
Adding `&audience=XXXX` to a **publish (`&push`) link automatically generates a ready-to-share viewer link**.

This is ideal for public sharing and website embedding (for example, using iframes), while preventing unauthorized publishing.

***

### What `&audience` Does

* Enables public viewing of a stream
* Prevents unauthorized publishing
* Automatically generates a viewer link when the stream starts
* Separates publishing permission from viewing permission

No additional setup is required.

***

### About Audience Tokens (Important)

Audience tokens and publishing tokens are:

* **Generated and stored server-side**
* **Opaque identifiers** (they do not encode information)
* **Not predictable**
* **Not reversible**
* **Not derivable from the stream ID**

Knowing a stream ID does **not** allow someone to guess or reconstruct an audience or publishing token.

Tokens are resolved by the server against a database and are treated purely as access keys.

***

### Key Features

* Publishers use a **publishing token** via `&audience` in their publish link
* Viewers use a **different audience (viewer) token**
* Publishing requires both:
  * a stream ID
  * a publishing token
* Compatible with existing VDO.Ninja URLs and workflows

***

### Example Usage

#### Publisher Link

```
https://vdo.ninja/?audience=12345abcPublishingToken&push=JkYwyxy
```

* `push=JkYwyxy`\
  Stream ID
* `audience=12345abcPublishingToken`\
  Publishing token

When the stream starts:

* VDO.Ninja automatically generates a **viewer link**
* The viewer link is shown to the publisher by default

***

#### Viewer Link (Auto-Generated)

```
https://vdo.ninja/?audience=HrDrNy3jiA50QzlU&view=JkYwyxy
```

* Safe to share publicly
* Safe to embed in an iframe
* Does not allow publishing

***

### Hiding the Viewer Token Output

By default, the viewer link is displayed to the publisher.

If `&cleanoutput` is added to the publish URL:

```
https://vdo.ninja/?push=JkYwyxy&audience=12345abcPublishingToken&cleanoutput
```

* The viewer token is **not shown**
* Token generation still occurs normally

***

### Generating Tokens via HTTP (Optional)

Publishing and audience tokens can also be generated or retrieved via HTTP.

All token endpoints are hosted at:

```
https://audience.vdo.ninja
```

#### Publishing Token Endpoint

```
GET https://audience.vdo.ninja/publish/{streamID}/token
```

Example:

```js
const response = await fetch(
  "https://audience.vdo.ninja/publish/JkYwyxy/token"
);

const { token } = await response.json();
```

This token can be used directly in a publish (`&push`) link.

***

### Technical Notes

* Designed for single-stream publishing
* Not compatible with room-based workflows
* Password functionality remains mostly intact
* New publishers establish new P2P connections while existing ones remain active
* Roles are determined automatically:
  * `&push` → publisher
  * `&view` → viewer

***

### Security Notes

* Keep publishing tokens private
* Viewer tokens are safe to share publicly
* Tokens are validated server-side and cannot be inferred client-side
* Peer-to-peer connections may expose public IP addresses
* Exercise caution when connecting to untrusted sources

***

### Summary

* Add `&audience=TOKEN` to your publish link
* Start the stream
* A viewer link is generated automatically
* Tokens are server-generated, opaque, and non-derivable
* Share or embed the viewer link as needed

Nothing else is required.
