import { Search } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import styles from './SearchInput.module.scss'
import { metaDataActions } from '../../features/metaData/MetaDataSlices';
import { useSelector } from 'react-redux';
import { selectSkills } from '../../features/metaData/MetaDataSelectors';

export default function SearchInput() {
  const skills = useSelector(selectSkills);
  const inputRef = useRef(null);
  const selectRef = useRef(null);

  useEffect(() => {
    
  }, []);

  const handleClick = () => {
    const searchValue = inputRef.current?.value || '';
    const filter = selectRef.current?.value || '';
    console.log('Search:', searchValue);
    console.log('Filter:', filter);
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={handleClick}>
        <Search />
      </button>
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        placeholder="Search..."
      />
      <select ref={selectRef} className={styles.select}>
        {skills.map(skill => (
          <option key={skill.id} value={skill.id}>
            {skill.name}
          </option>
        ))}
      </select>
    </div>
  );
}
