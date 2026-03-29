import { useState,useContext,createContext } from "react";

const Authcontext=createContext()

export default function AuthProvider({children}){
    const [user,setUser]=useState(()=>{
        const token=localStorage.getItem("token")
        const username=localStorage.getItem("username")
        return token?{token,username}:null
    
    })
    const [role,setrole]=useState("");

    function login(token,username){
        localStorage.setItem("token",token)
        localStorage.setItem("username",username)
        setUser({ token, username })
    }   
    function logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("username")
    }

    return (
        <Authcontext.Provider value={{user,role,login,logout,setrole}}>
            {children}
        </Authcontext.Provider>
    )
}

export function useAuth(){
    return useContext(Authcontext)
}
