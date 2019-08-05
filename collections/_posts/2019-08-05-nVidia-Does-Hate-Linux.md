---
layout: post
title: nVidia Does Hate Linux
tags: nvidia, gpu, linux
---

Last weekend was fantastic. One more line struck off my to-do list. I had the chance to build my first desktop. While this isn't a post about how to choose the best PC parts, I'd still like you to know the parts I picked, for my rant to make sense.

Type|Item
:----|:----|
CPU | [AMD Ryzen 7 2700X 3.7 GHz 8-Core Processor](https://in.pcpartpicker.com/product/bddxFT/amd-ryzen-7-2700x-37ghz-8-core-processor-yd270xbgafbox)
Motherboard | [Asus ROG STRIX B450-F GAMING ATX AM4 Motherboard](https://in.pcpartpicker.com/product/XQgzK8/asus-rog-strix-b450-f-gaming-atx-am4-motherboard-strix-b450-f-gaming)
Memory | [Crucial 16 GB (1 x 16 GB) DDR4-2400 Memory](https://in.pcpartpicker.com/product/jGvbt6/crucial-16-gb-1-x-16-gb-ddr4-2400-memory-ct16g4dfd824a)
Storage | [Gigabyte 256 GB M.2-2280 NVME Solid State Drive](https://in.pcpartpicker.com/product/hzdxFT/gigabyte-256gb-m2-2280-solid-state-drive-gp-gsm2ne8256gntd)
Video Card | [MSI GeForce GT 710 2 GB Video Card](https://in.pcpartpicker.com/product/2BjWGX/msi-video-card-gt7102gd3lp)
Power Supply | [Corsair VS 450 W 80+ Certified ATX Power Supply](https://in.pcpartpicker.com/product/6rc48d/corsair-vs-450w-80-certified-atx-power-supply-cp-9020170-na)
Keyboard | [Corsair K55 RGB Wired Gaming Keyboard](https://in.pcpartpicker.com/product/q7648d/corsair-k55-rgb-wired-gaming-keyboard-ch-9206015-na)   

<br/>

Most of the choices were obvious. Though I could've gone with the latest Ryzen 3000 series CPU, I didn't know how well the support was. Also, since I am yet to figure how I'll be using this CPU (definitely not extensive gaming) I didn't want to burn all my cash for a top-of-the-line costly choice, when I had a cheaper alternate(Ryzen 2000s) that more than compensated for what I would want. Price point is also the reason I went with AMD than Intel. Motherboard, ironically is a gaming motherboard which I'm guessing will prove useful if and when I plan to upgrade the parts. [NVMe](https://en.wikipedia.org/wiki/NVM_Express) based M.2 SSD disks are not a luxury anymore. The write speed is consistent between 600-750 MBps which translates to dramatic performance in boot and file access times. Reads touch over 4 Gigs per second, which I'm guessing is a screw up with the script I wrote. Theoretically though they can touch 1GBps.

```bash
$ sync; dd if=/dev/zero of=/tmp/tempfile bs=512M count=10 oflag=dsync status=progress;
5368709120 bytes (5.4 GB, 5.0 GiB) copied, 9 s, 607 MB/s
10+0 records in
10+0 records out
5368709120 bytes (5.4 GB, 5.0 GiB) copied, 8.84148 s, 607 MB/s
$ sync; dd if=/tmp/tempfile of=/dev/null bs=512M count=10 oflag=dsync status=progress;
4294967296 bytes (4.3 GB, 4.0 GiB) copied, 1 s, 4.2 GB/s
10+0 records in
10+0 records out
5368709120 bytes (5.4 GB, 5.0 GiB) copied, 1.2505 s, 4.3 GB/s
```

Power consumption of the CPU came about 220W, for which 450W Corsair SMPS also fit the bill. The one-fucked-up-decision I took was to get a nVidia based Graphics Card!

While I didn't know earlier that [nVidia hated Linux](https://www.reddit.com/r/linuxmasterrace/comments/50n99n/why_nvidia_is_so_unfriendly_with_linux/), I definitely didn't expect the support to be this bad. I didn't want to compromise on my CPU's display refresh rate and I made sure I got a graphics card that gave [4k resolution with 60Hz refresh rate](https://www.geforce.com/hardware/desktop-gpus/geforce-gt-710/specifications).

I flashed my drive with Ubuntu MATE 18.04.2 LTS and all was well until I upgraded my desktop to the latest nVidia 430.26 driver. Even when I was able to set 60Hz refresh rate for 3840x2160 4k resolution, I was seeing my screen getting torn by the subsequent frames that it tried to process. Thanks to nVidia, Freesync(or GSync as they call it) was [not supported with HDMI](https://forums.geforce.com/default/topic/1094573/geforce-drivers/freesync-with-hdmi/) too. After a bunch of experiements, I had to downgrade to a more comfortable QHD 2560x1440 resolution.

MATE Desktop complicates this by failing to detect the window scaling factor. (Setting within the `mate-tweak` tool.).

![mate-tweak]({{site.baseurl}}/assets/images/nvidia-hates-linux/mate-tweak.png)

I finally had to resort to manually setting the value within the Apperance dialog. [Reference - [Ask Ubuntu - Ubuntu Mate desktop scaling for 4k displays](https://askubuntu.com/a/692023)]

![mate-desktop-appearance-dialog]({{site.baseurl}}/assets/images/nvidia-hates-linux/appearance.png)

This was such a let down. For someone who isn't interested in playing graphics-heavy games in a Windows machine, the only reason to spend money would be better window graphics. Why is nVidia doing such a fuck-all job with linux support?

---
[My CPU Build](https://in.pcpartpicker.com/list/pQYtV6)
