import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../../utils/components/Input';
import styles from "./LoginForm.module.scss";
import authAPI from './AuthAPI';

function ForgotPassword() {
    const {register , handleSubmit ,setError ,formState:{errors, isSubmitting}} = useForm();
    const [succses , setSuccess] = useState();
    

    const onSubmit = async(formData) => {
        try{
            await authAPI.sendLinkReset(formData.email);
            setSuccess(true);
            setError(null);
        }catch(error){
            setError(error.response?.data?.message || error.message);
        }
    }
    if (succses) {return <p>Link send successfuly to your inbox</p>}
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        <h2>Forgot Password</h2>
        <Input label='Email'
            type='email'
            {...register('email' , {required:'Email is required' , 
                pattern:{
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message:'Invalid email format'
                }
            })}
            placeholder="Enter your email..."
            error={errors.email}
        />
        <button type='submit' disabled={isSubmitting} className={styles.submitButton}>
            {isSubmitting ? 'Submitting...' : 'Send Reset Link'}
        </button>
    </form>
  )
}

export default ForgotPassword