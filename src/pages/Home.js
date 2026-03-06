import React from 'react';
import axios from 'axios';
import { useEffect,useState } from 'react';
import { toast } from 'react-toastify';
import PdfViewer from '../components/PdfViewer';
import SignaturePad from '../components/SignaturePad';
import { useNavigate } from 'react-router-dom';
import { handleSuccess,handleError,API_BASE_URL} from '../utils';


function Home() {
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [signature, setSignature] = useState({ type: 'image', value: null });
  const [isPadMinimized, setIsPadMinimized] = useState(false);
  const [userId, setUserId] = useState("guest user");
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
      // Look for the MongoDB ID we just saved
      const id = localStorage.getItem('userId');
      console.log("Current User ID from Storage:", id);
      if (id) {
          setUserId(id);
      }
  }, []);

  const fetchHistory = async () => {
    if (userId && userId !== "guest user") {
      try {
        const res = await fetch(`${ API_BASE_URL }/${userId}`);
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    }
  };
  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const uploadPdf = async (e) => {
    e.preventDefault();
    if (!file) return toast.warning("Please select a file first!");

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('myFile', file);

    try {
      const response = await axios.post(`${ API_BASE_URL }/upload-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const fullUrl = `${ API_BASE_URL }${response.data.filePath}`;
      setPdfUrl(fullUrl);
      toast.success("Upload successful!");
    } catch (error) {
      toast.error("Upload failed.");
      console.error(error);
    }
  };
  const handleLogout = () => {
        // 1. Remove all keys you set in Login.js
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('userId');

        // 2. Notify the user using your existing util
        handleSuccess('Logged out successfully');

        // 3. Redirect to login
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };


  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* 1. Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <span>🖋️</span> Sign Your Pdf
        </h1>
        {pdfUrl && (
           <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-700 rounded-full">
             File Loaded
           </span>
        )}
        <div className="flex items-center gap-6">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-sm"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8">
        {/* 2. Upload Section */}
        {!pdfUrl && (
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center shadow-sm">
            <div className="mb-4 text-4xl">📄</div>
            <h2 className="text-lg font-semibold mb-2">Upload your PDF</h2>
            <p className="text-gray-500 mb-6 text-sm">Select a document to begin signing</p>
            
            <input 
              type="file" 
              accept=".pdf" 
              onChange={(e) => setFile(e.target.files[0])} 
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer mb-6"
            />
            
            <button 
              onClick={uploadPdf}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-bold transition-all shadow-lg active:scale-95"
            >
              Upload
            </button>
            
          </div>
        )}


        {/* 4. Post-Upload Success Message */}
        {pdfUrl && !showPreview && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-md border border-gray-100 animate-in fade-in zoom-in duration-300">
            <div className="text-green-500 text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-2">Document Ready!</h2>
            <p className="text-gray-500 mb-8">Your file is safely stored. Now you can place your signature.</p>
            <button 
              onClick={() => setShowPreview(true)} 
              className="bg-gray-900 hover:bg-black text-white px-10 py-3 rounded-xl font-bold transition-all shadow-xl active:scale-95"
            >
              Preview & Sign Document
            </button>
          </div>
        )}

        {/* 5. PDF Viewer Modal/Section */}
        {showPreview && (
          <div className="fixed inset-0 z-[60] bg-gray-50 flex flex-col">
            {/* Sub-Header / Navigation */}
            <nav className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between shadow-sm">
              <button 
                onClick={() => setShowPreview(false)}
                className="text-sm font-bold text-gray-600 hover:text-blue-600 flex items-center gap-2 transition-all hover:-translate-x-1"
              >
                <span className="text-lg">←</span> Back to Dashboard
              </button>
              
              <div className="text-xs font-medium text-gray-400">
                Editing: {file?.name || "Document"}
              </div>
            </nav>

            {/* Scrollable Viewer Area */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-5xl mx-auto">
                <PdfViewer 
                  fileUrl={pdfUrl} 
                  signature={signature} 
                  setSignature={setSignature} 
                  userId={userId}
                />
              </div>
            </div>
          </div>
        )}
        {!showPreview && history.length > 0 && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Recent Documents</h3>
              <button onClick={fetchHistory} className="text-xs text-blue-600 hover:underline">Refresh List</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((doc, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-2xl">{doc.isSigned ? "🔏" : "📄"}</span>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-gray-800 truncate">{doc.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">
                        {doc.isSigned ? "Signed" : "Original"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-xs font-bold"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      {!signature.value && (
        <div className={`fixed bottom-8 right-8 z-[100] bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 transition-all duration-300 ${isPadMinimized ? 'w-[200px]' : 'w-[400px]'}`}>
  
          {/* Move Padding here (p-6) only for the Header */}
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-gray-800">
                  {isPadMinimized ? "Sign" : "Create Your Signature"}
                </p>
                {!isPadMinimized && <span className="h-2 w-2 bg-red-500 rounded-full animate-ping"></span>}
              </div>

              <button 
                onClick={() => setIsPadMinimized(!isPadMinimized)}
                className="p-1 bg-red-500 hover:bg-red-600 rounded-md transition-colors text-white"
                title={isPadMinimized ? "Expand" : "Minimize"}
              >
                {isPadMinimized ? "+" : "-"}
              </button>
            </div>
          </div>

          {/* NO PADDING on this container for the canvas */}
          {!isPadMinimized && (
            <div key={`${pdfUrl}-${isPadMinimized}`} className="animate-in fade-in duration-300 px-6 pb-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <SignaturePad onSave={(data) => setSignature(data)} isPadMinimized={isPadMinimized}/>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home
