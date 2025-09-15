// client/src/pages/MeetingRoom.jsx
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

export default function MeetingRoom() {
  const { meetingId } = useParams();
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
      token,     // זה ה-Token04 שמגיע מהשרת (מתחיל ב-"04")
      roomId,
      userId,
      userName
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: containerRef.current,
      scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
      showPreJoinView: true,
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,
      // Built-in text chat and user list
      showTextChat: true,
      showUserList: true,
      // Share link
      sharedLinks: [{ name: 'Meeting Link', url: `${window.location.origin}/meeting/${meetingId}` }],
      // Basic permissions
      maxUsers: 12,
      layout: 'Auto',
    });

    return () => zp.destroy();
  }, [data, meetingId]);

  if (error) return <div style={{ padding: 24 }}>Error: {error}</div>;
  return <div ref={containerRef} style={{ width: '100%', height: '90vh' }} />;
}
