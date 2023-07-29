import { Router } from "express";
import { verificacion } from "../Controllers/Middleware.js";
import { getEncuestas,saveEncuesta,updateEncuesta,deleteEncuesta,savePregunta,updatePregunta,deletePregunta,saveRespuesta } from "../Controllers/EncuestasController.js";

const router = Router();
router.get('/encuestas',getEncuestas);
router.get('/encuestas/:id',getEncuestas);
router.post('/encuestas',verificacion,saveEncuesta);
router.put('/encuestas/:id',verificacion,updateEncuesta);
router.delete('/encuestas/:id',verificacion,deleteEncuesta);
router.post('/preguntas',verificacion,savePregunta);
router.put('/preguntas/:id',verificacion,updatePregunta);
router.delete('/preguntas/:id',verificacion,deletePregunta);
router.post('/respuestas',saveRespuesta);

export default router;