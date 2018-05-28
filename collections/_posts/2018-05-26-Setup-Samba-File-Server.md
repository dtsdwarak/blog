---
layout: post
title: Setup Samba in Your Network Server
tags: server, samba, file share
---

Network file sharing has been such a pain, or it did seem so for a long time, until recently where I was pressed to have a server running in my local server.

My dell machine runs a Ubuntu server 16.04 over the local LAN and hosts a good number of movies and hosts them over a Plex server for viewing. I haven't exposed the Plex media server over the internet for security and privacy reasons. And whenever I go out of town, I prefer to take a local copy of them in my phone to kill time.

Every time I wanted to take a copy in my phone, I had to manually plug the HDD off my machine and copy it over my phonne via work laptop. Why pull my hair off when I could simply setup a local network share?

And so I did...

Install samba in your machine

``` bash
$ sudo apt-get update
$ sudo apt-get install samba
```

When you do,

```bash
$ whereis samba
```
you must see something similar to this-
```
samba: /usr/sbin/samba /usr/lib/samba /etc/samba /usr/share/samba /usr/share/man/man7/samba.7.gz /usr/share/man/man8/samba.8.gz
```

Now over to creating an actual samba share.

I have my movies in HDD mounted at ```/media/seagate``` and so, I need to share them now. If you just need a frontend to copy the files over to the remote machine, create a folder at an appropriate place and then use that instead.

```bash
$ sudo vi /etc/samba/smb.conf
```

Append the following to the above config file.

```
# Hard disk share
[seagate]
    comment = seagate-hdd
    path = /media/seagate
    read only = no
    browsable = yes
```

Restart your samba service.

```bash
$ sudo service smbd restart
```

To configure password auth for your server,

```bash
$ sudo smbpasswd -a username
```

The same can be achieved if you run other distros as well. Make sure to figure out the appropriate package names.

---

I wrote this post to help as a reference for my own future setup. Content used from [Ubuntu Tutorials Page](https://tutorials.ubuntu.com/tutorial/install-and-configure-samba#0). If you'd like to explore the Samba configuration further, use this [help page](https://help.ubuntu.com/community/Samba/SambaServerGuide).
