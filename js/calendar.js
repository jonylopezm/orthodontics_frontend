
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
        alert('Selecciono dia ' + info.dateStr);
      },
      locale:'es',
    });
    
    calendar.render();
  });
