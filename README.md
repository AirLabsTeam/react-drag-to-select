# react-drag-to-select

> A highly-perfomant (go ahead, test with 6x slowdown!) react library which adds drag to select to your app

[![NPM](https://img.shields.io/npm/v/react-drag-to-select.svg)](https://www.npmjs.com/package/react-drag-to-select) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @air/react-drag-to-select react-style-object-to-css
```
## Usage

![Example](example/assets/chrome-capture.gif)

Check out this codesandbox for a complete working example: https://codesandbox.io/s/billowing-lake-rzhid4

```tsx

const App = () => {

  const handleSelectionChange = useCallback((box: Box) => {
    console.log(box);
  },[])

  const { DragSelection } = useSelectionContainer({
    onSelectionChange,
  });

  return (
    <div id='root'>
      <DragSelection/>
      <div>Selectable element</div>
    </div>
  )
}

```

1. Add `useSelectionContainer` hook to your component and pass `onSelectionChange` handler
2. Render `<DragSelection/>` somewhere in code
3. That's it! Mouse selection will appear, when you click and drag within window or element passed in `eventsElement`.

This library will not select your items. You have to handle selection yourself in `onSelectionChange` method (see example). You can use `boxesIntersects(boxA, boxB)` method to check if element intersetcs with selection.


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
```
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

Because we use the mouse position so heavily, if your `<DragSelection />` is inside of an area that scrolls (and honestly, what scenario would that not happen in?), you need to handle the logic on your side to make this work. The reason why we force you to do this, instead of building it into the library is because it would force our library to be overly complex (and most likely not work right anyway). 

If the `<DragSelection />` is inside of a scroll container, the library can't inherently know which parent it's scrolled inside of nor it's position inside of the parent (if there are other sibling elements above it). How this is solved on your end will be modifiying the `left` (for horizontal scrolling) and `top` (for vertical scrolling) by adding the scroll offset of the parent to the the `box: Box` that is used in `handleSelectionChange`. 

See the [`onSelectionChange` in the example](https://github.com/AirLabsTeam/react-drag-to-select/blob/main/example/src/App.tsx#L10) for an idea of how to do this.

## Used by

- [<img src="./example/assets/airLogo.png" width="50"/>](https://air.inc/home)

## License

MIT © [Air](https://github.com/AirLabsTeam)
