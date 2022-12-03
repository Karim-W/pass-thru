import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import styles from '../styles/Home.module.css'
import { Entry } from '../utils/types/entry'

export default function Home() {
  const [entry, setEntry] = React.useState<Entry>({} as Entry)
  const [isSubmited, setIsSubmited] = React.useState(false)
  const [pin, setPin] = React.useState("")
  const submit=async()=>{
    try{
      const response = await fetch('/api/v1/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      })
      if (response.status === 201) {
        setIsSubmited(true)
        const data = await response.json()
        setPin(data.pin)
      }

    }
    catch(e){
      console.log(e)
      setEntry({} as Entry)
    }
  }
  if (isSubmited) {
    return <div className="bg-zinc-800 w-screen h-screen flex flex-col items-center justify-evenly px-[8rem] py-[2rem]">
    <Head>
      <title>Pass-thru</title>
      <meta name="description" content="Pass stuff through idk" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <h1 className='font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
     Pass-Thru
    </h1>
    <p className='font-bold text-zinc-200 text-4xl  '>
      Pass stuff through, idk
    </p>
    <div className='flex flex-col items-center justify-start gap-8 w-full'>
      <p className='font-bold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 p-3 '>
        Your Pin is: {pin}
      </p>
      <button className='bg-zinc-900 text-zinc-200 font-bold text-2xl p-3 rounded-md flex flex-row gap-4 items-center justify-center hover:scale-95 drop-shadow-xl shadow-xl backdrop-blur-3xl' onClick={()=>{
        //copy to clipboard
        navigator.clipboard.writeText(pin)
      }}>
        Copy
        <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="currentColor" viewBox="0 0 16 16">
  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
</svg>
      </button>
      <p className='font-bold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 p-3 '>
        The Entry can be found at: <a href={`https://pass-thru.vercel.app/entries/${pin}`} className='text-zinc-200 hover:text-zinc-100'>https://pass-thru.vercel.app/entries/{pin}</a>
      </p>
      <button className='bg-zinc-900 text-zinc-200 font-bold text-2xl p-3 rounded-md flex flex-row gap-4 items-center justify-center hover:scale-95 drop-shadow-xl shadow-xl backdrop-blur-3xl' onClick={()=>{
        window.location.href="/entries/"+entry.title
      }}>
        Go to Entry
      </button>
      
    </div>

  </div>
  }
  return (
    <div className="bg-zinc-800 w-screen h-screen flex flex-col items-center justify-evenly px-[8rem] py-[2rem]">
      <Head>
        <title>Pass-thru</title>
        <meta name="description" content="Pass stuff through idk" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className='font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
       Pass-Thru
      </h1>
      <p className='font-bold text-zinc-200 text-4xl  '>
      Pass stuff through, idk
    </p>
      <div className='flex flex-col items-center justify-start gap-4 w-full'>
        <input value={entry.title} type='text' className='bg-zinc-900 text-white rounded-md p-2 w-full' placeholder='Enter a title'
        onChange={(e)=>setEntry({...entry, title: e.target.value})}/>
        <textarea value={entry.body} className='bg-zinc-900 text-white rounded-lg p-4 w-full h-[20rem]' placeholder='Enter text here'
        onChange={(e)=>setEntry({...entry, body: e.target.value})}/>
          <button className='bg-zinc-900 text-white rounded-lg p-4 w-[20rem] bg-gradient-to-r from-purple-900 to-pink-900 hover:scale-95' 
          onClick={submit}>Submit</button>
      </div>

    </div>
  )
}
