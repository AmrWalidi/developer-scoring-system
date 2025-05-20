import "./users.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import UserContainer from "../components/UserContainer.jsx";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase.js";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { collection, getDocs } from "firebase/firestore";
import { getBlocks } from "../blockchain.js";

function Users() {
  const navigate = useNavigate();
  const [listType, setListType] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([
    {
      Id: "",
      Name: "",
      Surname: "",
      email: "",
      score: {
        Accountability: 0,
        "Code Quality and Integrity": 0,
        "Cooperation and Respect": 0,
        "Security and Privacy Awareness": 0,
        "Use of Open Source and Artificial Intelligence Tools": 0,
      },
    },
  ]);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      }
    });
  }, []);

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

  const getUsers = async (scored) => {
    setUsers([]);
    try {
      const blockchain = await getBlocks();
      const res = await getDocs(collection(db, "Users"));
      if (!res.empty) {
        const documents = res.docs.map((doc) => {
          const userId = doc.data()["Id"];
          const block = blockchain.find(
            (block) => block.transaction[0].user_id === userId
          );
          const user = doc.data();
          if (scored && block) {
            user["score"] = block.transaction[1];
            return user;
          }
          if (scored && !block) {
            return null;
          }
          if (!scored && block) {
            return null;
          }
          if (!scored && !block) {
            user["score"] = {
              Accountability: 0,
              "Code Quality and Integrity": 0,
              "Cooperation and Respect": 0,
              "Security and Privacy Awareness": 0,
              "Use of Open Source and Artificial Intelligence Tools": 0,
            };
            return user;
          }
        });
        setUsers(documents.filter((doc) => doc !== null));
      } 
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (listType == 1) getUsers(false);
    else getUsers(true);
  }, [listType]);

  useEffect(() => {
    const toggle = document.getElementById("side-navbar-toggle");
    const parentContainer = document.getElementById("side-navbar");

    if (toggle && parentContainer) {
      toggle.style.transform =
        listType == 1
          ? `translate(50%, 0px)`
          : `translate(50%, ${parentContainer.offsetHeight / 2}px)`;
    }
  }, [listType]);

  if (loading) return null;

  return user ? (
    <div className="users-page">
      <FontAwesomeIcon
        className="logout-icon"
        icon={faRightFromBracket}
        onClick={logout}
      />
      <div className="users-list-containers">
        <p className="title">Geliştiriciler</p>
        <div>
          <div className="list-head">
            <p>ID</p>
            <p>Kullanıcı Adı</p>
            <p>E-posta</p>
          </div>
          <div className="divider"></div>
          <div className="users-list">
            {users.map((u) => (
              <UserContainer
                key={u.Id}
                id={u.Id}
                username={u.Name + " " + u.Surname}
                email={u.email}
                scored={listType != 1}
                totalScore={Object.values(u.score).reduce(
                  (acc, num) => acc + num,
                  0
                )}
              />
            ))}
          </div>
        </div>
      </div>
      <div id="side-navbar" className="side-navbar">
        <div id="side-navbar-toggle" className="side-navbar-toggle"></div>
        <FontAwesomeIcon
          className="side-navbar-icons"
          icon={faUsers}
          color={`${listType == 1 ? "white" : "#626262"}`}
          onClick={() => setListType(1)}
        />
        <FontAwesomeIcon
          className="side-navbar-icons"
          icon={faList}
          color={`${listType == 2 ? "white" : "#626262"}`}
          onClick={() => setListType(2)}
        />
      </div>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default Users;
