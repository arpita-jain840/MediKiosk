import { useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function RoughInputTest() {
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [serverReply, setServerReply] = useState("");
  const [loading, setLoading] = useState(false);

  // References audio stream aur recorder ko hold karne ke liye
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 1. Text Submission
  const handleSendText = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/ingest/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer test-user-token",
        },
        body: JSON.stringify({ text, session_id: "test_session" }),
      });
      const data = await res.json();
      setServerReply(data.reply || JSON.stringify(data));
    } catch (err) {
      setServerReply("Error: Server se connect nahi ho paya.");
    } finally {
      setLoading(false);
    }
  };

  // Image Submission
  const sendImageToBackend = async (imageFile: File) => {
    setLoading(true);
    setServerReply("Image upload & Gemini Vision processing...");

    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("session_id", "image_session_101");

      const res = await fetch("http://127.0.0.1:8000/ingest/image", {
        method: "POST",
        headers: {
          Authorization: "Bearer test-user-token",
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setServerReply(data.detail || "Image processing failed.");
        return;
      }

      setServerReply(data.reply || JSON.stringify(data));
    } catch (err) {
      setServerReply("Error: Image process nahi ho paya.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Clear Audio Recording Start
  const startRecording = async () => {
    try {
      // Clear audio constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Microphone hardware release karein
        stream.getTracks().forEach((track) => track.stop());

        // Chunks ko ek complete audio file mein assemble karein
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await sendAudioToBackend(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setServerReply("Listening... Bolna shuru karein.");
    } catch (err) {
      setServerReply("Error: Mic permission denied ya error.");
    }
  };

  // 3. Audio Recording Stop
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // 4. Send Audio to /voice/process
  const sendAudioToBackend = async (audioBlob: Blob) => {
    setLoading(true);
    setServerReply("Audio upload & processing...");

    try {
      const formData = new FormData();
      // "file" wahi field name hai jo routers/voice_routes.py mein File(...) parameter hai
      formData.append("file", audioBlob, "user_voice.webm");
      formData.append("session_id", "voice_session_101");

      const res = await fetch("http://127.0.0.1:8000/ingest/voice", {
        method: "POST",
        headers: {
          "Authorization": "Bearer test-user-token",
          // Note: Content-Type yahan mat lagana, browser boundary khud handle karega
        },
        body: formData,
      });

      const data = await res.json();
      setServerReply(data.reply || JSON.stringify(data));
    } catch (err) {
      setServerReply("Error: Voice process nahi ho paya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Terminal 01</span>
          <h2 className="text-lg font-bold text-gray-800 mt-1">Patient Intake Kiosk</h2>
        </div>
        <Link
          to="/"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition flex items-center gap-1 shadow-xs"
        >
          Doctor Portal &rarr;
        </Link>
      </div>

      <div className="space-y-4">
        {/* Text Input */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">TEXT INPUT</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type symptoms or query..."
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-blue-500"
          />
        </div>

        {/* Mic & Image Controls */}
        <div className="flex gap-2">
          {/* Mic Button: Click to start / Click again to stop & send */}
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={loading}
            className={`flex-1 py-2 text-sm rounded-lg font-medium border transition cursor-pointer ${
              isRecording
                ? "bg-red-500 text-white border-red-500 animate-pulse"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {isRecording ? "⏹ Stop & Send" : "🎤 Speak"}
          </button>

          {/* Camera / Image Upload */}
          <label className="flex-1 py-2 text-sm text-center rounded-lg font-medium bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 cursor-pointer">
            📷 {selectedImage ? "Image Chosen" : "Image / Cam"}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedImage(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>

        {selectedImage && (
  <>
    <p className="text-xs text-green-600 truncate">
      Selected: {selectedImage.name}
    </p>

    <button
      type="button"
      onClick={() => sendImageToBackend(selectedImage)}
      disabled={loading}
      className="w-full py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 cursor-pointer"
    >
      {loading ? "Analyzing..." : " Analyze Image"}
    </button>
  </>
)}

        {/* Send Action for Text */}
        <button
          onClick={handleSendText}
          disabled={loading || !text.trim()}
          className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer"
        >
          {loading ? "Sending..." : "Send Text Query"}
        </button>
      </div>

      {/* Server Response Box */}
      {serverReply && (
        <div className="mt-5 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="text-xs font-bold text-gray-500 block mb-1">BACKEND REPLY:</span>
          <p className="text-sm text-gray-800">{serverReply}</p>
        </div>
      )}
    </div>
  );
}