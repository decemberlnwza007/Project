import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import Swal from "sweetalert2";

export default function InsertMenu() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [menuName, setMenuName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [info, setInfo] = useState('');
    const [picture, setPicture] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPicture(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!menuName || !quantity || !price || !info) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                text: 'ทุกช่องข้อมูลจำเป็นต้องกรอก',
                showConfirmButton: true,
                confirmButtonColor: "#17C964"
            });
            return;
        }

        const formData = new FormData();
        formData.append('menu_name', menuName);
        formData.append('qty', quantity);
        formData.append('price', price);
        formData.append('info', info);
        if (picture) formData.append('picture', picture);

        try {
            const response = await fetch('http://localhost:8000/menu', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'เพิ่มเมนูสำเร็จ',
                    text: 'คุณได้เพิ่มเมนูเรียบร้อยแล้ว',
                    showConfirmButton: false,
                    timer: 1500
                });
                setMenuName('');
                setQuantity('');
                setPrice('');
                setInfo('');
                setPicture(null);
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'เพิ่มเมนูไม่สำเร็จ',
                    text: result.message || 'ไม่สามารถเพิ่มเมนูได้',
                    showConfirmButton: true
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'เกิดข้อผิดพลาดในการเพิ่มเมนู กรุณาลองใหม่อีกครั้ง',
                showConfirmButton: true
            });
        }
    };

    return (
        <>
            <Button onPress={onOpen} color="success">เพิ่มเมนู</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">เพิ่มเมนู</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit}>
                                    <Input placeholder="ชื่อเมนู / Menu Name" value={menuName} onChange={(e) => setMenuName(e.target.value)} /> <br />
                                    <Input placeholder="ปริมาณ / Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} /> <br />
                                    <Input placeholder="ราคา / Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} /> <br />
                                    <Input placeholder="ข้อมูลเพิ่มเติม / Info" value={info} onChange={(e) => setInfo(e.target.value)} /> <br />
                                    <Input placeholder="เลือกรูปภาพ / Choose Image" type="file" onChange={handleFileChange} /> <br />
                                    <Button color="primary" type="submit" className="w-full">
                                        เพิ่มเมนู
                                    </Button>
                                </form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
