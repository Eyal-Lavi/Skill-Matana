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


  const handleJoinMetting = async (other) => {
    try {
      const response = await fetch(`http://localhost:3000/meetings/get-meeting-id?otherId=${other.id}`, { credentials: 'include' });
      if (!response.ok) {
        throw new Error(response.error || 'Failed to get meeting ID')
      }
      const body = await response.json();

      const roomId = body?.roomId;

      if (!roomId) throw new Error('No roomId returned from server');

      navigate(`/meeting/${meeting.id}`);
    } catch (e) {
      console.error(e);
    }

  };

  const [scheduleUser, setScheduleUser] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const openSchedule = (other) => {
    setScheduleUser(other);
    setDialogOpen(true);
  };

  const onScheduled = (meeting) => {
    if (meeting?.roomId) {
      alert('נקבע שיעור ונשלח מייל לשני הצדדים.');
    }
  };

  // const handleSchedule = async (other) => {
  //   try {
  //     // 1) Fetch availability for this user
  //     const availRes = await fetch(`http://localhost:3000/availability/${other.id}`, {
  //       credentials: 'include',
  //     });
  //     const availBody = await availRes.json();
  //     if (!availRes.ok) throw new Error(availBody?.error || 'Failed to load availability');

  //     const avail = Array.isArray(availBody?.availability) ? availBody.availability : [];
  //     if (avail.length === 0) {
  //       // Subscribe to alerts
  //       const subRes = await fetch(`http://localhost:3000/availability/alerts/${other.id}`, {
  //         method: 'POST',
  //         credentials: 'include',
  //       });
  //       if (!subRes.ok) throw new Error('אין זמינות — נרשמתי להתראות כשיתפנה זמן');
  //       alert('אין זמינות כרגע. הפעלתי התראה למייל כשתתווסף זמינות.');
  //       return;
  //     }

  //     // 2) Simple: pick first available slot and schedule
  //     const slot = avail[0];
  //     const schedRes = await fetch('http://localhost:3000/meetings/schedule', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       credentials: 'include',
  //       body: JSON.stringify({ targetUserId: other.id, availabilityId: slot.id }),
  //     });
  //     const schedBody = await schedRes.json();
  //     if (!schedRes.ok) throw new Error(schedBody?.error || 'Failed to schedule');

  //     const meeting = schedBody?.meeting;
  //     if (meeting?.id) {
  //       alert('נקבע שיעור ונשלח מייל לשני הצדדים.');
  //       navigate(`/meeting/${meeting.id}`);
  //     } else {
  //       alert('נקבע שיעור בהצלחה.');
  //     }
  //   } catch (e) {
  //     alert(e.message || 'שגיאה בקביעת שיעור');
  //   }
  // };

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
            actionButton={c.roomId ? { text: 'Join metting', onClick: () => handleJoinMetting(c) } : null}
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
// export function ConnectionsGridWithDialog(props) {
//   return (
//     <>
//       <ConnectionsGrid {...props} />
//     </>
//   );
// }
