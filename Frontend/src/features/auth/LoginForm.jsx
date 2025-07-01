import { useState } from "react";
import Input from "../../utils/Input";
import styles from "./LoginForm.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from './AuthSlices';
import authAPI from "./AuthAPI";
import { useForm } from "react-hook-form";
import Logo from "../../utils/Logo";

export default function LoginForm() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState([]);

    const onSubmit = async (formData) => {
          try {
            const data = await authAPI.login(formData);
            console.log("Login successful:");
            dispatch(authActions.login(data.user));
            navigate("/dashboard");
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            setError(errorMessage || "Login failed");
        }
    };
  
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
            <h2 className={styles.title}>Login Form</h2>
            <div className={styles.inputContainer}>
                <Input
                    label="Username Or Email"
                    {...register("usernameOrEmail")}
                    placeholder="Enter your username or email"
                    required
                />
                <Input
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    {...register("password")}
                    required
                />
            </div>
            {error.length > 0 && <p className={styles.errorText}>{error}</p>}
            <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                    {isSubmitting ? "Submitting..." : "Login"}
            </button>
            <p className={styles.linkText}>
                Not registered yet?{" "}
                <Link to="../register" className={styles.link}>
                    Create an account
                </Link>
            </p>
            <p className={styles.linkText}>
                Forgot your password?{" "}
                <a href="/reset-password" className={styles.link}>
                    Reset it
                </a>
            </p>
          <Logo size="xl-large" link={false}/>
        </form>
    )
}
