import  Jwt  from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import {JWT_SECRET,JWT_EXPIRES} from '../config.js';
import mongoose from 'mongoose';

const esquema = new mongoose.Schema({
    nombre: String,
    correo: String,
    password: String
  },{versionKey:false});
const UsuarioModel = new mongoose.model('usuario',esquema);

export const getUsuarios = async (req,res) => {
    try{
        const {id} = req.params;
        const rows = (id === undefined) ? await UsuarioModel.find() : await UsuarioModel.findById(id);
        return res.json({status:true,data:rows});
    }
    catch(error){
        return res.status(500).json({message:false});
    }
};

export const comprobar = async (req,res) => {
    try{
        const {correo,password} = req.body;
        var validacion = validar('comprobar',correo,password);
        if(Object.entries(validacion).length === 0){
            let rows = await UsuarioModel.findOne({correo:correo});
            if(rows.length  == 0 || !(await bcryptjs.compare(password,rows.password))){
                return res.status(404).json({status:false,errors:['Usuario NO válido']});
            }
            const token = Jwt.sign({id:rows._id},JWT_SECRET,{
                expiresIn: JWT_EXPIRES
            });
            const usr = {nombre:rows.nombre,correo:rows.correo,token:token};
            return res.json({status:true,data:usr,message:['Acceso correcto']});
        }
        else{
            return res.status(400).json({status:false,errors:validacion});
        }
    }
    catch(error){
        return res.status(500).json({status:false,errors:[error.message]});
    }
};

export const saveUsuario = async (req,res) => {
    try{
        const {nombre,correo,password} = req.body;
        var validacion = validar(nombre,correo,password);
        if(Object.entries(validacion).length === 0){
            let pass = await bcryptjs.hash(password,8);
            const nuevoUsuario = new UsuarioModel({ 
                nombre: nombre,
                correo: correo,
                password: pass
            });
            await nuevoUsuario.save();
            return res.status(200).json({status:true,message:'Usuario creado'});
        }
        else{
            return res.status(400).json({status:false,errors:validacion});
        }
    }
    catch(error){
        return res.status(500).json({status:false,errors:[error.message]});
    }
};
export const updateUsuario = async (req,res) => {
    try{
        const {id} = req.params;
        const {nombre,correo,password} = req.body;
        var validacion = validar(nombre,correo,password);
        if(Object.entries(validacion).length === 0){
            let pass = await bcryptjs.hash(password,8);
            await UsuarioModel.updateOne({_id:id},{$set: {
                nombre: nombre,
                correo: correo,
                password: pass,
            }});
            return res.status(200).json({status:true,message:'Usuario modificado'});
        }
        else{
            return res.status(400).json({status:false,errors:validacion});
        }
    }
    catch(error){
        return res.status(500).json({status:false,errors:[error.message]});
    }
};

export const deleteUsuario = async(req,res) => {
    try {
        const {id} = req.params;
        await UsuarioModel.deleteOne({_id:id});
        return res.status(200).json({status:true,message:'Usuario eliminado'});
    }
    catch (error) {
        return res.status(500).json({status:false,errors:[error.message]});
    }
};
function validar(nombre,correo,password){
    var errors =[];
    if(nombre === undefined || nombre.trim() === '' || nombre.lenght > 100){
        errors.push(
            'El nombre NO debe estar vacío y debe tener máximo 100 caracteres'
        );
    }
    if(correo === undefined || correo.trim() === '' || correo.lenght > 100){
        errors.push(
            'El correo NO debe estar vacío y debe tener máximo 100 caracteres'
        );
    }
    if(password === undefined || password.trim() === '' || password.lenght > 250){
        errors.push(
            'La contraseña NO debe estar vacía'
        );
    }
    return errors;
}