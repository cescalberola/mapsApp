declare namespace bootstrap {
  class Modal {
    constructor(element: Element, options?: any);
    show(): void;
    hide(): void;
    static getInstance(element: Element): Modal | null;
  }
}
