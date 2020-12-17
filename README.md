# react-drag-to-select

> A react library which adds drag to select to your app

[![NPM](https://img.shields.io/npm/v/react-drag-to-select.svg)](https://www.npmjs.com/package/react-drag-to-select) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-drag-to-select
```

## Usage

![Example](https://media.giphy.com/media/Kuo9GQn42WBhBUy3tC/source.gif)

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

This library will not select your items. You have to handle selection yourself in `onSelectionChange` method (see example).


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

## License

MIT © [Air](https://github.com/AirLabsTeam)
