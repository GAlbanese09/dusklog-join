async function handlePost(context) {
  const workerUrl = 'https://dusklog.nicertatscru.workers.dev/api/auth/request-access';

  try {
    const body = await context.request.text();
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    });

    const data = await response.text();
    return new Response(data, {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to submit request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Explicit method exports — Cloudflare Pages Functions requires these
export async function onRequestPost(context) {
  return handlePost(context);
}

export async function onRequestOptions(context) {
  return new Response(null, { status: 204 });
}

export async function onRequest(context) {
  if (context.request.method === 'POST') {
    return handlePost(context);
  }
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}
