# How I Met Your AI CLI

It was way back in early 2025. Before the AI CLI, I had this whole other life.

I was just starting to make it as an AI Engineer. I was building ~~complex~~ agentic prototypes using Python, LlamaIndex, and Gradio. I was wiring up the Vercel AI SDK and spending my nights debugging API calls. My life was good.

And then... Open and Claude code went and screwed the whole thing up.

## Demo: Visual Refactoring

[Video](https://github.com/user-attachments/assets/8afa6e6c-bec8-4b27-b2b1-5a610026da6b)

## The Workflow

At its core, a lot of modern AI interaction boils down to two components: **Selection** and **Chat**.

This setup allows me to prototype that experience immediately. By scripting a simple selection mechanism in the browser and pasting the result into OpenCode, Claude Code or any AI Code tool, I can instantly test any idea.

## Play Locally

To run this on your machine, you will need [Bun](https://bun.com/docs/installation) and any AI coding tool (OpenCode, Claude Code, VSCode Copilot, Cursor).

1.  Clone the repository.
2.  Run the development server:
    ```bash
    bun run --hot ./index.html
    ```
3.  Open the local URL in your browser.

**Controls:**

- **Ctrl/Cmd + E** - Toggle selection mode (move mouse to select elements).
- **Alt + ↑** - Go up the DOM tree.
- **Alt + ↓** - Go back down the DOM tree.
- **Escape** - Copy the edit prompts for all edited elements to clipboard.

Once copied, simply paste the result into your AI tool to apply the changes.

## Under the Hood

To understand the value here, we need to look at what is actually happening under the hood.

When you hit `Escape` in the browser, the [Selection script](./client/selection.client.ts) generates a structured clipboard payload like this:

```xml
<edit>
  prompt: Change color to red
  where:<selection>{context}</selection>
</edit>
...
{ADDITIONAL_PROMPT}
```

_You can play with the selection tool and see the output directly in your browser here: [https://istarkov.github.io/ai-cli-edit/](https://istarkov.github.io/ai-cli-edit/)_

High-end reasoning models can usually handle this raw structure without issues. However, faster or lightweight models often need the [{ADDITIONAL_PROMPT}](./client/prompt.client.ts) extra explanation, design rules, what tools to use, or specific formatting constraints to get it right.

You _could_ put all that information into `CLAUDE.md` or an `AGENTS.md` file as global system instructions. But those files are often already overflowing with generic "Do's and Don'ts."

Instead of adding to the noise, we can isolate these instructions.

## Specialized Agents

In OpenCode, this is handled via [Primary Agents](https://opencode.ai/docs/agents/#primary-agents).

Instead of polluting a global config, I can simply create a dedicated definition file at [./.opencode/agent/edit.md](./.opencode/agent/edit.md). This file becomes a self-contained persona where I can define:

- **System Instructions** - Specific rules for the task.
- **Model Parameters** - Temperature and specific model (e.g., using a cheaper model for simple tweaks).
- **Tools** - Telling the model exactly what tools to use in which situation.
- **Context** - Knowledge about the project, context for edits like strange names of all board members.

In the Claude ecosystem, this extensibility is achieved through [Skills](https://code.claude.com/docs/en/skills).

## Expectations vs Reality

Does this workflow work perfectly 100% of the time? No.

However, the combination of:

- Explicit Context (via the selection tool i.e. `<edit>` format)
- Specialized Agent Instructions (via the CLI config)
- Additional Prompting ({ADDITIONAL_PROMPT} injected via the script)

Can increase the success rate for the specific usecase.

And for the times it _does_ fail, the ability of modern AI CLIs to **Undo/Redo** any action is a must-have.

## Epilogue

**Specialized Agents** were not the reason Opencode went and screwed the whole thing up.

That is a story for the next episode.
