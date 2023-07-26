import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useParams, useNavigate } from "react-router-dom";
import FormExitAlert from "./FormExitAlert";
const Calendar = ({ sessionEvents, startDate }) => {
  const { conferenceId } = useParams();

  const [currentEvents, setCurrentEvents] = useState(sessionEvents);
  const [weekendsVisible, setWeekendsVisible] = useState(false);

  const navigate = useNavigate();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [clickData, setClickData] = useState();

  const handleEventClick = (clickInfo) => {
    console.log(clickInfo);
    setShowDeleteAlert(true);
    setClickData(clickInfo);
  };
  // const handleEventClick = (clickInfo) => {
  //   console.log(clickInfo, "clickInfo");
  //   if (confirm(`Do you wish to view the session in more detail?`)) {
  //     window.location.href = `/conferences/sessions/${conferenceId}/${clickInfo.event._def.publicId}`;
  //   }
  // };

  const renderTooltip = function (info) {
    tippy(info.el, { content: info.event.extendedProps.description });
  };
  const renderEventContent = (eventInfo) => {
    return (
      <>
        <p className="bg-[#3788d8]">{eventInfo.event._def.title}</p>
      </>
    );
  };

  return (
    <>
      <div className="demo-app w-full max-h-[500px]" id="calendar">
        <div className="demo-app-main w-[80%] mx-auto ">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridDay",
            }}
            initialView="timeGridDay"
            editable={false}
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
      <FormExitAlert
        conferenceId={conferenceId}
        navigate={() =>
          navigate(
            `/conferences/sessions/${conferenceId}/${clickData.event._def.publicId}`
          )
        }
        open={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
        title={`Do you wish to view the ${clickData?.event?._def?.title} in more detail?`}
        description=" "
      />
    </>
  );
};

export default Calendar;

// https://codesandbox.io/s/purple-https-954kvw?file=/src/FullCalendar.js:564-678
