import React from 'react';
import { useForm } from 'react-hook-form';
import styles from "./LoginForm.module.scss";
import Input from '../../utils/components/Input';
import authAPI from './AuthAPI';

function ResetPassword() {
    const {register , handleSubmit , formState:{ isSubmitting }} = useForm();

    const onSubmit = async(formData) => {
        try{
            
        }catch(error){

        }
    }
    
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        <h2>Reset Password</h2>
        <Input label='New Password'
            {...register('new password')}   
            placeholder='Enter your new password...'
            requierd 
        />
        <Input label='Confirm Password'
            {...register('confirm password')}
            placeholder='Confirm your new password...'
            requierd
        />
        <button disabled={isSubmitting} className={styles.submitButton}>
            {isSubmitting ? 'Sending...' : 'Reset'}
        </button>
    </form>
  )
}

export default ResetPassword