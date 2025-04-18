import { useRef, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function FavoritesPage({ scrollRef }) {
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null: 로딩중, false: 비로그인, true: 로그인

  // 로그인 여부 확인
  useEffect(() => {
    const checkLogin = async () => {
      try {
        await axios.get("http://localhost:8080/api/account", {
          withCredentials: true,
        });
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
        Swal.fire({
          icon: "warning",
          title: "로그인이 필요합니다",
          text: "즐겨찾기 기능을 이용하려면 먼저 로그인해주세요.",
          confirmButtonText: "확인",
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/";
          }
        });
      }
    };
    checkLogin();
  }, []);

  // 로그인된 경우에만 즐겨찾기 가져오기
  useEffect(() => {
    if (isLoggedIn) {
      fetchPage(0);
    }
  }, [isLoggedIn]);

  const fetchPage = (pageNum) => {
    axios
      .get(`http://localhost:8080/api/favorite/song/page?page=${pageNum}&size=5`, {
        withCredentials: true,
      })
      .then((res) => {
        setFavorites(res.data.content);
        setPage(res.data.number);
        setTotalPages(res.data.totalPages);
        scrollRef?.current?.scrollTo({ top: 0 });
      })
      .catch((err) => {
        console.error("즐겨찾기 목록 불러오기 실패", err);
        Swal.fire({
          icon: "error",
          title: "오류 발생",
          text: "즐겨찾기 목록을 불러오지 못했습니다.",
        });
      });
  };

  // 아래는 동일: 삭제, 렌더링 등등


  const handleDeleteConfirm = async (music) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '즐겨찾기 취소',
      text: `"${music.title}"을(를) 즐겨찾기에서 제거하시겠어요?`,
      showCancelButton: true,
      confirmButtonText: '삭제하기',
      cancelButtonText: '닫기',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/favorite/song/${music.videoId}`, {
          withCredentials: true
        });
        
        Swal.fire({
          icon: 'success',
          title: '삭제 완료',
          text: `"${music.title}"을(를) 즐겨찾기에서 제거했어요.`,
          confirmButtonColor: '#d33',
          timer: 1500,
          showConfirmButton: false
        });
        
        fetchPage(page); // 현재 페이지 다시 불러오기
      } catch (err) {
        console.error("즐겨찾기 삭제 실패:", err);
        Swal.fire({
          icon: 'error',
          title: '오류 발생',
          text: '즐겨찾기 삭제 중 문제가 발생했습니다.',
          confirmButtonColor: '#d33'
        });
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2 style={{ fontWeight: "600" }}>PlayList</h2>
      </div>

      {favorites.length === 0 ? (
        <p className="text-center">추가된 PlayList가 없습니다.</p>
      ) : (
        <>
          {favorites.map((music, index) => (
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
                  <div className="d-flex gap-2 flex-wrap">
                    <a
                      href={music.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary btn-sm d-flex align-items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="#FF0000" className="me-2">
                        <path d="M10 15V9l5 3-5 3zm10.65-9.24A2.78 2.78 0 0 0 18.73 4H5.27A2.78 2.78 0 0 0 3.35 5.76 
                        29.94 29.94 0 0 0 3 12a29.94 29.94 0 0 0 .35 6.24A2.78 2.78 0 0 0 5.27 20h13.46a2.78 
                        2.78 0 0 0 1.92-1.76A29.94 29.94 0 0 0 21 12a29.94 29.94 0 0 0-.35-6.24z" />
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
                                l6 3.5V9l-6 3.5z" />
                      </svg>
                      YouTube Music
                    </a>
                  </div>

                  <div>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleDeleteConfirm(music)}
                    >
                      <span className="me-1">★</span>
                      PlayList 삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-center mt-4 gap-2 flex-wrap">
            {/* ⏮ 맨앞으로 */}
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => fetchPage(0)}
              disabled={page === 0}
            >
              ◀◀
            </button>

            {/* ◀ 이전 */}
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => fetchPage(page - 1)}
              disabled={page === 0}
            >
              ◀
            </button>

            {/* 페이지 숫자들 */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => fetchPage(i)}
                className={`btn btn-sm ${i === page ? "btn-primary" : "btn-outline-primary"}`}
              >
                {i + 1}
              </button>
            ))}

            {/* ▶ 다음 */}
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => fetchPage(page + 1)}
              disabled={page === totalPages - 1}
            >
              ▶
            </button>

            {/* ⏭ 맨뒤로 */}
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => fetchPage(totalPages - 1)}
              disabled={page === totalPages - 1}
            >
              ▶▶
            </button>
          </div>

        </>
      )}
    </div>
  );
}

export default FavoritesPage;
