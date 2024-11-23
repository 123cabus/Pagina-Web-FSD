function cargarDetalleProducto(id, productos) {
    const producto = productos.find(p => p.id === id); 
    const contenedorDetalle = document.getElementById('contenedor-detalle');
  
    if (producto) {
      const tarjetaProducto = `
        <div class="producto-detalle">
          <img src="${producto.imagen}" alt="${producto.titulo}" class="imagen-producto" />
          <div class="info-producto">
            <h3>${producto.titulo}</h3>
            <p>Categoría: ${producto.categoria.nombre}</p>
            <p class="precio">$${producto.precio}</p>
            <button class="boton-agregar">Agregar al carrito</button>
          </div>
        </div>
      `;
      contenedorDetalle.innerHTML = tarjetaProducto;
    } else {
      contenedorDetalle.innerHTML = "<p>Producto no encontrado.</p>";
    }
  }
  
  function obtenerProductos() {
    fetch('./js/productos.json') 
      .then(response => response.json())
      .then(productos => {
        const urlParams = new URLSearchParams(window.location.search);
        const idProducto = urlParams.get('id');
        console.log('ID del producto:', idProducto);  
  
        if (idProducto) {
          cargarDetalleProducto(idProducto, productos);
        } else {
          document.getElementById('contenedor-detalle').innerHTML = "<p>Producto no encontrado.</p>";
        }
      })
      .catch(error => {
        console.error('Error al cargar el archivo JSON:', error);
        document.getElementById('contenedor-detalle').innerHTML = "<p>No se pudo cargar el producto.</p>";
      });
  }
  
  obtenerProductos();
  