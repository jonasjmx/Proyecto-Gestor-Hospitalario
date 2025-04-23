// Variables globales
let currentSection = 'centros-medicos';
let isEditing = false;
let currentItemId = null;

// Evento cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar eventos de menú
    initMenuEvents();
    
    // Inicializar eventos de modal
    initModalEvents();
    
    // Inicializar eventos de botones
    initButtonEvents();
    
    // Cargar datos iniciales (Centros Médicos por defecto)
    loadCentrosMedicos();

    //Cargar datos iniciales (Consultas edicas por defecto)
    loadConsultasMedicas();
});

// Inicializar eventos de menú
function initMenuEvents() {
    const menuItems = document.querySelectorAll('.main-menu a');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los ítems
            menuItems.forEach(mi => mi.classList.remove('active'));
            
            // Agregar clase active al ítem clickeado
            this.classList.add('active');
            
            // Obtener el ID del menú (sin el prefijo 'menu-')
            const menuId = this.id.replace('menu-', '');
            
            // Actualizar título de la sección
            updateSectionTitle(menuId);
            
            // Ocultar todas las secciones
            const sections = document.querySelectorAll('.section-content');
            sections.forEach(section => section.classList.remove('active'));
            
            // Mostrar la sección correspondiente
            const targetSection = document.getElementById(convertMenuToSectionId(menuId));
            if (targetSection) {
                targetSection.classList.add('active');
                currentSection = convertMenuToSectionId(menuId);
                
                // Cargar datos según la sección
                loadSectionData(currentSection);
            }
        });
    });
}

// Convertir ID de menú a ID de sección
function convertMenuToSectionId(menuId) {
    switch(menuId) {
        case 'centros': return 'centros-medicos';
        case 'consultas': return 'consultas-medicas';
        case 'empleados': return 'empleados';
        case 'especialidades': return 'especialidades';
        case 'medicos': return 'medicos';
        default: return menuId;
    }
}

// Actualizar título de la sección
function updateSectionTitle(menuId) {
    const sectionTitle = document.getElementById('section-title');
    
    switch(menuId) {
        case 'centros':
            sectionTitle.textContent = 'Centros Médicos';
            break;
        case 'consultas':
            sectionTitle.textContent = 'Consultas Médicas';
            break;
        case 'empleados':
            sectionTitle.textContent = 'Empleados';
            break;
        case 'especialidades':
            sectionTitle.textContent = 'Especialidades';
            break;
        case 'medicos':
            sectionTitle.textContent = 'Médicos';
            break;
        default:
            sectionTitle.textContent = 'Centros Médicos';
    }
}

// Cargar datos según la sección
function loadSectionData(section) {
    switch(section) {
        case 'centros-medicos':
            loadCentrosMedicos();
            break;
        case 'consultas-medicas':
            loadConsultasMedicas();
            break;
        case 'empleados':
            loadEmpleados();
            break;
        case 'especialidades':
            loadEspecialidades();
            break;
        case 'medicos':
            loadMedicos();
            break;
    }
}

// Inicializar eventos de modal
function initModalEvents() {
    const modal = document.getElementById('modal-form');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('btn-cancelar');
    
    // Cerrar modal con X
    closeBtn.addEventListener('click', function() {
        closeModal();
    });
    
    // Cerrar modal con botón Cancelar
    cancelBtn.addEventListener('click', function() {
        closeModal();
    });
    
    // Cerrar modal clickeando fuera
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Manejar envío del formulario
    document.getElementById('form-general').addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmit();
    });
}

function initButtonEvents() {
    // Botón agregar
    document.getElementById('btn-agregar').addEventListener('click', function() {
        openAddModal();
    });

    // Botón buscar
    document.getElementById('btn-search').addEventListener('click', function() {
        const searchTerm = document.getElementById('search-input').value;
        searchItems(searchTerm);
    });

    // Input de búsqueda (cuando se presiona Enter)
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = document.getElementById('search-input').value;
            searchItems(searchTerm);
        }
    });  
}

// **Asegurar que los eventos se inicialicen al cargar la página**
document.addEventListener("DOMContentLoaded", function () {
    initButtonEvents();
});



// Búsqueda de elementos
function searchItems(term) {
    // Implementar búsqueda según la sección actual
    switch(currentSection) {
        case 'centros-medicos':
            searchCentrosMedicos(term);
            break;
        case 'consultas-medicas':
            searchConsultasMedicas(term);
            break;
        case 'empleados':
            searchEmpleados(term);
            break;
        case 'especialidades':
            searchEspecialidades(term);
            break;
        case 'medicos':
            searchMedicos(term);
            break;
    }
}

// Abrir modal para agregar
function openAddModal() {
    isEditing = false;
    currentItemId = null;
    
    // Actualizar título del modal
    updateModalTitle('Agregar');
    
    // Generar campos del formulario según la sección actual
    generateFormFields();
    
    // Mostrar modal
    document.getElementById('modal-form').style.display = 'block';
}

// Abrir modal para editar
function openEditModal(id, centro) {
    /* console.log(`Intentando abrir modal de edición para ID: ${id}`, centro);
     */
    console.log("Lista de centros médicos:", centrosMedicos);

    isEditing = true;
    currentItemId = id;
    
    updateModalTitle('Editar');
    generateFormFields();
    fillFormWithData(centro);
    
    const modal = document.getElementById('modal-form');
    if (modal) {
        modal.style.display = 'block';
        console.log("Modal abierto correctamente");
    } else {
        console.error("No se encontró el modal con ID 'modal-form'");
    }
}


// Actualizar título del modal
function updateModalTitle(action) {
    const modalTitle = document.getElementById('modal-title');
    
    switch(currentSection) {
        case 'centros-medicos':
            modalTitle.textContent = `${action} Centro Médico`;
            break;
        case 'consultas-medicas':
            modalTitle.textContent = `${action} Consulta Médica`;
            break;
        case 'empleados':
            modalTitle.textContent = `${action} Empleado`;
            break;
        case 'especialidades':
            modalTitle.textContent = `${action} Especialidad`;
            break;
        case 'medicos':
            modalTitle.textContent = `${action} Médico`;
            break;
    }
}

// Generar campos del formulario según la sección actual
function generateFormFields() {
    const formFieldsContainer = document.getElementById('modal-form-fields');
    formFieldsContainer.innerHTML = '';
    
    switch(currentSection) {
        case 'centros-medicos':
            generateCentrosMedicosForm(formFieldsContainer);
            break;
        case 'consultas-medicas':
            generateConsultasMedicasForm(formFieldsContainer);
            break;
        case 'empleados':
            generateEmpleadosForm(formFieldsContainer);
            break;
        case 'especialidades':
            generateEspecialidadesForm(formFieldsContainer);
            break;
        case 'medicos':
            generateMedicosForm(formFieldsContainer);
            break;
    }
}

// Llenar formulario con datos
function fillFormWithData(data) {
    switch(currentSection) {
        case 'centros-medicos':
            fillCentrosMedicosForm(data);
            break;
        case 'consultas-medicas':
            fillConsultasMedicasForm(data);
            break;
        case 'empleados':
            fillEmpleadosForm(data);
            break;
        case 'especialidades':
            fillEspecialidadesForm(data);
            break;
        case 'medicos':
            fillMedicosForm(data);
            break;
    }
}

// Manejar envío del formulario
function handleFormSubmit() {
    switch(currentSection) {
        case 'centros-medicos':
            saveCentroMedico();
            break;
        case 'consultas-medicas':
            saveConsultaMedica();
            break;
        case 'empleados':
            saveEmpleado();
            break;
        case 'especialidades':
            saveEspecialidad();
            break;
        case 'medicos':
            saveMedico();
            break;
    }
    
    // Cerrar modal después de guardar
    closeModal();
}

// Cerrar modal
function closeModal() {
    document.getElementById('modal-form').style.display = 'none';
    document.getElementById('form-general').reset();
}

// Crear elemento de formulario
function createFormGroup(id, label, type = 'text', required = true) {
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';
    
    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', id);
    labelElement.textContent = label;
    
    const inputElement = document.createElement('input');
    inputElement.setAttribute('type', type);
    inputElement.setAttribute('id', id);
    inputElement.setAttribute('name', id);
    
    if (required) {
        inputElement.setAttribute('required', 'required');
    }
    
    formGroup.appendChild(labelElement);
    formGroup.appendChild(inputElement);
    
    return formGroup;
}

// Crear select de formulario
function createSelectFormGroup(id, label, options, required = true) {
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';
    
    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', id);
    labelElement.textContent = label;
    
    const selectElement = document.createElement('select');
    selectElement.setAttribute('id', id);
    selectElement.setAttribute('name', id);
    
    if (required) {
        selectElement.setAttribute('required', 'required');
    }
    
    // Añadir opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Seleccione una opción';
    selectElement.appendChild(defaultOption);
    
    // Añadir opciones
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        selectElement.appendChild(optionElement);
    });
    
    formGroup.appendChild(labelElement);
    formGroup.appendChild(selectElement);
    
    return formGroup;
}

// Mostrar mensaje de notificación
function showNotification(message, type = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Añadir a la página
    document.body.appendChild(notification);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Función para confirmar eliminación
function confirmDelete(id, name, type) {
    return confirm(`¿Está seguro que desea eliminar ${type} "${name}"?`);
}





















