import Sidebar from "react-sidebar";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

function SidebarLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarContent = (
    <div
      style={{
        padding: "1rem",
        width: "250px",
        background: "#e9edf2",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start"
      }}
    >
      {/* 👉 상단바: MoveWave + 햄버거 버튼 */}
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
  
      {/* 필요한 메뉴들 이어서 넣기 */}
      {/* <ul>...</ul> */}
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
          overflow: "hidden",
        },
      }}
    >
      {/* 메인 콘텐츠 영역 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        {/* ❗ 사이드바가 닫힌 상태일 때만 햄버거 버튼 다시 보여줌 */}
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
