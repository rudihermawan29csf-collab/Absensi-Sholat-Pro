
import { Student, AttendanceRecord } from '../types';
import { INITIAL_STUDENTS, STORAGE_KEYS } from '../constants';
import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  addDoc, 
  query, 
  orderBy, 
  deleteDoc, 
  updateDoc,
  where,
  limit
} from 'firebase/firestore';

// Nama Koleksi di Database
const COLL_STUDENTS = 'students';
const COLL_ATTENDANCE = 'attendance';

// --- STUDENTS SERVICE ---

export const getStudents = async (): Promise<Student[]> => {
  // Jika Firebase belum dikonfigurasi, gunakan Local Storage saja
  if (!isFirebaseConfigured) {
    const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return stored ? JSON.parse(stored) : INITIAL_STUDENTS;
  }

  try {
    const querySnapshot = await getDocs(collection(db, COLL_STUDENTS));
    const students: Student[] = [];
    
    querySnapshot.forEach((doc) => {
      students.push(doc.data() as Student);
    });

    if (students.length === 0) {
      return INITIAL_STUDENTS;
    }

    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    return students;
  } catch (e) {
    console.error("Error fetching students from Firebase:", e);
    const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return stored ? JSON.parse(stored) : INITIAL_STUDENTS;
  }
};

export const saveStudents = async (students: Student[]): Promise<boolean> => {
  // Selalu simpan ke local storage agar UI responsif instan
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));

  if (!isFirebaseConfigured) {
    console.warn("Firebase belum dikonfigurasi. Data hanya tersimpan di browser ini.");
    return true;
  }

  try {
    const promises = students.map(student => {
      // FIX: Ensure no undefined values are sent to Firestore
      const safeStudent = {
         id: student.id || '',
         name: student.name || '',
         className: student.className || 'Unknown',
         gender: student.gender || 'L',
         parentPhone: student.parentPhone || null // Firestore prefers null over undefined
      };
      return setDoc(doc(db, COLL_STUDENTS, safeStudent.id), safeStudent);
    });
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error("Error saving students to Firebase:", error);
    return false;
  }
};

// --- ATTENDANCE SERVICE ---

export const getAttendance = async (): Promise<AttendanceRecord[]> => {
  if (!isFirebaseConfigured) {
    const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return stored ? JSON.parse(stored) : [];
  }

  try {
    const q = query(collection(db, COLL_ATTENDANCE), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const records: AttendanceRecord[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as AttendanceRecord;
      records.push({ ...data, id: doc.id });
    });

    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
    return records;
  } catch (e) {
    console.error("Error fetching attendance:", e);
    const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return stored ? JSON.parse(stored) : [];
  }
};

export const deleteAttendanceRecord = async (id: string): Promise<boolean> => {
  // Update local cache manually
  const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  if (stored) {
      const records = JSON.parse(stored) as AttendanceRecord[];
      const filtered = records.filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(filtered));
  }

  if (!isFirebaseConfigured) return true;

  try {
    await deleteDoc(doc(db, COLL_ATTENDANCE, id));
    return true;
  } catch (e) {
    console.error("Error deleting:", e);
    return false;
  }
};

export const updateAttendanceStatus = async (id: string, newStatus: 'PRESENT' | 'HAID'): Promise<boolean> => {
  // Update local cache
  const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  if (stored) {
      const records = JSON.parse(stored) as AttendanceRecord[];
      const index = records.findIndex(r => r.id === id);
      if (index !== -1) {
          records[index].status = newStatus;
          localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
      }
  }

  if (!isFirebaseConfigured) return true;

  try {
    const recordRef = doc(db, COLL_ATTENDANCE, id);
    await updateDoc(recordRef, { status: newStatus });
    return true;
  } catch (e) {
    console.error("Error updating:", e);
    return false;
  }
};

export const addAttendanceRecordToSheet = async (
  student: Student, 
  operatorName: string, 
  status: 'PRESENT' | 'HAID' = 'PRESENT'
): Promise<{ success: boolean; message: string; record?: AttendanceRecord }> => {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  const cachedRecords: AttendanceRecord[] = stored ? JSON.parse(stored) : [];
  
  if (cachedRecords.some((r) => r.studentId === student.id && r.date === today)) {
    return { success: false, message: `${student.name} sudah absen hari ini.` };
  }

  // Buat ID sementara jika offline, atau biarkan Firestore generate nanti
  const offlineId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // FIX: Force fallback values for optional/missing fields to avoid 'undefined' in Firestore
  const newRecord: AttendanceRecord = {
    id: offlineId, // Temporary ID
    studentId: student.id || 'N/A',
    studentName: student.name || 'Unknown',
    className: student.className || 'Unknown',
    date: today,
    timestamp: Date.now(),
    operatorName: operatorName || 'System',
    status: status || 'PRESENT'
  };

  // Update Local Storage SEGERA
  const updatedRecords = [newRecord, ...cachedRecords];
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(updatedRecords));

  if (!isFirebaseConfigured) {
    return { 
      success: true, 
      message: `${newRecord.studentName} berhasil ABSEN (Mode Offline).`,
      record: newRecord 
    };
  }

  try {
    // Hapus ID sebelum kirim ke firestore agar digenerate otomatis
    const { id, ...recordData } = newRecord;
    
    // Explicitly casting recordData and ensuring no undefined values
    // Firestore addDoc throws error if any value is undefined.
    // JSON.stringify will remove keys that are undefined.
    const safeRecordData = JSON.parse(JSON.stringify(recordData));

    const docRef = await addDoc(collection(db, COLL_ATTENDANCE), safeRecordData);
    
    // Perbarui ID di local storage dengan ID asli dari Firestore
    const finalRecord = { ...newRecord, id: docRef.id };
    const fixedRecords = updatedRecords.map(r => r.id === offlineId ? finalRecord : r);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(fixedRecords));

    return { 
      success: true, 
      message: `${newRecord.studentName} berhasil ABSEN.`,
      record: finalRecord 
    };
  } catch (error) {
    console.error("Error adding attendance:", error);
    // Tetap return sukses karena sudah tersimpan di local
    return { success: true, message: "Tersimpan Lokal (Gagal Sync ke Server).", record: newRecord };
  }
};
