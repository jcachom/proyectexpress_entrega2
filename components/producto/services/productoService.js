let fs = require("fs");
let path = require("path");

class ctnProductoService {
  constructor(url) {
    this.url = "./components/producto/services/productos.json";
  }
  async save(product) {
    try {
      let _timestamp = Date.now();
      let list_productos = await this.getAll();

      let new_product_id = await this.getNewId(list_productos);
      let new_product = {
        ...product,
        id: new_product_id,
        timestamp: _timestamp,
      };
      list_productos.push(new_product);
      let contenido = JSON.stringify(list_productos, null, 2);
      await fs.promises.writeFile(`${this.url}`, contenido);

      return new_product;
    } catch (error) {
      console.log(error);
    }
  }

  async getNewId(productos) {
    let mayor = 0;
    productos.forEach((element) => {
      if (element.id > mayor) {
        mayor = element.id;
      }
    });
    return mayor + 1;
  }

  async getAll() {
    try {
      console.log(`url:${this.url}`);
      let productos = await fs.promises.readFile(`${this.url}`, "utf-8");
      let list_producto = JSON.parse(productos);
      return list_producto;
    } catch (error) {
      console.log(error);
    }
  }

  async getbyId(id) {
    try {
      let productos = await fs.promises.readFile(`${this.url}`, "utf-8");
      let list_productos = JSON.parse(productos);
      let respuesta = null;
      if (list_productos.length > 0) {
        respuesta = list_productos.find((item) => item.id == id);
      }

      return respuesta == null
        ? { status: "E", mensaje: "producto no encontrado" }
        : respuesta;
    } catch (error) {
      console.log(error);
    }
  }

  async deletebyId(id) {
    try {
      let productos = await fs.promises.readFile(`${this.url}`, "utf-8");
      let list_productos = JSON.parse(productos);
      const index = list_productos.findIndex((item) => item.id == id);
      if (index !== -1) {
        list_productos.splice(index, 1);
        let contenido = JSON.stringify(list_productos, null, 2);
        await fs.promises.writeFile(`${this.url}`, contenido);

        return { status: "S", mensaje: "producto eliminado." };
      } else {
        return { status: "E", mensaje: "producto no encontrado." };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async update(producto, id) {
    let productos = await fs.promises.readFile(`${this.url}`, "utf-8");
    let list_productos = JSON.parse(productos);

    const new_producto = { id: Number(id), ...producto };
    const index = list_productos.findIndex((item) => item.id == id);
    if (index !== -1) {
      list_productos[index] = new_producto;

      let contenido = JSON.stringify(list_productos, null, 2);
      await fs.promises.writeFile(`${this.url}`, contenido);

      return { status: "S", mensaje: "producto actualizado." };
    } else {
      return { status: "E", mensaje: "producto no encontrado." };
    }
  }
}

module.exports = ctnProductoService;
