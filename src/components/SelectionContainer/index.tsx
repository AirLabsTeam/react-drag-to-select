import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import ReactDOM from 'react-dom';
import { MouseSelectionRef, SelectionBox } from '../../utils/types';

export interface MouseSelectionProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * This is a component responsible for displaying mouse selection box
 */
const MouseSelection = forwardRef(({ style = {}, ...props }: MouseSelectionProps, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectionBoxRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(
    ref,
    (): MouseSelectionRef => ({
      getBoundingClientRect: () => containerRef.current?.getBoundingClientRect(),
      getParentBoundingClientRect: () => containerRef?.current?.parentElement?.getBoundingClientRect(),
      drawSelectionBox: (box: SelectionBox) => {
        if (selectionBoxRef.current) {
          const styles: React.CSSProperties = {
            border: '1px solid #4C85D8',
            background: 'rgba(155, 193, 239, 0.4)',
            position: 'absolute',
            pointerEvents: 'none',
            ...style,
            top: box.top,
            left: box.left,
            width: box.width,
            height: box.height,
          };

          selectionBoxRef.current.style.cssText = `
            
          `;
        }
      },
      clearSelectionBox: () => {
        if (selectionBoxRef.current) {
          selectionBoxRef.current.style.cssText = `
            top: 0;
            left: 0;
            width: 0;
            height: 0;
          `;
        }
      },
    }),
  );

  return (
    <div ref={containerRef}>
      {typeof document !== 'undefined'
        ? ReactDOM.createPortal(<div ref={selectionBoxRef} {...props} />, containerRef.current || document.body)
        : null}
    </div>
  );
});

export default MouseSelection;
