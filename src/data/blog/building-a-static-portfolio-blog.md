---
title: "Building a Static Portfolio Blog"
description: "Why a Git-backed Markdown blog is a pragmatic fit for a self-hosted developer portfolio."
publishedAt: 2026-04-24
tags: ["Astro", "Portfolio", "Publishing"]
language: "en"
draft: false
---

A portfolio blog does not need a database on day one. For a solo developer site, Markdown in Git keeps the publishing path simple: write, commit, push, and let the host build static pages.

That tradeoff keeps the site fast and removes an admin security surface. If browser editing becomes important later, a Git-backed CMS can write to the same Markdown collection.

```ts
const publish = ['write markdown', 'commit changes', 'deploy static html'];
```

The important architectural choice is to keep content portable and avoid tying the first version to a runtime backend.
