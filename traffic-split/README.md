# Traffic Split

Example of A/B testing by serving different versions of a website. This Cloudflare Worker assigns website visitors into two groups based on a defined percentage (`TRAFFIC_SPLIT_PERCENTAGE`). The group assignment is saved using a cookie (`TRAFFIC_SPLIT_COOKIE`).

## Sort Visitors Into Groups
```js
let variant;
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
```
This code checks whether a website visitor has the cookie (already assigned to a group). If not, then will apply the traffic split percentage, assign the group, and set the cookie.

## Respond With Webpage

### If "Original" Variant
```js
const newResponse = new Response(original.body, original);

if (variant !== "new") return newResponse;
```

If the visitor is sorted into the old variant, pass-through the original request.

### If "New" Variant
```js
const newRequest = new Request(`${origin}${"/new-website" + pathname}${Array.from(searchParams).length > 0 ? "?" + searchParams.toString() : ""}`, request);
const modifiedResponse = await fetch(newRequest);
// check that the new design exists
if (modifiedResponse.ok) {
    return new Response(modifiedResponse.body, newResponse);
}
// if the new design doesn't exist return the original response
return newResponse;
```

Fetch the new website and return as response. Assumes the new webpages are located with the same route but have `/new-website` appended to the beginning. If the new route doesn't exist the code will default to returning the original request.
