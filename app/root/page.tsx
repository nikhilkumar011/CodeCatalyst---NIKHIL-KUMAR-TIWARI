"use client";

import { useState} from "react";
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

  return (
  <main><div><form action="submit"><
    input type="file"
    id="file" name="file" 
    onChange={(e)=>setFile(e.target.files?.[0])} />
      <input type="submit" value="upload" /></form></div></main>    
  );
}
