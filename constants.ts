
import { Student } from './types';

// URL Google Apps Script Anda
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtcLk4tHst7HkGIv36oOasY6ollRDqp9AMTfKkua-5vOId6VO7c3TCsNyD2a4MNJFtOw/exec";

// DATA SISWA LENGKAP (Sample dipulihkan untuk IX A - IX G)
export const INITIAL_STUDENTS: Student[] = [
  // KELAS IX A
  { id: '1129', className: 'IX A', name: 'ABEL AULIA PASA RAMADANI', gender: 'P' },
  { id: '1132', className: 'IX A', name: 'ADITYA FIRMANSYAH', gender: 'L' },
  { id: '1133', className: 'IX A', name: 'AHMAD DANI', gender: 'L' },
  { id: '1141', className: 'IX A', name: 'ANDINI PUTRI', gender: 'P' },
  { id: '1142', className: 'IX A', name: 'BAGAS KARADENAN', gender: 'L' },
  
  // KELAS IX B
  { id: '1134', className: 'IX B', name: 'ALYA NUR AZIZAH', gender: 'P' },
  { id: '1135', className: 'IX B', name: 'BINTANG RAMADHAN', gender: 'L' },
  { id: '1143', className: 'IX B', name: 'CANTIKA SARI', gender: 'P' },
  { id: '1144', className: 'IX B', name: 'DIMAS ANGGARA', gender: 'L' },

  // KELAS IX C
  { id: '1136', className: 'IX C', name: 'CHAIRUL ANAM', gender: 'L' },
  { id: '1137', className: 'IX C', name: 'DEWI SARTIKA', gender: 'P' },
  { id: '1145', className: 'IX C', name: 'FAJAR SHODIQ', gender: 'L' },
  { id: '1146', className: 'IX C', name: 'GITA GUTAW', gender: 'P' },

  // KELAS IX D
  { id: '1138', className: 'IX D', name: 'EKO PRASETYO', gender: 'L' },
  { id: '1139', className: 'IX D', name: 'FITRIANI', gender: 'P' },
  { id: '1147', className: 'IX D', name: 'HENDRA SETIAWAN', gender: 'L' },
  { id: '1148', className: 'IX D', name: 'INDAH PERMATASARI', gender: 'P' },

  // KELAS IX E
  { id: '1140', className: 'IX E', name: 'GALIH RAKASWI', gender: 'L' },
  { id: '1149', className: 'IX E', name: 'JOKO TINGKIR', gender: 'L' },
  { id: '1150', className: 'IX E', name: 'KARTIKA PUTRI', gender: 'P' },

  // KELAS IX F
  { id: '1151', className: 'IX F', name: 'LUKMAN HAKIM', gender: 'L' },
  { id: '1152', className: 'IX F', name: 'MAWAR MELATI', gender: 'P' },
  { id: '1153', className: 'IX F', name: 'NANDA SAPUTRA', gender: 'L' },

  // KELAS IX G
  { id: '1154', className: 'IX G', name: 'OPICK TOMBOATI', gender: 'L' },
  { id: '1155', className: 'IX G', name: 'PUTRI SALJU', gender: 'P' },
  { id: '1156', className: 'IX G', name: 'QOMARUDDIN', gender: 'L' }
];

export const TEACHERS = [
  "Dra. Sri Hayati",
  "Bakhtiar Rifai, SE",
  "Moch. Husain Rifai Hamzah, S.Pd.",
  "Rudi Hermawan, S.Pd.I",
  "Okha Devi Anggraini, S.Pd.",
  "Eka Hariyati, S. Pd.",
  "Mikoe Wahyudi Putra, ST., S. Pd.",
  "Purnadi, S. Pd.",
  "Israfin Maria Ulfa, S.Pd",
  "Syadam Budi Satrianto, S.Pd",
  "Rebby Dwi Prataopu, S.Si",
  "Mukhamad Yunus, S.Pd",
  "Fahmi Wahyuni, S.Pd",
  "Fakhita Madury, S.Sn",
  "Retno Nawangwulan, S. Pd.",
  "Emilia Kartika Sari, S.Pd",
  "Akhmad Hariadi, S.Pd"
];

export const STORAGE_KEYS = {
  STUDENTS: 'smpn3pacet_students_cache',
  ATTENDANCE: 'smpn3pacet_attendance_cache',
  AUTH: 'smpn3pacet_auth_session'
};
