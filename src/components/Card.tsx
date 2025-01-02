import React, { useEffect, useState } from 'react';
import { MdDateRange, MdMyLocation } from "react-icons/md";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

type CardProps = {
    title: string,
    date: string,
    venue: string,
    imageUrl: string,
    imageAlt: string,
    eventuuid: string,
    start_time?: string,
    start_minute_time?: string,
    start_time_type?: string,
    end_time?: string,
    end_minute_time?: string,
    end_time_type?: string,
    eventId: number,
    qr: string;
}

const Card: React.FC<CardProps> = (props) => {

    const token = localStorage.getItem("token");

    const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL;

    const [isLive, setIsLive] = useState<boolean>(false);

    const eventStartTime: string = `${props.start_time}:${props.start_minute_time} ${props.start_time_type}`;
    const eventEndTime: string = `${props.end_time}:${props.end_minute_time} ${props.end_time_type}`;

    // Function to parse time string to Date object
    const parseEventTime = (time: string, date: string) => {
        const [timeStr, period] = time.split(' ');
        const [hours, minutes] = timeStr.split(':').map(Number);
        let adjustedHours = hours;

        if (period === 'PM' && hours !== 12) adjustedHours += 12;
        if (period === 'AM' && hours === 12) adjustedHours = 0;

        return new Date(`${date}T${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
    };

    // Effect to check if the event is live
    useEffect(() => {
        const startDate = parseEventTime(eventStartTime, props.date);
        const endDate = parseEventTime(eventEndTime, props.date);

        const currentDate = new Date();

        // Check if the current date is within the event's start and end time
        if (currentDate >= startDate && currentDate <= endDate) {
            console.log("Current Date & Time is: ", currentDate);
            setIsLive(true);
        } else {
            setIsLive(false);
        }
    }, [eventStartTime, eventEndTime, props.date]);

    return (
        <div className="w-80 shadow-xl rounded-lg">
            <figure>
                <img
                    src={props.imageUrl}
                    alt={props.imageAlt}
                    // style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                    className='h-60 w-full object-cover rounded-t-lg'
                />
            </figure>
            <div className='p-3'>
                {isLive && <span className='text-xs font-bold  absolute right-1 top-1 px-1 rounded border text-red-600 border-red-600 flex items-center gap-1'>Live <span className='w-2 h-2 rounded-full bg-red-600 liveBlink' /></span>}
                <h2 className="text-2xl font-bold">{props.title}</h2>
                <div className='mt-3 flex flex-col gap-3'>
                    <p className="inline-flex gap-2 items-start"><MdMyLocation className="text-2xl" /> {props.venue}</p>
                    <p className="font-semibold inline-flex gap-2 items-center"><MdDateRange className="text-2xl" /> {props.date}</p>
                </div>
            </div>
            <div className='w-full flex gap-3 p-3'>
                {/* <button className='w-full px-4 py-2 rounded-lg text-white bg-pink-500'>View Event</button> */}
                <Link to={`/print-badge/${props.eventuuid}`} className='inline-block w-full text-center px-4 py-2 rounded-lg text-white bg-teal-500'>Print Badge</Link>
            </div>
        </div>
    )
}

export default Card;