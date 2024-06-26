import React, { useState, useEffect } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import Link from "next/link";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { MdDashboard } from "react-icons/md";
import { FaDatabase } from "react-icons/fa"; // Example icon for "Master Data"
import { IoIosLogOut } from "react-icons/io";
import Image from 'next/image'
 
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("Dashboard");
  const router = useRouter();

  const menuItems = [
    { text: "Dashboard", href: "/dashboard", icon: <MdDashboard /> },
    { text: "Master Data", href: "/master-data", icon: <FaDatabase /> },
  ];

  const handleNavItemClick = (text: any) => {
    setActiveNavItem(text);
    setIsMenuOpen(false); // Close menu when a navigation item is clicked
  };

  useEffect(() => {}, [isMenuOpen]);

  const logout = () => { 
    Cookies.remove('token');
    router.push('/login'); 
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Image src="/logo.png" width={250} height={250} className="h-8 w-auto" alt="Logo" />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={index} isActive={activeNavItem === item.text}>
            <Link href={item.href} onClick={() => handleNavItemClick(item.text)}>
              <div className={`flex items-center hover:bg-secondary hover:rounded-lg hover:p-3 hover:text-primary hover:border-primary ${activeNavItem === item.text ? 'bg-primary p-3 rounded-lg text-white' : ''}`}>
                {item.icon}
                <span className="ml-2">{item.text}</span>
              </div>
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <button className="mii-btn-blue" onClick={logout}><IoIosLogOut /> Log Out</button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link
              color={index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"}
              className="w-full"
              href={item.href}
              size="lg"
              onClick={() => handleNavItemClick(item.text)}
            >
              <div className={`flex items-center ${activeNavItem === item.text ? 'text-primary font-bold' : ''}`}>
                {item.icon}
                <span className="ml-2">{item.text}</span>
              </div>
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <button className="mii-btn-blue w-full text-left" onClick={logout}> <IoIosLogOut /> Log Out</button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
