# Lesson Learned: supermemory learning needs complete artifacts

A `/learn --deep` run is not complete just because the research agents produced good findings. It is only complete when the expected artifact set actually exists on disk in the learning directory.

In this session, the `supermemoryai/supermemory` study produced strong exploration output across architecture, snippets, quick reference, testing, and API surface. But only part of the requested file set was written automatically. The right recovery pattern was not to redo the whole search or abandon the run as “mostly done.” The right move was to use the grounded agent outputs, fill in the missing files locally, verify the directory contents, and then create the hub file.

The broader pattern is that research workflows should be judged by the final preserved artifact, not by intermediate agent confidence. When studying external repos, especially with parallel delegation, the durable value is the organized note set that future sessions can actually open and reuse.
