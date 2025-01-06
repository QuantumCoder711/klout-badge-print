import { useEffect, useRef, useState } from 'react';

export interface Event {
    id: number;
    uuid: string;
    user_id: number;
    slug: string;
    title: string;
    description: string;
    event_date: string; // ISO date format
    event_start_date: string; // ISO date format
    event_end_date: string; // ISO date format
    event_venue_name: string;
    event_venue_address_1: string;
    event_venue_address_2: string;
    feedback: number;
    google_map_link: string | null;
    image: string; // file path
    location: string;
    more_information: string | null;
    pdf_path: string | null;
    pincode: string;
    qr_code: string; // file path
    start_time: string; // 12-hour format
    start_minute_time: string; // minute part of the time
    start_time_format: string; // 24-hour format
    start_time_type: 'AM' | 'PM';
    end_time: string; // hour part of the time
    end_minute_time: string; // minute part of the time
    end_time_type: 'AM' | 'PM';
    status: number;
    t_and_conditions: string | null;
    total_accepted: number;
    total_attendee: number;
    total_checkedin: number;
    total_checkedin_speaker: number;
    total_checkedin_sponsor: number;
    total_not_accepted: number;
    total_pending_delegate: number;
    total_rejected: number;
    updated_at: string; // ISO date format
    created_at: string; // ISO date format
    video_url: string | null;
    why_attend_info: string | null;
};

// export const printBadge = (container: HTMLElement | null) => {
//     const bodyData: HTMLElement | null = document.getElementById("body");

//     if (bodyData && container) {
//         // Store the current content of the body
//         const originalContent = bodyData.innerHTML;

//         // Replace the body content with the container's content
//         bodyData.innerHTML = container.outerHTML;

//         // Trigger the print dialog
//         window.print();

//         // Restore the original body content
//         bodyData.innerHTML = originalContent;
//     }
// }

export const printBadge = (container: HTMLElement | null) => {
    if (!container) {
        console.error("No badge container found for printing");
        return;
    }

    // Create a new window or document for printing
    const printWindow = window.open("", "_blank");

    if (printWindow) {
        // Copy the styles from the main document
        const styles = Array.from(document.styleSheets)
            .map((styleSheet) => {
                try {
                    return Array.from(styleSheet.cssRules || [])
                        .map((rule) => rule.cssText)
                        .join("\n");
                } catch (e) {
                    console.warn("Could not load styles for print:", e);
                    return "";
                }
            })
            .join("\n");

        // Write the badge content into the new window
        printWindow.document.open();
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Print Badge</title>
                    <style>
                        ${styles}
                        @page {
                            size: A4; /* Set A4 page size */
                            margin: 0; /* Remove default margins */
                        }
                        body {
                            margin: 0;
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            background-color: white;
                        }
                        .badge-container {
                            width: 210mm; /* Exact A4 width */
                            height: 297mm; /* Exact A4 height */
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            overflow: hidden;
                            position: absolute; /* Position the container at the top-left corner */
                        }
                        .badge-container > * {
                            width: 100%;
                            height: 100%;
                            object-fit: contain; /* Ensures content scales properly without distortion */
                        }
                        img {
                            max-width: 100%;
                            max-height: 100%;
                        }
                        @media print {
                            body {
                                -webkit-print-color-adjust: exact; /* Ensure colors are preserved */
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="badge-container">
                        ${container.outerHTML}
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();

        // Ensure images load before printing
        printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
        };
    } else {
        console.error("Unable to create print window");
    }
};






const useTypingAnimation = (textToType: string, typingSpeed: number, deletingSpeed: number, pauseDuration: number) => {
    const [displayedText, setDisplayedText] = useState<string>('');
    const currentIndexRef = useRef(0);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        const type = () => {
            if (currentIndexRef.current < textToType.length) {
                setDisplayedText(textToType.slice(0, currentIndexRef.current + 1));
                currentIndexRef.current += 1;
                timeoutId = setTimeout(type, typingSpeed);
            } else {
                timeoutId = setTimeout(deleteText, pauseDuration);
            }
        };

        const deleteText = () => {
            if (currentIndexRef.current > 0) {
                currentIndexRef.current -= 1;
                setDisplayedText(textToType.slice(0, currentIndexRef.current));
                timeoutId = setTimeout(deleteText, deletingSpeed);
            } else {
                currentIndexRef.current = 0; // Reset for the next loop
                timeoutId = setTimeout(type, typingSpeed);
            }
        };

        type();

        return () => {
            clearTimeout(timeoutId);
        };
    }, [textToType, typingSpeed, deletingSpeed, pauseDuration]);

    return displayedText;
};

export default useTypingAnimation;