
let centrosMedicos = [];


// Cargar centros médicos
function loadCentrosMedicos() {
    const tablaCentros = document.querySelector("#tabla-centros tbody");
    tablaCentros.innerHTML = ""; // Limpiar contenido previo

    fetch("https://localhost:44346/api/CentrosMedicos/Listar") // Llamar a la API
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(centros => {
            console.log("Datos recibidos:", centros);

            if (!Array.isArray(centros) || centros.length === 0) {
                throw new Error("La respuesta de la API no contiene datos válidos.");
            }

            centros.forEach(centro => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${centro.centroID}</td>
                    <td>${centro.nombre}</td>
                    <td>${centro.direccion}</td>
                    <td>${centro.telefono}</td>
                    <td>${centro.email}</td>
                    <td class="actions">
                        <button class="btn btn-warning edit-centro" data-id="${centro.centroID}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger delete-centro" data-id="${centro.centroID}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tablaCentros.appendChild(row);
            });

            addCentrosMedicosActionEvents(); // Vincula eventos a los botones
        })
        .catch(error => {
            console.error("Error al cargar centros médicos:", error);
            alert(`No se pudieron cargar los centros médicos: ${error.message}`);
        });
}



// Añadir eventos a los botones de acción
function addCentrosMedicosActionEvents() {
    document.querySelectorAll('.edit-centro').forEach(btn => {
        //boton editar
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            
            fetch(`https://localhost:44346/api/CentrosMedicos/Buscar/${id}`)
                .then(response => {
                    if (!response.ok) throw new Error('No se pudo obtener el centro médico');
                    return response.json();
                })
                .then(centro => {
                    openEditModal(id, centro); // muestra modal y llena campos
                })
                .catch(error => {
                    console.error('Error al obtener centro:', error);
                    showNotification('No se pudo cargar el centro médico', 'error');
                });
        });
    });
    
    // Botones de eliminar
document.querySelectorAll('.delete-centro').forEach(btn => {
    btn.addEventListener('click', function () {
        const id = parseInt(this.getAttribute('data-id'));

        if (!confirmDelete(id, '', 'el centro médico')) return;

        fetch(`https://localhost:44346/api/CentrosMedicos/Eliminar/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) throw new Error("No se pudo eliminar el centro médico.");
            return response.status === 204 ? null : response.json(); // Si el backend responde NoContent
        })
        .then(() => {
            deleteCentroMedico(id);
        })
        .catch(error => {
            console.error("Error al eliminar:", error);
            showNotification("Error al eliminar el centro médico", "error");
        });
    });
});

}


// Buscar centros médicos
function searchCentrosMedicos(term) {
    if (!term.trim()) {
        loadCentrosMedicos(); // Si el campo de búsqueda está vacío, recarga la tabla completa.
        return;
    }
    
    const lowerTerm = term.toLowerCase();
    const filteredCentros = centrosMedicos.filter(centro => 
        centro.Nombre.toLowerCase().includes(lowerTerm) ||
        centro.Direccion.toLowerCase().includes(lowerTerm) ||
        centro.Email.toLowerCase().includes(lowerTerm) ||
        centro.Telefono.includes(term)
    );
    
    const tablaCentros = document.querySelector('#tabla-centros tbody');
    tablaCentros.innerHTML = '';

    if (filteredCentros.length === 0) {
        tablaCentros.innerHTML = `
            <tr>
                <td colspan="6" class="no-data">No se encontraron resultados para "${term}"</td>
            </tr>
        `;
        return;
    }
    
    filteredCentros.forEach(centro => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${centro.CentroID}</td>
            <td>${centro.Nombre}</td>
            <td>${centro.Direccion}</td>
            <td>${centro.Telefono}</td>
            <td>${centro.Email}</td>
            <td class="actions">
                <button class="btn btn-warning edit-centro" data-id="${centro.CentroID}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger delete-centro" data-id="${centro.CentroID}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tablaCentros.appendChild(row);
    });

    // Añadir eventos a los botones de acción
    addCentrosMedicosActionEvents();
}


// Generar formulario de centro médico
function generateCentrosMedicosForm(container) {
    container.appendChild(createFormGroup('centro-nombre', 'Nombre', 'text', true));
    container.appendChild(createFormGroup('centro-direccion', 'Dirección', 'text', true));
    container.appendChild(createFormGroup('centro-telefono', 'Teléfono', 'tel', false));
    container.appendChild(createFormGroup('centro-email', 'Email', 'email', false));
}

// Llenar formulario de centro médico
function fillCentrosMedicosForm(centro) {
    document.getElementById('centro-nombre').value = centro.nombre;
    document.getElementById('centro-direccion').value = centro.direccion;
    document.getElementById('centro-telefono').value = centro.telefono;
    document.getElementById('centro-email').value = centro.email;
}


// Guardar centro médico
function saveCentroMedico() {
    const nombre = document.getElementById('centro-nombre').value;
    const direccion = document.getElementById('centro-direccion').value;
    const telefono = document.getElementById('centro-telefono').value;
    const email = document.getElementById('centro-email').value;
    
    const centroData = {
        Nombre: nombre,
        Direccion: direccion,
        Telefono: telefono,
        Email: email
    };

    if (isEditing) {
        // ACTUALIZAR CENTRO MÉDICO (PUT)
        fetch(`https://localhost:44346/api/CentrosMedicos/Actualizar/${currentItemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ CentroID: currentItemId, ...centroData })

        })
        .then(response => {
            if (!response.ok) throw new Error("Error al actualizar");
            return response.status === 204 ? null : response.json();
        })
        .then(() => {
            showNotification("Centro médico actualizado correctamente");
            loadCentrosMedicos();
            closeModal();
        })
        .catch(error => {
            console.error("Error al actualizar centro:", error);
            showNotification("No se pudo actualizar el centro médico", "error");
            loadCentrosMedicos();
        });

    } else {
        // CREAR CENTRO MÉDICO NUEVO (POST)
        fetch("https://localhost:44346/api/CentrosMedicos/Crear", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(centroData)
        })
        .then(response => {
            if (!response.ok) throw new Error("Error al crear centro");
            return response.json();
        })
        .then(() => {
            showNotification("Centro médico agregado correctamente");
            loadCentrosMedicos();
            closeModal();
        })
        .catch(error => {
            console.error("Error al crear centro:", error);
            showNotification("No se pudo crear el centro médico", "error");
        });
    }

    // Reset
    isEditing = false;
    currentItemId = null;
}

// Eliminar centro médico
function deleteCentroMedico(id) {
    // Filtrar el array para eliminar el centro
    centrosMedicos = centrosMedicos.filter(c => c.CentroID !== id);
    
    // Mostrar notificación
    showNotification('Centro médico eliminado correctamente');
    
    // Recargar tabla
    loadCentrosMedicos();
}

