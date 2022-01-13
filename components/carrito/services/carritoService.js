let fs = require("fs");
let path = require("path");

class ctnCarritoService {
  constructor(url) {
    this.url = "./components/carrito/services/carrito.json";
  }
  async createCart(usuario) {
    if (usuario == null) {
      usuario = "";
    }
    try {
      let _timestamp = Date.now();
      let list_carrito = await this.getAllCart();

      let oCarrito = null;
      if (usuario != "") {
        oCarrito = list_carrito.find((item) => item.usuario == usuario);
      }

      let new_carrito = null;

      if (usuario == "" || oCarrito == null) {
        let new_carrito_id = await this.getNewId(list_carrito);
        new_carrito = {
          usuario: usuario,
          id: new_carrito_id,
          timestamp: _timestamp,
          productos: [],
        };
        list_carrito.push(new_carrito);
        let contenido = JSON.stringify(list_carrito, null, 2);
        await fs.promises.writeFile(`${this.url}`, contenido);
      } else {
        new_carrito = {
          ...oCarrito,
        };
      }

      return new_carrito;
    } catch (error) {
      console.log(error);
    }
  }

  async addProductCart(idCart, producto) {
    try {
      let carritos = await fs.promises.readFile(`${this.url}`, "utf-8");
      let list_carritos = JSON.parse(carritos);
      let oCarrito = list_carritos.find((item) => item.id == idCart);
      let response = {
        status: "E",
        mensaje: "carrito no encontrado",
      };

      if (oCarrito != null) {
        oCarrito.productos.push(producto);
        let contenido = JSON.stringify(list_carritos, null, 2);
        await fs.promises.writeFile(`${this.url}`, contenido);
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
      console.log(`url:${this.url}`);
      let carritos = await fs.promises.readFile(`${this.url}`, "utf-8");
      let list_carrito = JSON.parse(carritos);
      return list_carrito;
    } catch (error) {
      console.log(error);
    }
  }

  async getNewId(carritos) {
    let mayor = 0;
    carritos.forEach((element) => {
      if (element.id > mayor) {
        mayor = element.id;
      }
    });
    return mayor + 1;
  }

  async getProductsByIdCart(idCart) {
    try {
      let carritos = await fs.promises.readFile(`${this.url}`, "utf-8");
      let list_carritos = JSON.parse(carritos);
      let respuesta = null;
      if (list_carritos.length > 0) {
        respuesta = list_carritos.find((item) => item.id == idCart);
      }
      return respuesta == null
        ? { status: "E", mensaje: "Carrito no encontrado" }
        : respuesta.productos;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCartbyId(idCart) {
    try {
      let carritos = await fs.promises.readFile(`${this.url}`, "utf-8");
      let list_carritos = JSON.parse(carritos);
      const index = list_carritos.findIndex((item) => item.id == idCart);

      let response = {
        status: "E",
        mensaje: "carrito no encontrado",
      };

      if (index !== -1) {
        list_carritos.splice(index, 1);
        let contenido = JSON.stringify(list_carritos, null, 2);
        await fs.promises.writeFile(`${this.url}`, contenido);
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
      let carritos = await fs.promises.readFile(`${this.url}`, "utf-8");
      let list_carritos = JSON.parse(carritos);
      let oCarrito = list_carritos.find((item) => item.id == idCart);

      let response = {
        status: "E",
        mensaje: "carrito no encontrado",
      };

      if (oCarrito != null) {
        const index = oCarrito.productos.findIndex(
          (item) => item.id == idProducto
        );
        response = {
          status: "E",
          mensaje: "producto no encontrado",
        };
        if (index !== -1) {
          oCarrito.productos.splice(index, 1);
          let contenido = JSON.stringify(list_carritos, null, 2);
          await fs.promises.writeFile(`${this.url}`, contenido);

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
