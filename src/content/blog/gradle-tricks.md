---
title: "Gradle Tricks"
author: comdotlinux
pubDatetime: 2022-11-26T23:03:05.000+00:00
postSlug: gradle-tricks
featured: false
draft: false
tags:
  - "automation"
  - "build"
  - "gradle"
ogImage: "Tools"
description: "Tools"
---

![Gradle Logo](/assets/20221126/gradle-logo.png)

[Gradle](https://docs.gradle.org/current/userguide/what_is_gradle.html) is a build tool that (at least to me) feels like it is both very easy and at the same time almost impossible to understand. Can't say for sure about anyone else but when that happens to me, I simply end up with some things that seem to work for me well enough that I stop looking into them any more than that (Until the next itch of course!)

These things might be quite optimum, or they might be the opposite, (we will never know!, just kidding; only partly though!) and since Gradle Enterprise is behind a [page](https://gradle.com/enterprise/trial/) that does not show the pricing there's no way for me to ask an expert if this is fine. Also, I didn't come up with all of them, but some are from other blogs or [Stack Overflow](https://stackoverflow.com/questions/tagged/gradle). I dont take credit for any of them and will just serve as kind of notes for myself mostly, to refer to in the future.

Some Info about the code, it might be incomplete snippets and mostly using [Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html)

---

**Problem**: How to run a command on host?  
Solution: Use the convenient [exec task](https://gist.github.com/comdotlinux/a40e6206b7ffec6c4f91c03e7d387e00)

```kotlin
tasks.register("runBuild") {
	group = "com.linux"
	description = "Trigger Build Execution On Github Actions"
	doLast {
		val command = """gh workflow run build.yaml --ref master --field version=0.0.1"""
		exec {
			logger.lifecycle("Running Command $command")
			commandLine = command.split(" ")
			logger.lifecycle("Command executed.")
		}
	}
}
```

This can be used to call all kinds of commands that are already available and are used elsewhere. This serves two purposes, One: it saves you some keystrokes by not having to enter the same things again and again, but also the ability to leverage some variables you already have lying around, like the version for e.g. and also use maybe the project name in a multi project build. Two: It serves as a kind of documentation for you and your team on how to do things that you might want to share and even have has a living documentation as it will be used if it is useful.

---

**Problem**: Ask for Confirmation Before Running Something  
Solution: [Use Good Old Swing!](https://gist.github.com/comdotlinux/c8c37df48f1bb30fbb9b3e85b785dd18)

```kotlin
import javax.swing.JOptionPane

tasks.register("askConfirmation") {
    doLast {
        if (confirmation("Do you want to answer me?")) {
            logger.lifecycle("😃 You Answered Yes!!!!")
        } else {
            logger.lifecycle("😒 You Answered No 🤷")

        }
    }
}


fun confirmation(msg: String = "Continue?"): Boolean {
    return if (System.console() != null) {
        "y".equals(System.console().readLine("$msg [y/n] : "), ignoreCase = true)
    } else {
        JOptionPane.YES_OPTION == JOptionPane.showConfirmDialog(null, msg, "Confirm operation", JOptionPane.YES_NO_OPTION)
    }
}
```

<div style="display: flex; align-content: center; flex-wrap: wrap; justify-content: center">
   <iframe style="width: 80%; height: 35vh;" src="https://www.youtube-nocookie.com/embed/yuj9JXh92d4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

This has the obvious advantage of well asking confirmation, but also can keep the gradle task from completion until you need it to. One Disadvantage is (at least on my Fedora + Wayland ) that the window if you put it to the background does not show up in the Alt-Tab list.  
Also I cannot take credit for most of these but over time have lost references. However, in this case this is the [SO](https://stackoverflow.com/a/49649413/3331412) link.

---

**Problem**: Run a command and get the output for use in a grade task.  
Solution: Use the [ByteArrayOutputStream](https://gist.github.com/comdotlinux/65a9e78926b517dc849c3c192db7d2d0)

```kotlin
import java.io.ByteArrayOutputStream

tasks.register("gitCommit") {
    group = "com.linux"
    description = "Get The last git commit"
    doLast {
        val output = ByteArrayOutputStream().let { os ->
            exec {
                commandLine("/usr/bin/git rev-parse --verify HEAD".split(" "))
                standardOutput = os
            }

            os.toString()
        }

        println(output)
    }
}
```

[YMMV](https://dictionary.cambridge.org/dictionary/english/ymmv) but for me intellij had trouble importing the `java.io.ByteArrayOutputStream`

---

Problem: Well not really a problem but a simple trick to get more information about your build, even in CI  
Solution: Use [Gradle Build Scans!](https://docs.gradle.org/current/userguide/viewing_debugging_dependencies.html#sec:debugging-build-scans) It is an enterprise feature, but we can use them as developers to our advantage!
If you want to [enable it for all builds](https://gist.github.com/comdotlinux/cad8b21681f171b8442ca100ddc9b775) or pass `--scan` for a specific build

```kotlin
plugins {
    id("com.gradle.enterprise") version("3.10.1") // https://plugins.gradle.org/plugin/com.gradle.enterprise
}

gradleEnterprise {
    buildScan {
        termsOfServiceUrl = "https://gradle.com/terms-of-service"
        capture {
            isTestLogging = true
            isBuildLogging = true
            isTaskInputFiles = true
        }
        buildScanPublished {
            file("build-scan-url.log").writeText("${this.buildScanUri}")
        }
        publishAlways()
    }
}
```

Important: Please add `_termsOfServiceAgree_ = "yes"` after the `termsOfServiceUrl` to skip the question the next time.  
If you are not queasy about uploading to gradle your builds, I would recommend this as it eases many tasks like checking if tests were run, the resources available and timeline and much more. See [The Official Documentation](https://scans.gradle.com/).

---

I'm sure you have your "recipes" and I'm looking forward to any other interesting things you do with gradle that are useful and worth nothing them down.

[![Small Delights Monkey User Comic](/assets/20221126/small-delights.png)](https://www.monkeyuser.com/2022/small-delights/)

That's it for this entry, Have a nice one!

---
