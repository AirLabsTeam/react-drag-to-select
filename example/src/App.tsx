import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, boxesIntersect, useSelectionContainer } from '@air/react-drag-to-select';

const App = () => {
  const [selectionBox, setSelectionBox] = useState<Box>();
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const selectableItems = useRef<Box[]>([]);
  const elementsContainerRef = useRef<HTMLDivElement | null>(null);

  const onSelectionChange = useCallback(
    (box: Box) => {
      setSelectionBox(box);
      const indexesToSelect: number[] = [];
      selectableItems.current.forEach((item, index) => {
        if (boxesIntersect(box, item)) {
          indexesToSelect.push(index);
        }
      });

      setSelectedIndexes(indexesToSelect);
    },
    [selectableItems],
  );

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

  useEffect(() => {
  
    if (elementsContainerRef.current) {
      Array.from(elementsContainerRef.current.children).forEach((item) => {
        const { left, top, width, height } = item.getBoundingClientRect();
        selectableItems.current.push({
          left,
          top,
          width,
          height,
        });
      });
    }
  }, []);

  
  return (
    <div className="container">
      <DragSelection />
      <div id="elements-container" className="elements-container" ref={elementsContainerRef}>
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} className={`element ${selectedIndexes.includes(i) ? 'selected' : ''} `} />
        ))}
      </div>

      <div className="selection-box-info">
        Selection Box:
        <div>top: {selectionBox?.top || ''}</div>
        <div>left: {selectionBox?.left || ''}</div>
        <div>width: {selectionBox?.width || ''}</div>
        <div>height: {selectionBox?.height || ''}</div>
      </div>
    </div>
  );
};

export default App;
