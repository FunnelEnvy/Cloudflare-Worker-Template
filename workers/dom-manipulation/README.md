# DOM Manipulation Cloudflare Worker

Example of direct webpage DOM manipulation made prior to delivering the response to the browser. The worker uses the [Cloudflare HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter) to search and edit the DOM.

## Changing Element Attributes
```js
.on("img", {
    element(e) {
        e.setAttribute('src', '');
    }
})
```
Searches for any image elements in the request and replaces the `src` attribute of the element.

## Changing Element Text

Changing element text using HTMLRewriter involves using the text buffer returned by the `text` function.

### Replace Element Text
```js
.on("a.navbar-brand", {
    text(text) {
        if (text.lastInTextNode) {
            text.replace("John Doe");
        } else {
            text.remove();
        }
    }
})
```
Example of replacing text only when it is the last text inside of the node, otherwise the text is removed.

### Global Find and Replace
```js
.on("*", {
    text(text) {
        buffer += text.text;
        if (text.lastInTextNode) {
            text.replace(buffer.replace(/pizza/gi, "taco"));
            buffer = '';
        } else {
            text.remove();
        }
    }
})
```
The text buffer supports regex matching.
