import { Router } from "express";
import { verificacion } from "../Controllers/Middleware.js";
import { comprobar, saveUsuario,getUsuarios,updateUsuario,deleteUsuario } from "../Controllers/AuthController.js";

const router = Router();

router.get('/usuarios',verificacion,getUsuarios);
router.get('/usuarios/:id',verificacion,getUsuarios);
router.post('/login',comprobar);
router.post('/usuarios',verificacion,saveUsuario);
router.put('/usuarios/:id',verificacion,updateUsuario);
router.delete('/usuarios/:id',verificacion,deleteUsuario);

export default router;