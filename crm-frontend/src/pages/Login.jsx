import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import this
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext"; // ✅ Make sure you import your context

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ Use navigate
  const { login } = useAuth(); // ✅ Get login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;
      login(user, token); // ✅ Save to context
      alert("Login successful!");
      navigate("/dashboard"); // ✅ Redirect
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
