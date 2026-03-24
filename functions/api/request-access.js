export async function onRequestPost(context) {
  const workerUrl = 'https://dusklog.nicertatscru.workers.dev/api/auth/request-access';

  try {
    const body = await context.request.text();

    let response;
    try {
      response = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });
    } catch (fetchError) {
      return new Response(JSON.stringify({
        error: 'Fetch to Worker failed',
        detail: fetchError.message,
        stack: fetchError.stack,
        workerUrl: workerUrl
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.text();
    return new Response(data, {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: 'Function error',
      detail: err.message,
      stack: err.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}

export async function onRequest() {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}
