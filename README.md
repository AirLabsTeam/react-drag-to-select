<p align="center">
  <img style="width: 800px" src="https://user-images.githubusercontent.com/1065539/184370954-6398b161-25f5-455c-9dcb-197588b40057.gif" />
</p>

<h1 align="center">React drag-to-select</h1>
<p align="center"><i>A highly-performant React library which adds drag-to-select to your app.</i></p>

<p align="center">
  <a href="https://www.npmjs.com/package/@air/react-drag-to-select">
    <img src="https://img.shields.io/npm/v/@air/react-drag-to-select?color=2E77FF" alt="size" />
  </a>
  <img alt="e2e" src="https://github.com/AirLabsTeam/react-drag-to-select/actions/workflows/e2e-tests.yml/badge.svg" />
  <img alt="unit" src="https://github.com/AirLabsTeam/react-drag-to-select/actions/workflows/unit-tests.yml/badge.svg" />  
  <img alt="size" src="https://img.shields.io/bundlephobia/min/@air/react-drag-to-select" />
</p>

## ✨ Features <a name="features"></a>

- Near 60 fps in 6x CPU slowdown on 2.3 GHz Quad-Core Intel Core i7
- Simple API. It doesn't actually select items; just draws the selection box and passes you coordinates so you can determine that (we provided a utility to help though)
- Fully built in TypeScript
- Unit and e2e tested
- Actively battle-tested in a [production-scale application](https://air.inc)

## Install

```bash
npm install --save @air/react-drag-to-select
```
```bash
yarn add @air/react-drag-to-select
```

## Usage

```tsx
import { useSelectionContainer } from '@air/react-drag-to-select'

const App = () => {
  const { DragSelection } = useSelectionContainer();

  return (
    <div>
      <DragSelection/>
      <div>Selectable element</div>
    </div>
  )
}

```

Check out this codesandbox for a complete working example: https://codesandbox.io/s/billowing-lake-rzhid4

## useSelectionContainer arguments

|Name|Required|Type|Default|Description|
|----|--------|----|-------|-----------|
|`onSelectionStart`|No|`() => void`||Method called when selection starts (mouse is down and moved)|
|`onSelectionEnd`|No|`() => void`||Method called when selection ends (mouse is up)
|`onSelectionChange`|Yes|`(box: Box) => void`||Method called when selection moves|
|`transformOnMove`|No|`(box: Box) => void`||Method is called on selection move and allows to transform current selection e.g. to snap it to a grid|
|`isEnabled`|No|`boolean`|`true`|If false, selection does not fire|
|`eventsElement`|No|`Window`, `HTMLElement` or `null`|`window`|Element to listen mouse events|
|`selectionProps`|No|`React.HTMLAttributes`||Props of selection - you can pass style here as shown below|
|`shouldStartSelecting`|No|`() => boolean`|`undefined`|If supplied, this callback is fired on mousedown and can be used to prevent selection from starting. This is useful when you want to prevent certain areas of your application from being able to be selected. Returning true will enable selection and returning false will prevent selection from starting.|

## Selection styling

To style the selection box, pass `selectionProps: { style }` prop:

```tsx
  const { DragSelection } = useSelectionContainer({
    ...,
    selectionProps: {
      style: {
        border: '2px dashed purple',
        borderRadius: 4,
        backgroundColor: 'brown',
        opacity: 0.5,
      },
    },
  });
```

The default style for the selection box is
```ts
{
  border: '1px solid #4C85D8',
  background: 'rgba(155, 193, 239, 0.4)',
  position: `absolute`,
  zIndex: 99,
}
```

## Disabling selecting in certain areas

<p align="center">
  <img style='width: 400px' src="example/assets/disable-select-example.gif">
</p>

Sometimes you want to disable a user being able to start selecting in a certain area. You can use the `shouldStartSelecting` prop for this.

```tsx
const { DragSelection } = useSelectionContainer({
  shouldStartSelecting: (target) => {
    /**
     * In this example, we're preventing users from selecting in elements
     * that have a data-disableselect attribute on them or one of their parents
     */
    if (target instanceof HTMLElement) {
      let el = target;
      while (el.parentElement && !el.dataset.disableselect) {
        el = el.parentElement;
      }
      return el.dataset.disableselect !== "true";
    }

    /**
    * If the target doesn't exist, return false
    * This would most likely not happen. It's really a TS safety check
    */
    return false;
  }
});
```

See full example here: https://codesandbox.io/s/exciting-rubin-xxf6r0

## Scrolling

Because we use the mouse position to calculate the selection box's coordinates, if your `<DragSelection />` is inside of an area that scrolls, you'll need to make some adjustments on your end. Our library can't inherently know which parent is being scrolled nor of it's position inside of the scrolling parent (if there are other sibling elements above it).

How this is solved on your end is modifiying the `left` (for horizontal scrolling) and `top` (for vertical scrolling) of the `selectionBox` that is passed to `handleSelectionChange`. See the [`onSelectionChange` in the example](https://github.com/AirLabsTeam/react-drag-to-select/blob/main/example/src/App.tsx#L20) for an idea of how to do this.

<img src="https://img.shields.io/npm/l/@air/react-drag-to-select?color=41C300" alt="MIT License" />
