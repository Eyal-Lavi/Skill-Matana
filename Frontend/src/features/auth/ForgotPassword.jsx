import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../../utils/components/Input';
import styles from "./LoginForm.module.scss";
import authAPI from './AuthAPI';

function ForgotPassword() {
    const {register , handleSubmit ,setError, clearErrors ,formState:{errors, isSubmitting}} = useForm({mode:'onChange'});
    const [succses , setSuccess] = useState();
    

    const onSubmit = async(formData) => {
        try{
            await authAPI.sendLinkReset(formData.email);
            setSuccess(true);
            clearErrors('email');
        }catch(error){
            setError("email", {
                type: "server",
                message: error.response?.data?.message || "Something went wrong",
              });
        }
    }
    if (succses) {return (<div className={styles.formContainer}><p className={styles.successText}>Link send successfuly to your inbox</p></div>)}
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