import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Box, boxesIntersect, useSelectionContainer } from '@air/react-drag-to-select';

function App() {
  const [selectionBox, setSelectionBox] = useState<Box>();
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const selectableItems = useRef<Box[]>([]);
  const elementsContainerRef = useRef<HTMLDivElement | null>(null);

  const { DragSelection } = useSelectionContainer({
    eventsElement: document.getElementById('root'),
    onSelectionChange: (box) => {
      /**
       * Here we make sure to adjust the box's left and top with the scroll position of the window
       * @see https://github.com/AirLabsTeam/react-drag-to-select/#scrolling
       */
      const scrollAwareBox = {
        ...box,
        top: box.top + window.scrollY,
        left: box.left + window.scrollX,
      };

      setSelectionBox(scrollAwareBox);
      const indexesToSelect: number[] = [];
      selectableItems.current.forEach((item, index) => {
        if (boxesIntersect(scrollAwareBox, item)) {
          indexesToSelect.push(index);
        }
      });

      setSelectedIndexes(indexesToSelect);
    },
    onSelectionStart: () => {},
    onSelectionEnd: () => {},
    selectionProps: {
      style: {
        border: '2px dashed purple',
        borderRadius: 4,
        backgroundColor: 'brown',
        opacity: 0.5,
      },
    },
    shouldStartSelecting: (target) => {
      // do something with target to determine if the user should start selecting

      return true;
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
          <div
            data-testid={`grid-cell-${i}`}
            key={i}
            className={`element ${selectedIndexes.includes(i) ? 'selected' : ''} `}
          />
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
}

export default App;
