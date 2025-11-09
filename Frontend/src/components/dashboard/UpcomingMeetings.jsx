import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import meetingsAPI from '../../services/meetingsAPI';
import style from "./UpcomingMeetings.module.scss";

export default function UpcomingMeetings() {
  const user = useSelector((s) => s.auth?.user);
  const navigate = useNavigate();
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadUpcomingMeetings();
    }
  }, [user?.id]);

  const loadUpcomingMeetings = async () => {
    try {
      const response = await meetingsAPI.getMyMeetings('scheduled');
      const meetings = response?.meetings || [];
      
      const now = new Date();
      const upcoming = meetings
        .filter(meeting => {
          const startTime = new Date(meeting.startTime);
          return startTime > now;
        })
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
        .slice(0, 5); // Show only next 5 meetings
      
      setUpcomingMeetings(upcoming);
    } catch (err) {
      console.error('Error loading upcoming meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMeetingPartner = (meeting) => {
    const currentUserId = user?.id;
    if (currentUserId === meeting.host?.id) {
      return meeting.guest;
    }
    return meeting.host;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    const dateStr = isToday 
      ? 'Today' 
      : isTomorrow 
      ? 'Tomorrow' 
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    
    return { dateStr, timeStr };
  };

  const handleMeetingClick = (meetingId) => {
    navigate(`/dashboard/notifications`);
  };

  if (loading) {
    return (
      <div className={style.upcomingMeetings}>
        <h2>Upcoming Meetings</h2>
        <div className={style.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={style.upcomingMeetings}>
      <div className={style.header}>
        <h2>Upcoming Meetings</h2>
        {upcomingMeetings.length > 0 && (
          <button 
            className={style.viewAllButton}
            onClick={() => navigate('/dashboard/notifications')}
          >
            View All
          </button>
        )}
      </div>
      
      {upcomingMeetings.length === 0 ? (
        <div className={style.empty}>
          <p>No upcoming meetings</p>
          <p className={style.emptySubtext}>
            Schedule a meeting to see it here
          </p>
        </div>
      ) : (
        <div className={style.meetingsList}>
          {upcomingMeetings.map((meeting) => {
            const partner = getMeetingPartner(meeting);
            const { dateStr, timeStr } = formatDateTime(meeting.startTime);
            
            return (
              <div
                key={meeting.id}
                className={style.meetingCard}
                onClick={() => handleMeetingClick(meeting.id)}
              >
                <div className={style.meetingIcon}>📅</div>
                <div className={style.meetingInfo}>
                  <h3>{partner?.firstName} {partner?.lastName}</h3>
                  <div className={style.meetingTime}>
                    <span className={style.date}>{dateStr}</span>
                    <span className={style.time}>{timeStr}</span>
                  </div>
                </div>
                <div className={style.meetingArrow}>→</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

