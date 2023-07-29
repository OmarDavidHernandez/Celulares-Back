import expres from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import peliculas from './Routes/celulares.routes.js';
import encuestas from './Routes/encuestas.routes.js';
import auth from './Routes/auth.routes.js'
import {DB_HOST,DB_DATABASE,DB_PORT} from './config.js';
const url = 'mongodb://'+DB_HOST+':'+DB_PORT+'/'+DB_DATABASE;
mongoose.connect(url).then();
const app = expres();
app.use(cors());
app.use(morgan('dev'));
app.use(expres.json());
app.use(expres.static('public'));
app.use('/',peliculas);
app.use('/',encuestas);
app.use('/',auth);
app.use( (req,res,next) => {
    res.status(404).json({message:'Página no encontrada'});
});

export default app;