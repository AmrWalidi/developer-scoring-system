import { useNavigate, useParams } from "react-router-dom";
import "./scoring.css";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { addBlock } from "../blockchain";
import { toast } from "react-toastify";
import { auth, db } from "../firebase/firebase";

function Scoring() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    Id: "",
    Name: "",
    Surname: "",
    email: "",
  });

  const [score, setScore] = useState({
    Accountability: 0,
    "Code Quality and Integrity": 0,
    "Cooperation and Respect": 0,
    "Security and Privacy Awareness": 0,
    "Use of Open Source and Artificial Intelligence Tools": 0,
  });

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
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const addScore = async () => {
    try {
      await addBlock(id, score);
      navigate("/admin");
    } catch {
      toast.error("Hata: Kullanıcının puanı zincire eklenemiyor");
    }
  };

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
            <p>Açıklama</p>
            <p>Puan</p>
          </div>
          <div className="divider"></div>
          <div className="score-category-list">
            <div className="category-container">
              <p className="category">Kod Kalitesi ve Bütünlüğü</p>
              <p className="details">
                Geliştiricinin katkıları temiz, iyi yapılandırılmış ve
                kopyalanmış veya özgün olmayan kodlardan arınmış mı?
              </p>
              <div className="score-container">
                <input
                  type="text"
                  maxLength={2}
                  style={{
                    color:
                      score["Code Quality and Integrity"] == 0
                        ? "#555555"
                        : "black",
                  }}
                  value={score["Code Quality and Integrity"]}
                  onChange={(e) => {
                    setScore((prev) =>
                      e.target.value <= 20
                        ? {
                            ...prev,
                            "Code Quality and Integrity":
                              parseInt(e.target.value) || 0,
                          }
                        : { ...prev }
                    );
                  }}
                />
                <span>/ 20</span>
              </div>
            </div>
            <div className="category-container">
              <p className="category">Güvenlik ve Gizlilik Farkındalığı</p>
              <p className="details">
                Geliştirici, verileri korumak ve güvenli kod yazmak için en iyi
                uygulamaları takip ediyor mu?
              </p>
              <div className="score-container">
                <input
                  type="text"
                  maxLength={2}
                  value={score["Security and Privacy Awareness"]}
                  style={{
                    color:
                      score["Security and Privacy Awareness"] == 0
                        ? "#555555"
                        : "black",
                  }}
                  onChange={(e) =>
                    setScore((prev) =>
                      e.target.value <= 20
                        ? {
                            ...prev,
                            "Security and Privacy Awareness":
                              parseInt(e.target.value) || 0,
                          }
                        : { ...prev }
                    )
                  }
                />
                <span>/ 20</span>
              </div>
            </div>
            <div className="category-container">
              <p className="category">Hesap verebilirlik</p>
              <p className="details">
                Geliştirici, hatalar, hatalar ve teslim tarihlerinin
                sorumluluğunu üstleniyor mu?
              </p>
              <div className="score-container">
                <input
                  type="text"
                  maxLength={2}
                  style={{
                    color: score.Accountability == 0 ? "#555555" : "black",
                  }}
                  value={score.Accountability}
                  onChange={(e) => {
                    setScore((prev) =>
                      e.target.value <= 20
                        ? {
                            ...prev,
                            Accountability: parseInt(e.target.value) || 0,
                          }
                        : { ...prev }
                    );
                  }}
                />
                <span>/ 20</span>
              </div>
            </div>
            <div className="category-container">
              <p className="category">İşbirliği ve Saygı</p>
              <p className="details">
                Geliştirici profesyonel bir şekilde iletişim kuruyor ve ekip
                çalışmalarına adil bir şekilde katkıda bulunuyor mu?
              </p>
              <div className="score-container">
                <input
                  type="text"
                  maxLength={2}
                  style={{
                    color:
                      score["Cooperation and Respect"] == 0
                        ? "#555555"
                        : "black",
                  }}
                  value={score["Cooperation and Respect"]}
                  onChange={(e) =>
                    setScore((prev) =>
                      e.target.value <= 20
                        ? {
                            ...prev,
                            "Cooperation and Respect":
                              parseInt(e.target.value) || 0,
                          }
                        : { ...prev }
                    )
                  }
                />
                <span>/ 20</span>
              </div>
            </div>
            <div className="category-container">
              <p className="category">
                Açık Kaynak ve Yapay Zeka Araçlarının Kullanımı
              </p>
              <p className="details">
                Geliştirici harici kütüphaneleri veya yapay zekayı sorumlu bir
                şekilde kullanıyor mu ve hak edenlere kredi veriyor mu?
              </p>
              <div className="score-container">
                <input
                  type="text"
                  maxLength={2}
                  style={{
                    color:
                      score[
                        "Use of Open Source and Artificial Intelligence Tools"
                      ] == 0
                        ? "#555555"
                        : "black",
                  }}
                  value={
                    score[
                      "Use of Open Source and Artificial Intelligence Tools"
                    ]
                  }
                  onChange={(e) =>
                    setScore((prev) =>
                      e.target.value <= 20
                        ? {
                            ...prev,
                            "Use of Open Source and Artificial Intelligence Tools":
                              parseInt(e.target.value) || 0,
                          }
                        : { ...prev }
                    )
                  }
                />
                <span>/ 20</span>
              </div>
            </div>
          </div>
          <button className="score-button" onClick={addScore}>
            Paunla
          </button>
        </div>
      </div>
    </div>
  );
}

export default Scoring;
