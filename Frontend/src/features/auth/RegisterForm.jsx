import { useForm } from "react-hook-form";
import Input from "../../utils/components/Input";
import Select from "../../utils/components/Select";
import styles from "./RegisterForm.module.scss";
import { Link, useNavigate } from "react-router-dom";
import authAPI from "./AuthAPI";
import Logo from "../../utils/components/Logo";
import { trimFormData } from "../../utils/helpers/trimFromData"; 

export default function RegisterForm() {
  const { register, handleSubmit , setError , formState: {errors, isSubmitting } } = useForm({mode:'onTouched'});
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      const trimedData = trimFormData(formData);
      const data = await authAPI.register(trimedData);
      navigate("/auth/login");
    } catch (error) {
      const res = error?.response?.data;

      if (res?.errors) {
        res.errors.forEach((err) => {
          if (err.type === "field") {
            setError(err.field, {
              type: "server",
              message: err.message,
            });
          } else if (err.type === "global") {
            setError("root.serverError", {
              type: "server",
              message: err.message,
            });
          }
        });
      }else{
        setError("root.serverError",{
          type:"server",
          message:"Something went wrong. Please try again later."
        });
      }
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <h2 className={styles.title}>Register Form</h2>

      <div className={styles.inputContainer}>
        <Input
          label="Username"
          placeholder="Enter your username"
          {...register("username" , {required : "Username is required" , minLength:{
            value:2,
            message:"Username must be at least 2 characters"
          }})}
          error={errors.username}
        />
        <Input
          label="Email"
          placeholder="Enter your email"
          {...register("email" , {required : "Email is required" ,
            pattern: {
              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message:"Invalid email format"
            }
          })}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          {...register("password" , {minLength: {
            value:8,
            message:"Password must be at least 8 characters long"
          } , required : "Password is required",
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$/,
              message:"Password must contain at least one uppercase letter, one lowercase letter, and one special character",
            }
          })}
          error={errors.password}
        />
        <Input
          label="First Name"
          placeholder="Enter your first name"
          {...register("firstname" , {required : "First name is required" , minLength:{
            value:2,
            message:"First name must be at least 2 characters"
          }})}
          error={errors.firstname}
        />
        <Input
          label="Last Name"
          placeholder="Enter your last name"
          {...register("lastname" , {required : "last name is required" , minLength:{
            value:2,
            message:"Last name must be at least 2 characters"
          }})}
          error={errors.lastname}
        />
        <Select
          label="Gender"
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" }
          ]}
          {...register("gender" , {required : "Gender is required"})}
          error={errors.gender}
        />
      </div>

       {errors.root?.serverError && <p className={styles.error}>{errors.root.serverError.message}</p>}

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
