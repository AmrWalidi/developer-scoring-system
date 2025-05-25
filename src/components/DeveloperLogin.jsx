import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { haveBeenScored } from "../blockchain";

function DeveloperLogin() {
  const navigate = useNavigate();
  const [id, setId] = useState("");

  const seeScore = async () => {
    const scoredUser = await haveBeenScored(id);
    if (scoredUser) {
      navigate(`/developer/${id}`);
    } else {
      toast.error("Bu ID'ye sahip geliştirici hakkında veri yok", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  
  return (
    <div>
      <div className="inputs-container">
        <div className="input-container">
          <FontAwesomeIcon className="input-icon" icon={faUser} />
          <input
            type="text"
            placeholder="Geliştirici ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
      </div>

      <button className="login-button" onClick={seeScore}>
        Puanı Göster
      </button>
    </div>
  );
}

export default DeveloperLogin;
