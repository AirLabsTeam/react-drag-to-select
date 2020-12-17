import { Box, Point } from './types';

export const boxesIntersect = (boxA: Box, boxB: Box) =>
  boxA.left <= boxB.left + boxB.width &&
  boxA.left + boxA.width >= boxB.left &&
  boxA.top <= boxB.top + boxB.height &&
  boxA.top + boxA.height >= boxB.top;

export const calculateSelectionBox = ({ startPoint, endPoint }: { startPoint: Point; endPoint: Point }) => ({
  left: Math.min(startPoint.x, endPoint.x),
  top: Math.min(startPoint.y, endPoint.y),
  width: Math.abs(startPoint.x - endPoint.x),
  height: Math.abs(startPoint.y - endPoint.y),
});

export const calculateBoxArea = (box: Box) => box.width * box.height;
