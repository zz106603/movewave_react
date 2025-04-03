import { useState } from "react";
import axios from "axios";
import "./Home.css";

function Home() {
  const [text, setText] = useState("");
  const [musicList, setMusicList] = useState([]);
  const [emotion, setEmotion] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return alert("문장을 입력하세요!");

    setLoading(true);
    setMusicList([]);

    try {
      const res = await axios.post("http://localhost:8080/api/song", { text });
      setEmotion(res.data.emotion);
      setConfidence(res.data.confidence);
      setMusicList(res.data.songs);
    } catch (err) {
      console.error("API 호출 실패:", err);
      alert("추천 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f8f9fa",
      padding: "1rem"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "1200px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        padding: "2rem"
      }}>
        <h2 className="text-center mb-4">당신의 기분을 말로 표현해보세요 🎤</h2>

        <div className="row">
          {/* 왼쪽 입력 영역 */}
          <div className="col-md-6">
            <textarea
              className="form-control mb-3"
              placeholder="ex) 오늘 하루가 너무 길게 느껴졌어요"
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>

            <button
              className="btn btn-primary w-100 mb-3"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "분석 중..." : "추천 받기"}
            </button>

            {/* ✅ 감정 분석 결과 여기에 표시 */}
            {emotion && !loading && (
              <div className="mb-3 text-center">
                <strong>감정 분석 결과:</strong> {emotion} ({(confidence * 100).toFixed(1)}%)
              </div>
            )}

            {loading && (
              <div className="text-center my-4">
                <div className="spinner-border text-primary" role="status"></div>
                <div className="mt-2">추천 음악을 생성 중입니다...</div>
              </div>
            )}
          </div>


          {/* 오른쪽 결과 */}
          <div className="col-md-6">
            <div
              style={{
                minHeight: "400px",
                maxHeight: "500px", // 💡 이게 스크롤 높이
                overflowY: "auto",
                paddingRight: "10px" // 스크롤바 겹침 방지
              }}
            >
              {musicList.length > 0 ? (
                <>
                  <h6 className="text-muted mt-3">🎵 추천 음악 리스트</h6>

                  <div className="row mt-3">
                    {musicList.map((music, index) => (
                      <div className="col-12 mb-3" key={index}>
                        <div
                          className="card h-100 shadow-sm"
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "row"
                          }}
                          onClick={() => window.open(music.videoUrl, "_blank")}
                        >
                          <img
                            src={music.thumbnailUrl}
                            alt={`${music.title} thumbnail`}
                            style={{
                              width: "120px",
                              objectFit: "cover",
                              borderRadius: "4px 0 0 4px"
                            }}
                          />
                          <div className="card-body">
                            <h6 className="card-title mb-1">{music.title}</h6>
                            <p className="card-text text-muted mb-0">{music.artist}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-muted text-center mt-5">
                  추천 결과가 이곳에 표시됩니다 🎶
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;
