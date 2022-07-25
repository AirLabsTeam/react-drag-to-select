import {
  boxesIntersect,
  calculateBoxArea
} from 'react-drag-and-select/utils/boxes';

describe('boxes utils', () => {
  describe('boxesIntersect', () => {
    it('should return true if boxes overlap', () => {
      expect(
        boxesIntersect(
          {
            left: 0,
            top: 0,
            width: 3,
            height: 3
          },
          {
            left: 2,
            top: 2,
            width: 3,
            height: 3
          }
        )
      ).toBe(true);

      expect(
        boxesIntersect(
          {
            left: 0,
            top: 2,
            width: 3,
            height: 3
          },
          {
            left: 2,
            top: 0,
            width: 3,
            height: 3
          }
        )
      ).toBe(true);

      expect(
        boxesIntersect(
          {
            left: 2,
            top: 2,
            width: 3,
            height: 3
          },
          {
            left: 0,
            top: 0,
            width: 3,
            height: 3
          }
        )
      ).toBe(true);

      expect(
        boxesIntersect(
          {
            left: 2,
            top: 0,
            width: 3,
            height: 3
          },
          {
            left: 0,
            top: 2,
            width: 3,
            height: 3
          }
        )
      ).toBe(true);

      expect(
        boxesIntersect(
          {
            left: 2,
            top: 2,
            width: 3,
            height: 3
          },
          {
            left: 1,
            top: 1,
            width: 6,
            height: 3
          }
        )
      ).toBe(true);

      expect(
        boxesIntersect(
          {
            left: 1,
            top: 0,
            width: 4,
            height: 4
          },
          {
            left: 3,
            top: 1,
            width: 1,
            height: 1
          }
        )
      ).toBe(true);

      expect(
        boxesIntersect(
          {
            left: 3,
            top: 1,
            width: 1,
            height: 1
          },
          {
            left: 1,
            top: 0,
            width: 4,
            height: 4
          }
        )
      ).toBe(true);
    });

    it('should return false if boxes do not overlap', () => {
      expect(
        boxesIntersect(
          {
            left: 0,
            top: 0,
            width: 20,
            height: 20
          },
          {
            left: 30,
            top: 0,
            width: 20,
            height: 20
          }
        )
      ).toBe(false);
    });
  });

  describe('calculateBoxArea', () => {
    it('should calculate correct box area', () => {
      const area = calculateBoxArea({
        left: 2,
        top: 3,
        height: 4,
        width: 5
      });

      expect(area).toBe(20);
    });
  });
});
