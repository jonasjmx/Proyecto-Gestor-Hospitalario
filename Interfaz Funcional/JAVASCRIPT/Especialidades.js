// Datos de ejemplo para especialidades
let especialidad = [];

// Cargar especialidades
function loadEspecialidades() {
    const tablaEspecialidades = document.querySelector('#tabla-especialidades tbody');
    tablaEspecialidades.innerHTML = ''; // Limpiar contenido previo

    fetch("https://localhost:44346/api/Especialidades/Listar")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            especialidades = data; //  AQUI SE ACTUALIZA EL ARRAY

            console.log("Especialidades recibidas:", data);

            if (!Array.isArray(data) || data.length === 0) {
                tablaEspecialidades.innerHTML = `
                    <tr>
                        <td colspan="3" class="no-data">No se encontraron especialidades.</td>
                    </tr>
                `;
                return;
            }

            data.forEach(especialidad => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${especialidad.especialidadID}</td>
                    <td>${especialidad.nombre}</td>
                    <td class="actions">
                        <button class="btn btn-warning btn-action edit-especialidad" data-id="${especialidad.especialidadID}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-action delete-especialidad" data-id="${especialidad.especialidadID}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tablaEspecialidades.appendChild(row);
            });

            // Asignar eventos a los botones
            addEspecialidadesActionEvents();
        })
        .catch(error => {
            console.error("Error al cargar especialidades:", error);
            tablaEspecialidades.innerHTML = `
                <tr>
                    <td colspan="3" class="error">Error al cargar especialidades: ${error.message}</td>
                </tr>
            `;
        });
}




// Añadir eventos a los botones de acción para especialidades
function addEspecialidadesActionEvents() {
    document.querySelectorAll('.edit-especialidad').forEach(btn => {
        // Botón editar
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));

            // Realizar solicitud GET para obtener la especialidad desde la API
            fetch(`https://localhost:44346/api/Especialidades/Buscar/${id}`)  // Cambia la URL si es necesario
                .then(response => {
                    if (!response.ok) throw new Error('No se pudo obtener la especialidad');
                    return response.json();
                })
                .then(especialidad => {
                    openEditModal(id, especialidad); // Muestra el modal y llena los campos
                })
                .catch(error => {
                    console.error('Error al obtener especialidad:', error);
                    showNotification('No se pudo cargar la especialidad', 'error');
                });
        });
    });

document.querySelectorAll('.delete-especialidad').forEach(btn => {
    btn.addEventListener('click', function () {
        const id = parseInt(this.getAttribute('data-id'));

        // Confirmar eliminación
        if (!confirmDelete(id, '', 'la especialidad')) return;

        // Llamar a la API para eliminar la especialidad
        fetch(`https://localhost:44346/api/Especialidades/Eliminar/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) throw new Error("No se pudo eliminar la especialidad.");
            return response.status === 204 ? null : response.json(); // Manejo de NoContent
        })
        .then(() => {
            deleteEspecialidad(id); // Función que actualiza la vista del frontend
        })
        .catch(error => {
            console.error("Error al eliminar especialidad:", error);
            showNotification("Error al eliminar la especialidad", "error");
        });
    });
});
}
// Buscar especialidades
function searchEspecialidades(term) {
    if (!term.trim()) {
        loadEspecialidades();
        return;
    }
    
    const lowerTerm = term.toLowerCase();
    const filteredEspecialidades = especialidades.filter(especialidad => 
        especialidad.Nombre.toLowerCase().includes(lowerTerm)
    );
    
    const tablaEspecialidades = document.querySelector('#tabla-especialidades tbody');
    tablaEspecialidades.innerHTML = '';
    
    if (filteredEspecialidades.length === 0) {
        tablaEspecialidades.innerHTML = `
            <tr>
                <td colspan="3" class="no-data">No se encontraron resultados para "${term}"</td>
            </tr>
        `;
        return;
    }
    
    filteredEspecialidades.forEach(especialidad => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${especialidad.EspecialidadID}</td>
            <td>${especialidad.Nombre}</td>
            <td class="actions">
                <button class="btn btn-warning btn-action edit-especialidad" data-id="${especialidad.EspecialidadID}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-action delete-especialidad" data-id="${especialidad.EspecialidadID}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tablaEspecialidades.appendChild(row);
    });
    
    // Añadir eventos a los botones de acción
    addEspecialidadesActionEvents();
}

// Generar formulario de especialidad
function generateEspecialidadesForm(container) {
    container.appendChild(createFormGroup('especialidad-nombre', 'Nombre', 'text', true));
}

// Llenar formulario de especialidad
function fillEspecialidadesForm(especialidad) {
    document.getElementById('especialidad-nombre').value = especialidad.nombre;
}

// Guardar especialidad
function saveEspecialidad() {
    const nombre = document.getElementById('especialidad-nombre').value;

    const especialidad = {
        nombre: nombre
    };

    if (isEditing) {
        //  Actualizar especialidad existente con PUT
        fetch(`https://localhost:44346/api/Especialidades/Actualizar/${currentItemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                especialidadID: currentItemId,
                nombre: nombre
            })
        })
        .then(response => {
            if (!response.ok) throw new Error("Error al actualizar la especialidad.");
            return response.json();
        })
        .then(() => {
            showNotification('Especialidad actualizada correctamente');
            loadEspecialidades();
            closeModal(); // Asegúrate de tener esta función para cerrar el modal
        })
        .catch(error => {
            console.error("Error en la actualización:", error);
            showNotification("Error al actualizar la especialidad", "error");
            loadEspecialidades();
        });

    } else {
        // ✅ Agregar nueva especialidad con POST
        fetch("https://localhost:44346/api/Especialidades/Crear", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(especialidad)
        })
        .then(response => {
            if (!response.ok) throw new Error("Error al guardar la especialidad.");
            return response.json();
        })
        .then(() => {
            showNotification('Especialidad agregada correctamente');
            loadEspecialidades();
            closeModal();
        })
        .catch(error => {
            console.error("Error al guardar:", error);
            showNotification("Error al guardar la especialidad", "error");
        });
    }
}


// Eliminar especialidad
function deleteEspecialidad(id) {
    // Filtrar el array para eliminar la especialidad
    especialidades = especialidades.filter(e => e.EspecialidadID !== id);
    
    // Mostrar notificación
    showNotification('Especialidad eliminada correctamente');
    
    // Recargar tabla
    loadEspecialidades();
}