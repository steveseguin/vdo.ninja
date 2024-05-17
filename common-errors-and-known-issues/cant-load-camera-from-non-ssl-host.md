---
description: Can't load camera from local webserver issues and how to resolve them.
---

# Can't load camera from non-SSL host

The Chrome / Edge / Chromium browsers will not allow access to media devices (camera / microphone) without SSL enabled.

Possible solutions include switching to https, accessing the site from http://localhost, or enabling the `unsafely-treat-insecure-origin-as-secure` browser switch.\
\
The browser flag, which works with Chromium-based browsers, can be accessed from: _**chrome://flags/#unsafely-treat-insecure-origin-as-secure.**_ Specify the hostname and the IP address that you will be accessing, such as https://192.168.1.15:8080. Enable the option, and then restart the browser.

<figure><img src="../.gitbook/assets/image (238).png" alt=""><figcaption><p><em><strong>#unsafely-treat-insecure-origin-as-secure</strong></em></p></figcaption></figure>

More advanced users can try using **openssl** to generate self-signed certificates, and using them with their local webserver to enable SSL, assuming you have access to the webserver.&#x20;

```
openssl req  -nodes -new -x509  -keyout key.pem -out cert.pem
```

<figure><img src="../.gitbook/assets/image (240).png" alt=""><figcaption></figcaption></figure>

If you can access the site via http://localhost, or http://127.0.0.1, that may work also. This could be possible if hosting VDO.Ninja locally, and accessing it via a local webserver.  If you have Python installed, you could get away using it to host VDO.Ninja in this way.

```
git clone https://github.com/steveseguin/vdoninja
cd vdoninja
python -m http.server 8000
```

When accessing VDO.Ninja in this way, make sure the remote computer that may also be accessing VDO.Ninja is using the same "salt". To debug this, you can try adding \&salt=vdo.ninja to all the VDO.Ninja links, as that will mnually assign all the links to use the same salt. The salt is used in the encryption process for site isolation and increased privacy/security when not using the official VDO.Ninja deployment.\
