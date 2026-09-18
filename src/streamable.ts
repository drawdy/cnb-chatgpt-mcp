#!/usr/bin/env node

import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import dotenv from 'dotenv';

import { logMiddleware } from './middlewares/logMiddleware.js';
import { createMcpServer } from './helpers/createMcpServer.js';
import {
  stopWithBadRequest,
  stopWithError,
  stopWithMethodNotAllowed,
  stopWithServerError
} from './helpers/sendResponse.js';
import {
  transports,
  createStreamableTransport,
  createStatelessStreamableTransport
} from './helpers/createTransport.js';

dotenv.config();

const DEFAULT_APP_PORT = 3000;

const app = express();

app.use(express.json());
app.use(logMiddleware);

app.post('/mcp', async (req, res) => {
  let transport: StreamableHTTPServerTransport;

  try {
    transport = process.env.MODE_STATELESS
      ? await createStatelessStreamableTransport(req, res)
      : await createStreamableTransport(req);
  } catch (err) {
    if (typeof err === 'object' && err !== null && 'status' in err && 'message' in err) {
      const { status, message } = err as { status: number; message: string };
      stopWithError(res, status, message);
      return;
    }
    const message = err instanceof Error ? err.message : String(err);
    stopWithServerError(res, message ?? 'Unknown error');
    return;
  }

  await transport.handleRequest(req, res, req.body);
});

const handleSessionRequest = async (req: express.Request, res: express.Response) => {
  if (process.env.MODE_STATELESS) {
    stopWithMethodNotAllowed(res, 'Method not allowed');
    return;
  }

  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports.streamable[sessionId]) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }

  const transport = transports.streamable[sessionId];
  await transport.handleRequest(req, res, req.body);
};

// SSE notifications not supported in stateless mode
app.get('/mcp', handleSessionRequest);

// Session termination not needed in stateless mode
app.delete('/mcp', handleSessionRequest);

app.get('/sse', async (req, res) => {
  const transport = new SSEServerTransport('/messages', res);
  transports.sse[transport.sessionId] = transport;

  res.on('close', () => {
    delete transports.sse[transport.sessionId];
  });

  const mcpServer = createMcpServer(req);

  await mcpServer.connect(transport);
});

app.post('/messages', async (req, res) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports.sse[sessionId];

  if (!transport) {
    res.status(400).send('No transport found for sessionId');
    return;
  }

  if (!(transport instanceof SSEServerTransport)) {
    stopWithBadRequest(res, 'Bad Request: Session exists but uses a different transport protocol');
    return;
  }

  await transport.handlePostMessage(req, res, req.body);
});

let port = parseInt(process.env.APP_PORT ?? '', 10);
if (isNaN(port)) {
  port = DEFAULT_APP_PORT;
}

const server = app.listen(port, () => {
  console.log(`MCP Streamable HTTP Server listening on port ${port}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
