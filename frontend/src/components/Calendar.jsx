import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calendar = () => {
  const [weekendsVisible, setWeekendsVisible] = useState(false);
  const [currentEvents, setCurrentEvents] = useState([
    { title: "event 1", date: "2023-07-10" },
    { title: "event 2", date: "2023-07-10" },
  ]);

  let eventGuid = 0;
  let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

  const createEventId = () => {
    return String(eventGuid++);
  };

  const INITIAL_EVENTS = [
    {
      id: createEventId(),
      title: "All-day event",
      start: todayStr,
      date: "2023-07-10",
    },
    {
      id: createEventId(),
      title: "Timed event",
      start: todayStr + "T12:00:00",
    },
  ];

  const handleWeekendsToggle = () => {
    setWeekendsVisible(!weekendsVisible);
  };

  const handleDateSelect = (selectInfo) => {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  const handleEventClick = (clickInfo) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  };

  const handleEvents = (events) => {
    setCurrentEvents({
      currentEvents: events,
    });
  };

  const renderEventContent = (eventInfo) => {
    return (
      <>
        {/* <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i> */}
        <p>New Event</p>
      </>
    );
  };

  return (
    <div className="demo-app" id="calendar">
      <div className="demo-app-main">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          events={currentEvents}
          //initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          // select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={handleEventClick}
          // eventsSet={handleEvents} // called after events are initialized/added/changed/removed
          /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
        />
      </div>
    </div>
  );
};

export default Calendar;

// https://codesandbox.io/s/purple-https-954kvw?file=/src/FullCalendar.js:564-678