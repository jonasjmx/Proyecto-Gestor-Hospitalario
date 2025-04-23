
// Estados válidos para las consultas
const estadosConsulta = ['Pendiente', 'En proceso', 'Completada', 'Cancelada'];



function loadConsultasMedicas() {
    const tablaConsultas = document.querySelector("#tabla-consultas tbody");
    tablaConsultas.innerHTML = ""; // Limpiar contenido previo

    fetch("https://localhost:44346/api/ConsultaMedica/Listar")

        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(consultas => {
            console.log("Datos recibidos:", consultas);

            if (!Array.isArray(consultas) || consultas.length === 0) {
                throw new Error("La respuesta de la API no contiene datos válidos.");
            }

            consultas.forEach(consulta => {
                const row = document.createElement("tr");
                
                row.innerHTML = `
                    <td>${consulta.consultaID}</td>
                    <td>${formatDate(consulta.fecha)}</td>
                    <td>${consulta.hora}</td>
                    <td>${consulta.pacienteNombre} ${consulta.pacienteApellido}</td>
                    <td>${consulta.medicoNombre}</td>
                    <td>${consulta.centroMedicoNombre}</td>
                    <td>${consulta.ubicacion}</td>
                    <td class="actions">
                        <button id="btn-edit-consulta-${consulta.consultaID}" class="btn btn-warning btn-action edit-consulta" data-id="${consulta.consultaID}">
                            <i class="fas fa-edit"></i>
                        </button>

                        <button class="btn btn-danger btn-action delete-consulta" data-id="${consulta.consultaID}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tablaConsultas.appendChild(row);
            });

            addConsultasMedicasActionEvents(); // Vincula eventos a los botones
        })
        .catch(error => {
            console.error("Error al cargar consultas médicas:", error);
            alert(`No se pudieron cargar las consultas médicas: ${error.message}`);
        });
}


// Formatear fecha de YYYY-MM-DD a DD/MM/YYYY
function formatDate(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// Añadir eventos a los botones de acción
function addConsultasMedicasActionEvents() {
    console.log("Vinculando eventos a los botones...");

    document.querySelectorAll('.view-consulta').forEach(btn => {
        console.log(`Evento vinculado al botón con data-id: ${btn.getAttribute("data-id")}`);
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const consulta = consultasMedicas.find(c => c.consultaID === id);
            
            if (consulta) {
                openViewModal(consulta);
            }
        });
    });
}

document.addEventListener("click", function(event) {

    if (event.target.closest(".edit-consulta")) {
        const id = parseInt(event.target.closest(".edit-consulta").getAttribute("data-id"));
        const consulta = consultasMedicas.find(c => c.consultaID === id);
        
        if (consulta) {
            openEditModal(id, consulta);
        }
    }

    if (event.target.closest(".delete-consulta")) {
        const id = parseInt(event.target.closest(".delete-consulta").getAttribute("data-id"));
        const consulta = consultasMedicas.find(c => c.consultaID === id);
        
        if (consulta && confirmDelete(id, `${consulta.pacienteNombre} - ${consulta.fecha}`, 'la consulta médica')) {
            deleteConsultaMedica(id);
        }
    }
});


// Abrir modal para ver detalles de la consulta
function openViewModal(consulta) {
    const modalTitle = document.querySelector("#modal-generic .modal-title");
    const modalBody = document.querySelector("#modal-generic .modal-body");

    modalTitle.textContent = `Detalles de la Consulta #${consulta.consultaID}`;

    modalBody.innerHTML = `
        <p><strong>Paciente:</strong> ${consulta.pacienteNombre} ${consulta.pacienteApellido}</p>
        <p><strong>Médico:</strong> ${consulta.medicoNombre}</p>
        <p><strong>Centro Médico:</strong> ${consulta.centroMedicoNombre}</p>
        <p><strong>Fecha:</strong> ${formatDate(consulta.fecha)}</p>
        <p><strong>Hora:</strong> ${consulta.hora}</p>
        <p><strong>Estado:</strong> <span class="badge">${consulta.Estado || "No especificado"}</span></p>
        <p><strong>Notas:</strong> ${consulta.notas || "Sin notas registradas"}</p>
    `;

    $('#modal-generic').modal('show'); // Mostrar el modal usando Bootstrap
}

function deleteConsultaMedica(id) {
    consultasMedicas = consultasMedicas.filter(c => c.consultaID !== id);
    showNotification("Consulta médica eliminada correctamente");
    loadConsultasMedicas();
}


// Buscar consultas médicas
function searchConsultasMedicas(term) {
    if (!term.trim()) {
        loadConsultasMedicas();
        return;
    }
    
    const lowerTerm = term.toLowerCase();
    const filteredConsultas = consultasMedicas.filter(consulta => 
        consulta.PacienteNombre.toLowerCase().includes(lowerTerm) ||
        consulta.MedicoNombre.toLowerCase().includes(lowerTerm) ||
        consulta.Especialidad.toLowerCase().includes(lowerTerm) ||
        consulta.Fecha.includes(term) ||
        consulta.Estado.toLowerCase().includes(lowerTerm)
    );
    
    const tablaConsultas = document.querySelector('#tabla-consultas tbody');
    tablaConsultas.innerHTML = '';
    
    if (filteredConsultas.length === 0) {
        tablaConsultas.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">No se encontraron resultados para "${term}"</td>
            </tr>
        `;
        return;
    }
    
    filteredConsultas.forEach(consulta => {
        const row = document.createElement('tr');
        
        row.classList.add(`estado-${consulta.Estado.toLowerCase().replace(' ', '-')}`);
        
        row.innerHTML = `
            <td>${consulta.ConsultaID}</td>
            <td>${formatDate(consulta.Fecha)}</td>
            <td>${consulta.Hora}</td>
            <td>${consulta.PacienteNombre}</td>
            <td>${consulta.MedicoNombre}</td>
            <td>${consulta.Especialidad}</td>
            <td><span class="badge estado-${consulta.Estado.toLowerCase().replace(' ', '-')}">${consulta.Estado}</span></td>
            <td class="actions">
                <button class="btn btn-info btn-action view-consulta" data-id="${consulta.ConsultaID}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-warning btn-action edit-consulta" data-id="${consulta.ConsultaID}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-action delete-consulta" data-id="${consulta.ConsultaID}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tablaConsultas.appendChild(row);
    });
    
    // Añadir eventos a los botones de acción
    addConsultasMedicasActionEvents();
}

// Generar formulario de consulta médica
function generateConsultasMedicasForm(container) {
    // Crear campo para el paciente
    container.appendChild(createFormGroup('consulta-paciente', 'Nombre del Paciente', 'text', true));
    
    // Crear campo para el médico
    container.appendChild(createFormGroup('consulta-medico', 'Nombre del Médico', 'text', true));
    
    // Crear campo para la especialidad
    container.appendChild(createFormGroup('consulta-especialidad', 'Especialidad', 'text', true));
    
    // Crear campo para la fecha
    const fechaGroup = createFormGroup('consulta-fecha', 'Fecha', 'date', true);
    container.appendChild(fechaGroup);
    
    // Crear campo para la hora
    const horaGroup = createFormGroup('consulta-hora', 'Hora', 'time', true);
    container.appendChild(horaGroup);
    
    // Crear selector para el estado
    const estadoGroup = document.createElement('div');
    estadoGroup.className = 'form-group';
    
    const estadoLabel = document.createElement('label');
    estadoLabel.setAttribute('for', 'consulta-estado');
    estadoLabel.textContent = 'Estado';
    
    const estadoSelect = document.createElement('select');
    estadoSelect.className = 'form-control';
    estadoSelect.id = 'consulta-estado';
    estadoSelect.required = true;
    
    estadosConsulta.forEach(estado => {
        const option = document.createElement('option');
        option.value = estado;
        option.textContent = estado;
        estadoSelect.appendChild(option);
    });
    
    estadoGroup.appendChild(estadoLabel);
    estadoGroup.appendChild(estadoSelect);
    container.appendChild(estadoGroup);
    
    // Crear campo para las notas
    const notasGroup = document.createElement('div');
    notasGroup.className = 'form-group';
    
    const notasLabel = document.createElement('label');
    notasLabel.setAttribute('for', 'consulta-notas');
    notasLabel.textContent = 'Notas';
    
    const notasTextarea = document.createElement('textarea');
    notasTextarea.className = 'form-control';
    notasTextarea.id = 'consulta-notas';
    notasTextarea.rows = 4;
    
    notasGroup.appendChild(notasLabel);
    notasGroup.appendChild(notasTextarea);
    container.appendChild(notasGroup);
}

// Llenar formulario de consulta médica
function fillConsultasMedicasForm(consulta) {
    document.getElementById('consulta-paciente').value = consulta.PacienteNombre;
    document.getElementById('consulta-medico').value = consulta.MedicoNombre;
    document.getElementById('consulta-especialidad').value = consulta.Especialidad;
    document.getElementById('consulta-fecha').value = consulta.Fecha;
    document.getElementById('consulta-hora').value = consulta.Hora;
    document.getElementById('consulta-estado').value = consulta.Estado;
    document.getElementById('consulta-notas').value = consulta.Notas;
}

// Guardar consulta médica
function saveConsultaMedica() {
    const paciente = document.getElementById('consulta-paciente').value;
    const medico = document.getElementById('consulta-medico').value;
    const especialidad = document.getElementById('consulta-especialidad').value;
    const fecha = document.getElementById('consulta-fecha').value;
    const hora = document.getElementById('consulta-hora').value;
    const estado = document.getElementById('consulta-estado').value;
    const notas = document.getElementById('consulta-notas').value;
    
    if (isEditing) {
        // Actualizar consulta existente
        const index = consultasMedicas.findIndex(c => c.ConsultaID === currentItemId);
        
        if (index !== -1) {
            consultasMedicas[index].PacienteNombre = paciente;
            consultasMedicas[index].MedicoNombre = medico;
            consultasMedicas[index].Especialidad = especialidad;
            consultasMedicas[index].Fecha = fecha;
            consultasMedicas[index].Hora = hora;
            consultasMedicas[index].Estado = estado;
            consultasMedicas[index].Notas = notas;
            
            showNotification('Consulta médica actualizada correctamente');
        }
    } else {
        // Agregar nueva consulta
        const newId = consultasMedicas.length > 0 
            ? Math.max(...consultasMedicas.map(c => c.ConsultaID)) + 1 
            : 1;
        
        consultasMedicas.push({
            ConsultaID: newId,
            PacienteNombre: paciente,
            MedicoNombre: medico,
            Especialidad: especialidad,
            Fecha: fecha,
            Hora: hora,
            Estado: estado,
            Notas: notas
        });
        
        showNotification('Consulta médica agregada correctamente');
    }
    
    // Recargar tabla
    loadConsultasMedicas();
}

// Eliminar consulta médica
function deleteConsultaMedica(id) {
    // Filtrar el array para eliminar la consulta
    consultasMedicas = consultasMedicas.filter(c => c.ConsultaID !== id);
    
    // Mostrar notificación
    showNotification('Consulta médica eliminada correctamente');
    
    // Recargar tabla
    loadConsultasMedicas();
}
