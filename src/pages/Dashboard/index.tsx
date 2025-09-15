import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchEvents } from '../../store/slices/eventSlice';
import { Event } from '../../types';
import Card from '../../components/Card';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { events, loading, error } = useAppSelector((state) => state.event);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Show loading state only on initial load
  if (loading && !events) {
    return (
      <div className="p-5">
        <h1 className='text-2xl font-semibold text-zinc-600'>All Upcoming Events</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  // Show error message if there's an error and no events to display
  if (error) {
    return (
      <div className="p-5">
        <h1 className='text-2xl font-semibold text-zinc-600'>All Upcoming Events</h1>
        <div className="text-red-500 p-4 bg-red-50 rounded-md mt-4">
          Error loading events: {error}
        </div>
      </div>
    );
  }

  // Show empty state if there are no events
  if (!events || events.length === 0) {
    return (
      <div className="p-5">
        <h1 className='text-2xl font-semibold text-zinc-600'>All Upcoming Events</h1>
        <div className="mt-5 text-gray-500 text-center py-10">
          No upcoming events found.
        </div>
      </div>
    );
  }

  // Show the list of events
  return (
    <div className='p-5'>
      <h1 className='text-2xl font-semibold text-zinc-600'>All Upcoming Events</h1>
      <div className='mt-5 w-full flex flex-wrap gap-5'>
        {events.map((event: Event) => (
          <Card
            key={event.id}
            title={event.title}
            eventId={event.id}
            imageUrl={event.image}
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
    </div>
  )
}

export default Dashboard;