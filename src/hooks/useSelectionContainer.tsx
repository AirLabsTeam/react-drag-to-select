import React, { ReactElement, useCallback, useRef } from 'react';
import MouseSelection, { MouseSelectionProps } from '../components/SelectionContainer';
import { MouseSelectionRef } from '../utils/types';
import { useSelectionLogic, UseSelectionLogicParams } from './useSelectionLogic';

export interface UseSelectionContainerResult {
  /**
   * method to cancel current selecting
   */
  cancelCurrentSelection: ReturnType<typeof useSelectionLogic>['cancelCurrentSelection'];
  /**
   * ReactNode which displays mouse selection. It should be rendered at the top of container of elements we want to select
   */
  DragSelection: () => ReactElement;
}

export interface UseSelectionContainerParams<T extends HTMLElement>
  extends Pick<
    UseSelectionLogicParams<T>,
    'onSelectionChange' | 'onSelectionEnd' | 'onSelectionStart' | 'isEnabled' | 'eventsElement'
  > {
  /** These are props that get passed to the selection box component (where styling gets passed in) */
  selectionProps?: MouseSelectionProps;
}

/**
 * Use this hook to enable mouse selection on a container.
 * To prevent interfering with drag-n-drop feature, add data-draggable='true' to draggable item. Selection won't fire when click happens on that element
 */
export function useSelectionContainer<T extends HTMLElement>({
  onSelectionChange,
  onSelectionEnd,
  onSelectionStart,
  isEnabled = true,
  selectionProps = {},
  eventsElement,
}: UseSelectionContainerParams<T>): UseSelectionContainerResult {
  const containerRef = useRef<MouseSelectionRef>(null);

  const { cancelCurrentSelection } = useSelectionLogic({
    containerRef,
    onSelectionEnd,
    onSelectionStart,
    onSelectionChange,
    isEnabled,
    eventsElement,
  });

  const DragSelection = useCallback(() => <MouseSelection ref={containerRef} {...selectionProps} />, []);

  return {
    cancelCurrentSelection,
    DragSelection,
  };
}
