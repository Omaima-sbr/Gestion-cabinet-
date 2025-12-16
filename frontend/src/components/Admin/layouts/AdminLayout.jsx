import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8"> {/* padding augmenté pour plus d'espace */}
          <div className="ml-24 space-y-8">
            {/* ml-6 → espace entre sidebar et contenu */}
            {/* space-y-8 → espace vertical entre sections */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
