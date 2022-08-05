<p align="center">
  <img src="example/assets/example.gif">
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

- Tested thoroughly in 6x CPU slowdown for optimal performance
- Simple API. It doesn't actually select items; just draws the selection box and passes you coordinates so you can determine that (we provided a utility to help though)
- Fully built in TypeScript
- Unit and e2e tested
- Battle-tested in production-scale applications

## Install

```bash
npm install --save @air/react-drag-to-select
```
```bash
yarn add @air/react-drag-to-select
```

## Usage

Check out this codesandbox for a complete working example: https://codesandbox.io/s/billowing-lake-rzhid4

```tsx
import { useSelectionContainer } from '@air/react-drag-to-select'

const App = () => {
  const { DragSelection } = useSelectionContainer({
    onSelectionChange,
  });

  return (
    <div>
      <DragSelection/>
      <div>Selectable element</div>
    </div>
  )
}

```

1. Add `useSelectionContainer` hook to your component and pass `onSelectionChange` handler
2. Render `<DragSelection/>` somewhere in code
3. That's it! Mouse selection will appear, when you click and drag within window or element passed in `eventsElement`.

**NOTE**: This library will not select your items. You have to handle selection yourself in `onSelectionChange` method ([see example](https://codesandbox.io/s/billowing-lake-rzhid4)). You can use `boxesIntersects(boxA, boxB)` method to check if element intersetcs with selection.


## useSelectionContainer arguments

|Name|Required|Type|Default|Description|
|----|--------|----|-------|-----------|
|onSelectionStart|No|() => void||Method called when selection starts (mouse is down and moved)|
|onSelectionEnd|No|() => void||Method called when selection ends (mouse is up)
|onSelectionChange|Yes|(box: Box) => void||Method called when selection moves|
|isEnabled|No|boolean|true|If false, selection does not fire|
|eventsElement|No|Window, HTMLElement or null|window|Element to listen mouse events|
|selectionProps|No|React.HTMLAttributes||Props of selection - you can pass style here as shown below|

## Selection styling

To style your selection, pass `selectionProps: { style }` prop:

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

The default style is
```ts
{
  border: '1px solid #4C85D8',
  background: 'rgba(155, 193, 239, 0.4)',
  position: `absolute`,
  zIndex: 99,
}
```

## Disabling selection on elements

To prevent starting selection, add `data-disableSelect` to element:

```html
<div data-disableSelect=true>
...
</div>
```

## Scrolling

Because we use the mouse position to calculate the selection box's coordinates, if your `<DragSelection />` is inside of an area that scrolls, you'll need to make some adjustments on your end. Our library can't inherently know which parent is being scrolled nor of it's position inside of the scrolling parent (if there are other sibling elements above it).

How this is solved on your end is modifiying the `left` (for horizontal scrolling) and `top` (for vertical scrolling) of the `selectionBox` that is passed to `handleSelectionChange`. See the [`onSelectionChange` in the example](https://github.com/AirLabsTeam/react-drag-to-select/blob/main/example/src/App.tsx#L10) for an idea of how to do this.

## Used by

[<img src="./example/assets/air.png" height="25" width="50">]([http://google.com.au/](https://air.inc))

<img src="https://img.shields.io/npm/l/@air/react-drag-to-select?color=41C300" alt="MIT License">

