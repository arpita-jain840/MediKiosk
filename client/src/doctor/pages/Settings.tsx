const Settings = () => {
  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100/80 shadow-xs max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Clinic Settings</h1>
      <p className="text-sm text-slate-500 mb-6">Configure MediKiosk desk stations, QR check-in parameters, and notification alerts.</p>
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-600">
        Kiosk hardware, sync latency, and system configuration.
      </div>
    </div>
  );
};

export default Settings;
