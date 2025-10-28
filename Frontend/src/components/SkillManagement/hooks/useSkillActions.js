import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { updateSkillStatus } from '../../../features/admin/adminThunks';

export const useSkillActions = (onRefresh) => {
  const dispatch = useDispatch();

  const handleSkillStatusChange = useCallback(async (skillId, newStatus) => {
    try {
      await dispatch(updateSkillStatus({ skillId, status: newStatus })).unwrap();
      
      onRefresh();
    } catch (err) {
      throw new Error(err.message);
    }
  }, [dispatch, onRefresh]);

  const handleAddSkill = useCallback(async (skillName) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/skills/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ skillName })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add skill');
      }
      
      
      onRefresh();
    } catch (err) {
      throw new Error(err.message || 'Failed to add skill');
    }
  }, [onRefresh]);

  return {
    handleSkillStatusChange,
    handleAddSkill
  };
};
