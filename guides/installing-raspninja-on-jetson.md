# Installing RaspNinja on Jetson

Download image for your device from [https://developer.nvidia.com/embedded/downloads](https://developer.nvidia.com/embedded/downloads)

![](<../.gitbook/assets/image (81).png>)

Write the image to a high-quality micro SD card, as low-quality SD cards will be slow and have a very short lifespan.

![](<../.gitbook/assets/image (82).png>)

Boot the Jetson with the SD card install. You will need a display and keyboard, ideally also a mouse, to complete the initial setup. \
\
Connect the Jetson to the internet; Ethernet is ideal, but WiFi will work if your Jetson has a WiFi adapter.\
\
Open the Terminal app or SSH into the Jetson to continue the installation.

![](<../.gitbook/assets/image (83).png>)

Download Raspberry Ninja and run the installer. This will update your Jetson installation to Ubuntu 20 and install the required components.  It may take some time and may require some prodding if it fails.

```
git clone https://github.com/steveseguin/raspberry_ninja
cd raspberry_ninja
cd nvidia_jetson
chmod +x advanced_installer.sh
./advanced_installer.sh
```

![](<../.gitbook/assets/image (84).png>)
