const { response } = require("express");
const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJTW } = require("../helpers/jwt");


const crearUsuario = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {

        const exixteEmail = await Usuario.findOne({ email });
        if ( exixteEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const usuario = new Usuario( req.body );

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        //Generar mi JWT
        const token = await generarJTW( usuario.id );


        res.json({
            ok : true,
            usuario,
            token
        }); 

    } catch ( error ){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const login = async ( req, res = response ) => {

    const { email, password } = req.body

    try {

        const usuarioDB = await Usuario.findOne({email});
        if ( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }

        //Validar password
        const validarPassword = bcrypt.compareSync( password, usuarioDB.password );
        if (!validarPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }

        //Generar el JWT
        const token = await generarJTW( usuarioDB.id );

        res.json({
            ok : true,
            usuario: usuarioDB,
            token
        });

        
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el admnistrador'
        });
    }
}

const renewToken = async( req, res= response ) => {

    //const uid uid del usuario
    const { uid } = req;

    //Generear un nuevo JWT, generarJWT... uid...
    const token = await generarJTW( uid );    

    //Obtener el usuario por el UID, usuario.findById...
    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        usuario,
        token
    })
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}