"use client";

import React, { useState, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Chip,
    Tooltip,
    Badge,
} from "@nextui-org/react";
import { Edit, Trash, Eye } from "lucide-react";
import Navbar from "@/components/navbar";

interface UserType {
    id: number;
    name: string;
    email: string;
    avatar: string;
    team: string;
}

type ColumnKey = "name" | "role" | "status" | "actions";

const columns = [
    { uid: "id", name: "id" },
    { uid: "name", name: "Name" },
    { uid: "role", name: "Role" },
    { uid: "status", name: "Status" },
    { uid: "actions", name: "Actions" }
];

export default function App() {
    const [users, setUsers] = useState<UserType[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8000/users');
                const data: UserType[] = await response.json();
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    console.error('Fetched data is not an array:', data);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };



        fetchUsers();
    }, []);

    const handleDelete = async (userId: number) => {
        try {
            const response = await fetch(`http://localhost:8000/delete/${userId}`, {
                method: 'DELETE',
            })
            if (response.ok) {
                window.location.reload()
            } else {
                console.error('Failed to delete user:', await response.text());
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };


    const renderCell = React.useCallback((user: UserType, columnKey: ColumnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: user.avatar }}
                        description={user.email}
                        name={cellValue}
                    >
                        {user.email}
                    </User>
                );
            case "role":
                return (
                    <Badge variant="flat">
                        {cellValue}
                    </Badge>
                );
            case "status":
                return (
                    <Chip className="capitalize" size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Details">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <Eye size={20} />
                            </span>
                        </Tooltip>
                        <Tooltip content="Edit user">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <Edit size={20} />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete user">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <Trash size={20} onClick={() => handleDelete(user.id)} />
                            </span>
                        </Tooltip>
                    </div>
                );

            default:
                return cellValue;
        }
    }, []);

    return (
        <>
            <Navbar />
            <br />
            <Table aria-label="Example table with custom cells">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={users}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey as ColumnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}
