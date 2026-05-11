# Lesson Learned: Rebuild CocoIndex Code Indexes After Embedding Backend Changes

**Date**: 2026-05-11
**Tags**: cocoindex-code, ccc, ollama, embeddings, memory, reindex

When `cocoindex-code` appears to reserve a lot of RAM, separate the process that owns the memory before changing anything. Local `[full]` installs load `sentence-transformers`/`torch` inside the `ccc` daemon path, while Ollama moves the model residency to `ollama runner`. That makes the memory easier to reason about: `ccc run-daemon` is the index/search orchestration layer, and `ollama runner` is the embedding model server.

If the global embedding model changes, existing vector indexes should be rebuilt. Use `ccc reset -f && ccc index` inside each initialized project to delete generated DB files while preserving `.cocoindex_code/settings.yml`. Do not use `ccc reset --all` unless the intent is to remove project settings too.

Practical sequence:

1. Update `~/.cocoindex_code/global_settings.yml`.
2. Run `ccc doctor` and confirm indexing/query checks pass.
3. Discover initialized projects with `.cocoindex_code` directories.
4. Run `ccc reset -f && ccc index` in each initialized project.
5. Run `ccc doctor` again from each project and inspect process memory by boundary.

This session used `ollama/nomic-embed-text`, validated dimension 768, and rebuilt the initialized `fanarium` and `haabiz-hrm-fe` indexes.
