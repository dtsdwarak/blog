---
layout: post
title: Stuff to do with your own server - Part II
tags: setup, own, server
---

As a continuation of the earlier post on [Stuff To Do With Your Own Server](/2017/02/26/Stuff-To-Do-With-Your-Own-Server/), I setup a DO droplet to host a couple of services online to avoid any disruptions that can happen in my local server.

1. [Algo VPN](https://blog.trailofbits.com/2016/12/12/meet-algo-the-vpn-that-works/)
2. [NextCloud](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-nextcloud-on-ubuntu-16-04)
3. Monitoring stack - Net data - Not yet configured

### To do
The thing to note is that, if you run a nextcloud instance as a snap as mentioned in the blog post given above, you may not be able to host multiple services running in port 80 in the same box. If you want that to happen, you should run the nextcloud snap at a different port and use nginx as a reverse proxy (in its true sense).
