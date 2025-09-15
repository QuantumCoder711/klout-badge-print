import React, { useEffect, useState } from 'react';
import socket from '../../socket';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
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

const PrintDynamicBadge: React.FC = () => {
  const { eventUuid, tabId } = useParams<{ eventUuid: string, tabId: string, print: string }>();
  const userId = useAppSelector((state) => state.auth.user?.user_id);

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

  // const link: string = `https://kloutclub.page.link/?link=${encodeURIComponent(
  //   `https://www.klout.club/event/check-in?eventuuid=${eventUuid}&tabId=${tabId}`
  // )}&apn=com.klout.app&afl=${encodeURIComponent(
  //   `https://www.klout.club/event/check-in?eventuuid=${eventUuid}&tabId=${tabId}`
  // )}&ibi=com.klout.app&ifl=${encodeURIComponent(
  //   `https://www.klout.club/event/check-in?eventuuid=${eventUuid}&tabId=${tabId}`
  // )}&_icp=1`;

  const link = `https://klout.club/event/check-in?eventuuid=${eventUuid}&tabId=${tabId}`;

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
      if (data.eventOwnerId === String(userId) && data.eventUuid === eventUuid && data.tabId === tabId) {
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
  }, [userId, eventUuid, tabId, event]);

  const handleShowBadgeAgain = () => {
    setBadgeData(showBadgeAgain);
    setShowQrCode(false);
  };

  return (
    <div className='w-full h-full flex flex-1 relative'>

      {badgeData && <Badge
        firstName={badgeData?.attendeeName.split(" ")[0] || "John"}
        lastName={badgeData?.attendeeName.split(" ")[1] || "Doe"}
        company={badgeData?.attendeeCompany || "Google"}
        designation={badgeData?.designation || "Software Engineer"}
        image={event?.badge_banner || ""}
        status={badgeData?.attendeeRole || "Delegate"}
        colors={colors}
        statusBackground={event?.badge_background_color}
        statusTextColor={event?.badge_text_color}
        setBadgeData={setBadgeData}
        setShowQrCode={setShowQrCode}
      />}


      <div hidden={!showQrCode} className="px-5 mt-10 w-fit mx-auto">
        <p className="text-3xl font-bold text-zinc-600 mb-5 text-center">
          Scan the QR Code.
        </p>
        <QRCode id='qr-code' value={link} fgColor='#3f3f46' className='max-w-96 max-h-96 mx-auto' />
      </div>
      <button onClick={handleShowBadgeAgain} className="px-3 py-2 text-white rounded-md absolute right-5 top-5 bg-green-700 hover:bg-green-800 duration-300">Show Badge Again</button>
    </div>
  );
};

export default PrintDynamicBadge;
