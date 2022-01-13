const { Router } = require("express");
const ctnProductoController = require("./controller/productoController");
const productController = new ctnProductoController();

const router = new Router();
const isAdmin = true;

const responseNoAutorizado = {
  error: -1,
  descripcion: "metodo no autorizado",
};

const apiProducto = (app) => {
  /*
    app.use(function (req, res, next) {
      console.log('Time:', Date.now());
      next();
    });
    */

  app.use("/productos", router);

  router.get("/:id?", (req, res, next) => {
    let idProducto = req.params.id;
    const main = async () => {
      let response = null;
      if (idProducto == null) {
        console.log("Listado Productos Todos");
        response = await productController.getAll();
      } else {
        console.log("Listado Productos por Id");
        response = await productController.getbyId(idProducto);
      }
      res.json(response);
    };
    main();
  });

  router.post("/", (req, res, next) => {
    console.log("Creación producto");
    let producto = req.body;
    const main = async () => {
      let response = await productController.save(producto);
      res.json(response);
    };

    if (isAdmin) {
      main();
    } else {
      res.send(responseNoAutorizado);
    }
  });

  router.put("/:id", (req, res, next) => {
    console.log("Actualización producto");
    let producto = req.body;
    let idProducto = req.params.id;

    const main = async () => {
      let response = await productController.update(producto, idProducto);
      res.json(response);
    };

    if (isAdmin) {
      main();
    } else {
      res.send(responseNoAutorizado);
    }
  });

  router.delete("/:id", (req, res, next) => {
    console.log("Eliminación producto");
    let idProducto = req.params.id;
    const main = async () => {
      let response = await productController.deletebyId(idProducto);
      res.json(response);
    };

    if (isAdmin) {
      main();
    } else {
      res.send(responseNoAutorizado);
    }
  });
};

exports.apiProducto = apiProducto;
