import { useForm } from "react-hook-form";
import Input from "../../utils/Input";
import Select from "../../utils/Select";
import styles from "./RegisterForm.module.scss";
import { Link, useNavigate } from "react-router-dom";
import authAPI from "./AuthAPI";
import Logo from "../../utils/Logo";

export default function RegisterForm() {
  const { register, handleSubmit , setError , formState: {errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      
      const data = await authAPI.register(formData);
      console.log("Register successfuly", data);
      navigate('/auth/login');
    } catch (error) {
      console.error("register failed:", error);
      setError()
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <h2 className={styles.title}>Register Form</h2>

      <div className={styles.inputContainer}>
        <Input
          label="Username"
          placeholder="Enter your username"
          {...register("username")}
          required
        />
        <Input
          label="Email"
          placeholder="Enter your email"
          {...register("email")}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          {...register("password")}
          required
          minLength={8}
        />
        <Input
          label="First Name"
          placeholder="Enter your first name"
          {...register("firstname")}
          required
        />
        <Input
          label="Last Name"
          placeholder="Enter your last name"
          {...register("lastname")}
          required
        />
        <Select
          label="Gender"
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" }
          ]}
          {...register("gender")}
          required
        />
      </div>

      <button
        type="submit"
        className={`${styles.submitButton} ${isSubmitting ? styles.isSubmited : ""}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Register"}
      </button>

      <p className={styles.linkText}>
        Already have account?{" "}
        <Link to="../login" className={styles.link}>Login here</Link>
      </p>

      <p className={styles.linkText}>
        Forgot your password?{" "}
        <a href="/reset-password" className={styles.link}>Reset it</a>
      </p>
      <Logo size="xl-large" link={false}/>
    </form>
  );
}
