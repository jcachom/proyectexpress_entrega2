const url_ini_producto = "http://localhost:8080/productos";
const url_ini_carrito = "http://localhost:8080/carrito";

ListarCarrito();

$(document).on("click", ".classbtn_delete", function (event) {
  let id = this.id;
  let idProducto = id.split("_")[2];

  Swal.fire({
    title: "Eliminar",
    text: "Está seguro de eliminar?",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Aceptar",
  }).then(function (result) {
    if (result.value) {
      $("#tr_" + idProducto).css("background-color", "#ffca39");
      $("#tr_" + idProducto).fadeOut(1000, function () {
        $("#tr_" + idProducto).remove();
        EliminarProductoCarrito(idProducto);
      });
    }
  });
});

function EliminarProductoCarrito(idProducto) {
  let idCartUsuario = localStorage.getItem("idcartusuario");
  let ruta = url_ini_carrito + "/" + idCartUsuario + "/productos/" + idProducto;

  fetch(ruta, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: "",
  })
    .then((res) => res.json())
    .then((res) => {
      Swal.fire("Producto retirado");
      ActualizarSubTotales();
    });
}

function EliminarCarrito() {
  let idCartUsuario = localStorage.getItem("idcartusuario");
  let ruta = url_ini_carrito + "/" + idCartUsuario;

  fetch(ruta, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: "",
  })
    .then((res) => res.json())
    .then((res) => {
      $("#tb_listCarritoBody").html("");
      ActualizarSubTotales();
    });
}

function ActualizarSubTotales() {
  let SubTotalImporte = 0;
  $("#tb_listCarrito tbody>tr").each(function (i, item) {
    let idProducto = this.id.split("_")[1];
    SubTotalImporte =
      SubTotalImporte + Number($(`#txt_subTotal_${idProducto}`).val());
  });

  let impuesto = parseFloat(
    Math.round(SubTotalImporte * 0.18 * 100) / 100
  ).toFixed(2);

  let totalCobro = parseFloat(SubTotalImporte) + parseFloat(impuesto);
  $("#txt_subtotal").val(SubTotalImporte);
  $("#txt_impuesto").val(impuesto);
  $("#txt_total").val(totalCobro);
}

function generarHtmlTable(listCarritoArray) {
  $("#tb_listCarritoBody").html("");

  if (listCarritoArray != null) {
    let html = "";
    let botonEliminar = "";
    let inputCant = "";
    let txtSubTotal = "";
    let hdInput = "";
    let subTotal = 0;
    for (let item of listCarritoArray) {
      botonEliminar = `<button type='button' id='btn_eliminar_${item.id}'        
              class='btn btn-sm mr-1 btn-outline-danger classbtn_delete'   title='Eliminar' ><i class='fa fa-trash'></i></button>`;

      inputCant = `<input type='number' id='txt_eliminar_${item.id}' value=${item.cant_pedido}   
         class='form-control col-12 classtxt_cantidad' disabled/>`;

      subTotal = item.precio * item.cant_pedido;

      txtSubTotal = `<input type='number' id='txt_subTotal_${item.id}' value=${subTotal}      
        class='form-control col-12 classtxt_SubTotal' disabled />`;

      hdInput = ` <input type='hidden' id=hd_precio_${item.id} value=${item.precio}/> `;

      html =
        html +
        ` <tr id='tr_${item.id}'  >
        <td>${item.codigo}   </td>
        <td> ${item.descripcion}   </td>
        <td>  ${inputCant}  </td>
        <td>${item.precio} ${hdInput}  </td>
        <td>${txtSubTotal}  </td>
        <td>${botonEliminar} </td>
        </tr>`;
    }

    $("#tb_listCarritoBody").html(html);
    ActualizarSubTotales();
  }
}

function ListarCarrito() {
  $("#tb_listCarritoBody").html("");

  let idCartUsuario = localStorage.getItem("idcartusuario");
  let totProductos = 0;
  let ruta = url_ini_carrito + "/" + idCartUsuario + "/productos";

  fetch(ruta)
    .then((res) => res.json())
    .then((res) => {
      generarHtmlTable(res);
    })
    .catch((err) => console.error(err));
}

$(document).on("click", "#btn_confirmar", function (event) {
  Swal.fire({
    title: "Confirmar compra.",
    text: "Está seguro de la compra?",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Aceptar",
  }).then(function (result) {
    if (result.value) {
      EliminarCarrito();

      Swal.fire("El comprobante ha sido enviado a su correo.");
    }
  });
});
