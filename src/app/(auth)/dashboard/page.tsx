"use client"

import { useAuth } from "@/hooks/auth";


export default function Home() {
  const {logout} = useAuth({middleware:'auth'})

  return (<>
    <div className="text-5xl">Tis Logged In</div>
    <button onClick={()=>{
      logout()
    }}>Logout</button>
  </>
  );
}
