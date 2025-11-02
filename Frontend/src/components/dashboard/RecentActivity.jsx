import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ActivityItem from "./ActivityItem";
import meetingsAPI from '../../services/meetingsAPI';
import style from "./RecentActivity.module.scss";

export default function RecentActivity() {
  const user = useSelector((s) => s.auth?.user);
  const navigate = useNavigate();
  const [activeMeetings, setActiveMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadActiveMeetings();
    }
  }, [user?.id]);

  const loadActiveMeetings = async () => {
    try {
      const response = await meetingsAPI.getMyMeetings('scheduled');
      const meetings = response?.meetings || [];
      
      
      const now = new Date();
      const active = meetings.filter(meeting => {
        const startTime = new Date(meeting.startTime);
        const endTime = new Date(meeting.endTime);
        return startTime <= now && endTime >= now;
      });
      
      setActiveMeetings(active);
    } catch (err) {
      console.error('Error loading active meetings:', err);
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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleJoinMeeting = (meetingId) => {
    navigate(`/meeting/${meetingId}`);
  };

  return (
    <div className={style.recentActivity}>
      <h2>Recent Activity</h2>
      {loading ? (
        <div className={style.loading}>Loading...</div>
      ) : activeMeetings.length > 0 ? (
        <div className={style.activityList}>
          {activeMeetings.map((meeting) => {
            const partner = getMeetingPartner(meeting);
            return (
              <div
                key={meeting.id}
                className={style.activeMeetingItem}
                onClick={() => handleJoinMeeting(meeting.id)}
              >
                <ActivityItem
                  icon="🔴"
                  title="Active Meeting"
                  description={`with ${partner?.firstName} ${partner?.lastName}`}
                  time={`${formatTime(meeting.startTime)} - ${formatTime(meeting.endTime)}`}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className={style.empty}>
          <p>No recent activity</p>
        </div>
      )}
    </div>
  );
}
