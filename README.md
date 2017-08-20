# react-hyper-responsive-table

A responsive container for displaying tables traditionally on wide screens and with headers prepended to each data cell on narrow screens.

## Installation

`npm install react-hyper-responsive-table`

## Example

```jsx
const headers = {
  image: '',
  name: 'Name',
  role: 'Role',
};

const rows = [
  {
    name: 'Marlon Brando',
    role: <a href="https://en.wikipedia.org/wiki/Vito_Corleone">Vito Corleone</a>,
    image: <img src="https://upload.wikimedia.org/wikipedia/en/2/21/Godfather15_flip.jpg" alt="Vito Corleone" />
  },
];

const keyGetter = row => row.name;

<ReactHyperResponsiveTable
  headers={headers}
  rows={rows}
  keyGetter={keyGetter}
  breakpoint={578}
  tableStyling={({ narrow }) => (narrow ? 'narrowtable' : 'widetable')}
/>
```

## Properties

Some properties have multiple types.
Properties marked with an asterisk (`*`) are required.

| Name   | Type    | Description |
|--------|---------|-------------|
| `headers` * | `object` | Object of strings or React elements to use as headers. Strings and elements can be used interchangeably. The keys of the object must correspond to the keys in the data objects. The order of the entries in the headers object determines display order. |
| `rows` * | `array` | Array of data objects. These data objects can also be strings or React elements. Keys of data objects that are not in `headers` are ignored. |
| `keyGetter` * | `function` | Function that should return a unique key when given a data object. |
| `breakpoint` * | `number` | Minimum viewport width in which the wide table is displayed. |
| | `string` | Media query that triggers the full width table. |
| `tableStyling` | `string` | Class name to apply to the parent table tag. |
| | `object` | CSS styles to apply to the parent table tag. |
| | `function` | Function returning one of the above. The function receives a state object with boolean property narrow indicating if the current presentation is narrow or wide. |
| `initialNarrow` | `bool` | Initially render the table in narrow mode when rendering serverside. Set to true when you expect the browser to be narrow to prevent rerendering client side. |


## name

The purpose of this package is identical to the package
[react-super-responsive-table](https://github.com/ua-oira/react-super-responsive-table).
The main difference is that the responsiveness of react-hyper-responsive-table
is based on javascript and not on CSS.
