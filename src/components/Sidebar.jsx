import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "./Sidebar.css"; // ✅ 추가
import { FaHome, FaHistory, FaCog, FaBars } from "react-icons/fa"; // ✅ FaGoogle 추가

function CustomSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <ProSidebar collapsed={collapsed}>
        <Menu iconShape="circle">
          <MenuItem
            icon={<FaBars />}
            onClick={() => setCollapsed(!collapsed)}
          >
            {!collapsed && "메뉴 접기"}
          </MenuItem>

          <MenuItem icon={<FaHome />}>홈</MenuItem>
          <MenuItem icon={<FaHistory />}>이력 보기</MenuItem>
          <MenuItem icon={<FaCog />}>설정</MenuItem>
        </Menu>
      </ProSidebar>
    </div>
  );
}

export default CustomSidebar;
