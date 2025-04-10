import { useState } from "react";
import axios from "axios";
import "./Home.css";

function Home() {
  const [text, setText] = useState("");
  const [musicList, setMusicList] = useState([]);
  const [emotion, setEmotion] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("전체"); // 기본값을 "전체"로 설정

  const typeButtons = ["전체", "힙합", "발라드", "R&B", "댄스", "어쿠스틱", "재즈", "로우파이", "피아노", "힐링", "메탈"];

  const handleSubmit = async () => {
    if (!text.trim()) return alert("문장을 입력하세요!");

    setLoading(true);
    setMusicList([]);

    try {
      const res = await axios.post("http://localhost:8080/api/song",
        {
          text,
          type: type === "전체" ? "공통" : type
        },
        { withCredentials: true }
      );
      setEmotion(res.data.emotion);
      setConfidence(res.data.confidence);
      setMusicList(res.data.songs);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("로그인 또는 회원가입이 필요합니다.");
      } else {
        console.error("API 호출 실패:", err);
        alert("추천 생성에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2 style={{ fontWeight: "600" }}>오늘 기분은 어땠나요?</h2>

        {/* 🎧 장르 버튼 */}
        <div className="d-flex flex-wrap justify-content-center gap-2 my-3">
          {typeButtons.map((btn) => (
            <button
              key={btn}
              className={`btn btn-sm ${type === btn ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setType(btn)}
            >
              {btn}
            </button>
          ))}
        </div>

        <textarea
          className="form-control my-3"
          placeholder="ex) 오늘 하루가 너무 길게 느껴졌어요"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="btn btn-primary w-100"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "분석 중..." : "추천 받기"}
        </button>

        {/* 감정 결과 박스 */}
        {emotion && !loading && (
          <div style={{
            backgroundColor: "#f1f3f5",
            borderRadius: "8px",
            padding: "1rem",
            textAlign: "center",
            margin: "1rem 0",
            fontWeight: "500"
          }}>
            감정 분석 결과: <strong>{emotion}</strong> ({(confidence * 100).toFixed(1)}%)
          </div>
        )}

        {/* 로딩 스피너 */}
        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status" />
            <div className="mt-2">추천 음악을 생성 중입니다...</div>
          </div>
        )}
      </div>

      {/* 추천 음악 리스트 */}
      {!loading && musicList.length > 0 && (
        <>
          <h5 className="mb-3" style={{ fontWeight: "600" }}>추천 음악 리스트</h5>

          {musicList.map((music, index) => (
            <div key={index} className="card mb-4 shadow-sm" style={{ borderRadius: "12px" }}>
              <div className="card-body">
                <h6 className="card-title" style={{ fontWeight: "600" }}>{music.title}</h6>

                <div className="mb-3 text-center">
                  <iframe
                    width="100%"
                    height="280"
                    src={`https://www.youtube.com/embed/${music.videoId}`}
                    title={`YouTube video for ${music.title}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div className="d-flex justify-content-center gap-2">
                  <a
                    href={music.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm d-flex align-items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="#FF0000" className="me-2">
                      <path d="M10 15V9l5 3-5 3zm10.65-9.24A2.78 2.78 0 0 0 18.73 4H5.27A2.78 2.78 0 0 0 3.35 5.76 29.94 29.94 0 0 0 3 12a29.94 29.94 0 0 0 .35 6.24A2.78 2.78 0 0 0 5.27 20h13.46a2.78 2.78 0 0 0 1.92-1.76A29.94 29.94 0 0 0 21 12a29.94 29.94 0 0 0-.35-6.24z"/>
                    </svg>
                    YouTube
                  </a>
                  <a
                    href={music.musicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-danger btn-sm d-flex align-items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="#EA0C0C" className="me-2">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
                              10-4.48 10-10S17.52 2 12 2zm0 17.5
                              c-4.14 0-7.5-3.36-7.5-7.5
                              s3.36-7.5 7.5-7.5
                              7.5 3.36 7.5 7.5
                              -3.36 7.5-7.5 7.5zm-2-7.5
                              l6 3.5V9l-6 3.5z"/>
                    </svg>
                    YouTube Music
                  </a>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Home;
