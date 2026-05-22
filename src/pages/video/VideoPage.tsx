import { useState, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor } from "lucide-react";

export default function VideoPage() {
  const [callStarted, setCallStarted] = useState(false);
  const [audioOn, setAudioOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const screenVideoRef = useRef<HTMLVideoElement>(null);

  const startScreenShare = async () => {
    try {
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: true,
      });
      setScreenStream(stream);
      setScreenSharing(true);
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = stream;
        screenVideoRef.current.play();
      }
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        setScreenSharing(false);
        setScreenStream(null);
      });
    } catch (err) {
      console.error("Screen share error:", err);
      setScreenSharing(false);
    }
  };

  const stopScreenShare = () => {
    screenStream?.getTracks().forEach((t) => t.stop());
    setScreenSharing(false);
    setScreenStream(null);
  };

  const endCall = () => {
    setCallStarted(false);
    stopScreenShare();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Video Call</h1>

      {/* Video grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Your feed */}
        <div className="h-72 bg-gray-900 flex flex-col items-center justify-center text-white rounded-lg relative overflow-hidden">
          <Video size={32} className="mb-2 opacity-40" />
          <span className="text-sm opacity-70">
            {videoOn && callStarted ? "Your Video Feed" : "Camera Off"}
          </span>
          {callStarted && (
            <span className="absolute top-2 left-2 text-xs bg-black/50 px-2 py-0.5 rounded">
              You
            </span>
          )}
        </div>

        {/* Participant feed */}
        <div className="h-72 bg-gray-800 flex flex-col items-center justify-center text-white rounded-lg relative overflow-hidden">
          <Video size={32} className="mb-2 opacity-40" />
          <span className="text-sm opacity-70">
            {callStarted ? "Participant Video Feed" : "Waiting for call…"}
          </span>
          {callStarted && (
            <span className="absolute top-2 left-2 text-xs bg-black/50 px-2 py-0.5 rounded">
              Participant
            </span>
          )}
        </div>

        {/* Screen share */}
        <div className="h-72 bg-gray-700 flex flex-col items-center justify-center text-white rounded-lg relative overflow-hidden">
          {screenSharing ? (
            <video
              ref={screenVideoRef}
              className="w-full h-full object-cover rounded-lg"
              autoPlay
              muted
            />
          ) : (
            <>
              <Monitor size={32} className="mb-2 opacity-40" />
              <span className="text-sm opacity-70">Screen Not Shared</span>
            </>
          )}
          {screenSharing && (
            <span className="absolute top-2 left-2 text-xs bg-black/50 px-2 py-0.5 rounded">
              Screen Share
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        {/* Start / End */}
        {!callStarted ? (
          <button
            onClick={() => setCallStarted(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Video size={18} />
            Start Call
          </button>
        ) : (
          <button
            onClick={endCall}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <PhoneOff size={18} />
            End Call
          </button>
        )}

        {/* Mute */}
        <button
          onClick={() => setAudioOn((v) => !v)}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            audioOn
              ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
              : "bg-red-100 hover:bg-red-200 text-red-700"
          }`}
        >
          {audioOn ? <Mic size={18} /> : <MicOff size={18} />}
          {audioOn ? "Mute" : "Unmute"}
        </button>

        {/* Camera */}
        <button
          onClick={() => setVideoOn((v) => !v)}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            videoOn
              ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
              : "bg-red-100 hover:bg-red-200 text-red-700"
          }`}
        >
          {videoOn ? <Video size={18} /> : <VideoOff size={18} />}
          {videoOn ? "Stop Video" : "Start Video"}
        </button>

        {/* Screen share */}
        <button
          onClick={() => (screenSharing ? stopScreenShare() : startScreenShare())}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            screenSharing
              ? "bg-blue-100 hover:bg-blue-200 text-blue-700"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          <Monitor size={18} />
          {screenSharing ? "Stop Sharing" : "Share Screen"}
        </button>
      </div>
    </div>
  );
}