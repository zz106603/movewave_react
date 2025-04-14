import Sidebar from "react-sidebar";
import { useState, forwardRef  } from "react";
import { FaBars, FaGoogle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";


function SidebarLayout({ children, scrollRef }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const location = useLocation();

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

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              fontWeight: "bold",
              color: location.pathname === "/" ? "#353bea" : "#333",
              backgroundColor: location.pathname === "/" ? "#dce3ff" : "transparent",
              padding: "0.4rem 0.6rem",
              borderRadius: "6px",
            }}
          >
            🏠 Home
          </Link>

          <Link
            to="/favorites"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              fontWeight: "bold",
              color: location.pathname === "/favorites" ? "#353bea" : "#333",
              backgroundColor: location.pathname === "/favorites" ? "#dce3ff" : "transparent",
              padding: "0.4rem 0.6rem",
              borderRadius: "6px",
            }}
          >
            ⭐ PlayList
          </Link>
        </div>



      </div>

      {/* 👇 하단 로그인 버튼 */}
      <button
        style={{
          backgroundColor: "#fff",
          border: "1px solid #dadce0",
          borderRadius: "4px",
          fontSize: "14px",
          color: "#3c4043",
          padding: "0.5rem 1.5rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "box-shadow 0.2s ease-in-out",
        }}
        onClick={handleGoogleLogin}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(60, 64, 67, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <FaGoogle style={{ color: "#DB4437" }} />
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
      <div  ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
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
