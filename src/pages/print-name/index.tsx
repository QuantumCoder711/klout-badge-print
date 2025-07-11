// import React, { useEffect, useRef, useState } from 'react';
// import socket from '../../socket';
// import { printName } from '../../utils';
// import { useParams } from 'react-router-dom';
// import QRCode from 'react-qr-code';

// interface Badge {
//     imageUrl: string;
//     attendeeName: string;
//     attendeeCompany: string;
//     attendeeRole: string;
//     eventOwnerId: string;
//     eventUuid: string;
//     tabId: string;
// }

// const PrintName: React.FC = () => {
//     const { eventUuid, tabId, print } = useParams<{ eventUuid: string, tabId: string, print: string }>();
//     console.log(print);
//     const userId = localStorage.getItem("userId");

//     // const link: string = `https://kloutclub.page.link/?link=https://www.klout.club/event/check-in?eventuuid%3D${eventUuid}&tabId%3D${tabId}&apn=com.klout.app&afl=https://www.klout.club/event/check-in?eventuuid%3D${eventUuid}&tabId%3D${tabId}&ibi=com.klout.app&ifl=https://www.klout.club/event/check-in?eventuuid%3D${eventUuid}&tabId%3D${tabId}&_icp=1`;

//     const link: string = `https://kloutclub.page.link/?link=${encodeURIComponent(`https://www.klout.club/event/check-in?eventuuid=${eventUuid}&tabId=${tabId}`)}&apn=com.klout.app&afl=${encodeURIComponent(`https://www.klout.club/event/check-in?eventuuid=${eventUuid}&tabId=${tabId}`)}&ibi=com.klout.app&ifl=${encodeURIComponent(`https://www.klout.club/event/check-in?eventuuid=${eventUuid}&tabId=${tabId}`)}&_icp=1`;

//     const [badgeData, setBadgeData] = useState<Badge | undefined>(undefined);
//     // const baseUrl: string = import.meta.env.VITE_BASE_URL;
//     const badgeRef = useRef<HTMLDivElement | null>(null);

//     useEffect(() => {
//         if (!userId || !eventUuid || !tabId) {
//             console.error("Missing userId, eventUuid, or tabId");
//             return;
//         }

//         const joinRoom = () => {
//             console.log("Joining room with:", { userId, eventUuid, tabId });
//             socket.emit('joinRoom', { userId, eventUuid, tabId });
//         };

//         // If already connected, log socket.id and join the room
//         if (socket.connected) {
//             console.log("Already connected to the server", socket.id);
//             joinRoom();
//         }

//         // Set up listeners
//         socket.on("connect", () => {
//             console.log("Connected to the server", socket.id);
//             joinRoom();
//         });

//         socket.on("badgeGenerated", (data: Badge) => {
//             console.log("Received badge data:", data);
//             if (data.eventOwnerId === userId && data.eventUuid === eventUuid && data.tabId === tabId) {
//                 if (data.attendeeRole === "0") {
//                     data.attendeeRole = "Delegate";
//                 }
//                 setBadgeData(data);
//             }
//         });

//         socket.on("reconnect", () => {
//             console.log("Reconnected to the server");
//             joinRoom();
//         });

//         return () => {
//             console.log("Cleaning up socket listeners...");
//             socket.off("badgeGenerated");
//             socket.off("connect");
//             socket.off("reconnect");
//         };
//     }, [userId, eventUuid, tabId]);



//     return (
//         <div className='flex gap-40 mx-auto'>

//             {badgeData && <div className=" p-3">
//                 <div ref={badgeRef} className='mx-auto'>
//                     <div className="mx-auto flex items-center flex-col justify-center min-w-full">
//                         <h3 className="font-bold text-neutral-600 text-center w-full text-wrap overflow-hidden text-7xl">
//                             {badgeData.attendeeName || "Attendee Name"}
//                         </h3>
//                         <h5 className='font-semibold pt-4 pb-10 text-neutral-600 text-center w-full text-wrap overflow-hidden text-4xl'>{badgeData.attendeeCompany}</h5>
//                         <hr />
//                     </div>

//                 </div>
//                 <button
//                     onClick={() => printName(badgeRef.current)}
//                     className="px-5 py-2 mt-3 max-w-40 mx-auto rounded bg-gradient-to-br from-sky-500 to-teal-500 font-semibold text-white"
//                 >
//                     Print
//                 </button>
//             </div>}

//             <div className="h-full px-5 mt-10 w-full mx-auto">
//                 <p className="text-3xl font-bold text-zinc-600 mb-5 text-center">
//                     Scan the QR Code.
//                 </p>
//                 <QRCode id='qr-code' value={link} fgColor='#3f3f46' className='max-w-96 max-h-96 mx-auto' />
//             </div>

//         </div>
//     );
// };

// export default PrintName;
































import React, { useEffect, useRef, useState } from 'react';
import socket from '../../socket';
import { printName } from '../../utils';
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

const PrintName: React.FC = () => {
    const { eventUuid, tabId, print } = useParams<{ eventUuid: string, tabId: string, print: string }>();
    console.log(print);
    const userId = localStorage.getItem("userId");

    const link: string = `https://kloutclub.page.link/?link=${encodeURIComponent(
        `https://www.klout.club/event/check-in?eventuuid=${eventUuid}&tabId=${tabId}`
    )}&apn=com.klout.app&afl=${encodeURIComponent(
        `https://www.klout.club/event/check-in?eventuuid=${eventUuid}&tabId=${tabId}`
    )}&ibi=com.klout.app&ifl=${encodeURIComponent(
        `https://www.klout.club/event/check-in?eventuuid=${eventUuid}&tabId=${tabId}`
    )}&_icp=1`;

    const [badgeData, setBadgeData] = useState<Badge | undefined>(undefined);
    const [showQrCode, setShowQrCode] = useState(true); // State to control QR code visibility
    // const baseUrl: string = import.meta.env.VITE_BASE_URL;
    const badgeRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!userId || !eventUuid || !tabId) {
            console.error("Missing userId, eventUuid, or tabId");
            return;
        }

        const joinRoom = () => {
            console.log("Joining room with:", { userId, eventUuid, tabId });
            socket.emit('joinRoom', { userId, eventUuid, tabId });
        };

        if (socket.connected) {
            console.log("Already connected to the server", socket.id);
            joinRoom();
        }

        socket.on("connect", () => {
            console.log("Connected to the server", socket.id);
            joinRoom();
        });

        socket.on("badgeGenerated", (data: Badge) => {
            console.log("Received badge data:", data);
            if (data.eventOwnerId === userId && data.eventUuid === eventUuid && data.tabId === tabId) {
                if (data.attendeeRole === "0") {
                    data.attendeeRole = "Delegate";
                }
                setBadgeData(data);
                setShowQrCode(false); // Hide QR code when badge is displayed
            }
        });

        socket.on("reconnect", () => {
            console.log("Reconnected to the server");
            joinRoom();
        });

        return () => {
            socket.off("badgeGenerated");
            socket.off("connect");
            socket.off("reconnect");
        };
    }, [userId, eventUuid, tabId]);

    const handlePrint = () => {
        // Call the printBadge function and then show QR code after a delay
        printName(badgeRef.current);
        setTimeout(() => {
            setShowQrCode(true); // Show QR code after printing or canceling the print dialog
            setBadgeData(undefined); // Clear badge data
        }, 1000); // Delay ensures the print dialog finishes first
    };

    return (
        <div className='flex gap-40 mx-auto'>

            {badgeData && <div className="p-3">
                <div ref={badgeRef} className='mx-auto p-2 pb-5'>
                    <div className="mx-auto flex items-center flex-col justify-center min-w-full">
                        <h3 className="font-bold text-center w-full !text-wrap text-4xl">
                            {badgeData.attendeeName || "Attendee Name"}
                        </h3>
                        <h5 className='font-semibold pt-4 pb-10 text-center w-full text-wrap overflow-hidden text-2xl'>{badgeData.attendeeCompany}</h5>
                        <hr />
                    </div>

                </div>
                <div className='text-center'>

                <button
                    onClick={handlePrint}
                    className="px-5 py-2 mt-3 text-center max-w-40 mx-auto rounded bg-gradient-to-br from-sky-500 to-teal-500 font-semibold text-white"
                    >
                    Print
                </button>
                    </div>
            </div>}

            {showQrCode && <div className="h-full px-5 mt-10 w-full mx-auto">
                <p className="text-3xl font-bold text-zinc-600 mb-5 text-center">
                    Scan the QR Code.
                </p>
                <QRCode id='qr-code' value={link} fgColor='#3f3f46' className='max-w-96 max-h-96 mx-auto' />
            </div>}

        </div>
    );
};

export default PrintName;
