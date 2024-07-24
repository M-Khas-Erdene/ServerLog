
import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import Login from './components/Login';
import InputServer from "./admin/InputServer";
import AdminList from "./admin/ListServer";
import ClientList from "./client/ListServer";
import HistoryServer from "./client/HistoryServer";
function App() {
    const [logged,setLogged] = useState(false)
    useEffect(()=>{ 
        checkLogin();
    },[]);

    const checkLogin = ()=>{
        setLogged(true);
    }

    return (
        
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                {logged ? (
                    <>
                        <Route path="/admin" element={
                            <div className="container">
                                <InputServer />
                                <AdminList />
                            </div>
                        } />
                        <Route path="/client" element={
                            <div className="container">
                                <h1 className="mt-5 text-center">ML SERVERS</h1>
                                <ClientList />
                                <HistoryServer />
                            </div>
                        } />
                    </>
                ) : (
                    <Route path="/" element={<Login />} />
                )}
            </Routes>
        </Router>
    );
}

export default App;
