# How I Met Your (Open|Claude)code

It was way back in early 2025. Before the AI CLI, I had this whole other life.

I was just starting to make it as an AI Engineer. I was building ~~complex~~ agentic prototypes using Python, LlamaIndex, and Gradio. I was wiring up the Vercel AI SDK and spending my nights debugging API calls. My life was good.

And then... Opencode went and screwed the whole thing up.

What hooked me about tools like OpenCode and Claude Code wasn't their ability to write code.

## Demo: Visual Refactoring

[Video](https://github.com/user-attachments/assets/8afa6e6c-bec8-4b27-b2b1-5a610026da6b)

## The Workflow

At its core, a lot of modern AI interaction boils down to two components: **Selection** and **Chat**.

This setup allows me to prototype that experience immediately. By scripting a simple selection mechanism in the browser and pasting the result into OpenCode, I can instantly test any idea.

## Implementation

[Selection code](./client/selection.client.ts)

https://github.com/istarkov/ai-cli-edit/blob/main/client/prompt.client.ts#L1-L9

[AAA](https://github.com/istarkov/ai-cli-edit/blob/main/client/prompt.client.ts#L1-L9)

```shell
bun run --hot ./index.html
```
