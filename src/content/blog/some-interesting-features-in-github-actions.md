---
title: "Some Interesting Features In GitHub Actions"
author: comdotlinux
pubDatetime: 2022-12-27T02:13:42.000+00:00
postSlug: some-interesting-features-in-github-actions
featured: false
draft: false
tags:
  - "automation"
  - "ci"
  - "github"
  - "githubactions"
  - "build"
ogImage: "Actions"
description: "Github Actions"
---

[![Github Actions](https://avatars.githubusercontent.com/u/44036562?s=200&v=4)](https://docs.github.com/en/actions)

## Intro

[GitHub Actions](https://docs.github.com/en/actions), in my opinion changed the landscape of Continuous Integration by not only having a CI close to the code (for ones using GitHub) but also allowed very close interactions with the [Git Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging) and [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) which also allow uploading assets that might be related to the release. Also it really helped that they allow free usage of actions for public repositories that help automate many many tasks that free up the really important time of the contributors who already are doing this in addition to their day job.  
This coupled with some core actions that take care of basic needs proliferated the usage and creation of multitude of actions that allow doing all kinds of things that you need and almost any new service also keeps the Use Case in mind.

So it's not like all development there is done and there's nothing new coming in to GitHub Actions anymore, on the contrary it seems there are features that solve many problems elegantly are being added all the time! This post is about a few such features that I wanted and now do have included in Github Actions.

Also, I have to clarify that (and search on why that is so) the actions are really actions that are performed as a step in a Job and One or more Jobs make a workflow. So You use actions (either created by yourself or others) in steps and write jobs that run (in parallel, sequentially or using different architectures) that are run as part of workflow that is triggered by events.

## Table Of Contents

## 1. Select Box and Boolean Inputs For [Workflow Dispatch](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch) (Github Actions Speak for Manual Trigger)

```yaml
on:
  workflow_dispatch:
    inputs:
      logLevel:
        description: "Log level"
        required: true
        default: "warning"
        type: choice
        options:
          - info
          - warning
          - debug
      tags:
        description: "Test scenario tags"
        required: false
        type: boolean
      environment:
        description: "Environment to run tests against"
        type: environment
        required: true

jobs:
  log-the-inputs:
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Log level: $LEVEL"
          echo "Tags: $TAGS"
          echo "Environment: $ENVIRONMENT"
        env:
          LEVEL: ${{ inputs.logLevel }}
          TAGS: ${{ inputs.tags }}
          ENVIRONMENT: ${{ inputs.environment }}
```

If You now try to [run](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow?tool=webui) the workflow you should see something like below:

![Workflow Dispatch Inputs](/assets/20221227/workflow-dispatch-inputs.png)

The Example and The Image are Straight out of the GitHub Actions Documentation.  
What is Interesting is  
i. The Log Level input is restricted to 'info', 'warning' and 'debug' anything else is just not possible from the webUI and fails to start when started from the [cli](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow?tool=cli).  
i. The `environment` is one of 'production', 'staging' and 'development' as per the [official documentation](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#about-environments). So this is a bit special in that the options are not directly visible and can be [created](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#creating-an-environment) if need be, these are the default ones available.

## 2. That brings up the next interesting feature, Environments

When we use [environments for deployments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) (it is not really deploying anything without us writing those steps, just creating an additional scope) we can not only use it as a target as seen above but also, have some waits / cool down before the job is run, separate secrets with the same name, so depending upon the environment selected different values are "injected / used" in the workflow and of course combined with [protected branches](https://docs.github.com/en/github/administering-a-repository/about-protected-branches) you can also have forced approvals not only before merging to the main branch but also before running a workflow e.g. to production.

Check [Reviewing Deployments](https://docs.github.com/en/actions/managing-workflow-runs/reviewing-deployments) for more information.

## 3. Writing Your Own Actions

For Some time now there was a [way](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action) to write your own action and have anyone (if public) to use it and even have it listed and searchable on the [Actions Marketplace](https://github.com/marketplace?type=actions) and a [Dockerfile](https://docs.github.com/en/actions/creating-actions/creating-a-docker-container-action) action and they are great when one wants to do that but are quite involved (at least the JavaScript ones are for me) but what does one do when there are things that one might (or might not) want to publish and might (or might not) want to keep in the same repository using the action. Which is usually the case when working with a company and probably a private repo? That was a long question but has a not quite long answer, [composite actions](https://docs.github.com/en/actions/creating-actions/creating-a-composite-action).

![Github Composite Action](/assets/20221227/GithubCompositeAction.png)

The full code is here in this repository : [composite-actions-example](https://github.com/comdotlinux/composite-actions-example)

Here we have a file at `.github/actions/setup-asdf/action.yaml` that holds multiple steps that we need to run, and this is essentially a composite action. Any Number of workflows can refer to it by simply adding  
`uses: ./.github/actions/setup-asdf` as a step in the workflow. Remember though, this action is not public if the repository is private and then can only be used by workflows within that repository.

We are also not limited to some default values, if need be we can have inputs and outputs.

```
name: 'Hello Input Output'
description: 'Greet someone'
inputs:
  who-to-greet:  # id of input
    description: 'Who to greet'
    required: true
    default: 'World'
outputs:
  random-number:
    description: "Random number"
    value: ${{ steps.random-number-generator.outputs.random-number }}
runs:
  using: "composite"
  steps:
    - run: echo Hello ${{ inputs.who-to-greet }}.
      shell: bash
    - id: random-number-generator
      run: echo "random-number=$(echo $RANDOM)" >> $GITHUB_OUTPUT
      shell: bash
```

Here When you use this composite action in a workflow (assuming it is saved in a directory under `.github/actions` directory named `hello-input-output`)

```
name: composite-input-output-test-example
on:
  workflow_dispatch:

jobs:
  composite-input-output-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - id: capturing-step-id
        uses: ./.github/actions/hello-input-output
        with:
          who-to-greet: 'Santa'
      - name: 'Show The Output'
        run: echo ${{ steps.capturing-step-id.outputs.random-number }}
```

The Output should be something like below

![Composite Input Output Test](/assets/20221227/CompositeInputOutputTest.png)

There are limitations to Composite Actions, like not being able to have access to secrets that limit the usability in some cases, as any passed in variable is not masked and not subjected to the same strict secret guidelines.

## 4. Output Masks and Log Grouping

As they say (though this is not a movie) show don't tell.

<div style="display: flex; align-content: center; flex-wrap: wrap; justify-content: center">
   <iframe style="width: 80%; height: 35vh;" src="https://www.youtube-nocookie.com/embed/HiYfwN_AkPE" title="Logs And Masks" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

The code can be found [here](https://github.com/comdotlinux/composite-actions-example/blob/main/.github/workflows/logs-and-masks.yaml). There are [other workflow commands](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions) as they are called that might also be of interest :)

## 5. Creating a reusable workflow

At my current place of employment, we are having a monorepo, that means more than one project in one git repository. This brings with it some challenges, it's difficult to know which directory (which means project) has the changed files? You say easy!!! use the paths filter right?

```
on:
  push:
    paths:
      - 'sub-project/**'
      - '!sub-project/docs/**'
```

Wrong! Then you have 2 choices,

1. List all Sub Projects in the paths and figure out in the workflow somehow the name of the changed project.  
   Here You Basically loose out on all the context information just because you want to have a single workflow  
   You have to do some shell / git / some other magic to figure out the name (or names!) of changed projects.
2. Create Separate Workflows for each sub-project that only filters for that specific directory.  
   Here You Duplicate all the code just to get the benefit of directly knowing which project changed.  
   This works fine if you have only 2 projects, when you add a third one you will have to do any future changes manually to all three, which is not very DRY (Copy Then Refactor for the third time)

So What can we do? well use the [workflow_call](https://docs.github.com/en/actions/using-workflows/reusing-workflows#creating-a-reusable-workflow)!

The Basics are

1. Create a Reusable Workflow that takes inputs and required secrets and looks like the block below
2. Create one small workflow for each project that triggers on respective project changes and just calls the reusable workflow.  
   Let's See It In Action Shall we? Again the [source code is in the same repository](https://github.com/comdotlinux/composite-actions-example)

<div style="display: flex; align-content: center; flex-wrap: wrap; justify-content: center">
   <iframe style="width: 80%; height: 35vh;" src="https://www.youtube-nocookie.com/embed/nnbadJz1YcA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## Extro

That's it for now there are tons of features but these are the lesser known ones or at least ones not easily found.

[![Meaning Comic Monkey User](/assets/20221227/meaning.png)](https://www.monkeyuser.com/2021/meaning/)

---
