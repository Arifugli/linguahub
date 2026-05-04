import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff,
  Maximize2,
  Minimize2,
  Monitor
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface VideoPanelProps {
  localStream?: MediaStream | null;
  remoteStream?: MediaStream | null;
  localUser?: {
    name: string;
    avatar?: string;
  };
  remoteUser?: {
    name: string;
    avatar?: string;
  };
  onEndCall?: () => void;
  isConnected?: boolean;
}

export const VideoPanel: React.FC<VideoPanelProps> = ({
  localStream,
  remoteStream,
  localUser = { name: 'Вы' },
  remoteUser = { name: 'Участник' },
  onEndCall,
  isConnected = false
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
        
        screenStream.getVideoTracks()[0].onended = () => {
          if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
          }
          setIsScreenSharing(false);
        };
      } else {
        if (localVideoRef.current && localStream) {
          localVideoRef.current.srcObject = localStream;
        }
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  return (
    <div className={`flex flex-col bg-background rounded-lg border ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'}`}>
      <div className="flex items-center justify-between p-2 border-b">
        <span className="text-sm font-medium">Видеосвязь</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-1 gap-2 p-2">
        {/* Remote Video (Main) */}
        <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Avatar className="h-20 w-20 mb-2">
                <AvatarImage src={remoteUser.avatar} />
                <AvatarFallback className="text-2xl">
                  {remoteUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {isConnected ? 'Ожидание видео...' : 'Ожидание подключения...'}
              </span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {remoteUser.name}
          </div>
        </div>

        {/* Local Video (PiP) */}
        <div className="relative bg-muted rounded-lg overflow-hidden aspect-video max-h-32">
          {localStream && isVideoEnabled ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Avatar className="h-12 w-12">
                <AvatarImage src={localUser.avatar} />
                <AvatarFallback>
                  {localUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
            {localUser.name}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 p-3 border-t">
        <Button
          variant={isVideoEnabled ? 'outline' : 'destructive'}
          size="icon"
          onClick={toggleVideo}
        >
          {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
        </Button>
        <Button
          variant={isAudioEnabled ? 'outline' : 'destructive'}
          size="icon"
          onClick={toggleAudio}
        >
          {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        </Button>
        <Button
          variant={isScreenSharing ? 'default' : 'outline'}
          size="icon"
          onClick={toggleScreenShare}
        >
          <Monitor className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={onEndCall}
        >
          <PhoneOff className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
