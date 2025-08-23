import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper to read streaming JSON from fetch response
export const readStreamingJson = async (
  response: Response,
  onChunk: (chunk: any) => void,
  stopRef?: { current: boolean },
  controller?: AbortController
) => {
  if (!response.body) throw new Error("ReadableStream not supported");

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    if (stopRef?.current) {
      controller?.abort?.();
      break;
    }

    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line);
        onChunk(parsed);
      } catch (err) {
        console.warn("Failed to parse JSON line:", line);
      }
    }
  }

  // Parse any remaining buffer
  if (buffer.trim()) {
    try {
      const parsed = JSON.parse(buffer);
      onChunk(parsed);
    } catch (err) {
      console.warn("Failed to parse final buffer:", buffer);
    }
  }
};