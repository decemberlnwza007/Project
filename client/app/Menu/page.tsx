"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import Navbar from "@/components/navbar";

export default function Menu() {

    interface MenuItem {
        id: number;
        menu_name: string;
        picture?: string;
        price: string;
        qty: number;
        info?: string;
    }

    const [menuList, setMenuList] = useState<MenuItem[]>([]);


    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch('http://localhost:8000/menu');
                if (!response.ok) {
                    throw new Error('Failed to fetch menu items');
                }
                const data = await response.json();
                setMenuList(data.data);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };

        fetchMenuItems();
    }, []);

    return (
        <>
            <Navbar />
            <br />
            <br />
            <div className="gap-5 grid grid-cols-2 sm:grid-cols-4">
                {menuList.map((item) => (
                    <Card shadow="sm" key={item.id} isPressable onPress={() => console.log("item pressed")}>
                        <CardBody className="overflow-visible p-0">
                            <Image
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={item.menu_name}
                                className="w-full object-cover h-[140px]"
                                src={item.picture || 'uploads/1725182845901.png'}
                            />
                        </CardBody>
                        <CardFooter className="text-small justify-between">
                            <b>{item.menu_name}</b>
                            <p className="text-default-500">{item.price}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );
}
