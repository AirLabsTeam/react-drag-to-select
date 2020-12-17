import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, boxesIntersect } from 'react-drag-to-select';
import MouseSelection from './MouseSelection';

const App = () => {
  const [selectionBox, setSelectionBox] = useState<Box>();
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const selectableItems = useRef<Box[]>([]);

  useEffect(() => {
    const elementsContainer = document.getElementById('elements-container');
    if (elementsContainer) {
      Array.from(elementsContainer.childNodes).forEach((item) => {
        //@ts-ignore
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
      <div id="elements-container" className="elements-container">
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} className={`element ${selectedIndexes.includes(i) ? 'selected' : ''} `} />
        ))}
      </div>

      <div className="selection-box-info">
        Selection Box:
        <div>right: {selectionBox?.top || ''}</div>
        <div>left: {selectionBox?.left || ''}</div>
        <div>width: {selectionBox?.width || ''}</div>
        <div>height: {selectionBox?.height || ''}</div>
      </div>
    </div>
  );
};

export default App;
