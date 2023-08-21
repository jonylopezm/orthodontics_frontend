
const link = 'https://orthodontics-backend.onrender.com/api';

//cargar vista de calendario
document.addEventListener("DOMContentLoaded", function () {

  var calendarEl = document.getElementById('calendar'); // Obtén el elemento del calendario

  let fetchingEvents = false;

  const colors = {
    'Pendiente': 'blue',
    'Asistió': 'green',
    'No Asistió': 'red'
  };

  // var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: "prev,next today", // will normally be on the left. if RTL, will be on the right
      center: "title",
      right: "dayGridMonth,timeGridDay", // will normally be on the right. if RTL, will be on the left
    },
    dateClick: function (info) {
      openNewAppointment(info.dateStr);
    },
    eventClick: function (info) {
      /* window.location.href = '/eventDetails.html?id=' + info.event.id; */
      /*  alert("Haz hecho clic en el evento: " + info.event.title); */
      openModal(info.event.id);
    },
    locale: "es",
    dayMaxEventRows: 2,
    // showNonCurrentDates: false,
    datesSet: function (dateInfo) {

      // const start = dateInfo.startStr;
      // const end = dateInfo.endStr;

      const start = new Date(dateInfo.start).toLocaleDateString('es-HN', { timeZone: 'America/Tegucigalpa' });
      const end = new Date(dateInfo.end).toLocaleDateString('es-HN', { timeZone: 'America/Tegucigalpa' });

      const arrayStart = start.split('/');

      // const end = `${new Date(arrayStart[2], arrayStart[1], 0).getDate()}/${arrayStart[1]}/${arrayStart[2]}`;

      fetchingEvents = false;

      fetchAllEventsInRange(start, end);

    }

  });

  // Función para cargar eventos en el calendario
  async function fetchAllEventsInRange(startDate, endDate) {

    if (fetchingEvents) {

      // console.log('Petición en curso, esperando respuesta...');
      return;

    }

    fetchingEvents = true;

    try {

      let totalPages = 1;
      const eventsAllApp = [];

      const response = await fetchPetition(`/appointments/calendar?start=${startDate}&end=${endDate}&page=1`, 'GET');

      // console.log('response', response);

      if (response.code === 200) {

        totalPages = response.totalPages;

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {

          const pageData = await fetchPetition(`/appointments/calendar?start=${startDate}&end=${endDate}&page=${currentPage}`, 'GET');

          const events = pageData.results.map(event => ({
            id: event._id,
            title: event.patient.name,
            start: `${event.date.split('T')[0]}T${formatTimeTo24Hours(event.hour)}`,
            backgroundColor: colors[event.state]
          }));

          eventsAllApp.push(...events);

          // aca se renderiza el calendario a tiempo real pero afecta las peticiones en caso de cambiar de mes rapidamente
          calendar.removeAllEvents();
          calendar.addEventSource(eventsAllApp);

          if (currentPage <= totalPages) {

            await new Promise(resolve => setTimeout(resolve, 1000));

          }

        }

        // aca se renderiza el calendario una sola vez pero al rato
        // calendar.removeAllEvents();
        // calendar.addEventSource(eventsAllApp);

      }
      /* // muestra error en cada mes que no tiene citas registradas
      else {
  
        // crear un modal de que no hay citas registradas
        $('#errors-calendar').html(`
          <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                  <h5 class="modal-title" id="error-code">${response.code}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div class="modal-body">
                  <p id="error-message">${response.message || ''}</p>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-primary" data-dismiss="modal">Aceptar</button>
              </div>
            </div>
          </div>
        `).modal('show');
  
        console.log('No hay citas registradas');
      
        // renderCalendar([]);
        
        return;
  
      }*/

      // }

    } catch (error) {

      console.error('Error fetching events:', error);

    } finally {

      fetchingEvents = false;

    }

  }

  calendar.render(); // Renderiza el calendario

});

function openNewAppointment(date) {
  /* Abrir la ventana modal para crear nueva cita */
  fetch("/components/modalNewAppointment.html")
    .then((response) => response.text())
    .then((content) => {

      // if ()

      // console.log(convertDateToDDMMYYYY(date))

      const currentDate = new Date().toLocaleDateString('es-HN', { timeZone: 'America/Tegucigalpa' });

      // console.log(currentDay);

      // console.log([convertDateToDDMMYYYY(date), currentDay].sort(compareDate));

      // const [date1, date2] = [convertDateToDDMMYYYY(date), currentDay].sort(compareDate);

      // Formatear la fecha para el input tipo date (YYYY-MM-DD)
      // const formattedDate = formatDateForInput(date);

      if (!validateOnlyDateNew(convertDateToDDMMYYYY(date))) {

        $('#error').modal('show');

        document.getElementById('error-code').textContent = 'Sólo se pueden crear citas en fechas futuras';
        document.getElementById('error-message').textContent = `En las fechas antiguas a '${currentDate}' no se pueden crear citas, solo se pueden visualizar las previamente creadas.`;

        return;

      } else {

        document.getElementById("modalContainer").innerHTML = content;
        const modal = new bootstrap.Modal(
          document.getElementById("confirmationModal")
        );
        modal.show();
        
        const formattedDate = formatDateForInput(date);

        document.getElementById("confirmationDate").textContent = convertDateToDDMMYYYY(date);

        // Redirigir a la página newAppointment.html con el parámetro de consulta
        const confirmButton = document.getElementById("confirmButton");
        confirmButton.addEventListener("click", function () {
          // Redirigir a la página newAppointment.html con el parámetro de consulta
          window.location.href = `/src/views/newAppointment.html?date=${formattedDate}`;
        });

      }


    });
}

function openModal(id) {
  // console.log(id);
  /* Abrir la ventana modal para modalAppointmentDetail */
  fetch("/components/modalAppointmentDetail.html")
    .then((response) => response.text())
    .then((content) => {
      document.getElementById("modalDetailContainer").innerHTML = content;
      const modal = new bootstrap.Modal(
        document.getElementById("mDetailAppointment")
      );
      showDetailsAppointment(id);

      // para darle tiempo a buscar la cita
      setTimeout(() => { modal.show(); }, 1000);
      
    });
}

function formatDateForInput(date) {
  const year = date.substring(0, 4);
  const month = date.substring(5, 7);
  const day = date.substring(8, 10);
  return `${year}-${month}-${day}`;
}

const convertDateToDDMMYYYY = (date) => {

  date = new Date(date);

  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');

  // console.log(`${day}/${month}/${year}`);
  
  return `${day}/${month}/${year}`;

};

const convertDateToYYYYMMDD = (date) => {
        
  return date.split('/').reverse().join('-');
  
};

const compareDate = (a, b) => {

  console.log(a, b);
    
  const dateA = new Date(`${convertDateToYYYYMMDD(a)}`);
  const dateB = new Date(`${convertDateToYYYYMMDD(b)}`);
          
  return dateA.getTime() - dateB.getTime();

};

const validateOnlyDateNew = (date) => {

  // Estructura válida dd/mm/yyyy o dd-mm-yyyy
  const dateMatch = date.match(/^([0-9]{1,2})[\/?\-?]{1}([0-9]{1,2})[\/?\-?]{1}([0-9]{4})$/i);

  if (dateMatch === null)
    return false;

  // Para validar que no esté ingresando un fecha vieja
  const today = new Date().toLocaleDateString('es-HN', { timeZone: 'America/Tegucigalpa' }).split('/');
  const currentDay = parseInt(today[0]);
  const currentMonth = parseInt(today[1]);
  const currentYear = parseInt(today[2]);

  const day = parseInt(dateMatch[1]);
  const month = parseInt(dateMatch[2]);
  const year = parseInt(dateMatch[3]);

  // Días del mes según la fecha que se ingresó
  const daysInMonth = new Date(year, month, 0).getDate();

  if (month > 12 || day < 1)
    return false;

  // Para validar que no está ingresa datos viejos
  if (year < currentYear)
    return false;

  if (year === currentYear && month < currentMonth)
    return false;

  if (year === currentYear && month === currentMonth && day < currentDay)
    return false;

  // Para validar que no esté ingresando un día que no existe
  if (day > daysInMonth)
    return false;

  return date;

};

/* formatDateForInput toma la fecha en formato YYYY-MM-DD y la divide en partes para formatearla 
  como se espera en el input de tipo date. Luego, se establece el valor del input 
  de fecha con la fecha formateada. */

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

// Repetido porque no funciona desde el script de app.js
const showDetailsAppointment = async (id) => {

  // console.log(id);

  const details = await fetchPetition(`/appointments/id/${id}`, 'GET', {});

  if (details.code !== 200) {

    $('#error').modal('show');

    document.getElementById('error-code').textContent = details.code;
    document.getElementById('error-message').textContent = details.message || '';

    return;

  }

  const name = document.getElementById('nombre');
  const state = document.getElementById('estado');
  const date = document.getElementById('fecha');
  const hour = document.getElementById('hora');
  const reason = document.getElementById('motivo');
  const department = document.getElementById('departamento');

  // console.log(name.value);

  name.value = details.results.patient.name;
  state.value = details.results.state;
  date.value = details.results.department.name;
  hour.value = details.results.hour;
  reason.value = details.results.reason;
  department.value = details.results.department.name;

  console.log(details.results.date.split('T')[0].split('-').reverse().join('/'))

  return;
      
};

// Repetido porque no funciona desde el script de app.js
const verifySession = async () => {

  const fetchResponse = await fetchPetition('/user/profile', 'GET', {});

  if (fetchResponse.code === 401 || fetchResponse.code === 400 || fetchResponse.code === 500 || fetchResponse.code === 404) {

    $('#error').modal('show');

    $('#error').on('hidden.bs.modal', function () {
      window.location.href = '/src/views/Login.html';
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

// Repetido porque no funciona desde el script de app.js
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
