import { useState,useContext,createContext } from "react";

const Authcontext=createContext()

export default function AuthProvider({children}){
    const [user,setUser]=useState(()=>{
        const token=sessionStorage.getItem("token")
        const username=sessionStorage.getItem("username")
        return token?{token,username}:null
    
    })
    const [role,setrole]=useState("employee");
    
    function login(token,username){
        sessionStorage.setItem("token",token)
        sessionStorage.setItem("username",username)
setUser({ token, username })
    }
    function logout(){
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("username")
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
