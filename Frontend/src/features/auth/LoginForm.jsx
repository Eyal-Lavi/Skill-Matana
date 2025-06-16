import { useState } from "react";
import Input from "../../utils/Input";
import styles from "./LoginForm.module.scss";
import { Link } from "react-router-dom";
export default function LoginForm() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit logic
    };
    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h2 className={styles.title}>Login Form</h2>
            <div className={styles.inputContainer}>
                <Input
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
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
