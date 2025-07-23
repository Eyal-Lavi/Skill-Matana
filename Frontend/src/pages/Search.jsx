import React, { useState } from 'react';
import axios from 'axios';
//import { Search as SerachIcon} from "lucide-react";
import "./Search.scss";
import SearchInput from '../utils/components/SearchInput';
import { ProfileCardDemo } from '../components/GlassmorphismProfileCard';

function Search() {
  return (
    <div className='container'>
      <SearchInput />
      <div className='search-results'>
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        <ProfileCardDemo />
        </div>
    </div>
  );
}

export default Search;
