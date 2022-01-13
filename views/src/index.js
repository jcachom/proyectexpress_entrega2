const url_ini_producto = "http://localhost:8080/productos";
const url_ini_carrito = "http://localhost:8080/carrito";

CargarInicialProductos();
CargarIdCarrito();

function CargarIdCarrito() {
  let usuario = "jcachom";
  let ruta = url_ini_carrito + "/" + usuario;

  fetch(ruta, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: "",
  })
    .then((res) => res.json())
    .then((res) => {
      localStorage.setItem("idcartusuario", res.id);
      VisualizarCantidProductoCarrito();
    });
}

function CargarInicialProductos() {
  $("#divSeccion1").html("");

  fetch(url_ini_producto)
    .then((res) => res.json())
    .then((res) => {
      let inner = "";
      let dataList = JSON.parse(JSON.stringify(res));

      console.log(dataList);

      let inicio = true;
      let fila = 0;

      dataList.forEach((element) => {
        if (inicio) {
          inner = inner + `<div class="row">`;
        }
        inner =
          inner +
          `<div class="col-md-4">
       <div class="card" style="width: 18rem;">
      <img src=${element.foto_url} class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${element.nombre} Id:${element.id} </h5>
            <p class="card-text">${element.descripcion}</p>

            <h6 class="card-title">stock:${element.stock} precio:${element.precio} </h6>
                              
          <input type="number" id="txtcant_${element.id}"    value="1" class="form-control" required />

          <button type='button' class='btn btn-danger btn-block classbtn_adcart' id='btnaddcart_${element.id}'>
          <i class='fa fa-save'></i> + Agregar a Carrito </button>

          <p>
          
          <button type='button' class='btn btn-outline-dark classbtn_edit' id='btnedit_${element.id}'>
          <i class='fa fa-save'></i>Editar</button>

          <button type='button' class='btn btn-outline-dark classbtn_elim' id='btnelim_${element.id}'>
          <i class='fa fa-save'></i>Eliminar</button>

          </p>

      
        </div>
      </div>
    </div>
      `;

        fila = fila + 1;
        inicio = false;
        if (fila >= 3) {
          inner = inner + `</div>`;
          inicio = true;
          fila = 0;
        }
      });

      $("#divSeccion1").html(inner);
    })
    .catch((err) => console.error(err));
}

function ActivarPanel(panelActivar, panelOcultar) {
  $("#" + panelOcultar).removeClass("active");
  $("#" + panelOcultar).addClass("fade");
  $("#" + panelActivar).trigger("reset");
  $("#" + panelActivar).removeClass("fade");
  $("#" + panelActivar).addClass("active");
}

$(document).ready(function () {
  $("#btnnuevo_producto").click(function () {
    ActivarPanel("divPanel_edit", "divPanel_listado");
    $("#div_accionProducto").html("NUEVO PRODUCTO");
  });

  $("#btnedit_regresar").click(function () {
    ActivarPanel("divPanel_listado", "divPanel_edit");
  });

  $(document).on("click", ".classbtn_adcart", function (event) {
    try {
      let idProducto = this.id.split("_")[1];
      let cantProducto = $(`#txtcant_${idProducto}`).val();
      if (cantProducto == "" || cantProducto == 0) {
        Swal.fire("Ingresar una cantidad");
        return;
      }

      let idCartUsuario = localStorage.getItem("idcartusuario");
      let ruta = url_ini_producto + "/" + idProducto;

      Swal.fire({
        title: "Adición",
        text: "Confirma adicionar el producto al carrito.",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
      }).then(function (result) {
        if (result.value) {
          fetch(ruta)
            .then((res) => res.json())
            .then((res) => {
              let producto = {
                ...res,
                cant_pedido: cantProducto,
              };
            
              AddProductCart(idCartUsuario, producto);
            })
            .catch((err) => console.error(err));
        }
      });
    } catch (e) {
      return false;
    }
  });

  $(document).on("click", ".classbtn_edit", function (event) {
    try {
      ActivarPanel("divPanel_edit", "divPanel_listado");
      $("#div_accionProducto").html("EDITAR PRODUCTO");

      let idProducto = this.id.split("_")[1];
      let ruta = url_ini_producto + "/" + idProducto;

      fetch(ruta)
        .then((res) => res.json())
        .then((res) => {
          $("#txt_id").val(res.id);
          $("#txt_codigo").val(res.codigo);
          $("#txt_nombre").val(res.nombre);
          $("#txt_descripcion").val(res.descripcion);
          $("#txt_foto_url").val(res.foto_url);
          $("#txt_precio").val(res.precio);
          $("#txt_stock").val(res.stock);
        })
        .catch((err) => console.error(err));
    } catch (e) {
      return false;
    }
  });

  $(document).on("click", ".classbtn_elim", function (event) {
    try {
      let idProducto = this.id.split("_")[1];
      let ruta = url_ini_producto + "/" + idProducto;

      Swal.fire({
        title: "Eliminar",
        text: "Está seguro de eliminar producto con id ?" + idProducto,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
      }).then(function (result) {
        if (result.value) {
          fetch(ruta, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            // body: JSON.stringify(producto)
            body: "",
          })
            .then((res) => {
              CargarInicialProductos();
              Swal.fire("Producto eliminado.");

            })
            .then((res) => {
              console.log(res);
            });
        }
      });
    } catch (e) {
      return false;
    }
  });

  $("#btnguardar_producto").click(function () {
    $("#div_msj_regproducto").html("");

    let vidproducto = $("#txt_id").val();
    let vcodigo = $("#txt_codigo").val();
    let vnombre = $("#txt_nombre").val();
    let vdescripcion = $("#txt_descripcion").val();
    let vfoto_url = $("#txt_foto_url").val();
    let vprecio = $("#txt_precio").val();
    let vstock = $("#txt_stock").val();

    let producto = {
      id: vidproducto,
      codigo: vcodigo,
      nombre: vnombre,
      descripcion: vdescripcion,
      foto_url: vfoto_url,
      precio: vprecio,
      stock: vstock,
    };

    if (vidproducto == "") {
      fetch(url_ini_producto, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(producto),
      })
        .then((res) => {
          //res.json()
          msj_Alertas(0, "Producto adicionado.", "div_msj_regproducto");
          $("#form_regproducto").trigger("reset");

          CargarInicialProductos();
        })
        .then((res) => {
          console.log(res);
        });
    } else {
      let ruta = url_ini_producto + "/" + vidproducto;
      fetch(ruta, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(producto),
      })
        .then((res) => {
          CargarInicialProductos();
          msj_Alertas(0, "Producto actualizado.", "div_msj_regproducto");
        })
        .then((res) => {
          console.log(res);
        });
    }
  });
});

function AddProductCart(idCartUsuario, producto) {
  let ruta = url_ini_carrito + "/" + idCartUsuario + "/productos";
  fetch(ruta, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(producto),
  })
    .then((res) => {
      VisualizarCantidProductoCarrito();
      //Swal.fire("Producto adicionado.");
    })
    .then((res) => {
      console.log(res);
    });
}

function VisualizarCantidProductoCarrito() {
  let idCartUsuario = localStorage.getItem("idcartusuario");
  let totProductos = 0;
  let ruta = url_ini_carrito + "/" + idCartUsuario + "/productos";

  fetch(ruta)
    .then((res) => res.json())
    .then((res) => {
      for (let producto of res) {
        totProductos = totProductos + parseInt(producto.cant_pedido, 10);
      }

      document.getElementById("divCantCarrito").innerHTML = totProductos;
    })
    .catch((err) => console.error(err));
}

function msj_Alertas(op, msj, contenedor) {
  var clase = "";
  if (op == 0) {
    //Mensaje exitoso
    clase = "success";
    titulo = "Operación Exitosa! ";
  } else if (op == 1) {
    //Mensaje Informativo
    clase = "info";
    titulo = "Información! ";
  } else if (op == 2) {
    //Mensaje de advertencia
    clase = "warning";
    titulo = "Advertencia! ";
  } else if (op == 3) {
    //Mensaje de error
    clase = "danger";
    titulo = "Error! ";
  }
  var html =
    '<div class="alert alert-' +
    clase +
    ' alert-dismissible">' +
    "<strong>" +
    titulo +
    "</strong> " +
    msj +
    "</div>";
  $("#" + contenedor).html(html);
}
