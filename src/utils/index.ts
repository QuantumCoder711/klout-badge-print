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
    printer_count: number | null;
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

// export const printBadge = (container: HTMLElement | null, width: string, height: string, type: string) => {
//     if (!container) {
//         console.error("No badge container found for printing");
//         return;
//     }

//     // Create a new window or document for printing
//     const printWindow = window.open("", "_blank");

//     if (printWindow) {
//         // Copy the styles from the main document
//         const styles = Array.from(document.styleSheets)
//             .map((styleSheet) => {
//                 try {
//                     return Array.from(styleSheet.cssRules || [])
//                         .map((rule) => rule.cssText)
//                         .join("\n");
//                 } catch (e) {
//                     console.warn("Could not load styles for print:", e);
//                     return "";
//                 }
//             })
//             .join("\n");

//         // Write the badge content into the new window
//         printWindow.document.open();
//         printWindow.document.write(`
//             <!DOCTYPE html>
//             <html lang="en">
//                 <head>
//                     <meta charset="UTF-8">
//                     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                     <title>Print Badge</title>
//                     <style>
//                         ${styles}
//                         @page {
//                             size: ${type}; /* Set A4 page size */
//                             margin: 0; /* Remove default margins */
//                         }
//                         body {
//                             margin: 0;
//                             padding: 0;
//                             display: flex;
//                             justify-content: center;
//                             align-items: center;
//                             height: 100vh;
//                             background-color: white;
//                         }
//                         .badge-container {
//                             width: ${width}; /* Exact A4 width */
//                             height: ${height}; /* Exact A4 height */
//                             display: flex;
//                             justify-content: center;
//                             align-items: center;
//                             overflow: hidden;
//                             position: absolute; /* Position the container at the top-left corner */
//                         }
//                         .badge-container > * {
//                             width: 100%;
//                             height: 100%;
//                             object-fit: contain; /* Ensures content scales properly without distortion */
//                         }
//                         img {
//                             max-width: 100%;
//                             max-height: 100%;
//                         }
//                         @media print {
//                             body {
//                                 -webkit-print-color-adjust: exact; /* Ensure colors are preserved */
//                             }
//                         }
//                     </style>
//                 </head>
//                 <body>
//                     <div class="badge-container">
//                         ${container.outerHTML}
//                     </div>
//                 </body>
//             </html>
//         `);
//         printWindow.document.close();

//         // Ensure images load before printing
//         printWindow.onload = () => {
//             printWindow.print();
//             printWindow.close();
//         };
//     } else {
//         console.error("Unable to create print window");
//     }
// };


// export const printName = (container: HTMLElement | null) => {
//     if (!container) {
//         console.error("No badge container found for printing");
//         return;
//     }

//     // Create a new window or document for printing
//     const printWindow = window.open("");

//     if (printWindow) {
//         // Copy the styles from the main document
//         const styles = Array.from(document.styleSheets)
//             .map((styleSheet) => {
//                 try {
//                     return Array.from(styleSheet.cssRules || [])
//                         .map((rule) => rule.cssText)
//                         .join("\n");
//                 } catch (e) {
//                     console.warn("Could not load styles for print:", e);
//                     return "";
//                 }
//             })
//             .join("\n");

//         // Write the badge content into the new window
//         printWindow.document.open();
//         printWindow.document.write(`
//             <!DOCTYPE html>
//             <html lang="en">
//                 <head>
//                     <meta charset="UTF-8">
//                     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                     <title>Print Badge</title>
//                     <style>
//                         ${styles}
//                         @page {
//                             size: A4; /* Set A4 page size */
//                             margin: 0; /* Remove default margins */
//                         }
//                         body {
//                             margin: 0;
//                             padding: 0;
//                             display: flex;
//                             justify-content: center;
//                             align-items: center;
//                             height: 100vh;
//                             background-color: white;
//                         }
//                         .badge-container {
//                             width: 210mm; /* Exact A4 width */
//                             height: 297mm; /* Exact A4 height */
//                             display: flex;
//                             justify-content: center;
//                             align-items: center;
//                             overflow: hidden;
//                             position: absolute; /* Position the container at the top-left corner */
//                         }
//                         .badge-container > * {
//                             width: 100%;
//                             height: 100%;
//                             object-fit: contain; /* Ensures content scales properly without distortion */
//                         }
//                         @media print {
//                             body {
//                                 -webkit-print-color-adjust: exact; /* Ensure colors are preserved */
//                             }
//                         }
//                     </style>
//                 </head>
//                 <body>
//                     <div class="badge-container">
//                         ${container.outerHTML}
//                     </div>
//                 </body>
//             </html>
//         `);
//         printWindow.document.close();

//         // Ensure images load before printing
//         printWindow.onload = () => {
//             printWindow.print();
//             printWindow.close();
//         };
//     } else {
//         console.error("Unable to create print window");
//     }
// };

// export const printBadge = (container: HTMLElement | null, width: string, height: string, type: string) => {
//     if (!container) {
//         console.error("No badge container found for printing");
//         return;
//     }

//     // Create a temporary print container
//     const printContainer = document.createElement("div");
//     printContainer.style.position = "absolute";
//     printContainer.style.top = "0";
//     printContainer.style.left = "0";
//     printContainer.style.width = "100%";
//     printContainer.style.height = "100%";
//     printContainer.style.zIndex = "9999";
//     printContainer.style.backgroundColor = "white";
//     printContainer.style.display = "flex";
//     printContainer.style.justifyContent = "center";
//     printContainer.style.alignItems = "center";
//     printContainer.style.overflow = "hidden";
//     printContainer.innerHTML = `
//         <div style="width: ${width}; height: ${height}; display: flex; justify-content: center; align-items: center; overflow: hidden;">
//             ${container.outerHTML}
//         </div>
//     `;

//     // Append the print container to the body
//     document.body.appendChild(printContainer);

//     // Copy styles for printing
//     const styleSheet = document.createElement("style");
//     styleSheet.textContent = `
//         @page {
//             size: ${type}; /* Set A4 page size */
//             margin: 0; /* Remove default margins */
//         }
//         body {
//             -webkit-print-color-adjust: exact; /* Ensure colors are preserved */
//         }
//     `;
//     document.head.appendChild(styleSheet);

//     // Trigger print
//     window.print();

//     // Cleanup after printing
//     window.onafterprint = () => {
//         document.body.removeChild(printContainer);
//         document.head.removeChild(styleSheet);
//     };
// };

// export const printName = (container: HTMLElement | null) => {
//     if (!container) {
//         console.error("No badge container found for printing");
//         return;
//     }

//     // Create a temporary print container
//     const printContainer = document.createElement("div");
//     printContainer.style.position = "absolute";
//     printContainer.style.top = "0";
//     printContainer.style.left = "0";
//     printContainer.style.width = "100%";
//     printContainer.style.height = "100%";
//     printContainer.style.zIndex = "9999";
//     printContainer.style.backgroundColor = "white";
//     printContainer.style.display = "flex";
//     printContainer.style.justifyContent = "center";
//     printContainer.style.alignItems = "center";
//     printContainer.style.overflow = "hidden";
//     printContainer.innerHTML = `
//         <div style="width: 210mm; height: 297mm; display: flex; justify-content: center; align-items: center; overflow: hidden;">
//             ${container.outerHTML}
//         </div>
//     `;

//     // Append the print container to the body
//     document.body.appendChild(printContainer);

//     // Copy styles for printing
//     const styleSheet = document.createElement("style");
//     styleSheet.textContent = `
//         @page {
//             size: A4; /* Set A4 page size */
//             margin: 0; /* Remove default margins */
//         }
//         body {
//             -webkit-print-color-adjust: exact; /* Ensure colors are preserved */
//         }
//     `;
//     document.head.appendChild(styleSheet);

//     // Trigger print
//     window.print();

//     // Cleanup after printing
//     window.onafterprint = () => {
//         document.body.removeChild(printContainer);
//         document.head.removeChild(styleSheet);
//     };
// };

export const printBadge = (container: HTMLElement | null, width: string, height: string, type: string) => {
    if (!container) {
        console.error("No badge container found for printing");
        return;
    }

    // Create a temporary print container
    const printContainer = document.createElement("div");
    printContainer.style.position = "absolute";
    printContainer.style.padding = "0px";
    printContainer.style.top = "0";
    printContainer.style.left = "0";
    printContainer.style.right = "0";
    printContainer.style.width = "100%";
    printContainer.style.height = "100%";
    printContainer.style.zIndex = "9999";
    printContainer.style.margin = "auto !important";
    printContainer.style.backgroundColor = "white";
    printContainer.style.overflow = "hidden";
    printContainer.innerHTML = `
        <div style="width: ${width}; height: ${height}; padding: 0px; margin: auto !important; display: grid; justify-items: center; align-items: center; width: 100%;">
            ${container.outerHTML}
        </div>
    `;

    // Append the print container to the body
    document.body.appendChild(printContainer);

    // Add styles for printing
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        @page {
            size: ${type}; /* Set the page size */
            margin-top: 20px; /* Remove default margins */
        }
        body {
            -webkit-print-color-adjust: exact; /* Ensure colors are preserved */
        }
    `;
    document.head.appendChild(styleSheet);

    // Cleanup function to restore the original state
    const cleanup = () => {
        if (document.body.contains(printContainer)) {
            document.body.removeChild(printContainer);
        }
        if (document.head.contains(styleSheet)) {
            document.head.removeChild(styleSheet);
        }
        window.onafterprint = null; // Clear the event listener
    };

    // Trigger print
    window.print();

    // Use both onafterprint and a fallback timeout to ensure cleanup
    window.onafterprint = cleanup;
    setTimeout(cleanup, 200); // Fallback cleanup in case onafterprint doesn't fire
};


export const printDynamicBadge = (
    container: HTMLElement | null,
    width: string = '100%',
    height: string = '100%',
    type: string = 'auto'
): void => {
    if (!container) {
        console.error('No badge container found for printing');
        return;
    }

    /*
      We temporarily clone the badge inside an overlay that stretches across the
      full viewport.  The @page CSS rule removes the default browser margins and
      the overlay centres the badge using CSS grid so that it always sits in the
      middle of the sheet.  Using width/height 100% ensures that – regardless of
      the paper size chosen by the user (A4, Letter, custom, etc.) – the badge is
      scaled by the browser to fit on exactly one page without cropping or
      overflowing.
    */
    const printContainer = document.createElement('div');
    Object.assign(printContainer.style, {
        position: 'fixed',
        inset: '0',
        padding: '0',
        margin: '0',
        zIndex: '2147483647', // max available – ensures it overlays everything
        backgroundColor: 'white',
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
    } as CSSStyleDeclaration);

    printContainer.innerHTML = `
        <div id="print-wrapper" style="width: ${width}; height: ${height}; display:flex; align-items:center; justify-content:center;">
          ${container.outerHTML}
        </div>
      `;

    document.body.appendChild(printContainer);

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
          @page { size: ${type}; margin: 0; }
          html,body,#print-wrapper { width: 100%; height: 100%; margin: 0; padding:0; -webkit-print-color-adjust: exact; }
          #print-wrapper > * { width:100% !important; height:100% !important; border-radius:0 !important; box-shadow:none !important; }
      `;
    document.head.appendChild(styleSheet);

    const cleanup = () => {
        if (printContainer.parentElement) printContainer.parentElement.removeChild(printContainer);
        if (styleSheet.parentElement) styleSheet.parentElement.removeChild(styleSheet);
        window.onafterprint = null;
    };

    window.onafterprint = cleanup;
    window.print();

    // Fallback in case onafterprint does not fire (e.g. Safari)
    setTimeout(cleanup, 300);
};

export const printName = (container: HTMLElement | null) => {
    if (!container) {
        console.error("No badge container found for printing");
        return;
    }

    // Create a temporary print container
    const printContainer = document.createElement("div");
    printContainer.style.position = "absolute";
    printContainer.style.top = "0";
    printContainer.style.left = "0";
    printContainer.style.width = "100%";
    printContainer.style.height = "100%";
    printContainer.style.zIndex = "9999";
    printContainer.style.margin = "auto";
    printContainer.style.backgroundColor = "white";
    printContainer.style.overflow = "hidden";
    printContainer.innerHTML = `
        <div style="width: 100%; display: flex; padding-top: 10px; padding-bottom: 10px; border-bottom: 2px solid black; justify-content: center; align-items: center; overflow: hidden;">
            ${container.outerHTML}
        </div>
    `;

    // Append the print container to the body
    document.body.appendChild(printContainer);

    // Add styles for printing
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        @page {
            size: A6 landscape; /* Set the page size */
            margin: 0; /* Remove default margins */
        }
        body {
            -webkit-print-color-adjust: exact; /* Ensure colors are preserved */
        }
    `;
    document.head.appendChild(styleSheet);

    // Cleanup function to restore the original state
    const cleanup = () => {
        if (document.body.contains(printContainer)) {
            document.body.removeChild(printContainer);
        }
        if (document.head.contains(styleSheet)) {
            document.head.removeChild(styleSheet);
        }
        window.onafterprint = null; // Clear the event listener
    };

    // Trigger print
    window.print();

    // Use both onafterprint and a fallback timeout to ensure cleanup
    window.onafterprint = cleanup;
    setTimeout(cleanup, 200); // Fallback cleanup in case onafterprint doesn't fire
};



// export const printName = (container: HTMLElement | null) => {
//     if (!container) {
//         console.error("No badge container found for printing");
//         return;
//     }

//     // Store the current content of the body
//     const originalContent = document.body.innerHTML;

//     // Create a wrapper for the container's content
//     const printWrapper = document.createElement("div");
//     printWrapper.innerHTML = container.outerHTML;
//     printWrapper.style.display = "inline-block"; // Prevent full-width expansion
//     printWrapper.style.margin = "0"; // No margins
//     printWrapper.style.padding = "0"; // No padding
//     printWrapper.style.boxShadow = "none"; // No shadows
//     printWrapper.style.textAlign = "center"; // Center content, if required

//     // Replace the body content with the container's content for printing
//     document.body.innerHTML = "";
//     document.body.appendChild(printWrapper);

//     // Add a print-specific stylesheet
//     const styleSheet = document.createElement("style");
//     styleSheet.textContent = `
//         @page {
//             size: auto; /* Dynamically fit content */
//             margin: 0; /* Remove default margins */
//         }
//         body {
//             margin: 0; /* Remove body margin */
//             padding: 0; /* Remove body padding */
//             display: flex;
//             justify-content: center;
//             max-height: fit-content;
//             align-items: center;
//             -webkit-print-color-adjust: exact; /* Ensure colors are preserved */
//         }
//         div {
//             margin: 0 auto; /* Center content */
//             max-width: fit-content; /* Dynamically adjust to content width */
//             max-height: fit-content; /* Dynamically adjust to content height */
//             box-shadow: none !important; /* Remove any shadows */
//         }
//         div::before {
//             content: "Page 1";
//             display: block;
//             text-align: center;
//             font-size: 12px;
//             font-weight: bold;
//             margin-bottom: 10px;
//         }
//     `;
//     document.head.appendChild(styleSheet);

//     // Trigger the print dialog
//     window.print();

//     // Restore the original content after printing
//     document.body.innerHTML = originalContent;

//     // Remove the appended stylesheet to avoid affecting the rest of the app
//     if (styleSheet.parentNode) {
//         styleSheet.parentNode.removeChild(styleSheet);
//     }
// };




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