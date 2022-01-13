const joi = require("joi");
let id = joi.number();
let timestamp = joi.string();
let codigo = joi.string();
let nombre = joi.string();
let descripcion = joi.string();
let foto_url = joi.string();
let precio = joi.number();
let stock = joi.number();

const productoSchema = {
  id: id.required(),
  timestamp: timestamp.required(),
  codigo: codigo.required(),
  nombre: nombre.required(),
  descripcion: descripcion.required(),
  foto_url: foto_url.required(),
  precio: precio.required(),
  stock: stock.required(),
};

module.exports = {
  productoSchema,
};
