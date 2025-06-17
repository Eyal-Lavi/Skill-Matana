import { useState } from "react";
import Input from "../../utils/Input";
import styles from "./LoginForm.module.scss";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {authActions} from './AuthSlices';
import authAPI from "./AuthAPI";
export default function LoginForm() {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        usernameOrMail: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const data = await authAPI.login({
                usernameOrEmail: formData.usernameOrMail,
                password: formData.password,
            });
            console.log("Login successful:", data);
            dispatch(authActions.loginSuccess(data.user));
            
        }catch(error){
            console.error("Login failed:", error);
            // Handle error (e.g., show a notification)
        }

        
    };
    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h2 className={styles.title}>Login Form</h2>
            <div className={styles.inputContainer}>
                <Input
                    label="Username Or Mail"
                    name="usernameOrMail"
                    value={formData.usernameOrMail}
                    onChange={handleChange}
                    placeholder="Enter your username or mail"
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                />
            </div>

            <button type="submit" className={styles.submitButton}>
                Login
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

            <img src="https://shorturl.at/AO2SW" alt="logo"style={{height: "120", width: "120px"}} />
        </form>
    )
}
