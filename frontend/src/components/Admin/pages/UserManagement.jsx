import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdLock, MdSearch } from "react-icons/md";
import UserService from "../services/UserService";
import CustomAlert from "../components/CustomAlert";


export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("Tous les rôles");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await UserService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
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
      MEDECIN: "bg-blue-100 text-blue-700",
      SECRETAIRE: "bg-green-100 text-green-700",
      ADMIN_CABINET: "bg-purple-100 text-purple-700",
      ADMIN: "bg-red-100 text-red-700",
    };
    return colors[role] || "bg-slate-100 text-slate-700";
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
    return;   // ⛔ IMPORTANT : empêcher la suite du code
  }
};


  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await UserService.supprimerUser(id);
        fetchUsers();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  

  return (
    <div className="flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Gestion des Utilisateurs</h1>
        <button
          onClick={handleAddUser}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2"
        >
          <MdAdd size={20} /> Ajouter un Utilisateur
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <MdSearch className="absolute left-3 top-3 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou login..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700"
        >
          <option>Tous les rôles</option>
          <option>MEDECIN</option>
          <option>SECRETAIRE</option>
          <option>ADMINISTRATEUR</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Nom Complet</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Login (Email)</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Téléphone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Rôle</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Statut</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                  {user.nom} {user.prenom}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">{user.login}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{user.numTel || "N/A"}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      user.statut === "ACTIF"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {user.statut === "ACTIF" ? "Actif" : "Inactif"}
  </span>
</td>

                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleEdit(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Éditer">
                      <MdEdit size={18} />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer">
                      <MdDelete size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <UserModal
          selectedUser={selectedUser}
          onClose={() => setShowModal(false)}
          onSave={handleSaveUser}
        />
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">
            {selectedUser ? "Éditer l'Utilisateur" : "Ajouter un Utilisateur"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <MdDelete size={24} className="text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom *</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prénom *</label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Login (Email) *</label>
              <input
                type="email"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                disabled={!!selectedUser}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={numTel}
                onChange={(e) => setNumTel(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rôle *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionnez un rôle</option>
                <option value="MEDECIN">Médecin</option>
                <option value="SECRETAIRE">Secrétaire</option>
                <option value="ADMINISTRATEUR">administrateur</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
              <select
  value={statut}
  onChange={(e) => setStatut(e.target.value)}
  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="ACTIF">Actif</option>
  <option value="INACTIF">Inactif</option>
</select>

            </div>
          </div>
          {!selectedUser && (
            <p className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
              ℹ️ Un mot de passe temporaire sera généré automatiquement et envoyé par email.
            </p>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            {selectedUser ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}