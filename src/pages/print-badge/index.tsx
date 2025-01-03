// import React, { useEffect, useRef, useState } from 'react';
// import socket from '../../socket';
// import { printBadge } from '../../utils';

// interface Badge {
//     imageUrl: string;
//     attendeeName: string;
//     attendeeCompany: string;
//     attendeeRole: string;
//     eventOwnerId: string;
// }

// const BadgePrint: React.FC = () => {

//     const userId = localStorage.getItem("userId");

//     console.log("The userId is: ", userId);

//     const [badgeData, setBadgeData] = useState<Badge | undefined>(undefined);
//     const baseUrl: string = import.meta.env.VITE_BASE_URL;
//     const badgeRef = useRef<HTMLDivElement | null>(null);

//     // useEffect(() => {
//     //     try {
//     //         socket.on("connect", () => {
//     //             console.log("Connected to the server", socket.id);
//     //         });

//     //         socket.on("badgeGenerated", (data) => {
//     //             console.log(data)
//     //             console.log("Data Recieved", socket.id);
//     //             if (data.attendeeRole == "0") {
//     //                 data.attendeeRole = "Delegate";
//     //             }
//     //             setBadgeData(data);
//     //             console.log(badgeData);
//     //         });

//     //     } catch (error) {
//     //         throw error;
//     //     }

//     //     return () => {
//     //         socket.on('disconnect', () => {
//     //             console.log('Disconnected from server');
//     //         });
//     //     }
//     // }, [socket]);


//     useEffect(() => {

//         socket.on("connect", () => {
//             console.log("Connected to the server", socket.id);
//         });

//         // Join the room using the user's ID
//         socket.emit('joinRoom', userId);

//         // Listen for badgeGenerated event
//         socket.on('badgeGenerated', (badgeData) => {
//             console.log("The badge data is: ", badgeData);
//             // Update the UI only for the logged-in user
//             if (badgeData.eventOwnerId === userId) {
//                 if (badgeData.attendeeRole == "0") {
//                     badgeData.attendeeRole = "Delegate";
//                 }
//                 setBadgeData(badgeData);
//             }
//         });
//     }, [socket]);

//     return (
//         badgeData ? <div className='grid place-content-center w-full h-screen bg-neutral-200'>

//             <div ref={badgeRef}>

//                 <div className='max-w-96 h-[500px] mx-auto overflow-hidden rounded bg-white flex flex-col justify-between min-w-96 w-full'>

//                     <img
//                         src={baseUrl + "/" + badgeData?.imageUrl}
//                         className="w-full h-[250px] rounded-t mx-auto object-cover"
//                     // style={{ backgroundImage: `url(${baseUrl + '/' + badgeData?.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
//                     />

//                     <h3 className='font-bold text-3xl text-neutral-600 text-center'>{badgeData?.attendeeName || "Attendee Name"}</h3>
//                     <span className='font-bold text-xl text-neutral-600 text-center'>{badgeData?.attendeeCompany || "Company Name"}</span>
//                     <div className='py-3 text-5xl text-center boxShadow text-neutral-800 font-extrabold uppercase'>
//                         {badgeData?.attendeeRole || "Delegate"}
//                     </div>
//                 </div>

//             </div>
//             <button onClick={() => { printBadge(badgeRef.current) }} className='px-5 py-2 mt-3 rounded bg-gradient-to-br from-sky-500 to-teal-500 font-semibold text-white'>Print</button>
//         </div> :
//             <div className='h-screen w-full grid place-content-center'>
//                 <p className='text-3xl font-bold text-zinc-600 text-center'>You have to scan the QR Code for badge.</p>
//             </div>
//     )
// }

// export default BadgePrint;



































// import React, { useEffect, useRef, useState } from 'react';
// import socket from '../../socket';
// import { printBadge } from '../../utils';
// import { useParams } from 'react-router-dom';
// // import axios from 'axios';
// import QRCode from 'react-qr-code';

// interface Badge {
//     imageUrl: string;
//     attendeeName: string;
//     attendeeCompany: string;
//     attendeeRole: string;
//     eventOwnerId: string;
//     eventUuid: string;
// }

// const BadgePrint: React.FC = () => {
//     // const apiBaseUrl = import.meta.env.VITE_BASE_URL;

//     // const token = localStorage.getItem("token");
//     const { eventUuid, tabId } = useParams<{ eventUuid: string, tabId: string }>();  // Type the parameter
//     const userId = localStorage.getItem("userId");

//     console.log("The userId is: ", userId);
//     console.log("The eventUuid is: ", eventUuid);

//     const link: string = `https://kloutclub.page.link/?link=https://www.klout.club/event/check-in?eventuuid%3D${eventUuid}&apn=com.klout.app&afl=https://www.klout.club/event/check-in?eventuuid%3D${eventUuid}&ibi=com.klout.app&ifl=https://www.klout.club/event/check-in?eventuuid%3D${eventUuid}&_icp=1&tabId%3D${tabId}`;

//     console.log(link);

//     const [badgeData, setBadgeData] = useState<Badge | undefined>(undefined);
//     // const [qr, setQr] = useState<string | undefined>(undefined);
//     const baseUrl: string = import.meta.env.VITE_BASE_URL;
//     const badgeRef = useRef<HTMLDivElement | null>(null);

//     // useEffect(() => {
//     //     axios.post(`${apiBaseUrl}/api/display/${eventUuid}`, {}, {
//     //         headers: {
//     //             "Content-Type": "application/json",
//     //             "Authorization": `Bearer ${token}`,
//     //         }
//     //     }).then(res => {
//     //         setQr(res.data.data.qr_code);
//     //     })
//     // }, []);

//     useEffect(() => {
//         if (!userId || !eventUuid) {
//             console.error("Missing userId or eventUuid");
//             return;
//         }

//         // Connect to the server
//         socket.on("connect", () => {
//             console.log(eventUuid);
//             console.log("Connected to the server", socket.id);
//         });

//         // Join the room using the user's ID and event UUID
//         socket.emit('joinRoom', { userId, eventUuid });

//         // Listen for the badgeGenerated event
//         socket.on('badgeGenerated', (data: Badge) => {
//             console.log("The badge data is: ", data);

//             // Update the UI only if the badge matches the eventUuid and userId
//             if (data.eventOwnerId === userId && data.eventUuid === eventUuid) {
//                 if (data.attendeeRole === "0") {
//                     data.attendeeRole = "Delegate";
//                 }
//                 setBadgeData(data);
//             }
//         });

//         return () => {
//             // Cleanup socket listeners on component unmount
//             socket.off('badgeGenerated');
//             socket.off('connect');
//         };
//     }, [userId, eventUuid]);

//     return (
//         badgeData ? (
//             <div className="grid place-content-center w-full bg-neutral-200">
//                 <div ref={badgeRef}>
//                     <div className="max-w-96 h-[500px] mx-auto overflow-hidden rounded bg-white flex flex-col justify-between min-w-96 w-full">
//                         <img
//                             src={`${baseUrl}/${badgeData.imageUrl}`}
//                             className="w-full h-[250px] rounded-t mx-auto object-cover"
//                             alt="Badge"
//                         />
//                         <h3 className="font-bold text-3xl text-neutral-600 text-center">
//                             {badgeData.attendeeName || "Attendee Name"}
//                         </h3>
//                         <span className="font-bold text-xl text-neutral-600 text-center">
//                             {badgeData.attendeeCompany || "Company Name"}
//                         </span>
//                         <div className="py-3 text-5xl text-center boxShadow text-neutral-800 font-extrabold uppercase">
//                             {badgeData.attendeeRole || "Delegate"}
//                         </div>
//                     </div>
//                 </div>
//                 <button
//                     onClick={() => printBadge(badgeRef.current)}
//                     className="px-5 py-2 mt-3 rounded bg-gradient-to-br from-sky-500 to-teal-500 font-semibold text-white"
//                 >
//                     Print
//                 </button>
//             </div>
//         ) : (
//             <div className="h-full mt-10 w-full grid place-content-center">
//                 <p className="text-3xl font-bold text-zinc-600 text-center">
//                     Scan the QR Code. Tab id is: {tabId}
//                 </p>

//                 <QRCode id='qr-code' value={link} fgColor='#3f3f46' className='w-96 h-96' />
//             </div>
//         )
//     );
// };

// export default BadgePrint;








































import React, { useEffect, useRef, useState } from 'react';
import socket from '../../socket';
import { printBadge } from '../../utils';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';

interface Badge {
    imageUrl: string;
    attendeeName: string;
    attendeeCompany: string;
    attendeeRole: string;
    eventOwnerId: string;
    eventUuid: string;
    tabId: string;
}

const BadgePrint: React.FC = () => {
    const { eventUuid, tabId } = useParams<{ eventUuid: string, tabId: string }>();
    const userId = localStorage.getItem("userId");

    // const link: string = `https://kloutclub.page.link/?link=https://www.klout.club/event/check-in?eventuuid%3D${eventUuid}&tabId%3D${tabId}&apn=com.klout.app&afl=https://www.klout.club/event/check-in?eventuuid%3D${eventUuid}&tabId%3D${tabId}&ibi=com.klout.app&ifl=https://www.klout.club/event/check-in?eventuuid%3D${eventUuid}&tabId%3D${tabId}&_icp=1`;

    const link: string = `https://kloutclub.page.link/?link=${encodeURIComponent(`https://www.klout.club/event/check-in?eventuuid=${eventUuid}&tabId=${tabId}`)}&apn=com.klout.app&afl=${encodeURIComponent(`https://www.klout.club/event/check-in?eventuuid=${eventUuid}&tabId=${tabId}`)}&ibi=com.klout.app&ifl=${encodeURIComponent(`https://www.klout.club/event/check-in?eventuuid=${eventUuid}&tabId=${tabId}`)}&_icp=1`;

    const [badgeData, setBadgeData] = useState<Badge | undefined>(undefined);
    const baseUrl: string = import.meta.env.VITE_BASE_URL;
    const badgeRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!userId || !eventUuid || !tabId) {
            console.error("Missing userId, eventUuid, or tabId");
            return;
        }

        // Connect to the server
        socket.on("connect", () => {
            console.log("Connected to the server", socket.id);
        });

        // Join the room using userId, eventUuid, and tabId
        socket.emit('joinRoom', { userId, eventUuid, tabId });

        // Listen for the badgeGenerated event
        socket.on('badgeGenerated', (data: Badge) => {
            console.log("Received badge data:", data);

            // Update the UI only if the badge matches the eventUuid, userId, and tabId
            if (data.eventOwnerId === userId && data.eventUuid === eventUuid && data.tabId === tabId) {
                if (data.attendeeRole === "0") {
                    data.attendeeRole = "Delegate";
                }
                setBadgeData(data);
            }
        });

        return () => {
            // Cleanup socket listeners on component unmount
            socket.off('badgeGenerated');
            socket.off('connect');
        };
    }, [userId, eventUuid, tabId]);

    return (
        badgeData ? (
            <div className="grid place-content-center w-full bg-neutral-200">
                <div ref={badgeRef}>
                    <div className="max-w-96 h-[500px] mx-auto overflow-hidden rounded bg-white flex flex-col justify-between min-w-96 w-full">
                        <img
                            src={`${baseUrl}/${badgeData.imageUrl}`}
                        className="w-full h-[250px] rounded-t mx-auto object-cover"
                        alt="Badge"
                        />
                        <h3 className="font-bold text-3xl text-neutral-600 text-center">
                            {badgeData.attendeeName || "Attendee Name"}
                        </h3>
                        <span className="font-bold text-xl text-neutral-600 text-center">
                            {badgeData.attendeeCompany || "Company Name"}
                        </span>
                        <div className="py-3 text-5xl text-center boxShadow text-neutral-800 font-extrabold uppercase">
                            {badgeData.attendeeRole || "Delegate"}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => printBadge(badgeRef.current)}
                    className="px-5 py-2 mt-3 rounded bg-gradient-to-br from-sky-500 to-teal-500 font-semibold text-white"
                >
                    Print
                </button>
            </div>
        ) : (
            <div className="h-full mt-10 w-full grid place-content-center">
                <p className="text-3xl font-bold text-zinc-600 text-center">
                    Scan the QR Code.
                </p>
                <QRCode id='qr-code' value={link} fgColor='#3f3f46' className='w-96 h-96' />
            </div>
        )
    );
};

export default BadgePrint;