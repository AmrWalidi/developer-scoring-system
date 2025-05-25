import { useEffect, useState } from "react";
import "./login.css";
import AdminLogin from "../components/AdminLogin";
import DeveloperLogin from "../components/DeveloperLogin";

function Login() {
  const [loginType, setLoginType] = useState(1);


  useEffect(() => {
    const toggle = document.getElementById("toggle-container");
    const parentContainer = document.getElementById("login-nav");

    if (loginType == 1) {
      toggle.style.transform = `translateX(0px)`;
    } else {
      toggle.style.transform = `translateX(${
        parentContainer.offsetWidth / 2
      }px)`;
    }
  }, [loginType]);

  
  return (
    <div className="login-container">
      <div id="login-nav" className="login-nav">
        <div id="toggle-container" className="toggle-container"></div>
        <p
          className={`login-nav-text ${loginType == 1 ? "active" : ""}`}
          onClick={() => setLoginType(1)}
        >
          Yönetici
        </p>
        <p
          className={`login-nav-text ${loginType == 2 ? "active" : ""}`}
          onClick={() => setLoginType(2)}
        >
          Geliştirici
        </p>
      </div>
      {loginType == 1 ? <AdminLogin /> : <DeveloperLogin />}
    </div>
  );
}

export default Login;
