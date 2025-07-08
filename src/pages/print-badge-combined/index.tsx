import React, { useEffect, useRef, useState } from 'react';
import socket from '../../socket';
import { printDynamicBadge } from '../../utils';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import BadgeBanner from "@/assets/badge-banner.jpg";
import { cn } from '@/lib/utils';

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

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);

const badgeRefPrint = (badgeRef: React.RefObject<HTMLDivElement>) => {
    if (!badgeRef.current) return;

    if (isIOS) {
        const badgeHTML = badgeRef.current.outerHTML;
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
            .map((el) => el.outerHTML)
            .join('\n');

        printWindow.document.write(`
  <html>
    <head>
      <title>Print Badge</title>
      ${styles}
      <style>
        @page {
          size: A6 portrait;
          margin: 0;
          padding: 0;
        }
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          background: white;
        }
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        #print-wrapper {
          width: 100%; /* badge width */
          height: 100%; /* badge height */
          display: flex;
          justify-content: center;
          align-items: center;
        }
        #print-wrapper > * {
          width: 100% !important;
          height: 100% !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          overflow: hidden !important;
        }
      </style>
    </head>
    <body>
      <div id="print-wrapper">
        ${badgeHTML}
      </div>
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
          setTimeout(() => window.close(), 1000);
        };
      </script>
    </body>
  </html>
`);
        printWindow.document.close();
    } else {
        // Desktop print using overlay
        printDynamicBadge(badgeRef.current, '100%', '100%', 'auto');
    }
};


const BadgePrint: React.FC = () => {
    const { eventUuid, tabId } = useParams<{ eventUuid: string, tabId: string, print: string }>();
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

    const firstName = badgeData?.attendeeName.split(" ")[0] || '';
    const lastName = badgeData?.attendeeName.split(" ")[1] || '';
    const companyName = badgeData?.attendeeCompany || '';
    const jobTitle = badgeData?.designation || '';

    // Rough heuristic: if the name is very long (> 20 characters) it likely wraps to three lines on badge width
    const isLongName = firstName.length > 13 || lastName.length > 13 || companyName.length > 28 || jobTitle.length > 32;

    const handlePrint = () => {
        // Call the printBadge function and then show QR code after a delay
        badgeRefPrint(badgeRef);
        setTimeout(() => {
            setShowQrCode(true); // Show QR code after printing or canceling the print dialog
            setBadgeData(undefined); // Clear badge data
        }, 1000); // Delay ensures the print dialog finishes first
    };

    return (
        <div className='flex gap-40 items-center w-fit mx-auto'>
            {badgeData && (
                <div className="grid place-content-center max-w-96 max-h-fit h-96 w-fit p-3 scale-75 mt-10">
                    <div ref={badgeRef} className={cn('w-full mx-auto h-full flex flex-1', !isIOS && 'pb-4')}>
                        <div className="w-full mx-auto overflow-hidden rounded bg-white flex flex-col justify-between flex-1">
                            <img
                                // src={`${baseUrl}/${badgeData?.imageUrl}`}
                                src={BadgeBanner}
                                className="!h-[160px] w-full rounded-t mx-auto object-cover"
                                alt="Badge"
                            />

                            <div className='mx-4 pb-3 !capitalize'>
                                <div className={`font-bold ${isLongName ? 'text-4xl' : 'text-6xl'} pt-2`}>
                                    <h3 className="mb-2">{badgeData.attendeeName.split(" ")[0]?.toLowerCase() || 'First Name'}</h3>
                                    <h3 className="mb-2">{badgeData.attendeeName.split(" ")[1]?.toLowerCase() || 'Last Name'}</h3>
                                </div>
                                <h3 className={`font-medium ${isLongName ? 'text-2xl' : 'text-3xl'} pt-2 mb-2`}>
                                    {badgeData.designation?.toLowerCase() || "Designation"}
                                </h3>
                                <span className={`${isLongName ? 'text-xl' : 'text-2xl'} capitalize pt-2 pb-2`}>
                                    {badgeData.attendeeCompany?.toLowerCase() || "Company"}
                                </span>
                            </div>
                            <div
                                style={
                                    badgeData.attendeeRole.toLowerCase() === "delegate"
                                        ? { backgroundColor: 'white', color: 'black', border: '1px solid black' }
                                        : badgeData.attendeeRole.toLowerCase() === "speaker"
                                            ? { backgroundColor: '#80365F', color: 'white' }
                                            : badgeData.attendeeRole.toLowerCase() === "sponsor"
                                                ? { backgroundColor: 'black', color: 'white' }
                                                : {}
                                }
                                className="py-4 text-2xl text-center capitalize font-semibold bg-gradient-to-r">
                                {(badgeData?.attendeeRole?.toLowerCase() === "sponsor" ? "Partner" : badgeData?.attendeeRole?.toLowerCase()) || "Delegate"}
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
