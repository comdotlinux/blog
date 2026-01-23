---
title: On the topic of tools, their versions & automated installations
author: comdotlinux
pubDatetime: 2022-10-08T16:55:12.000+00:00
postSlug: on-the-topic-of-tools-their-versions-and-automated-installations
featured: false
draft: false
tags:
  - "afx"
  - "asdf"
  - "commandline"
  - "github"
  - "linux"
  - "tools"
ogImage: ""
description: "Tools"
---

Impatient? then these are the tools we will discuss

- [asdf](https://asdf-vm.com/) install it once and then after a few commands you have the tools installed.

- [afx](https://babarot.me/afx/) the command-line package manager

We developers love tools, we like to create them, use them and hope that they make our lives better as we are going about our day doing the things we do. You know don't you? "Working Hard or Hardly Working" -- I don't know who said that but I use it every chance I get.

![So many tools and tool boxes](/assets/20221008/so-many-tools-and-tool-boxes-high-quality-digital-art.png)

## Intro

Ever since the proliferation of GitHub and releases it has been quite easy to release a tool and post the binaries as release attachments. There was some work involved, you had to create a release (some GitHub additions to git tags), and then get the upload URL and upload the assets. But there were a host of tools to help with the process, and they helped but still some fiddling was required and not everyone who had the time to do so had the itch to not only scratch to tool, but also it's automation, or if they did they depended on tools that also were not updated if they had problems.

And then came GitHub actions, and they streamlined everything for nearly everyone to set it up once and the simply make changes, then release and the actions would take care of testing with different architectures, creating the final build, packaging and uploading the assets to the created release. Not to mention that they are now free for any public repository.

This is all great and are nice advancements to the high friction process of making software outside a large team, on your own, however what got lost in the process was the earlier ease of (sorry windows) installing nearly any required software by doing this

## Table of contents

```shell bash
# For Debian / Ubuntu and their derivatives
sudo apt install batcat

# For Fedora and other ditros using RPM packaging

sudo dnf install bat

# for mac (I think after installing homebrew once)

brew install bat
```

---

## Possible Approaches

So what to do then? There's great software out there just waiting for us to use, but not as easy to use as above? Well 2 options really

- Install the tools Manually
  - Easy, just list the tools somewhere on a gist, manually install.
  - Not easy update though.
  - Cannot easily share with others and spread the joy.
- Use another tool to manage the tools
  - Setup Once and then every time it get's easier
  - Easy To Share
  - Commit to your repo and everyone from your team can have the same versions
    - Can also be used with you private repo for the next time you need a new setup. Like me when distro hopping.

So, If you don't want to install manually then the following tools are for you!

---

## [ASDF](https://asdf-vm.com/)

> Manage multiple runtime versions with a single CLI tool

It's simple really, let's go though

- Install [asdf](https://asdf-vm.com/guide/getting-started.html#_1-install-dependencies) -- required only once :)

- Get all available plugins and find the tool you are looking for
  - e.g.
    - `asdf plugin list all | grep github-cli`
    - `asdf plugin add github-cli`
- Create a file called `.tool-versions`
  - As the name indicates, this file contains the tools and their versions to install
  - e.g.
    - `github-cli 2.16.1`
- Then run `asdf install`
- (Optional) if you want the command to be available everywhere in your home directory
  - run `asdf global github-cli 2.16.1`
  - This simply creates / updates the `.tool-versions` in your home directory
  - just check by running `cat ~/.tool-versions`

That's it GitHub cli should be available, try running `gh` to check

[Here](https://github.com/asdf-vm/asdf-plugins#plugin-list) you can find all the plugins available, there are many and now available for you to use.

To create plugins is not that difficult either, see [here](https://github.com/asdf-vm/asdf/blob/master/docs/plugins/create.md), there are even some plugins that I've created just search for `comdotinux` there.

`asdf` allows to have different versions of tools in different directories and simply switching to them change to those versions.

---

## [AFX](https://github.com/b4b4r07/afx)

> AFX is a command-line package manager. afx can allow us to manage almost all things available on GitHub, Gist and so on.

So Let's Go

- Install [afx](https://babarot.me/afx/getting-started) - (Only Required Once)

- Create a file named `~/.config/afx/github.yaml`

- Fill In the following

```yaml
github:

- name: stedolan/jq
  description: Command-line JSON processor
  owner: stedolan
  repo: jq
  release:
  name: jq
  tag: jq-1.6
  command:
  link:

  - from: '\*jq\*'
    to: jq
```

- Run `afx install`

That's it `jq` is installed, updating is also easy, update the version, run afx install.  
To uninstall, remove the section from yaml and run `afx uninstall`

## AFX Sample Config

Here's my current config yaml, as you can see it's much easier to install mostly anything with afx, like [prettyping](https://github.com/denilsonsa/prettyping) which does not have a release but is a shell script that you can install using `afx`

```yaml
github:
  - name: b4b4r07/enhancd
    description: A next-generation cd command with your interactive filter
    owner: b4b4r07
    repo: enhancd
    plugin:
      env:
        ENHANCD_FILTER: fzf --height 25% --reverse --ansi:fzy
      sources:
        - init.sh
  - name: cantino/mcfly
    description: fly through your shell history
    owner: cantino
    repo: mcfly
    release:
      name: mcfly
      tag: v0.6.1
    command:
      link:
        - from: "*mcfly*"
          to: mcfly
    plugin:
      sources:
        - eval "$(mcfly init zsh)"
  - name: bootandy/dust
    description: du + rust
    owner: bootandy
    repo: dust
    release:
      name: dust
      tag: v0.8.3
      asset:
        filename: "{{ .Release.Name }}-{{ .Release.Tag }}-x86_64-unknown-linux-gnu.tar.gz"
    command:
      link:
        - from: "dust-v0.8.3-x86_64-unknown-linux-gnu/*dust*"
          to: dust
  - name: ogham/dog
    description: better dig
    owner: ogham
    repo: dog
    release:
      name: dog
      tag: v0.1.0
      asset:
        filename: "{{ .Release.Name }}-{{ .Release.Tag }}-x86_64-unknown-linux-gnu.zip"
    command:
      link:
        - from: "bin/*dog*"
          to: digdog
    plugin:
      sources:
        - completions/dog.zsh
  - name: denilsonsa/prettyping
    description: prettyping is a wrapper around the standard ping tool with the objective of making the output prettier, more colorful, more compact, and easier to read.
    owner: denilsonsa
    repo: prettyping
    command:
      link:
        - from: prettyping
          to: prettyping
  - name: tstack/lnav
    description: advanced log file viewer for the terminal. It can quickly parse and index log files and display them in a single combined view with syntax highlighting.
    owner: tstack
    repo: lnav
    release:
      name: lnav
      tag: v0.11.1
      asset:
        filename: "lnav-0.11.1-musl-64bit.zip"
    command:
      link:
        - from: "lnav-0.11.1/lnav"
          to: lnav
  - name: mifi/lossless-cut
    description: LosslessCut aims to be the ultimate cross platform FFmpeg GUI for extremely fast and lossless operations on video, audio, subtitle and other related media files.
    owner: mifi
    repo: lossless-cut
    release:
      name: lossless-cut
      tag: v3.47.1
      asset:
        filename: "LosslessCut-linux-x64.tar.bz2"
    command:
      link:
        - from: "*LosslessCut-linux-x64/losslesscut"
          to: losslesscut
```

Here is my [**Gist**](https://gist.github.com/comdotlinux/bdd4a1a565280a87639dbf740b94f009) (Sometimes not shown properly when embedded)

![Nicely arranged tools and tool boxes](/assets/20221008/nicely-arranged-tools-and-tool-boxes-high-quality-digital-art.png)

## Extro

Now you should have a nice control over your tools and moreover easy to spread the love <3  
So where did I get to know about these tools? A very good Question, most are from the excellent and relatively (to my knowledge) unknown blog post.  
[Command Line for the 21. Century: The Low Hanging Fruit](https://ileriseviye.wordpress.com/2018/10/30/command-line-for-the-21-century-the-low-hanging-fruit/)

## Next Steps?

- Ability to install `afx` using `asdf` ;)
- Ability to install `asdf` using `afx` ;)
- Also remember to commit the `.tool-versions` and `github.yaml` to source control.

---
