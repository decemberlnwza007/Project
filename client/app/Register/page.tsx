"use client"

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card"
import { Input } from "@nextui-org/input"
import { Button } from "@nextui-org/button"
import { Divider } from "@nextui-org/divider"
import Link from "next/link"
import { useState } from 'react'
import './Login.css'
import Swal from "sweetalert2"

export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!username || !password || !email || !name || !lastname) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                text: 'ทุกช่องข้อมูลจำเป็นต้องกรอก',
                showConfirmButton: true,
                confirmButtonColor: "#17C964"
            })
            return
        }

        const userData = { username, password, email, name, lastname, role: 'user' }

        try {
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })

            const result = await response.json()
            if (response.ok) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'สมัครสมาชิกสำเร็จ',
                    text: 'คุณได้สมัครสมาชิกเรียบร้อยแล้ว',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.href = '/'
                })
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'สมัครสมาชิกไม่สำเร็จ',
                    text: result.message || 'ไม่สามารถสมัครสมาชิกได้',
                    showConfirmButton: true
                })
            }
        } catch (error) {
            console.error('Error:', error)
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง',
                showConfirmButton: true
            })
        }
    }

    return (
        <center>
            <Card className="max-w-[400px]">
                <div className="fa-solid fa-lock"></div>
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                        <center>
                            <h1 className="text-lg">สมัครสมาชิก</h1>
                        </center>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <form onSubmit={handleSubmit}>
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
                        <Input
                            placeholder="อีเมลล์"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <br />
                        <Input
                            placeholder="ชื่อจริง"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <br />
                        <Input
                            placeholder="นามสกุล"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                        />
                        <br />
                        <Button type="submit" color="success" className="w-full">สมัครสมาชิก</Button>
                    </form>
                </CardBody>
                <Divider />
                <CardFooter>
                    มีบัญชีอยู่แล้วใช่ไหม ? &nbsp;
                    <Link href="/" className="register">เข้าสู่ระบบ</Link>
                </CardFooter>
            </Card>
        </center>
    )
}
