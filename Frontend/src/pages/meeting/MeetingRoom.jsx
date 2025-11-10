
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

export default function MeetingRoom() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {

        const url = `http://localhost:3000/meetings/${meetingId}/join-token`;
        const res = await fetch(url, { credentials: 'include' });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body?.error || 'Failed to get token');
        setData(body);
      } catch (e) {
        setError(e.message || 'Error');
      }
    })();
  }, [meetingId]);

  useEffect(() => {
    if (!data || !containerRef.current) return;
    const { appId, token, roomId, userId, userName } = data;

    if (!token) {
      throw new Error("token missing from server response");
    }

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      appId,
      token,
      roomId,
      userId,
      userName
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);

   
    const handleRoomLeft = () => {
      console.log('User left the room, navigating to notifications');
      navigate('/dashboard/notifications');
    };

   
    if (zp.on && typeof zp.on === 'function') {
      zp.on('leave', handleRoomLeft);
    }

    zp.joinRoom({
      container: containerRef.current,
      scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
      showPreJoinView: false,
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,
      showTextChat: true,
      showUserList: true,
      maxUsers: 2,
      layout: 'Auto',
      onLeaveRoom: handleRoomLeft, 
    });

    return () => {
      if (zp.off && typeof zp.off === 'function') {
        zp.off('leave', handleRoomLeft);
      }
      zp.destroy();
    };
  }, [data, meetingId, navigate]);

  if (error) return <div style={{ padding: 24 }}>Error: {error}</div>;
  return <div ref={containerRef} style={{ width: '100%', height: '90vh' }} />;
}
