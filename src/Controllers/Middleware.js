import { Router } from "express";
import  Jwt  from 'jsonwebtoken';
import {JWT_SECRET} from '../config.js';

export const verificacion = Router();

verificacion.use((req,res,next) =>{
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if(!token){
        res.status(401).send({
            status:false,
            errors:['NO autorizado']
        });
        return
    }
    if(token.startsWith('Bearer')){
        token = token.slice(7,token.length);
        Jwt.verify(token,JWT_SECRET,(error,decoded)=>{
            if(error){
                return res.status(404).json({status:false,errors:['Token NO válido']});
            }
            else{
                req.decoded = decoded;
                next();
            }
        });
    }
});