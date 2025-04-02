import { useState } from "react";
import axios from "axios";

function Home() {
  const [text, setText] = useState("");
  const [musicList, setMusicList] = useState([]);
  const [emotion, setEmotion] = useState("");
  const [confidence, setConfidence] = useState(0);

  const handleSubmit = async () => {
    if (!text.trim()) return alert("문장을 입력하세요!");

    try {
      const res = await axios.post("http://localhost:8080/api/song", { text });
      setEmotion(res.data.emotion);
      setConfidence(res.data.confidence);
      setMusicList(res.data.songs);
    } catch (err) {
      console.error("API 호출 실패:", err);
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
        maxWidth: "1000px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        padding: "2rem"
      }}>
        <h2 className="text-center mb-4">당신의 기분을 말로 표현해보세요 🎤</h2>

        <textarea
          className="form-control mb-3"
          placeholder="ex) 오늘 하루가 너무 길게 느껴졌어요"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <button className="btn btn-primary w-100 mb-4" onClick={handleSubmit}>
          추천 받기
        </button>

        {musicList.length > 0 && (
          <div>
            <h5>
              감정 분석 결과: {emotion} ({(confidence * 100).toFixed(1)}%)
            </h5>
            <h6 className="text-muted">🎵 추천 음악 리스트</h6>
            <ul className="list-group list-group-flush mt-2">
              {musicList.map((music, index) => (
                <li className="list-group-item" key={index}>
                  <strong>{music.title}</strong> - {music.artist}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
