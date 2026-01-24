import React, { useMemo, useState } from 'react';
import ProfileCard from '../ProfileCard/ProfileCard';
import styles from './ContactManagement.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ScheduleDialog from './ScheduleDialog';
import { useConnectionActions } from './hooks/useConnectionActions';
import { authActions } from '../../features/auth/AuthSlices';
import { useToast } from '../../contexts/ToastContext';

const ConnectionsGrid = ({ connections }) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch();
  const { handleDisconnectConnection } = useConnectionActions();
  const toast = useToast();


  const handleJoinMetting = async (other) => {
    try {
      const response = await fetch(`http://localhost:3000/meetings/get-meeting-id?otherId=${other.id}`, { credentials: 'include' });
      if (!response.ok) {
        throw new Error(response.error || 'Failed to get meeting ID')
      }
      const body = await response.json();

      const roomId = body?.roomId;

      if (!roomId) throw new Error('No roomId returned from server');

      navigate(`/meeting/${roomId}`);
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
      toast.success('Meeting scheduled. An email was sent to both parties.');
    }
  };

  const handleDisconnect = async (otherUserId) => {
    try {
      await handleDisconnectConnection(otherUserId);
      dispatch(authActions.removeConnection(otherUserId));
    } catch (e) {
      console.error(e);
      toast.error(e?.message || "We couldn't disconnect this connection.");
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
            actionButton={c.roomId ? { text: 'Join metting', onClick: () => handleJoinMetting(c) } : null}
            extraActions={[
              { text: 'Schedule', onClick: () => openSchedule(c) },
              { text: 'Disconnect', onClick: () => handleDisconnect(c.id), variant: 'danger' },
            ]}
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

