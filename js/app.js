
const link = 'https://orthodontics-backend.onrender.com/api';

window.onload = function() {

    const btnRegister = document.getElementById('btn-registrarse');
    const btnSignin = document.getElementById('btn-signin');
    const signinForm = document.getElementById('signin-form');

    if (btnSignin) {

        btnSignin.onclick = async function () {
        
            const email = document.getElementById('email').value;
            const password = document.getElementById('pwd').value;

            if (email === '' || password === '') {
            
                $('#errors-login').modal('show');

                document.getElementById('error-code').textContent = '';
                document.getElementById('error-message').textContent = 'Campos vacíos';

                return;
            
            }

            if (!(email.match(/^[\w+\.]+@(\w+)\.+([\w-]{2,4})$/))) {

                $('#errors-login').modal('show');

                document.getElementById('error-code').textContent = 'Correo inválido';
                document.getElementById('error-message').textContent = 'Por favor, ingrese un correo válido por ejemplo: example@example.com';

                return;

            }

            const fetchResponse = await fetchPetition(`/auth/signin`, 'POST', { email, password });

            if (fetchResponse.message === undefined) {
                
                let errorMessage = '';
                let field = '';
            
                fetchResponse.results.forEach(result => {

                    field = formattingWords(result.property);
                    
                    Object.entries(result.errors).forEach(value => {
                        errorMessage += `- ${value.map(t => ` ${t}`).join('<br>')}`;
                    });
            
                    errorMessage += '<br><br>';
                });
            
                const errorAlert = `
                    <div class="alert" role="alert" align="left">
                        ${errorMessage}
                    </div>
                `;

                $('#errors-login').modal('show');

                document.getElementById('error-code').textContent = field;
                document.getElementById('error-message').innerHTML = errorAlert;

                return;

            }

            if (fetchResponse.code === 200 || fetchResponse.code === 201) {
                
                return window.location.href = '/src/views/citasProgramadas.html';

            } else {

                $('#errors-login').modal('show');

                document.getElementById('error-code').textContent = fetchResponse.code;
                document.getElementById('error-message').textContent = fetchResponse.message || '';

                return;

            }

        };

    }

};

// para las citas del dia
const showAllAppointments = async (page) => {

    // para validar codigos diferentes a 200
    // page = 100;
    
    if (page === undefined) 
        page = 1;

    const icons = {
        'Pendiente': 'schedule',
        'Asistió': 'check_circle',
        'No Asistió': 'cancel'
    };

    const tableBody = document.getElementById('dataTable');
    tableBody.innerHTML = '';

    const appointments = await fetchPetition(`/appointments?page=${page}`, 'GET', {});

    if (appointments.code !== 200) {

        $('#error').modal('show');

        // Actualiza el contenido del modal con los valores de appointments
        // document.getElementById('error').textContent = appointments.code;
        document.getElementById('error-code').textContent = appointments.code;
        document.getElementById('error-message').textContent = appointments.message || '';

        return;

    }

    for (const item of appointments.results) {

        const row = tableBody.insertRow();

        row.setAttribute('id', item._id);

        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        const cell6 = row.insertCell(5) ;        
        const cell7 = row.insertCell(6) ;        
 
        cell1.textContent = item._id;
        cell2.textContent = item.patient.name;
        cell3.textContent = item.department.name;
        cell3.setAttribute('data-filter', 'departamento');

        cell4.innerHTML = `<span id="state-${item._id}"  class="material-icons">${icons[item.state]}</span>`;
        cell4.setAttribute('data-filter',  item.state);
        
        cell5.textContent = item.hour;
        cell6.innerHTML = `<a id="${item._id}" href="#" class="btn btn-light btn-block" data-toggle="modal" data-target="#modalEditar"> 
            <span class="material-icons">edit</span></a>`;
        cell7.innerHTML = `<a id="${item._id}" href="#" class="btn btn-light btn-block" data-toggle="modal" data-target="#MyModal"> 
            <span class="material-icons">info</span></a>`;

    }

    // Actualizar elementos de paginación
    const paginationList = document.querySelector('.pagination');
    paginationList.innerHTML = '';

    if (appointments.totalPages === 1)
        return;

    if (page > 1) {
        
        const prevPageItem = document.createElement('li');
        
        prevPageItem.classList.add('page-item');
        
        prevPageItem.innerHTML = `
            <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        `;
        
        prevPageItem.addEventListener('click', () => showAllAppointments(page - 1));
        
        paginationList.appendChild(prevPageItem);
    
    }

    for (let i = 1; i <= appointments.totalPages; i++) {
        
        const pageItem = document.createElement('li');
        
        pageItem.classList.add('page-item');
        
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        
        pageItem.addEventListener('click', () => showAllAppointments(i));
        
        paginationList.appendChild(pageItem);

    }

    if (page < appointments.totalPages) {

        const nextPageItem = document.createElement('li');
        
        nextPageItem.classList.add('page-item');
        
        nextPageItem.innerHTML = `
            <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        `;
        
        nextPageItem.addEventListener('click', () => showAllAppointments(page + 1));
        
        paginationList.appendChild(nextPageItem);
    
    }

};

// para las citas del dia
const showAppointmentsToday = async (page) => {

    // para validar codigos diferentes a 200
    // page = 100;
    
    if (page === undefined) 
        page = 1;

    const icons = {
        'Pendiente': 'schedule',
        'Asistió': 'check_circle',
        'No Asistió': 'cancel'
    };

    const tableBody = document.getElementById('dataTable');
    tableBody.innerHTML = '';

    const appointments = await fetchPetition(`/appointments/today?page=${page}`, 'GET', {});

    if (appointments.code !== 200) {

        $('#error').modal('show');

        // Actualiza el contenido del modal con los valores de appointments
        // document.getElementById('error').textContent = appointments.code;
        document.getElementById('error-code').textContent = appointments.code;
        document.getElementById('error-message').textContent = appointments.message || '';

        return;

    }

    for (const item of appointments.results) {

        const row = tableBody.insertRow();

        row.setAttribute('id', item._id);

        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        const cell6 = row.insertCell(5);        

        cell1.textContent = item._id;
        cell2.textContent = item.patient.name;
        cell3.innerHTML = `<span id="state-${item._id}"  class="material-icons">${icons[item.state]}</span>`;
    
        cell4.textContent = item.hour;
        cell5.innerHTML = `<a id="${item._id}" href="#" class="btn btn-light btn-block" data-toggle="modal" data-target="#miModal"> 
            <span class="material-icons">edit</span></a>`;
        cell6.innerHTML = `<a id="${item._id}" href="#" class="btn btn-light btn-block" data-toggle="modal" data-target="#MyModal"> 
            <span class="material-icons">info</span></a>`;

    }

    // Actualizar elementos de paginación
    const paginationList = document.querySelector('.pagination');
    paginationList.innerHTML = '';

    if (appointments.totalPages === 1)
        return;

    if (page > 1) {
        
        const prevPageItem = document.createElement('li');
        
        prevPageItem.classList.add('page-item');
        
        prevPageItem.innerHTML = `
            <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        `;
        
        prevPageItem.addEventListener('click', () => showAppointmentsToday(page - 1));
        
        paginationList.appendChild(prevPageItem);
    
    }

    for (let i = 1; i <= appointments.totalPages; i++) {
        
        const pageItem = document.createElement('li');
        
        pageItem.classList.add('page-item');
        
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        
        pageItem.addEventListener('click', () => showAppointmentsToday(i));
        
        paginationList.appendChild(pageItem);

    }

    if (page < appointments.totalPages) {

        const nextPageItem = document.createElement('li');
        
        nextPageItem.classList.add('page-item');
        
        nextPageItem.innerHTML = `
            <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        `;
        
        nextPageItem.addEventListener('click', () => showAppointmentsToday(page + 1));
        
        paginationList.appendChild(nextPageItem);
    
    }

};

// Actualizar estado
const updateState = async (id, oldIcon, selectedIcon) => {

    const icons = {
        'schedule': 'Pendiente',
        'check_circle': 'Asistió',
        'cancel': 'No Asistió'
    };

    if (oldIcon === selectedIcon) 
        return;
    
    const updateState = await fetchPetition(`/appointments/update/${id}`, 'PATCH', { state: icons[selectedIcon] });

    if (updateState.code !== 200) {

        $('#error').modal('show');

        document.getElementById('error-code').textContent = updateState.code;
        document.getElementById('error-message').textContent = updateState.message || '';

        return;

    }

    $('#error').modal('show');

    document.getElementById('error-code').textContent = updateState.code;
    document.getElementById('error-message').textContent = updateState.message || '';

    const iconCell = document.getElementById(`state-${id}`);
    iconCell.textContent = selectedIcon;

    return;

};

// Mostrar detalles de cita
const showDetailsAppointment = async (id) => {

    const details = await fetchPetition(`/appointments/id/${id}`, 'GET', {});

    if (details.code !== 200) {

        $('#modal').modal('show');

        document.getElementById('code').textContent = details.code;
        document.getElementById('message').textContent = details.message || '';

        return;

    }

    const name = document.getElementById('nombre');
    const state = document.getElementById('estado');
    const date = document.getElementById('fecha-details');
    const hour = document.getElementById('hora');
    const reason = document.getElementById('motivo');
    const department = document.getElementById('departamento');

    name.value = details.results.patient.name;
    state.value = details.results.state;
    date.value = details.results.date.split('T')[0].split('-').reverse().join('/');
    hour.value = details.results.hour;
    reason.value = details.results.reason;
    department.value = details.results.department.name;

    return;
        
};

// Mostrar detalles de cita
const showDetailsAppointmentEdit = async (id) => {

    const details = await fetchPetition(`/appointments/id/${id}`, 'GET', {});

    if (details.code !== 200) {

        $('#error').modal('show');

        document.getElementById('error-code').textContent = details.code;
        document.getElementById('error-message').textContent = details.message || '';

        return;

    }

    const name = document.getElementById('nombre-edit');
    const date = document.getElementById('fecha-edit');
    const hour = document.getElementById('hora-edit');
    const reason = document.getElementById('motivo-edit');
    const department = document.getElementById('departamento-edit');
    const state = document.getElementById('estado-edit');

    const hourMeridiem = details.results.hour.split(' ')[1].toUpperCase();
    const hourFormat = `${details.results.hour.split(' ')[0]} ${hourMeridiem}`;

    name.value = details.results.patient.name;
    date.value = details.results.date.split('T')[0];
    hour.value = convertTo24HourFormat(hourFormat);
    reason.value = details.results.reason;
    department.value = details.results.department.name.toLowerCase();
    state.value = details.results.state;

    return;
        
};

const newAppointment = async () => {

    // id elementos 
    let date = document.getElementById('fecha').value;
    const hour = document.getElementById('hora').value;
    const patient = document.getElementById('paciente').value;
    const reason = document.getElementById('motivo').value;
    const department = document.getElementById('departamento').value;

    const modalCode = document.getElementById('code');
    const modalMessage = document.getElementById('message');

    if (date === '' || hour === '' || patient === '' || reason === '' || department === '') {
            
        $('#modal').modal('show');

        modalCode.textContent = '';
        modalMessage.textContent = 'Campos vacíos';

        return;

    }

    date = date.split('-').reverse().join('/');

    const newAppointment = await fetchPetition(`/appointments`, 'POST', { date, hour, patient, reason, department });

    if (newPatient.code !== 200 || newPatient.code !== 201) {

        if (newAppointment.message === undefined) {
                
            let errorMessage = '';
            let field = '';
        
            newAppointment.results.forEach(result => {

                field = formattingWords(result.property);
                
                Object.entries(result.errors).forEach(value => {
                    errorMessage += `- ${value.map(t => ` ${t}`).join('<br>')}`;
                });
        
                errorMessage += '<br><br>';
            });
        
            const errorAlert = `
                <div class="alert" role="alert" align="left">
                    ${errorMessage}
                </div>
            `;

            $('#modal').modal('show');

            modalCode.textContent = field;
            modalMessage.innerHTML = errorAlert;

            return;

        }

        $('#modal').modal('show');

        modalCode.textContent = newAppointment.code;
        modalMessage.textContent = newAppointment.message || '';

        // limpiar campos
        date.value = '';
        hour.value = '';
        patient.value = '';
        reason.value = '';
        
        return;
        
    }

    // mostrar confirmación
    $('#modal').modal('show');

    modalCode.textContent = newAppointment.code;
    modalMessage.textContent = newAppointment.message || '';

    $('#modal').on('hidden.bs.modal', function () {
        window.location.href = '/src/views/calendar.html';
    });

    return;
    
};

// patients
const showPatients = async (page) => {

    // para validar codigos diferentes a 200
    // page = 100;
    
    if (page === undefined) 
        page = 1;

    const icons = {
        'Pendiente': 'schedule',
        'Asistió': 'check_circle',
        'No Asistió': 'cancel'
    };

    const tableBody = document.getElementById('patient-list');
    tableBody.innerHTML = '';

    const patients = await fetchPetition(`/patients?page=${page}`, 'GET', {});

    if (patients.code !== 200) {

        $('#modal').modal('show');

        // Actualiza el contenido del modal con los valores de appointments
        // document.getElementById('error').textContent = appointments.code;
        document.getElementById('code').textContent = patients.code;
        document.getElementById('message').textContent = patients.message || '';

        return;

    }

    for (const item of patients.results) {

        const row = tableBody.insertRow();

        row.setAttribute('id', item._id);

        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);

        cell1.textContent = item._id;
        cell2.textContent = item.name;
        cell3.textContent = item.dni || 'No disponible';
        cell4.textContent = item.phone;
        cell4.setAttribute('id', `phone-${item._id}`);

        cell5.innerHTML = ` <button type="button" class="btn btn-primary" id="${item._id}" onclick="selectedPatientDetails(this.id)">
                                Detalles
                            </button>`;
                            
    }

    // Actualizar elementos de paginación
    const paginationList = document.querySelector('.pagination');
    paginationList.innerHTML = '';

    if (patients.totalPages === 1)
        return;

    if (page > 1) {
        
        const prevPageItem = document.createElement('li');
        
        prevPageItem.classList.add('page-item');
        
        prevPageItem.innerHTML = `
            <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        `;
        
        prevPageItem.addEventListener('click', () => showPatients(page - 1));
        
        paginationList.appendChild(prevPageItem);
    
    }

    for (let i = 1; i <= patients.totalPages; i++) {
        
        const pageItem = document.createElement('li');
        
        pageItem.classList.add('page-item');
        
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        
        pageItem.addEventListener('click', () => showPatients(i));
        
        paginationList.appendChild(pageItem);

    }

    if (page < patients.totalPages) {

        const nextPageItem = document.createElement('li');
        
        nextPageItem.classList.add('page-item');
        
        nextPageItem.innerHTML = `
            <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        `;
        
        nextPageItem.addEventListener('click', () => showPatients(page + 1));
        
        paginationList.appendChild(nextPageItem);
    
    }

};

const selectedPatientDetails = async (id) => {

    return window.location.href = `/src/views/patientDetails.html?id=${id}`;

}


// patients modal
const showPatientsModal = async (page) => {

    // para validar codigos diferentes a 200
    // page = 100;
    
    if (page === undefined) 
        page = 1;

    const icons = {
        'Pendiente': 'schedule',
        'Asistió': 'check_circle',
        'No Asistió': 'cancel'
    };

    const tableBody = document.getElementById('dataPatientsTable');
    tableBody.innerHTML = '';

    const patients = await fetchPetition(`/patients?page=${page}`, 'GET', {});

    if (patients.code !== 200) {

        $('#modal').modal('show');

        // Actualiza el contenido del modal con los valores de appointments
        // document.getElementById('error').textContent = appointments.code;
        document.getElementById('code').textContent = patients.code;
        document.getElementById('message').textContent = patients.message || '';

        return;

    }

    for (const item of patients.results) {

        const row = tableBody.insertRow();

        row.setAttribute('id', item._id);

        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);

        cell1.textContent = item._id;
        cell2.textContent = item.name;
        cell3.textContent = item.email || 'No disponible';
        cell4.textContent = item.phone;
        cell4.setAttribute('id', `phone-${item._id}`);
        
        cell5.innerHTML = `<button id="${item._id}" type="button" class="btn btn-primary" data-dismiss="modal" id="seleccion" onclick="selectedPatient(this.id)">
                                Seleccionar
                           </button>`;
      
    }

    // Actualizar elementos de paginación
    const paginationList = document.querySelector('.pagination');
    paginationList.innerHTML = '';

    if (patients.totalPages === 1)
        return;

    if (page > 1) {
        
        const prevPageItem = document.createElement('li');
        
        prevPageItem.classList.add('page-item');
        
        prevPageItem.innerHTML = `
            <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        `;
        
        prevPageItem.addEventListener('click', () => showPatientsModal(page - 1));
        
        paginationList.appendChild(prevPageItem);
    
    }

    for (let i = 1; i <= patients.totalPages; i++) {
        
        const pageItem = document.createElement('li');
        
        pageItem.classList.add('page-item');
        
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        
        pageItem.addEventListener('click', () => showPatientsModal(i));
        
        paginationList.appendChild(pageItem);

    }

    if (page < patients.totalPages) {

        const nextPageItem = document.createElement('li');
        
        nextPageItem.classList.add('page-item');
        
        nextPageItem.innerHTML = `
            <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        `;
        
        nextPageItem.addEventListener('click', () => showPatientsModal(page + 1));
        
        paginationList.appendChild(nextPageItem);
    
    }

};

const selectedPatient = async (id) => {

    const patient = document.getElementById('paciente');
    const phone = document.getElementById(`phone-${id}`);

    return patient.value = phone.textContent;
    
};

const searchPatient = async (text) => {

   if (text === '')
        return;

    const modalCode = document.getElementById('code');
    const modalMessage = document.getElementById('message');

    if (isEmail(text)) {

        const patient = await fetchPetition(`/patients/email/${text}`, 'GET', {});

        if (patient.code !== 200) {

            $('#modal').modal('show');
            
            modalCode.textContent = patient.code;
            modalMessage.textContent = patient.message || '';

            return;
        
        }
        
        // insertar en el modal
        insertDataTablePatients('patient-list', patient.results);

        return;
    
    }

    if (isPhone(text)) {

        const patient = await fetchPetition(`/patients/phone/${text}`, 'GET', {});

        if (patient.code !== 200) {

            $('#modal').modal('show');
            
            modalCode.textContent = patient.code;
            modalMessage.textContent = patient.message || '';
           
            return;

        }
        
        // insertar en el modal
        insertDataTablePatients('patient-list', patient.results);

        return;

    }

    if (isDNI(text)) {

        const patient = await fetchPetition(`/patients/dni/${text}`, 'GET', {});

        if (patient.code !== 200) {

            $('#modal').modal('show');
            
            modalCode.textContent = patient.code;
            modalMessage.textContent = patient.message || '';
            
            return;
      
        }
        
        // insertar en el modal
        insertDataTablePatients('patient-list', patient.results);

        return;

    }

    $('#modal').modal('show');

    modalCode.textContent = '';
    modalMessage.textContent = 'Debe ingresar un correo o un número de teléfono o un DNI';

    return;

};

const searchPatientModal = async (text) => {


   if (text === '')
        return;

    const modalCode = document.getElementById('code');
    const modalMessage = document.getElementById('message');

    if (isEmail(text)) {

        const patient = await fetchPetition(`/patients/email/${text}`, 'GET', {});

        if (patient.code !== 200) {

            $('#modal').modal('show');
            
            modalCode.textContent = patient.code;
            modalMessage.textContent = patient.message || '';

            return;
        
        }
        
        // insertar en el modal
        insertDataTableModalPatients('dataPatientsTable', patient.results);

        return;
    
    }

    if (isPhone(text)) {

        const patient = await fetchPetition(`/patients/phone/${text}`, 'GET', {});

        if (patient.code !== 200) {

            $('#modal').modal('show');
            
            modalCode.textContent = patient.code;
            modalMessage.textContent = patient.message || '';
           
            return;

        }
        
        // insertar en el modal
        insertDataTableModalPatients('dataPatientsTable', patient.results);

        return;

    }

    if (isDNI(text)) {

        const patient = await fetchPetition(`/patients/dni/${text}`, 'GET', {});

        if (patient.code !== 200) {

            $('#modal').modal('show');
            
            modalCode.textContent = patient.code;
            modalMessage.textContent = patient.message || '';
            
            return;
      
        }
        
        // insertar en el modal
        insertDataTableModalPatients('dataPatientsTable', patient.results);

        return;

    }

    $('#modal').modal('show');

    modalCode.textContent = '';
    modalMessage.textContent = 'Debe ingresar un correo o un número de teléfono o un DNI';

    return;

};

const newPatient = async () => {

    let name = document.getElementById('nombre').value;
    let email = document.getElementById('correo').value;
    let phone = document.getElementById('telefono').value;
    let address = document.getElementById('direccion').value;
    let dni = document.getElementById('dni').value;

    const modalCode = document.getElementById('code');
    const modalMessage = document.getElementById('message');

    if (name === '' || phone === '') {

        $('#modal').modal('show');

        modalCode.textContent = 'Campos obligatorios';
        modalMessage.textContent = 'El nombre y télefono son campos obligatorios';

        return;

    }

    if (phone !== '') {

        const phonePattern = /^[0-9]{1,8}$/i;

        if (!phonePattern.test(phone)) {

            $('#modal').modal('show');

            modalCode.textContent = 'Teléfono inválido';
            modalMessage.textContent = 'Por favor, ingrese un número de teléfono válido, por ejemplo: 98765432';

            return;

        }

        phone = parseInt(phone);

    }

    if (email !== '') {

        const emailPattern = /^[\w+\.]+@(\w+)\.+([\w-]{2,4})$/i;

        if (!emailPattern.test(email)) {

            $('#modal').modal('show');

            modalCode.textContent = 'Correo inválido';
            modalMessage.textContent = 'Por favor, ingrese un correo válido por ejemplo: example@example.com';

            return;

        }

    }

    if (dni !== '') {

        const dniPattern = /^([0-9]{4})\-([0-9]{4})\-([0-9]{5})$/i;

        if (!dniPattern.test(dni)) {

            $('#modal').modal('show');

            modalCode.textContent = 'DNI inválido';
            modalMessage.textContent = 'Por favor, ingrese un DNI válido por ejemplo: 1234-5678-90123';

            return;

        }

    }

    if (email === '')
        email = undefined;

    if (address === '')
        address = undefined;

    if (dni === '')
        dni = undefined;

    const newPatient = await fetchPetition(`/patients`, 'POST', { name, email, phone, address, dni });

    if (newPatient.code !== 200 && newPatient.code !== 201) {

        if (newPatient.message === undefined) {
                
            let errorMessage = '';
            let field = '';
        
            newPatient.results.forEach(result => {

                field = formattingWords(result.property);
                
                Object.entries(result.errors).forEach(value => {
                    errorMessage += `- ${value.map(t => ` ${t}`).join('<br>')}`;
                });
        
                errorMessage += '<br><br>';
            });
        
            const errorAlert = `
                <div class="alert" role="alert" align="left">
                    ${errorMessage}
                </div>
            `;

            $('#modal').modal('show');

            modalCode.textContent = field;
            modalMessage.innerHTML = errorAlert;

            return;

        }

        $('#modal').modal('show');

        modalCode.textContent = newPatient.code;
        modalMessage.textContent = newPatient.message || '';

        // limpiar campos
        // name.value = '';
        // email.value = '';
        // phone.value = '';
        // address.value = '';
        // dni.value = '';
        
        return;
        
    }
    
    // mostrar confirmación
    $('#modal').modal('show');
    
    modalCode.textContent = newPatient.code;
    modalMessage.textContent = newPatient.message || '';
    

    $('#modal').on('hidden.bs.modal', function () {
        window.location.href = '/src/views/patientList.html';
    });

    return;

};

const showDetailsPatient = async () => {

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('id') === null || urlParams.get('id') === undefined) {

        return window.location.href = '/src/views/patientList.html';

    }

    const info = urlParams.get('id').split(/\?=/);
    
    const id = info.toString();
    
    const idField = document.getElementById('id');
    const name = document.getElementById('nombre');
    const email = document.getElementById('correo');
    const phone = document.getElementById('telefono');
    const address = document.getElementById('direccion');
    const dni = document.getElementById('dni');
    const historial = document.getElementById('historial');

    const patient = await fetchPetition(`/patients/${id}`, 'GET', {});

    if (patient.code !== 200) {

        $('#modal').modal('show');

        document.getElementById('code').textContent = patient.code;
        document.getElementById('message').textContent = patient.message || '';

        return;

    }

    idField.value = patient.results._id;
    name.value = patient.results.name;
    email.value = patient.results.email || 'No disponible';
    phone.value = patient.results.phone;
    address.value = patient.results.address || 'No disponible';
    dni.value = patient.results.dni || 'No disponible';
    
    if (patient.results.medical_record.length > 0) {

        historial.innerHTML = '';

        for (const item of patient.results.medical_record) {

            const li = document.createElement('li');

            li.classList.add('list-group-item');
            li.textContent = item.name;

            historial.appendChild(li);

        }

    } else {

        historial.innerHTML = '<li class="list-group-item">No hay registros</li>';

    }

    // showAppointmentsUser(1);

    return;

};

const showAppointmentsUser = async (page) => {

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('id') === null || urlParams.get('id') === undefined) {

        return window.location.href = '/src/views/patientList.html';

    }

    const info = urlParams.get('id').split(/\?=/);
    
    const id = info.toString();

    const appointmentsRecord = document.getElementById('appointments-record');
    appointmentsRecord.innerHTML = '';

    // Actualizar elementos de paginación
    const paginationList = document.querySelector('.pagination');
    paginationList.innerHTML = '';

    const appointments = await fetchPetition(`/appointments/patient/${id}`, 'GET', {});

    if (appointments.code !== 200) {

        appointmentsRecord.innerHTML = '<li class="list-group-item">No hay registros</li>';

    }

    for (const item of appointments.results) {

        const row = appointmentsRecord.insertRow();

        row.setAttribute('id', item._id);

        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
       
        cell1.innerHTML = `  <td><button id="${item._id}" class="btn btn-link" disabled>
                                <img src="/img/carpet.png"  alt="" width="13" height="13">
                            </button></td>`;
        cell2.textContent = item._id;
        cell3.textContent = item.date.split('T')[0].split('-').reverse().join('/');

    }

    if (appointments.totalPages === 1)
        return;

    if (page > 1) {
        
        const prevPageItem = document.createElement('li');
        
        prevPageItem.classList.add('page-item');
        
        prevPageItem.innerHTML = `
            <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        `;
        
        prevPageItem.addEventListener('click', () => showAppointmentsUser(page - 1));
        
        paginationList.appendChild(prevPageItem);
    
    }

    for (let i = 1; i <= appointments.totalPages; i++) {
        
        const pageItem = document.createElement('li');
        
        pageItem.classList.add('page-item');
        
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        
        pageItem.addEventListener('click', () => showAppointmentsUser(i));
        
        paginationList.appendChild(pageItem);

    }

    if (page < appointments.totalPages) {

        const nextPageItem = document.createElement('li');
        
        nextPageItem.classList.add('page-item');
        
        nextPageItem.innerHTML = `
            <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        `;
        
        nextPageItem.addEventListener('click', () => showAppointmentsUser(page + 1));
        
        paginationList.appendChild(nextPageItem);
    
    }

};

const updateAppointment = async (id) => {

    let department = document.getElementById('departamento-edit').value;
    let hourNew = document.getElementById('hora-edit').value;
    let dateNew = document.getElementById('fecha-edit').value;
    let reason = document.getElementById('motivo-edit').value;
    let state = document.getElementById('estado-edit').value;

    const modalCode = document.getElementById('code');
    const modalMessage = document.getElementById('message');
    
    if (department === '' || hourNew === '' || dateNew === '' || reason === '') {

        $('#modal').modal('show');

        modalCode.textContent = '';
        modalMessage.textContent = 'Campos vacíos';


        return;

    }


    const dataOld = await fetchPetition(`/appointments/id/${id}`, 'GET', {});

    if (dataOld.code !== 200) {

        $('#modal').modal('show');

        modalCode.textContent = updatePatient.code;
        modalMessage.textContent = updatePatient.message || '';

        return; 

    }

    if (dataOld.results.date.split('T')[0] === dateNew)
        dateNew = undefined;

    if (formatTimeTo24Hours(dataOld.results.hour) === hourNew)
        hourNew = undefined;

    if (dataOld.results.department.name.toLowerCase() === department)
        department = undefined;

    if (dataOld.results.reason === reason)
        reason = undefined;

    if (state !== 'Pendiente')
        state = 'Pendiente';

    if (dateNew === undefined && hourNew === undefined && department === undefined && reason === undefined) {
        
        $('#modal').modal('show');

        modalCode.textContent = 'Datos no actualizados';
        modalMessage.textContent = 'Los datos siguen siendo los mismos anteriores.';

        return;

    }

    if (dateNew !== undefined)
        dateNew = convertDateToDDMMYYYY(dateNew);

    const updatePatient = await fetchPetition(`/appointments/update/${id}`, 'PATCH', { department, hourNew, dateNew, reason, state });

    if (updatePatient.code !== 200) {

        $('#modal').modal('show');

        modalCode.textContent = updatePatient.code;
        modalMessage.textContent = updatePatient.message || '';

        return;

    }

    $('#modal').modal('show');

    modalCode.textContent = updatePatient.code;
    modalMessage.textContent = updatePatient.message || '';

    showAllAppointments();

    $('#modalEditar').modal('hide');

    // $('#modal').on('hidden.bs.modal', function () {
    //     window.location.href = '/src/views/homepage.html';
    // });

    return;

};

const newUser = async () => {

    let firstname = document.getElementById('nombre').value;
    let surname = document.getElementById('apellido').value;
    let email = document.getElementById('correo').value;
    let phone = document.getElementById('telefono').value;
    let password = document.getElementById('password').value;
    let confirm_password = document.getElementById('confirmarPassword').value;
    let role = document.getElementById('rol').value;

    const modalCode = document.getElementById('code');
    const modalMessage = document.getElementById('message');

    if (firstname === '' || email === '' || phone === '' || password === '' || confirm_password === '' || role === '') {

        $('#modal').modal('show');

        modalCode.textContent = 'Campos obligatorios';
        modalMessage.textContent = 'Todos los campos son obligatorios';

        return;

    }

    const phonePattern = /^[0-9]{1,8}$/i;

    if (!phonePattern.test(phone)) {

        $('#modal').modal('show');

        modalCode.textContent = 'Teléfono inválido';
        modalMessage.textContent = 'Por favor, ingrese un número de teléfono válido, por ejemplo: 98765432';

        return;

    }

    phone = parseInt(phone);

    const emailPattern = /^[\w+\.]+@(\w+)\.+([\w-]{2,4})$/i;

    if (!emailPattern.test(email)) {

        $('#modal').modal('show');

        modalCode.textContent = 'Correo inválido';
        modalMessage.textContent = 'Por favor, ingrese un correo válido por ejemplo: example@example.com';

        return;

    }

    if (password !== confirm_password) {

        $('#modal').modal('show');

        modalCode.textContent = 'Contraseñas no coinciden';
        modalMessage.textContent = 'Por favor, ingrese contraseñas iguales';

        return;

    }

    const name = `${firstname} ${surname}`;

    const newPatient = await fetchPetition(`/user/new`, 'POST', { name, email, phone, password, confirm_password, role });

    if (newPatient.code !== 200 && newPatient.code !== 201) {

        if (newPatient.message === undefined) {
                
            let errorMessage = '';
            let field = '';
        
            newPatient.results.forEach(result => {

                field = formattingWords(result.property);
                
                Object.entries(result.errors).forEach(value => {
                    errorMessage += `- ${value.map(t => ` ${t}`).join('<br>')}`;
                });
        
                errorMessage += '<br><br>';
            });
        
            const errorAlert = `
                <div class="alert" role="alert" align="left">
                    ${errorMessage}
                </div>
            `;

            $('#modal').modal('show');

            modalCode.textContent = field;
            modalMessage.innerHTML = errorAlert;

            return;

        }

        $('#modal').modal('show');

        modalCode.textContent = newPatient.code;
        modalMessage.textContent = newPatient.message || '';

        // limpiar campos
        // name.value = '';
        // email.value = '';
        // phone.value = '';
        // address.value = '';
        // dni.value = '';
        
        return;
        
    }
    
    // mostrar confirmación
    $('#modal').modal('show');
    
    modalCode.textContent = newPatient.code;
    modalMessage.textContent = newPatient.message || '';
    

    $('#modal').on('hidden.bs.modal', function () {
        window.location.href = '/src/views/citasProgramadas.html';
    });

    return;

};

const verifySession = async () => {

    const fetchResponse = await fetchPetition('/user/profile', 'GET', {});

    if (fetchResponse.code === 401 || fetchResponse.code === 400 || fetchResponse.code === 500 || fetchResponse.code === 404) {  
        
        $('#error').modal('show');

        $('#error').on('hidden.bs.modal', function () {
            window.location.href = '/src/views/login.html';
        });
        
        document.getElementById('error-code').textContent = fetchResponse.code;
        document.getElementById('error-message').textContent = fetchResponse.message || '';
        
        return;

    } 

    const desiredPart = window.location.href.split("views/").pop();

    if ((fetchResponse.code === 200 || fetchResponse.code === 201) && desiredPart === 'login.html') {

        return window.location.href = '/src/views/citasProgramadas.html';   

    }
   
};

const signout = async () => {

    await fetchPetition('/auth/signout', 'DELETE', {});

    return window.location.href = '/src/views/login.html';

};

const fetchPetition = async (baseUrl, method, body) => {

    const fetchResponse = await fetch(`${link}${baseUrl}`, { 
        method,
        mode: 'cors',
        credentials: 'include',
        body: method === 'GET' ? undefined : JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res => res.json());    

    return fetchResponse;

};

// otras funciones
const formattingWords = (words) => {
            
    return words.trim().toLowerCase().split(' ').filter(s => s !== '').join(' ').replace(/(^\w{1})|(\s+\w{1})/g, word => word.toUpperCase());
    
};

const isDNI = (dni) => {
    
    return dni.match(/^([0-9]{4})\-([0-9]{4})\-([0-9]{5})$/i);
    
};

const isEmail = (email) => {

    return email.match(/^[\w+\.]+@(\w+)\.+([\w-]{2,4})$/i);

};

const isPhone = (phone) => {

    return phone.match(/^([0-9]{1,8})$/i);
    
};

const insertDataTableModalPatients = (id, items) => {
    
    // eliminar paginacion
    const paginationList = document.querySelector('.pagination');
    paginationList.innerHTML = '';

    const tableBody = document.getElementById(id);
    tableBody.innerHTML = '';

    const row = tableBody.insertRow();

    row.setAttribute('id', items._id);

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);

    cell1.textContent = items._id;
    cell2.textContent = items.name;

    cell3.textContent = items.email || 'No disponible';
    cell4.textContent = items.phone;
    cell4.setAttribute('id', `phone-${items._id}`);

    cell5.innerHTML = `<button id="${items._id}" type="button" class="btn btn-primary" data-dismiss="modal" id="seleccion" onclick="selectedPatient(this.id)">
                                Seleccionar
                           </button>`;

    return;

};

const insertDataTablePatients = (id, items) => {
    
    // eliminar paginacion
    const paginationList = document.querySelector('.pagination');
    paginationList.innerHTML = '';

    const tableBody = document.getElementById(id);
    tableBody.innerHTML = '';

    const row = tableBody.insertRow();

    row.setAttribute('id', items._id);

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);

    cell1.textContent = items._id;
    cell2.textContent = items.name;

    cell3.textContent = items.email || 'No disponible';
    cell4.textContent = items.phone;
    cell4.setAttribute('id', `phone-${items._id}`);
    cell5.innerHTML = ` <button type="button" class="btn btn-primary" id="${items._id}" onclick="selectedPatientDetails(this.id)">
        Detalles
    </button>`;

    return;

};

const convertTo24HourFormat = (h) =>  {

    const [time, meridiem] = h.split(' ');
    const [hour, minute] = time.split(':');

    let hour24 = parseInt(hour);

    if (meridiem === 'PM' && hour24 !== 12) {
        hour24 += 12;
    } else if (meridiem === 'AM' && hour24 === 12) {
        hour24 = 0;
    }

    return `${hour24.toString().padStart(2, '0')}:${minute}`;

}

const convertDateToDDMMYYYY = (date) => {

    date = new Date(date);

    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');

    return `${day}/${month}/${year}`;

};

const formatTimeTo24Hours = (time12h) => {

    const [time, period] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (period === 'pm' && hours !== '12') {

        hours = String(parseInt(hours) + 12);

    } else if (period === 'am' && hours === '12') {

        hours = '00';

    }

    return `${hours}:${minutes}`;

}
