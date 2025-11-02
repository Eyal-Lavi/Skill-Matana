import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectAdminError,
    selectAdminLoading,
    selectPendingSkillRequests } from '../features/admin/adminSelectors';
import { updateSkillRequestStatus } from '../features/admin/adminThunks';
import styles from './PendingSkillRequestsList.module.scss';

function PendingSkillRequestsList() {
    const requests = useSelector(selectPendingSkillRequests);
    console.log("requests");
    console.log(requests);
    const loading = useSelector(selectAdminLoading);
    const error = useSelector(selectAdminError);
    const dispatch = useDispatch();

    const handleClick = async (requestId, status) => {
        if ((status !== 'rejected' && status !== 'approved') || !requestId) {
            console.error('invalid request');
            return;
        }
        dispatch(updateSkillRequestStatus({ requestId, status }));
    }

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading requests...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorIcon}>⚠️</div>
                <p>{error}</p>
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <div className={styles.emptyIcon}>📋</div>
                <h3>No Pending Requests</h3>
                <p>All skill requests have been processed</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Pending Skill Requests</h2>
                <span className={styles.count}>{requests.length} request{requests.length !== 1 ? 's' : ''}</span>
            </div>
            
            <div className={styles.requestsList}>
                {requests.map(request => (
                    <div key={request.id} className={styles.requestCard}>
                        <div className={styles.requestInfo}>
                            <div className={styles.userInfo}>
                                <div className={styles.avatar}>
                                    {request.name ? request.name.charAt(0).toUpperCase() : 'S'}
                                </div>
                                <div className={styles.details}>
                                    <h3 className={styles.userName}>
                                        {request.requester 
                                            ? `${request.requester.firstName || ''} ${request.requester.lastName || ''}`.trim() || 'Unknown User'
                                            : `User ID: ${request.requestedBy || 'Unknown'}`}
                                    </h3>
                                    <p className={styles.requestId}>Request ID: {request.id}</p>
                                </div>
                            </div>
                            
                            {request.name && (
                                <div className={styles.skillInfo}>
                                    <span className={styles.skillLabel}>Skill:</span>
                                    <span className={styles.skillName}>{request.name}</span>
                                </div>
                            )}
                        </div>
                        
                        <div className={styles.actions}>
                            <button 
                                className={`${styles.actionButton} ${styles.rejectButton}`}
                                onClick={() => handleClick(request.id, 'rejected')}
                            >
                                <span className={styles.buttonIcon}>✕</span>
                                Reject
                            </button>
                            <button 
                                className={`${styles.actionButton} ${styles.approveButton}`}
                                onClick={() => handleClick(request.id, 'approved')}
                            >
                                <span className={styles.buttonIcon}>✓</span>
                                Approve
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PendingSkillRequestsList