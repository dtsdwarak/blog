---
layout: post
title: The Escapade With Virtual Machines
tags: virtual machine, kvm, qemu, virtualization, linux
---

Virtualization is a very fancy jargon to use. It is more like "Big Data" in that, not many know what it really means, how and where to actually use it, but nevertheless try their best to keep a frightfully serious face and throw shit at us for hours. My definition of virtualization didn't go beyond "installing Virtualbox" for more than a good 6-7 years until a couple of weeks back. And things did seem pretty simple the way I saw it - "Running an operating system inside another operating system". It is that simple, yes, except its not with what's under the hood.   
<!--break-->

Oh! So, is that all the fuss is about? OS inside another OS? No. That is so 2000s. There's so much more to VMs than just trying to play with Ubuntu inside a Windows machine. VMs are a way by which...Hang on. On a second thought, I think it'd only make sense for us to start from the get go -- from where it started.

##What is it?

I guess by now you have an idea, perhaps vaguely atleast, about virtualization and what its trying to achieve. To elaborate a little more on that, virtualization is to provide a virtual hardware/compute architecture (that doesn't exist as a separate complete unit), to the layer of software running on top of it.

Well, that is exactly what emulation does right? If not, then what is emulation and what is virtualization? How do these two differ?

<img src="/assets/images/virtualization/confusion.png" style="height:300px">

##Emulation vs Virtualization

Emulation is about trying to make a particular system mimic or imitate another system. Take for example the use of Android Studio to write applications for your phone's ARM architecture. You test your app with Android Studio and then push it to your phone. The underlying hardware architecture in your PC though is x86. What we are doing here is **emulation**. Converting instructions meant for a particular architecture (ARM) to a compatible instruction set of the underlying architecture(x86) over which the software is run.

Take another example. You might've mounted your ISO or any other disk image files you have as a disk drive in your PC. (viz., Daemon Tools). Do we actually have that disk drive in our hardware stack? No. So, what we are doing here is, taking the image drive's read/write operations performed by the software using it and converting it into the corresponding file read/write instructions on ISO image's contents.

In both the cases we just saw, we were trying to show the operating system/software that we have a kind of hardware when we actually did not have one. So, emulation is helping us mimic an architecture different from the one that is down below in the actual hardware stack. This is possible by converting the instructions to be executed into the corresponding instructions for the hardware present. Thus, execution of "original instructions" do not take place in actual hardware and thus you cannot get native performance with emulation.

####Simulation?!

Now please don't confuse this with simulation. Simulation is more about making something appear more close to the one its replicating but cannot be used as a substitute to the original. For e.g., with MATLAB and Simulink you can simulate the behavior of aerospace components but you can never replace them for actual components. Emulation is about making something work like another, trying to replicate the original's behavior, and can be used as a substitute to the original. e.g. Android emulator etc which can actually be used as a replacement to an actual phone. [Read more here](http://stackoverflow.com/a/9579323 "Simulation vs Emulation").

Take a moment's breath. You are under a deluge of information. Let things sink in.

Right, cool. So what is virtualization then? Virtualization is more about logically separating or consolidating the existing hardware into separate environments by [creating virtual barriers](http://stackoverflow.com/a/6045177 "Thanks to this StackOverFlow answer"), in turn giving us a view of (generally smaller and) complete machines. The prime difference between virtualization and emulation is that, the underlying architecture in virtualization is mostly the same as the one virtualized. These separate virtual environments are separated by virtual barriers, but they run in the same physical environment.

It is a misconception that virtualization is always about giving smaller device environments than the original host environment. In processor virtualization, that may usually be the case. Yes. But, in storage virtualization though, several multiple physical devices are [regarded as a single logical](http://www.computerworld.com/article/2551154/virtualization/emulation-or-virtualization-.html) unit by the server.

And since the execution of instructions take place in actual hardware, we can expect a near-native performance. So, performance wise, virtualization is better than emulation.

##Where and how are these things used?

So now that you understand what emulation and virtualization is, in most cases, you'll see both these concepts play side-by-side.

Where emulation is useful:

* When you want to replicate a hardware you don't have.
* Running a software meant for another hardware.

Where virtualization is used:

There are a lot of uses of implementing server virtualization in your architecture when operating at an enterprise-scale. They go on and on. I don't want to put 'em all up here. You can read more about the [benefits of virtualization](http://www.infoworld.com/article/2621446/server-virtualization/server-virtualization-top-10-benefits-of-server-virtualization.html). In short, we get complete utilization of existing hardware resources.

>This is way too much data for a mortal to grasp in one go. Read once or twice, if you think it'll help.

##Some Terminology

Now that we know the benefits of virtualization, before we get to know how they get implemented in actual, it is essential you become familiar with some terminology.

* Host - The machine on top of which we perform virtualization.
* Guest - The one that is virtualized.
* Hypervisor - Also called the Virtual Machine Manager, it is the middleware that sits between the underlying hardware(and software) layer which manages the virtual machine instances.

If you've used [Virtualbox](https://www.virtualbox.org/) or [VMWare vSphere](http://www.vmware.com/in/products/vsphere) before, they are examples of hypervisor.

There are two kinds of hypervisors available -- Type 1 and Type 2.

Type 1 hypervisors are the kind that act directly on top of the host hardware. Type 2 act on top of host hardware + host operating system. Thus, the examples we looked before are Type 2 hypervisors. [Xen](http://www.xenproject.org/) is an example of Type 1 hypervisor. Pictures below will put things in perspective.

<img src="/assets/images/virtualization/type1.png" style="height:300px">
<p><div class="img-caption">Type 1 Hypervisor</div></p>
<img src="/assets/images/virtualization/type2.png" style="height:350px">
<p><div class="img-caption">Type 2 Hypervisor</div></p>

##Open Source Virtualization

Assuming you are interested in virtualization, few of the best virtualization providers in industry are open source and the best options available for you are either kvm-qemu or Xen.

[KVM](http://www.linux-kvm.org/page/Main_Page) is called the kernel virtual machine and is a module that comes built into your linux kernel. [Qemu](http://wiki.qemu.org/Main_Page), short for Quick Emulator is another virtualization/emulation provider. They are examples of Type 2 hypervisors. KVM is best to go with when you are trying to virtualize the same architecture as the host. Qemu, when you want to run a different architecture than the one you have as a host. When you want to use KVM, you'll still need Qemu to emulate your machine's hardware.

I've not worked with Xen but that is the most dominant virtualization provider in the current time.

---
Virtualization is a really exciting domain and has enough scope for a foreseeable future. This post was more like an introduction in virtualization. More practical stuff later! If you happen to find any mistakes, please let me know in the comments section below.
