import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({
        login: '',
        motDePasse: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(credentials);
            navigate('/secretaire');
        } catch (err) {
            setError(err.response?.data?.message || 'Identifiants incorrects');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="logo">🏥</div>
                    <h1>Cabinet Médical</h1>
                    <p>Connectez-vous à votre espace</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-message">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="login">Identifiant</label>
                        <input
                            type="text"
                            id="login"
                            name="login"
                            value={credentials.login}
                            onChange={handleChange}
                            placeholder="Votre identifiant"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="motDePasse">Mot de passe</label>
                        <input
                            type="password"
                            id="motDePasse"
                            name="motDePasse"
                            value={credentials.motDePasse}
                            onChange={handleChange}
                            placeholder="Votre mot de passe"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-login"
                        disabled={loading}
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Mot de passe oublié ? Contactez l'administrateur</p>
                </div>
            </div>

            <div className="login-background">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>
        </div>
    );
};

export default LoginPage;