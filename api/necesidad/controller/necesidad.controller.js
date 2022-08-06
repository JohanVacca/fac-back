'use strict';

const { validationResult } = require('express-validator/check');
const NecesidadDao = require('../dao/necesidad.dao');

const UnidadDao = require('../../unidad/dao/unidad.dao');
const NecesidadSchema = require('../model/necesidad.model');

/**
 * getAll unidades
 * @param req
 * @param res
 * @param next
 */
const getAll = async (req, res, next) => {
    let query = req.query;
    let userId = req.user.sub.user._id;
    let role = req.user.sub.user.role;
    let unidad = null;
    if (role.name === 'Responsable') {
        unidad = await UnidadDao.findOne({ rResponsable: userId }).exec();
    }else if( role.name === 'Comandante'){
        unidad = await UnidadDao.findOne({ comandante: userId }).exec();
    }
    if(unidad){
        query = {
            unidad: unidad._id
        }
    }
    NecesidadDao['getAll'](query)
        .then(async necesidades => {
            res.status(200).json({ "necesidades": necesidades });
        })
        .catch(err => {
            res.status(500).json({ message: err });
        });
}

/**
 * create a invCenter
 * @param req
 * @param res
 * @param next
 */
function create(req, res, next) {
    try {
        validationResult(req).throw();
        let necesidad = req.body;
        let objObj = JSON.parse(JSON.stringify(necesidad));
        let userId = req.user.sub.user._id;
        UnidadDao.findOne({ rResponsable: userId }).then(unidad => {
            objObj.unidad = unidad;
            NecesidadDao['create'](objObj)
                .then(async _obj => {
                    res.status(201).json({ "necesidad": _obj });
                });
        })
    } catch (err) {
        const errorFormatter = ({ msg, param }) => {
            return `The value: ${param} ${msg}`;
        };
        const result = validationResult(req).formatWith(errorFormatter);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }
    }
}

/**
 * Método para eliminar unidad
 * @param req
 * @param res
 * @param next
 */
function remove(req, res, next) {
    try {
        validationResult(req).throw();

        let { id } = req.body;
        let idObj = JSON.parse(JSON.stringify(id));

        NecesidadDao['remove'](idObj)
            .then(async necesidad => {
                if (!necesidad) {
                    res.status(404).json({ message: 'necesidad not found.' });
                } else {
                    res.status(200).json({ message: 'necesidad deleted.' });
                }
            })
            .catch(err => res.status(500).json({ message: err }));
    } catch (err) {
        const errorFormatter = ({ msg, param }) => {
            return `The value: ${param} ${msg}`;
        };
        const result = validationResult(req).formatWith(errorFormatter);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }
    }
}
//--------
/**
 * Método para obtener necesidad por id
 * @param req
 * @param res
 * @param next
 */
function obtenerNecesidadById(req, res, next){
    try {
        validationResult(req).throw();

        let id = req.param.id;

        NecesidadDao['getById'](id)
            .then(async necesidad => {
                if (!necesidad) {
                    res.status(404).json({ message: 'Necesidad no encontrada.' });
                } else {
                    res.status(200).json({ message: 'Necesidad modificada.' });
                }
            })
            .catch(err => res.status(500).json({ message: err }));
    } catch (error) {
        const errorFormatter = ({ msg, param }) => {
            return `El valor: ${param} ${msg}`;
        };
        const result = validationResult(req).formatWith(errorFormatter);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }
    }
}

/**
 * Método para actualizar necesidad
 * @param req
 * @param res
 * @param next
 */
function actualizarNecesidad(req, res, next){
    try {
        validationResult(req).throw();
        let necesidad = req.body;
        let necesidadObj = JSON.parse(JSON.stringify(necesidad));
        let idNecesidad = req.params.id

        NecesidadDao['update'](idNecesidad, necesidadObj)
            .then(async _obj => {
                if (!_obj) {
                    res.status(404).json({ message: 'Necesidad not found.' });
                } else {
                    res.status(200).json({ "necesidad": _obj });
                }
            }).catch(err => res.status(500).json({ message: err }));

    } catch (err) {
        const errorFormatter = ({ msg, param }) => {
            return `The value: ${param} ${msg}`;
        };
        const result = validationResult(req).formatWith(errorFormatter);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }
    }
}
//-------- FIN JV

module.exports = {
    create,
    getAll,
    remove,
    obtenerNecesidadById,
    actualizarNecesidad
}
