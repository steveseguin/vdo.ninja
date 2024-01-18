---
description: Permission denied when trying to access the camera or microphone
---

# Enable Camera / Microphone permissions

Once camera / microphone permission have been denied, often accidentally, the browser won't let VDO.Ninja ask for it again. You'll need to manually change the permission to fix it, or use a different browser. How to change the permission depends on the browser and operation system.

I've provided links to some guides. If these guides are helpful for you, I'll offer a guide in [VDO.Ninja](https://vdo.ninja/) to help future users when I detect permissions have been denied.

### _**How to change a site's camera & microphone permissions**_

[https://support.google.com/chrome/answer/2693767?hl=en\&co=GENIE.Platform%3DAndroid\&oco=0](https://support.google.com/chrome/answer/2693767?hl=en\&co=GENIE.Platform%3DAndroid\&oco=0)

### **Android - Chrome Browser**

1. On your Android device, open the Chrome app
2. To the right of the address bar, tap More -> Settings
3. Tap Site Settings
4. Tap Microphone or Camera
5. Tap to turn the microphone or camera on or off; If you see the site you want to use under Blocked, tap the site -> Access your microphone -> Allow

**If you’ve turned off microphone access on your device**, you can [control your app permissions on Android](https://support.google.com/googleplay/answer/6270602?hl=en) to use your mic.

**If you're using a Chrome device at work or school**, your network administrator can set camera and microphone settings for you. In that case, you can't change them here. [Learn about using a managed Chrome device](https://support.google.com/chromebook/answer/1331549).

### **Chrome Desktop**

1. Open Chrome
2. At the top right, click More -> Settings
3. Click Privacy and security -> Site settings -> Camera or Microphone
4. Select the option you want as your default setting\
   &#x20;    \- Review your blocked and allowed sites\
   &#x20;    \- To remove an existing exception or permission: To the right of the site, click Delete\
   &#x20;    \- To allow a site that you already blocked: Under "Not allowed," select the site's name and change the camera or microphone permission to "Allow."

If you still have issues, try a different browser; perhaps Firefox.

![](<../.gitbook/assets/image (2) (1) (3).png>)

### **Firefox Desktop**

[https://support.mozilla.org/en-US/kb/how-manage-your-camera-and-microphone-permissions](https://support.mozilla.org/en-US/kb/how-manage-your-camera-and-microphone-permissions)

### **Firefox Mobile**

In Firefox Mobile, you can try going to **Settings** -> **Site permissions** -> **exceptions** (at bottom) -> **VDO.Ninja**, and then manually set the permissions for the camera and microphone to **enabled**.

If Firefox Mobile still gives you issues afterwards, try in incognito mode, try a different browser, or fully restart the device.

### Vivaldi / Brave / Opera

You can try following the same steps needed for Chrome above, however if that fails, ensure VDO.Ninja is not being loaded via an IFrame.

In the case of [invite.cam](https://invite.cam/) for example, which loads VDO.Ninja via an IFrame, you may need to give microphone and camera permissions to both the invite.cam and VDO.Ninja domains.

You can visit [invite.cam](https://invite.cam/) and [vdo.ninja](https://vdo.ninja/), and for each domain, ensure the microphone and camera permissions are set to allow.

### **iOS**

On an iPhone, it's a bit more complicated:\
[https://gagonfamilymedicine.com/how-to-give-an-app-permission-to-access-your-microphone-on-an-iphone-or-ipad/](https://gagonfamilymedicine.com/how-to-give-an-app-permission-to-access-your-microphone-on-an-iphone-or-ipad/)

If the issue persists, fully close Safari and try again. Sometimes updating your version of iOS and restarting can help solve issues with camera permissions as well.

### IFrame permissions not provided

If embedding VDO.Ninja into a site as an IFrame, you'll not be allowed access to camera or microphones unless that IFRAME-element has allowed said permissions.\
\
See the documentation for more details

{% content-ref url="../guides/iframe-api-documentation.md" %}
[iframe-api-documentation.md](../guides/iframe-api-documentation.md)
{% endcontent-ref %}

### Try safe mode

Adding [`&safemode`](../newly-added-parameters/and-safemode.md) or [`&videodevice=0`](../source-settings/videodevice.md)[`&audiodevice=0`](../source-settings/audiodevice.md) to the [https://vdo.ninja/](https://vdo.ninja/) link can either try the camera in safe mode or disable the camera/microphone completely.

In either mode, you might be able to bypass the initial camera selection page, or start the system with the default camera settings.

If you are able to start the session in this mode, you can go to the VDO.Ninja gear icon (settings), click on User settings, and then clear the local storage. You can then retry, refreshing the page, and try to connect again.
