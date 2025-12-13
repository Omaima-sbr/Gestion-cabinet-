import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdSearch, MdClose } from "react-icons/md";
import CabinetService from "../services/CabinetService";

export default function MedicalManagement() {
  const [cabinets, setCabinets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    email: "",
    tel: "",
    specialite: "",
    adresse: "",
    actif: true,
  });
  const [editingId, setEditingId] = useState(null);

  // ----------------------------
  // Charger Cabinets depuis backend
  // ----------------------------
  const loadCabinets = async () => {
    try {
      const data = await CabinetService.getAllCabinets(); // Assure-toi que le service a cette méthode
      setCabinets(data);
    } catch (e) {
      console.error("Erreur:", e);
    }
  };

  // ----------------------------
  // useEffect pour charger au montage
  // ----------------------------
  useEffect(() => {
    loadCabinets();
  }, []);

  // ----------------------------
  // SEARCH backend
  // ----------------------------
  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      loadCabinets();
    } else {
      const results = await CabinetService.rechercherCabinets(value); // correspond au backend
      setCabinets(results);
    }
  };

  // ----------------------------
  // OPEN MODAL ADD
  // ----------------------------
  const openAddModal = () => {
    setForm({
      nom: "",
      email: "",
      tel: "",
      specialite: "",
      adresse: "",
      actif: true,
    });
    setEditingId(null);
    setShowModal(true);
  };

  // ----------------------------
  // OPEN MODAL EDIT
  // ----------------------------
  const openEditModal = (cabinet) => {
    setForm(cabinet);
    setEditingId(cabinet.id);
    setShowModal(true);
  };

  // ----------------------------
  // SAVE CABINET
  // ----------------------------
  const saveCabinet = async () => {
    try {
      if (editingId) {
        await CabinetService.modifierCabinet(editingId, form);
      } else {
        await CabinetService.ajouterCabinet(form);
      }
      setShowModal(false);
      loadCabinets();
    } catch (e) {
      console.error("Erreur Save:", e);
    }
  };

  // ----------------------------
  // TOGGLE ACTIF
  // ----------------------------
  const toggleStatus = async (cabinet) => {
    try {
      const newStatus = !cabinet.actif;
      await CabinetService.changerStatut(cabinet.id, newStatus);
      loadCabinets();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col overflow-y-auto p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Gestion des Cabinets</h1>

        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2"
        >
          <MdAdd size={20} /> Ajouter un Cabinet
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-6 relative">
        <MdSearch className="absolute left-3 top-3 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Nom</th>
              <th className="px-6 py-4 text-left font-semibold">Email</th>
              <th className="px-6 py-4 text-left font-semibold">Téléphone</th>
              <th className="px-6 py-4 text-left font-semibold">Spécialité</th>
              <th className="px-6 py-4 text-left font-semibold">Statut</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {cabinets.map((c) => (
              <tr key={c.id} className="border-b hover:bg-slate-50">
                <td className="px-6 py-4">{c.nom}</td>
                <td className="px-6 py-4">{c.email}</td>
                <td className="px-6 py-4">{c.tel}</td>
                <td className="px-6 py-4">{c.specialite}</td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStatus(c)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      c.actif ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.actif ? "Actif" : "Inactif"}
                  </button>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <MdEdit size={20} />
                    </button>

                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl">
            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-2xl font-bold">
                {editingId ? "Modifier Cabinet" : "Ajouter Cabinet"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <MdClose size={25} />
              </button>
            </div>

            {/* FORM */}
            <div className="p-6 grid grid-cols-2 gap-4">
              {["nom", "email", "tel", "specialite", "adresse"].map((field) => (
                <div key={field}>
                  <label className="text-sm font-medium capitalize">{field}</label>
                  <input
                    type="text"
                    value={form[field] || ""}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              ))}

              <div>
                <label className="text-sm font-medium">Statut</label>
                <select
                  value={form.actif ? "Actif" : "Inactif"}
                  onChange={(e) => setForm({ ...form, actif: e.target.value === "Actif" })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option>Actif</option>
                  <option>Inactif</option>
                </select>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex gap-3 p-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border py-2 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={saveCabinet}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
