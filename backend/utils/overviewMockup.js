const { minifyHtml } = require("./minifyHTML");
async function overviewMockup({ sessionEvents, startDate }) {
  const calendarHtml = `
  <html lang='en'>
  <head>
    <meta charset='utf-8'>
    <link rel='stylesheet' href='https://unpkg.com/tippy.js@5/dist/backdrop.css'>
    <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js'></script>
    <!-- <script src="https://unpkg.com/popper.js@1"></script>
    <script src="https://unpkg.com/tippy.js@5"></script> -->
  </head>
  <body>
    <div id='calendar'></div>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'timeGridDay',
          events: ${JSON.stringify(sessionEvents)},
          eventRender: function(info) {
            tippy(info.el, { content: info.event.extendedProps.description });
          },
          eventClick: function(clickInfo) {
            if (confirm("Do you wish to view the session in more detail?")) {
              window.location.href = clickInfo.event._def.extendedProps.wordpressUrl;
            }
          },
          initialDate: "${startDate.split("T")[0]}",
        });
        calendar.render();
      });
    </script>
  </body>
  </html>
  `;
  const minifiedContent = await minifyHtml(calendarHtml);
  console.log("minifiedContent", minifiedContent);
  return minifiedContent;
}
module.exports = { overviewMockup };
// clickInfo.event._def.extendedProps.wordpressUrl
