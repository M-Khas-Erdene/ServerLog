import React, {useState, useEffect} from 'react';
import { Link, useLocation  } from 'react-router-dom';
import { useToken  } from '../utils/Const';
import errorIMG from '../assets/errorBack.jpg'; 
function ErrorPage() {
    const token = useToken();
    const location = useLocation();
    const [checkPath, setCheckPath] = useState();
    useEffect(()=>{ 
    if(location.pathname==="/admin"||location.pathname==="/"){
        setCheckPath(true);
    }
    else {
        setCheckPath(false);
    }

}, [location.pathname]);
const containerStyle = {
    backgroundImage: `url(${errorIMG})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh', 
    width:'100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textShadow: '2px 2px 4px #000',
    textAlign: 'center'
};
    if (!checkPath){
    return (
        <div className="container" style={containerStyle}>
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            <Link to="/" style={{ color: 'white', textDecoration: 'underline' }}>Go back to Home</Link>
        </div>
    );
    }
    else if (!token){
        return (
            <div className="container" style={containerStyle}>
            <h1>401 - Unauthorized</h1>
            <p>Sorry, Please log in.</p>
            <Link to="/" style={{ color: 'white', textDecoration: 'underline' }}>Go to Login</Link>
        </div>

        );
    }
    else {
        return (
            <div className="container" style={containerStyle}>
            <h1>401 - Unauthorized</h1>
            <p>Sorry, You haven't admin permissions. Please log in.</p>
            <Link to="/" style={{ color: 'white', textDecoration: 'underline' }}>Go to Login</Link>
        </div>

        );
    }
}

export default ErrorPage;
