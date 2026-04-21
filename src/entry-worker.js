import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

addEventListener('fetch', (event) => {
    event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
    try {
        // Serve assets directly
        const response = await getAssetFromKV(event);
        if (response.status === 404) {
            // SPA fallback to index.html
            return getAssetFromKV(event, {
                mapRequestToAsset: (req) => new Request(`${new URL(req.url).origin}/index.html`, req),
            });
        }
        return response;
    } catch (e) {
        return new Response('Internal Error', { status: 500 });
    }
}