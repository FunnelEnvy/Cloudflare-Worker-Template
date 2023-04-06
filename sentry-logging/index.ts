import { Toucan } from "toucan-js";

interface Env {
	SENTRY_DSN: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		ctx.passThroughOnException();
		const sentry = new Toucan({
			dsn: env.SENTRY_DSN,
			request: request,
		});
		try {
			// ... do something
			return handleRequest(request);
		} catch(err) {
			sentry.captureException(err);
		}
	}
}

const handleRequest = async (request: Request): Promise<Response> => {
	console.log('request:', request);
	const response = await fetch(request);
	console.log('response:', response);
	return response;
}
