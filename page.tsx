'use client';
import React, { useState, useEffect } from 'react';

interface Appointment { id: string; date: string; time: string; callerName: string; }
interface Urgency { id: string; callerName: string; message: string; timestamp: string; }

export default function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [urgencies, setUrgencies] = useState<Urgency[]>([]);
  const [currentDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resApp = await fetch('/api/appointments');
        const dataApp = await resApp.json();
        setAppointments(Array.isArray(dataApp) ? dataApp : []);

        const resUrg = await fetch('/api/urgencies');
        const dataUrg = await resUrg.json();
        setUrgencies(Array.isArray(dataUrg) ? dataUrg : []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Répondeur IA Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Hébergé gratuitement sur Vercel</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-xs font-semibold animate-pulse">
            ● IA Connectée à votre Mobile
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-blue-400">📅 Rendez-vous calés par l'IA</h2>
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-500 mb-2">
              <div>Lun</div><div>Mar</div><div>Mer</div><div>Jeu</div><div>Ven</div><div>Sam</div><div>Dim</div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {daysArray.map(day => {
                const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayEvents = appointments.filter(a => a.date === dateString);
                return (
                  <div key={day} className="h-24 bg-gray-950 border border-gray-850 rounded-xl p-1 flex flex-col justify-between">
                    <span className="text-xs font-bold text-gray-600">{day}</span>
                    <div className="space-y-1 overflow-y-auto">
                      {dayEvents.map(e => (
                        <div key={e.id} className="bg-blue-600/20 border border-blue-500/30 text-[9px] p-1 rounded text-blue-300 truncate">
                          <strong>{e.time}</strong> {e.callerName}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2">
              🚨 Alertes Urgentes (Push iPhone)
            </h2>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px]">
              {urgencies.length === 0 ? (
                <p className="text-gray-500 text-sm italic">Aucune urgence récente.</p>
              ) : (
                urgencies.map(u => (
                  <div key={u.id} className="bg-red-950/30 border border-red-500/20 p-4 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-red-300">{u.callerName}</span>
                      <span className="text-[10px] text-gray-500">{u.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-300">{u.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}