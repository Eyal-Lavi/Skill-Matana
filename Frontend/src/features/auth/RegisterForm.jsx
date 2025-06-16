import { useState } from "react";
import Input from "../../utils/Input";
import styles from "./RegisterForm.module.scss";
import { Link } from "react-router-dom";
export default function RegisterForm() {
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
            <h2 className={styles.title}>Register Form</h2>
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
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
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
                Register
            </button>
            <p className={styles.linkText}>
                Already have account?{" "}
                <Link to="../login" className={styles.link}>
                    Login here
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