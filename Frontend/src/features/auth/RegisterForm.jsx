import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../../utils/components/Input";
import Select from "../../utils/components/Select";
import styles from "./RegisterForm.module.scss";
import { Link, useNavigate } from "react-router-dom";
import authAPI from "./AuthAPI";
import Logo from "../../utils/components/Logo";
import { trimFormData } from "../../utils/helpers/trimFromData";

const STEP_FORM = 1;
const STEP_VERIFICATION = 2;

export default function RegisterForm() {
  const [step, setStep] = useState(STEP_FORM);
  const [formData, setFormData] = useState(null);
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const inputRefs = useRef([]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });
  const navigate = useNavigate();

  // Timer for resend cooldown
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Focus first OTP input when entering verification step
  useEffect(() => {
    if (step === STEP_VERIFICATION && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  const onSubmitForm = async (data) => {
    try {
      const trimmedData = trimFormData(data);
      await authAPI.sendVerificationCode(trimmedData);
      setFormData(trimmedData);
      setStep(STEP_VERIFICATION);
      setResendTimer(60);
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
      } else {
        setError("root.serverError", {
          type: "server",
          message: "Something went wrong. Please try again later.",
        });
      }
    }
  };

  const handleCodeChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setVerifyError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...verificationCode];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newCode[i] = char;
    });
    setVerificationCode(newCode);

    // Focus last filled input or the next empty one
    const lastIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.join("");
    if (code.length !== 6) {
      setVerifyError("Please enter the complete 6-digit code");
      return;
    }

    setIsVerifying(true);
    setVerifyError("");

    try {
      await authAPI.verifyCode(formData.email, code);
      navigate("/auth/login", { state: { registered: true } });
    } catch (error) {
      const res = error?.response?.data;
      if (res?.errors?.length > 0) {
        setVerifyError(res.errors[0].message);
      } else {
        setVerifyError("Invalid or expired code. Please try again.");
      }
      setVerificationCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    try {
      await authAPI.resendVerificationCode(formData);
      setResendTimer(60);
      setResendSuccess(true);
      setVerifyError("");
      setVerificationCode(["", "", "", "", "", ""]);
      setTimeout(() => setResendSuccess(false), 3000);
      inputRefs.current[0]?.focus();
    } catch (error) {
      setVerifyError("Failed to resend code. Please try again.");
    }
  };

  const handleBackToForm = () => {
    setStep(STEP_FORM);
    setVerificationCode(["", "", "", "", "", ""]);
    setVerifyError("");
  };

  // Registration form step
  if (step === STEP_FORM) {
    return (
      <form noValidate onSubmit={handleSubmit(onSubmitForm)} className={styles.formContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>Join Skill Matana and start learning</p>
        </div>

        <div className={styles.inputContainer}>
          <Input
            label="Username"
            placeholder="Choose a username"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 2,
                message: "Username must be at least 2 characters",
              },
            })}
            error={errors.username}
          />
          <Input
            label="Email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Invalid email format",
              },
            })}
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            {...register("password", {
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
              required: "Password is required",
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, and one special character",
              },
            })}
            error={errors.password}
          />
          <div className={styles.nameRow}>
            <Input
              label="First Name"
              placeholder="First name"
              {...register("firstname", {
                required: "First name is required",
                minLength: {
                  value: 2,
                  message: "First name must be at least 2 characters",
                },
              })}
              error={errors.firstname}
            />
            <Input
              label="Last Name"
              placeholder="Last name"
              {...register("lastname", {
                required: "Last name is required",
                minLength: {
                  value: 2,
                  message: "Last name must be at least 2 characters",
                },
              })}
              error={errors.lastname}
            />
          </div>
          <Select
            label="Gender"
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            {...register("gender", { required: "Gender is required" })}
            error={errors.gender}
          />
        </div>

        {errors.root?.serverError && (
          <p className={styles.error}>{errors.root.serverError.message}</p>
        )}

        <button
          type="submit"
          className={`${styles.submitButton} ${isSubmitting ? styles.isSubmitted : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className={styles.loadingText}>
              <span className={styles.spinner}></span>
              Sending Code...
            </span>
          ) : (
            "Continue"
          )}
        </button>

        <p className={styles.linkText}>
          Already have an account?{" "}
          <Link to="../login" className={styles.link}>
            Sign in
          </Link>
        </p>

        <Logo size="xl-large" link={false} />
      </form>
    );
  }

  // Verification step
  return (
    <div className={styles.verificationContainer}>
      <button className={styles.backButton} onClick={handleBackToForm}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className={styles.verificationContent}>
        <div className={styles.iconWrapper}>
          <div className={styles.emailIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className={styles.sparkles}>
            <span className={styles.sparkle}></span>
            <span className={styles.sparkle}></span>
            <span className={styles.sparkle}></span>
          </div>
        </div>

        <h2 className={styles.verificationTitle}>Check your email</h2>
        <p className={styles.verificationSubtitle}>
          We've sent a 6-digit verification code to
          <br />
          <strong className={styles.email}>{formData?.email}</strong>
        </p>

        <div className={styles.codeInputWrapper}>
          <div className={styles.codeInputs} onPaste={handlePaste}>
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`${styles.codeInput} ${digit ? styles.filled : ""} ${
                  verifyError ? styles.error : ""
                }`}
                disabled={isVerifying}
              />
            ))}
          </div>

          {verifyError && <p className={styles.verifyError}>{verifyError}</p>}
          {resendSuccess && <p className={styles.resendSuccess}>New code sent!</p>}
        </div>

        <button
          onClick={handleVerifyCode}
          className={`${styles.verifyButton} ${isVerifying ? styles.isSubmitted : ""}`}
          disabled={isVerifying || verificationCode.join("").length !== 6}
        >
          {isVerifying ? (
            <span className={styles.loadingText}>
              <span className={styles.spinner}></span>
              Verifying...
            </span>
          ) : (
            "Verify Email"
          )}
        </button>

        <div className={styles.resendSection}>
          <p className={styles.resendText}>Didn't receive the code?</p>
          <button
            onClick={handleResendCode}
            className={`${styles.resendButton} ${resendTimer > 0 ? styles.disabled : ""}`}
            disabled={resendTimer > 0}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
          </button>
        </div>

        <div className={styles.timerInfo}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>Code expires in 10 minutes</span>
        </div>
      </div>

      <Logo size="xl-large" link={false} />
    </div>
  );
}
