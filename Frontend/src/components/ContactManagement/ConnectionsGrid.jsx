import React, { useMemo, useState } from 'react';
import ProfileCard from '../ProfileCard/ProfileCard';
import styles from './ContactManagement.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ScheduleDialog from './ScheduleDialog';

const ConnectionsGrid = ({ connections }) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth?.user);

  const currentUserId = currentUser?.id || 'dev-user';
  const currentUserName = useMemo(() => {
    const full = `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim();
    return full || currentUser?.username || 'Dev User';
  }, [currentUser]);

  const buildMeetingId = (otherId) => {
    try {
      const a = String(currentUserId);
      const b = String(otherId);
      return `room_${[a, b].sort().join('_')}`;
    } catch {
      return `room_${Date.now()}`;
    }
  };

  const handleMessage = (other) => {
    const meetingId = buildMeetingId(other.id);
    const params = new URLSearchParams({ userId: String(currentUserId), userName: currentUserName });
    navigate(`/meeting/${encodeURIComponent(meetingId)}?${params.toString()}`);
  };

  const [scheduleUser, setScheduleUser] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const openSchedule = (other) => {
    setScheduleUser(other);
    setDialogOpen(true);
  };

  const onScheduled = (meeting) => {
    if (meeting?.id) {
      navigate(`/meeting/${meeting.id}`);
    }
    else if (meeting?.roomId) {
      debugger;
      alert('נקבע שיעור ונשלח מייל לשני הצדדים.');
      navigate(`/meeting/${meeting.roomId}`);
    }
  };

  const handleSchedule = async (other) => {
    try {
      // 1) Fetch availability for this user
      const availRes = await fetch(`http://localhost:3000/availability/${other.id}`, {
        credentials: 'include',
      });
      const availBody = await availRes.json();
      if (!availRes.ok) throw new Error(availBody?.error || 'Failed to load availability');

      const avail = Array.isArray(availBody?.availability) ? availBody.availability : [];
      if (avail.length === 0) {
        // Subscribe to alerts
        const subRes = await fetch(`http://localhost:3000/availability/alerts/${other.id}`, {
          method: 'POST',
          credentials: 'include',
        });
        if (!subRes.ok) throw new Error('אין זמינות — נרשמתי להתראות כשיתפנה זמן');
        alert('אין זמינות כרגע. הפעלתי התראה למייל כשתתווסף זמינות.');
        return;
      }

      // 2) Simple: pick first available slot and schedule
      const slot = avail[0];
      const schedRes = await fetch('http://localhost:3000/meetings/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ targetUserId: other.id, availabilityId: slot.id }),
      });
      const schedBody = await schedRes.json();
      if (!schedRes.ok) throw new Error(schedBody?.error || 'Failed to schedule');

      const meeting = schedBody?.meeting;
      if (meeting?.id) {
        alert('נקבע שיעור ונשלח מייל לשני הצדדים.');
        navigate(`/meeting/${meeting.id}`);
      } else {
        alert('נקבע שיעור בהצלחה.');
      }
    } catch (e) {
      alert(e.message || 'שגיאה בקביעת שיעור');
    }
  };

  return (
    <>
      <div className={styles.skillsGrid}>
        {connections.map((c) => (
          <ProfileCard
            key={c.id}
            avatarUrl={c.profilePicture}
            name={`${c.firstName || ''} ${c.lastName || ''}`.trim()}
            title={''}
            skills={[]}
            bio={''}
            socialLinks={[]}
            actionButton={{ text: 'Join metting', onClick: () => handleMessage(c) }}
            extraActions={[{ text: 'Schedule', onClick: () => openSchedule(c) }]}
          />
        ))}
      </div>

      <ScheduleDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        targetUser={scheduleUser}
        onScheduled={onScheduled}
      />
    </>
  );
};

export default ConnectionsGrid;

// Modal render
export function ConnectionsGridWithDialog(props) {
  return (
    <>
      <ConnectionsGrid {...props} />
    </>
  );
}
