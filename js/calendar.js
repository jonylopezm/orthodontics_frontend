
//cargar vista de calendario
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      headerToolbar:{
        left: 'prev,next today', // will normally be on the left. if RTL, will be on the right
        center: 'title',
        right: 'dayGridMonth,timeGridDay' // will normally be on the right. if RTL, will be on the left 
      }, 
       dateClick: function(info){
        openModal(info.dateStr);
      },
      eventClick: function(info) {
        /* window.location.href = '/eventDetails.html?id=' + info.event.id; */
      alert('Haz hecho clic en el evento: ' + info.event.title);

      },
      locale:'es',
      dayMaxEventRows: 2,
      events: [ // Aquí agregamos los eventos al calendario
      {
        id: 1,
        title: 'Ejm Cita 1',
        start: '2023-08-18T10:00:00', // Fecha de la cita 1
        backgroundColor: 'blue'
      },
      {
        id: 2,
        title: 'Ejm Cita 2',
        start: '2023-08-17T16:30:00', // Fecha de la cita 2
        backgroundColor: 'green'
      },
      {
        id: 3,
        title: 'Ejm Cita 3',
        start: '2023-08-17T15:30:00', // Fecha de la cita 3
        backgroundColor: 'red'
      },
      {
        id: 4,
        title: 'Ejm Cita 4',
        start: '2023-08-22T09:30:00', // Fecha de la cita 4
        backgroundColor: 'purple'
      },
      {
        id: 5,
        title: 'Ejm Cita 9',
        start: '2023-08-22T09:00:00', // Fecha de la cita 5
        backgroundColor: 'orange'
      },
      {
        id: 6,
        title: 'Ejm Cita 5',
        start: '2023-08-22T11:30:00', // Fecha de la cita 5
        backgroundColor: 'orange'
      },
      {
        id: 7,
        title: 'Ejm Cita 6',
        start: '2023-08-22T17:30:00', // Fecha de la cita 5
        backgroundColor: 'green'
      },
      {
        id: 8,
        title: 'Ejm Cita 7',
        start: '2023-08-22T13:30:00', // Fecha de la cita 5
        backgroundColor: 'red'
      },
      {
        id: 9,
        title: 'Ejm Cita 8',
        start: '2023-08-22T15:30:00', // Fecha de la cita 5
        backgroundColor: 'blue'
      }
    ]
    });
    
    calendar.render();
  });

  
  function openModal(date){
    /* Abrir la ventana modal para crear nueva cita */
    fetch('/components/modalNewAppointment.html')
    .then(response => response.text())
    .then(content => {
        document.getElementById('modalContainer').innerHTML = content;
        const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        modal.show();

       // Formatear la fecha para el input tipo date (YYYY-MM-DD)
       const formattedDate = formatDateForInput(date);
       document.getElementById('confirmationDate').textContent = formattedDate;

      // Redirigir a la página newAppointment.html con el parámetro de consulta
      const confirmButton = document.getElementById('confirmButton');
      confirmButton.addEventListener('click', function() {
          // Redirigir a la página newAppointment.html con el parámetro de consulta
          window.location.href = `/src/views/newAppointment.html?date=${formattedDate}`;
      });      });
  }


  function formatDateForInput(date) {
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);
    return `${year}-${month}-${day}`;
  }

  /* formatDateForInput toma la fecha en formato YYYY-MM-DD y la divide en partes para formatearla 
  como se espera en el input de tipo date. Luego, se establece el valor del input 
  de fecha con la fecha formateada. */
