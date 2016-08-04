---
layout: post
title: Get Push Notified For Your SSH Logins
tags: ssh, pushbullet, alert
---

Those of you who have/provide ```ssh``` access to your instances - bare metal or hosted know how important it is to get notified of any suspicious logins into your machines. Checking ```ssh``` logs or email alerts is neither time-sensitive nor efficient.

Here we'll look into implementing a simple and zero-effort notification service for SSH logins via [PushBullet](https://www.pushbullet.com/).
<!--break-->

## Basics

For the ones who aren't quite familiar with PushBullet, it is meant to provide a easy way to integrate your apps and services to deliver push notifications across all your devices -  Browsers and Mobile devices via REST APIs. Though the primary intent is only that, over the years it has become much more than that - mirroring device notifications, sharing files across devices and the like.

## Plan

Our idea is simple - call the API through the shell to push notifications. There seemed like two ways to do the same. One is creating a channel - which supposedly can be subscribed by many people. Frankly, I haven't tried to do that, yet. Looks like it is good for teams. The other is, very straightforward - creating an APP by creating an ```ACCESS_TOKEN``` and subsequently using that token to send notifications.
We'll try the simpler second option.

### Assumptions

I'm assuming that you,

* Have ```ssh``` configured. If not, [follow the documentation here](https://www.digitalocean.com/community/tutorials/ssh-essentials-working-with-ssh-servers-clients-and-keys).
* Are familiar with editing shell configs (dotfiles).
* Use a ```*nix``` based machine.
* Have ```zsh``` shell. ```bash``` is similar for the purpose of this exercise - with just variations in config files.

## Steps

### Writing the PushBullet function

First step will be to write the function to call the PushBullet API, which your shell will invoke to push the data. You want it to be 'shell-agnostic'. So, let's put it up in a file and source it from the shell config. Let's assume the file's name is ```shell.rc```.

The contents of ```shell.rc``` would then be:

```bash
pushb() {
curl -s --header 'Access-Token: '$PUSH_BULLET_ACCESS_TOKEN\
     --header 'Content-Type: application/json'\
     --data-binary '{"body":"'"$2"'","title":"'"$1"'","type":"note"}'\
     --request POST\
     https://api.pushbullet.com/v2/pushes > /dev/null
}
```

Three things here:

* ```$PUSH_BULLET_ACCESS_TOKEN``` is your PushBullet API Access Token.
You can [get one for yourself here](https://www.pushbullet.com/#settings/account).
* ```$1``` is your push alert title.
* ```$2``` is the body of your push notification.

Here's an example.

![ssh-alert]({{site.baseurl}}/assets/images/ssh-push-notifications/ssh-alert.png)

### Generating the SSH connection metadata

Now that we have the function to do what we want, how do we generate the data for us to pass into the function? For clarity, I'm talking about the finding the time, IP address, port and all the other details you may want.

Here's the snippet to do the same.

```bash
SSH_PORT=$(echo $SSH_CONNECTION | awk -F' ' '{print $2}')
SSH_IP=$(echo $SSH_CONNECTION | awk -F' ' '{print $1}')
SSH_TIME=$(TZ='Asia/Kolkata' date)
LOGIN_MESSAGE="New SSH login from ${SSH_IP} via port ${SSH_PORT} at ${SSH_TIME}"
pushb "SSH Login Alert" $LOGIN_MESSAGE
```
Here, ```$SSH_CONNECTION``` gives all the data you need to gather about the current ```ssh``` session. We simply ```awk``` to get the data we want. ```Asia/Kolkata``` has been used to get the system time in IST. You can choose whatever is applicable for your use-case.

Now that you have the snippet, where would you put this? This again would have to be shell-agnostic. So, let's put that in a file called ```login.rc```.

### Configuring your shell

That's it. We have the function and the script to pass data to it.

Just to be on the same page, we have two files with us:

* ```shell.rc```
* ```login.rc```

Next step would be to source these files in ```zsh``` shell config. Pay attention here, since we'll briefly diverge into shell basics. There are two types of shells - Login shell and a Non-login shell. I myself don't know much more than the fact that - when you typically ```ssh``` into your machine with an account, you get into **login** shell. But, you can **choose to use a non-login shell** when you have physical access to the same machine. Let's not go any further than this. I'd encourage you to research on shells - well, its a note for myself to do that. So, that's that and going back to our topic, when you ```ssh``` into your machine, you get into a login shell.

Point is to invoke the script everytime **only when you get into a login shell and not otherwise**. How do you do that? With regard to ```zsh```, only login shells invoke the scripts in ```~/.zlogin```. And every shell, login or non-login look for custom configs in ```~/.zshrc``` file. And the order it happens is this:

1. ```~/.zshrc```
2. ```~/.zlogin```

For more information on ```zsh``` config file startup order, [you read here](http://zsh.sourceforge.net/Intro/intro_3.html).

So, source your ```shell.rc``` file in ```~/.zshrc``` file

```bash
source ~/dotfiles/shell.rc
```

And your ```login.rc``` file in ```~/.zlogin``` file.

```bash
source ~/dotfiles/login.rc
```

That is, assuming you have both ```shell.rc``` and ```login.rc``` within ```~/dotfiles/``` folder. If you're planning to use ```bash``` shell, you need to use ```~/.bashrc``` for ```~/.zshrc``` and ```~/.bash_profile``` for ```.zlogin```.

And kaboom! Now you have a working PushBullet notification system for your SSH logins.

## My Dotfiles

For a working copy of the same and much more features, clone my [dotfiles](https://github.com/dtsdwarak/dotfiles) repo. PRs most welcome! <3
