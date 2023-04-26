# DOM Manipulation Worker

This worker is an example of manipulating the DOM of a webpage before the end user views the webpage. The worker uses the Cloudflare class HTMLRewriter to search and edit the DOM.

## Changing Element Attributes
```js
.on("img", {
    element(e) {
        e.setAttribute('src', '');
    }
})
```
The code above searches the HTML returned from a request for any image elements and will replace the `src` attribute of the element.

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
This is an example of how to replace the text of an element. The text needs to be replaced only when it is the last text inside of the node, otherwise the text is removed.

### Global Find and Replacement
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
This is an example of global find and replace. The text buffer supports regex matching.
