// Check if current element is in draggable parent
/**
 * @deprecated - use isSelectionDisabled
 * This method checks if current element is draggable - it's 'draggable' prop is true
 * It checks element itself and all its parent until draggable is true or element tagName is body or main
 * @param target
 */
export const isElementDraggable = (target: HTMLElement) => {
  let el = target;
  while (el.parentElement && el.tagName !== 'BODY' && el.tagName !== 'MAIN' && !el.dataset.draggable) {
    el = el.parentElement;
  }

  return el.dataset.draggable === 'true';
};

/**
 * This method checks if current element is draggable - it's 'draggable' prop is true
 * It checks element itself and all its parent until draggable is true or element tagName is body or main
 * @param target
 */
export const isSelectionDisabled = (target: HTMLElement) => {
  let el = target;
  while (
    el.parentElement &&
    el.tagName !== 'BODY' &&
    el.tagName !== 'MAIN' &&
    !el.dataset.draggable &&
    !el.dataset.disableselect
  ) {
    el = el.parentElement;
  }

  return el.dataset.draggable === 'true' || el.dataset.disableselect === 'true';
};
