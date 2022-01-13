let CtnProductoService = require("../services/productoService");
let CtnProductoService_mgdb = require("../services/productoService_mgdb");

let ctnproductoService = new CtnProductoService("");
let ctnproductoService_mgdb = new CtnProductoService_mgdb("");

require("dotenv").config();
const PERSISTENCIA = `${process.env.PERSISTENCIA}`;

class ctnProductoController {
  async save(producto) {
    let response = null;

    switch (PERSISTENCIA) {
      case "MG_DB":
        response = await ctnproductoService_mgdb.save(producto);
        break;
      case "FILES":
        response = await ctnproductoService.save(producto);
        break;
    }

    // let response = await ctnproductoService.save(producto);
    return response;
  }

  async getAll() {
    let response = null;

    switch (PERSISTENCIA) {
      case "MG_DB":
        console.log("get mongo");
        response = await ctnproductoService_mgdb.getAll();
        break;
      case "FILES":
        response = await ctnproductoService.getAll();
        break;
    }

    return response;
  }

  async getbyId(id) {
    let response = null;

    switch (PERSISTENCIA) {
      case "MG_DB":
        response = await ctnproductoService_mgdb.getbyId(id);
        break;
      case "FILES":
        response = await ctnproductoService.getbyId(id);
        break;
    }

    return response;
  }

  async deletebyId(id) {
    let response = null;

    switch (PERSISTENCIA) {
      case "MG_DB":
        response = await ctnproductoService_mgdb.deletebyId(id);
        break;
      case "FILES":
        response = await ctnproductoService.deletebyId(id);
        break;
    }

    return response;
  }

  async update(producto, id) {
    let response = null;

    switch (PERSISTENCIA) {
      case "MG_DB":
        response = await ctnproductoService_mgdb.update(producto, id);
        break;
      case "FILES":
        response = await ctnproductoService.update(producto, id);
        break;
    }
    return response;
  }
}

module.exports = ctnProductoController;
