import { useState } from "react";
import Input from "../../utils/components/Input";
import styles from "./LoginForm.module.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from './AuthSlices';
import authAPI from "./AuthAPI";
import { useForm } from "react-hook-form";
import Logo from "../../utils/components/Logo";
import { trimFormData } from "../../utils/helpers/trimFromData";
import MetaDataAPI from "../metaData/metaDataAPI";
import { metaDataActions } from "../metaData/MetaDataSlices";

export default function LoginForm() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState("");

    // Check if user just registered
    const justRegistered = location.state?.registered;

    const onSubmit = async (formData) => {
        setError("");
        try {
            const trimedData = trimFormData(formData);
            const data = await authAPI.login(trimedData);

            dispatch(authActions.login(data.user));

            try {
                const metaDataResponse = await MetaDataAPI.metaData();
                dispatch(metaDataActions.set(metaDataResponse));
            } catch (error) {
                console.log(error);
                dispatch(metaDataActions.set({
                    skills: [
                        { id: 1, name: "JavaScript" },
                        { id: 2, name: "Python" },
                        { id: 3, name: "Math" },
                        { id: 4, name: "SQL" },
                    ]
                }));
            }

            navigate("/dashboard");
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            setError(errorMessage || "Login failed. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>Welcome Back</h2>
                <p className={styles.subtitle}>Sign in to continue your learning journey</p>
            </div>

            {justRegistered && (
                <div className={styles.successBanner}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>Account created successfully! Please sign in.</span>
                </div>
            )}

            <div className={styles.inputContainer}>
                <Input
                    label="Username or Email"
                    {...register("usernameOrEmail", { required: true })}
                    placeholder="Enter your username or email"
                />
                <Input
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    {...register("password", { required: true })}
                />
            </div>

            {error && (
                <div className={styles.errorBanner}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            <button 
                type="submit" 
                disabled={isSubmitting} 
                className={`${styles.submitButton} ${isSubmitting ? styles.isSubmitting : ""}`}
            >
                {isSubmitting ? (
                    <span className={styles.loadingText}>
                        <span className={styles.spinner}></span>
                        Signing in...
                    </span>
                ) : (
                    "Sign In"
                )}
            </button>

            <div className={styles.divider}>
                <span>or</span>
            </div>

            <p className={styles.linkText}>
                Don't have an account?{" "}
                <Link to="../register" className={styles.link}>
                    Create one now
                </Link>
            </p>

            <p className={styles.linkText}>
                <Link to="../forgot-password" className={styles.forgotLink}>
                    Forgot your password?
                </Link>
            </p>

            <Logo size="xl-large" link={false} />
        </form>
    );
}
