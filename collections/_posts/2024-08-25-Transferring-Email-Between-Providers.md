---
layout: post
title: Transferring Email Between Service Providers
tags: email
---

I manage a bunch of domains and often times, run them on paid service providers. I used to run my primary domain with Outlook. But with time, their service had locked-in a lot of features for free users. First configuring and creating additional mail boxes, then issues setting up [DMARC, DKIM and SPF records](https://www.cloudflare.com/learning/email-security/dmarc-dkim-spf/) for owenrs of custom/free domains and restricting supported email clients and the like. I wanted to shift to a provider with a decent customer and email client client support. [Migadu](https://migadu.com/) seemed like the perfect fit.

The only downside to the entire exercise is retaining my previous emails. There were a lot of useful email transactions that were saved in my mailbox over the years and I did not want to miss out on them. That is when I discovered [Imapsync](https://imapsync.lamiral.info/) tool - that you can run yourself.

### Dryrun

```bash
$ imapsync --dry \
--host1 outlook.office365.com \
--user1 me@dwarak.in \
--ssl1 --sep1 . \
--prefix1 ""  \
--host2 imap.migadu.com \
--user2 me@dwarak.in \
--ssl2
```

### Actual

```bash
$ imapsync \
--host1 outlook.office365.com \
--user1 me@dwarak.in \
--authmech1 LOGIN \
--ssl1 --sep1 . \
--passfile1 pass-dwarak.txt \
--prefix1 ""  \
--host2 imap.migadu.com \
--user2 me@dwarak.in \
--passfile2 pass-migadu.txt
```

My only gripe with this tool is its availability with popular upstream package repositories like apt. This is still not available to install via apt package manager at the time of writing. [Debian bug #919587](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=919587). Hopefully, that gets resolved. Otherwise, this is a fantastic tool to work with :)