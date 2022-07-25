import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import ReactDOM from 'react-dom';
import { MouseSelectionRef, SelectionBox } from '../../utils/types';
// @ts-ignore
import styleObjectToCSS from 'react-style-object-to-css';

export interface MouseSelectionProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * This is a component responsible for displaying mouse selection box
 */
export const MouseSelection = forwardRef(
  ({ style = {}, ...props }: MouseSelectionProps, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const selectionBoxRef = useRef<HTMLDivElement>(null);
    const [, setForceUpdate] = useState(0);

    useImperativeHandle(
      ref,
      (): MouseSelectionRef => ({
        getBoundingClientRect: () =>
          containerRef.current?.getBoundingClientRect(),
        getParentBoundingClientRect: () =>
          containerRef?.current?.parentElement?.getBoundingClientRect(),
        drawSelectionBox: (box: SelectionBox) => {
          requestAnimationFrame(() => {
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
                height: box.height
              };

              selectionBoxRef.current.style.cssText = styleObjectToCSS(styles);
            }
          });
        },
        clearSelectionBox: () => {
          requestAnimationFrame(() => {
            if (selectionBoxRef.current) {
              const styles: React.CSSProperties = {
                top: 0,
                left: 0,
                width: 0,
                height: 0
              };

              selectionBoxRef.current.style.cssText = styleObjectToCSS(styles);
            }
          });
        }
      })
    );

    useEffect(() => {
      setForceUpdate((number) => number + 1);
    }, []);

    return (
      <div ref={containerRef}>
        {containerRef.current
          ? ReactDOM.createPortal(
              <div ref={selectionBoxRef} {...props} />,
              containerRef.current
            )
          : null}
      </div>
    );
  }
);
