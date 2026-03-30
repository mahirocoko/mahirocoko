import type { BuildContextForTaskResult, SearchMemoryItem } from "../types.js";

export function buildContextFromItems(input: {
  readonly task: string;
  readonly items: readonly SearchMemoryItem[];
  readonly maxItems: number;
  readonly maxChars: number;
  readonly degraded: boolean;
}): BuildContextForTaskResult {
  const selectedItems: SearchMemoryItem[] = [];
  let truncated = false;
  let context = `Task: ${input.task}\n\nRelevant memories:\n`;

  for (const item of input.items.slice(0, input.maxItems)) {
    const section = `- [${item.kind}] ${item.content}\n`;

    if ((context + section).length > input.maxChars) {
      truncated = true;
      break;
    }

    context += section;
    selectedItems.push(item);
  }

  return {
    context,
    items: selectedItems.map((item) => item.id),
    truncated,
    degraded: input.degraded,
  };
}
