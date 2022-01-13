const { apiProducto } = require("../components/producto");
const { apiCarrito } = require("../components/carrito");

const serverRouter = (app) => {
  apiProducto(app);
  apiCarrito(app);

  app.get("/", (req, res, next) => {
    console.log(req.body);
    // res.send("Todo ok route general");
    res.sendfiles("index");
  });

  app.use(function (req, res) {
    res.status(404).send({ mensaje: "ruta no encontrada" });
  });
};

module.exports = serverRouter;
