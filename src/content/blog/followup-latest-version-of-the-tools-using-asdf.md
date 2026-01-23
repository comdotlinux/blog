---
title: "Followup latest version of the tools using asdf"
author: comdotlinux
pubDatetime: 2022-10-10T13:07:15.000+00:00
postSlug: followup-latest-version-of-the-tools-using-asdf
featured: false
draft: false
tags:
  - "asdf"
  - "commandline"
  - "linux"
  - "terminal"
  - "tools"
ogImage: "Tools"
description: "Tools"
---

[![A Comic By Monkey User about a Final patch in production](https://www.monkeyuser.com/2018/final-patch/104-final-patch.png)](https://www.monkeyuser.com/2018/final-patch/)

Disclaimer!: This post only talks about `asdf` .  
afx is also quite new to me too and I don't have enough experience to help you out, maybe you can let me know or point
me in the correct direction if you find something and I will update it here.

## Table of contents

## Why this post

- We all make mistakes, mistakes are arguably what makes us humans, allow us to learn from them, and release a new (and
  hopefully a better) version. However, Keeping up with this is a chore in a project at best and a security hole at the
  worst, but syncing the versions is also an equally big concern from getting surprises within the team by subtle bugs
  cause by such version mismatches.

- All this to say is that the task of the tools we saw in the
  earlier [post](https://blog.kulkarni.cloud/posts/on-the-topic-of-tools-their-versions-and-automated-installations) is
  not to always allow the use of the latest versions but to have some sanity in this increasingly chaotic (albeit
  beautiful) and fast-paced software development world. So there aren't any (direct / inbuilt) ways that I know of always
  keeping you at the latest version. However, to sync the versions you use yourself and no one else on the team is a task
  that almost guaranteed to be forgotten. That brings us to the question from the earlier post.

> If I don't care about the version of a tool just that I have the latest, what should I do? -- rephrased ;)
>
> Aashish

- There is a way described
  at `asdf` [documentation](https://asdf-vm.com/manage/versions.html#install-latest-stable-version)

asdf install <name> latest

## Install latest stable version that begins with a given string.

asdf install <name> latest:<version>

However, I have not used it myself recently and earlier it did not work.

What do I use? a self developed shell script. (it probably does not work directly on
mac) : [update-asdf.sh](https://gist.github.com/comdotlinux/17cb87a055f0e2873448a04397416c30).

<script src="https://gist.github.com/comdotlinux/17cb87a055f0e2873448a04397416c30.js"></script>

Let's see it in action shall we?

<div style="display: flex; align-content: center; flex-wrap: wrap; justify-content: center">
<iframe style="width: 80%; height: 35vh;" src="https://www.youtube-nocookie.com/embed/BvPV7wIVcL8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

This is what I use, and I know it's a little rough around the edges but get's the job done. What does it do?

1. Reads the `.tool-versions` and and adds all the plugins for each listed
   tool. [YMMV](https://www.urbandictionary.com/define.php?term=ymmv)
2. Updates all the Plugins (they are each their own git repo)
3. Runs `asdf install`
4. Asks if you want make all versions global. (just creates / appends / updates ${HOME}/.tool-versions)
5. Checks each plugin for a newer version and show top three versions.
   - Some personal optimizations are applied, like for java only use [temurin](https://adoptium.net/temurin/)
   - Ignore some alpha / beta / pre-dev / dev / some error versions seens
6. Then for each update show one line in place edit `sed` command to update individual tool
7. Also, a consolidated `sed` to update all tools at once
8. there is a `update-asdf.sh -n` flag that runs in non-interactively by saying yes but does not actually update any
   versions.

## alternative option

There's also an interesting use of
the [excellent `fzf` to update `asdf` tool versions](https://github.com/junegunn/fzf/wiki/examples#asdf)

```bash
# Install one or more versions of specified language
# e.g. `vmi rust` # => fzf multimode, tab to mark, enter to install
# if no plugin is supplied (e.g. `vmi<CR>`), fzf will list them for you
# Mnemonic [V]ersion [M]anager [I]nstall
vmi() {
  local lang=${1}

  if [[ ! $lang ]]; then
    lang=$(asdf plugin-list | fzf)
  fi

  if [[ $lang ]]; then
    local versions=$(asdf list-all $lang | fzf --tac --no-sort --multi)
    if [[ $versions ]]; then
      for version in $(echo $versions);
      do; asdf install $lang $version; done;
    fi
  fi
}
```

In action

<div style="display: flex; align-content: center; flex-wrap: wrap; justify-content: center">
   <iframe style="width: 80%; height: 35vh;" src="https://www.youtube.com/embed/5tFqGgLL6C4" title="Using fzf to install asdf tool versions" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

This too does not update the versions in the `.tool-versions` file, but probably is not too hard to add that in. This
exercise is left for the reader (I've always wanted to say that)

[![A monkeyuser comic on backlogs](https://www.monkeyuser.com/2022/buglog/236-buglog.png)](https://www.monkeyuser.com/2022/buglog/)

## Extro

Pick one from above, maybe modify it to update the tool to the latest and then run `asdf install` schedule the run of
the chosen method non-interactively and that should take you further until something breaks because of an update.

So that's it, hope this helps!

---
