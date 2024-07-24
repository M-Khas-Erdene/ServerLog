
import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import Login from './components/Login';
import InputServer from "./admin/InputServer";
import AdminList from "./admin/ListServer";
import ClientList from "./client/ListServer";
import HistoryServer from "./client/HistoryServer";

function App() {
    const [logged,setLogged] = useState(false)
    const [role, setRole] = useState('');
    useEffect(()=>{ 
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setRole(decodedToken.role);
            setLogged(true);
        }
    },[]);

    return (
        
        <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            {logged ? (
                <>
                    {role === 'admin' && (
                        <Route path="/admin" element={
                            <div className="container">
                                <InputServer />
                                <AdminList />
                            </div>
                        } />
                    )}
                    {(
                        <Route path="/client" element={
                            <div className="container">
                                <ClientList />
                                <HistoryServer />
                            </div>
                        } />
                    )}
                </>
            ) : (
                <Route path="/" element={<Login />} />
            )}
        </Routes>
    </Router>
    );
}

export default App;
