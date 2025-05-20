import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch {
      toast.error("Bu yönetici kayıtlı değil", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  return (
    <div>
      <div className="inputs-container">
        <div className="input-container">
          <FontAwesomeIcon className="input-icon" icon={faEnvelope} />
          <input
            type="text"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-container">
          <FontAwesomeIcon className="input-icon" icon={faLock} />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <button className="login-button" onClick={login}>
        Login
      </button>
    </div>
  );
}

export default AdminLogin;
