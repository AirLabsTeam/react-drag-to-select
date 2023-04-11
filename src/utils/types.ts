export interface Point {
  x: number;
  y: number;
}

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface SelectionBox extends Box {}

export type OnSelectionChange = (box: SelectionBox) => void;

export interface SelectionContainerRef {
  drawSelectionBox: OnSelectionChange;
  clearSelectionBox: () => void;
  getBoundingClientRect: () => DOMRect | undefined;
  getParentBoundingClientRect: () => DOMRect | undefined;
  getParentScroll: () => {
    scrollTop: number | undefined;
    scrollLeft: number | undefined;
  };
}
