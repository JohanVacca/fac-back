'use strict';

const NecesidadSchema = require('../model/necesidad.model');
const mongoose = require("mongoose");


/**
 * getAll necesidad
 */


NecesidadSchema.static('getAll', async (query) => {
    try{
        return await NecesidadDao
            .find(query)
            .exec();
    }catch(err){
        throw err;
    }
})


/**
 * create a necesidad
 */
NecesidadSchema.static('create', async (necesidad) => {
    if (typeof necesidad !== 'object') {
        throw new TypeError('necesidad is not a valid object.');
    }

    let _obj = new NecesidadDao(necesidad);
    let saved = await  _obj.save();
    let __obj = await NecesidadDao.findOne({_id: saved._id})
    .populate('unidad')
    .exec();
    return (__obj);
});


/**
 * remove a necesidad
 */
NecesidadSchema.static('remove', async (id) =>{
    try{
        return await NecesidadDao.findOneAndRemove({_id: id}).exec();
    }catch (err){
        throw err;
    }
});
/**
 * patch a necesidad
 */
 NecesidadSchema.static('update', async (id, necesidadbody) => {
    try {
        //const {name, programa, subprograma, descripcion, porque, lineasinv, selectedValue} = necesidadbody;
        //let necesidad = await NecesidadDao.findById({_id: id}); //Creamos el producto que traemos de la DB buscando por ID gracias a params

        // if (!necesidad) {
        //     console.log("No existe la necesidad DAO VALIDATE")
        // }

        if (typeof necesidadbody !== 'object') {
            throw new TypeError('Necesidad no es un Objeto');
        }
        // necesidad.name = name;
        // necesidad.programa = programa; //Si lo encontramos le añadiremos a sus valores actuales los valores que obtenemos del req.body, o sea, los del metodo PUT que envía el usuario.
        // necesidad.subprograma = subprograma;
        // necesidad.descripcion = descripcion;
        // necesidad.porque = porque;
        // necesidad.lineasinv = lineasinv;
        // necesidad.selectedValue = selectedValue;

        return await NecesidadDao.findOneAndUpdate({_id: id}, necesidadbody,{new: true}).exec(); //Le pasamos los parametros con req.params, procurar llamar al lado izq. tal y como en la DB
    } catch (error) {
        throw error;
    }
})


/**
 * getbyid a necesidad
 */
NecesidadSchema.static('getById', async (id) => {
    try {
        return await NecesidadDao.findOne({_id: id}).exec(); //Obtenemos necesidad por ID dado gracias a params
    } catch (err) {
        throw err;
    }
});
let NecesidadDao = mongoose.model('necesidad', NecesidadSchema);
module.exports = NecesidadDao;
