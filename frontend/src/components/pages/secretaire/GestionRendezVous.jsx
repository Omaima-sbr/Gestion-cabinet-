import React, { useState, useEffect } from 'react';
import './GestionRendezVous.css';
import apiService from '../../../services/apiService.js';

const GestionRendezVous = () => {
    const [rendezVous, setRendezVous] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showNewRdvModal, setShowNewRdvModal] = useState(false);

    useEffect(() => {
        loadRendezVous();
    }, []);

    const loadRendezVous = async () => {
        try {
            setLoading(true);
            setError(null);

            // Essayer d'abord getDuJour si getAll échoue
            let data;
            try {
                data = await apiService.rendezVous.getAll();
            } catch (err) {
                console.warn('getAll failed, trying getDuJour:', err);
                data = await apiService.rendezVous.getDuJour();
            }

            console.log('✅ Rendez-vous chargés:', data);
            setRendezVous(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || 'Erreur lors du chargement des rendez-vous');
            console.error('❌ Erreur chargement RDV:', err);
            setRendezVous([]);
        } finally {
            setLoading(false);
        }
    };

    // Obtenir les jours du mois
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Lundi = 0

        const days = [];

        // Jours du mois précédent
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const prevDate = new Date(year, month, -i);
            days.push({ date: prevDate, isCurrentMonth: false });
        }

        // Jours du mois actuel
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ date: new Date(year, month, i), isCurrentMonth: true });
        }

        // Jours du mois suivant
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
        }

        return days;
    };

    // Obtenir les RDV pour une date donnée
    const getRendezVousForDate = (date) => {
        return rendezVous.filter(rdv => {
            const rdvDate = new Date(rdv.dateHeure);
            return rdvDate.toDateString() === date.toDateString();
        });
    };

    // Changer de mois
    const changeMonth = (delta) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
    };

    // Formater la date
    const formatMonthYear = (date) => {
        return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
    };

    // Obtenir le statut
    const getStatutInfo = (statut) => {
        const statuts = {
            'CONFIRME': { label: 'Confirmé', class: 'status-confirme' },
            'EN_ATTENTE': { label: 'En attente', class: 'status-attente' },
            'ANNULE': { label: 'Annulé', class: 'status-annule' },
            'TERMINE': { label: 'Terminé', class: 'status-termine' }
        };
        return statuts[statut] || { label: statut, class: 'status-default' };
    };

    const days = getDaysInMonth(currentDate);
    const rdvsSelectedDate = getRendezVousForDate(selectedDate);

    return (
        <div className="gestion-rendez-vous">
            {/* En-tête */}
            <div className="page-header">
                <h1>📅 Gestion des Rendez-vous</h1>
                <div className="header-actions">
                    <button className="btn-primary" onClick={() => setShowNewRdvModal(true)}>
                        + Nouveau RDV
                    </button>
                    <button
                        className="btn-refresh"
                        onClick={loadRendezVous}
                        disabled={loading}
                    >
                        🔄 {loading ? 'Chargement...' : 'Actualiser'}
                    </button>
                </div>
            </div>

            {/* Message d'erreur */}
            {error && (
                <div className="alert alert-error">
                    <span className="alert-icon">⚠️</span>
                    <div>
                        <strong>Erreur</strong>
                        <p>{error}</p>
                    </div>
                    <button className="alert-close" onClick={() => setError(null)}>×</button>
                </div>
            )}

            <div className="calendar-container">
                {/* Calendrier principal */}
                <div className="calendar-main">
                    {/* Navigation */}
                    <div className="calendar-nav">
                        <button className="nav-btn" onClick={() => changeMonth(-1)}>
                            ← Mois précédent
                        </button>
                        <h2 className="current-month">{formatMonthYear(currentDate)}</h2>
                        <button className="nav-btn" onClick={() => changeMonth(1)}>
                            Mois suivant →
                        </button>
                    </div>

                    {/* Grille calendrier */}
                    <div className="calendar-grid">
                        {/* Jours de la semaine */}
                        {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(day => (
                            <div key={day} className="calendar-day-header">
                                {day}
                            </div>
                        ))}

                        {/* Jours du mois */}
                        {loading ? (
                            <div className="calendar-loading">
                                <div className="spinner"></div>
                                <p>Chargement des rendez-vous...</p>
                            </div>
                        ) : (
                            days.map((day, index) => {
                                const dayRdvs = getRendezVousForDate(day.date);
                                const isToday = day.date.toDateString() === new Date().toDateString();
                                const isSelected = day.date.toDateString() === selectedDate.toDateString();

                                return (
                                    <div
                                        key={index}
                                        className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayRdvs.length > 0 ? 'has-rdv' : ''}`}
                                        onClick={() => setSelectedDate(day.date)}
                                    >
                                        <div className="day-number">{day.date.getDate()}</div>
                                        {dayRdvs.length > 0 && (
                                            <div className="day-rdvs">
                                                {dayRdvs.slice(0, 3).map(rdv => (
                                                    <div key={rdv.id} className="rdv-indicator">
                            <span className="rdv-time">
                              {new Date(rdv.dateHeure).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                              })}
                            </span>
                                                        <span className="rdv-patient">{rdv.patient?.nom}</span>
                                                    </div>
                                                ))}
                                                {dayRdvs.length > 3 && (
                                                    <div className="rdv-more">+{dayRdvs.length - 3} autre(s)</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Sidebar détails */}
                <div className="calendar-sidebar">
                    <div className="sidebar-header">
                        <h3>
                            {selectedDate.toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </h3>
                    </div>

                    <div className="sidebar-content">
                        {rdvsSelectedDate.length === 0 ? (
                            <div className="no-rdv">
                                <div className="no-rdv-icon">📅</div>
                                <p>Aucun rendez-vous prévu</p>
                            </div>
                        ) : (
                            <div className="rdv-list">
                                {rdvsSelectedDate.map(rdv => {
                                    const statutInfo = getStatutInfo(rdv.statut);
                                    return (
                                        <div key={rdv.id} className="rdv-card">
                                            <div className="rdv-header">
                        <span className="rdv-time-large">
                          🕐 {new Date(rdv.dateHeure).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                        </span>
                                                <span className={`rdv-status ${statutInfo.class}`}>
                          {statutInfo.label}
                        </span>
                                            </div>

                                            <div className="rdv-patient-info">
                                                <div className="patient-name">
                                                    👤 {rdv.patient?.nom} {rdv.patient?.prenom}
                                                </div>
                                                {rdv.patient?.telephone && (
                                                    <div className="patient-tel">
                                                        📞 {rdv.patient.telephone}
                                                    </div>
                                                )}
                                            </div>

                                            {rdv.motif && (
                                                <div className="rdv-motif">
                                                    <strong>Motif:</strong> {rdv.motif}
                                                </div>
                                            )}

                                            <div className="rdv-actions">
                                                <button className="btn-small btn-view">Voir détails</button>
                                                <button className="btn-small btn-edit">Modifier</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Statistiques */}
                    <div className="sidebar-stats">
                        <h4>📊 Statistiques</h4>
                        <div className="stat-item">
                            <span>Total ce mois</span>
                            <strong>{rendezVous.length}</strong>
                        </div>
                        <div className="stat-item">
                            <span>Aujourd'hui</span>
                            <strong>{getRendezVousForDate(new Date()).length}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestionRendezVous;