---
description: Visualizes the packet loss of a guest
---

# \&signalmeter

## Options

| Value            | Description                                      |
| ---------------- | ------------------------------------------------ |
| (no value given) | Adds a signal-meter per guest                    |
| false            | Disables the signal-meter in the director's room |

## Details

It's added to the director's room, per guest, by default. It visualizes the packet loss of a guest:

* green == good; red == bad; and there is a gradient of colors inbetween

Other modes support the signal-meter, but you need to add `&signalmeter` to the URL to show it. You can also do `&signalmeter=false` to disable it in the director's room.

The signal meter turns into a flame when the remote computer is being throttled by the CPU, instead of the network. This represents the remote computer is overheating or overloaded. Only supported by guests using Chrome really.\
\
![](<../../.gitbook/assets/image (126) (1).png>)![](<../../.gitbook/assets/image (111).png>)
