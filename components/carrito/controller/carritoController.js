let CtnCarritoService = require("../services/carritoService");
let CtnCarritoService_mgdb = require("../services/carritoService_mgdb");

let ctncarritoService = new CtnCarritoService("");
let ctncarritoService_mgdb = new CtnCarritoService_mgdb("");

require("dotenv").config();
const PERSISTENCIA = `${process.env.PERSISTENCIA}`;

class ctnCarritoController {
  async createCart(usuario) {
    let response = null;

    switch (PERSISTENCIA) {
      case "MG_DB":
        response = await ctncarritoService_mgdb.createCart(usuario);
        break;
      case "FILES":
        response = await ctncarritoService.createCart(usuario);
        break;
    }

    return response;
  }

  async getProductsByIdCart(idCart) {
    let response = null;

    switch (PERSISTENCIA) {
      case "MG_DB":
        response = await ctncarritoService_mgdb.getProductsByIdCart(idCart);
        break;
      case "FILES":
        response = await ctncarritoService.getProductsByIdCart(idCart);
        break;
    }

    return response;
  }

  async deleteCartbyId(id) {
    let response = null;

    switch (PERSISTENCIA) {
      case "MG_DB":
        response = await ctncarritoService_mgdb.deleteCartbyId(id);
        break;
      case "FILES":
        response = await ctncarritoService.deleteCartbyId(id);
        break;
    }

    return response;
  }

  async deleteProductFromCart(idCart, idProducto) {
    let response = null;

    switch (PERSISTENCIA) {
      case "MG_DB":
        response = await ctncarritoService_mgdb.deleteProductFromCart(
          idCart,
          idProducto
        );
        break;
      case "FILES":
        response = await ctncarritoService.deleteProductFromCart(
          idCart,
          idProducto
        );
        break;
    }

    return response;
  }

  async addProductCart(idCart, producto) {
    let response = null;

    switch (PERSISTENCIA) {
      case "MG_DB":
        response = await ctncarritoService_mgdb.addProductCart(
          idCart,
          producto
        );
        break;
      case "FILES":
        response = await ctncarritoService.addProductCart(idCart, producto);
        break;
    }

    return response;
  }
}

module.exports = ctnCarritoController;
