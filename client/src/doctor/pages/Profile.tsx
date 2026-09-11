import React from 'react';
import { Edit3 } from 'lucide-react';

export const Profile: React.FC = () => {
  const doctor = {
    name: 'Dr. Ananya Sharma',
    doctorId: 'DOC-1001',
    specialty: 'General Physician & Clinical Consultant',
    experience: 12,
    hospital: 'Medikis Care Center',
    location: 'Saket, New Delhi, India',
    email: 'dr.ananya.sharma@medikis.in',
    phone: '+91 98101 23456',
    qualification: 'MBBS, MD (Internal Medicine)',
    registrationNo: 'MCI-DL-2014-98421',
    patientsToday: 8,
    totalPatients: 248,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=240&auto=format&fit=crop&q=80'
  };

  return (
    <div className="flex flex-col gap-5 md:gap-6 max-w-5xl mx-auto pb-8 text-slate-800">
      {/* Top Banner & Avatar */}
      <div className="bg-white rounded-[2rem] p-5 sm:p-7 border border-slate-100/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-24 sm:h-28 bg-gradient-to-r from-teal-700 via-indigo-700 to-slate-900 opacity-90" />
        
        <div className="relative pt-12 sm:pt-16 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-lg relative z-10"
            />
            <div className="mb-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{doctor.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
                  {doctor.doctorId}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">{doctor.specialty}</p>
              <p className="text-xs text-slate-400 mt-0.5">{doctor.hospital} • {doctor.location}</p>
            </div>
          </div>

          <button className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer self-center sm:self-end">
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Grid: Credentials & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left 2 Cols: Credentials */}
        <div className="md:col-span-2 bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-100/80 shadow-xs space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Doctor Credentials & Hospital Affiliation
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-semibold block mb-1">Medical Registration #</span>
              <p className="font-mono font-bold text-slate-800">{doctor.registrationNo}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-semibold block mb-1">Qualifications</span>
              <p className="font-bold text-slate-800">{doctor.qualification}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-semibold block mb-1">Clinical Experience</span>
              <p className="font-bold text-slate-800">{doctor.experience} Years Active Practice</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-semibold block mb-1">Clinic Center</span>
              <p className="font-bold text-slate-800">{doctor.hospital}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-semibold block mb-1">Official Email</span>
              <p className="font-bold text-slate-800 truncate">{doctor.email}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-semibold block mb-1">Direct Contact</span>
              <p className="font-bold text-slate-800">{doctor.phone}</p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Performance Stats */}
        <div className="bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-100/80 shadow-xs flex flex-col justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              Patient Throughput
            </h2>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 text-center">
                <span className="text-3xl font-black text-teal-800">{doctor.patientsToday}</span>
                <span className="text-xs font-semibold text-teal-600 block mt-1">Consulted Today</span>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center">
                <span className="text-3xl font-black text-indigo-800">{doctor.totalPatients}</span>
                <span className="text-xs font-semibold text-indigo-600 block mt-1">Total Active Patients</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-center text-xs font-semibold text-slate-500">
            MediKiosk Live Kiosk Desk #04 Connected
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
