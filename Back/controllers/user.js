const user = require('../models/user'); /*importation du schéma*/
const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt'); /*importation du package de cryptage du password*/
const jwt = require('jsonwebtoken') /*importation du package de génération de token utilsateur*/
const validator = require('validator'); /*importation du package de validation permettant de controler le format de l'adresse email entrée*/

require("dotenv").config();

exports.createUser = (req, res, next) => {
    /*Hashage du password*/
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            /* Création d'une instance de user */
            const newUser = new user({
                email: req.body.email,
                password: hash
            });
            /*Enregistrement de newUser dans la dataBase*/
        newUser.save() 
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error })); /*Erreur de sauvegarde*/
        })
        .catch(error => res.status(500).json({error})); /*Erreur de traitement de la requete*/
};


exports.login = (req, res, next) => {
    /*Vérification du format de l'adresse email saisie*/
    if (validator.isEmail(req.body.email)) {
       /*Recherche d'email correspondant dans la database*/
        user.findOne({email: req.body.email})
        .then((user) => {
            if (user !== null) { /*L'email a bien été trouvé dans la database*/       
                bcrypt.compare(req.body.password, user.password) /*comparaison du mdp saisi et stocké en database*/   
                .then(valid => {
                    if (valid) {
                        res.status(200).json({ /* Renvoi d'un objet JSON si login réussi */
                            userId: user._id, 
                            token: jwt.sign( { userId: user._id }, 
                                process.env.TOKEN_SECRET,
                                { expiresIn: '24h' } )});
                    } else {
                        res.status(403).json({message: 'Mauvaise correspondance email/mot de passe !'}) /*Erreur de correspondance du mdp dans la database*/
                    }
                })
                .catch((error) => res.status(500).json({ error })) /*Erreur de traitement de le comparaison mdp*/
            } else {
                return res.status(404).json({ message: 'Mauvaise correspondance email/mot de passe !' }) /*Erreur de correspondance de l'email dans la database*/
            }})
        .catch((error) => res.status(500).json({ error })) /*Erreur de traitement de la requete*/
    } else {
        return res.status(400).json({ message: 'Ceci n\'est pas une adresse email valide !' }) /*Erreur dans le format de l'adresse email saisie*/
    }
};