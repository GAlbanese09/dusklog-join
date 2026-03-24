export const onRequest: PagesFunction = async (context) => {
  // Handle preflight (shouldn't be needed since same-origin, but just in case)
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  // Only allow POST
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Forward to the Dusklog Worker
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
};
