import React, { useState } from 'react';
import './ReferralProgram.css';

const ReferralProgram = () => {
    const [referralCode, setReferralCode] = useState('');
    const [referredEmails, setReferredEmails] = useState(['']);

    const generateReferralCode = () => {
        // Simple referral code generation
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        setReferralCode(code);
    };

    const addReferralEmail = () => {
        setReferredEmails([...referredEmails, '']);
    };

    const updateReferralEmail = (index, email) => {
        const newEmails = [...referredEmails];
        newEmails[index] = email;
        setReferredEmails(newEmails);
    };

    const submitReferrals = (e) => {
        e.preventDefault();
        // In a real app, this would send emails and track referrals
        const validEmails = referredEmails.filter(email => 
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        );
        
        if (validEmails.length > 0) {
            alert(`Referral emails sent: ${validEmails.join(', ')}`);
            // Reset form
            setReferredEmails(['']);
        } else {
            alert('Please enter valid email addresses');
        }
    };

    return (
        <section className="referral-program">
            <div className="referral-container">
                <h2>Refer & Earn</h2>
                <div className="referral-details">
                    <div className="referral-rewards">
                        <h3>Referral Rewards</h3>
                        <ul>
                            <li>$25 off for each successful referral</li>
                            <li>Referrer gets a 20% discount on next service</li>
                            <li>Unlimited referral potential</li>
                        </ul>
                    </div>
                    <div className="referral-code-section">
                        <h3>Your Referral Code</h3>
                        {!referralCode ? (
                            <button 
                                className="generate-code-btn"
                                onClick={generateReferralCode}
                            >
                                Generate Referral Code
                            </button>
                        ) : (
                            <div className="referral-code-display">
                                <p>Your Code: <strong>{referralCode}</strong></p>
                                <p>Share this code with friends!</p>
                            </div>
                        )}
                    </div>
                </div>
                <form onSubmit={submitReferrals} className="referral-form">
                    <h3>Refer Your Friends</h3>
                    {referredEmails.map((email, index) => (
                        <div key={index} className="referral-email-input">
                            <input
                                type="email"
                                placeholder="Friend's Email"
                                value={email}
                                onChange={(e) => updateReferralEmail(index, e.target.value)}
                                required
                            />
                        </div>
                    ))}
                    <div className="referral-form-actions">
                        <button 
                            type="button" 
                            className="add-email-btn"
                            onClick={addReferralEmail}
                        >
                            Add Another Email
                        </button>
                        <button 
                            type="submit" 
                            className="submit-referrals-btn"
                        >
                            Send Referral Invites
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ReferralProgram;
