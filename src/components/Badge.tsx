import { cn, getImageUrl, printBadge } from '@/lib/utils';
import React, { useRef } from 'react';

interface BadgeProps {
    firstName: string;
    lastName: string;
    company: string;
    designation: string;
    image: string | null | undefined;
    status: string;
    statusBackground?: string;
    statusTextColor?: string;
    colors?: {
        backgroundColor: string;
        textColor: string;
        statusColors: {
            delegate: { background: string; text: string };
            speaker: { background: string; text: string };
            sponsor: { background: string; text: string };
            panelist: { background: string; text: string };
        };
    };
    setBadgeData: (badgeData: any | undefined) => void;
    setShowQrCode: (showQrCode: boolean) => void;
}

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);


const handlePrintBadge = (badgeRef: React.RefObject<HTMLDivElement>) => {
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
        printBadge(badgeRef.current, '100%', '100%', 'auto');
    }
};

const Badge: React.FC<BadgeProps> = ({
    firstName,
    lastName,
    company,
    designation,
    image,
    status,
    statusBackground = '#000000',
    statusTextColor = '#ffffff',
    colors,
    setBadgeData,
    setShowQrCode,
}) => {
    const companyName = company || '';
    const jobTitle = designation || '';

    // Get status colors based on attendee status or use default
    const getStatusColors = () => {
        if (!colors || !status) return { background: statusBackground, text: statusTextColor };

        const attendeeStatus = status.toLowerCase();
        switch (attendeeStatus) {
            case 'speaker':
                return colors.statusColors.speaker;
            case 'sponsor':
                return colors.statusColors.sponsor;
            case 'panelist':
                return colors.statusColors.panelist;
            case 'delegate':
            default:
                return colors.statusColors.delegate;
        }
    };

    const statusColors = getStatusColors();

    // Rough heuristic: if the name is very long (> 20 characters) it likely wraps to three lines on badge width
    const isLongName = (firstName.length + lastName.length) > 16; // Adjusted to consider both first and last name
    const isLongCompanyName = companyName.length > 32;
    const isLongJobTitle = jobTitle.length > 68;
    const badgeRef = useRef<HTMLDivElement | null>(null);

    const handlePrint = () => {
        handlePrintBadge(badgeRef);
        setTimeout(() => {
            setShowQrCode(true); // Show QR code after printing or canceling the print dialog
            setBadgeData(undefined); // Clear badge data
        }, 1000); // Delay ensures the print dialog finishes first
    }


    return (
        <div className='max-w-80 w-full max-h-[460px] my-10 mx-auto'>

            {/* Card For Printing... */}
            <div ref={badgeRef} className={cn('w-full mx-auto h-full flex flex-col gap-3 flex-1', !isIOS && '')}>
                {/* Card 1 */}
                <div
                    className="w-full mx-auto overflow-hidden rounded flex flex-col justify-between flex-1"
                    style={{
                        backgroundColor: colors?.backgroundColor || 'white',
                        color: colors?.textColor || 'inherit'
                    }}
                >
                    {image ? (
                        typeof image === 'string' ? (
                            image.startsWith('data:') || image.startsWith('/') || image.startsWith('http')
                                ? (
                                    <img
                                        src={image}
                                        className="rounded-t w-full mx-auto object-fill max-h-[160px]"
                                        alt="Badge"
                                    />
                                ) : (
                                    <img
                                        src={getImageUrl(image)}
                                        className="rounded-t w-full mx-auto object-fill max-h-[160px]"
                                        alt="Badge"
                                    />
                                )
                        ) : (
                            <div className='w-full h-[160px] bg-sky-500' />
                        )
                    ) : (
                        <div className='w-full h-[160px] bg-sky-500' />
                    )}

                    <div className='mx-4 pb-3 !capitalize pl-1'>
                        <div className={`font-bold ${isLongName ? 'text-3xl' : 'text-5xl'}`}>
                            <h3 className="mb-2">{firstName?.toLowerCase() || 'First Name'} {lastName?.toLowerCase() || 'Last Name'}</h3>
                            {/* <h3 className="mb-2">{}</h3> */}
                        </div>
                        <h3 className={`font-medium ${isLongCompanyName ? 'text-2xl' : 'text-3xl'} pt-1 mb-1`}>
                            {company?.toLowerCase() || "Company"}
                        </h3>
                        <span className={`${isLongJobTitle ? 'text-lg' : 'text-xl'} capitalize pt-1 pb-1`}>
                            {designation?.toLowerCase() || "Designation"}
                        </span>
                    </div>
                    <div
                        className="py-3 text-2xl text-center capitalize font-semibold rounded-3xl w-11/12 mx-auto"
                        style={{
                            backgroundColor: statusColors.background,
                            color: statusColors.text
                        }}>
                        {status}
                    </div>
                </div>

                {/* Card 2 (back side) */}
                <div
                    className="w-full rotate-180 mx-auto overflow-hidden rounded hidden print:flex flex-col justify-between flex-1"
                    style={{
                        backgroundColor: colors?.backgroundColor || 'white',
                        color: colors?.textColor || 'inherit'
                    }}
                >
                    {image ? (
                        typeof image === 'string' ? (
                            image.startsWith('data:') || image.startsWith('/') || image.startsWith('http')
                                ? (
                                    <img
                                        src={getImageUrl(image)}
                                        className="rounded-t w-full mx-auto object-fill max-h-[160px]"
                                        alt="Badge"
                                    />
                                ) : (
                                    <img
                                        src={getImageUrl(image)}
                                        className="rounded-t w-full mx-auto object-fill max-h-[160px]"
                                        alt="Badge"
                                    />
                                )
                        ) : (
                            <div className='w-full h-[160px] bg-blue-500' />
                        )
                    ) : (
                        <div className='w-full h-[160px] bg-blue-500' />
                    )}

                    <div className='mx-4 pb-3 !capitalize pl-1'>
                        <div className={`font-bold ${isLongName ? 'text-3xl' : 'text-5xl'}`}>
                            <h3 className="mb-2">{firstName?.toLowerCase() || 'First Name'} {lastName?.toLowerCase() || 'Last Name'}</h3>
                            {/* <h3 className="mb-2">{}</h3> */}
                        </div>
                        <h3 className={`font-medium ${isLongCompanyName ? 'text-2xl' : 'text-3xl'} pt-1 mb-1`}>
                            {company?.toLowerCase() || "Company"}
                        </h3>
                        <span className={`${isLongJobTitle ? 'text-lg' : 'text-xl'} capitalize pt-1 pb-1`}>
                            {designation?.toLowerCase() || "Designation"}
                        </span>
                    </div>
                    <div
                        className="py-3 text-2xl text-center capitalize font-semibold rounded-3xl w-11/12 mx-auto"
                        style={{
                            backgroundColor: statusColors.background,
                            color: statusColors.text
                        }}>
                        {status}
                    </div>
                </div>
            </div>

            <button onClick={handlePrint} className='px-4 py-2.5 w-full mt-5 rounded-lg bg-orange-500 text-orange-50'>Print</button>
        </div>
    )
}

export default Badge;
