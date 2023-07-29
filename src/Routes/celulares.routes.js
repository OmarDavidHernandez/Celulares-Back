import { Router } from "express";
import multer from 'multer';
import { verificacion } from "../Controllers/Middleware.js";
import { getCelulares,saveCelular,updateCelular,deleteCelular,addReview } from "../Controllers/CelularesController.js";

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/uploads')
    },
    filename:(req,file,cb)=>{
        const ext = file.originalname.split('.').pop()
        cb(null,Date.now()+'.'+ext)
    }
});

const filtro = (req,file,cb) =>{
    if(file && (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

const subir = multer({storage: storage, fileFilter:filtro});

const router = Router();
router.get('/celulares',getCelulares);
router.get('/celulares/:id',getCelulares);
router.post('/celulares',verificacion,subir.single('imagen'),saveCelular);
router.put('/celulares/:id',verificacion,subir.single('imagen'),updateCelular);
router.delete('/celulares/:id',verificacion,deleteCelular);
router.put('/review/:id',addReview);

export default router;
