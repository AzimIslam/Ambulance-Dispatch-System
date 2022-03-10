import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import React from "react"
import { AiOutlineHome } from 'react-icons/ai'
import { MdOutlineCreateNewFolder } from 'react-icons/md'
import { FaAmbulance } from 'react-icons/fa'
import { FiSettings } from 'react-icons/fi'
import { HiOutlineLogout } from 'react-icons/hi';
import axios from "axios";
import { useNavigate } from "react-router"

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

export const Sidebar = () => {
    let navigate = useNavigate()

    const logout = () => {
        axios.post("/api/dispatcher/logout")
            .then(res => {
                navigate("/dispatcher/")
            })
    }
    return (
        <SideNav
        onSelect={(selected) => {
            // Add your code here
        }}
        style={{ backgroundColor: "#2986cc" }}
    >
        <SideNav.Toggle />
        <SideNav.Nav defaultSelected="home">
            <NavItem eventKey="home" onClick={() => navigate("/dispatcher/dashboard")}>
                <NavIcon>
                    <AiOutlineHome style={{ fontSize: '1.5em' }} />
                </NavIcon>
                <NavText>
                    Home
                </NavText>
            </NavItem>
            <NavItem eventKey="createCase" onClick={() => navigate("/dispatcher/dashboard/createCase")}>
                <NavIcon>
                    <MdOutlineCreateNewFolder style={{ fontSize: '1.5em' }} />
                </NavIcon>
                <NavText>
                    Create Case
                </NavText>
            </NavItem>
            <NavItem eventKey="manageDispatch"  onClick={() => navigate("/dispatcher/dashboard/manageDispatch")}>
                <NavIcon>
                    <FaAmbulance style={{ fontSize: '1.5em' }} />
                </NavIcon>
                <NavText>
                    Manage Dispatch
                </NavText>
            </NavItem>
            <NavItem eventKey="settings" onClick={() => navigate("/dispatcher/dashboard/settings")}>
                <NavIcon>
                    <FiSettings style={{fontSize: '1.5em'}} />
                </NavIcon>
                <NavText>
                    Settings
                </NavText>
            </NavItem>
            <NavItem eventKey="logout" onClick={logout}>
                <NavIcon>
                    <HiOutlineLogout style={{fontSize: '1.5em'}}/>
                </NavIcon>
                <NavText>
                    Log out
                </NavText>
            </NavItem>
        </SideNav.Nav>
    </SideNav>

    )
}