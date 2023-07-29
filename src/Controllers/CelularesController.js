import mongoose from 'mongoose';
import * as fs from 'fs';

const esquema = new mongoose.Schema({
    marca: String,
    modelo: String,
    color: String,
    imagen: String,
    precio: String,
    caracteristicas: String,
    review:{ type: String, default: '' }
  },{versionKey:false});
const CelularModel = new mongoose.model('celulares',esquema);

export const getCelulares = async (req,res) => {
    try{
        const {id} = req.params;
        const rows = (id === undefined) ? await CelularModel.find() : await CelularModel.findById(id);
        return res.status(200).json({status:true,data:rows});
    }
    catch(error){
        return res.status(500).json({message:false});
    }
};

export const saveCelular = async(req,res) => {
    try {
        const {marca,modelo,color,caracteristicas,precio} = req.body;
        const imagen = '/uploads/'+req.file.filename;
        var validacion = validar(marca,modelo,color,caracteristicas,precio);
        if(Object.entries(validacion).length === 0){
            const nuevoCel = new CelularModel({ 
                    marca: marca,
                    modelo: modelo,
                    color: color,
                    imagen: imagen,
                    precio: precio,
                    caracteristicas: caracteristicas,
                    review:''
                });
            return await nuevoCel.save().then(
                () =>  res.status(200).json({status:true,message:'Celular guardado'})
            );
        }
        else{
            return res.status(400).json({status:false,errors:validacion});
        }
    }
    catch (error) {
        return res.status(500).json({status:false,errors:[error.message]});
    }
};
export const updateCelular = async(req,res) => {
    try {
        const {id} = req.params;
        const {marca,modelo,color,caracteristicas,precio} = req.body;
        let imagen = '';
        let valores = {
            marca: marca,
            modelo: modelo,
            color: color,
            precio: precio,
            caracteristicas: caracteristicas,
        }
        if(req.file != null){
            imagen = '/uploads/'+req.file.filename;
            valores = {
                marca: marca,
                modelo: modelo,
                color: color,
                imagen: imagen,
                precio: precio,
                caracteristicas: caracteristicas,
            }
            await eliminarImagen(id);
        }
        var validacion = validar(marca,modelo,color,caracteristicas,precio);
        if(Object.entries(validacion).length === 0){
            await CelularModel.updateOne({_id:id},{$set: valores});
            return res.status(200).json({status:true,message:'Celular modificado'});
        }
        else{
            return res.status(400).json({status:false,errors:validacion});
        }
    }
    catch (error) {
        return res.status(500).json({status:false,errors:[error.message]});
    }
};
export const deleteCelular = async(req,res) => {
    try {
        const {id} = req.params;
        await eliminarImagen(id);
        await CelularModel.deleteOne({_id:id});
        return res.status(200).json({status:true,message:'Celular eliminado'});
    }
    catch (error) {
        return res.status(500).json({status:false,errors:[error.message]});
    }
};
export const validar = (marca,modelo,color,caracteristicas,precio) => {
    var errors =[];
    if(marca === undefined || marca.trim() === '' || marca.lenght > 100){
        errors.push(
            'La marca del celular NO debe estar vacía y debe tener máximo 100 caracteres'
        );
    }
    if(modelo === undefined || modelo.trim() === '' || modelo.lenght > 100){
        errors.push(
            'El modelo del celular NO debe estar vacío y debe tener máximo 100 caracteres'
        );
    }
    if(color === undefined || color.trim() === '' || color.lenght > 100){
        errors.push(
            'El color del celular NO debe estar vacío y debe tener máximo 100 caracteres'
        );
    }
    if(caracteristicas === undefined || caracteristicas.trim() === '' || caracteristicas.lenght > 250){
        errors.push(
            'Las caracteristicas del celular NO deben estar vacías y debe tener máximo 250 caracteres'
        );
    }
    if(precio === undefined || precio.trim() === '' || precio.lenght > 9 || isNaN(precio)){
        errors.push(
            'El precio del celular NO deben estar vacío y debe ser numérico'
        );
    }
    return errors;
}
const eliminarImagen = async(id) =>{
    const cel = await CelularModel.findById(id);
    const img = cel.imagen;
    fs.unlinkSync('./public'+img)
}

export const addReview = async(req,res) => {
    try {
        const {id} = req.params;
        const {review} = req.body;
        if(review !== undefined || review.trim() !== ''){
            const cel = await CelularModel.findById(id);
            const rev = cel.review;
            await CelularModel.updateOne({_id:id},{$set: {review: (rev+review+' *-* ')}});
            return res.status(200).json({status:true,message:'Gracias por dejar tu reseña'});
        }
        else{
            return res.status(400).json({status:false,errors:['Debes escribir una reseña']});
        }
    }
    catch (error) {
        return res.status(500).json({status:false,errors:[error.message]});
    }
};