import { useState, useEffect } from "react"
import { MdDelete, MdCloudUpload, MdDownload, MdAdd, MdEdit, MdClose, MdCheck, MdSearch } from "react-icons/md"
import MedicamentService from "../services/MedicamentService"

export default function MedecinManagement() {
  const [medicaments, setMedicaments] = useState([])
  const [filteredMedicaments, setFilteredMedicaments] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    nom: "",
    forme: "",
    dosage: "",
    laboratoire: "",
    dci: "",
  })

  // Charger les médicaments au montage du composant
  useEffect(() => {
    loadMedicaments()
  }, [])

  // Filtrer les médicaments basé sur la recherche
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMedicaments(medicaments)
    } else {
      const filtered = medicaments.filter(
        (med) =>
          med.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.forme.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.dosage.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.laboratoire.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.dci.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredMedicaments(filtered)
    }
  }, [searchTerm, medicaments])

  const loadMedicaments = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await MedicamentService.getAllMedicaments()
      setMedicaments(data)
    } catch (err) {
      setError("Erreur lors du chargement des médicaments")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (medicament = null) => {
    if (medicament) {
      setEditingId(medicament.id)
      setFormData(medicament)
    } else {
      setEditingId(null)
      setFormData({ nom: "", forme: "", dosage: "", laboratoire: "", dci: "" })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
    setFormData({ nom: "", forme: "", dosage: "", laboratoire: "", dci: "" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.nom || !formData.forme || !formData.dosage || !formData.laboratoire || !formData.dci) {
      alert("Tous les champs sont obligatoires")
      return
    }

    try {
      if (editingId) {
        // Modifier
        const updatedMedicament = await MedicamentService.modifierMedicament(
          editingId,
          formData
        )
        setMedicaments(
          medicaments.map((m) =>
            m.id === editingId ? updatedMedicament : m
          )
        )
        alert("Médicament modifié avec succès")
      } else {
        // Ajouter
        const newMedicament = await MedicamentService.creerMedicament(formData)
        setMedicaments([...medicaments, newMedicament])
        alert("Médicament ajouté avec succès")
      }
      handleCloseModal()
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.message || err.message))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce médicament ?")) {
      MedicamentService.supprimerMedicament(id)
        .then(() => {
          setMedicaments(medicaments.filter((m) => m.id !== id))
          alert("Médicament supprimé avec succès")
        })
        .catch((err) => {
          alert("Erreur: " + (err.response?.data?.message || err.message))
        })
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = async (file) => {
    if (!file.name.endsWith(".csv")) {
      alert("Veuillez sélectionner un fichier CSV valide")
      return
    }

    try {
      setUploadProgress(0)
      
      // Simuler une barre de progression
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      // Envoyer le fichier au backend
      const result = await MedicamentService.importerCSV(file)
      
      clearInterval(interval)
      setUploadProgress(100)

      // Recharger les médicaments
      await loadMedicaments()

      alert(
        `Import réussi !\nMédicaments ajoutés: ${result.nombreAjoutes}\n${
          result.erreurs.length > 0
            ? "Erreurs: " + result.erreurs.join(", ")
            : ""
        }`
      )
      setUploadProgress(0)
    } catch (err) {
      alert("Erreur lors de l'import: " + err.message)
      setUploadProgress(0)
    }
  }

  const handleDownloadTemplate = () => {
    const csvContent = `Nom,Forme,Dosage,Laboratoire,DCI
Aspirine,Comprimé,500mg,Bayer,Acide acétylsalicylique
Amoxicilline,Gélule,250mg,GSK,Amoxicilline`

    const element = document.createElement("a")
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)
    )
    element.setAttribute("download", "template_medicaments.csv")
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
const handleExportCSV = () => {
  if (!filteredMedicaments || filteredMedicaments.length === 0) {
    alert("Aucun médicament à exporter !");
    return;
  }

  // Colonnes CSV
  const headers = [
    "Nom",
    "Forme",
    "Dosage",
    "Laboratoire",
    "DCI",
    "Date Ajout",
  ];

  // Lignes CSV
  const rows = filteredMedicaments.map((m) => [
    m.nom || "",
    m.forme || "",
    m.dosage || "",
    m.laboratoire || "",
    m.dci || "",
    m.dateAjout || "",
  ]);

  // Construction CSV avec séparateur ; et champs entre guillemets
  const csvContent = [headers, ...rows]
    .map((row) => row.map((v) => `"${v}"`).join(";"))
    .join("\r\n"); // Compatible Excel

  // Ajout du BOM UTF-8 pour corriger les accents dans Excel
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "medicaments_export.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



  return (
    <div className="flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Gestion des Médicaments
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <MdAdd size={20} />
          Ajouter un Médicament
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* État de chargement */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-slate-600">Chargement des médicaments...</p>
        </div>
      ) : (
        <>
          {/* Import Section */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
            <button
  onClick={handleExportCSV}
  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 mb-4"
>
  <MdDownload size={20} />
  Exporter la Liste en CSV
</button>

            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Importer des Médicaments (CSV)
            </h2>

            <div className="flex gap-4 mb-6">
              <button
                onClick={handleDownloadTemplate}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <MdDownload size={20} />
                Télécharger le Template CSV
              </button>
            </div>

            {uploadProgress === 0 ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-300 bg-slate-50 hover:border-slate-400"
                }`}
              >
                <MdCloudUpload size={48} className="mx-auto text-slate-400 mb-4" />
                <p className="text-slate-700 font-medium mb-2">
                  Glissez votre fichier CSV ici
                </p>
                <p className="text-slate-500 text-sm mb-4">ou</p>
                <label className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer inline-block transition-colors">
                  Parcourir les fichiers
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-slate-600 mt-2">{uploadProgress}%</p>
              </div>
            )}
          </div>

          {/* Medicaments List */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  Liste des Médicaments ({filteredMedicaments.length})
                </h2>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <MdSearch className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher par nom, forme, dosage, laboratoire ou DCI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Nom
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Forme
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Dosage
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Laboratoire
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      DCI
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Date Ajout
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicaments.map((med) => (
                    <tr
                      key={med.id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                        {med.nom}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {med.forme}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {med.dosage}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {med.laboratoire}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {med.dci}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {med.dateAjout}
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => handleOpenModal(med)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(med.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <MdDelete size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredMedicaments.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-slate-500">
                  {searchTerm.trim() !== ""
                    ? "Aucun médicament trouvé pour votre recherche"
                    : "Aucun médicament trouvé"}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal Ajouter/Modifier Médicament */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingId ? "Modifier le Médicament" : "Ajouter un Médicament"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <MdClose size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Nom du Médicament
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Aspirine"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Forme
                  </label>
                  <input
                    type="text"
                    name="forme"
                    value={formData.forme}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Comprimé"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Dosage
                  </label>
                  <input
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 500mg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Laboratoire
                  </label>
                  <input
                    type="text"
                    name="laboratoire"
                    value={formData.laboratoire}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Bayer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    DCI
                  </label>
                  <input
                    type="text"
                    name="dci"
                    value={formData.dci}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Acide acétylsalicylique"
                    required
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-4 justify-end pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <MdCheck size={18} />
                  {editingId ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
