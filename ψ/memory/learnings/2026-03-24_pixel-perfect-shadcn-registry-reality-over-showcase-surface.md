# Pixel-Perfect: registry reality over showcase surface

When evaluating a component repo that mixes a polished docs site with distribution tooling, treat the generated distribution artifacts as the real contract. In Pixel-Perfect, the trustworthy reuse surface is `registry.json` plus the generated `public/r/*.json` files, not every component card or tutorial item shown in the site UI. Some entries are showcased in the app but are not actually published as installable registry items.

The practical pattern is simple: if the repo is built around shadcn registry publishing, answer “can I use this directly?” by checking the published registry outputs first. Showcase metadata is presentation. Registry artifacts are the actual API.
