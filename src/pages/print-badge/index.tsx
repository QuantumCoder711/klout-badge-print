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
            <div className="grid place-content-center w-full p-3">
                <div ref={badgeRef}>
                    <div className="max-w-96 mx-auto overflow-hidden rounded bg-white flex flex-col min-w-full">
                        <img
                            src={`${baseUrl}/${badgeData.imageUrl}`}
                        className="w-full h-auto rounded-t mx-auto object-cover"
                        alt="Badge"
                        />
                        <h3 className="font-bold text-4xl pt-10 text-neutral-600 text-center">
                            {badgeData.attendeeName || "Attendee Name"}
                        </h3>
                        <span className="font-bold text-3xl pb-10 text-neutral-600 text-center">
                            {badgeData.attendeeCompany || "Company Name"}
                        </span>
                        <div className="pt-3 text-5xl text-center boxShadow text-neutral-800 font-extrabold uppercase">
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
            <div className="h-full px-5 mt-10 w-full mx-auto">
                <p className="text-3xl font-bold text-zinc-600 mb-5 text-center">
                    Scan the QR Code.
                </p>
                <QRCode id='qr-code' value={link} fgColor='#3f3f46' className='max-w-96 max-h-96 mx-auto' />
            </div>
        )
    );
};

export default BadgePrint;