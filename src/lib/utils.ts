import { domain } from "@/constants";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImageUrl = (image: string | undefined | null): string => {
  return `${domain}/${image}`;
}

export const printBadge = (
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