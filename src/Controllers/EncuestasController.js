import mongoose from 'mongoose';

const esquema = new mongoose.Schema({
    nombre: String,
    preguntas:{ type: Object, default: {} },
    respuestas:{ type: Object, default: {} }
  },{versionKey:false});
const EncuestasModel = new mongoose.model('encuestas',esquema);

export const getEncuestas = async (req,res) => {
    try{
        const {id} = req.params;
        const rows = (id === undefined) ? await EncuestasModel.find() : await EncuestasModel.findById(id);
        return res.json({status:true,data:rows});
    }
    catch(error){
        return res.status(500).json({message:false});
    }
};
export const saveEncuesta = async (req,res) => {
    try {
        const {nombre} = req.body;
        var validacion = validarEncuesta(nombre);
        if(Object.entries(validacion).length === 0){
            const nuevaEncuesta = new EncuestasModel({ 
                nombre: nombre, preguntas:[],respuestas:[]
            });
            await nuevaEncuesta.save();
            return res.status(200).json({status:true,message:'Encuesta creada'});
        }
        else{
            return res.status(400).json({status:false,errors:validacion});
        }
    }
    catch (error) {
        return res.status(500).json({status:false,errors:[error.message]});
    }
};
export const updateEncuesta = async (req,res) => {
    try {
        const {id} = req.params;
        const {nombre} = req.body;
        var validacion = validarEncuesta(nombre);
        if(Object.entries(validacion).length === 0){
            await EncuestasModel.updateOne({_id:id},{$set: {
                nombre: nombre
            }});
            return res.status(200).json({status:true,message:'Encuesta actualizada'});
        }
        else{
            return res.status(400).json({status:false,errors:validacion});
        }
    }
    catch (error) {
        return res.status(500).json({status:false,errors:[error.message]});
    }
};
export const deleteEncuesta = async (req,res) => {
    try {
        const {id} = req.params;
        await EncuestasModel.deleteOne({_id:id});
        return res.status(200).json({status:true,message:'Encuesta eliminada'});
    }
    catch (error) {
        return res.status(500).json({status:false,errors:[error.message]});
    }
};

export const validarEncuesta = (nombre) => {
    var errors =[];
    if(nombre === undefined || nombre.trim() === '' || nombre.lenght > 150){
        errors.push(
            'La nombre de la encuesta NO debe estar vacía y debe tener máximo 150 caracteres'
        );
    }
    return errors;
}

export const savePregunta = async (req,res) => {
    try {
        const {pregunta,encuesta} = req.body;
        var validacion = validarPregunta(pregunta);
        if(Object.entries(validacion).length === 0){
            const enc = await EncuestasModel.findById(encuesta);
            enc.preguntas.push(pregunta);
            await EncuestasModel.updateOne({_id:encuesta},{$set: {
                preguntas:enc.preguntas
            }});
            return res.status(200).json({status:true,message:'Pregunta añadida a la encuesta'});
        }
        else{
            return res.status(400).json({status:false,errors:validacion});
        }
    }
    catch (error) {
        return res.status(500).json({status:false,errors:[error.message]});
    }
};

export const updatePregunta = async (req,res) => {
    try {
        const {pregunta,encuesta} = req.body;
        const enc = await EncuestasModel.findById(encuesta);
        await EncuestasModel.updateOne({_id:encuesta},{$set: {
            preguntas:pregunta
        }});
        return res.status(200).json({status:true,message:'Pregunta actualizada'});
    }
    catch (error) {
        return res.status(500).json({status:false,errors:[error.message]});
    }
};
export const deletePregunta = async (req,res) => {
    try {
        const {id} = req.params;
        const {pregunta,encuesta} = req.body;
        return res.status(200).json({status:true,message:'Pregunta eliminada'});
    }
    catch (error) {
        return res.status(500).json({status:false,errors:[error.message]});
    }
};
export const validarPregunta = (pregunta) => {
    var errors =[];
    if(pregunta === undefined || pregunta.trim() === '' || pregunta.lenght > 150){
        errors.push(
            'La nombre de la pregunta NO debe estar vacía y debe tener máximo 150 caracteres'
        );
    }
    return errors;
}
export const saveRespuesta = async (req,res) => {
    try {
        const {respuestas,encuesta} = req.body;
        const enc = await EncuestasModel.findById(encuesta);
        let nuevasResp = [];
        respuestas.forEach((r,i) => {
            nuevasResp.push({pregunta:i,respuesta:r});
        });
        
        console.log(enc.respuestas.length);
        if(enc.respuestas.length == 0 ){
            await EncuestasModel.updateOne({_id:encuesta},{$set: {
                respuestas:nuevasResp
            }});
        }
        else{
            let anteriores = enc.respuestas;
            let nuevo = anteriores.concat(nuevasResp);
            await EncuestasModel.updateOne({_id:encuesta},{$set: {
                respuestas: nuevo
            }});
        }
        return res.status(200).json({status:true,message:'Gracias por responder la encuesta'});
    }
    catch (error) {
        return res.status(500).json({status:false,errors:[error.message]});
    }
};