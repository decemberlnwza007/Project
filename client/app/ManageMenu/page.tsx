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
import InsertMenu from "../InsertMenu/page"

interface MenuType {
    id: number
    menu_name: string
    qty: number
    price: number
    info: string
}

type ColumnKey = "menu_name" | "picture" | "qty" | "price" | "info" | "actions"

const columns = [
    { uid: "id", name: "ไอดี" },
    { uid: "menu_name", name: "ชื่อเมนู" },
    { uid: "qty", name: "ปริมาณ" },
    { uid: "price", name: "ราคา" },
    { uid: "info", name: "ข้อมูลเพิ่มเติม" },
    { uid: "actions", name: "จัดการ" }
]

export default function App() {
    const [menus, setMenus] = useState<MenuType[]>([])
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await fetch('http://localhost:8000/menu')
                const data = await response.json()
                if (data.data && Array.isArray(data.data)) {
                    setMenus(data.data)
                } else {
                    console.error('Fetched data is not an array:', data)
                }
            } catch (error) {
                console.error('Error fetching menus:', error)
            }
        }

        fetchMenus()
    }, [])

    const handleDelete = async (menuId: number) => {
        const result = await Swal.fire({
            title: 'คุณแน่ใจไหม?',
            text: 'คุณต้องการลบเมนูนี้หรือไม่?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:8000/menu/${menuId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setMenus(menus.filter(menu => menu.id !== menuId));
                    Swal.fire('ลบแล้ว!', 'เมนูได้ถูกลบออกแล้ว.', 'success');
                } else {
                    console.error('ลบเมนูล้มเหลว:', await response.text());
                    Swal.fire('ข้อผิดพลาด!', 'ลบเมนูล้มเหลว.', 'error');
                }
            } catch (error) {
                console.error('ข้อผิดพลาดในการลบเมนู:', error);
                Swal.fire('ข้อผิดพลาด!', 'เกิดข้อผิดพลาดขณะลบเมนู.', 'error');
            }
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value.toLowerCase())
    }

    const filteredMenus = menus.filter(menu =>
        menu.menu_name.toLowerCase().includes(searchQuery) ||
        menu.id.toString().includes(searchQuery)
    )

    const handleEdit = async (menu: MenuType) => {
        const { value: formValues } = await Swal.fire({
            title: 'แก้ไขข้อมูลเมนู',
            html: `
                <span>ชื่อเมนู</span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<input id="swal-input1" class="swal2-input" placeholder="ชื่อเมนู" value="${menu.menu_name}"> <br>
                <span>จำนวน</span> &nbsp; &nbsp;  &nbsp; &nbsp; <input id="swal-input2" class="swal2-input" placeholder="ปริมาณ" value="${menu.qty}">   <br>
               <span>ราคา</span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<input id="swal-input3" class="swal2-input" placeholder="ราคา" value="${menu.price}"> <br> 
               <br>
                <span>ข้อมูลเพิ่มเติม</span><input id="swal-input4" class="swal2-input" placeholder="ข้อมูลเพิ่มเติม" value="${menu.info}"> <br>
            `,
            focusConfirm: false,
            confirmButtonColor: "#17C964",
            confirmButtonText: "ยืนยัน",
            preConfirm: () => {
                const menuNameInput = Swal.getPopup()?.querySelector('#swal-input1') as HTMLInputElement;
                const qtyInput = Swal.getPopup()?.querySelector('#swal-input2') as HTMLInputElement;
                const priceInput = Swal.getPopup()?.querySelector('#swal-input3') as HTMLInputElement;
                const infoInput = Swal.getPopup()?.querySelector('#swal-input4') as HTMLInputElement;

                if (!menuNameInput || !qtyInput || !priceInput || !infoInput) {
                    throw new Error('Unable to find input elements');
                }

                return {
                    menu_name: menuNameInput.value,
                    qty: Number(qtyInput.value),
                    price: Number(priceInput.value),
                    info: infoInput.value
                }
            }
        });

        if (formValues) {
            try {
                const response = await axios.put(`http://localhost:8000/menu/${menu.id}`, formValues);
                if (response.status === 200) {
                    setMenus(menus.map(m =>
                        m.id === menu.id ? { ...m, ...formValues } : m
                    ));
                }
            } catch (error) {
                console.error('Error updating menu:', error)
            }
        }
    }

    const renderCell = React.useCallback((menu: MenuType, columnKey: ColumnKey) => {
        const cellValue = menu[columnKey as keyof MenuType]

        switch (columnKey) {
            case "menu_name":
                return cellValue as string;
            case "picture":
                return cellValue ? <img src={cellValue as string} alt="Menu" style={{ width: '100px', height: 'auto' }} /> : 'ไม่มีรูปภาพ';
            case "qty":
                return cellValue ? cellValue : 'N/A';
            case "price":
                return cellValue ? `$${cellValue}` : 'N/A';
            case "info":
                return cellValue ? cellValue : 'N/A';
            case "actions":
                return (
                    <>
                        <Button onClick={() => handleEdit(menu)} style={{ color: "#006FEE" }} color="primary" radius="lg" variant="ghost">แก้ไข</Button>
                        &nbsp;
                        <Button
                            size="md"
                            color="danger"
                            style={{ color: "#C20E4D" }}
                            variant="ghost"
                            radius="lg"
                            onClick={() => handleDelete(menu.id)}
                        >
                            ลบ
                        </Button>
                    </>
                )
            default:
                return cellValue
        }
    }, [menus])

    return (
        <>
            <Navbar />
            <br />
            <Input
                placeholder="ค้นหาเมนู"
                value={searchQuery}
                onChange={handleSearch}
                aria-label="Search menus"
                size="lg"
            />
            <br />
            <InsertMenu />
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
                <TableBody items={filteredMenus}>
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
