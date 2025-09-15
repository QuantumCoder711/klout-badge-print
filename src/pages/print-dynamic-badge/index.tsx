import React, { useEffect, useRef, useState } from 'react';
import socket from '../../socket';
import { printDynamicBadge } from '../../utils';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import BadgeBanner from "@/assets/badge_banner.png";
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import Badge from '@/components/Badge';

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


const PrintDynamicBadge: React.FC = () => {
  const { eventUuid, tabId } = useParams<{ eventUuid: string, tabId: string, print: string }>();
  const userId = useAppSelector((state) => state.auth.user?.user_uuid);

  const event = useAppSelector((state) => state.event.events?.find((event) => event.uuid === eventUuid));

  const colors = {
    backgroundColor: event?.badge_background_color || '#fff',
    textColor: event?.badge_text_color || '#000',
    statusColors: {
      delegate: { background: event?.delegate_tag_color || '#0071E3', text: event?.delegate_text_color || '#fff' },
      speaker: { background: event?.speaker_tag_color || '#0071E3', text: event?.speaker_text_color || '#fff' },
      sponsor: { background: event?.sponsor_tag_color || '#0071E3', text: event?.sponsor_text_color || '#fff' },
      panelist: { background: event?.panelist_tag_color || '#0071E3', text: event?.panelist_text_color || '#fff' },
    },
  };

  const link: string = `https://kloutclub.page.link/?link=${encodeURIComponent(
    `https://www.klout.club/event/check-in?eventuuid=${eventUuid}&tabId=${tabId}`
  )}&apn=com.klout.app&afl=${encodeURIComponent(
    `https://www.klout.club/event/check-in?eventuuid=${eventUuid}&tabId=${tabId}`
  )}&ibi=com.klout.app&ifl=${encodeURIComponent(
    `https://www.klout.club/event/check-in?eventuuid=${eventUuid}&tabId=${tabId}`
  )}&_icp=1`;

  const [badgeData, setBadgeData] = useState<Badge | undefined>(undefined);
  const [showBadgeAgain, setShowBadgeAgain] = useState<Badge | undefined>(undefined);
  const [showQrCode, setShowQrCode] = useState(true); // State to control QR code visibility

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
        setShowBadgeAgain(data);
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


  // const handlePrint = () => {
  //     // Call the printBadge function and then show QR code after a delay
  //     badgeRefPrint(badgeRef);
  //     setTimeout(() => {
  //         setShowQrCode(true); // Show QR code after printing or canceling the print dialog
  //         setBadgeData(undefined); // Clear badge data
  //     }, 1000); // Delay ensures the print dialog finishes first
  // };

  return (
    <div className='w-full h-full flex flex-1'>
      {badgeData && <Badge
        firstName={badgeData?.attendeeName || "John"}
        lastName={badgeData?.attendeeName || "Doe"}
        company={badgeData?.attendeeCompany || "Google"}
        designation={badgeData?.designation || "Software Engineer"}
        image={event?.badge_banner || ""}
        status={badgeData?.attendeeRole || "Delegate"}
        colors={colors}
        statusBackground={event?.badge_background_color}
        statusTextColor={event?.badge_text_color}
      />}

      
      <div hidden={!showQrCode} className="px-5 mt-10 w-fit mx-auto">
        <p className="text-3xl font-bold text-zinc-600 mb-5 text-center">
          Scan the QR Code.
        </p>
        <QRCode id='qr-code' value={link} fgColor='#3f3f46' className='max-w-96 max-h-96 mx-auto' />
      </div>
    </div>
  );
};

export default PrintDynamicBadge;
