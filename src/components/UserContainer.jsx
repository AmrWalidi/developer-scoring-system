import { useNavigate } from "react-router-dom";

function UserContainer({ id, username, email, scored, totalScore }) {
  const navigate = useNavigate();

  return (
    <div className="user-container">
      <p>{id}</p>
      <p>{username}</p>
      <p>{email}</p>
      {scored ? (
        <b>
          <p>Total Score: {totalScore} / 100</p>
        </b>
      ) : (
        <button
          className="score-button"
          onClick={() => navigate(`/scoring/${id}`)}
        >
          Puanla
        </button>
      )}
    </div>
  );
}

export default UserContainer;
