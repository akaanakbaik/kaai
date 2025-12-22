import React from 'react';
import { Link } from 'react-router-dom';
import { NeoButton } from '../components/NeoUI';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
            <h1 className="text-9xl font-black text-neo-red text-stroke">404</h1>
            <div className="bg-black text-white px-4 py-2 font-mono text-xl rotate-2">
                HALAMAN HILANG / BELUM DIBUAT
            </div>
            <p className="max-w-md font-bold">
                Ups! Sepertinya anda tersesat atau fitur AI sedang dalam pengembangan.
            </p>
            <Link to="/">
                <NeoButton variant="primary">KEMBALI KE RUMAH 🏠</NeoButton>
            </Link>
        </div>
    );
};

export default NotFound;
