import { Search } from 'lucide-react';
import React, { useRef, useState } from 'react';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { selectSkills } from '../../features/metaData/MetaDataSelectors';
import SearchAPI from '../../features/search/SearchAPI';
import './SearchInput.scss';

export default function SearchInput() {
  const skills = useSelector(selectSkills);
  const inputRef = useRef(null);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const handleClick = () => {
    const searchValue = inputRef.current?.value || '';
    const skillValue = selectedSkill?.value || '';
    if (!searchValue && !skillValue) return;

    SearchAPI.search(searchValue, skillValue);
  };

  const skillOptions = skills.map(skill => ({
    value: skill.id,
    label: skill.name,
  }));

  return (
    <div className="search-bar">
      <div className="select-wrapper">
        <Select
          options={skillOptions}
          isClearable
          placeholder="Skill"
          value={selectedSkill}
           isSearchable={!!selectedSkill} 
          onChange={setSelectedSkill}
          classNamePrefix="react-select"
        />
      </div>
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="Search..."
      />
      <button className="search-btn" onClick={handleClick}>
        <Search />
      </button>
    </div>
  );
}
