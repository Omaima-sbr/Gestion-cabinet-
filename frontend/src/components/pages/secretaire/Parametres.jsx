import React, { useState, useEffect } from 'react';
import './Parametres.css';

const Parametres = () => {
    const [settings, setSettings] = useState({
        theme: localStorage.getItem('app-theme') || 'light',
        primaryColor: localStorage.getItem('app-primary-color') || '#667eea',
        fontSize: localStorage.getItem('app-font-size') || 'medium',
        language: localStorage.getItem('app-language') || 'fr',
        animations: localStorage.getItem('app-animations') !== 'false',
        compactMode: localStorage.getItem('app-compact-mode') === 'true'
    });

    const [saved, setSaved] = useState(false);

    useEffect(() => {
        applySettings(settings);
    }, []);

    const applySettings = (newSettings) => {
        // Appliquer le thème
        document.documentElement.setAttribute('data-theme', newSettings.theme);

        // Appliquer la couleur principale
        document.documentElement.style.setProperty('--primary-color', newSettings.primaryColor);

        // Appliquer la taille de police
        const fontSizes = {
            small: '14px',
            medium: '16px',
            large: '18px'
        };
        document.documentElement.style.setProperty('--base-font-size', fontSizes[newSettings.fontSize]);

        // Appliquer les animations
        if (!newSettings.animations) {
            document.documentElement.style.setProperty('--animation-duration', '0s');
        } else {
            document.documentElement.style.setProperty('--animation-duration', '0.3s');
        }

        // Mode compact
        document.documentElement.setAttribute('data-compact', newSettings.compactMode);
    };

    const handleChange = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        applySettings(newSettings);
    };

    const handleSave = () => {
        // Sauvegarder dans localStorage
        Object.keys(settings).forEach(key => {
            localStorage.setItem(`app-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, settings[key]);
        });

        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleReset = () => {
        const defaultSettings = {
            theme: 'light',
            primaryColor: '#667eea',
            fontSize: 'medium',
            language: 'fr',
            animations: true,
            compactMode: false
        };
        setSettings(defaultSettings);
        applySettings(defaultSettings);
    };

    const colorPresets = [
        { name: 'Violet', value: '#667eea' },
        { name: 'Bleu', value: '#3b82f6' },
        { name: 'Vert', value: '#10b981' },
        { name: 'Orange', value: '#f59e0b' },
        { name: 'Rose', value: '#ec4899' },
        { name: 'Rouge', value: '#ef4444' }
    ];

    return (
        <div className="parametres-page">
            <div className="page-header">
                <h1>⚙️ Paramètres de l'application</h1>
                <p className="header-subtitle">Personnalisez l'apparence et le comportement de votre interface</p>
            </div>

            {saved && (
                <div className="alert alert-success">
                    ✅ Paramètres sauvegardés avec succès !
                </div>
            )}

            <div className="settings-grid">
                {/* Thème */}
                <div className="settings-card">
                    <div className="card-header">
                        <h2>🎨 Apparence</h2>
                        <p>Choisissez le thème de l'application</p>
                    </div>
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">Thème</label>
                            <div className="theme-options">
                                <button
                                    className={`theme-btn ${settings.theme === 'light' ? 'active' : ''}`}
                                    onClick={() => handleChange('theme', 'light')}
                                >
                                    <span className="theme-icon">☀️</span>
                                    <span>Clair</span>
                                </button>
                                <button
                                    className={`theme-btn ${settings.theme === 'dark' ? 'active' : ''}`}
                                    onClick={() => handleChange('theme', 'dark')}
                                >
                                    <span className="theme-icon">🌙</span>
                                    <span>Sombre</span>
                                </button>
                                <button
                                    className={`theme-btn ${settings.theme === 'auto' ? 'active' : ''}`}
                                    onClick={() => handleChange('theme', 'auto')}
                                >
                                    <span className="theme-icon">🔄</span>
                                    <span>Auto</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Couleur principale */}
                <div className="settings-card">
                    <div className="card-header">
                        <h2>🎨 Couleur principale</h2>
                        <p>Personnalisez la couleur de l'interface</p>
                    </div>
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">Couleur actuelle</label>
                            <div className="color-preview" style={{ background: settings.primaryColor }}>
                                <input
                                    type="color"
                                    value={settings.primaryColor}
                                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                                    className="color-picker"
                                />
                                <span className="color-value">{settings.primaryColor}</span>
                            </div>
                        </div>

                        <div className="setting-group">
                            <label className="setting-label">Couleurs prédéfinies</label>
                            <div className="color-presets">
                                {colorPresets.map(preset => (
                                    <button
                                        key={preset.value}
                                        className={`color-preset ${settings.primaryColor === preset.value ? 'active' : ''}`}
                                        style={{ background: preset.value }}
                                        onClick={() => handleChange('primaryColor', preset.value)}
                                        title={preset.name}
                                    >
                                        {settings.primaryColor === preset.value && '✓'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Taille de texte */}
                <div className="settings-card">
                    <div className="card-header">
                        <h2>📏 Taille du texte</h2>
                        <p>Ajustez la lisibilité du contenu</p>
                    </div>
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">Taille de police</label>
                            <div className="size-options">
                                <button
                                    className={`size-btn ${settings.fontSize === 'small' ? 'active' : ''}`}
                                    onClick={() => handleChange('fontSize', 'small')}
                                >
                                    <span style={{ fontSize: '14px' }}>A</span>
                                    <span>Petit</span>
                                </button>
                                <button
                                    className={`size-btn ${settings.fontSize === 'medium' ? 'active' : ''}`}
                                    onClick={() => handleChange('fontSize', 'medium')}
                                >
                                    <span style={{ fontSize: '16px' }}>A</span>
                                    <span>Moyen</span>
                                </button>
                                <button
                                    className={`size-btn ${settings.fontSize === 'large' ? 'active' : ''}`}
                                    onClick={() => handleChange('fontSize', 'large')}
                                >
                                    <span style={{ fontSize: '18px' }}>A</span>
                                    <span>Grand</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Langue */}
                <div className="settings-card">
                    <div className="card-header">
                        <h2>🌍 Langue</h2>
                        <p>Choisissez la langue de l'interface</p>
                    </div>
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">Langue</label>
                            <select
                                className="setting-select"
                                value={settings.language}
                                onChange={(e) => handleChange('language', e.target.value)}
                            >
                                <option value="fr">🇫🇷 Français</option>
                                <option value="ar">🇲🇦 العربية</option>
                                <option value="en">🇬🇧 English</option>
                                <option value="es">🇪🇸 Español</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Options avancées */}
                <div className="settings-card">
                    <div className="card-header">
                        <h2>⚡ Options avancées</h2>
                        <p>Personnalisez le comportement de l'interface</p>
                    </div>
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={settings.animations}
                                    onChange={(e) => handleChange('animations', e.target.checked)}
                                    className="toggle-input"
                                />
                                <span className="toggle-switch"></span>
                                <span className="toggle-text">
                                    <strong>Animations</strong>
                                    <span className="toggle-description">Activer les transitions animées</span>
                                </span>
                            </label>
                        </div>

                        <div className="setting-group">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={settings.compactMode}
                                    onChange={(e) => handleChange('compactMode', e.target.checked)}
                                    className="toggle-input"
                                />
                                <span className="toggle-switch"></span>
                                <span className="toggle-text">
                                    <strong>Mode compact</strong>
                                    <span className="toggle-description">Réduire les espacements</span>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Aperçu */}
                <div className="settings-card preview-card">
                    <div className="card-header">
                        <h2>👁️ Aperçu</h2>
                        <p>Visualisez vos changements</p>
                    </div>
                    <div className="card-content">
                        <div className="preview-content">
                            <button className="preview-btn preview-primary">Bouton principal</button>
                            <button className="preview-btn preview-secondary">Bouton secondaire</button>
                            <div className="preview-card-sample">
                                <h4>Carte exemple</h4>
                                <p>Ceci est un exemple de texte avec la taille actuelle.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="settings-actions">
                <button className="btn-reset" onClick={handleReset}>
                    🔄 Réinitialiser
                </button>
                <button className="btn-save" onClick={handleSave}>
                    💾 Sauvegarder les paramètres
                </button>
            </div>
        </div>
    );
};

export default Parametres;