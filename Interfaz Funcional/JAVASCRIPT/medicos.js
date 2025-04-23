// Datos de ejemplo para médicos


// Cargar médicos
let medicos = []; // Variable global para almacenar los médicos

async function loadMedicos() {
    const tablaMedicos = document.querySelector('#tabla-medicos tbody');
    tablaMedicos.innerHTML = '<tr><td colspan="8">Cargando médicos...</td></tr>';

    try {
        // Cargar médicos desde la API
        const response = await fetch('https://localhost:44346/api/Medico/Listar');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        medicos = await response.json();

        // Verificar que sea un array
        if (!Array.isArray(medicos)) {
            throw new Error('La API no devolvió un array de médicos');
        }

        // Renderizar la tabla
        renderMedicosTable();
    } catch (error) {
        console.error('Error al cargar médicos:', error);
        tablaMedicos.innerHTML = '<tr><td colspan="8">Error al cargar médicos</td></tr>';
        showNotification('Error al cargar médicos: ' + error.message, 'error');
    }
}

function renderMedicosTable() {
    const tablaMedicos = document.querySelector('#tabla-medicos tbody');
    tablaMedicos.innerHTML = '';

    if (medicos.length === 0) {
        tablaMedicos.innerHTML = '<tr><td colspan="8">No hay médicos registrados</td></tr>';
        return;
    }

    medicos.forEach(medico => {
        // Usamos el operador opcional (?.) para evitar errores si no existen las relaciones
        const especialidadNombre = medico.especialidadNombre || 'No disponible';
        const centroNombre = medico.centroNombre || 'No disponible';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${medico.MedicoID || medico.medicoID}</td>
            <td>${medico.Nombre || medico.nombre}</td>
            <td>${medico.Apellido || medico.apellido}</td>
            <td>${medico.Telefono || medico.telefono || ''}</td>
            <td>${medico.Email || medico.email || ''}</td>
            <td>${especialidadNombre}</td>
            <td>${centroNombre}</td>
            <td class="actions">
                <button class="btn btn-warning btn-action edit-medico" data-id="${medico.MedicoID || medico.medicoID}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-action delete-medico" data-id="${medico.MedicoID || medico.medicoID}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tablaMedicos.appendChild(row);
    });

    addMedicosActionEvents();
}

// Función para añadir eventos (debes implementarla según tus necesidades)
function addMedicosActionEvents() {
    document.querySelectorAll('.edit-medico').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            // Lógica para editar médico
        });
    });

    document.querySelectorAll('.delete-medico').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            // Lógica para eliminar médico
        });
    });
}

// Cargar médicos cuando la página esté lista
document.addEventListener('DOMContentLoaded', () => {
    loadMedicos();
});

// Añadir eventos a los botones de acción
function addMedicosActionEvents() {
    // Botones de editar
    document.querySelectorAll('.edit-medico').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const medico = medicos.find(m => m.MedicoID === id);
            
            if (medico) {
                openEditModal(id, medico);
            }
        });
    });
    
    // Botones de eliminar
    document.querySelectorAll('.delete-medico').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const medico = medicos.find(m => m.MedicoID === id);
            
            if (medico && confirmDelete(id, `${medico.Nombre} ${medico.Apellido}`, 'el médico')) {
                deleteMedico(id);
            }
        });
    });
}

// Buscar médicos
function searchMedicos(term) {
    if (!term.trim()) {
        loadMedicos();
        return;
    }
    
    const lowerTerm = term.toLowerCase();
    const filteredMedicos = medicos.filter(medico => 
        medico.Nombre.toLowerCase().includes(lowerTerm) ||
        medico.Apellido.toLowerCase().includes(lowerTerm) ||
        medico.Email.toLowerCase().includes(lowerTerm) ||
        medico.Telefono.includes(term)
    );
    
    const tablaMedicos = document.querySelector('#tabla-medicos tbody');
    tablaMedicos.innerHTML = '';
    
    if (filteredMedicos.length === 0) {
        tablaMedicos.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">No se encontraron resultados para "${term}"</td>
            </tr>
        `;
        return;
    }
    
    filteredMedicos.forEach(medico => {
        const especialidad = especialidades.find(e => e.EspecialidadID === medico.EspecialidadID);
        const centro = centrosMedicos.find(c => c.CentroID === medico.CentroID);
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${medico.MedicoID}</td>
            <td>${medico.Nombre}</td>
            <td>${medico.Apellido}</td>
            <td>${medico.Telefono}</td>
            <td>${medico.Email}</td>
            <td>${especialidad ? especialidad.Nombre : 'No disponible'}</td>
            <td>${centro ? centro.Nombre : 'No disponible'}</td>
            <td class="actions">
                <button class="btn btn-warning btn-action edit-medico" data-id="${medico.MedicoID}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-action delete-medico" data-id="${medico.MedicoID}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tablaMedicos.appendChild(row);
    });
    
    // Añadir eventos a los botones de acción
    addMedicosActionEvents();
}

// Generar formulario de médico
function generateMedicosForm(container) {
    container.appendChild(createFormGroup('medico-nombre', 'Nombre', 'text', true));
    container.appendChild(createFormGroup('medico-apellido', 'Apellido', 'text', true));
    container.appendChild(createFormGroup('medico-telefono', 'Teléfono', 'tel', false));
    container.appendChild(createFormGroup('medico-email', 'Email', 'email', false));
    
    // Select de especialidades
    const especialidadesOptions = especialidades.map(esp => ({
        value: esp.EspecialidadID,
        text: esp.Nombre
    }));
    container.appendChild(createSelectFormGroup('medico-especialidad', 'Especialidad', especialidadesOptions, true));
    
    // Select de centros médicos
    const centrosOptions = centrosMedicos.map(centro => ({
        value: centro.CentroID,
        text: centro.Nombre
    }));
    container.appendChild(createSelectFormGroup('medico-centro', 'Centro Médico', centrosOptions, true));
}

// Llenar formulario de médico
function fillMedicosForm(medico) {
    document.getElementById('medico-nombre').value = medico.Nombre;
    document.getElementById('medico-apellido').value = medico.Apellido;
    document.getElementById('medico-telefono').value = medico.Telefono;
    document.getElementById('medico-email').value = medico.Email;
    document.getElementById('medico-especialidad').value = medico.EspecialidadID;
    document.getElementById('medico-centro').value = medico.CentroID;
}

// Guardar médico
function saveMedico() {
    const nombre = document.getElementById('medico-nombre').value;
    const apellido = document.getElementById('medico-apellido').value;
    const telefono = document.getElementById('medico-telefono').value;
    const email = document.getElementById('medico-email').value;
    const especialidadID = parseInt(document.getElementById('medico-especialidad').value);
    const centroID = parseInt(document.getElementById('medico-centro').value);
    
    if (isEditing) {
        // Actualizar médico existente
        const index = medicos.findIndex(m => m.MedicoID === currentItemId);
        
        if (index !== -1) {
            medicos[index].Nombre = nombre;
            medicos[index].Apellido = apellido;
            medicos[index].Telefono = telefono;
            medicos[index].Email = email;
            medicos[index].EspecialidadID = especialidadID;
            medicos[index].CentroID = centroID;
            
            showNotification('Médico actualizado correctamente');
        }
    } else {
        // Agregar nuevo médico
        const newId = medicos.length > 0 
            ? Math.max(...medicos.map(m => m.MedicoID)) + 1 
            : 1;
        
        medicos.push({
            MedicoID: newId,
            Nombre: nombre,
            Apellido: apellido,
            Telefono: telefono,
            Email: email,
            EspecialidadID: especialidadID,
            CentroID: centroID
        });
        
        showNotification('Médico agregado correctamente');
    }
    
    // Recargar tabla
    loadMedicos();
}

// Eliminar médico
function deleteMedico(id) {
    // Filtrar el array para eliminar el médico
    medicos = medicos.filter(m => m.MedicoID !== id);
    
    // Mostrar notificación
    showNotification('Médico eliminado correctamente');
    
    // Recargar tabla
    loadMedicos();
}