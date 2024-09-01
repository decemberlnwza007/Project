"use client"

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card"
import { useState, useEffect } from "react"
import { Input } from "@nextui-org/input"
import { Button } from "@nextui-org/button"
import { Divider } from "@nextui-org/divider"
import Link from "next/link"
import axios from 'axios'
import './Login.css'

import { GoogleLogin, GoogleLogout } from "react-google-login"
import { gapi } from "gapi-script"

interface Profile {
  imageUrl: string
  name: string
  email: string
}

export default function Login() {
  const clientId = "278865605490-er3n1kdj47qpa1kacjae75gm52k4akke.apps.googleusercontent.com"
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: ''
      })
    }
    gapi.load("client:auth2", initClient)

    const cursorDot = document.querySelector("[data-cursor-dot]") as HTMLElement | null;
    const cursorOutline = document.querySelector("[data-cursor-outline]") as HTMLElement | null;

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorDot) {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
      }
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [clientId]);

  const onSuccess = (res: any) => {
    setProfile(res.profileObj)
    localStorage.setItem('profile', JSON.stringify(res.profileObj))
    window.location.replace('/Home')
  }

  const onFailure = (res: any) => {
    console.log(res)
  }

  const logOut = () => {
    setProfile(null)
    localStorage.removeItem('profile')
    window.location.replace('/Home')
  }

  const BASE_URL = 'http://localhost:8000'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await axios.post(`${BASE_URL}/login`, { username, password })
      if (response.status === 200) {
        const { token, role } = response.data
        if (role === 'admin') {
          window.location.replace('/Home')
          localStorage.setItem('token', token)
        } else if (role === 'user') {
          window.location.replace('/HomeUser')
          localStorage.setItem('token', token)
        }
      } else {
        setError("Login failed")
      }
    } catch (error) {
      console.error(error)
      setError("An error occurred. Please try again later.")
    }
  }

  return (
    <div className="body">
      <center>
        <div data-cursor-dot className="cursor-dot"></div>
        <div data-cursor-outline className="cursor-outline"></div>

        <Card className="max-w-[400px]">
          <div className="fa-solid fa-lock"></div>
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <center>
                <h1 className="text-lg">เข้าสู่ระบบ</h1>
              </center>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <form onSubmit={handleLogin}>
              <Input
                placeholder="ชื่อผู้ใช้"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <br />
              <Input
                type="password"
                placeholder="รหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit" color="success" className="w-full">
                เข้าสู่ระบบ
              </Button>
              <br />
              <br />
              <center>
                <div>
                  <Divider />
                  <br />
                  {profile ? (
                    <div>
                      <img src={profile.imageUrl} alt="user image" />
                      <h3>User Login</h3>
                      <p>Name: {profile.name}</p>
                      <p>Email: {profile.email}</p>
                      <br />
                      <br />
                      <GoogleLogout
                        clientId={clientId}
                        buttonText="Log out"
                        onLogoutSuccess={logOut}
                      />
                    </div>
                  ) : (
                    <GoogleLogin
                      clientId={clientId}
                      buttonText="เข้าสู่ระบบด้วย Google"
                      onSuccess={onSuccess}
                      onFailure={onFailure}
                      cookiePolicy={'single_host_origin'}
                      isSignedIn={true}
                    />
                  )}
                </div>
              </center>
            </form>
          </CardBody>
          <Divider />
          <CardFooter>
            ยังไม่มีบัญชีใช่หรือไม่? &nbsp;
            <Link href="/Register" className="register">สมัครสมาชิก</Link>
          </CardFooter>
        </Card>

      </center >
    </div>

  )
}
