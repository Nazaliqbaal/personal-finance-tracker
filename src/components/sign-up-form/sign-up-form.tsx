import { useState } from "react";
import "../form.css";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { auth } from "../../firebase";

import {
  mailOutline,
  lockClosedOutline,
  lockOpenOutline,
} from "ionicons/icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

interface SignUpFormData {
  email: string;
  password: string;
}

const SignUpForm = () => {
  const [passLock, setPassLock] = useState(true);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<SignUpFormData>();
  const handleSignUpSubmit = async (credentials: SignUpFormData) => {
    const { email, password } = credentials;

    try {
      // Attempt to create a new user with the provided credentials
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created successfully!");
      navigate("/dashboard"); // Navigate to dashboard after successful signup
    } catch (error) {
      // Handle specific FirebaseError cases
      if (error instanceof FirebaseError) {
        // Check for specific Firebase errors (e.g., EMAIL_EXISTS)
        if (error.code === "auth/email-already-in-use") {
          toast.error("The email address is already in use.");
        } else {
          // General Firebase error
          toast.error(error.message);
        }
      } else {
        // For non-Firebase errors
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <section className="credential-section">
      <form onSubmit={handleSubmit(handleSignUpSubmit)} className="main-form">
        <h1>Sign Up</h1>
        <div className="inputbox">
          <IonIcon icon={mailOutline}></IonIcon>
          {/* <ion-icon name="mail-outline"></ion-icon> */}
          <input {...register("email")} />
          <label htmlFor="">Email</label>
        </div>
        <div className="inputbox">
          <IonIcon
            onClick={() => setPassLock((prev) => !prev)}
            icon={passLock ? lockClosedOutline : lockOpenOutline}
          ></IonIcon>
          {/* <ion-icon name="loc"></ion-icon> */}
          <input
            type={passLock ? "password" : "text"}
            {...register("password")}
          />
          <label htmlFor="">Password</label>
        </div>

        <button className="form-submit">Sign Up</button>
        <div className="register">
          <p>
            Already have an account? <Link to={"sign-in"}>Sign In</Link>
          </p>
        </div>
      </form>
    </section>
  );
};

export default SignUpForm;
