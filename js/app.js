const apiBaseUrl = 'https://localhost:7022/api/ProductosD/';

// Obtener y mostrar productos
function fetchProductos() {
    fetch(`${apiBaseUrl}GetProducts`)
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener los productos');
            return response.json();
        })
        .then(data => {
            const productosList = document.getElementById('productos-list');
            productosList.innerHTML = '';

            data.forEach(producto => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.precio.toFixed(2)}</td>
                    <td>${new Date(producto.fechaCreacion).toLocaleDateString()}</td>
                    <td>
                        <button onclick="editarProducto(${producto.id}, '${producto.nombre}', ${producto.precio})">Editar</button>
                        <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
                    </td>
                `;

                productosList.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Añadir o editar producto
const productoForm = document.getElementById('producto-form');
productoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const precio = parseFloat(document.getElementById('precio').value);

    const producto = {
        nombre,
        precio
    };

    const productoID = productoForm.dataset.id;

    if (productoID) {
        // Editar producto
        fetch(`${apiBaseUrl}UpdateProduct/${productoID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al actualizar el producto');
                return response.json();
            })
            .then(() => {
                fetchProductos();
                productoForm.reset();
                delete productoForm.dataset.id;
            })
            .catch(error => console.error('Error:', error));
    } else {
        // Crear producto
        fetch(`${apiBaseUrl}CreateProduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al crear el producto');
                return response.json();
            })
            .then(() => {
                fetchProductos();
                productoForm.reset();
            })
            .catch(error => console.error('Error:', error));
    }
});

// Editar producto
function editarProducto(id, nombre, precio) {
    document.getElementById('nombre').value = nombre;
    document.getElementById('precio').value = precio;
    productoForm.dataset.id = id;
}

// Eliminar producto
function eliminarProducto(id) {
    fetch(`${apiBaseUrl}DeleteProduct/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) throw new Error('Error al eliminar el producto');
            fetchProductos();
        })
        .catch(error => console.error('Error:', error));
}

// Cargar productos al cargar la página
document.addEventListener('DOMContentLoaded', fetchProductos);
