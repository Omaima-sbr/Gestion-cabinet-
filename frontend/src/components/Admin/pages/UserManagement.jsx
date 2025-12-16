import { useState, useEffect } from "react";
import { 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdPerson,
  MdEmail,
  MdPhone,
  MdCheckCircle,
  MdCancel,
  MdFilterList,
  MdGroups,
  MdAdminPanelSettings,
  MdAssignmentInd
} from "react-icons/md";
import UserService from "../services/UserService";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("Tous les rôles");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    medecin: 0,
    secretaire: 0,
    admin: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await UserService.getAllUsers();
      setUsers(data);
      
      // Calcul des statistiques détaillées
      const activeCount = data.filter(user => user.statut === "ACTIF").length;
      const medecinCount = data.filter(user => user.role === "MEDECIN").length;
      const secretaireCount = data.filter(user => user.role === "SECRETAIRE").length;
      const adminCount = data.filter(user => user.role === "ADMINISTRATEUR").length;
      
      setStats({
        total: data.length,
        active: activeCount,
        inactive: data.length - activeCount,
        medecin: medecinCount,
        secretaire: secretaireCount,
        admin: adminCount
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      ((user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
        (user.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
        (user.login?.toLowerCase().includes(searchTerm.toLowerCase()) || "")) &&
      (filterRole === "Tous les rôles" || user.role === filterRole)
  );

  const getRoleColor = (role) => {
    const colors = {
      MEDECIN: "from-blue-50 to-blue-100 border-blue-200 text-blue-800",
      SECRETAIRE: "from-green-50 to-green-100 border-green-200 text-green-800",
      ADMINISTRATEUR: "from-purple-50 to-purple-100 border-purple-200 text-purple-800",
      ADMIN: "from-red-50 to-red-100 border-red-200 text-red-800",
    };
    return colors[role] || "from-slate-50 to-slate-100 border-slate-200 text-slate-800";
  };

  const getRoleIcon = (role) => {
    const icons = {
      MEDECIN: "👨‍⚕️",
      SECRETAIRE: "👩‍💼",
      ADMINISTRATEUR: "👑",
      ADMIN: "🛡️"
    };
    return icons[role] || "👤";
  };

  const handleSaveUser = async (user) => {
    try {
      if (selectedUser) {
        await UserService.modifierUser(selectedUser.id, user);
      } else {
        await UserService.creerUser(user);
      }

      setShowModal(false);
      fetchUsers();

    } catch (error) {
      alert("Erreur : " + (error.response?.data?.message || error.message));
      return;
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const confirmDelete = (id) => {
    setUserToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await UserService.supprimerUser(userToDelete);
      fetchUsers();
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setShowDeleteConfirm(false);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      {/* Styles inline corrigés */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }
        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {/* Header avec stats */}
      <div className="mb-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent">
              Gestion des Utilisateurs
            </h1>
            <p className="text-slate-600 text-lg">Gérez les accès et permissions de votre équipe</p>
          </div>
          <button
            onClick={handleAddUser}
            className="group relative bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-8 rounded-2xl flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <MdAdd size={24} className="relative z-10" />
            <span className="relative z-10">Ajouter un Utilisateur</span>
          </button>
        </div>

        {/* Cartes statistiques améliorées - Chiffres centrés et icônes plus petites */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <div className="glass-effect p-6 rounded-3xl border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="flex flex-col items-center justify-center text-center h-full">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-inner mb-3">
                <MdPerson className="text-blue-600" size={22} />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{stats.total}</p>
              <p className="text-slate-500 text-sm font-medium">Total</p>
              <p className="text-slate-400 text-xs mt-1">Utilisateurs</p>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-3xl border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="flex flex-col items-center justify-center text-center h-full">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center shadow-inner mb-3">
                <MdCheckCircle className="text-green-600" size={22} />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-green-600 mb-1">{stats.active}</p>
              <p className="text-slate-500 text-sm font-medium">Actifs</p>
              <p className="text-slate-400 text-xs mt-1">En ligne</p>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-3xl border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="flex flex-col items-center justify-center text-center h-full">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center shadow-inner mb-3">
                <MdCancel className="text-red-600" size={22} />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-red-600 mb-1">{stats.inactive}</p>
              <p className="text-slate-500 text-sm font-medium">Inactifs</p>
              <p className="text-slate-400 text-xs mt-1">Hors ligne</p>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-3xl border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="flex flex-col items-center justify-center text-center h-full">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-inner mb-3">
                <MdAssignmentInd className="text-blue-600" size={22} />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">{stats.medecin}</p>
              <p className="text-slate-500 text-sm font-medium">Médecins</p>
              <p className="text-slate-400 text-xs mt-1">Professionnels</p>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-3xl border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="flex flex-col items-center justify-center text-center h-full">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center shadow-inner mb-3">
                <MdGroups className="text-green-600" size={22} />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-green-600 mb-1">{stats.secretaire}</p>
              <p className="text-slate-500 text-sm font-medium">Secrétaires</p>
              <p className="text-slate-400 text-xs mt-1">Support</p>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-3xl border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="flex flex-col items-center justify-center text-center h-full">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center shadow-inner mb-3">
                <MdAdminPanelSettings className="text-purple-600" size={22} />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">{stats.admin}</p>
              <p className="text-slate-500 text-sm font-medium">Administrateurs</p>
              <p className="text-slate-400 text-xs mt-1">Superviseurs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche - Plus grand et moderne */}
      <div className="mb-10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Recherche et Filtrage</h2>
          <div className="flex items-center gap-3 text-slate-500">
            <MdFilterList size={20} />
            <span className="text-sm">Filtres actifs</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Champ de recherche grand et moderne */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <input
                type="text"
                placeholder="Rechercher un utilisateur par nom, prénom, email, téléphone, rôle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-8 py-5 text-lg bg-transparent border-none focus:outline-none focus:ring-0 placeholder-slate-400"
                style={{ minHeight: "70px" }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 text-2xl transition-colors duration-200"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filtres */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <label className="block text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">
                  Filtre par Rôle
                </label>
                <div className="relative">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none text-slate-700 text-lg"
                  >
                    <option className="text-lg">Tous les rôles</option>
                    <option value="MEDECIN" className="text-lg">👨‍⚕️ Médecin</option>
                    <option value="SECRETAIRE" className="text-lg">👩‍💼 Secrétaire</option>
                    <option value="ADMINISTRATEUR" className="text-lg">👑 Administrateur</option>
                  </select>
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-slow"></span>
              {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} correspondant{filteredUsers.length !== 1 ? 's' : ''} aux critères
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des utilisateurs - Design créatif */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Liste des Utilisateurs</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-slate-600">Actif</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-slate-600">Inactif</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          {isLoading ? (
            <div className="p-16 text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-[3px] border-blue-600 border-t-transparent mb-6"></div>
              <h3 className="text-xl font-medium text-slate-700 mb-3">Chargement des utilisateurs</h3>
              <p className="text-slate-500">Récupération des données en cours...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <MdPerson className="text-slate-400" size={48} />
              </div>
              <h3 className="text-2xl font-medium text-slate-700 mb-3">Aucun utilisateur trouvé</h3>
              <p className="text-slate-500 text-lg mb-6">Essayez de modifier vos critères de recherche</p>
              <button
                onClick={() => { setSearchTerm(""); setFilterRole("Tous les rôles"); }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-900 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <MdPerson size={20} />
                        Utilisateur
                      </div>
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-900 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <MdEmail size={20} />
                        Contact
                      </div>
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-900 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <MdAssignmentInd size={20} />
                        Rôle
                      </div>
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-900 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className={`border-b border-slate-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-blue-50/30 transition-all duration-300 ${
                        index % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'
                      }`}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-inner">
                              <span className="text-lg font-bold text-blue-700">
                                {user.nom?.charAt(0)}{user.prenom?.charAt(0)}
                              </span>
                            </div>
                            {user.statut === "ACTIF" && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-lg">
                              {user.nom} {user.prenom}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                              ID: <span className="font-mono">{user.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-8 py-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                              <MdEmail size={16} className="text-slate-500" />
                            </div>
                            <span className="text-slate-700 font-medium">{user.login}</span>
                          </div>
                          {user.numTel && (
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                <MdPhone size={16} className="text-slate-500" />
                              </div>
                              <span className="text-slate-700 font-medium">{user.numTel}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getRoleIcon(user.role)}</span>
                          <span className={`px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r ${getRoleColor(user.role)} border shadow-sm`}>
                            {user.role === "ADMINISTRATEUR" ? "Administrateur" : 
                             user.role === "SECRETAIRE" ? "Secrétaire" : 
                             user.role === "MEDECIN" ? "Médecin" : user.role}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              user.statut === "ACTIF" 
                                ? "bg-gradient-to-br from-green-100 to-green-200 shadow-inner" 
                                : "bg-gradient-to-br from-red-100 to-red-200 shadow-inner"
                            }`}>
                              {user.statut === "ACTIF" ? (
                                <MdCheckCircle className="text-green-600" size={24} />
                              ) : (
                                <MdCancel className="text-red-600" size={24} />
                              )}
                            </div>
                          </div>
                          <div>
                            <span className={`text-lg font-bold ${
                              user.statut === "ACTIF" ? "text-green-700" : "text-red-700"
                            }`}>
                              {user.statut === "ACTIF" ? "Actif" : "Inactif"}
                            </span>
                            <div className="text-xs text-slate-500 mt-1">
                              {user.statut === "ACTIF" ? "En ligne" : "Hors ligne"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleEdit(user)}
                            className="group p-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md"
                            title="Éditer"
                          >
                            <MdEdit size={22} />
                          </button>
                          <button 
                            onClick={() => confirmDelete(user.id)}
                            className="group p-3 bg-gradient-to-r from-red-50 to-red-100 text-red-600 hover:from-red-100 hover:to-red-200 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md"
                            title="Supprimer"
                          >
                            <MdDelete size={22} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer du tableau */}
          {filteredUsers.length > 0 && (
            <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-slate-600">
                  Affichage de <span className="font-bold text-slate-900">{filteredUsers.length}</span> utilisateur{filteredUsers.length > 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <MdCheckCircle className="text-green-600" size={18} />
                      <span className="text-slate-700">Actifs: {stats.active}</span>
                    </div>
                    <div className="w-px h-4 bg-slate-300"></div>
                    <div className="flex items-center gap-2">
                      <MdCancel className="text-red-600" size={18} />
                      <span className="text-slate-700">Inactifs: {stats.inactive}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <UserModal
          selectedUser={selectedUser}
          onClose={() => setShowModal(false)}
          onSave={handleSaveUser}
        />
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div 
            className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl max-w-md w-full animate-slideUp border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du modal */}
            <div className="relative p-8 border-b border-slate-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center shadow-inner mb-4">
                  <MdDelete className="text-red-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Confirmer la suppression
                </h2>
                <p className="text-slate-600">
                  Êtes-vous sûr de vouloir supprimer cet utilisateur ?
                </p>
              </div>
            </div>

            {/* Contenu du modal */}
            <div className="p-6">
              <p className="text-slate-700 text-center mb-2">
                Cette action est irréversible. Toutes les données associées à cet utilisateur seront définitivement supprimées.
              </p>
            </div>

            {/* Actions du modal */}
            <div className="p-6 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-2xl hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UserModal({ selectedUser, onClose, onSave }) {
  const [nom, setNom] = useState(selectedUser?.nom || "");
  const [prenom, setPrenom] = useState(selectedUser?.prenom || "");
  const [login, setLogin] = useState(selectedUser?.login || "");
  const [numTel, setNumTel] = useState(selectedUser?.numTel || "");
  const [role, setRole] = useState(selectedUser?.role || "");
  const [statut, setStatut] = useState(selectedUser?.statut || "ACTIF");

  const handleSubmit = () => {
    if (!nom || !prenom || !login || !role) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    const user = { nom, prenom, login, numTel, role, statut };
    onSave(user);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div 
        className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl max-w-4xl w-full animate-slideUp border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header du modal avec dégradé */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
          <div className="relative p-8 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">
                  {selectedUser ? "Modifier l'Utilisateur" : "Nouvel Utilisateur"}
                </h2>
                <p className="text-slate-600">
                  {selectedUser ? "Mettez à jour les informations de l'utilisateur" : "Créez un nouveau compte utilisateur"}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-slate-100 rounded-2xl transition-all duration-200 hover:rotate-90"
              >
                <div className="w-8 h-8 flex items-center justify-center text-slate-600 text-2xl font-bold">
                  ✕
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Contenu du modal */}
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Champ Nom */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Nom <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="relative w-full px-6 py-4 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-slate-900 text-lg placeholder-slate-400"
                  placeholder="Entrez le nom de famille"
                />
              </div>
            </div>
            
            {/* Champ Prénom */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Prénom <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="relative w-full px-6 py-4 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-slate-900 text-lg placeholder-slate-400"
                  placeholder="Entrez le prénom"
                />
              </div>
            </div>
            
            {/* Champ Email */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Email <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <input
                  type="email"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  disabled={!!selectedUser}
                  className={`relative w-full px-6 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200 text-lg placeholder-slate-400 ${
                    selectedUser 
                      ? "bg-slate-100 border-slate-300 text-slate-500 focus:border-slate-400 focus:ring-slate-200" 
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  placeholder="exemple@email.com"
                />
              </div>
            </div>
            
            {/* Champ Téléphone */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Téléphone
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <input
                  type="tel"
                  value={numTel}
                  onChange={(e) => setNumTel(e.target.value)}
                  className="relative w-full px-6 py-4 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-slate-900 text-lg placeholder-slate-400"
                  placeholder="+212 6 XX XX XX XX"
                />
              </div>
            </div>
            
            {/* Sélecteur de Rôle */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Rôle <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="relative w-full px-6 py-4 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none text-slate-900 text-lg"
                >
                  <option value="" className="text-slate-400">Sélectionnez un rôle</option>
                  <option value="MEDECIN" className="text-lg">👨‍⚕️ Médecin</option>
                  <option value="SECRETAIRE" className="text-lg">👩‍💼 Secrétaire</option>
                  <option value="ADMINISTRATEUR" className="text-lg">👑 Administrateur</option>
                </select>
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Sélecteur de Statut */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Statut
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <select
                  value={statut}
                  onChange={(e) => setStatut(e.target.value)}
                  className="relative w-full px-6 py-4 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none text-slate-900 text-lg"
                >
                  <option value="ACTIF" className="text-lg">✅ Actif</option>
                  <option value="INACTIF" className="text-lg">⛔ Inactif</option>
                </select>
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Message d'information */}
          {!selectedUser && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                  <span className="text-blue-600 text-xl">ℹ️</span>
                </div>
                <div className="flex-1">
                  <p className="text-blue-800 font-bold text-lg mb-2">Information importante</p>
                  <p className="text-blue-700">
                    Un mot de passe temporaire sécurisé sera automatiquement généré et envoyé à l'adresse email spécifiée. 
                    L'utilisateur devra le modifier lors de sa première connexion.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions du modal */}
        <div className="p-8 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-8 py-4 border-2 border-slate-300 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 text-lg"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
            >
              {selectedUser ? "Mettre à jour l'utilisateur" : "Créer le compte utilisateur"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}