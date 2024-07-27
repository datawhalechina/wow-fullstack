/// <reference types="./types" />
declare class WYSIWYG {
    element: HTMLPreElement;
    popover: HTMLDivElement;
    selectPopover: HTMLDivElement;
    afterRenderTimeoutId: number;
    hlToolbarTimeoutId: number;
    preventInput: boolean;
    composingLock: boolean;
    commentIds: string[];
    constructor(vditor: IVditor);
    getComments(vditor: IVditor, getData?: boolean): ICommentsData[];
    triggerRemoveComment(vditor: IVditor): void;
    showComment(): void;
    hideComment(): void;
    private copy;
    private bindEvent;
}
export { WYSIWYG };
