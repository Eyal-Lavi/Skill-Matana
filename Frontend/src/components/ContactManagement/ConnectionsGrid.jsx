import React, { useMemo } from 'react';
import ProfileCard from '../ProfileCard/ProfileCard';
import styles from './ContactManagement.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

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

  return (
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
          actionButton={{ text: 'Message', onClick: () => handleMessage(c) }}
        />
      ))}
    </div>
  );
};

export default ConnectionsGrid;
