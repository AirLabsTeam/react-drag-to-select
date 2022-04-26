import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, boxesIntersect } from '@air/react-drag-to-select';
import MouseSelection from './MouseSelection';

const App = () => {
  const [selectionBox, setSelectionBox] = useState<Box>();
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const selectableItems = useRef<Box[]>([]);
  const elementsContainerRef = useRef<HTMLDivElement | null>(null);

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

  const handleSelectionChange = useCallback(
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

  return (
    <div className="container">
      <MouseSelection onSelectionChange={handleSelectionChange} />
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
