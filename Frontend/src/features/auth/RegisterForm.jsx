import { useForm } from "react-hook-form";
import Input from "../../utils/Input";
import Select from "../../utils/Select";
import styles from "./RegisterForm.module.scss";
import { Link, useNavigate } from "react-router-dom";
import authAPI from "./AuthAPI";

export default function RegisterForm() {
  const { register, handleSubmit , setError , formState: {errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      const data = await authAPI.register(formData);
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
          {...register("username" , {required : true , minLength:2})}
          error={errors.username}
        />
        <Input
          label="Email"
          placeholder="Enter your email"
          {...register("email" , {required : true ,
            pattern: {
              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
            }
          })}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          {...register("password" , {minLength: 8 , required : true,
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$/
            }
          })}
          error={errors.password}
        />
        <Input
          label="First Name"
          placeholder="Enter your first name"
          {...register("firstname" , {required : true , minLength:2})}
          error={errors.firstname}
        />
        <Input
          label="Last Name"
          placeholder="Enter your last name"
          {...register("lastname" , {required : true , minLength:2})}
          error={errors.lastname}
        />
        <Select
          label="Gender"
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" }
          ]}
          {...register("gender" , {required : true})}
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

      <img src="https://shorturl.at/AO2SW" alt="logo" style={{ height: "120", width: "120px" }} />
    </form>
  );
}
