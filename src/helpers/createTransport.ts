import { randomUUID } from 'node:crypto';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';

import { createMcpServer } from './createMcpServer';

import type { Request, Response } from 'express';

// Store transports for each session type
export const transports = {
  streamable: {} as Record<string, StreamableHTTPServerTransport>,
  sse: {} as Record<string, SSEServerTransport>
};

export async function createStreamableTransport(req: Request) {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;

  // Reuse existing transport
  if (sessionId && transports.streamable[sessionId]) {
    const transport = transports.streamable[sessionId];
    if (!(transport instanceof StreamableHTTPServerTransport)) {
      throw {
        status: 400,
        message: 'Session exists but uses a different transport protocol'
      };
    }
    return transport;
  }

  // New initialization request
  if (!sessionId && isInitializeRequest(req.body)) {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        transports.streamable[sessionId] = transport;
      }
    });

    // Clean up transport when closed
    transport.onclose = () => {
      if (transport.sessionId) {
        delete transports.streamable[transport.sessionId];
      }
    };

    const mcpServer = createMcpServer(req);

    await mcpServer.connect(transport);

    return transport;
  }

  throw {
    status: 400,
    message: 'No valid session ID provided'
  };
}

export async function createStatelessStreamableTransport(req: Request, res: Response) {
  try {
    const mcpServer = createMcpServer(req);
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined
    });
    res.on('close', () => {
      void transport.close();
      void mcpServer.close();
    });

    await mcpServer.connect(transport);

    return transport;
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      throw new Error('Internal Server Error');
    }
    throw error;
  }
}
