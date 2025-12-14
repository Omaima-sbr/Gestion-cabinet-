package com.cabinetmedical.gestioncabinet.security.medecin;

import com.cabinetmedical.gestioncabinet.model.Utilisateur;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserPrincipal implements UserDetails {
    private final Integer id;
    private final String login;
    private final String password;
    private final String nom;      // ✅ AJOUTER
    private final String prenom;   // ✅ AJOUTER
    private final Utilisateur.Role role;
    private final Integer cabinetId;
    private final boolean active;

    public UserPrincipal(Utilisateur utilisateur) {
        this.id = utilisateur.getId();
        this.login = utilisateur.getLogin();
        this.password = utilisateur.getPwd();
        this.nom = utilisateur.getNom();      // ✅ INITIALISER
        this.prenom = utilisateur.getPrenom(); // ✅ INITIALISER
        this.role = utilisateur.getRole();
        this.cabinetId = utilisateur.getCabinet() != null ? utilisateur.getCabinet().getId() : null;
        this.active = utilisateur.getActif() != null ? utilisateur.getActif() : true;
    }

    public static UserPrincipal create(Utilisateur utilisateur) {
        return new UserPrincipal(utilisateur);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return login;
    }

    // ✅ AJOUTER LES GETTERS POUR nom ET prenom
    public String getNom() {
        return nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public Integer getId() {
        return id;
    }

    public String getLogin() {
        return login;
    }

    public Utilisateur.Role getRole() {
        return role;
    }

    public Integer getCabinetId() {
        return cabinetId;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }

    public boolean hasRole(Utilisateur.Role requiredRole) {
        return this.role == requiredRole;
    }
}