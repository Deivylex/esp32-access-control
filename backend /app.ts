import cors from 'cors';
import express from 'express';
import accessRoutes from './routes/access.routes';
import logsRoutes from './routes/logs.routes';
import usersRoutes from './routes/users.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_request, response) => {
	response.json({ status: 'ok' });
});

app.use('/access', accessRoutes);
app.use('/logs', logsRoutes);
app.use('/users', usersRoutes);

app.use((_request, response) => {
	response.status(404).json({ error: 'route not found' });
});

export default app;
