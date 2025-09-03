import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from "./LoginForm.module.scss";
import Input from '../../utils/components/Input';
import authAPI from './AuthAPI';
import { useNavigate } from 'react-router-dom';

function ResetPassword({token}) {
    const {register , handleSubmit , watch , formState:{errors , isSubmitting }} = useForm();
    const [isSuccess , setIsSuccess] = useState(false);
    const [errorMessage , setErrorMessage] = useState('');
    const navigate = useNavigate();

    const onSubmit = async(formData) => {
        try{
            const result = await authAPI.resetPassord(token , formData.newPassword);
            setIsSuccess(true);

            setTimeout(() =>{
                navigate('/auth/login' , {replace:true});
            }, 1500);

        }catch(error){
            console.error(error);
            setErrorMessage(error.response?.data?.message || 'Failed to reset password');
            setIsSuccess(false);
        }
    }
    
    const newPassword = watch('newPassword');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        <h2>Reset Password</h2>
        <Input label='New Password'
            {...register('newPassword' ,{minLength: {
            value:8,
            message:"Password must be at least 8 characters long"
          } , required : "Password is required",
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$/,
              message:"Password must contain at least one uppercase letter, one lowercase letter, and one special character",
            }
          })}   
            placeholder='Enter your new password...'
            required 
            error={errors.newPassword} 
        />
        <Input label='Confirm Password'
            {...register('confirmPassword' , {
                required:'Pleas confirm your password',
                validate: (value) => {
                   return value === newPassword || 'Password do not match'
                }
            })}
            placeholder='Confirm your new password...'
            required
            error={errors.confirmPassword}
        />
        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
        {isSuccess && <p className={styles.successText}>Password reset successfully! Redirecting to login...</p>}
        <button disabled={isSubmitting} className={styles.submitButton}>
            {isSubmitting ? 'Sending...' : 'Reset'}
        </button>
    </form>
  )
}

export default ResetPassword