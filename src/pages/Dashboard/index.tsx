import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Event } from '../../utils';
import Card from '../../components/Card';

const Dashboard: React.FC = () => {

  const apiBaseUrl = import.meta.env.VITE_BASE_URL;
  const token: string | null = localStorage.getItem("token");

  const today: Date = new Date();
  today.setHours(0, 0, 0, 0);

  const [events, setEvents] = useState<Event[] | null>(null);
  // const [upcomingEvents, setUpcomingEvents] = useState<Event[] | null>(null);

  const fetchTotalEvents = async (token: string | null) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/api/eventslist`, {}, {
        headers: {
          // 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  useEffect(() => {
    fetchTotalEvents(token).then(res => {
      // console.log(res.data);
      // setEvents(res.data);
      console.log(res.data);
      const upcomingEvents = res.data.filter((event: Event) => {
        const eventDate: Date = new Date(event.event_start_date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      }).slice(0, 4);

      console.log(upcomingEvents);

      setEvents(upcomingEvents);
    })
  }, []);

  return (
    <div className='p-5'>
      <h1 className='text-2xl font-semibold text-zinc-600'>All Upcoming Events</h1>

      <div className='mt-5 w-full flex flex-wrap gap-5'>
        {events?.map((event: Event) => (
          // <Card eventItem={event}/>
          <Card
            key={event.id}
            title={event.title}
            eventId={event.id}
            imageUrl={`https://api.klout.club/${event.image}`}
            start_minute_time={event.start_minute_time}
            start_time={event.start_time}
            start_time_type={event.start_time_type}
            end_minute_time={event.end_minute_time}
            end_time={event.end_time}
            end_time_type={event.end_time_type}
            qr={event.qr_code}
            printer_count={event.printer_count}
            imageAlt={event.title}
            date={event.event_start_date}
            venue={event.event_venue_name}
            eventuuid={event.uuid}
          />
        ))}
      </div>
      {(!events || events.length === 0) && <p>No upcoming events.</p>}
    </div>
  )
}

export default Dashboard;