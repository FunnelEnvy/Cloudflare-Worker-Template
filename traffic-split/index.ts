import { parse, serialize } from "cookie";

interface Env {
	TRAFFIC_SPLIT_PERCENTAGE: string;
	TRAFFIC_SPLIT_COOKIE: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		ctx.passThroughOnException();
		return handleRequest(request, env);
	}
}

const handleRequest = async (request: Request, env: Env): Promise<Response> => {
	const { origin, pathname, searchParams } = new URL(request.url);
	// get original response
	const original = await fetch(request);
	const newResponse = new Response(original.body, original);

	const cookie = parse(request.headers.get("cookie") ?? "");
	let variant;

	// if cookie already exists on request, guest is already sorted
	if (!cookie[env.TRAFFIC_SPLIT_COOKIE]) {
		variant = cookie[env.TRAFFIC_SPLIT_COOKIE];
	} else { // otherwise sort guest into 'original' or 'new' flow
		variant = (Math.random() < parseFloat(env.TRAFFIC_SPLIT_PERCENTAGE)) ? "new" : "original";
		// set cookie on response; expires in one year
		const oneYear = new Date();
		oneYear.setFullYear(oneYear.getFullYear() + 1);
		newResponse.headers.set("Set-Cookie", serialize(env.TRAFFIC_SPLIT_COOKIE, variant, {
			domain: ".mywebsite.com",
			path: "/",
			expires: oneYear,
		}));
	}

	// if guest should not see the 'new' website, return now
	if (variant !== "new") return newResponse;

	// now handle sending the new webpage
	// this examples assumes the new designs have the same pathname but start with '/new-website'
	const newRequest = new Request(`${origin}${"/new-website" + pathname}${Array.from(searchParams).length > 0 ? "?" + searchParams.toString() : ""}`, request);
	const modifiedResponse = await fetch(newRequest);
	// check that the new design exists
	if (modifiedResponse.ok) {
		return new Response(modifiedResponse.body, newResponse);
	}
	// if the new design doesn't exist return the original response
	return newResponse;
}
