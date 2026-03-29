import { useState,useContext,createContext } from "react";

const Authcontext=createContext()

export default function AuthProvider({children}){
    const [user,setUser]=useState(()=>{
        const token=localStorage.getItem("token")
        const username=localStorage.getItem("username")
        const id=localStorage.getItem("id")
        return token?{token,username,id}:null
    })
    const [role,setrole]=useState(()=>{
        return localStorage.getItem("role") || ""
    });

    function login(token,username,id,userRole){
        localStorage.setItem("token",token)
        localStorage.setItem("username",username)
        localStorage.setItem("id",id)
        localStorage.setItem("role",userRole)
        setUser({ token, username, id })
        setrole(userRole)
    }   
    function logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        localStorage.removeItem("id")
        localStorage.removeItem("role")
        setUser(null)
        setrole("")
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