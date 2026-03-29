import { useState,useContext,createContext } from "react";

const Authcontext=createContext()

export default function AuthProvider({children}){
    const [user,setUser]=useState(()=>{
        
        const username=sessionStorage.getItem("username")
        const id=sessionStorage.getItem("id")
        return id?{username,id}:null
    
    })
    const [role,setrole]=useState("");
    
    function login(token,user){
        localStorage.setItem("token",token)
        localStorage.setItem("username",user.name)
        sessionStorage.setItem("id",user.id)
        setUser({ id: user.id, username: user.name })
    }
    function logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        sessionStorage.removeItem("id")
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
