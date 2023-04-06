export default {
	async fetch(request: Request, _env: {}, ctx: ExecutionContext) {
		ctx.passThroughOnException();
		return handleRequest(request);
	}
}

const handleRequest = async (request: Request): Promise<Response> => {
	const { pathname } = new URL(request.url);
	const response = await fetch(request);

	// check for the base project route (this could be any or all routes on the website)
	if (pathname === "" || pathname === "/") {
		return new HTMLRewriter()
			// target the head of the page
			.on("head", {
				element(el) {
					// append a javascript file to the head from a CDN
					// I'm using a CDN as a simple example but this could also be custom code or a file saved to an S3 bucket
					el.append(`
						<script
							type="text/javascript"
							src="https://unpkg.com/ag-grid-community@26.2.1/dist/ag-grid-community.min.js"
						></script>
					`, { html: true });
					// append a stylesheet to the head from a CDN
					el.append(`
						<link
							rel="stylesheet"
							type="text/css"
							href="https://unpkg.com/ag-grid-community/dist/styles/ag-grid.css"	
						>
					`, { html: true });
				}
			})
			.transform(response);
	}

	return response;
}
