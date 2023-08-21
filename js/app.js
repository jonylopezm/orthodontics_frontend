
const link = 'https://orthodontics-backend.onrender.com/api';

window.onload = function() {

    const btnRegister = document.getElementById('btn-registrarse');
    const btnSignin = document.getElementById('btn-signin');
    const btnSignin1 = document.getElementById('btn-signin1');
    const signinForm = document.getElementById('signin-form');

    // if (signinForm) {

    //     signinForm.onsubmit = async function (e) {

    //         const email = document.getElementById('email').value;
    //         const pwd = document.getElementById('pwd').value;

    //         alert(email + ' ' + pwd);

    //         if (email === '' || pwd === '') {
    //             e.preventDefault();
    //         }

    //     };

    // }
    
    /*
    // antes de presionar el botón de registrarse, se verifica que el correo sea válido
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');

    emailInput.addEventListener('input', function () {
        
        const email = emailInput.value;

        if (email == '') {

            return emailError.textContent = '';

        }
        
        if (email.match(/^[\w+\.]+@(\w+)\.+([\w-]{2,4})$/)) {
            
            return emailError.textContent = '';
       
        } else {
            
            emailError.textContent = 'Correo inválido';
        
        }

    });
    */

    if (btnSignin) {

        btnSignin.onclick = async function () {
        
            const email = document.getElementById('email').value;
            const password = document.getElementById('pwd').value;

            if (email === '' || password === '') {
            
                // return Swal.fire({
                //     html: `
                //     <div class="container">
                //         <h2 class="mb-3">Campos vacíos</h2>
                //         <p>Por favor, ingrese su correo y contraseña.</p>
                //     </div>
                //     `,
                //     showConfirmButton: true,
                //     confirmButtonText: "Aceptar",
                //     confirmButtonColor: "#007bff",
                //     icon: "warning",
                //     iconColor: "#007bff",
                //     customClass: {
                //         popup: 'custom-swal-popup',
                //         confirmButton: 'btn btn-primary'
                //     }
                // });

                $('#errors-login').modal('show');

                document.getElementById('error-code').textContent = '';
                document.getElementById('error-message').textContent = 'Campos vacíos';

                return;
            
            }

            if (!(email.match(/^[\w+\.]+@(\w+)\.+([\w-]{2,4})$/))) {
             
                // return Swal.fire({
                //     html: `
                //     <div class="container">
                //         <h2 class="mb-3">Correo inválido</h2>
                //         <p>Por favor, ingrese un correo válido por ejemplo: example@example.com</p>
                //     </div>
                //     `,
                //     showConfirmButton: true,
                //     confirmButtonText: "Aceptar",
                //     confirmButtonColor: "#007bff",
                //     customClass: {
                //         popup: 'custom-swal-popup',
                //         confirmButton: 'btn btn-primary'

                //     }
                // });

                $('#errors-login').modal('show');

                document.getElementById('error-code').textContent = 'Correo inválido';
                document.getElementById('error-message').textContent = 'Por favor, ingrese un correo válido por ejemplo: example@example.com';

                return;

            }

            const fetchResponse = await fetchPetition(`/auth/signin`, 'POST', { email, password });

            // console.log(fetchResponse);

            if (fetchResponse.message === undefined) {
                
                let errorMessage = '';
                let field = '';
            
                fetchResponse.results.forEach(result => {
                    // errorMessage += `<strong>Campo: ${result.property}</strong><br>Errores:<br>`;
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

                // return Swal.fire({
                //     html: `
                //         <div class="container">
                //             <div class="row">
                //                 <div class="col-12 text-center">
                //                     <h1 class="display-4">${fetchResponse.code}</h1>
                //                     <p class="lead">${fetchResponse.message || ''}</p>
                //                 </div>
                //             </div>
                //         </div>
                //     `,
                //     showConfirmButton: true,
                //     confirmButtonText: "Aceptar",
                //     confirmButtonColor: "#007bff",
                //     customClass: {
                //         popup: 'custom-swal-popup',
                //         confirmButton: 'btn btn-primary',
                //         container: 'custom-swal-container'
                //     }
                // });

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

    // console.log(page);

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
    // const appointments = response.results;
    // const totalPages = response.totalPages;

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
        
        // cell3.classList.add('icon-cell');
        // cell3.innerHTML = `<span id class="material-icons">${icons[item.state]}</span>`;

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

    // console.log(page);

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
    // const appointments = response.results;
    // const totalPages = response.totalPages;

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
        
        // cell3.classList.add('icon-cell');
        // cell3.innerHTML = `<span id class="material-icons">${icons[item.state]}</span>`;

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

// // Función para obtener el ícono de asistencia
// function getAsistenciaIcon(state) {

//     const icons = { 
//         'Pendiente': 'schedule',
//         'Asistió': 'check_circle',
//         'No asistió': 'cancel text-danger'
//     };

//     return `<span class="material-icons">${icons[state]}</span>`;

// }

// Actualizar estado
const updateState = async (id, oldIcon, selectedIcon) => {

    const icons = {
        'schedule': 'Pendiente',
        'check_circle': 'Asistió',
        'cancel': 'No Asistió'
    };

    // console.log('selectedIcon', selectedIcon);
    // console.log('oldIcon', oldIcon);
    // console.log('id', id);

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

    console.log('||', id);

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

    // console.log(name.value);

    name.value = details.results.patient.name;
    state.value = details.results.state;
    date.value = details.results.date.split('T')[0].split('-').reverse().join('/');
    hour.value = details.results.hour;
    reason.value = details.results.reason;
    department.value = details.results.department.name;

    // console.log(details.results.date.split('T')[0].split('-').reverse().join('/'));

    return;
        
};

// Mostrar detalles de cita
const showDetailsAppointmentEdit = async (id) => {

    // console.log(id);

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

    // console.log(name.value);
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

    // alert(department.value);
    // console.log(hour);

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

    if (newAppointment.code !== 200) {

        if (newAppointment.message === undefined) {
                
            let errorMessage = '';
            let field = '';
        
            newAppointment.results.forEach(result => {
                // errorMessage += `<strong>Campo: ${result.property}</strong><br>Errores:<br>`;
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
        // department.value = '';
        
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

    // console.log(page);

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
    // const appointments = response.results;
    // const totalPages = response.totalPages;

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
        // const cell6 = row.insertCell(5);        

        cell1.textContent = item._id;
        cell2.textContent = item.name;
        // cell3.innerHTML = `<span id="state-${item._id}"  class="material-icons">${icons[item.state]}</span>`;
        cell3.textContent = item.dni || 'No disponible';
        cell4.textContent = item.phone;
        cell4.setAttribute('id', `phone-${item._id}`);
        
        // cell3.classList.add('icon-cell');
        // cell3.innerHTML = `<span id class="material-icons">${icons[item.state]}</span>`;

        // cell4.textContent = item.hour;
        cell5.innerHTML = ` <button type="button" class="btn btn-primary" id="${item._id}" onclick="selectedPatientDetails(this.id)">
                                Detalles
                            </button>`;
                            
        // cell6.innerHTML = `<a id="${item._id}" href="#" class="btn btn-light btn-block" data-toggle="modal" data-target="#MyModal"> 
        //     <span class="material-icons">info</span></a>`;

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

    // console.log(page);

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
    // const appointments = response.results;
    // const totalPages = response.totalPages;

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
        // const cell6 = row.insertCell(5);        

        cell1.textContent = item._id;
        cell2.textContent = item.name;
        // cell3.innerHTML = `<span id="state-${item._id}"  class="material-icons">${icons[item.state]}</span>`;
        cell3.textContent = item.email || 'No disponible';
        cell4.textContent = item.phone;
        cell4.setAttribute('id', `phone-${item._id}`);
        
        // cell3.classList.add('icon-cell');
        // cell3.innerHTML = `<span id class="material-icons">${icons[item.state]}</span>`;

        // cell4.textContent = item.hour;
        cell5.innerHTML = `<button id="${item._id}" type="button" class="btn btn-primary" data-dismiss="modal" id="seleccion" onclick="selectedPatient(this.id)">
                                Seleccionar
                           </button>`;
        // cell6.innerHTML = `<a id="${item._id}" href="#" class="btn btn-light btn-block" data-toggle="modal" data-target="#MyModal"> 
        //     <span class="material-icons">info</span></a>`;

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

    // alert(text);

    // alert(text);

   if (text === '')
        return;

    // const patient = await fetchPetition(`/patients/${text}`, 'GET', {});
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

    alert(text);

    // alert(text);

   if (text === '')
        return;

    // const patient = await fetchPetition(`/patients/${text}`, 'GET', {});
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

const createPatient = async () => {
    
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
    
        // if (name === '' || email === undefined || phone === '') {
    
        //     $('#error').modal('show');
    
        //     document.getElementById('error-code').textContent = '';
        //     document.getElementById('error-message').textContent = 'Campos vacíos';
    
        //     return;
    
        // }
    
        // if (!(email.match(/^[\w+\.]+@(\w+)\.+([\w-]{2,4})$/))) {
    
        //     $('#error').modal('show');
    
        //     document.getElementById('error-code').textContent = 'Correo inválido';
        //     document.getElementById('error-message').textContent = 'Por favor, ingrese un correo válido por ejemplo: 
};

// const updateAppointment = async (id, initialDepartament, initialHour , initialDate, initialReason) => {
const updateAppointment = async (id) => {

    let department = document.getElementById('departamento-edit').value;
    let hourNew = document.getElementById('hora-edit').value;
    let dateNew = document.getElementById('fecha-edit').value;
    let reason = document.getElementById('motivo-edit').value;
    let state = document.getElementById('estado-edit').value;

    const modalCode = document.getElementById('code');
    const modalMessage = document.getElementById('message');

    console.log('id', id);
    // console.log('department', department, '\nold', initialDepartment);
    // console.log('hour', hourNew, '\nold', initialHour);
    // // console.log('date', dateNew, '\nold', initialDate);
    // console.log('reason', reason, '\nold', initialReason);

    console.log('hour', hourNew);
    console.log('date', dateNew);
    console.log('department', department);
    console.log('reason', reason);
    
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

    // if (dataOld.results.date === )
    console.log(dataOld.results.date.split('T')[0] === dateNew);

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

    console.log('hour', hourNew);
    console.log('date', dateNew);
    console.log('department', department);
    console.log('reason', reason);

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

    console.log('items', items);
    
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

    console.log('items', items);
    
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

    // console.log(`${day}/${month}/${year}`);

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
