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
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

interface SignUpFormData {
  email: string;
  password: string;
}

const SignUpForm = () => {
  const [passLock, setPassLock] = useState(true);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<SignUpFormData>();
  const handleSignInSubmit = async (credentials: SignUpFormData) => {
    const { email, password } = credentials;

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // You can use the user object if needed here
      toast.success(`Signed in successfully!`);

      // Redirecting after successful login
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <section className="credential-section">
      <form onSubmit={handleSubmit(handleSignInSubmit)} className="main-form">
        <h1>Sign In</h1>
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

        <button className="form-submit">Sign in</button>
        <div className="register">
          <p>
            Don't have an account? <Link to={"/"}>Sign Up</Link>
          </p>
        </div>
      </form>
    </section>
  );
};

export default SignUpForm;
