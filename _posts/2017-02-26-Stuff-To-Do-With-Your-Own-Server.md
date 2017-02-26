---
layout: post
title: Stuff to do with your own server
tags: setup, own, server
---

These days, we find a lot of computing devices unused - at home and at office. There are so many of them around, you can practically run all of your day-to-day web based services by yourself. All you need is a bunch of old CPUs (even one would do to get started) and a decent internet connection. It is fun and a super exhilarating experience to run and manage your own server! This becomes all the more relevant when you care about your data privacy.

Here is a sample of what you can do with it and along the way I would also show you what I did with my old HCL laptop that was lying dormant for more than a couple of years. The same can be replicated with a Raspberry Pi too.

## Run Linux

Operating System is a purely individual choice. Personally, I'd prefer a headless debian based distro - for its ease of use and package availability. Before you start setting up, I'd strongly encourage you run a BIOS memory check and a disk check. We don't know how these devices would perform under load and ensuring hardware health is a good option. Replace components if necessary - better than getting a new device altogether.

## Essentials

A list of essentials (or rather what I did) that your server has to run.

My laptop's RAM got damaged last summer and I couldn't get a compatible replacement anywhere. So, of the 4 GB RAM the OEM had sold it with, only 2 GB is functional now. There isn't much scope to run memory-heavy applications, but the following definitely holds good. The peak average memory load comes close to 70%.

* [Samba Shares](https://help.ubuntu.com/lts/serverguide/samba-fileserver.html) - to share files within devices on your network.
* [Nextcloud/Owncloud](https://www.linuxbabe.com/cloud-storage/setup-nextcloud-server-ubuntu-16-04-apache-mariadb-php7) - your personal Dropbox.
  * [Secure your server with LetsEncrypt](https://www.digitalocean.com/community/tutorials/how-to-secure-apache-with-let-s-encrypt-on-ubuntu-14-04). Make sure you setup a cron to auto renew every 3 months. (***Details included in the blog post link.***)
* [Plex Media server](https://www.plex.tv/) - your home Media Center.

## Monitoring

One thing that is an absolute necessity is a monitoring stack. When you run things yourself, remember - anything can go wrong anywhere. Tracing your errors and monitoring your device's health is paramount. [net-data](https://github.com/firehol/netdata) is an excellent choice. But, if you'd like to have an option, you can consider [linux-dash](https://github.com/afaqurk/linux-dash) too.

* [Installing net-data](https://github.com/firehol/netdata/wiki/Installation)
  * Configuring [net-data via apache server](https://github.com/firehol/netdata/wiki/Running-behind-apache)
  * [Setting up auth with apache server](https://www.digitalocean.com/community/tutorials/how-to-set-up-password-authentication-with-apache-on-ubuntu-14-04)

Here's the monitoring dashboard for my laptop.
<img src="/assets/images/own-server/hcl-monitor.png" style="height:450px;">

## Optional Stuff

Few things I'd like to have. But not that important.

* Syncthing
* PXE Server
* Cryptocurrency mining
* Audio FM streaming with Arduino interface
* Private blog - wordpress, ghost et.al.
* Mumble Server
* Openshift Origin/Dokku server - If you're setting up a Dev Desktop
* XMPP Server
* OpenVPN Server
* [Turtl Notes](https://turtlapp.com/docs/server/)
* Kubernetes cluster

## Domain DNS hosting

You may not want to expose your media server and your private blogs to public internet. But, for pretty much anything else you will have to do it - for daily usage. Almost every router today comes with the ability to port forward.

If you have a static IP address, you are all set. With port forwarding setup, you can go ahead and access your services.

If you want to mask it behind a domain name, you can get a domain for cheap rates at [CrazyDomains.in](https://www.crazydomains.in/). But again, that's a personal choice.

## Dynamic DNS with Cloudflare

If you don't have a static IP though, you need to get a domain.

To host DNS, I'd strongly suggest [Cloudflare](https://www.cloudflare.com/). It is very developer friendly and provides free SSL certificates. You can use [Cloudflare's API to update your DNS](https://api.cloudflare.com/#dns-records-for-a-zone-update-dns-record) periodically too.

Here's the script to do that. You may edit this to your need.
<script src="https://gist.github.com/dtsdwarak/19abfd5d1ae18c4cd929d082b9d207fc.js"></script>

Create a cron job to update it periodically. I've set up to do that every 15 minutes. It updates my [NextCloud server](https://drive.dwarak.in/index.php/login) and [Laptop's monitoring stack](https://hcl.dwarak.in/) DNS.

## More inspiration

If you have the power and urge to do more with your server(s), here are some inspirations.

* [manor.space](http://manor.space/)
* [A list of self-hosted things](https://github.com/Kickball/awesome-selfhosted)

Let me know what you've done with yours!