declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  interface HTMLElement
    extends Element,
      ElementCSSInlineStyle,
      ElementContentEditable,
      GlobalEventHandlers,
      HTMLOrSVGElement {
    __svelte_meta: {
      loc: {
        file: string;
        line: number;
        column: number;
      };
    };
  }
}

export {};
