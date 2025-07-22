import React, { useState } from 'react';
import axios from 'axios';
import { Search as SerachIcon} from "lucide-react";
import styles from "./Search.module.scss";
import SearchInput from '../utils/components/SearchInput';

function Search() {
  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <SearchInput />
      </div>
    </div>
  );
}

export default Search;
