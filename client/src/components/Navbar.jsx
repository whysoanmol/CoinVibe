import { useState } from "react"

export default function Navbar() {

  const[loggedIn, setLoggedIn] = useState(false)

  return (
    <div className='px-4 py-2  bg-[#191A23] rounded flex justify-between items-center font-semibold text-sm lg:text-xl lg:py-4'>
      <p className="">My Coins</p>
      {
        loggedIn &&
        <>
          <ul className='flex space-x-4'>
            <li><span className="material-symbols-outlined cursor-pointer">monetization_on</span></li>
            <li><span className="material-symbols-outlined cursor-pointer">monitoring</span></li>
            <li className='relative'>
              <div className='p-1 h-1 w-1 absolute bg-blue-600 right-0 rounded-full'></div>
              <span className="material-symbols-outlined cursor-pointer">notifications</span>
            </li>
          </ul>
        </>
      }
      {loggedIn ? 
        <span class="material-symbols-outlined cursor-pointer">account_circle</span> : 
        <button className="bg-yellow-600 px-2 py-1 rounded">LogIn</button>
      }
      
    </div>
  )
}
