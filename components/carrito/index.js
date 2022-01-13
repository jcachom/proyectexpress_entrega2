const { Router } = require("express");

const ctnCarritoController = require("./controller/carritoController");
const carritoController = new ctnCarritoController();

const router = new Router();

let apiCarrito = (app) => {
  app.use("/carrito", router);

  router.post("/:usuario?", (req, res, next) => {
    let pusuario = req.params.usuario;
    console.log("Creación carrito");
    const main = async () => {
      let response = await carritoController.createCart(pusuario);
      res.json(response);
    };
    main();
  });

  router.delete("/:id", (req, res, next) => {
    console.log("Eliminar carrito");
    let idCart = req.params.id;
    const main = async () => {
      let response = await carritoController.deleteCartbyId(idCart);
      res.json(response);
    };
    main();
  });

  router.get("/:id/productos", (req, res, next) => {
    console.log("Carrito por Id");
    let idCart = req.params.id;
    const main = async () => {
      let response = await carritoController.getProductsByIdCart(idCart);
      res.json(response);
    };
    main();
  });

  router.post("/:id/productos", (req, res, next) => {
    console.log("Adición producto de carro");
    let idCart = req.params.id;
    let producto = req.body;
    const main = async () => {
      let response = await carritoController.addProductCart(idCart, producto);
      res.json(response);
    };
    main();
  });

  router.delete("/:id/productos/:id_prod", (req, res, next) => {
    console.log("Eliminar producto de carro");
    let idCart = req.params.id;
    let idProducto = req.params.id_prod;

    const main = async () => {
      let response = await carritoController.deleteProductFromCart(
        idCart,
        idProducto
      );
      res.json(response);
    };
    main();
  });
};

exports.apiCarrito = apiCarrito;
