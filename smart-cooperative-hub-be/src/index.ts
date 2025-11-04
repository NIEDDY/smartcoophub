// src/index.ts

import express, { Application, Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app: Application = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: config.frontend.url,
    credentials: true,
  },
});

// --- WebSocket Connection Handling ---
// Store socket connections mapped by Order ID for real-time updates
const paymentSockets = new Map<string, string>();

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('registerForOrderUpdates', (orderId: string) => {
    if (orderId) {
      console.log(`Registering socket ${socket.id} for order ${orderId}`);
      paymentSockets.set(orderId, socket.id);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    // Clean up the map on disconnect
    for (const [orderId, socketId] of paymentSockets.entries()) {
      if (socketId === socket.id) {
        paymentSockets.delete(orderId);
        break;
      }
    }
  });
});


// --- Express Middleware Setup ---

app.use(helmet());
app.use(cors({ origin: config.frontend.url, credentials: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// CRITICAL: Middleware to get the raw body for webhook signature verification.
// This MUST come before any other body-parsing middleware.
app.use(express.json({
  limit: '10mb',
  verify: (req: any, res, buf) => {
    if (req.originalUrl.startsWith('/api/webhooks')) {
      req.rawBody = buf;
    }
  },
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(compression());

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Middleware to make the 'io' server and sockets map available to our controllers
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).io = io;
  (req as any).paymentSockets = paymentSockets;
  next();
});

// --- API Routes ---
app.use('/api', routes);

// --- Swagger Documentation ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Smart Cooperative Hub API', version: '1.0.0' });
});

// --- Error Handling ---
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Global Error:', err);
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: 'File upload error', message: err.message });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation error', message: err.message });
  }
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// --- Server Startup ---
const PORT = config.port;
server.listen(PORT, () => { // Use 'server.listen' instead of 'app.listen'
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
});

export default app;