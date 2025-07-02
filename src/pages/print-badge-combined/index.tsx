import React, { useEffect, useRef, useState } from 'react';
import socket from '../../socket';
import { printGenesys } from '../../utils';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import BadgeBanner from "@/assets/badge-banner.jpg";

interface Badge {
    imageUrl: string;
    attendeeName: string;
    attendeeCompany: string;
    attendeeRole: string;
    eventOwnerId: string;
    eventUuid: string;
    tabId: string;
    designation: string
}

const BadgePrint: React.FC = () => {
    const { eventUuid, tabId, print } = useParams<{ eventUuid: string, tabId: string, print: string }>();
    console.log(print);
    const userId = localStorage.getItem("userId");

    const width = "105mm";
    const height = "148.5mm";
    const type = "A6";

    // const width = "80mm";
    // const height = "100mm";
    // const type = "A2";

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
        printGenesys(badgeRef.current, width, height, type);
        setTimeout(() => {
            setShowQrCode(true); // Show QR code after printing or canceling the print dialog
            setBadgeData(undefined); // Clear badge data
        }, 1000); // Delay ensures the print dialog finishes first
    };

    const fullName = `${badgeData?.attendeeName}`.trim();
    // Rough heuristic: if the name is very long (> 20 characters) it likely wraps to three lines on badge width
    const isLongName = fullName.length > 15;

    return (
        <div className='flex gap-40 items-center w-fit mx-auto'>
            {badgeData && (
                <div className="grid place-content-center max-w-96 max-h-fit h-96 w-fit p-3 scale-75 mt-10">
                    <div ref={badgeRef} className='w-full mx-auto h-full flex flex-1 pb-4'>
                        <div className="w-full mx-auto overflow-hidden rounded bg-white flex flex-col justify-between flex-1">
                            <img
                                // src={`${baseUrl}/${badgeData?.imageUrl}`}
                                src={BadgeBanner}
                                className="!h-[160px] w-full rounded-t mx-auto object-cover"
                                alt="Badge"
                            />

                            <div className='mx-4 pb-5 !capitalize'>
                                <h3 className={`font-bold ${isLongName ? 'text-4xl' : 'text-6xl'} pt-5 mb-2`}>
                                    {fullName || 'Attendee Name'}
                                </h3>
                                <h3 className={`font-medium ${isLongName ? 'text-2xl' : 'text-3xl'} pt-3 mb-2`}>
                                    {badgeData?.designation || "Designation"}
                                </h3>
                                <span className={`${isLongName ? 'text-xl' : 'text-2xl'} capitalize pt-3 pb-5`}>
                                    {badgeData?.attendeeCompany || "Company"}
                                </span>
                            </div>
                            <div className="py-4 text-2xl text-center capitalize font-semibold bg-gradient-to-r from-green-500 to-brand-primary text-white">
                                {badgeData?.attendeeRole || "Delegate"}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="px-5 py-2 mt-6 rounded bg-gradient-to-br from-sky-500 to-teal-500 font-semibold text-white"
                    >
                        Print
                    </button>
                </div>
            )}

            {showQrCode && (
                <div className="h-full px-5 mt-10 w-fit mx-auto">
                    <p className="text-3xl font-bold text-zinc-600 mb-5 text-center">
                        Scan the QR Code.
                    </p>
                    <QRCode id='qr-code' value={link} fgColor='#3f3f46' className='max-w-96 max-h-96 mx-auto' />
                </div>
            )}
        </div>
    );
};

export default BadgePrint;
