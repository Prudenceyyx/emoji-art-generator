# Emoji Art Generator
A tool that converts an image to grids of emoji. It supports:
* upload an image
* choose a resolution

### How
1. Upload an image and it gets pixelated.
2. For a given emoji text list, fetch the png for each and calculate its average color (transparent pixels are ignored).
3. For each pixel block in the image, find the emoji that best matches its color. Output the emoji with format.

### Inspiration
[Image2emoji](http://www.image2emoji.com/) by Neal Agarwal. Great color match, but not supporting customized resolution.

[Emoji Mosaic](http://ericandrewlewis.github.io/emoji-mosaic/) by ericandrewlewis. Great color match, but emojis do not appear in the grid.

[Image2Emoji ](https://github.com/Jackson-S/Image2Emoji) by Jackson-S. Haven't tried yet

### Libraries
[closePixelate.js](https://github.com/desandro/close-pixelate) for pixelating an image to a canvas

[chroma.js](https://github.com/gka/chroma.js) for color manipulation, including calculation of color distance and average 

[jQueryEmoji.js](https://github.com/rodrigopolo/jqueryemoji) for matching a emoji text to its png

[dat.gui](https://github.com/dataarts/dat.gui) for UI control


### Todo List
[] Samsung emoji png packages. Currently it uses apple emoji

[] Allow user-defined emoji portion for the mosaic. Currently the portion is pre-defined

[] Button for copy the text

[] Better UI
