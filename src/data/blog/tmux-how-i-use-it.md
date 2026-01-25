---
title: "tmux, how I use it"
author: comdotlinux
pubDatetime: 2022-11-12T13:07:15.000+00:00
postSlug: tmux-how-i-use-it
featured: false
draft: false
tags:
  - "automation"
  - "linux"
  - "productivity"
  - "terminal"
  - "tmux"
ogImage: "Tools"
description: "Tools"
---

[![Tmux Logo](https://github.com/tmux/tmux/raw/master/logo/tmux-logo-medium.png?raw=true)](https://github.com/tmux/tmux)

You have heard of **[tmux](https://github.com/tmux/tmux/wiki)**, you have haven't you? If not then surely you have heard of **[screen](https://www.gnu.org/software/screen/)**? Maybe you used **[byobu](https://www.byobu.org/)**? If the answer to any of these is: Yes Of Course I have my own custom setup and don't like to customize too much, or even read too much then this post is not for you ;) Here's a comic for you while you leave to do whatever that you want to do then. Au Revoir

[![Zenos Progress](/assets/20221112/96-zenos-progress.png)](https://www.monkeyuser.com/2018/zenos-progress/)

This is going to be a long one

## Table Of Contents

- Still with me?

## O.K. then let's have a look at tmux, how I use it, and maybe you can start using it too?

We are going to go about this in a manner that even if you leave after some section without reading the rest, you still can get something out of the time spent in reading this. So some initial sections might be boring for you my fellow (long-term-linux-terminal) traveller, but you are patient just like me right? right?

## Intro (please don't stop after the intro ;) )

`tmux` (modern - by linux standards) or `screen` (a bit older) are terminal multiplexers -- big words, but they allow you to manage multiple terminals easily. They do more than that, and they shine when connecting to remote servers but are just as useful for local development as we will see by the end.  
Using tmux requires a learning curve but then gets much more easy real soon and with huge productivity benefits

## Preset, Just install and use

Using Screen or Tmux requires some learning and setup, they are extremely flexible and non-opinionated, so it is possible to customize them (within limits - outside them, you contribute to the source code) as much as you want, but this means the sane defaults are mostly bare, if you install tmux and run it in a terminal you might not even notice anything except you have to press `Ctrl+D` or `exit` twice instead of the usual once :)

To help with this there is a project that takes an opinionated approach and presents you with a pre-customized ready to use tmux setup that will go a long way for you. After installation simply press `Ctrl+A` and you are presented with a selection to select the keys, I usually select 1 `screen` keys as I am already familiar with them, however the backend by default ([AFAIK](https://www.urbandictionary.com/define.php?term=afaik)) is `tmux`. Here is how it looks for me.

<div style="display: flex; align-content: center; flex-wrap: wrap; justify-content: center">
    <iframe style="width: 80%; height: 35vh;" src="https://www.youtube-nocookie.com/embed/WVAZRIG5iAE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

Now you can simply start using tmux and learning all about it. Want to learn more and that too to while listening to Mozart? Here you go

<div style="display: flex; align-content: center; flex-wrap: wrap; justify-content: center">
    <iframe style="width: 80%; height: 35vh;" src="https://www.youtube-nocookie.com/embed/NawuGmcvKus" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

From the Official Byobu Page

## Better Looks anyone?

So I like byobu because it is quite ubiquitous and hence very usable where you are just getting started.  
But, I am usually using the terminal locally and would like to see some better visuals than we get out of the box from byobu. I recommend leaving byobu installed and just customize tmux

As with almost everything Gnu / Linux there's a configuration file for that named `.tmux.conf`

[![x11](/assets/20221112/x11.png)](https://xkcd.com/963/)

A joke about X11 Config File

But first setting some expectations, we are going to leave the Mac Users Behind (only for this section), or at least allow them to find their own way hereafter, as I'm not sure how to install the packages on Mac. O.K. Let's continue

![OK Okay OK](/assets/20221112/ok_okay_ok.png)

[Powerline](https://fedoramagazine.org/add-power-terminal-powerline/), I heard about this from the blog of my first [`Moonsh`ine](https://en.wikipedia.org/wiki/Fedora_Linux_release_history#Fedora_Linux_7) and co-incidentally also [current Linux Distro](https://en.wikipedia.org/wiki/Fedora_Linux_release_history#Fedora_Linux_36) - [Fedora](https://getfedora.org/en/workstation/), Namely their excellent [Fedora Magazine](https://fedoramagazine.org). So let's install powerline

```
# For Ubuntu or it's derivatives
sudo apt install powerline fonts-powerline

# For Fedora and rpm based distros
sudo dnf install powerline powerline-fonts tmux-powerline
```

Then modify our config fine `~/.tmux.conf` creating it if it does not exist [to look like this](https://gist.github.com/comdotlinux/fb0050c65128fe5f7543194c8ec874aa/0e393467dde50bfda0f067a6cd253e20ffce3b95)

<div style="display: flex; align-content: center; flex-wrap: wrap; justify-content: center">
    <iframe style="width: 80%; height: 35vh;" src="https://www.youtube-nocookie.com/embed/x2cCbF_GTRI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

Nothing spectacular but let's improve on that, updating our `.tmux.conf` to [Look Like This](https://gist.github.com/comdotlinux/fb0050c65128fe5f7543194c8ec874aa/1edeab009e6b9b90448c3c1e50f3eed245d80a12)

Now what we have here is reusing some configuration from configuration that byobu created. You could, if you want to simply copy it once and then not install byobu again, I keep it just because I'm lazy ;)  
Let's keep going, now the config [should look like this](https://gist.github.com/comdotlinux/fb0050c65128fe5f7543194c8ec874aa/8562119ab550b87c3c092aee662ebd72b2e77d94)

Now we are getting somewhere where it get's interesting. Let's see these in action.

<div style="display: flex; align-content: center; flex-wrap: wrap; justify-content: center">
    <iframe style="width: 80%; height: 35vh;" src="https://www.youtube-nocookie.com/embed/VO1vypCEad8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

Also you can add below to make you life easier with panes

So now you use the commands you have learnt and stop here if you want, so just leaving here a quick command summary.

<table><tbody><tr><td class="has-text-align-center" data-align="center">Command</td><td class="has-text-align-center" data-align="center">Action</td><td class="has-text-align-center" data-align="center">Alternative Command</td></tr><tr><td class="has-text-align-center" data-align="center"><code>Ctrl+a c</code></td><td class="has-text-align-center" data-align="center">New Window</td><td class="has-text-align-center" data-align="center"></td></tr><tr><td class="has-text-align-center" data-align="center"><code>Ctrl Right Arrow</code></td><td class="has-text-align-center" data-align="center">Next Window</td><td class="has-text-align-center" data-align="center"></td></tr><tr><td class="has-text-align-center" data-align="center"><code>Ctrl Left Arrow</code></td><td class="has-text-align-center" data-align="center">Previous Window</td><td class="has-text-align-center" data-align="center"></td></tr><tr><td class="has-text-align-center" data-align="center"><code>Ctrl+a %</code></td><td class="has-text-align-center" data-align="center">Vertical Split Pane</td><td class="has-text-align-center" data-align="center"><code>Ctrl+a |</code> (a pipe)</td></tr><tr><td class="has-text-align-center" data-align="center"><code>Ctrl+a -</code></td><td class="has-text-align-center" data-align="center">Horizontal Split Pane</td><td class="has-text-align-center" data-align="center"><code>Ctrl+a -</code> (minus)</td></tr><tr><td class="has-text-align-center" data-align="center"><code>Shift Right Arrow</code></td><td class="has-text-align-center" data-align="center">Next Right Pane</td><td class="has-text-align-center" data-align="center"></td></tr><tr><td class="has-text-align-center" data-align="center"><code>Shift Left Arrow</code></td><td class="has-text-align-center" data-align="center">Next Left Pane</td><td class="has-text-align-center" data-align="center"></td></tr><tr><td class="has-text-align-center" data-align="center"><code>Shift Up Arrow</code></td><td class="has-text-align-center" data-align="center">Next Pane Up</td><td class="has-text-align-center" data-align="center"></td></tr><tr><td class="has-text-align-center" data-align="center"><code>Shift Down Arrow</code></td><td class="has-text-align-center" data-align="center">Next Pane Down</td><td class="has-text-align-center" data-align="center"></td></tr><tr><td class="has-text-align-center" data-align="center"><code>Ctrl+a Shift+a</code></td><td class="has-text-align-center" data-align="center">Rename Window</td><td class="has-text-align-center" data-align="center"></td></tr><tr><td class="has-text-align-center" data-align="center"><code>Ctrl+a \</code> (backslash)</td><td class="has-text-align-center" data-align="center">Kill Server</td><td class="has-text-align-center" data-align="center">Close each Window and Pane<br>one by one with <code>Ctrl+d</code></td></tr><tr><td class="has-text-align-center" data-align="center"><code>Ctrl+a d</code></td><td class="has-text-align-center" data-align="center">Detach to the back ground</td><td class="has-text-align-center" data-align="center"><code>tmux a</code> (to re-attach)</td></tr></tbody></table>

A Small List Of Common Useful Commands

By No means even scratching the surface of the commands available but these are the one I use most and the ones that give you the most "Bang For Your Buck!" :)

## So What's next? Fireworks? Nope even better ;)

[![Automation](/assets/20221112/automation.png)](https://xkcd.com/1319/)

Another XKCD joke about automation

So Now comes the good stuff (at least the stuff that makes tmux indispensable for me)  
We all have things that we start whenever we want to start developing, like (i'm a Java Developer) and use docker swarm for local development, it works great however needs some things to be setup / run to see the state, like e.g. run `lazydocker` to see if the containers are looping / look at the logs, have some handy commands that I don't want to type again and again and want them at the ready, a shell where I would like to see what files I have no committed yet and also update the local repository.

Now you can manually run these if you want, and they will work great, but we are here and reading this long boring "Intro" to tmux not because we heed the XKCD right? so let's see how we can automate these using tmux. So update the config to the file below and launch tmux, now you see.....  
Magic!!!! what we set can now always be run exactly in the same way every-time.

<script src="https://gist.github.com/comdotlinux/fb0050c65128fe5f7543194c8ec874aa.js"></script>

The Developer Setup That You Need on Every Restart of a Computer / Every Restart of development session

<div style="display: flex; align-content: center; flex-wrap: wrap; justify-content: center">
    <iframe style="width: 80%; height: 35vh;" src="https://www.youtube-nocookie.com/embed/tRRQENJeYQY" title="A video of the previously created .tmux.conf in action" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

![Tmux Everywhere](/assets/20221112/TmuxEverywhere.gif)

Yes, You can use tmux to do whatever you want, start any program, any server and as many windows + sub panes and easily navigate between them. Let's list some benefits before we go?

- Setup-Once-Benefit-Everytime (restart then open terminal and tmux a -- bam, git pull, compile, start servers and system monitoring any anything else you want)

- No Context Switching, when trying to find multiple terminals, rename the windows and move easily just with `Shift` or `Ctrl` and arrow keys

- Easily Detach and attach if needed (even from a remote terminal)

- Instantly (after few hours to days of getting used to keys) be 50% cooler than you are. (I was 90% Cooler by the way just saying)

Also, Apologies for the XKCD comics, I just love [Randall](https://en.wikipedia.org/wiki/Randall_Munroe), and [xkcd](https://xkcd.com/) and cannot help myself.  
Go Buy [What-If](https://xkcd.com/what-if/) and [What-If 2](https://xkcd.com/what-if-2/) (No affiliations or sponsorship's by the way, like i'm gonna get sponsorship's :p )

![XKCD Everywhere](/assets/20221112/XKCD-everywhere.gif)

Now, I'm by no mean an expert on `tmux` I just think it is sufficiently cool and customizable that it helps a lot in my daily development. Also quite new at blogging and being a poser who thinks that I know something that someone else does not, so please do criticize but with love if possible :)

There are numerous pages and even some books on tmux I think, just search, and you will find it, also [Stack Overflow](https://stackoverflow.com/questions/tagged/tmux) has quite some answered questions :)

Don't forget to let me know how you like and use tmux indifferent ways, would love to integrate some tricks into my own config to use going forward.

So Young Padawans -- Go Learn the ways of the tmux. May tmux Be with you!

---
