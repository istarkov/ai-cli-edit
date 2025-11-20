export const PROMPT = `
The list above describes changes to existing content.  
Each change specifies the context where it should be applied.

- First, read all changes, think about their interactions, and outline a brief plan.
- Apply each change in its given context, following your plan.
- Preserve the existing design and layout unless explicitly told otherwise.
- If filename is empty then assume index.html or try to find the file based on context information.
`;
