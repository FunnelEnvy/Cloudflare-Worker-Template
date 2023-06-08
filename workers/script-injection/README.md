# Script Injection

Example using [Cloudflare HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter) to intercept a request and add 3rd party code and styling onto a webpage.

## JavaScript Injection
```js
.on("head", {
    element(el) {
        el.append(`
            <script
                type="text/javascript"
                src="https://unpkg.com/ag-grid-community@26.2.1/dist/ag-grid-community.min.js"
            ></script>
        `, { html: true });
    }
})
```
Adds JavaScript files into the head of a webpage.

## CSS Style Injection
```js
.on("head", {
    element(el) {
        el.append(`
            <link
                rel="stylesheet"
                type="text/css"
                href="https://unpkg.com/ag-grid-community/dist/styles/ag-grid.css"
            >
        `, { html: true });
    }
})
```
Adds CSS style files into the head of a webpage.

## Future State

This worker could also have code added to control any flickering that the scripts and styles may be responsible for when they are loaded onto the website.
