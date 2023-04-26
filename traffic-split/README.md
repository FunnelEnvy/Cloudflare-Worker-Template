# Traffic Split

This worker is an example of traffic splitting a website. The worker funnels visitors into two groups based on a defined percentage (`TRAFFIC_SPLIT_PERCENTAGE`). Once sorted the visitors group is saved using a cookie (`TRAFFIC_SPLIT_COOKIE`).

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
        domain: ".springboard.com",
        path: "/",
        expires: oneYear,
    }));
}
```
This code determines the variant the visitor should see, either the new version of the website or the original / old version. If not already set the code will set a cookie on the response so the user stays in the same workflow they are already sorted into.

## Respond With Website

### If Orignial Variant
```js
const newResponse = new Response(original.body, original);

if (variant !== "new") return newResponse;
```

If the visitor is sorted into the old variant, return the original request.

### If New Variant
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

This will fetch the new website. The code assumes that the new webpages are located with the same route but have `/new-website` appended to the beginning. If the new route doesn't exist the code will default to returning the original request.
