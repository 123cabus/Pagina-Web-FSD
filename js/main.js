let productos = [];
let categoriaSeleccionada = "todos";
const contenedorProductos = document.querySelector("#contenedor-productos");

const productosGuardados = localStorage.getItem("productos");

if (productosGuardados) {
  try {
    productos = JSON.parse(productosGuardados);
    if (Array.isArray(productos)) {
      cargarProductos(productos);
    } else {
      console.error("El formato de productos en localStorage no es un array.");
    }
  } catch (error) {
    console.error("Error al parsear productos de localStorage:", error);
  }
} else {
  fetch("./js/productos.json")
    .then((response) => response.json())
    .then((data) => {
      productos = data;
      cargarProductos(productos);
      localStorage.setItem("productos", JSON.stringify(productos)); // Guardar en localStorage
    })
    .catch((error) => console.error("Error al cargar el archivo JSON:", error));
}

const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
const numerito = document.querySelector("#numerito");
const buscador = document.querySelector("#buscador");

// Evento para manejar la búsqueda
buscador.addEventListener("input", () => {
  aplicarFiltros();
});

// Manejador de clics para las categorías
botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach((boton) => boton.classList.remove("active"));
    e.currentTarget.classList.add("active");

    categoriaSeleccionada = e.currentTarget.id; // Actualiza la categoría seleccionada
    tituloPrincipal.innerText = categoriaSeleccionada !== "todos" ? e.currentTarget.innerText : "Todos los productos";

    aplicarFiltros(); // Aplicar filtros al cambiar de categoría
  });
});

// Función para aplicar los filtros de búsqueda y categoría
function aplicarFiltros() {
  const textoBusqueda = buscador.value.toLowerCase();

  // Filtrar productos según la categoría y la búsqueda
  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria = categoriaSeleccionada === "todos" || producto.categoria.id === categoriaSeleccionada;
    const coincideBusqueda = producto.titulo.toLowerCase().includes(textoBusqueda);
    return coincideCategoria && coincideBusqueda;
  });

  cargarProductos(productosFiltrados);
}

// Función para cargar productos en el contenedor
function cargarProductos(productosElegidos) {
  contenedorProductos.innerHTML = "";

  productosElegidos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;

    contenedorProductos.append(div);
  });

  actualizarBotonesAgregar();
}

function actualizarBotonesAgregar() {
  let botonesAgregar = document.querySelectorAll(".producto-agregar");

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", agregarAlCarrito);
  });
}

let productosEnCarrito = [];
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
  productosEnCarrito = JSON.parse(productosEnCarritoLS);
  actualizarNumerito();
}

function agregarAlCarrito(e) {
  Toastify({
    text: "PRODUCTO agregado",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "#418eb6",
      borderRadius: "2rem",
      textTransform: "uppercase",
      fontSize: ".75rem",
    },
    offset: {
      x: "1.5rem",
      y: "1.5rem",
    },
    onClick: function () {},
  }).showToast();

  const idBoton = e.currentTarget.id;
  const productoAgregado = productos.find((producto) => producto.id === idBoton);

  if (productosEnCarrito.some((producto) => producto.id === idBoton)) {
    const index = productosEnCarrito.findIndex((producto) => producto.id === idBoton);
    productosEnCarrito[index].cantidad++;
  } else {
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
  }

  actualizarNumerito();
  localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
  let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
  numerito.innerText = nuevoNumerito;
}
