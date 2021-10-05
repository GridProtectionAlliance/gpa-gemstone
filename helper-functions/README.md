# helper-functions

![gemstone logo](https://raw.githubusercontent.com/gemstone/web/master/docs/img/gemstone-wide-600.png)

The Gemstone Web Library organizes all Gemstone functionality related to web.

[![GitHub license](https://img.shields.io/github/license/gemstone/web?color=4CC61E)](https://github.com/gemstone/web/blob/master/LICENSE)

This library includes helpful npm package component for various helper functions such as generating information about a given html element, checking if a value is a number or an integer, or generating a random color.

## Usage

```typescript

# returns Unique GUID
CreateGuid();

# returns Text height
GetTextHeight(font: string, fontSize: string, word: string);

# returns Text width
GetTextWidth(font: string, fontSize: string, word: string);

# returns Node size
GetNodeSize(node: HTMLElement | null);

# returns True if int and false otherwise
IsInteger(value: any);

# returns True if number and false otherwise
IsNumber(value: any);

# returns random color
RandomColor();