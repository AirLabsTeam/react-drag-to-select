import React from 'react';
import { useSelectionContainer } from 'react-drag-to-select';
import { UseSelectionContainerParams } from 'react-drag-to-select/dist/hooks/useSelectionContainer';

export interface MouseSelectionProps extends Pick<UseSelectionContainerParams<HTMLElement>, 'onSelectionChange'> {}

const MouseSelection = ({ onSelectionChange }: MouseSelectionProps) => {
  const { DragSelection } = useSelectionContainer({
    eventsElement: document.getElementById('root'),
    onSelectionChange,
    onSelectionStart: () => {
      console.log('OnSelectionStart');
    },
    onSelectionEnd: () => console.log('OnSelectionEnd'),
    selectionProps: {
      style: {
        border: '2px dashed purple',
        borderRadius: 4,
        backgroundColor: 'brown',
        opacity: 0.5,
      },
    },
  });

  return <DragSelection />;
};

export default React.memo(MouseSelection);
