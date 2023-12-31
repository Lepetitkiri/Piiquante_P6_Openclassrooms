const express = require('express');
const router = express.Router() /*Création d'un router*/
const saucesController = require('../controllers/sauces'); /*importation du controller*/
const auth = require('../Middleware/auth'); /*importation du Middleware de vérification de Token*/
const multer = require('../Middleware/multer'); /*importation du Middleware d'enregistrement des fichiers'*/

router.get('/', auth, saucesController.getAllSauces);
router.get('/:id', auth, saucesController.getOneSauce);
router.post('/', auth, multer, saucesController.createANewSauce);
router.delete('/:id', auth, multer, saucesController.deleteOneSauce);
router.put('/:id', auth, multer, saucesController.modifySauce);
router.post('/:id/like', auth, saucesController.likeOrDislikeaASauce);

module.exports = router;

