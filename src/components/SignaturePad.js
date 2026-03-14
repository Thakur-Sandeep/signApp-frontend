import React, { useEffect,useRef,useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
const SignaturePad = ({ onSave ,isPadMinimized }) => {
  const sigCanvas = useRef({});
  const [isTextMode, setIsTextMode] = useState(false);
  const [typedName, setTypedName] = useState("");

  const clear = () => sigCanvas.current.clear();
  useEffect(() => {
    if (!isTextMode) {
      const canvas = sigCanvas.current?.getCanvas();
      if (canvas) {
        const timer = setTimeout(() => {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          sigCanvas.current.clear();
        }, 350); 

        return () => clearTimeout(timer);
      }
    }
  }, [isTextMode, isPadMinimized]);

  const save = () => {
    if (isTextMode) {
      if (!typedName.trim()) {
        alert("Please type a name first.");
        return;
      }
      // Send text data to parent
      onSave({ type: 'text', value: typedName });
    } else {
      if (sigCanvas.current.isEmpty()) {
        alert("Please provide a signature first.");
        return;
      }
      // Send image data to parent
      const dataURL = sigCanvas.current.getCanvas().toDataURL('image/png');
      onSave({ type: 'image', value: dataURL });
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm w-full max-w-lg mx-auto">
      {/* 1. Toggle Buttons */}
      <div className="flex bg-gray-50 border-b border-gray-200">
        <button 
          onClick={() => setIsTextMode(false)}
          className={`flex-1 py-3 px-4 text-sm font-semibold transition-all ${
            !isTextMode 
              ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          🖌️ Draw
        </button>
        <button 
          onClick={() => setIsTextMode(true)}
          className={`flex-1 py-3 px-4 text-sm font-semibold transition-all ${
            isTextMode 
              ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          ⌨️ Type
        </button>
      </div>

      {/* 2. Conditional Input Area */}
      <div className="h-52 flex items-center justify-center p-4">
        {isTextMode ? (
          <input 
            type="text"
            placeholder="Type your signature..."
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            className="w-full text-4xl text-center bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none font-signature text-black-950 placeholder-gray-300 transition-colors"
          />
        ) : (
          <div className="w-full h-full border border-dashed border-gray-200 rounded-lg overflow-hidden bg-gray-50/50">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{ 
                className: 'sigCanvas w-full h-full cursor-crosshair' 
              }}
            />
          </div>
        )}
      </div>

      {/* 3. Control Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
        {!isTextMode && (
          <button onClick={clear} className="px-4 py-1.5 text-sm font-medium bg-red-500 text-black-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors">Clear</button>
        )}
        <button 
          onClick={save} 
          className="px-5 py-1.5 text-sm font-bold bg-green-500 hover:bg-blue-700 text-white rounded-md shadow-md active:scale-95 transition-all"
        >
          Use Signature
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;