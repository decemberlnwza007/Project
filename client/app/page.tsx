"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import Link from "next/link";
import axios from 'axios';
import './Login.css';

export default function Login() {
  const BASE_URL = 'http://localhost:8000';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/login`, { username, password });
      if (response.status === 200) {
        const { token, role } = response.data;
        localStorage.setItem('token', token);
        window.location.replace("/Home");
      } else {
        setError("Login failed");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <center>
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
          </form>
        </CardBody>
        <Divider />
        <CardFooter>
          ยังไม่มีบัญชีใช่หรือไม่? &nbsp;
          <Link href="/Register" className="register">สมัครสมาชิก</Link>
        </CardFooter>
      </Card>
    </center>
  );
}
