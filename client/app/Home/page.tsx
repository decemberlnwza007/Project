"use client";

import Sidebar from "@/components/navbar";
import { useTypewriter } from 'react-simple-typewriter';

export default function Home() {
    const [text] = useTypewriter({
        words: ['Java Brew C4fe'],
        loop: true
    });

    return (
        <>
            <Sidebar />
            <center>
            <h1 style={{ margin: '50px', fontSize: '30px' }}>
                ยินดีต้อนรับสู่
                &nbsp;
                <span style={{ fontWeight: 'bold', color: '#936316' }}>
                    {text}
                </span>
            </h1>
            </center>
        </>
    );
}
