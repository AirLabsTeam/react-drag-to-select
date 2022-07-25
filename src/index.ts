import { MouseSelectionProps } from './components/SelectionContainer';
import { useSelectionContainer } from './hooks/useSelectionContainer';
import { boxesIntersect } from './utils/boxes';
import {
  Point,
  Box,
  SelectionBox,
  OnSelectionChange,
  MouseSelectionRef
} from './utils/types';
import { isElementDraggable, isSelectionDisabled } from './utils/utils';

export type {
  Point,
  Box,
  SelectionBox,
  OnSelectionChange,
  MouseSelectionRef,
  MouseSelectionProps
};

export {
  useSelectionContainer,
  boxesIntersect,
  isElementDraggable,
  isSelectionDisabled
};
