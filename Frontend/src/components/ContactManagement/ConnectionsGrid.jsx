import React from 'react';
import ProfileCard from '../ProfileCard/ProfileCard';
import styles from './ContactManagement.module.scss';

const ConnectionsGrid = ({ connections }) => {
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
          actionButton={{ text: 'Message', onClick: () => {} }}
        />
      ))}
    </div>
  );
};

export default ConnectionsGrid;
