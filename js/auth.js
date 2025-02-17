// Objeto de credenciales del admin
const adminCredenciales = {
  username: "admin",
  password: "123",
};

// Verificar si el admin está logueado en el Local Storage, si es asi, mostrar el formulario de carga de productos
const sesionAdmin = localStorage.getItem("sesion-admin") === "true";

// Referencias a los elementos del DOM
const formLogin = document.querySelector("#login-form");
const seccionLogin = document.querySelector("#login-section");
const seccionAdmin = document.querySelector("#admin-section");

// Verificar si el admin está logueado al cargar la página
window.addEventListener("load", () => {
  if (sesionAdmin) {
    mostrarOpcionesAdmin();
  }
});

// Función de login
function loginAdmin(username, password) {
  return username === adminCredenciales.username && password === adminCredenciales.password;
}

// Manejo del formulario de inicio de sesión
formLogin.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  if (loginAdmin(username, password)) {
    alert("Login exitoso");

    // Guardar el estado de la sesión en Local Storage
    localStorage.setItem("sesion-admin", "true");

    mostrarOpcionesAdmin();
  } else {
    alert("Credenciales incorrectas");
  }
});

let productos = [];

fetch("./js/productos.json")
  .then((response) => response.json())
  .then((data) => {
    productos = data;
  });

// Mostrar opciones del admin si está logueado
function mostrarOpcionesAdmin() {
  seccionLogin.style.display = "none";
  seccionAdmin.innerHTML = `
     <div class="login-section">
     <div class="form-container" id="form-container">
        <h2 class="titulo-principal">Agregar nuevo producto</h2>
        <form class="form-agregar-producto" id="form-agregar-producto">
          <input type="text" id="titulo" placeholder="Título del producto" required />
          <input type="number" id="precio" placeholder="Precio" required />
          <input type="file" id="imagen" accept="image/*" required />
          <select id="categoria" required>
            <option value="" disabled selected>Seleccione una categoría</option>
            <option value="accesorios">Accesorios</option>
            <option value="bolsos">Bolsos</option>
          </select>
          <img id="preview-imagen" src="" alt="Vista previa" style="max-width: 200px; display: none;" />
          <button type="submit">Agregar Producto</button>
        </form>
        <div class="botones-admin">
        <a style="color: var(--red);" href="../index.html"><i class="bi bi-arrow-left"></i> Volver al inicio</a>
        <button class="cerrar-sesion" id="cerrar-sesion">Cerrar sesión</button>
      
      </div>
    `;

  setupAdminFunctions();
}

// Función para agregar la lógica a los botones del panel admin
function setupAdminFunctions() {
  const formAgregarProducto = document.querySelector("#form-agregar-producto");
  const cerrarSesionBtn = document.querySelector("#cerrar-sesion");
  const inputImagen = document.querySelector("#imagen");
  const previewImagen = document.querySelector("#preview-imagen");

  // Manejo de la vista previa de la imagen
  inputImagen.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        previewImagen.src = loadEvent.target.result;
        previewImagen.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  formAgregarProducto.addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = document.querySelector("#titulo").value;
    const precio = parseFloat(document.querySelector("#precio").value);
    const imagenFile = inputImagen.files[0];
    const categoriaSelect = document.querySelector("#categoria");
    const categoriaId = categoriaSelect.value;

    if (!titulo || !precio || !categoriaId) {
      alert("Por favor completa todos los campos.");
      return;
    }

    if (!imagenFile) {
      alert("Por favor selecciona una imagen");
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const categorias = {
        bolsos: { id: "bolsos", nombre: "Bolsos" },
        accesorios: { id: "accesorios", nombre: "Accesorios" },
      };

      const nuevoProducto = {
        id: `producto-${Date.now()}`, 
        titulo: titulo,
        precio: precio,
        imagen: loadEvent.target.result, 
        categoria: categorias[categoriaId],
      };

      agregarProducto(nuevoProducto);
      alert("Producto agregado exitosamente");
      formAgregarProducto.reset();
      previewImagen.style.display = "none";
    };

    reader.readAsDataURL(imagenFile); 
  });
  
}

function agregarProducto(nuevoProducto) {
  productos.push(nuevoProducto);
  localStorage.setItem("productos", JSON.stringify(productos));
}


document.getElementById("borrar-storage").addEventListener("click", function () {
  localStorage.clear();
  location.reload();
});
document.getElementById("formAgregarProducto").addEventListener("submit", function (e) {
  e.preventDefault();

  const nuevoProducto = {
    id: Date.now().toString(), // Generar un ID único
    titulo: document.getElementById("titulo").value,
    categoria: {
      id: document.getElementById("categoria").value,
    },
    precio: parseFloat(document.getElementById("precio").value),
    imagen: document.getElementById("imagen").value,
  };

  // Obtener los productos existentes desde localStorage
  const productosLocalStorage = JSON.parse(localStorage.getItem("productos")) || [];

  // Agregar el nuevo producto al array
  productosLocalStorage.push(nuevoProducto);

  // Guardar el array actualizado en localStorage
  localStorage.setItem("productos", JSON.stringify(productosLocalStorage));

  alert("Producto agregado correctamente");


});
