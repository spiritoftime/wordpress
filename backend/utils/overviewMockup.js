const { minifyHtml } = require("./minifyHTML");
async function overviewMockup(sessionEvents) {
  const calendarHtml = `
  <code>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>
        <script src="https://unpkg.com/popper.js@1"></script>
    <script src="https://unpkg.com/tippy.js@5/dist/tippy-bundle.iife.js"></script>
    <link
      rel="stylesheet"
      href="https://unpkg.com/tippy.js@5/dist/backdrop.css"
    />
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'timeGridDay',
          events: ${sessionEvents}
          eventRender: function(info) {
            tippy(info.el, { content: info.event.extendedProps.description });
          }
        });
        calendar.render();
      });
    </script>
  </head>
  <body>
    <div id="calendar"></div>
  </body>
  </html>
  </code>
  `;
  const minifiedContent = await minifyHtml(calendarHtml);
  return minifiedContent;
}
module.exports = { overviewMockup };
