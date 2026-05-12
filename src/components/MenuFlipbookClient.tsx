"use client";

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import { X, Loader2, ZoomIn, ZoomOut, Volume2, VolumeX } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface MenuFlipbookClientProps {
  url: string;
  onClose: () => void;
  hotelName?: string;
}

const PageCover = forwardRef<HTMLDivElement, { children: React.ReactNode }>((props, ref) => {
  return (
    <div className="bg-[#5c4033] h-full shadow-2xl rounded-l-md border-r border-[#4a332a] relative overflow-hidden flex items-center justify-center text-amber-50" ref={ref} data-density="hard">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-40 mix-blend-overlay"></div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8 text-center border-[12px] border-double border-amber-900/40 m-4 rounded-sm">
        {props.children}
      </div>
    </div>
  );
});
PageCover.displayName = "PageCover";

const PdfPage = forwardRef<HTMLDivElement, { pageNumber: number, width: number }>((props, ref) => {
  return (
    <div className="bg-white h-full shadow-inner overflow-hidden flex items-center justify-center" ref={ref}>
      <Page 
        pageNumber={props.pageNumber} 
        width={props.width}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        className="shadow-md"
      />
    </div>
  );
});
PdfPage.displayName = "PdfPage";

const ImagePage = forwardRef<HTMLDivElement, { url: string }>((props, ref) => {
  return (
    <div className="bg-white h-full shadow-inner overflow-hidden flex items-center justify-center p-4" ref={ref}>
      <img src={props.url} alt="Menu" className="max-w-full max-h-full object-contain shadow-md rounded-md" />
    </div>
  );
});
ImagePage.displayName = "ImagePage";


export default function MenuFlipbookClient({ url, onClose, hotelName = "Our Restaurant" }: MenuFlipbookClientProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const isPdf = url.toLowerCase().includes('.pdf');
  const bookRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // We use a generic page flip sound from a reliable CDN or place one in public later
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2092/2092-preview.mp3');
    audioRef.current.volume = 0.5;
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsReady(true);
  };

  const playFlipSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play blocked by browser:", e));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 overflow-hidden animate-in fade-in duration-300">
      
      {/* Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-[110]">
        <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full p-1.5 gap-1 border border-white/20">
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors">
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-white font-black text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.2))} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors">
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>

        <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full transition-colors" title={soundEnabled ? "Mute Sound" : "Enable Sound"}>
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        <button onClick={onClose} className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="w-full h-full flex flex-col items-center justify-center relative transition-transform duration-300" style={{ transform: `scale(${zoom})` }}>
        
        {/* PDF Document Loader invisibly loads pages first */}
        {isPdf && !isReady && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-50">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-amber-400" />
            <p className="font-bold text-lg animate-pulse">Preparing Menu...</p>
            <div className="hidden">
              <Document file={url} onLoadSuccess={onDocumentLoadSuccess} onLoadError={(e) => setError(e.message)} />
            </div>
          </div>
        )}

        {error && (
          <div className="bg-white p-8 rounded-3xl max-w-md text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Failed to load Menu</h3>
            <p className="text-slate-500 text-sm mb-6">{error}</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors inline-block">
              Download Menu Instead
            </a>
          </div>
        )}

        {/* The Flipbook */}
        {((isPdf && isReady && numPages) || (!isPdf)) && (
          <div className="shadow-2xl shadow-black/50">
            <HTMLFlipBook 
              width={400} 
              height={550} 
              size="stretch"
              minWidth={300}
              maxWidth={500}
              minHeight={400}
              maxHeight={700}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              className="menu-flipbook"
              ref={bookRef}
              onFlip={playFlipSound}
              style={{ margin: "0 auto" }}
              startPage={0}
              drawShadow={true}
              flippingTime={1000}
              usePortrait={true}
              startZIndex={0}
              autoSize={true}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={true}
              disableFlipByClick={false}
            >
              
              <PageCover>
                <div className="flex flex-col items-center justify-center h-full">
                  <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-amber-400 drop-shadow-md mb-6 font-serif">Menu</h1>
                  <h2 className="text-xl md:text-2xl font-bold text-amber-50/90">{hotelName}</h2>
                  <div className="w-16 h-1 bg-amber-500/50 my-8 rounded-full"></div>
                  <p className="text-sm font-medium text-amber-200/70 tracking-widest uppercase">Click or Drag to Open</p>
                </div>
              </PageCover>

              {isPdf ? (
                Array.from(new Array(numPages), (el, index) => (
                  <PdfPage key={`page_${index + 1}`} pageNumber={index + 1} width={400} />
                ))
              ) : (
                <ImagePage url={url} />
              )}
              
              {/* Back Cover to ensure even pages */}
              {isPdf && numPages && numPages % 2 !== 0 && (
                 <div className="bg-slate-50 h-full flex items-center justify-center border-l border-slate-200 shadow-inner">
                    <p className="text-slate-300 font-bold uppercase tracking-widest text-sm">Blank Page</p>
                 </div>
              )}

              <PageCover>
                <div className="flex flex-col items-center justify-center h-full">
                  <h2 className="text-2xl font-bold text-amber-400 mb-2 font-serif">Thank You</h2>
                  <p className="text-amber-100/70 text-sm">We hope you enjoy your meal!</p>
                </div>
              </PageCover>
              
            </HTMLFlipBook>
          </div>
        )}

      </div>
      
      {/* Hidden document just to fetch numPages if it wasn't rendered yet */}
      {isPdf && !isReady && !error && (
        <div className="opacity-0 pointer-events-none absolute">
          <Document file={url} onLoadSuccess={onDocumentLoadSuccess} onLoadError={(e) => setError(e.message)} />
        </div>
      )}
    </div>
  );
}
