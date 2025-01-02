import React, { useEffect, useRef, useState } from 'react';
import socket from '../../socket';
import { printBadge } from '../../utils';

interface Badge {
    imageUrl: string;
    attendeeName: string;
    attendeeCompany: string;
    attendeeRole: string;
    eventOwnerId: string;
}

const BadgePrint: React.FC = () => {

    const userId = localStorage.getItem("userId");

    console.log("The userId is: ", userId);

    const [badgeData, setBadgeData] = useState<Badge | undefined>(undefined);
    const baseUrl: string = import.meta.env.VITE_BASE_URL;
    const badgeRef = useRef<HTMLDivElement | null>(null);

    // useEffect(() => {
    //     try {
    //         socket.on("connect", () => {
    //             console.log("Connected to the server", socket.id);
    //         });

    //         socket.on("badgeGenerated", (data) => {
    //             console.log(data)
    //             console.log("Data Recieved", socket.id);
    //             if (data.attendeeRole == "0") {
    //                 data.attendeeRole = "Delegate";
    //             }
    //             setBadgeData(data);
    //             console.log(badgeData);
    //         });

    //     } catch (error) {
    //         throw error;
    //     }

    //     return () => {
    //         socket.on('disconnect', () => {
    //             console.log('Disconnected from server');
    //         });
    //     }
    // }, [socket]);


    useEffect(() => {

        socket.on("connect", () => {
            console.log("Connected to the server", socket.id);
        });

        // Join the room using the user's ID
        socket.emit('joinRoom', userId);

        // Listen for badgeGenerated event
        socket.on('badgeGenerated', (badgeData) => {
            console.log("The badge data is: ", badgeData);
            // Update the UI only for the logged-in user
            if (badgeData.eventOwnerId === userId) {
                if (badgeData.attendeeRole == "0") {
                    badgeData.attendeeRole = "Delegate";
                }
                setBadgeData(badgeData);
            }
        });
    }, [socket]);

    return (
        badgeData ? <div className='grid place-content-center w-full h-screen bg-neutral-200'>

            <div ref={badgeRef}>

                <div className='max-w-96 h-[500px] mx-auto overflow-hidden rounded bg-white flex flex-col justify-between min-w-96 w-full'>

                    <img
                        src={baseUrl + "/" + badgeData?.imageUrl}
                        className="w-full h-[250px] rounded-t mx-auto object-cover"
                    // style={{ backgroundImage: `url(${baseUrl + '/' + badgeData?.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />

                    <h3 className='font-bold text-3xl text-neutral-600 text-center'>{badgeData?.attendeeName || "Attendee Name"}</h3>
                    <span className='font-bold text-xl text-neutral-600 text-center'>{badgeData?.attendeeCompany || "Company Name"}</span>
                    <div className='py-3 text-5xl text-center boxShadow text-neutral-800 font-extrabold uppercase'>
                        {badgeData?.attendeeRole || "Delegate"}
                    </div>
                </div>

            </div>
            <button onClick={() => { printBadge(badgeRef.current) }} className='px-5 py-2 mt-3 rounded bg-gradient-to-br from-sky-500 to-teal-500 font-semibold text-white'>Print</button>
        </div> :
            <div className='h-screen w-full grid place-content-center'>
                <p className='text-3xl font-bold text-zinc-600 text-center'>You have to scan the QR Code for badge.</p>
            </div>
    )
}

export default BadgePrint;