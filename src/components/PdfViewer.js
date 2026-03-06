import React, { useState ,useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Draggable from 'react-draggable';
import { toast } from 'react-toastify';


// This worker is required for the PDF engine to run
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const PdfViewer = ({ fileUrl,signature,setSignature,userId }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [FinalPos, setFinalPos]=useState({x:0,y:0});

  const nodeRef = useRef(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const saveSignedPdf = async () => {
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/pdf-sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfUrl: fileUrl,
          type:signature.type,  
          signature:signature.value,
          x: FinalPos.x,
          y: FinalPos.y,
          pageNumber:pageNumber,
          userId:userId
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("PDF Signed Successfully!");
        window.open(data.downloadUrl, '_blank');
      }else{
        toast.error("Server error while signing the PDF.");
      }
    } catch (error) {
      console.error("Error saving signed PDF:", error);
      toast.error("Failed to save the PDF.");
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-red-50 min-h-screen">
      <div className="relative inline-block shadow-2xl bg-white rounded-lg border border-gray-200 overflow-hidden ring-1 ring-black/5">
        <Document
          file={fileUrl}
          className="flex justify-center"
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => console.error("Error loading PDF:", error)}
        >
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={false} 
            renderAnnotationLayer={false} 
            width={600}
            className="shadow-inner"
          />
        </Document>
        
        {signature && signature.value &&(
          <Draggable nodeRef={nodeRef} bounds="parent"
            onStop={(e, data) => {
              console.log(data.x,data.y);
              setFinalPos({ x: data.x, y: data.y });
            }}>
            <div ref={nodeRef} className="absolute z-10 cursor-move p-2 border-1 border-dashed border-blue-500 bg-blue-50/10 rounded flex items-center justify-center group top-0 left-0" style={{ padding: 0 }}>
              {signature.type === 'text' ? (
               <span className="text-2xl font-signature text-black whitespace-nowrap px-4">{signature.value}</span>
             ) : (
               <img src={signature.value} className="w-[150px] h-auto block pointer-events-none" alt="signature" />
             )}

              <button 
                onClick={() =>{
                  setSignature({...signature,value:null})}} // This clears the state in Home.js
                className="absolute -top-3 -right-3 w-1 h-1 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                title="Remove Signature"
              >
                ×
              </button>

              <div className="absolute inset-0 pointer-events-none opacity-50 border border-dashed border-blue-400"></div>
            </div>
          </Draggable>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-6 w-full max-w-md bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center gap-6">
          <button 
            disabled={pageNumber <= 1} 
            onClick={() => setPageNumber(prev => prev - 1)}
            className="px-3 py-1 text-xs font-medium rounded-md bg-blue hover:bg-red-200 disabled:opacity-30 transition-colors"
          >
            ⬅️ Previous
          </button>

          <span className="text-sm font-medium text-gray-600">
            Page <span className="text-blue-600 font-bold">{pageNumber}</span> of {numPages}
          </span>

          <button 
            disabled={pageNumber >= numPages} 
            onClick={() => setPageNumber(prev => prev + 1)}
            className="px-3 py-1 text-xs font-medium rounded-md bg-blue hover:bg-red-200 disabled:opacity-30 transition-colors"
          >
            Next ➡️
          </button>
        </div>
        <button 
          onClick={saveSignedPdf} 
          className="w-full py-3 px-6 bg-green-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/30 transform transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>🚀</span> Apply Signature Permanently
        </button>
      </div>
    </div>
  );
};


export default PdfViewer;