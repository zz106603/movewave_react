import Sidebar from "react-sidebar";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

const sidebarContent = (
  <div style={{ padding: "1rem", width: "200px", background: "#343a40", height: "100vh", color: "white" }}>
    <h4>MoveWave</h4>
    <ul style={{ listStyle: "none", padding: 0, color: "white" }}>
        <li style={{ padding: "0.5rem 0" }}>홈</li>
        <li style={{ padding: "0.5rem 0" }}>설정</li>
    </ul>
  </div>
);

function SidebarLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Sidebar
      sidebar={sidebarContent}
      open={sidebarOpen}
      onSetOpen={setSidebarOpen}
      docked={sidebarOpen}
      styles={{
        sidebar: { background: "#343a40", color: "white" },
        root: { display: "flex" },
        content: { flex: 1, padding: "1rem" },
      }}
    >
      {/* 상단 바 */}
      <div style={{ padding: "0.5rem 1rem" }}>
        <FaBars
          style={{ fontSize: "1.5rem", cursor: "pointer" }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div>{children}</div>
    </Sidebar>
  );
}

export default SidebarLayout;
