import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { MouseSelectionRef, SelectionBox } from '../../utils/types';

export interface MouseSelectionProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * This is a component responsible for displaying mouse selection box
 */
const MouseSelection = forwardRef(({ style = {}, ...props }: MouseSelectionProps, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectionBox, setSelectionBox] = useState<null | SelectionBox>(null);

  useImperativeHandle(
    ref,
    (): MouseSelectionRef => ({
      getBoundingClientRect: () => containerRef.current?.getBoundingClientRect(),
      getParentBoundingClientRect: () => containerRef?.current?.parentElement?.getBoundingClientRect(),
      drawSelectionBox: setSelectionBox,
      clearSelectionBox: () => setSelectionBox(null),
    }),
  );

  return (
    <div ref={containerRef}>
      {!!selectionBox &&
        !!containerRef.current &&
        ReactDOM.createPortal(
          <div
            {...props}
            style={{
              border: '1px solid #4C85D8',
              background: 'rgba(155, 193, 239, 0.4)',
              position: `absolute`,
              zIndex: 99,
              pointerEvents: 'none',
              ...style,
              ...(selectionBox || {}),
            }}
          />,
          containerRef.current,
        )}
    </div>
  );
});

MouseSelection.displayName = 'MouseSelection';

export default MouseSelection;
