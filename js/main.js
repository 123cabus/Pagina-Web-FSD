document.addEventListener("DOMContentLoaded", function() {
  // Cargar los productos desde el archivo JSON
  fetch("./js/productos.json")
    .then((response) => response.json())
    .then((productosJson) => {
      // Obtener los productos del localStorage (si existen)
      const productosLocalStorage = JSON.parse(localStorage.getItem("productos")) || [];

      // Combinar los productos del JSON con los del localStorage
      const productosCombinados = [...productosJson, ...productosLocalStorage];

      // Mostrar los productos combinados
      mostrarProductos(productosCombinados);

      // Filtrar productos por categoría
      const todosButton = document.getElementById("todos");
      const accesoriosButton = document.getElementById("accesorios");
      const bolsosButton = document.getElementById("bolsos");

      todosButton.addEventListener("click", () => {
        mostrarProductos(productosCombinados); // Mostrar todos
      });

      accesoriosButton.addEventListener("click", () => {
        const accesorios = productosCombinados.filter(
          (producto) => producto.categoria.id === "accesorios"
        );
        mostrarProductos(accesorios); // Filtrar categoría accesorios
      });

      bolsosButton.addEventListener("click", () => {
        const bolsos = productosCombinados.filter(
          (producto) => producto.categoria.id === "bolsos"
        );
        mostrarProductos(bolsos); // Filtrar categoría bolsos
      });

      // Función para mostrar los productos
      function mostrarProductos(productos) {
        const contenedorProductos = document.getElementById("contenedor-productos");
        contenedorProductos.innerHTML = ""; // Limpiar el contenedor antes de agregar productos

        productos.forEach((producto) => {
          const productoDiv = document.createElement("div");
          productoDiv.classList.add("producto");
          productoDiv.innerHTML = `
            <a href="./html/detalle.html?id=${producto.id}">
              <img src="${producto.imagen}" alt="${producto.titulo}" />
              <h3>${producto.titulo}</h3>
              <p>$${producto.precio}</p>
            </a>
          `;
          contenedorProductos.appendChild(productoDiv);
        });
      }
    });
});
