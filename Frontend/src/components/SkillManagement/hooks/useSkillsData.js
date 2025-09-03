import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../../../hooks';

export const useSkillsData = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    hasMore: true,
    total: 0
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: null,
    sortBy: 'name',
    sortOrder: 'ASC'
  });

  // Debounced search value
  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchSkills = useCallback(async (reset = false) => {
    if (reset) {
      setLoading(true);
      setPagination(prev => ({ ...prev, offset: 0, hasMore: true }));
    } else {
      setIsLoadingMore(true);
    }
    
    setError(null);
    
    try {
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: reset ? '0' : pagination.offset.toString(),
        search: debouncedSearch,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });

      if (filters.status !== null) {
        params.append('status', filters.status.toString());
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/skills/all?${params}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch skills');
      }
      
      const responseJson = await response.json();
      
      if (reset) {
        console.log(responseJson);
        
        setSkills(responseJson.data);
        setPagination(prev => ({
          ...prev,
          offset: responseJson.data.length,
          hasMore: responseJson.hasMore,
          total: responseJson.total
        }));
      } else {
        setSkills(prev => [...prev, ...responseJson.data]);
        setPagination(prev => ({
          ...prev,
          offset: prev.offset + responseJson.data.length,
          hasMore: responseJson.hasMore
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [debouncedSearch, filters.status, filters.sortBy, filters.sortOrder, pagination.limit, pagination.offset]);

  // Fetch skills when filters change
  useEffect(() => {
    fetchSkills(true);
  }, [debouncedSearch, filters.status, filters.sortBy, filters.sortOrder]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleSortChange = (sortName, value) => {
    setFilters(prev => ({ ...prev, [sortName]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: null,
      sortBy: 'name',
      sortOrder: 'ASC'
    });
  };

  const loadMore = useCallback(() => {
    if (!isLoadingMore && pagination.hasMore) {
      fetchSkills(false);
    }
  }, [isLoadingMore, pagination.hasMore, fetchSkills]);

  return {
    skills,
    loading,
    error,
    pagination,
    isLoadingMore,
    filters,
    fetchSkills,
    handleFilterChange,
    handleSearchChange,
    handleSortChange,
    handleClearFilters,
    loadMore
  };
};
