import React from 'react'
import Image from 'next/image'

const Navbar: React.FC = () => {
    return (
        <nav className="bg-[#dac5fe] p-4 pl-6">
            <div className="flex items-center">
                <Image
                    src="/logo.png"
                    width={225}
                    height={225}
                    alt="Logo"
                />
            </div>
        </nav>
    )
}

export default Navbar