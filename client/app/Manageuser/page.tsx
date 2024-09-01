"use client"

import React, { useState, useEffect } from "react"
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Chip,
    Badge,
    Button,
    Input
} from "@nextui-org/react"
import Navbar from "@/components/navbar"
import axios from "axios"
import Swal from 'sweetalert2'
import Insert from "../InsertUser/page"

interface UserType {
    id: number
    username: string
    name: string
    lastname: string
    email: string
    avatar: string
    team: string
    role: string
}

type ColumnKey = "name" | "role" | "status" | "actions"

const columns = [
    { uid: "id", name: "ไอดี" },
    { uid: "username", name: "ชื่อผู้ใช้" },
    { uid: "name", name: "ชื่อ" },
    { uid: "lastname", name: "นามสกุล" },
    { uid: "role", name: "ตำแหน่ง" },
    { uid: "actions", name: "จัดการ" }
]

export default function App() {
    const [users, setUsers] = useState<UserType[]>([])
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8000/users')
                const data: UserType[] = await response.json()
                if (Array.isArray(data)) {
                    setUsers(data)
                } else {
                    console.error('Fetched data is not an array:', data)
                }
            } catch (error) {
                console.error('Error fetching users:', error)
            }
        }

        fetchUsers()
    }, [])

    const handleDelete = async (userId: number) => {
        const result = await Swal.fire({
            title: 'คุณแน่ใจไหม?',
            text: 'คุณต้องการลบผู้ใช้นี้หรือไม่?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:8000/delete/${userId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setUsers(users.filter(user => user.id !== userId));
                    Swal.fire('ลบแล้ว!', 'ผู้ใช้ได้ถูกลบออกแล้ว.', 'success');
                } else {
                    console.error('ลบผู้ใช้ล้มเหลว:', await response.text());
                    Swal.fire('ข้อผิดพลาด!', 'ลบผู้ใช้ล้มเหลว.', 'error');
                }
            } catch (error) {
                console.error('ข้อผิดพลาดในการลบผู้ใช้:', error);
                Swal.fire('ข้อผิดพลาด!', 'เกิดข้อผิดพลาดขณะลบผู้ใช้.', 'error');
            }
        }
    };




    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value.toLowerCase())
    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery) ||
        user.email.toLowerCase().includes(searchQuery) ||
        user.id.toString().includes(searchQuery)
    )

    const handleEdit = async (user: UserType) => {
        const { value: formValues } = await Swal.fire({
            title: 'แก้ไขข้อมูลผู้ใช้',
            html: `
                <span>ชื่อผู้ใช้</span><input id="swal-input1" class="swal2-input" placeholder="ชื่อผู้ใช้" value="${user.username}" disabled> <br>
                <span>ชื่อ</span> &nbsp; &nbsp; &nbsp; <input id="swal-input2" class="swal2-input" placeholder="ชื่อ" value="${user.name}">   <br>
               <span>สกุล</span> &nbsp; &nbsp;<input id="swal-input3" class="swal2-input" placeholder="นามสกุล" value="${user.lastname}"> <br>
                
                <span>อีเมลล์</span><input id="swal-input4" class="swal2-input" placeholder="อีเมล" value="${user.email}"> <br>
            `,
            focusConfirm: false,
            confirmButtonColor: "#17C964",
            confirmButtonText: "ยืนยัน",
            preConfirm: () => {
                const usernameInput = Swal.getPopup()?.querySelector('#swal-input1') as HTMLInputElement;
                const nameInput = Swal.getPopup()?.querySelector('#swal-input2') as HTMLInputElement;
                const lastnameInput = Swal.getPopup()?.querySelector('#swal-input3') as HTMLInputElement;
                const emailInput = Swal.getPopup()?.querySelector('#swal-input4') as HTMLInputElement;

                if (!usernameInput || !nameInput || !lastnameInput || !emailInput) {
                    throw new Error('Unable to find input elements');
                }

                return {
                    username: usernameInput.value,
                    name: nameInput.value,
                    lastname: lastnameInput.value,
                    email: emailInput.value
                }
            }
        });

        if (formValues) {
            try {
                const response = await axios.put(`http://localhost:8000/users/${user.id}`, {
                    name: formValues.name,
                    lastname: formValues.lastname,
                    email: formValues.email
                });
                if (response.status === 200) {
                    setUsers(users.map(u =>
                        u.id === user.id ? { ...u, name: formValues.name, lastname: formValues.lastname, email: formValues.email } : u
                    ));
                }
            } catch (error) {
                console.error('Error updating user:', error)
            }
        }
    }



    const renderCell = React.useCallback((user: UserType, columnKey: ColumnKey) => {
        const cellValue = user[columnKey as keyof UserType]

        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: user.avatar }}
                        description={user.email}
                        name={cellValue as string}
                    >
                        {user.email}
                    </User>
                )
            case "role":
                return (
                    <Badge variant="flat">
                        {cellValue ? cellValue : 'N/A'}
                    </Badge>
                )
            case "status":
                return (
                    <Chip className="capitalize" size="sm" variant="flat">
                        {cellValue ? cellValue : 'N/A'}
                    </Chip>
                )
            case "actions":
                return (
                    <>
                        <Button onClick={() => handleEdit(user)} style={{ color: "#006FEE" }} color="primary" radius="lg" variant="ghost">แก้ไข</Button>
                        &nbsp;
                        <Button
                            size="md"
                            color="danger"
                            style={{ color: "#C20E4D" }}
                            variant="ghost"
                            radius="lg"
                            onClick={() => handleDelete(user.id)}
                        >
                            ลบ
                        </Button>
                    </>
                )
            default:
                return cellValue
        }
    }, [users])

    return (
        <>
            <Navbar />
            <br />
            <Input
                placeholder="ค้นหาผู้ใช้"
                value={searchQuery}
                onChange={handleSearch}
                aria-label="Search users"
                size="lg"
            />
            <br />
            <Insert />
            <br />
            <br />
            <Table aria-label="Example table with custom cells">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={filteredUsers}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey as ColumnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}
