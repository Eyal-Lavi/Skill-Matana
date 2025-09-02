import axios from 'axios';
import {useRef, useState} from 'react';
import { useSelector } from 'react-redux';
import {selectUserId} from './AuthSelectors';
const API_BASE_URL = import.meta.env.VITE_API_URL;

function AddSkillRequest() {
    const input = useRef();
    const userId = useSelector(selectUserId);
    const [error , setError] = useState(false); 
    const [loading , setLoading] = useState(false); 
    const [succses , setSuccses] = useState(false); 
    const handelClick = async() => {
        const name = input.current.value.trim();
        if(!name || name.lenght < 2){
            setError('enter name');
            return;
        }
        setError(false);
        setLoading(true);
        try{
            const response = await axios.post(`${API_BASE_URL}/skills/skill-requests` , {
                name,
                requestedBy:userId
            },{withCredentials:true});
            setLoading(false);
            setSuccses(true);
        }catch(e){
            console.log(e.response?.data?.message || e.message);
            setLoading(false);
            setSuccses(false);
            setError(e.response?.data?.message || e.message);
        }
        
    }
  return (
    <div>
        <input ref={input} type='text' placeholder='enter the skill request'/>
        <button onClick={handelClick}>{loading ? 'Loading...' : 'send'}</button>
        {succses && <p>Your request send in succses</p>}
        {error && <p>{error}</p>}
    </div>
  )
}

export default AddSkillRequest