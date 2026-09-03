export function notFound(request, response) { response.status(404).json({ message: `Route not found: ${request.method} ${request.originalUrl}` }); }
export function errorHandler(error, _request, response, _next) { void _next; console.error(error); response.status(500).json({ message: 'Internal server error' }); }
