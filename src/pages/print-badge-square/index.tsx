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

const PrintBadgeSquare: React.FC = () => {
    const { eventUuid, tabId, print } = useParams<{ eventUuid: string, tabId: string, print: string }>();
    console.log(print);
    const userId = localStorage.getItem("userId");

    const width = "80mm";
    const height = "100mm";
    const type = "A2";

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

        const joinRoom = () => {
            console.log("Joining room with:", { userId, eventUuid, tabId });
            socket.emit('joinRoom', { userId, eventUuid, tabId });
        };

        // If already connected, log socket.id and join the room
        if (socket.connected) {
            console.log("Already connected to the server", socket.id);
            joinRoom();
        }

        // Set up listeners
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
            }
        });

        socket.on("reconnect", () => {
            console.log("Reconnected to the server");
            joinRoom();
        });

        return () => {
            console.log("Cleaning up socket listeners...");
            socket.off("badgeGenerated");
            socket.off("connect");
            socket.off("reconnect");
        };
    }, [userId, eventUuid, tabId]);

    return (
        <div className='flex gap-40 items-center w-fit mx-auto'>

            {badgeData && <div className="grid place-content-center w-fit p-3 scale-75 max-w-96 -mt-0">
                <div ref={badgeRef} className='w-fit'>
                    <div className="max-w-96 w-full h-auto mx-auto overflow-hidden rounded bg-white flex flex-col">
                        <div className='min-h-40 min-w-60 !bg-cover rounded-t-md !bg-center' style={{ background: `url(${baseUrl}/${badgeData.imageUrl})` }}>
                            {/* <img
                                src={`${baseUrl}/${badgeData.imageUrl}`}
                                className="w-full rounded-t mx-auto object-cover"
                                alt="Badge"
                            /> */}
                        </div>
                        <h3 className="font-bold text-4xl pt-5 text-neutral-600 text-center">
                            {badgeData.attendeeName || "Attendee Name"}
                        </h3>
                        <span className="font-bold text-2xl pb-5 text-neutral-600 text-center">
                            {badgeData.attendeeCompany || "Company Name"}
                        </span>
                        <div className="pt-0 text-3xl text-center boxShadow text-neutral-800 font-extrabold uppercase">
                            {badgeData.attendeeRole || "Delegate"}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => printBadge(badgeRef.current, width, height, type)}
                    className="px-5 py-2 mt-3 rounded bg-gradient-to-br from-sky-500 to-teal-500 font-semibold text-white"
                >
                    Print
                </button>
            </div>}

            <div className="h-full px-5 mt-10 w-fit mx-auto">
                <p className="text-3xl font-bold text-zinc-600 mb-5 text-center">
                    Scan the QR Code.
                </p>
                <QRCode id='qr-code' value={link} fgColor='#3f3f46' className='max-w-96 max-h-96 mx-auto' />
            </div>
        </div>
    );
};

export default PrintBadgeSquare;