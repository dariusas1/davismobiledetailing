import React, { useState, useEffect } from 'react';
import './CustomerPortal.css';

const CustomerPortal = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [serviceHistory, setServiceHistory] = useState([]);
    const [loginCredentials, setLoginCredentials] = useState({
        email: '',
        password: ''
    });

    // Mock login function (replace with actual authentication later)
    const handleLogin = (e) => {
        e.preventDefault();
        // Simulated login logic
        if (loginCredentials.email && loginCredentials.password) {
            setIsLoggedIn(true);
            setUser({
                name: 'John Doe',
                email: loginCredentials.email
            });
            // Fetch service history
            fetchServiceHistory();
        }
    };

    // Mock service history fetch
    const fetchServiceHistory = () => {
        // In a real app, this would be an API call
        const mockServiceHistory = [
            {
                id: 1,
                date: '2024-01-15',
                service: 'Premium Detailing',
                vehicle: 'Tesla Model 3',
                cost: 250,
                status: 'Completed'
            },
            {
                id: 2,
                date: '2023-11-20',
                service: 'Basic Wash',
                vehicle: 'Toyota Camry',
                cost: 75,
                status: 'Completed'
            }
        ];
        setServiceHistory(mockServiceHistory);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        setServiceHistory([]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <section className="customer-portal">
            <div className="portal-container">
                {!isLoggedIn ? (
                    <div className="login-section">
                        <h2>Customer Portal</h2>
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={loginCredentials.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={loginCredentials.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="login-btn">
                                Login
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="dashboard-section">
                        <div className="dashboard-header">
                            <h2>Welcome, {user.name}</h2>
                            <button onClick={handleLogout} className="logout-btn">
                                Logout
                            </button>
                        </div>
                        <div className="service-history">
                            <h3>Service History</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Service</th>
                                        <th>Vehicle</th>
                                        <th>Cost</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {serviceHistory.map(service => (
                                        <tr key={service.id}>
                                            <td>{service.date}</td>
                                            <td>{service.service}</td>
                                            <td>{service.vehicle}</td>
                                            <td>${service.cost}</td>
                                            <td>{service.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CustomerPortal;
