/**
 * COMPOSANT LOGIN MODAL avec i18n et thème
 * Modale de connexion avec 3 rôles (Admin/Médecin/Secrétaire)
 */

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../i18n';

export default function LoginModal({ onClose }) {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCabinet, setSelectedCabinet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const modalRef = useRef(null);

  const roles = [
    { id: 'admin', label: t('login.roles.admin.label'), emoji: '🔐', description: t('login.roles.admin.description') },
    { id: 'doctor', label: t('login.roles.doctor.label'), emoji: '👨‍⚕️', description: t('login.roles.doctor.description') },
    { id: 'secretary', label: t('login.roles.secretary.label'), emoji: '👩‍💼', description: t('login.roles.secretary.description') },
  ];

  const cabinets = [
    { id: 1, name: t('login.cabinets.rabat') },
    { id: 2, name: t('login.cabinets.casa') },
    { id: 3, name: t('login.cabinets.marrakech') },
  ];

  // Fermer modal au clic en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t('login.errors.fillAll'));
      return;
    }

    if (selectedRole !== 'admin' && !selectedCabinet) {
      setError(t('login.errors.selectCabinet'));
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simuler API
      alert(t('login.success'));
      onClose();
    } catch {
      setError(t('login.errors.connectionFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in-up">
        <div
            ref={modalRef}
            className="glass relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl border border-[hsl(var(--color-border))]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))]">{t('login.title')}</h2>
            <button
                onClick={onClose}
                className="text-[hsl(var(--color-foreground))] hover:text-[hsl(var(--color-primary))] transition-all text-2xl font-bold"
            >
              ✕
            </button>
          </div>

          {!selectedRole ? (
              // Sélection rôle
              <div>
                <p className="text-[hsl(var(--color-foreground))] mb-4 font-medium">{t('login.selectRole')}</p>
                <div className="grid gap-4">
                  {roles.map((role) => (
                      <button
                          key={role.id}
                          onClick={() => setSelectedRole(role.id)}
                          className="glass-hover p-4 rounded-xl border border-[hsl(var(--color-border))] text-left transition-all"
                      >
                        <div className="text-3xl mb-2">{role.emoji}</div>
                        <p className="font-semibold text-[hsl(var(--color-card-foreground))]">{role.label}</p>
                        <p className="text-sm text-[hsl(var(--color-foreground))]">{role.description}</p>
                      </button>
                  ))}
                </div>
              </div>
          ) : (
              // Formulaire login
              <div>
                <button
                    onClick={() => {
                      setSelectedRole(null);
                      setEmail('');
                      setPassword('');
                      setError('');
                    }}
                    className="mb-4 text-[hsl(var(--color-primary))] hover:text-[hsl(var(--color-primary-foreground))] text-sm font-medium"
                >
                  ← {t('login.changeRole')}
                </button>

                <p className="text-sm text-[hsl(var(--color-foreground))] mb-6 font-medium">
                  {t('login.connectedAs')} <span className="font-bold text-[hsl(var(--color-card-foreground))]">{roles.find(r => r.id === selectedRole)?.label}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-2">{t('login.fields.email')}</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('login.fields.emailPlaceholder')}
                        className="w-full px-4 py-2 rounded-lg border border-[hsl(var(--color-input))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary))] bg-[hsl(var(--color-card))] text-[hsl(var(--color-card-foreground))]"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-2">{t('login.fields.password')}</label>
                    <div className="relative">
                      <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={t('login.fields.passwordPlaceholder')}
                          className="w-full px-4 py-2 rounded-lg border border-[hsl(var(--color-input))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary))] bg-[hsl(var(--color-card))] text-[hsl(var(--color-card-foreground))]"
                      />
                      <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--color-foreground))]"
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  {/* Cabinet */}
                  {selectedRole !== 'admin' && (
                      <div>
                        <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-2">{t('login.fields.cabinet')}</label>
                        <select
                            value={selectedCabinet}
                            onChange={(e) => setSelectedCabinet(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-[hsl(var(--color-input))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary))] bg-[hsl(var(--color-card))] text-[hsl(var(--color-card-foreground))]"
                        >
                          <option value="">{t('login.fields.cabinetPlaceholder')}</option>
                          {cabinets.map((cabinet) => (
                              <option key={cabinet.id} value={cabinet.id}>
                                {cabinet.name}
                              </option>
                          ))}
                        </select>
                      </div>
                  )}

                  {/* Erreur */}
                  {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                      </div>
                  )}

                  {/* Mot de passe oublié */}
                  <div className="text-right">
                    <button type="button" className="text-sm text-[hsl(var(--color-primary))] hover:text-[hsl(var(--color-primary-foreground))] font-medium">
                      {t('login.forgotPassword')}
                    </button>
                  </div>

                  {/* Submit */}
                  <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isLoading ? t('login.submitting') : t('login.submitBtn')}
                  </button>
                </form>
              </div>
          )}
        </div>
      </div>
  );
}
