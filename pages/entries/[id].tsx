import { NextPageContext } from 'next'
import React from 'react'
import { json } from 'stream/consumers'
import { DB } from '../../utils/db'
import { Entry } from '../../utils/types/entry'

// getStaticPaths
export async function getStaticPaths() {
    const paths = DB.getInstance().GetPaths()
    console.log(paths)
    if (paths.length === 0) {
        return { paths: [], fallback: true }
    }
    return { paths: [], fallback: true }
    return {
      paths: [paths],
      fallback: true, // can also be true or 'blocking'
    }
}

// getStaticProps
export async function getStaticProps(context:any) {
    const id = context.params.id
    console.log("id")
    console.log(id) 
    console.log("keys",JSON.stringify(DB.getInstance().ListKeys()))
    return {
        // Passed to the page component as props
        props: { id },
        revalidate: 1
    }
}


// Page
export default function EntryPage({id }:any) {
    const [entry, setEntry] = React.useState<Entry|null|undefined>()
    const [loading, setLoading] = React.useState(true)
    const [isLocked, setIsLocked] = React.useState(true)
    const [failed, setFailed] = React.useState(false)
    const [pin, setPin] = React.useState("")
    const [type,setType] = React.useState("password")
    const toggleType = () => {
        if (type === "password") {
            setType("text")
        } else {
            setType("password")
        }
    }

    React.useEffect(() => {
        //startUp()
    }, [id])
    const startUp=async()=>{
    // fetch auth token from local storage if it exists
    // const authToken = localStorage.getItem('authToken')
    // if (!authToken) { // if no token, redirect to login page
    //     window.location.href = '/login'
    // }
    // fetch entry
    fetch(`/api/v1/entries/?title=${id}`, {
        // headers: {
        // 'Authorization': `Bearer ${authToken}`
        // }
    })
        .then((res) => {
            if (res.status === 200) {
                return res.json()
            }
            // window.location.href = '/NotFound'
        })
        .then((data) => {
        console.log(data)
        if (data) {
            setEntry(data)
        }
        setLoading(false)
        })
        .catch(console.log)
    }
    const fetchEntry = async () => {
        setIsLocked(false)
        setLoading(true)
        try{
            const response = await fetch(`/api/v1/entries/?title=${id}`, {
                headers: {
                'Authorization': `pin ${pin}`
                }
            })
            if (response.status === 401) {
                setFailed(true)
                setLoading(false)
                return
            }
            const data = await response.json()
            setEntry(data)
            setLoading(false)
        }catch(e){
            console.log(e)
            setLoading(false)
            setFailed(true)
        }
    }
    if (failed&&!loading){
        return <div className='bg-zinc-800 w-screen h-screen flex flex-col items-center justify-evenly px-[8rem] py-[2rem]'>
        <h1 className='font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
            {id}
        </h1>
        <p className='font-bold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 p-3 '>
            Incorrect Pin
        </p>
    </div>
    }
    if (isLocked){
        return <div className='bg-zinc-800 w-screen h-screen flex flex-col items-center justify-evenly px-[8rem] py-[2rem]'>
            <h1 className='font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
                {id}
            </h1>
            <p className='font-bold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
                This entry is locked. Please enter the password to unlock it.
            </p>
            <div className='flex flex-row gap-4'>
                <input type={type} className='w-[20rem] h-[3rem] rounded-md border-2 border-zinc-700 focus:border-purple-400 focus:outline-none px-4'  onChange={(e)=>setPin(e.target.value)}/>
                <button className='w-[2rem] flex flex-row justify-center items-center h-[3rem] rounded-md bg-gradient-to-r from-purple-400 to-pink-600 text-white font-bold hover:from-purple-500 hover:to-pink-700' onClick={toggleType}>
                    {type === 'password' ? <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
  <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
  <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
  <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
</svg> : <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
</svg>}
                </button>
            </div>
            <button className='w-[20rem] h-[3rem] rounded-md bg-purple-400 text-zinc-800 font-bold hover:bg-purple-500 focus:outline-none' 
            onClick={fetchEntry}>
                Unlock
            </button>
        </div>
    }
    if (loading){
        return <div className='bg-zinc-800 w-screen h-screen flex flex-col items-center justify-evenly px-[8rem] py-[2rem]'>
            <h1 className='font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
                {id}
            </h1>
            <p className='font-bold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 p-3 animate-pulse'>
                Loading...
            </p>
        </div>
    }
    return (
        <div className='bg-zinc-800 w-screen h-screen flex flex-col items-center justify-evenly px-[8rem] py-[2rem]'>
            {/* GRADIENT TEXT COLOR TAILWIND */}
            <h1 className='font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
                {entry?.title}
            </h1>
            {entry && (
                <div className='w-full flex flex-col gap-4'>
                    <div className='bg-zinc-600 w-full rounded-2xl aspect-textbox p-4'>{entry.body}</div>
                    <div className='w-full text-center p-4 bg-gradient-to-br to-blue-700 from-violet-700 rounded-2xl drop-shadow-2xl shadow-lg backdrop:blur-md hover:scale-95'
                    onClick={() => {
                        // copy to clipboard
                        navigator.clipboard.writeText(entry.body)
                    }}
                    >
                        Copy
                    </div>
                </div>
            )}
            {!entry && (
                <div className='w-full flex flex-col gap-4'>
                    <div className='bg-zinc-600 w-full rounded-2xl aspect-textbox p-4'>No entry found</div>
                </div>
            )}

        </div>
    )
}