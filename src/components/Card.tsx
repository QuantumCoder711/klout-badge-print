import React, { useEffect, useState } from 'react';
import { MdDateRange, MdMyLocation } from "react-icons/md";
import { Link } from 'react-router-dom';
import axios from 'axios';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";


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
    printer_count: number | null;
}

const Card: React.FC<CardProps> = (props) => {

    const token = localStorage.getItem("token");

    const apiBaseUrl: string = import.meta.env.VITE_BASE_URL;

    const [isLive, setIsLive] = useState<boolean>(false);
    const [printer, setPrinter] = useState<number | null>(null);
    const [printerNumber, setPrinterNumber] = useState<number>(0);
    const [tab, setTab] = useState<boolean>(true);
    const [showShapes, setShowShapes] = useState<boolean>(false);
    // const [screenType, setScreenType] = useState<"square" | "rectangle">("rectangle");
    // const [printType, setPrintType] = useState<"name" | "badge">("badge");

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

    // to={`/print-badge/${props.eventuuid}`}
    const handleSelectTab = () => {
        console.log(apiBaseUrl)
        axios.post(`${apiBaseUrl}/api/display/${props.eventuuid}`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        }).then(res => (console.log(res.data.data), setPrinter(res.data.data.printer_count)));
        // Swal.fire({
        //     title: 'Please select a tab',
        //     icon: 'info',
        // });
    }

    return (
        <div className="w-80 shadow-xl rounded-lg relative">
            <figure>
                <img
                    src={props.imageUrl}
                    alt={props.imageAlt}
                    // style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                    className='h-60 w-full object-cover rounded-t-lg'
                />
            </figure>
            <div className='p-3 relative'>
                {isLive && <span className='text-xs font-bold  absolute right-1 top-1 px-1 rounded border text-red-600 border-red-600 flex items-center gap-1'>Live <span className='w-2 h-2 rounded-full bg-red-600 liveBlink' /></span>}
                <h2 className="text-2xl font-bold">{props.title}</h2>
                <div className='mt-3 flex flex-col gap-3'>
                    <p className="inline-flex gap-2 items-start"><MdMyLocation className="text-2xl" /> {props.venue}</p>
                    <p className="font-semibold inline-flex gap-2 items-center"><MdDateRange className="text-2xl" /> {props.date}</p>
                </div>
            </div>
            <div className='w-full flex gap-3 p-3'>
                {/* <button className='w-full px-4 py-2 rounded-lg text-white bg-pink-500'>View Event</button> */}

                <Dialog onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setTab(true); // Reset tab to true when the dialog closes
                        setShowShapes(false);
                    }
                }}>
                    <DialogTrigger asChild>
                        <button onClick={handleSelectTab} className='inline-block w-full text-center px-4 py-2 rounded-lg text-white bg-teal-500'>Print Badge</button>
                    </DialogTrigger>
                    {(props.printer_count !== null && props.printer_count !== 0) ? <DialogContent>
                        <DialogHeader>
                            <DialogTitle className='text-xl text-center'>Please select a tab</DialogTitle>
                            <DialogDescription>

                            </DialogDescription>
                            {tab && <div className='grid grid-cols-5 place-content-center gap-5'>
                                {
                                    Array(printer).fill(0).map((_, index: number) => (
                                        // <Link to={`/print-badge/${props.eventuuid}/${index + 1}`} key={index + 1} className='p-5 grid place-content-center cursor-pointer bg-teal-500 font-bold text-2xl text-white rounded'>{index + 1}</Link>
                                        <button onClick={() => { setTab(!tab); setPrinterNumber(index + 1) }} key={index + 1} className='p-5 grid place-content-center cursor-pointer bg-teal-500 font-bold text-2xl text-white rounded'>{index + 1}</button>
                                    ))
                                }
                            </div>}

                            {(!tab && !showShapes) && <div className='flex gap-5 justify-center'>
                                <button onClick={() => setShowShapes(!showShapes)} className='bg-teal-500 grid rounded-md w-full h-40 text-white font-medium text-xl place-content-center'>Print Badge</button>
                                <Link to={`/print-name/${props.eventuuid}/${printerNumber}`} className='bg-green-600 grid rounded-md w-full h-40 text-white font-medium text-xl place-content-center'>Print Name</Link>
                            </div>}

                            {
                                showShapes && <div className='flex justify-center items-center gap-5'>
                                    <Link to={`/print-badge/square/${props.eventuuid}/${printerNumber}`} className='w-40 rounded-md h-40 grid place-content-center bg-green-600 text-white'>8 x 10 cm</Link>
                                    <Link to={`/print-badge/rectangle/${props.eventuuid}/${printerNumber}`} className='w-40 rounded-md h-60 grid place-content-center bg-red-600 text-white'>10.5 x 14.85 cm</Link>
                                </div>
                            }
                        </DialogHeader>
                    </DialogContent> :

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle></DialogTitle>
                                <DialogDescription></DialogDescription>
                                <h3 className='text-2xl text-neutral-700 text-center'>Please choose the number of printers</h3>
                                {/* <button className='px-4 py-2 mt-10 rounded-md bg-teal-500 text-white'>Ok</button> */}
                            </DialogHeader>
                        </DialogContent>
                    }
                </Dialog>

                {/* {
                    !printer && <Link to={`/print-badge/${props.eventuuid}/1`} className='p-5 grid place-content-center cursor-pointer bg-teal-500 font-bold text-2xl text-white rounded'></Link>
                } */}

            </div>
        </div>
    )
}

export default Card;