/**
 * Ctrl/Cmd + E to toggle selection mode. Move mouse to select elements on the page.
 * Alt + Up Arrow to go up the DOM tree.
 * Alt + Down Arrow to go back down.
 * Escape to copy the edit prompts for all edited elements to clipboard.
 */
import { createElementPatch } from './create.patch.client';
import { PROMPT } from './prompt.client';

const OVERLAY = '#selection-overlay';
const PROMPT_HOLDER_ATTR = 'data-prompt-holder';
const MARK_FOR_PROMPT_TEMPLATE = '[data-mark-for-prompt-template]';

let lastElementsUnderCursor: Element[] = [];
let currentSelection: HTMLElement = document.body;
const historyUp: HTMLElement[] = [];

const shallowEqualArrays = (a: readonly unknown[], b: readonly unknown[]): boolean =>
	a === b || (a.length === b.length && a.every((v, i) => Object.is(v, b[i])));

const hasSize = (el: Element): boolean => {
	const rect = el.getBoundingClientRect();
	return rect.width > 0 && rect.height > 0;
};

const placePromptMarks = (elt: HTMLElement) => {
	const template = document.querySelector(MARK_FOR_PROMPT_TEMPLATE)! as HTMLTemplateElement;
	return document
		.querySelectorAll<HTMLElement>(`[${PROMPT_HOLDER_ATTR}]`)
		.values()
		.map((promptElt, index) => {
			if (elt === promptElt) return () => {};
			const clone = template.content.cloneNode(true) as DocumentFragment;
			const markElt = clone.firstElementChild as HTMLElement;
			markElt.style.setProperty('position-anchor', `--mark-for-prompt-${index + 1}`);
			promptElt.style.setProperty('anchor-name', `--mark-for-prompt-${index + 1}`);
			const res = document.body.appendChild(markElt);
			return () => res.remove();
		});
};

const disposables = [] as Array<() => void>;
const selectElement = (elt: HTMLElement | null) => {
	disposables.forEach((dispose) => dispose());
	disposables.length = 0;
	if (elt == null) return;
	currentSelection = elt;
	document.querySelector<HTMLDivElement>(`${OVERLAY} div`)!.innerText = elt.tagName.toLowerCase();
	disposables.push(...placePromptMarks(elt));
	disposables.push(restoreTextareaValue(elt));
	disposables.push(showSelectionOverlay(elt));
};

const restoreTextareaValue = (element: HTMLElement) => {
	const textarea = document.querySelector<HTMLTextAreaElement>(`${OVERLAY} textarea`)!;
	textarea.value = element.getAttribute(PROMPT_HOLDER_ATTR) || '';
	textarea.focus();
	return () =>
		textarea.value.trim() === ''
			? element.removeAttribute(PROMPT_HOLDER_ATTR)
			: element.setAttribute(PROMPT_HOLDER_ATTR, textarea.value);
};

const showSelectionOverlay = (element: HTMLElement) => {
	element.style.setProperty('anchor-name', '--selection');
	element.setAttribute('data-selection', 'true');

	return () => {
		element.style.removeProperty('anchor-name');
		element.removeAttribute('data-selection');
	};
};

const handleMouseMove = (e: MouseEvent) => {
	const under = document.elementsFromPoint(e.clientX, e.clientY);
	if (shallowEqualArrays(under, lastElementsUnderCursor)) return;
	lastElementsUnderCursor = under;
	const elt = under.find((el) => !el.closest(OVERLAY) && hasSize(el));

	if (!(elt instanceof HTMLElement)) return;
	selectElement(elt);
	historyUp.length = 0;
};

let isEditMode = false;
const toggleEditMode = () => {
	if (isEditMode) {
		selectElement(null);
		document.removeEventListener('mousemove', handleMouseMove);
		isEditMode = false;
		return;
	}
	document.addEventListener('mousemove', handleMouseMove);
	selectElement(document.body);
	isEditMode = true;
};

document.addEventListener('mouseleave', (event) => {
	selectElement(null);
});

document.addEventListener('keydown', (e) => {
	if (e.code === 'KeyE' && (e.ctrlKey || e.metaKey)) {
		e.preventDefault();
		e.stopImmediatePropagation();
		toggleEditMode();
	} else if (
		e.code === 'ArrowUp' &&
		e.altKey &&
		currentSelection?.parentElement &&
		currentSelection?.parentElement.style.display !== 'contents'
	) {
		historyUp.push(currentSelection);
		selectElement(currentSelection.parentElement);
		e.preventDefault();
	} else if (e.code === 'ArrowDown' && e.altKey && historyUp.length > 0) {
		selectElement(historyUp.pop()!);
		e.preventDefault();
	} else if (e.code === 'Escape') {
		selectElement(null);
		let prompt = '';
		for (const cmd of document.querySelectorAll(`[${PROMPT_HOLDER_ATTR}]`)) {
			const editPrompt = cmd.getAttribute(PROMPT_HOLDER_ATTR) ?? '';
			cmd.removeAttribute(PROMPT_HOLDER_ATTR);
			prompt = `${prompt}
<edit>\nprompt: ${editPrompt}\nwhere:${createElementPatch(cmd as HTMLElement)}\n</edit>`;
		}
		prompt = `${prompt}${PROMPT}`;
		navigator.clipboard.writeText(prompt.trim()).then(() => {
			const toast = document.getElementById('selection-copied-toast');
			if (toast) {
				toast.setAttribute('data-open', 'true');
				setTimeout(() => {
					toast.removeAttribute('data-open');
				}, 3000);
			}
		});
	}
});
