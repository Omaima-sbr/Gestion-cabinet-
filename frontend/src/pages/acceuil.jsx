'use client';

import { useState } from 'react';
import Navbar from '../components/acceuil/navbar';
import Hero from '../components/acceuil/hero';
import Features from '../components/acceuil/features';
import TestimonialsCarousel from '../components/acceuil/testimonials';
import CTA from '../components/acceuil/cta';
import Footer from '../components/acceuil/footer';
import LoginModal from '../components/auth/login';
import SignupModal from '../components/auth/signup';
import ForgotPassword from '../components/auth/forgot-password';
import './global.css';

/**
 * PAGE D'ACCUEIL PRINCIPALE
 * Gère l'état des modales de login, inscription et mot de passe oublié
 */
export default function Home() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const handleForgotPassword = () => {
        setShowLogin(false);
        setShowForgotPassword(true);
    };

    return (
        <main
            className="min-h-screen overflow-hidden"
            style={{ backgroundColor: "hsl(var(--color-background))" }}
        >
            <Navbar
                onLoginClick={() => setShowLogin(true)}
                onSignupClick={() => setShowSignup(true)}
            />
            <Hero
                onLoginClick={() => setShowLogin(true)}
                onSignupClick={() => setShowSignup(true)}
            />
            <Features />
            <TestimonialsCarousel />
            <CTA
                onLoginClick={() => setShowLogin(true)}
                onSignupClick={() => setShowSignup(true)}
            />
            <Footer />

            {showLogin && (
                <LoginModal
                    onClose={() => setShowLogin(false)}
                    onForgotPassword={handleForgotPassword}
                />
            )}
            {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
            {showForgotPassword && <ForgotPassword onClose={() => setShowForgotPassword(false)} />}
        </main>
    );
}
