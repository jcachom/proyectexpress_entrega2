let { mongoose } = require("../../../config/database");
let { Schema, model } = mongoose;

let { carritoSchema } = require("./schemas/carrito");
let carritoSchemaModel = new Schema(carritoSchema);
let carritoModel = new model("carritos", carritoSchemaModel);

let CtnProductoService_mgdb = require("../../producto/services/productoService_mgdb");
let ctnproductoService_mgdb = new CtnProductoService_mgdb("");

class ctnCarritoService {
  constructor(url) {}
  async createCart(usuario) {
    if (usuario == null) {
      usuario = "";
    }
    try {
      let _timestamp = Date.now();

      let list_carrito_usuario = await carritoModel.find({ usuario: usuario });


      console.log("carrito")
      console.log(list_carrito_usuario)

      let new_carrito = null;

      if (
        usuario == "" ||
        list_carrito_usuario == null ||
        list_carrito_usuario.length == 0
      ) {
        let new_carrito_id = await this.getNewId();
        new_carrito = {
          usuario: usuario,
          id: new_carrito_id,
          timestamp: _timestamp,
          productos: []
        };

        carritoModel.create(new_carrito);
      } else {
        let cart=list_carrito_usuario[0];
        new_carrito = {
          usuario: cart.usuario,
          id: cart.id,
        };
      }

      return new_carrito;
    } catch (error) {
      console.log(error);
    }
  }

  async addProductCart(idCart, producto) {
    try {
      let idCarts = Number(idCart);
      let idProd = Number(producto.id);

      let list_carrito = await carritoModel.find({ id: idCarts });

      let response = null;

      if (list_carrito.length == 0) {
        response = {
          status: "E",
          mensaje: "carrito no encontrado",
        };
        return response;
      }

      let list_producto = await ctnproductoService_mgdb.getbyId(idProd);

      if (list_producto.status == "E") {
        response = {
          status: "E",
          mensaje: "producto adicionar no existe.",
        };
        return response;
      }

    
      let existeProducto = false;
      let CantPedActual = 0;
      list_carrito[0].productos.forEach((item) => {
        if (item.id == idProd) {
          existeProducto = true;
          CantPedActual = item.cant_pedido;
        }
      });

      if (existeProducto == true) {
        let cantPed = Number(CantPedActual) + Number(producto.cant_pedido);

        let list_carrito = await carritoModel.update(
          { id: idCarts, "productos.id": idProd },
          {
            $set: { "productos.$.cant_pedido": cantPed },
          }
        );

        response = {
          status: "S",
          mensaje: "cantidad actualizada.",
        };
      } else {
        let list_carrito = await carritoModel.findOneAndUpdate(
          { id: idCarts },
          {
            $push: {
              productos: {
                ...producto,
              },
            },
          }
        );

        response = {
          status: "S",
          mensaje: "producto adicionado",
        };
      }

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllCart() {
    try {
      let list_carrito = await carritoModel.find({});
      return list_carrito;
    } catch (error) {
      console.log(error);
    }
  }

  async getNewId() {
    let listCarrito = await carritoModel
      .find({}, { id: 1, _id: 0 })
      .sort({ id: -1 })
      .limit(1);
    let max = 1;
    if (listCarrito != null && listCarrito.length > 0) {
      max = listCarrito[0].id + 1;
    }

    return max;
  }

  async getProductsByIdCart(idCart) {
    try {
      let idCarts = Number(idCart);
      let list_carritos = await carritoModel.find({ id: idCarts });

      return list_carritos.length == 0
        ? { status: "E", mensaje: "Carrito no encontrado" }
        : list_carritos[0].productos;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCartbyId(idCart) {
    try {
      let idCarts = Number(idCart);
      let list_carritos = await carritoModel.find({ id: idCarts });
      let response = {
        status: "E",
        mensaje: "carrito no encontrado",
      };

      if (list_carritos.length > 0) {
        let respuesta = await carritoModel.deleteOne({ id: idCarts });
        response = {
          status: "S",
          mensaje: "carrito eliminado",
        };
      }

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductFromCart(idCart, idProducto) {
    try {
      let idCarts = Number(idCart);
      let idProd = Number(idProducto);

      let list_carritos = await carritoModel.find({ id: idCarts });

      let response = {
        status: "E",
        mensaje: "carrito no encontrado",
      };

      if (list_carritos.length > 0) {
        let resp_elim = await carritoModel.update(
          { id: idCarts },
          {
            $pull: {
              productos: {
                id: idProd
              }
            }
          }
        );

  


        response = {
          status: "E",
          mensaje: "producto no encontrado",
        };

        if (resp_elim.modifiedCount > 0) {
          response = {
            status: "S",
            mensaje: "producto eliminado",
          };
        }
      }

      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ctnCarritoService;
