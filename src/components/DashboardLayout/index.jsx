import React from "react"
import * as S from './style'
import {NotificationButton} from '../../components/Buttons'

function DashboardLayout({ children,
  sidebarTitle = "Canguru",
  menuItems = [],
  userName = "Usuário",
  userAvatar = "👤" }) {
  return (
    <S.Container>
      <S.Sidebar>
        <h2>{sidebarTitle}</h2>
        {menuItems.map((item, index) => (
          <button key={index} onClick={item.onClick}>
            {item.label}
          </button>
        ))}
      </S.Sidebar>

      <S.MainContent>
        <S.HeaderArea>
        
          <span>{userName}</span>
          <div className="avatar-circle">{userAvatar}</div>
        </S.HeaderArea>

        {children}
      </S.MainContent>
    </S.Container>
  );

}
export default DashboardLayout