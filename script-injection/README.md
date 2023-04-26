# Script Injection

This worker is an example of using HTMLRewriter to manipulate the DOM in order to inject 3rd party code and styling onto a webpage.

## Code Injection
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
This code will inject javascript files into the head of a webpage.

## Style Injection
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
This code will inject style files into the head of a webpage.

## Future State

This worker could also have code added to control any flickering that the scripts and styles may be responsible for when they are loaded onto the clients website.
