import { RefObject, useCallback, useEffect, useRef } from 'react';
import { SelectionContainerRef, OnSelectionChange, Point, SelectionBox, Box } from '../utils/types';
import { calculateBoxArea, calculateSelectionBox } from '../utils/boxes';
import { isSelectionDisabled } from '../utils/utils';

export interface UseSelectionLogicResult {
  cancelCurrentSelection: () => void;
}

export interface UseSelectionLogicParams<T extends HTMLElement> {
  /** This callback will fire when the user starts selecting */
  onSelectionStart?: () => void;
  /** This callback will fire when the user finishes selecting */
  onSelectionEnd?: () => void;
  /** This callback will fire when the user's mouse changes position while selecting using requestAnimationFrame */
  onSelectionChange?: OnSelectionChange;
  /** This boolean enables selecting  */
  isEnabled?: boolean;
  /** This is an HTML element that the mouse events (mousedown, mouseup, mousemove) should be attached to. Defaults to the window */
  eventsElement?: Window | T | null;
  /** This is the ref of the parent of the selection box  */
  containerRef: RefObject<SelectionContainerRef>;
}

/**
 * This hook contains logic for selecting. It starts 'selection' on mousedown event and finishes it on mouseup event.
 * When mousemove event is detected and user is selecting, it calls onSelectionChange and containerRef.drawSelectionBox
 */
export function useSelectionLogic<T extends HTMLElement>({
  containerRef,
  onSelectionChange,
  onSelectionStart,
  onSelectionEnd,
  isEnabled = true,
  eventsElement = typeof window !== 'undefined' ? window : undefined,
}: UseSelectionLogicParams<T>): UseSelectionLogicResult {
  const startPoint = useRef<null | Point>(null);
  const endPoint = useRef<null | Point>(null);
  const isSelecting = useRef(false);

  // these are used in listeners attached to window events. They are used as refs to ensure we always use the latest version
  const currentSelectionChange = useRef(onSelectionChange);
  const currentSelectionStart = useRef(onSelectionStart);
  const currentSelectionEnd = useRef(onSelectionEnd);
  const onChangeRefId = useRef<number | undefined>();
  const isEnabledRef = useRef(isEnabled);

  currentSelectionChange.current = useCallback(
    (box: Box) => {
      onChangeRefId.current = onSelectionChange
        ? requestAnimationFrame(() => {
            onSelectionChange(box);
          })
        : undefined;
    },
    [onSelectionChange],
  );
  currentSelectionStart.current = onSelectionStart;
  currentSelectionEnd.current = onSelectionEnd;
  isEnabledRef.current = isEnabled;

  /**
   * Method to cancel selecting and reset internal data
   */
  const cancelCurrentSelection = useCallback(() => {
    startPoint.current = null;
    endPoint.current = null;
    isSelecting.current = false;
    containerRef.current?.clearSelectionBox();
    if (onChangeRefId.current) {
      cancelAnimationFrame(onChangeRefId.current);
    }
    if (currentSelectionEnd?.current) {
      currentSelectionEnd.current();
    }
  }, [containerRef]);

  /**
   * method to calculate point from event in context of the whole screen
   */
  const getPointFromEvent = useCallback(
    (event: MouseEvent, rect?: DOMRect): Point => {
      if (!rect) {
        rect = containerRef.current?.getParentBoundingClientRect();
      }

      return {
        x: event.clientX - (rect?.left || 0),
        y: event.clientY - (rect?.top || 0),
      };
    },
    [containerRef],
  );

  /**
   * Method called on mousemove event
   */
  const handleMouseMove = useCallback(
    (rect?: DOMRect) => {
      if (startPoint.current && endPoint.current) {
        if (!rect) {
          return;
        }
        const newSelectionBox = calculateSelectionBox({
          startPoint: startPoint.current,
          endPoint: endPoint.current,
        });

        // calculate box in context of container to compare with items' coordinates
        const boxInContainer: SelectionBox = {
          ...newSelectionBox,
          top: newSelectionBox.top + (rect?.top || 0),
          left: newSelectionBox.left + (rect?.left || 0),
        };

        // we detect move only after some small movement
        if (calculateBoxArea(newSelectionBox) > 10) {
          if (!isSelecting.current) {
            if (currentSelectionStart?.current) {
              currentSelectionStart.current();
            }
            isSelecting.current = true;
          }
          containerRef.current?.drawSelectionBox(newSelectionBox);
          currentSelectionChange.current?.(boxInContainer);
        } else if (isSelecting) {
          currentSelectionChange.current?.(boxInContainer);
        }
      } else {
        cancelCurrentSelection();
      }
    },
    [cancelCurrentSelection, containerRef],
  );

  const onMouseMove = useCallback(
    (e: Event) => {
      if (!startPoint.current) {
        return;
      }

      const rect = containerRef.current?.getParentBoundingClientRect();
      endPoint.current = getPointFromEvent(e as MouseEvent, rect);
      handleMouseMove(rect);
    },
    [handleMouseMove, getPointFromEvent, containerRef],
  );

  const onMouseUp = useCallback(
    (e: Event) => {
      // handle only left button click
      if ((e as MouseEvent).button === 0) {
        cancelCurrentSelection();
        document.body.style.removeProperty('userSelect');
        document.body.style.removeProperty('webkitUserSelect');

        eventsElement?.removeEventListener('mousemove', onMouseMove);
        window?.removeEventListener('mouseup', onMouseUp);
      }
    },
    [eventsElement, cancelCurrentSelection, onMouseMove],
  );

  const onMouseDown = useCallback(
    (e: Event) => {
      // handle only left button click
      if ((e as MouseEvent).button === 0 && isEnabledRef.current) {
        // if user clicked on element which is draggable (so it might be start of drag event), ignore it
        const isDisabled = isSelectionDisabled(e.target as HTMLElement);
        if (isDisabled) {
          return;
        }

        // disable text selection for all document
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        startPoint.current = getPointFromEvent(e as MouseEvent);

        eventsElement?.addEventListener('mousemove', onMouseMove);
        window?.addEventListener('mouseup', onMouseUp);
      }
    },
    [eventsElement, getPointFromEvent, onMouseMove, onMouseUp],
  );

  useEffect(() => {
    eventsElement?.addEventListener('mousedown', onMouseDown);

    return () => {
      eventsElement?.removeEventListener('mousedown', onMouseDown);
      eventsElement?.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [eventsElement, onMouseDown, onMouseMove, onMouseUp]);

  return {
    cancelCurrentSelection,
  };
}
