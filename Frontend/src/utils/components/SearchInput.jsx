import { Search } from 'lucide-react';
import React, { useRef, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { selectSkillsData } from '../../features/metaData/MetaDataSelectors';
import SearchAPI from '../../features/search/SearchAPI';
import './SearchInput.scss';
import { searchUsers } from '../../features/search/SearchThunks';

export default function SearchInput() {
  const skills = useSelector(selectSkillsData);
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const handleClick = () => {
    const searchValue = inputRef.current?.value || '';
    const skillValue = selectedSkill?.value || '';
    if (!searchValue && !skillValue) return;

    dispatch(searchUsers({ name: searchValue, skillId: skillValue }));
    SearchAPI.search(searchValue, skillValue);
  };

  const skillOptions = Array.isArray(skills) ?skills.map(skill => ({
    value: skill.id,
    label: skill.name,
  })) : [{value:null,label:'No skills found'}];

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
