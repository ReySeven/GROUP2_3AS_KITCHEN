import { config as loadEnv } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath }    from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnv({ path: resolve(__dirname, '../.env') });
import express       from 'express';
import cors          from 'cors';
import session       from 'express-session';
import userRoute     from './routes/userRoute.js';
import otpRoute      from './routes/otpRoute.js';
import itemRoute     from './routes/itemRoute.js';
import orderRoute    from './routes/orderRoute.js';
import riderRoute    from './routes/riderRoute.js';
import promoRoute    from './routes/promoRoute.js';
import expenseRoute  from './routes/expenseRoute.js';
import feedbackRoute from './routes/feedbackRoute.js';
import bundleRoute   from './routes/bundleRoute.js';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
}));
app.use(session({
    secret:            process.env.SESSION_SECRET || '3akitchen_secret_key',
    resave:            false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge:   24 * 60 * 60 * 1000,  // 1 day
    },
}));

app.use('/users',    userRoute);
app.use('/otp',      otpRoute);
app.use('/items',    itemRoute);
app.use('/orders',   orderRoute);
app.use('/riders',   riderRoute);
app.use('/promos',   promoRoute);
app.use('/expenses', expenseRoute);
app.use('/feedback', feedbackRoute);
app.use('/bundles',  bundleRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`3A's Kitchen backend listening on port ${port}...`);
});
