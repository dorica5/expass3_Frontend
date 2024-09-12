import { useState } from "react";
import styles from "./Create.module.css";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/Login");
  };

  const handleSignUp = async () => {
    const signUpData = { username, email };

    try {
      const response = await fetch("/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(signUpData),
      });

      if (response.ok) {
        console.log("Sign up successful");
        navigate("/Login");
      } else {
        console.error("Sign up failed");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sign Up</h2>
      <div className={styles.div_container}>
        <input
          className={styles.question}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          className={styles.question}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          type="email"
        />
      </div>
      <p>
        Already have an account?{" "}
        <span onClick={goToLogin} className="signUpLogin">
          Login
        </span>
      </p>

      <button title="Sign Up" onClick={handleSignUp} className={styles.btn}>
        Sign Up
      </button>
    </div>
  );
};

export default SignUp;
