import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Insert() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
                    title: 'เพิ่มสมาชิกสำเร็จ',
                    text: 'คุณได้เพิ่มสมาชิกเรียบร้อยแล้ว',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'เพิ่มสมาชิกไม่สำเร็จ',
                    text: result.message || 'ไม่สามารถเพิ่มสมาชิกได้',
                    showConfirmButton: true
                })
            }
        } catch (error) {
            console.error('Error:', error)
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'เกิดข้อผิดพลาดในการเพิ่มสมาชิก กรุณาลองใหม่อีกครั้ง',
                showConfirmButton: true
            })
        }
    }

    return (
        <>
            <Button onPress={onOpen} color="success">เพิ่มข้อมูล</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">เพิ่มข้อมูล</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit}>
                                    <Input placeholder="ชื่อผู้ใช้ / Username " value={username} onChange={(e) => setUsername(e.target.value)} /> <br />
                                    <Input placeholder="ชื่อ / Name " value={name} onChange={(e) => setName(e.target.value)} />  <br />
                                    <Input placeholder="รหัสผ่าน / Password " value={password} onChange={(e) => setPassword(e.target.value)} /> <br />
                                    <Input placeholder="นามสกุล / Lastname " value={lastname} onChange={(e) => setLastname(e.target.value)} /> <br />
                                    <Input placeholder="อีเมลล์ / Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
                                    <Button color="primary" type="submit" className="w-full" >
                                        เพิ่มสมาชิก
                                    </Button>
                                </form>
                            </ModalBody>
                            <ModalFooter>


                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
