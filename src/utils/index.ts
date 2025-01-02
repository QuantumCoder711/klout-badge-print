import { useEffect, useRef, useState } from 'react';

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