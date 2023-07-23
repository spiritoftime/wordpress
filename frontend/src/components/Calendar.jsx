import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
const Calendar = ({ sessionEvents, startDate }) => {
  const [currentEvents, setCurrentEvents] = useState(sessionEvents);
  const [weekendsVisible, setWeekendsVisible] = useState(false);

  // const handleWeekendsToggle = () => {
  //   setWeekendsVisible(!weekendsVisible);
  // };

  // const handleDateSelect = (selectInfo) => {
  //   let title = prompt("Please enter a new title for your event");
  //   let calendarApi = selectInfo.view.calendar;

  //   calendarApi.unselect(); // clear date selection

  //   if (title) {
  //     calendarApi.addEvent({
  //       id: createEventId(),
  //       title,
  //       start: selectInfo.startStr,
  //       end: selectInfo.endStr,
  //       allDay: selectInfo.allDay,
  //     });
  //   }
  // };

  const handleEventClick = (clickInfo) => {
    console.log(clickInfo, "clickInfo");
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
  // const handleMouseHover = (mouseEnterInfo) => {
  //   if (mouseEnterInfo.jsEvent.isTrusted)
  //     var tooltip = new Tooltip(mouseEnterInfo.el, {
  //       title: mouseEnterInfo.event.extendedProps.description,
  //       placement: "top",
  //       trigger: "hover",
  //       container: "body",
  //     });
  //   console.log(tooltip, "tooltip");
  // };
  const renderTooltip = function (info) {
    tippy(info.el, { content: info.event.extendedProps.description });
  };
  const renderEventContent = (eventInfo) => {
    console.log(eventInfo, "eventinfo");

    return (
      <>
        {/* <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i> */}
        <p className="bg-[#3788d8]">{eventInfo.event._def.title}</p>
      </>
    );
  };

  return (
    <div className="demo-app w-full m-6 max-h-[500px]" id="calendar">
      <div className="demo-app-main w-[50%] ">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridDay",
          }}
          initialView="timeGridDay"
          editable={true}
          selectable={true}
          initialDate={startDate}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          events={currentEvents}
          // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          // select={handleDateSelect}
          // eventContent={renderEventContent} // custom render function
          // eventMouseEnter={handleMouseHover}
          eventDidMount={renderTooltip}
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
