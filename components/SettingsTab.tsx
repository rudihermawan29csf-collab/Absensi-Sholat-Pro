
import React, { useState } from 'react';
import { SchoolConfig } from '../types';
import { Settings, Save, Loader2, CalendarRange, BookOpen } from 'lucide-react';
import { saveSchoolConfig } from '../services/storageService';

interface SettingsTabProps {
  config: SchoolConfig;
  setConfig: React.Dispatch<React.SetStateAction<SchoolConfig>>;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ config, setConfig }) => {
  const [formConfig, setFormConfig] = useState<SchoolConfig>(config);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const success = await saveSchoolConfig(formConfig);
    
    if (success) {
      setConfig(formConfig);
      setMessage({ text: 'Pengaturan berhasil disimpan!', type: 'success' });
    } else {
      setMessage({ text: 'Gagal menyimpan pengaturan.', type: 'error' });
    }
    
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-amber-500 flex items-center gap-3 font-gaming mb-6 pb-4 border-b border-white/10">
           <Settings className="text-cyan-400" />
           PENGATURAN SEKOLAH
        </h2>
        
        {message && (
            <div className={`mb-6 p-4 rounded-xl border flex items-center justify-center text-sm font-bold ${message.type === 'success' ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-red-900/30 border-red-500 text-red-400'}`}>
                {message.text}
            </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                        <CalendarRange size={16} className="text-amber-500" />
                        Tahun Pelajaran
                    </label>
                    <input 
                        type="text" 
                        value={formConfig.academicYear}
                        onChange={(e) => setFormConfig({...formConfig, academicYear: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 outline-none focus:border-amber-500 font-mono text-lg text-center"
                        placeholder="Contoh: 2025/2026"
                        required
                    />
                    <p className="text-[10px] text-slate-600 italic text-center">Format yang disarankan: TAHUN/TAHUN (Misal: 2024/2025)</p>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                        <BookOpen size={16} className="text-cyan-500" />
                        Semester Aktif
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setFormConfig({...formConfig, semester: 'GANJIL'})}
                            className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                                formConfig.semester === 'GANJIL' 
                                ? 'bg-amber-600/20 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                                : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'
                            }`}
                        >
                            <span className="text-2xl font-bold">I</span>
                            <span className="text-xs uppercase font-bold tracking-widest">GANJIL</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormConfig({...formConfig, semester: 'GENAP'})}
                            className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                                formConfig.semester === 'GENAP' 
                                ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                                : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'
                            }`}
                        >
                            <span className="text-2xl font-bold">II</span>
                            <span className="text-xs uppercase font-bold tracking-widest">GENAP</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-white/10">
                <button type="submit" disabled={isSaving} className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-4 rounded-xl font-bold hover:from-emerald-500 hover:to-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg">
                    {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />} SIMPAN PENGATURAN
                </button>
            </div>
        </form>

      </div>
    </div>
  );
};

export default SettingsTab;
