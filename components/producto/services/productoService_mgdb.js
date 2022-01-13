let { mongoose } = require("../../../config/database");
let { Schema, model } = mongoose;

let { productoSchema } = require("./schemas/producto");
let productoSchemaModel = new Schema(productoSchema);
let productoModel = new model("productos", productoSchemaModel);

class ctnProductoService {
  constructor() {}
  async save(product) {
    try {
      let _timestamp = Date.now();
      let new_product_id = await this.getNewId();

      let new_product = {
        ...product,
        id: Number(new_product_id),
        timestamp: _timestamp,
      };

      productoModel.create(new_product);

      return new_product;
    } catch (error) {
      console.log(error);
    }
  }

  async getNewId() {
    let listProd = await productoModel
      .find({}, { id: 1, _id: 0 })
      .sort({ id: -1 })
      .limit(1);
    let max = 1;
    if (listProd != null) {
      max = listProd[0].id + 1;
    }

    return max;
  }

  async getAll() {
    try {
      let productos = await productoModel.find({});
      return productos;
    } catch (error) {
      console.log(error);
    }
  }

  async getbyId(id) {
    try {
      let idprod = Number(id);
      let productos = await productoModel.find({ id: idprod });

      let response = {
        status: "E",
        mensaje: "producto no encontrado",
      };
      return productos.length == 0 ? response : productos[0];
    } catch (error) {
      console.log(error);
    }
  }

  async deletebyId(id) {
    try {
      let idprod = Number(id);
      let productos = await productoModel.find({ id: idprod });

      let response = {
        status: "S",
        mensaje: "producto eliminado.",
      };
      if (productos != null) {
        let respuesta = await productoModel.deleteOne({ id: idprod });

        if (respuesta.deletedCount == 0) {
          response = {
            status: "E",
            mensaje: "producto no encontrado.",
          };
        }
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async update(producto, id) {
    let idprod = Number(id);
    let rpta = await productoModel.updateOne({ id: idprod }, { ...producto });
    let response = {
      status: "S",
      mensaje: "producto actualizado.",
    };
    if (rpta.matchedCount == 0) {
      response = {
        status: "E",
        mensaje: "producto no encontrado.",
      };
    }

     

    return response;
  }
}

module.exports = ctnProductoService;
