"use client"

import { useAuth } from "@/hooks/auth";


export default function Home() {
  const {} = useAuth({middleware:'auth'})

  return (<>
    <div className="text-5xl">Tis Logged In</div>
  </>
  );
}
