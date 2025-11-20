const getSelector = (elt: Element): string => {
	const tag = elt.tagName.toLowerCase();
	const parent = elt.parentElement;
	if (!parent) return tag;

	const siblings = Array.from(parent.children).filter((e) => e.tagName === elt.tagName);
	const idx = siblings.indexOf(elt) + 1;
	return `${getSelector(parent)} > ${tag}:nth-of-type(${idx})`;
};

const getAncestorComments = (elt: HTMLElement): string[] => {
	const comments: string[] = [];
	const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT);
	let comment: Comment | null;
	while ((comment = walk.nextNode() as Comment | null)) {
		if (comment.nextElementSibling?.contains(elt) && comment.textContent?.trim()) {
			comments.push(comment.textContent?.trim());
		}
	}
	return comments.toReversed().slice(0, 2);
};

const sliceContent = (html: string, maxLen = 100): string => {
	const text = html.replace(/<[^>]*>/g, '');
	return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
};

export const createElementPatch = (elt: HTMLElement) => {
	const file = elt.__svelte_meta?.loc?.file || window.location.pathname;
	const line = elt.__svelte_meta?.loc?.line || 0;
	const selector = getSelector(elt);
	const id = elt.id || '';
	const context = getAncestorComments(elt);
	const snippet = `<${elt.tagName.toLowerCase()}${elt.id ? ` id="${elt.id}"` : ''}${elt.className ? ` class="${elt.className}"` : ''}>${sliceContent(elt.innerHTML)}</${elt.tagName.toLowerCase()}>`;

	return `<selection>
  - file: ${file}
  - selector: ${selector}
  - line: ${line}${
		id
			? `
  - id: ${id}`
			: ''
	}${
		context.length
			? `
  - ancestor_or_self_comments: ${context.join(', ')}`
			: ''
	}
  - snippet:
  \`\`\`html
  ${snippet}
  \`\`\`
</selection>`;
};
