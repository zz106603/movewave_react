import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Home.css";

function Home() {
  const [text, setText] = useState("");
  const [musicList, setMusicList] = useState([]);
  const [emotion, setEmotion] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("전체");
  const [favorites, setFavorites] = useState([]);

  const typeButtons = ["전체", "힙합", "발라드", "R&B", "댄스", "어쿠스틱", "재즈", "로우파이", "피아노", "힐링", "메탈"];

  useEffect(() => {
    axios.get("http://localhost:8080/api/favorite/song", { withCredentials: true })
      .then(res => {
        const ids = res.data.map(song => song.videoId);
        setFavorites(ids);
      })
      .catch(err => {
        console.error("즐겨찾기 목록 로드 실패", err);
      });
  }, []);

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

  const handleFavoriteWithConfirm = async (music) => {
    const isFavorited = favorites.includes(music.videoId);
  
    const result = await Swal.fire({
      icon: isFavorited ? 'warning' : 'question',
      title: isFavorited ? 'PlayList 취소' : 'PlayList 추가',
      text: `"${music.title}"을(를) ${isFavorited ? 'PlayList에서 제거하시겠어요?' : 'PlayList에 추가하시겠어요?'}`,
      showCancelButton: true,
      confirmButtonText: isFavorited ? '제거하기' : '추가하기',
      cancelButtonText: '닫기',
      reverseButtons: true,
      confirmButtonColor: isFavorited ? '#d33' : '#3085d6',
      cancelButtonColor: '#aaa'
    });

    if (result.isConfirmed) {
      try {
        if (isFavorited) {
          await axios.delete(`http://localhost:8080/api/favorite/song/${music.videoId}`, { withCredentials: true });
          setFavorites(prev => prev.filter(id => id !== music.videoId));
    
          Swal.fire({
            icon: 'success',
            title: '삭제 완료',
            text: `"${music.title}"을(를) 즐겨찾기에서 제거했어요.`,
            confirmButtonColor: '#d33',
            timer: 1500,
            showConfirmButton: false
          });
        } else {
          await axios.post("http://localhost:8080/api/favorite/song", {
            videoId: music.videoId,
            title: music.title,
            thumbnailUrl: music.thumbnailUrl,
            videoUrl: music.videoUrl,
            musicUrl: music.musicUrl
          }, { withCredentials: true });
          setFavorites(prev => [...prev, music.videoId]);
    
          Swal.fire({
            icon: 'success',
            title: '추가 완료',
            text: `"${music.title}"을(를) 즐겨찾기에 추가했어요!`,
            confirmButtonColor: '#3085d6',
            timer: 1500,
            showConfirmButton: false
          });
        }
      } catch (err) {
        console.error("즐겨찾기 처리 실패:", err);
        Swal.fire({
          icon: 'error',
          title: '오류 발생',
          text: '즐겨찾기 처리 중 문제가 발생했습니다.',
          confirmButtonColor: '#d33'
        });
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2 style={{ fontWeight: "600" }}>오늘 기분은 어땠나요?</h2>

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

        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status" />
            <div className="mt-2">추천 음악을 생성 중입니다...</div>
          </div>
        )}
      </div>

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

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-2">
                  {/* 왼쪽: YouTube 링크 그룹 */}
                  <div className="d-flex gap-2 flex-wrap">
                  <a
                    href={music.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm d-flex align-items-center fw-bold"
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
                    className="btn btn-outline-danger btn-sm d-flex align-items-center fw-bold"
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

                  {/* 오른쪽: 즐겨찾기 버튼 */}
                  <div>
                    <button
                      className={`btn btn-sm ${favorites.includes(music.videoId) ? "btn-warning fw-bold" : "btn-outline-warning fw-bold"}`}
                      onClick={() => handleFavoriteWithConfirm(music)}
                    >
                      <span className="me-1">{favorites.includes(music.videoId) ? "★" : "☆"}</span>
                      {favorites.includes(music.videoId) ? "PlayList 삭제" : "PlayList 저장"}
                    </button>
                  </div>
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
