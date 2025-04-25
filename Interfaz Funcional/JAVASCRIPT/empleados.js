
// Cargar empleados
function loadEmpleados() {
    const tablaEmpleados = document.querySelector('#tabla-empleados tbody');
    tablaEmpleados.innerHTML = '<tr><td colspan="7">Cargando empleados...</td></tr>';

    fetch("https://localhost:44346/api/Empleado/Listar")
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos de la API:', data);
            
            if (!Array.isArray(data)) {
                throw new Error('La API no devolvió un array de empleados');
                
            }
            
            empleados = data;
            renderEmpleadosTable(empleados);
        })
        .catch(error => {
            console.error('Error al cargar empleados:', error);
            tablaEmpleados.innerHTML = '<tr><td colspan="7">Error al cargar empleados</td></tr>';
            showNotification('Error al cargar empleados: ' + error.message, 'error');
        });
}

function loadCentros() {
    const centroSelect = document.getElementById('centro-empleado');
    centroSelect.innerHTML = '<option value="">Seleccione un centro</option>'; // Limpia los existentes

    fetch("https://localhost:44346/api/Centros/Listar")
        .then(response => {
            if (!response.ok) throw new Error("No se pudieron obtener los centros.");
            return response.json();
        })
        .then(data => {
            data.forEach(centro => {
                const option = document.createElement('option');
                option.value = centro.centroID;
                option.textContent = centro.nombre;
                centroSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error al cargar centros:", error);
            showNotification("Error al cargar centros", "error");
        });
}


// Renderizar la tabla de empleados
function renderEmpleadosTable(empleadosList) {
    const tablaEmpleados = document.querySelector('#tabla-empleados tbody');
    tablaEmpleados.innerHTML = '';

    if (empleadosList.length === 0) {
        tablaEmpleados.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">No hay empleados registrados</td>
            </tr>
        `;
        return;
    }

    empleadosList.forEach(empleado => {
        // Asegúrate de que centrosMedicos está cargado
        const centro = centrosMedicos.find(c => c.CentroID === (empleado.centroID || empleado.CentroID));
        const centroNombre = empleado.centroMedicoNombre || 'Desconocido';


        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${empleado.empleadoID || empleado.EmpleadoID}</td>
            <td>${empleado.nombre || empleado.Nombre} </td>
            <td>${empleado.apellido || empleado.Apellido || ''} </td>
            <td>${empleado.cargo || empleado.Cargo}</td>
            <td>${empleado.telefono || empleado.Telefono || ''}</td>
            <td>${empleado.email || empleado.Email || ''}</td>
            <td>${centroNombre}</td>
            <td class="actions">
                <button class="btn btn-warning btn-action edit-empleado" data-id="${empleado.empleadoID || empleado.EmpleadoID}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-action delete-empleado" data-id="${empleado.empleadoID || empleado.EmpleadoID}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tablaEmpleados.appendChild(row);
        
    });

    addEmpleadosActionEvents();
}
// Añadir eventos a los botones de acción de empleados
function addEmpleadosActionEvents() {
    document.querySelectorAll('.edit-empleado').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.getAttribute('data-id'));

            fetch(`https://localhost:44346/api/Empleado/Buscar/${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('No se pudo obtener el empleado');
                    }
                    return response.json();
                })
                .then(empleado => {
                    openEditModal(id, empleado, 'empleado'); // Modal con datos del empleado
                })
                .catch(error => {
                    console.error('Error al obtener empleado:', error);
                    showNotification('No se pudo cargar el empleado', 'error');
                });
        });
    });
    
    // Botones de eliminar
    document.querySelectorAll('.delete-empleado').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const empleado = empleados.find(e => e.EmpleadoID === id);
            
            if (empleado && confirmDelete(id, `${empleado.Nombre} ${empleado.Apellido}`, 'el empleado')) {
                deleteEmpleado(id);
            }
        });
    });
}

// Buscar empleados
function searchEmpleados(term) {
    if (!term.trim()) {
        loadEmpleados();
        return;
    }
    
    const lowerTerm = term.toLowerCase();
    const filteredEmpleados = empleados.filter(empleado => 
        empleado.Nombre.toLowerCase().includes(lowerTerm) ||
        empleado.Apellido.toLowerCase().includes(lowerTerm) ||
        empleado.Cargo.toLowerCase().includes(lowerTerm) ||
        empleado.Email.toLowerCase().includes(lowerTerm) ||
        empleado.Telefono.includes(term)
    );
    
    const tablaEmpleados = document.querySelector('#tabla-empleados tbody');
    tablaEmpleados.innerHTML = '';
    
    if (filteredEmpleados.length === 0) {
        tablaEmpleados.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">No se encontraron resultados para "${term}"</td>
            </tr>
        `;
        return;
    }
    
    filteredEmpleados.forEach(empleado => {
        const centro = centrosMedicos.find(c => c.CentroID === empleado.CentroID);
        const centroNombre = centro ? centro.Nombre : 'Desconocido';
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${empleado.EmpleadoID}</td>
            <td>${empleado.Nombre} ${empleado.Apellido}</td>
            <td>${empleado.Cargo}</td>
            <td>${empleado.Telefono}</td>
            <td>${empleado.Email}</td>
            <td>${centroNombre}</td>
            <td class="actions">
                <button class="btn btn-warning btn-action edit-empleado" data-id="${empleado.EmpleadoID}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-action delete-empleado" data-id="${empleado.EmpleadoID}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tablaEmpleados.appendChild(row);
    });
    

    // Añadir eventos a los botones de acción
    addEmpleadosActionEvents();
}

// Generar formulario de empleado
function generateEmpleadosForm(container) {
    container.appendChild(createFormGroup('empleado-nombre', 'Nombre', 'text', true));
    container.appendChild(createFormGroup('empleado-apellido', 'Apellido', 'text', true));
    container.appendChild(createFormGroup('empleado-cargo', 'Cargo', 'text', true));
    container.appendChild(createFormGroup('empleado-telefono', 'Teléfono', 'tel', false));
    container.appendChild(createFormGroup('empleado-email', 'Email', 'email', false));
    
    // Selector de centro médico
    const div = document.createElement('div');
    div.className = 'form-group';
    
    const label = document.createElement('label');
    label.setAttribute('for', 'empleado-centro');
    label.textContent = 'Centro Médico *';
    
    const select = document.createElement('select');
    select.id = 'empleado-centro';
    select.className = 'form-control';
    select.required = true;
    
    centrosMedicos.forEach(centro => {
        const option = document.createElement('option');
        option.value = centro.CentroID;
        option.textContent = centro.Nombre;
        select.appendChild(option);
    });
    
    div.appendChild(label);
    div.appendChild(select);
    container.appendChild(div);
}

// Llenar formulario de empleado
function fillEmpleadosForm(empleado) {
    document.getElementById('empleado-nombre').value = empleado.Nombre;
    document.getElementById('empleado-apellido').value = empleado.Apellido;
    document.getElementById('empleado-cargo').value = empleado.Cargo;
    document.getElementById('empleado-telefono').value = empleado.Telefono;
    document.getElementById('empleado-email').value = empleado.Email;
    document.getElementById('empleado-centro').value = empleado.CentroID;
}

// Guardar empleado
function saveEmpleado() {
    const nombre = document.getElementById('empleado-nombre').value;
    const apellido = document.getElementById('empleado-apellido').value;
    const cargo = document.getElementById('empleado-cargo').value;
    const telefono = document.getElementById('empleado-telefono').value;
    const email = document.getElementById('empleado-email').value;
    const centroID = parseInt(document.getElementById('empleado-centro').value);

    const empleadoData = {
        Nombre: nombre,
        Apellido: apellido,
        Cargo: cargo,
        Telefono: telefono,
        Email: email,
        CentroID: centroID
    };

    if (isEditing) {
        // Enviar actualización a la API
        fetch(`https://localhost:44346/api/Empleado/Actualizar/${currentItemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empleadoData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar el empleado.');
            }
            return response.text();
        })
        .then(() => {
            showNotification('Empleado actualizado correctamente');
            closeModal(); // si usas un modal
            loadEmpleados(); // recarga desde API
        })
        .catch(error => {
            showNotification('Error al actualizar: ' + error.message, 'error');
        });

    } else {
        
     // Enviar nuevo empleado a la API (POST)
     fetch("https://localhost:44346/api/Empleado/Crear", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(empleadoData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al agregar el empleado.');
        }
        return response.json(); // o response.text() si no devuelve el objeto creado
    })
    .then(data => {
        showNotification('Empleado agregado correctamente');
        closeModal(); // si usas un modal
        loadEmpleados(); // recarga la lista actualizada
    })
    .catch(error => {
        showNotification('Error al agregar: ' + error.message, 'error');
    });
}


// Eliminar empleado
function deleteEmpleado(id) {
    // Filtrar el array para eliminar el empleado
    empleados = empleados.filter(e => e.EmpleadoID !== id);
    
    // Mostrar notificación
    showNotification('Empleado eliminado correctamente');
    
    // Recargar tabla
    loadEmpleados();
}}