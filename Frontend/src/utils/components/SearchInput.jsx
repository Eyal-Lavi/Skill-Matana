import { Search, X, Filter } from 'lucide-react';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { selectSkillsData } from '../../features/metaData/MetaDataSelectors';
import SearchAPI from '../../features/search/SearchAPI';
import useDebounce from '../../hooks/useDebounce';
import './SearchInput.scss';
import { searchUsers } from '../../features/search/SearchThunks';

export default function SearchInput() {
  const skills = useSelector(selectSkillsData);
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchValue = useDebounce(searchValue, 500);
  const debouncedSkillValue = useDebounce(selectedSkill?.value, 300);

  const performSearch = useCallback((name, skillId) => {
    if (!name && !skillId) return;
    
    setIsSearching(true);
    dispatch(searchUsers({ name: name || '', skillId: skillId || '' }));
    SearchAPI.search(name || '', skillId || '').finally(() => {
      setIsSearching(false);
    });
  }, [dispatch]);

  useEffect(() => {
    const hasSearchValue = debouncedSearchValue?.trim();
    const hasSkillValue = debouncedSkillValue;
    
    if (hasSearchValue || hasSkillValue) {
      performSearch(hasSearchValue || '', hasSkillValue || '');
    }
  }, [debouncedSearchValue, debouncedSkillValue, performSearch]);

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      performSearch(searchValue, selectedSkill?.value);
    }
  };

  const handleClear = () => {
    setSearchValue('');
    setSelectedSkill(null);
    inputRef.current?.focus();
  };

  const handleSkillChange = (selectedOption) => {
    setSelectedSkill(selectedOption);
  };

  const skillOptions = Array.isArray(skills) 
    ? skills.map(skill => ({
        value: skill.id,
        label: skill.name,
      })) 
    : [{ value: null, label: 'No skills found' }];

  const hasFilters = searchValue || selectedSkill;

  return (
    <div className="search-bar">
      <div className="search-container">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search by name..."
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
          />
          {searchValue && (
            <button 
              className="clear-btn" 
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="select-wrapper">
          <Filter className="filter-icon" size={18} />
          <Select
            options={skillOptions}
            isClearable
            placeholder="Filter by skill"
            value={selectedSkill}
            isSearchable
            onChange={handleSkillChange}
            classNamePrefix="react-select"
            className="skill-select"
          />
        </div>

        <button 
          className={`search-btn ${isSearching ? 'searching' : ''}`} 
          onClick={() => performSearch(searchValue, selectedSkill?.value)}
          disabled={isSearching}
          aria-label="Search"
        >
          {isSearching ? (
            <div className="spinner" />
          ) : (
            <Search size={20} />
          )}
        </button>
      </div>
      
      {hasFilters && (
        <div className="active-filters">
          {searchValue && (
            <span className="filter-tag">
              Name: {searchValue}
              <button onClick={() => setSearchValue('')}>×</button>
            </span>
          )}
          {selectedSkill && (
            <span className="filter-tag">
              Skill: {selectedSkill.label}
              <button onClick={() => setSelectedSkill(null)}>×</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
