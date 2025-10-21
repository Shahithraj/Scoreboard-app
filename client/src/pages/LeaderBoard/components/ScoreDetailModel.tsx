import { useScoreDetails } from "../../../custom-hooks/useScoreDetails";

interface ScoreDetailModalProps {
  id: string;
  type: "team" | "member";
  name: string;
  onClose: () => void;
}

const ScoreDetailModal = ({
  id,
  type,
  name,
  onClose,
}: ScoreDetailModalProps) => {
  const { data: details, loading } = useScoreDetails(id, type);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          width: "420px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          animation: "fadeIn 0.25s ease-in-out",
        }}
      >
        <h3 style={{ marginBottom: "1rem", textAlign: "center" }}>
          {type === "team" ? "🏆 Team" : "🏅 Member"}: {name}
        </h3>

        {loading ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            Loading game scores...
          </div>
        ) : details.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            No game scores found.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  Game
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "8px",
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {details.map((d, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "8px", color: "#555" }}>
                    {d.gameName}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "8px",
                      color: "#111",
                      fontWeight: 500,
                    }}
                  >
                    {d.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button
            onClick={onClose}
            style={{
              background: "#007bff",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreDetailModal;
