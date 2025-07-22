import React, { useState } from 'react';
import axios from 'axios';
import { Search as SerachIcon} from "lucide-react";
import "./Search.scss";
import SearchInput from '../utils/components/SearchInput';

function Search() {
  return (
    <div className='container'>
      <SearchInput />
    </div>
  );
}

export default Search;
