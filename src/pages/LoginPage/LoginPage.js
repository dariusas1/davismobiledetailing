import './LoginPage.css';
import logo from '../../assets/images/logo.png';
import { AppContext } from '../../App';
import { useContext } from 'react';

const LoginPage = () => {
    const {
        loginForm,
        setLoginForm,
        login
    } = useContext(AppContext);

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={login}>
                <img src={logo} />
                <div className="login-form-inputs">
                    <input
                        type="email"
                        required
                        placeholder="Email"
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        value={loginForm.email}
                    />
                    <input
                        type="password"
                        required
                        placeholder="Password"
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        value={loginForm.password}
                    />
                </div>
                <button type="submit">Login</button>
                {loginForm.error && <p className="login-form-error">{loginForm.error}</p>}
            </form>
        </div>
    )
};

export default LoginPage;