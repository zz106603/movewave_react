import Sidebar from "react-sidebar";
import { useState } from "react";
import { FaBars, FaGoogle } from "react-icons/fa";

function SidebarLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const sidebarContent = (
    <div
      style={{
        padding: "1rem",
        width: "250px",
        background: "#e9edf2",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between" // 상단/하단 분리!
      }}
    >
      {/* 👆 상단 메뉴 영역 */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem"
          }}
        >
          <h4 style={{ color: "#353bea", margin: 0, fontWeight: "bold", fontSize: "1.2rem" }}>
            MoveWave
          </h4>
          <FaBars
            style={{ fontSize: "1.2rem", cursor: "pointer", color: "#a9a9a9" }}
            onClick={() => setSidebarOpen(false)}
          />
        </div>

        {/* 여기에 메뉴 항목 넣으면 됨 */}
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>홈</li>
          <li>이력 보기</li>
          <li>설정</li>
        </ul>
      </div>

      {/* 👇 하단 로그인 버튼 */}
      <button
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "0.5rem 1rem",
          borderRadius: "5px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#DB4437",
          fontWeight: "bold",
          fontSize: "1rem", // ← 글자 크기도 명시
        }}
        onClick={handleGoogleLogin}
      >
        <FaGoogle style={{ marginRight: "0.5rem", color: "#DB4437" }} />
        Google 로그인
      </button>
    </div>
  );

  return (
    <Sidebar
      sidebar={sidebarContent}
      open={sidebarOpen}
      onSetOpen={setSidebarOpen}
      docked={sidebarOpen}
      styles={{
        root: { display: "flex", height: "100vh" },
        sidebar: { background: "#e9edf2", height: "100vh" },
        content: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }
      }}
    >
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        {!sidebarOpen && (
          <div
            style={{ fontSize: "1.5rem", cursor: "pointer", marginBottom: "1rem" }}
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars />
          </div>
        )}

        {children}
      </div>
    </Sidebar>
  );
}

export default SidebarLayout;
