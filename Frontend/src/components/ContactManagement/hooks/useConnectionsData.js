import { useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectConnections } from '../../../features/auth/AuthSelectors';
import { useDebounce } from '../../../hooks';

export const useConnectionsData = () => {
  const allConnections = useSelector(selectConnections);

  const [filters, setFilters] = useState({
    search: '',
    status: null,
    sortBy: 'name',
    sortOrder: 'ASC',
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  const filtered = useMemo(() => {
    let data = Array.isArray(allConnections) ? [...allConnections] : [];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      data = data.filter(c => `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase().includes(q));
    }
    const dir = filters.sortOrder.toUpperCase() === 'DESC' ? -1 : 1;
    const actualSortBy = filters.sortBy === 'name' ? 'firstName' : filters.sortBy;
    data.sort((a, b) => {
      const av = (a[actualSortBy] || '').toString().toLowerCase();
      const bv = (b[actualSortBy] || '').toString().toLowerCase();
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
    return data;
  }, [allConnections, debouncedSearch, filters.sortBy, filters.sortOrder]);

  const handleFilterChange = useCallback((name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSearchChange = useCallback((value) => {
    setFilters(prev => ({ ...prev, search: value }));
  }, []);

  const handleSortChange = useCallback((name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ search: '', status: null, sortBy: 'name', sortOrder: 'ASC' });
  }, []);

  return {
    connections: filtered,
    total: allConnections?.length || 0,
    filters,
    handleFilterChange,
    handleSearchChange,
    handleSortChange,
    handleClearFilters,
  };
};
