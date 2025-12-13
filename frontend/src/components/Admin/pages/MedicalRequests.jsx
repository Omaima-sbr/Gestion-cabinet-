import { useState } from "react"
import { MdClose, MdCheck, MdVisibility, MdDownload, MdDescription } from "react-icons/md"

export default function MedicalRequests() {
  const [applications, setApplications] = useState([
    {
      id: 1,
      nomCabinet: "Clinique Vision",
      specialite: "Ophtalmologie",
      adresseCabinet: "Rabat",
      telCabinet: "0522555555",
      emailCabinet: "contact@vision.ma",
      logoCabinet: null,
      nomMedecin: "Dr. Ahmed",
      prenomMedecin: "Hassan",
      cinMedecin: "AB123456",
      telMedecin: "0522555555",
      emailMedecin: "ahmed.hassan@vision.ma",
      loginMedecin: "ahmed.hassan",
      pwdMedecin: "***",
      signatureMedecin: null,
      nomSecretaire: "Fatima",
      prenomSecretaire: "El Alami",
      cinSecretaire: "CD654321",
      telSecretaire: "0533666666",
      emailSecretaire: "fatima@vision.ma",
      loginSecretaire: "fatima.elalami",
      pwdSecretaire: "***",
      statut: "EN_ATTENTE",
      dateDemande: "2025-01-18T10:30:00",
      dateTraitement: null,
      commentaireAdmin: null,
      adminTraitant: null,
      documentLicence: "licence_vision.pdf",
      documentDiplome: "diplome_vision.pdf",
      documentCinMedecin: "cin_vision.pdf",
    },
    {
      id: 2,
      nomCabinet: "Cabinet Dentaire Pro",
      specialite: "Dentisterie",
      adresseCabinet: "Casablanca",
      telCabinet: "0533666666",
      emailCabinet: "contact@dentaire.ma",
      logoCabinet: null,
      nomMedecin: "Dr. Mohamed",
      prenomMedecin: "Karim",
      cinMedecin: "EF789012",
      telMedecin: "0533666666",
      emailMedecin: "mohamad.karim@dentaire.ma",
      loginMedecin: "mohamad.karim",
      pwdMedecin: "***",
      signatureMedecin: null,
      nomSecretaire: "Leila",
      prenomSecretaire: "Bennani",
      cinSecretaire: "GH345678",
      telSecretaire: "0544777777",
      emailSecretaire: "leila@dentaire.ma",
      loginSecretaire: "leila.bennani",
      pwdSecretaire: "***",
      statut: "EN_ATTENTE",
      dateDemande: "2025-01-19T14:15:00",
      dateTraitement: null,
      commentaireAdmin: null,
      adminTraitant: null,
      documentLicence: "licence_dentaire.pdf",
      documentDiplome: "diplome_dentaire.pdf",
      documentCinMedecin: "cin_dentaire.pdf",
    },
    {
      id: 3,
      nomCabinet: "Clinique Cardio",
      specialite: "Cardiologie",
      adresseCabinet: "Fes",
      telCabinet: "0544777777",
      emailCabinet: "contact@cardio.ma",
      logoCabinet: null,
      nomMedecin: "Dr. Samir",
      prenomMedecin: "Benali",
      cinMedecin: "IJ901234",
      telMedecin: "0544777777",
      emailMedecin: "samir.benali@cardio.ma",
      loginMedecin: "samir.benali",
      pwdMedecin: "***",
      signatureMedecin: null,
      nomSecretaire: null,
      prenomSecretaire: null,
      cinSecretaire: null,
      telSecretaire: null,
      emailSecretaire: null,
      loginSecretaire: null,
      pwdSecretaire: null,
      statut: "APPROUVEE",
      dateDemande: "2025-01-15T09:00:00",
      dateTraitement: "2025-01-16T15:30:00",
      commentaireAdmin: "Approbation accordée",
      adminTraitant: "Admin User",
      documentLicence: "licence_cardio.pdf",
      documentDiplome: "diplome_cardio.pdf",
      documentCinMedecin: "cin_cardio.pdf",
    },
  ])

  const [filterStatus, setFilterStatus] = useState("Tous les status")
  const [selectedApp, setSelectedApp] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const getStatusColor = (statut) => {
    if (statut === "APPROUVEE") return "text-green-600 bg-green-50"
    if (statut === "EN_ATTENTE") return "text-orange-600 bg-orange-50"
    return "text-red-600 bg-red-50"
  }

  const getStatusIcon = (statut) => {
    if (statut === "APPROUVEE") return <MdCheck size={16} />
    return <div className="text-lg">⏳</div>
  }

  const handleApprove = (id) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, statut: "APPROUVEE", dateTraitement: new Date().toISOString() } : app
      )
    )
  }

  const handleReject = (id) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, statut: "REJETEE" } : app
      )
    )
  }

  const handleViewDetails = (app) => {
    setSelectedApp(app)
    setShowDetails(true)
  }

  const filteredApplications =
    filterStatus === "Tous les status"
      ? applications
      : applications.filter((app) => app.statut === filterStatus)

  const handleDownloadDocument = (fileName) => {
    // Simulation du téléchargement
    alert(`Téléchargement de ${fileName}...`)
    // En production, ce lien pointerait vers le backend
  }

  const renderDocumentButton = (fileName) => {
    if (!fileName) {
      return (
        <span className="text-xs text-slate-400">Aucun document</span>
      )
    }
    return (
      <button
        onClick={() => handleDownloadDocument(fileName)}
        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
      >
        <MdDownload size={16} />
        {fileName}
      </button>
    )
  }

  return (
    <div className="flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Gestion des Candidatures
        </h1>
        <p className="text-slate-600">
          Examinez et approuvez les demandes d'inscription des nouveaux cabinets
        </p>
      </div>

      {/* Filter */}
      <div className="mb-8">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Tous les status</option>
          <option>EN_ATTENTE</option>
          <option>APPROUVEE</option>
          <option>REJETEE</option>
        </select>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {filteredApplications.map((app) => (
          <div
            key={app.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-slate-200"
          >
            {/* Header with Name and Status */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">{app.nomCabinet}</h3>
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  app.statut
                )}`}
              >
                {getStatusIcon(app.statut)}
                <span>{app.statut === "EN_ATTENTE" ? "En attente" : app.statut === "APPROUVEE" ? "Approuvée" : "Rejetée"}</span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm text-slate-600 font-medium">Spécialité</p>
                <p className="text-sm text-slate-800">{app.specialite}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Email Cabinet</p>
                <p className="text-sm text-slate-800">{app.emailCabinet}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Téléphone</p>
                <p className="text-sm text-slate-800">{app.telCabinet}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Adresse</p>
                <p className="text-sm text-slate-800">{app.adresseCabinet}</p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleViewDetails(app)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <MdVisibility size={18} />
              Détails
            </button>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {showDetails && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-slate-900">
                {selectedApp.nomCabinet}
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-1 hover:bg-slate-100 rounded-lg"
              >
                <MdClose size={24} className="text-slate-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Informations du Cabinet */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">📋 Informations du Cabinet</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Nom Cabinet</p>
                    <p className="text-slate-900">{selectedApp.nomCabinet}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Spécialité</p>
                    <p className="text-slate-900">{selectedApp.specialite}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Adresse</p>
                    <p className="text-slate-900">{selectedApp.adresseCabinet}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Téléphone</p>
                    <p className="text-slate-900">{selectedApp.telCabinet}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Email</p>
                    <p className="text-slate-900">{selectedApp.emailCabinet}</p>
                  </div>
                </div>
              </div>

              {/* Informations du Médecin */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">👨‍⚕️ Informations du Médecin</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Nom</p>
                    <p className="text-slate-900">{selectedApp.nomMedecin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Prénom</p>
                    <p className="text-slate-900">{selectedApp.prenomMedecin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">CIN</p>
                    <p className="text-slate-900">{selectedApp.cinMedecin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Téléphone</p>
                    <p className="text-slate-900">{selectedApp.telMedecin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Email</p>
                    <p className="text-slate-900">{selectedApp.emailMedecin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Login</p>
                    <p className="text-slate-900">{selectedApp.loginMedecin}</p>
                  </div>
                </div>
              </div>

              {/* Informations de la Secrétaire */}
              {selectedApp.nomSecretaire && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">👩‍💼 Informations de la Secrétaire</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Nom</p>
                      <p className="text-slate-900">{selectedApp.nomSecretaire}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Prénom</p>
                      <p className="text-slate-900">{selectedApp.prenomSecretaire}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">CIN</p>
                      <p className="text-slate-900">{selectedApp.cinSecretaire}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Téléphone</p>
                      <p className="text-slate-900">{selectedApp.telSecretaire}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Email</p>
                      <p className="text-slate-900">{selectedApp.emailSecretaire}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Login</p>
                      <p className="text-slate-900">{selectedApp.loginSecretaire}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">📄 Documents Justificatifs</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <MdDescription size={20} className="text-slate-600" />
                      <p className="text-sm text-slate-600 font-medium">Licence</p>
                    </div>
                    {renderDocumentButton(selectedApp.documentLicence)}
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <MdDescription size={20} className="text-slate-600" />
                      <p className="text-sm text-slate-600 font-medium">Diplôme</p>
                    </div>
                    {renderDocumentButton(selectedApp.documentDiplome)}
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <MdDescription size={20} className="text-slate-600" />
                      <p className="text-sm text-slate-600 font-medium">CIN Médecin</p>
                    </div>
                    {renderDocumentButton(selectedApp.documentCinMedecin)}
                  </div>
                </div>
              </div>

              {/* Statut de la demande */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">📊 Statut de la Demande</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Statut</p>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                        selectedApp.statut
                      )}`}
                    >
                      {getStatusIcon(selectedApp.statut)}
                      <span>{selectedApp.statut === "EN_ATTENTE" ? "En attente" : selectedApp.statut === "APPROUVEE" ? "Approuvée" : "Rejetée"}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Date Demande</p>
                    <p className="text-slate-900">{new Date(selectedApp.dateDemande).toLocaleDateString('fr-FR')}</p>
                  </div>
                  {selectedApp.dateTraitement && (
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Date Traitement</p>
                      <p className="text-slate-900">{new Date(selectedApp.dateTraitement).toLocaleDateString('fr-FR')}</p>
                    </div>
                  )}
                  {selectedApp.commentaireAdmin && (
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Commentaire Admin</p>
                      <p className="text-slate-900">{selectedApp.commentaireAdmin}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {selectedApp.statut === "EN_ATTENTE" && (
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => {
                      handleApprove(selectedApp.id)
                      setShowDetails(false)
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <MdCheck size={18} />
                    Approuver
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedApp.id)
                      setShowDetails(false)
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <MdClose size={18} />
                    Rejeter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
