import type { Response } from 'express';

export function stopWithError(res: Response, status: number, message: string) {
  if (status === 400) {
    stopWithBadRequest(res, message);
    return;
  }
  if (status === 405) {
    stopWithMethodNotAllowed(res, message);
    return;
  }
  stopWithServerError(res, message);
}

export function stopWithBadRequest(res: Response, message: string) {
  res.status(400).json({
    jsonrpc: '2.0',
    error: {
      code: -32000,
      message
    },
    id: null
  });
}

export function stopWithMethodNotAllowed(res: Response, message: string) {
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message
      },
      id: null
    })
  );
}

export function stopWithServerError(res: Response, message: string) {
  res.status(500).json({
    jsonrpc: '2.0',
    error: {
      code: -32603,
      message
    },
    id: null
  });
}
