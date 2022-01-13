const joi = require("joi");

let idCarrito = joi.number();
let usuario = joi.string();

let timestampCarrito = joi.string();
let idProd = joi.number();
let timestampProd = joi.string();
let codigo = joi.string();
let nombre = joi.string();
let descripcion = joi.string();
let foto_url = joi.string();
let precio = joi.number();
let stock = joi.number();
let cant_pedido = joi.number();

const carritoSchema = {
  usuario: usuario.required(),
  id: idCarrito.required(),
  timestamp: timestampCarrito.required(),
  productos: [
    {
      id: idProd.required(),
      timestamp: timestampProd.required(),
      codigo: codigo.required(),
      nombre: nombre.required(),
      descripcion: descripcion.required(),
      foto_url: foto_url.required(),
      precio: precio.required(),
      stock: stock.required(),
      cant_pedido: cant_pedido.required(),
    },
  ],
};

module.exports = {
  carritoSchema,
};
