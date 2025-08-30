# How to restart your winsock

## Restarting Winsock on Windows

When troubleshooting network issues on Windows, one common step is to **reset Winsock** (Windows Sockets API).\
This can fix problems caused by corrupted network configuration, malware, or software conflicts.

***

### ⚠️ Before You Begin

* You need **Administrator privileges**.
* Resetting Winsock will remove all custom Layered Service Providers (LSPs).\
  If you use VPN software, firewalls, or proxy clients, you may need to reinstall or reconfigure them afterward.
* Always consider restarting your computer after making changes.

***

### Step 1: Open Command Prompt as Administrator

1. Press <kbd>Win</kbd> + <kbd>S</kbd>, type `cmd`.
2. Right-click **Command Prompt** and select **Run as administrator**.

***

### Step 2: Reset Winsock

Run the following command:

```sh
netsh winsock reset
```

You should see output similar to:

```
Successfully reset the Winsock Catalog.
You must restart the computer in order to complete the reset.
```

***

### Step 3: Restart Your Computer

To apply the reset, restart your computer:

```sh
shutdown /r /t 0
```

***

### Step 4: (Optional) Reset TCP/IP Stack

If you continue having issues, also reset the TCP/IP stack:

```sh
netsh int ip reset
```

***

### Step 5: Verify

After reboot:

* Test connectivity with `ping google.com`.
* Use `ipconfig /all` to confirm network adapter settings.
* Confirm that applications relying on network sockets (e.g., browsers, chat tools) are working properly.

***

### Quick Reference

| Action                       | Command               |
| ---------------------------- | --------------------- |
| Reset Winsock                | `netsh winsock reset` |
| Reset TCP/IP stack           | `netsh int ip reset`  |
| Restart immediately          | `shutdown /r /t 0`    |
| Verify adapter configuration | `ipconfig /all`       |
| Test network connection      | `ping google.com`     |

***

### When to Use

* After malware removal
* If network apps fail to connect
* If DNS or socket errors persist
* When VPN/proxy software breaks connectivity

***

✅ That’s it! Winsock should now be reset and your network connection refreshed.
