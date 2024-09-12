import { useState } from "react";
import styles from "./Create.module.css";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  username: string;
}

interface LoginProps {
  setLoggedInUser: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ setLoggedInUser }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const goToSignUp = () => {
    navigate("/signup");
  };

  const handleLogin = async () => {
    const loginData = { username, email };
    try {
      const response = await fetch("/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(loginData),
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("user", JSON.stringify(user));
        setLoggedInUser(user);
        navigate("/");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>
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
        Don't have an account?{" "}
        <span onClick={goToSignUp} className="signUpLogin">
          Sign Up
        </span>
      </p>

      <button title="Login" onClick={handleLogin} className={styles.btn}>
        Login
      </button>
    </div>
  );
};

export default Login;
