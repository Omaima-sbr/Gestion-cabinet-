import { useState, useEffect } from "react";
import { MdDownload, MdCheck, MdCheckCircle } from "react-icons/md";
import InvoicesService from "../services/InvoicesService";

export default function InvoicesManagement() {
  const [invoices, setInvoices] = useState([]);
  const [filterCabinet, setFilterCabinet] = useState("Tous les cabinets");
  const [filterStatut, setFilterStatut] = useState("Tous les status");

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await InvoicesService.getAll();
      setInvoices(data);
    } catch (err) {
      console.error("Erreur chargement factures:", err);
    }
  };

  // Filtre dynamique
  const filteredInvoices = invoices.filter(
    (invoice) =>
      (filterCabinet === "Tous les cabinets" || invoice.cabinetNom === filterCabinet) &&
      (filterStatut === "Tous les status" || invoice.statut === filterStatut)
  );

  // Statistiques
  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum, inv) => sum + Number(inv.montant || 0), 0);
  const pendingCount = invoices.filter((inv) => inv.statut === "EN_ATTENTE").length;

  // Paiement
  const handleMarkAsPaid = async (id) => {
    try {
      await InvoicesService.markAsPaid(id);
      loadInvoices();
    } catch (err) {
      console.error("Erreur marque payée:", err);
    }
  };

  // Mise à jour montant + période
  const handleUpdateInvoice = async (invoice) => {
    try {
      await InvoicesService.update(invoice.id, {
        montant: Number(invoice.montant),
        periode: invoice.periode,
      });
      loadInvoices();
    } catch (err) {
      console.error("Erreur mise à jour facture:", err);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
  const csvContent = [
    ["  ID Facture   "    ,     "    Cabinet   "    ,     "    Email    "     ,      "     Montant   "     ,     "     Période     "     ,       "      Date      "        ,         "      Statut      "],
    ...invoices.map((inv) => [
      inv.id            ,
      inv.cabinetNom            ,
      inv.cabinetEmail                ,
      inv.montant || ""              ,
      inv.periode || ""              ,
      inv.dateCreation               ,
      inv.statut                     ,
    ]),
  ]
    .map((row) => row.map((field) => `"${field}"`).join(";")) // <-- chaque champ entre guillemets
    .join("\r\n"); // <-- utiliser \r\n pour compatibilité Excel

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const element = document.createElement("a");
  element.href = URL.createObjectURL(blob);
  element.download = "factures_export.csv";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};


  return (
    <div className="flex flex-col overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Gestion des Factures</h1>
        <button
          onClick={handleExportCSV}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg flex items-center gap-2"
        >
          <MdDownload size={20} /> Exporter CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-slate-600 font-medium mb-2">Total Factures</p>
          <p className="text-2xl font-bold text-slate-900">{totalInvoices}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-slate-600 font-medium mb-2">Montant Total</p>
          <p className="text-2xl font-bold text-slate-900">
            {totalAmount.toLocaleString()} MAD
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-slate-600 font-medium mb-2">En Attente</p>
          <p className="text-2xl font-bold text-red-600">{pendingCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filterCabinet}
          onChange={(e) => setFilterCabinet(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option>Tous les cabinets</option>
          {Array.from(new Set(invoices.map((inv) => inv.cabinetNom))).map((cab) => (
            <option key={cab}>{cab}</option>
          ))}
        </select>

        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option>Tous les status</option>
          <option>PAYEE</option>
          <option>EN_ATTENTE</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="px-6 py-4 text-left font-semibold">ID Facture</th>
              <th className="px-6 py-4 text-left font-semibold">Cabinet</th>
              <th className="px-6 py-4 text-left font-semibold">Email</th>
              <th className="px-6 py-4 text-left font-semibold">Montant</th>
              <th className="px-6 py-4 text-left font-semibold">Période</th>
              <th className="px-6 py-4 text-left font-semibold">Date</th>
              <th className="px-6 py-4 text-left font-semibold">Statut</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-b hover:bg-slate-50">
                <td className="px-6 py-4">{invoice.id}</td>
                <td className="px-6 py-4">{invoice.cabinetNom}</td>
                <td className="px-6 py-4">{invoice.cabinetEmail}</td>

                {/* Montant input */}
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={invoice.montant || ""}
                    onChange={(e) =>
                      setInvoices(
                        invoices.map((inv) =>
                          inv.id === invoice.id
                            ? { ...inv, montant: e.target.value }
                            : inv
                        )
                      )
                    }
                    className="border px-2 py-1 rounded w-full"
                  />
                </td>

                {/* Période input */}
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={invoice.periode || ""}
                    onChange={(e) =>
                      setInvoices(
                        invoices.map((inv) =>
                          inv.id === invoice.id
                            ? { ...inv, periode: e.target.value }
                            : inv
                        )
                      )
                    }
                    className="border px-2 py-1 rounded w-full"
                  />
                </td>

                <td className="px-6 py-4">{invoice.dateCreation}</td>

                {/* Statut */}
                <td className="px-6 py-4">
                  {invoice.statut === "PAYEE" ? (
                    <div className="flex items-center gap-2">
                      <MdCheckCircle className="text-green-600" size={18} />
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Payée
                      </span>
                    </div>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                      En Attente
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 flex flex-col gap-1">
                  {invoice.statut === "EN_ATTENTE" && (
                    <button
                      onClick={() => handleMarkAsPaid(invoice.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                    >
                      <MdCheck size={16} /> Marquer Payée
                    </button>
                  )}

                  <button
                    onClick={() => handleUpdateInvoice(invoice)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                  >
                    Enregistrer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredInvoices.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            Aucune facture trouvée
          </div>
        )}
      </div>
    </div>
  );
}
