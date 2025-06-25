import React, { ReactElement, useCallback, useRef } from 'react';
import { SelectionContainer, SelectionContainerProps } from '../components/SelectionContainer';
import { SelectionContainerRef } from '../utils/types';
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
    | 'onSelectionChange'
    | 'onSelectionEnd'
    | 'onSelectionStart'
    | 'transformOnMove'
    | 'isEnabled'
    | 'eventsElement'
    | 'shouldStartSelecting'
    | 'isValidSelectionStart'
  > {
  /** These are props that get passed to the selection box component (where styling gets passed in) */
  selectionProps?: SelectionContainerProps;
}

/**
 * Use this hook to enable mouse selection on a container.
 * To prevent interfering with drag-n-drop feature, add data-draggable='true' to draggable item. Selection won't fire when click happens on that element
 */
export function useSelectionContainer<T extends HTMLElement>(
  props?: UseSelectionContainerParams<T>,
): UseSelectionContainerResult {
  const {
    onSelectionChange,
    onSelectionEnd,
    onSelectionStart,
    transformOnMove,
    isEnabled = true,
    selectionProps = {},
    eventsElement,
    shouldStartSelecting,
    isValidSelectionStart,
  } = props || {};

  const containerRef = useRef<SelectionContainerRef>(null);

  const { cancelCurrentSelection } = useSelectionLogic({
    containerRef,
    onSelectionEnd,
    onSelectionStart,
    onSelectionChange,
    transformOnMove,
    isEnabled,
    eventsElement,
    shouldStartSelecting,
    isValidSelectionStart,
  });

  const DragSelection = useCallback(() => <SelectionContainer ref={containerRef} {...selectionProps} />, []);

  return {
    cancelCurrentSelection,
    DragSelection,
  };
}
