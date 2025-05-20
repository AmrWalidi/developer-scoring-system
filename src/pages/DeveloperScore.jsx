import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { auth, db } from "../firebase/firebase";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getBlocks, validateBlock } from "../blockchain";

function DeveloperScore() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState({
    Id: "",
    Name: "",
    Surname: "",
    email: "",
  });
  const [score, setScore] = useState({});

  const logout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
      });
    }
  };

  const getUser = async () => {
    try {
      const usersRef = collection(db, "Users");
      const q = query(usersRef, where("Id", "==", id));
      const res = await getDocs(q);
      if (!res.empty) {
        const u = res.docs[0].data();
        setUser(u);
      }
      const blockchain = await getBlocks();
      const block = blockchain.find(
        (block) => block.transaction[0].user_id === id
      );
      setScore(block.transaction[1]);
    } catch (error) {
      console.log(error.message);
    }
  };

  const validateScore = async () => {
    const { valid, message } = await validateBlock(id);
    if (valid) {
      toast.success("Veriler geçerlidir", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      toast.error(message, {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="users-list-containers">
      <FontAwesomeIcon
        className="logout-icon"
        icon={faRightFromBracket}
        onClick={logout}
      />
      <p className="username">{user.Name + " " + user.Surname}</p>
      <p className="email">{user.email}</p>
      <div>
        <div>
          <div className="scoring-list-head">
            <p>Kriterler</p>
            <p>Puan</p>
          </div>
          <div className="divider"></div>
          <div className="score-category-list">
            {Object.entries(score).map(([key, value]) => (
              <div className="category-container" key={key}>
                <p className="category">{key}</p>
                <div className="score-container">
                  <input type="text" value={value} disabled />
                  <span>/ 20</span>
                </div>
              </div>
            ))}
            <div className="total-score-container">
              <p className="total-score-title">Toplam Puan</p>
              <p className="total-score">{`${Object.values(score).reduce(
                (acc, num) => acc + num,
                0
              )} / 100`}</p>
            </div>
          </div>
          <button className="score-button" onClick={validateScore}>
            Blockchain'de Doğrula
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeveloperScore;
