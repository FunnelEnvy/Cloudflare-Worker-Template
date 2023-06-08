export default {
	async fetch(request: Request, _env: {}, ctx: ExecutionContext) {
		ctx.passThroughOnException();
		return handleRequest(request);
	}
}

const handleRequest = async (request: Request): Promise<Response> => {
	const response = await fetch(request);
	let buffer = "";
	return new HTMLRewriter()
		// example changing the source of all images on a page
		.on("img", {
			element(e) {
				e.setAttribute('src', '');
			}
		})
		// example of overwritting an element with more specificity	
		.on("a.navbar-brand", {
			text(text) {
				if (text.lastInTextNode) {
					text.replace("John Doe");
				} else {
					text.remove();
				}
			}
		})
		// example of global text replacement
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
		.transform(response);
}
