"use client";

import { useTypewriter } from 'react-simple-typewriter';
import { useEffect, useState } from 'react';
import { GoogleLogout } from "react-google-login";

import NavbarUser from '@/components/navbaruser';
import { Cursor } from "react-simple-typewriter";
import { Card } from "@nextui-org/card";

export default function Home() {
  const [text] = useTypewriter({
    words: ['Javascript Brew C4fe', 'จาวาสคริป บริว คาเฟ่'],
    loop: true,
  });

  const [profile, setProfile] = useState<any | null>(null)

  useEffect(() => {
    const storedProfile = localStorage.getItem('profile')
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile))
    }
  }, []);

  const logOut = () => {
    setProfile(null);
    localStorage.removeItem('profile')
    window.location.replace('/Home')
  };

  return (
    <>
      <NavbarUser />
      <center>
        <h1 style={{ margin: '50px', fontSize: '30px' }}>
          ยินดีต้อนรับสู่
          &nbsp;
          <span style={{ fontWeight: 'bold', color: '#936316' }}>
            {text} <Cursor />
          </span>
        </h1>
        {profile ? (
          <div>
            <img src={profile.imageUrl} alt="user image" />
            <h3>User Login</h3>
            <p>Name: {profile.name}</p>
            <p>Email: {profile.email}</p>
            <br />
            <br />
            <GoogleLogout
              clientId="278865605490-er3n1kdj47qpa1kacjae75gm52k4akke.apps.googleusercontent.com"
              buttonText="Log out"
              onLogoutSuccess={logOut}
            />
          </div>
        ) : (
            <h1></h1>
        )}
      </center>
    </>
  );
}
