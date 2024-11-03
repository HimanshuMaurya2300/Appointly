import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { CalendarDays, PenBox } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import UserMenu from './UserMenu'
import { checkUser } from '@/lib/checkUser'

const Header = async () => {

    await checkUser()

    return (
        <nav className='mx-auto py-2 px-4 flex justify-between items-center shadow-md border-b-2'>
            <Link
                href={"/"}
                className='flex items-center'
            >
                {/* <Image
                    src="/logo.png"
                    alt="logo"
                    width={150}
                    height={150}
                    className='h-16 w-auto'
                /> */}
                <span className='text-4xl text-gray-800 p-2 font-semibold flex items-end gap-1'>
                    <CalendarDays size={40} />
                    Appointly
                </span>
            </Link>

            <div className='flex items-center gap-4'>
                <Link
                    href={"/events?create=true"}
                >
                    <Button className='flex items-center gap-2'>
                        <PenBox size={18} />
                        Create Event
                    </Button>
                </Link>

                <SignedOut>
                    <SignInButton forceRedirectUrl='/dashboard'>
                        <Button variant="outline">
                            Login
                        </Button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserMenu />
                </SignedIn>
            </div>
        </nav>
    )
}

export default Header