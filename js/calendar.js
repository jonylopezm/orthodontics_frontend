
//cargar vista de calendario
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      headerToolbar:{
        left: 'prev,next today', // will normally be on the left. if RTL, will be on the right
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay' // will normally be on the right. if RTL, will be on the left 
      }, 
       dateClick: function(info){
        openModal(info.dateStr);
      },
      locale:'es',
    });
    
    calendar.render();
  });

  function openModal(date){
    /* Abrir la ventana modal para crear nueva cita */
    fetch('/components/modalNewAppointment.html')
    .then(response => response.text())
    .then(content => {
        document.getElementById('modalContainer').innerHTML = content;
        const modal = new bootstrap.Modal(document.getElementById('newAppointmentModal'));
        modal.show();
    });
  }
