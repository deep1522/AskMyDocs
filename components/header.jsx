import React from 'react'
import { SignedIn,SignedOut,SignInButton,UserButton,SignUpButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from 'lucide-react';
import { DropdownMenuSeparator,DropdownMenuItem,DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuLabel } from './ui/dropdown-menu';
// import { checkUser } from '../lib/checkUser';

const Header = async ()=>{
  // await checkUser();
return(
    <div>
      <header className='fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60'>
        <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
          <Link href="/">
          <Image src="/logo.png"
          alt='Sensai logo'
          width={200}
          height={60}
          className='h-12 py-1 w-auto object-contain'
          />
          </Link>
          <div className='flex items-center space-x-2 md:space-x-4'>
            <SignedIn>
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button variant="outline">Sign In</Button>
              </SignInButton>
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton appearance={{
                elements:{
                  avatarBox:'w-10 h-10',
                  userButtonPopoverCard:"shadow-xl",
                  userPreviewMainIdentifier:"font-semibold"
                }
              }}
              afterSignOutUrl='/'
              />
        </SignedIn>
          </div>
        </nav>
        </header>
    </div>
    );
};

export default Header