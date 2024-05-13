import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Show_SideBar = ({ children, routes }) => {
    const location = useLocation();

    const isSidebarVisible = !routes.find(route => route.path === location.pathname && route.hideSideBar)?.hideSideBar;

    return (
        <div style={{ width: isSidebarVisible ? 'auto' : '0vh', transition: 'width 0.5s ease' }}>{isSidebarVisible && children}</div>
    );
}

export default Show_SideBar;
