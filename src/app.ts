import routes from './routes';
import errorHandler from './middleware/errorHandler';
import { HttpError } from './utils/HttpError';
import passport from './config/passport';
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import compression from 'compression';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import path from 'node:path';

const app = express();

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev')); /* combined / common / dev / tiny */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "http://localhost:5173"], // frontend dev server if needed
      imgSrc: ["'self'", "data:"],
    }
  }
}));
app.use(hpp());

const allowedOrigins = [
	'http://localhost:8000',
	'http://localhost:5173',
	'http://127.0.0.1:5173'
];
app.use(cors({
	// origin: process.env.CLIENT_URL || '*',
	origin: (origin, callback)=> {
		if( !origin || allowedOrigins.includes(origin) ){
			callback(null, true);
		}else{ callback(new Error('Not allowed by CORS')); }
	},
	credentials: true
}));
app.use(compression());
app.use(csurf({ cookie: true }));
app.use(passport.initialize());

app.get('/api/csrf-token', (req: Request, res: Response)=> {
	const csrfToken = req.csrfToken(); /* Generate Token */
	res.cookie('XSRF-TOKEN', csrfToken, {
		httpOnly: false, /* So browser JS can read it */
		sameSite: 'lax', /* Allow cookies in top-level POSTs from the Frontend */
		secure: false, /* true for HTTPS in production */
		path: '/'
	}).status(200).json({ csrfToken });
});

app.use('/api', routes);

/* Redirect every non-covering endpoint to index HTML file */
app.get(/^\/(?!api).*/, (req: Request, res: Response, next: NextFunction)=> {
	res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

/* Custom 404 page not found */
app.use((req: Request, res: Response, next: NextFunction)=> {
	next(new HttpError('Page Not Found', 404));
});

app.use(errorHandler);

process.on('uncaughtException', err=> {
	console.error('🔥 Uncaught Exception:', err);
	process.exit(1); /* Exit to avoid undefined behavior */
});
process.on('unhandledRejection', (reason, promise)=> {
	console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
});

export default app;
