$(document).ready();
let productos = [];
$.ajax({
  url: "../data/zapatosHockey.json",
  dataType: "json",
  success: (respuesta) => {
    cargarProductos(respuesta);
  },
});

const cargarProductos = (respuesta) => {
  productos = respuesta;

  const contenedor = document.getElementById("container");
  contenedor.innerHTML = "";

  productos.forEach((producto, indice) => {
    let card = document.createElement("div");
    card.classList.add("container", "row", "col-md-6", "col-lg-3");
    let html = `<div class="card-group">
        <img src=${producto.imagen} class="card-img-top tarjeta" alt="Hockey">
          <div class="card-body">
                <h5 class="card-title" style="text-align:center"><hr>${producto.nombre}</h5>
                  <p class="card-text" style="text-align:center">Precio $ ${producto.precio}.</p>
                  <div class="d-grid gap-2">
                    <a href="#cart"  class="btn btn-dark" onClick="agregarAlCarrito(${indice})"> 
                    <i class="fas fa-shopping-cart"> </i> Comprar </a>
                  </div>
          </div>
    </div>`;
    card.innerHTML = html;
    contenedor.appendChild(card);
  });
};

let modalCarrito = document.getElementById("cart");

const dibujarCarrito = () => {
  let total = 0;
  modalCarrito.className = "cart";
  modalCarrito.innerHTML = "";
  if (cart.length > 0) {
    cart.forEach((producto, indice) => {
      total = total + producto.precio * producto.cantidad;
      const carritoContainer = document.createElement("div");
      carritoContainer.className = "producto-carrito";
      carritoContainer.innerHTML = `
          <img class="car-img d-flex" style="width: 150px", "heigth: 250px" src="${
            producto.imagen
          }"/>
          <div class="product-details text-center">${producto.nombre}</div>
          <div class="product-details text-center" > Cantidad: ${
            producto.cantidad
          }</div>
          <div class="product-details text-center"> Precio: $ ${
            producto.precio
          }</div>
          <div class="product-details text-center"> Subtotal: $ ${
            producto.precio * producto.cantidad
          }</div>
        <button class="btn btn-danger"  id="remove-product" onClick="removeProduct(${indice})">Eliminar producto</button>
        `;
      modalCarrito.appendChild(carritoContainer);
    });

    const totalContainer = document.createElement("div");
    totalContainer.className = "total-carrito";
    totalContainer.innerHTML = `<div class= "total"> Total $ ${total}</div>
    <button class= "btn btn-warning finalizar" id="finalizar" onClick="finalizarCompra()"> FINALIZAR COMPRA </button>`;
    modalCarrito.appendChild(totalContainer);
  } else {
    modalCarrito.classList.remove("cart");
  }
};

let cart = [];
if (localStorage.getItem("cart")) {
  cart = JSON.parse(localStorage.getItem("cart"));
  dibujarCarrito();
}

const agregarAlCarrito = (indiceDelArrayProducto) => {
  const indiceEncontradoCarrito = cart.findIndex((elemento) => {
    return elemento.id === productos[indiceDelArrayProducto].id;
  });
  if (indiceEncontradoCarrito === -1) {
    const productoAgregar = productos[indiceDelArrayProducto];
    productoAgregar.cantidad = 1;
    cart.push(productoAgregar);
    actualizarStorage(cart);
    dibujarCarrito();
  } else {
    cart[indiceEncontradoCarrito].cantidad += 1;
    actualizarStorage(cart);
    dibujarCarrito();
  }
};

const removeProduct = (indice) => {
  cart.splice(indice, 1);
  actualizarStorage(cart);
  dibujarCarrito();
};
const finalizarCompra = () => {
  const total = document.getElementsByClassName("total")[0].innerHTML;
  modalCarrito.innerHTML = "";
  const compraFinalizada = `<div class="compra-finalizada">
  <p class="compra-parrafo"> YA CASI ES TUYA LA COMPRA, EL ${total} </p></div>
  <div class="datos-cliente">
  <p class="datos-parrafo"> Complete el formulario con sus datos para coordinar la entrega</p>
  <button id="myForm" class= "btn btn-success formulario"  onClick="dibujarFormu()"> 
  <i class="fas fa-pen"></i> Formulario </button>
  </div>`;
  modalCarrito.innerHTML = compraFinalizada;
};

$("#myForm").click(() => {
  $("#tarjetas").hide();
});

const dibujarFormu = () => {
  modalCarrito.innerHTML = "";
  const formulario = `
  <h2 class="datEnvio"> DATOS PARA EL ENVÍO </h2>
  <div class="contact__secction-container">
   <div class="row form-label">
     <div class="contact__secction__item ">
       <label class="datEnvio"><strong>Nombre</strong></label>
       <input type="text" id="nombre" placeholder="Nombre" class="form-control" />
     </div>
     <div class="contact__secction__item">
       <label class="datEnvio"><strong>E-mail</strong></label>
       <input type="text" id="mail" placeholder="E-mail" class="form-control"/>
     </div>
     <div class="contact__secction__item">
       <label class="datEnvio floatingInput"><strong>Telefono</strong></label>
       <input type="text" id="telefono" placeholder="Telefono"  class="form-control"/>
     </div>
     <div class="contact__secction__item">
       <label class="datEnvio" for="floatingInput"><strong> Domicilio</strong> </label>
       <input type="text" id="domicilio" placeholder="Domicilio" class="form-control" />
     </div>
     <div class="contact-button">
       <button type="button" class="btn btn-danger envio" onClick="mostrarMensaje()" > 
       <i class="fas fa-check"></i> Confirmar </button>
     </div>
   </div>
 </div>`;
  modalCarrito.innerHTML = formulario;
};

const mostrarMensaje = () => {
  const nombreCliente = document.getElementById("nombre").value;
  const domicilioCliente = document.getElementById("domicilio").value;
  const mailCliente = document.getElementById("mail").value;
  modalCarrito.innerHTML = "";
  let mensaje = `
  <div class="mensaje-final">Gracias ${nombreCliente} por su compra! <br> 
  Recibira un mail de confirmación por su compra a ${mailCliente} <br>
  En 72 horas recibira su paquete en ${domicilioCliente} </div>`;
  modalCarrito.innerHTML = mensaje;
};

const actualizarStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};
