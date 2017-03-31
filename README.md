# blurify

blurify.js is a tiny(~2kb) library to blurred pictures, support graceful downgrade from `css` mode to `canvas` mode.
I have add partial blur function to the origin repo. check [Demo](https://alex2wong.github.io/blurify/)

## Demo

[Demo](https://alex2wong.github.io/blurify/)

## Usage

### blurify(options)

blurify the images with given `options`:

- `image` { Element }, target image object to blurify.
- `blur` { Int }, extent of blur, defaulting to `6`.
- `mode` { String }, mode of blurify.
    - `css`: use `filter` property.
    - `canvas`: use `canvas` export base64. (`default`)
    - `auto`: use `css` mode firstly, otherwise switch to `canvas` mode by automatically.
- `ratio`: {Float}, ratio of image to blur, set 0.2 to blur top 20% and bottom 20%.
- `ele`: {Canvas}, canvas to render blured image.

```js

img = new Image();
img.src = "./test/4.jpg";
new blurify({
    image: img,
    ele: document.querySelector('#canv'),
    blur: 2,
    mode: 'auto',
    ratio: 0.3,
    blurStep: 1,
    blurOffset: 1
});
```

## Change log

#### v1.0.8
- fixed [#2](https://github.com/JustClear/blurify/issues/2)

#### v1.0.7
- fault-tolerance process
- set globalAlpha dynamicly based on blur radius

#### v1.0.6
- fixed `toArray` bugs

#### v1.0.5
- add `auto` mode

#### v1.0.4
- add `css` mode

#### v1.0.3
- fixed image cross origin issue

#### v1.0.2
- fixed images reference error
