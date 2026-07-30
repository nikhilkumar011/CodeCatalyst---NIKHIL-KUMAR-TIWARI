"use client";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useEffect, useState} from "react";
export default function Home() {
  
  const [file,setFile]=useState<File>()

  const onsubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()

    if (!file) return 

    try {

      const data = new FormData()
      data.set('file',file)

      const res = await fetch ('/api/upload',{
        method:'POST',
        body : data
      })
      if (!res.ok) throw new Error(await res.text())
    }catch (e: any){
  console.error(e)}
  }

  useEffect(() => {
  const checkSession = async () => {
    const { data } = await authClient.getSession();

    if (!data) {
      window.location.href = "/login";
    }
  };

  checkSession();
}, []);

  const logout = async () => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.href = "/login";
      },
    },
  });
};

  return (
  <main><div><form action="submit"><
    input type="file"
    id="file" name="file" 
    onChange={(e)=>setFile(e.target.files?.[0])} />
      <input type="submit" value="upload" /></form>
      <button onClick={logout}>Logout</button>
      </div></main>    
  );
}
