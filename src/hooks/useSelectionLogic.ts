import { RefObject, useCallback, useEffect, useRef } from 'react';
import throttle from 'lodash.throttle';
import { MouseSelectionRef, Point, SelectionBox } from '../utils/types';
import { calculateBoxArea, calculateSelectionBox } from '../utils/boxes';
import { isElementDraggable } from '../utils/utils';
import { UseSelectionContainerParams } from './useSelectionContainer';

interface UseSelectionLogicResult {
  cancelCurrentSelection: () => void;
}

interface UseSelectionLogicParams<T extends HTMLElement>
  extends Pick<
    UseSelectionContainerParams<T>,
    'onSelectionChange' | 'onSelectionEnd' | 'onSelectionStart' | 'isEnabled' | 'eventsElement'
  > {
  containerRef: RefObject<MouseSelectionRef>;
}

/**
 * This hook contains logic for selecting. It starts 'selection' on mousedown event and finishes it on mouseup event.
 * When mousemove event is detected and user is selecting, it calls onSelectionChange and containerRef.drawSelectionBox
 * @param containerRef reference to a component which displays selection
 * @param onSelectionEnd method to call when selection ends
 * @param onSelectionStart method to call when selection starts
 * @param onSelectionChange method to call when selection box is changed. This method is throttled with 150ms
 * @param enabled if false, mousedown event is not attached
 * @param eventsElement element which should listen to mouse events
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
  const isEnabledRef = useRef(isEnabled);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  currentSelectionChange.current = useCallback(throttle(onSelectionChange, 150), [onSelectionChange]);
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
    // @ts-ignore - cancel comes from throttle
    currentSelectionChange.current?.cancel();
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
          currentSelectionChange.current(boxInContainer);
        } else if (isSelecting) {
          currentSelectionChange.current(boxInContainer);
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
        const isDraggable = isElementDraggable(e.target as HTMLElement);
        if (isDraggable) {
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
