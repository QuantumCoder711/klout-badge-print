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

export const printBadge = (container: HTMLElement | null) => {
    const bodyData: HTMLElement | null = document.getElementById("body");

    if (bodyData && container) {
        // Store the current content of the body
        const originalContent = bodyData.innerHTML;

        // Replace the body content with the container's content
        bodyData.innerHTML = container.outerHTML;

        // Trigger the print dialog
        window.print();

        // Restore the original body content
        bodyData.innerHTML = originalContent;
        window.location.reload();
    }
}

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