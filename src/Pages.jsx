import { Route, Routes, Navigate  } from "react-router-dom";
import { useEffect, useState } from "react";
import Sign from "./components/Sign";
import Login from "./components/Login";
import Data from "./components/Data";




function Pages (){

    const [loggedIn, setLoggedIn] = useState(false);

    const handleLogin = () => {
        setLoggedIn(true);
      };
    
    const handleLogout = () => {
        setLoggedIn(false);
      };  

    return(
        <Routes>
            <Route path="/chat/registration" element={loggedIn ?<Navigate replace to='/chat/:id' />: <Sign onLogin={handleLogin} />}/>
            <Route path="/chat/login" element={loggedIn ? <Navigate replace to='/chat/:id' /> : <Login onLogin={handleLogin} />}/>
            <Route path="/chat/:id" element={loggedIn?<Data onLogout={handleLogout}/>:<Navigate replace to='/chat/login' />}/> 
        </Routes>
    )
}

export default Pages;