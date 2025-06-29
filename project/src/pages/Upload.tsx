import React, { useState, useCallback } from 'react';
import { Layout } from '../components/common/Layout';
import { Upload as UploadIcon, FileText, Users, CheckCircle, AlertTriangle, X, Download, Database, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { StudentService } from '../services/studentService';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface UploadResult {
  id: string;
  filename: string;
  type: 'student';
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors: string[];
  uploadedAt: string;
  status: 'success' | 'partial' | 'failed';
}

export const Upload: React.FC = () => {
  const { user } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [uploads, setUploads] = useState<UploadResult[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [dbStats, setDbStats] = useState({
    totalStudents: 0,
    byState: {},
    byClass: {},
    byStatus: {}
  });

  // Test database connection on component mount
  React.useEffect(() => {
    testDatabaseConnection();
    loadDatabaseStats();
    
    // Auto-upload the provided CSV data
    uploadProvidedData();
  }, []);

  const uploadProvidedData = async () => {
    const csvData = `student_name,contact_number,class,year,state,gender,father_name,mother_name,parents_number,student_mail_id,address,pincode,college_school,entrance_exam,stream,rank,board,district,city,date_of_birth
DEEPIKA KUMARI,9546737766,12th,2025,JHARKHAND,,RAMJIT MAHTO,ARTI DEVI,,,,,A G CHURCH HIGH SCHOOL TIRIL (UNAIDED),,,,,,2007-01-01
HOLIKA MUNDA,9709166683,12th,2025,JHARKHAND,,KALESHWER MUNDA,ANJALI DEVI,,,,,A G CHURCH HIGH SCHOOL TIRIL (UNAIDED),,,,,,2007-01-01
PRIYA TIRKEY,9709166683,12th,2025,JHARKHAND,,MADAN ORAON,SOMARI DEVI,,,,,A G CHURCH HIGH SCHOOL TIRIL (UNAIDED),,,,,,2007-01-01
PRIYANKA KUMARI,7209556588,12th,2025,JHARKHAND,,RAMESH MAHTO,SADHNI DEVI,,,,,A G CHURCH HIGH SCHOOL TIRIL (UNAIDED),,,,,,2007-01-01
SONU KUMARI,8757669355,12th,2025,JHARKHAND,,PANNIRAM MAHTO,SAHARMANI DEVI,,,,,A G CHURCH HIGH SCHOOL TIRIL (UNAIDED),,,,,,2007-01-01
ANUP TIRKEY,8404819245,12th,2025,JHARKHAND,,SOMA TIRKEY,NAIPEE TIRKEY,,,,,A G CHURCH SCHOOL BARGARI,,,,,,2007-01-01
ABU SUFAN,9204115219,12th,2025,JHARKHAND,,MD ISTEYAK AHMAD,ARJAMAN KHATOON,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
ALI HASAN,7050306795,12th,2025,JHARKHAND,,ALI IMAMANSARI,MEHJABEEN NAAZ,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
ALIYA KAUSHER,8092323128,12th,2025,JHARKHAND,,MD RIZWAN,PARWEEN KAUSAR,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
ASLAM RAZA,9304547264,12th,2025,JHARKHAND,,MD SALIM ANSARI,ABIDA KHATOON,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
DARAKSHA NAAZ,8271325764,12th,2025,JHARKHAND,,MD ZUBAIR ALAM,MAHZABI ARA,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
GHAZALA PARWEEN,8092495837,12th,2025,JHARKHAND,,MD ZAFRUL ISLAM,SABIHA KHATOON,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
JYOTI KUMARI,7209337483,12th,2025,JHARKHAND,,SURAJ RAM,PINKI DEVI,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
KHUSHI PARWEEN,7255948311,12th,2025,JHARKHAND,,GOLBABU ANSARI,RUKAIYA KHATOON,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
MD AHTESAM,7352010111,12th,2025,JHARKHAND,,MD MAHTAB AHMAD,WAHIDA KHATOON,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
MD AZA ALAM,8797859219,12th,2025,JHARKHAND,,MD RASHID ANSARI,NURAISHAA KHATOON,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
MD DANISH RAZA,9709232896,12th,2025,JHARKHAND,,MD SHAHADAT HUSSAIN,AJMERI KHATOON,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
MD KAIF KHAN,9934561186,12th,2025,JHARKHAND,,MD ANWAR KHAN,ABIDA KHATOON,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
MD SHAHNAWAZ,8797703277,12th,2025,JHARKHAND,,MD NAYEEM,SAKINA KHATOON,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
MD SHAHNAWAZ KHAN,8271501401,12th,2025,JHARKHAND,,MD SHAHZAD KHAN,AMNA KHATOON,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
MD SOHAIL ANSARI,8294002821,12th,2025,JHARKHAND,,MD SALEHIN ANSARI,JAHANARA PARWEEN,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
MUSKAN PARWEEN,9771729823,12th,2025,JHARKHAND,,MD AKBAR ALI ANSARI,SALMA KHATOON,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
NAAZ AFRIN,9308498614,12th,2025,JHARKHAND,,YASHIN ANSARI,MERAJUM NISHA,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
NAZIYA PARWEEN,9386157791,12th,2025,JHARKHAND,,MD IMAMUL HODA,NUSHRAT JAHAN,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
RAJIYA PARWEEN,9006884159,12th,2025,JHARKHAND,,JAMSHED KHAN,AKBARI KHATOON,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
SAHIDA KHATOON,8603691776,12th,2025,JHARKHAND,,MD FIROJ ANSARI,SALMA KHATOON,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
SAHIL KUMAR,7209337483,12th,2025,JHARKHAND,,SURAJ RAM,PINKI DEVI,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
SALIM ANSARI,9031197112,12th,2025,JHARKHAND,,MD ASLAM,SHAHNAZ BEGAM,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
SAMIR AFTAB,9835348709,12th,2025,JHARKHAND,,ABDUL GAFFAR ANSARI,SANJEEDA KHATOON,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
SANIYA PARWEN,8092771994,12th,2025,JHARKHAND,,PARWEEZ ANWARUL HAQUE,SHABNAK PARWEEN,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
SHADIYA TABASSUM,9334286110,12th,2025,JHARKHAND,,MD KAISHAR JAMA,NAZIYA PARWEEN,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
UMME SALMA,7079009092,12th,2025,JHARKHAND,,FAKRUDDIN ANSARI,SAKILA BIBI,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
ZAINAB KHATOON,8235663585,12th,2025,JHARKHAND,,MD ALI RAZA,KHURSHIDA KHATOON,,,,,A K PUBLIC SCHOOL,,,,,,2007-01-01
SWAPNIL KUMAR,8092690648,12th,2025,JHARKHAND,,ANIL KUMAR,SHWETA SINGH,,,,,A NEW EDEN SCHOOL HARHARGUTTU,,,,,,2007-01-01
TRISHA THAKUR,9431643700,12th,2025,JHARKHAND,,BHOGENDRA THAKUR,RANJU DEVI,,,,,A NEW EDEN SCHOOL HARHARGUTTU,,,,,,2007-01-01
VANSHIKA SINHA,7209607392,12th,2025,JHARKHAND,,DEEPAK KUMAR,SAROJ LATA SINHA,,,,,A NEW EDEN SCHOOL HARHARGUTTU,,,,,,2007-01-01
YASHOPRIYA,9031057220,12th,2025,JHARKHAND,,VIVEK PRIYA,HARSHIKA PRIYA,,,,,A NEW EDEN SCHOOL HARHARGUTTU,,,,,,2007-01-01
ALTAF RAZA,9097867802,12th,2025,JHARKHAND,,MD. JAVED HUSSAIN,ZEENA TARRANUM,,,,,A S PUBLIC SCHOOL,,,,,,2007-01-01
AMMAR YASIR,8409711695,12th,2025,JHARKHAND,,MINHAAZ,SHAME PERWEEN,,,,,A S PUBLIC SCHOOL,,,,,,2007-01-01
DILSHAN AKHTAR,8651145930,12th,2025,JHARKHAND,,MD. AKHTAR,NOORJAHAN KHATOON,,,,,A S PUBLIC SCHOOL,,,,,,2007-01-01
MD. RAHMAT,9955303721,12th,2025,JHARKHAND,,GULAM MOHAMNI,KAUSAR PERWEEN,,,,,A S PUBLIC SCHOOL,,,,,,2007-01-01
NARGIS JAHAN,9905898001,12th,2025,JHARKHAND,,ANSARI,MAJDA KHATOON,,,,,A S PUBLIC SCHOOL,,,,,,2007-01-01
SAHIL HABIB,9931103155,12th,2025,JHARKHAND,,HABIBULLAH,PERWEEN ARRA,,,,,A S PUBLIC SCHOOL,,,,,,2007-01-01
SAMAD SARWAR,9661974088,12th,2025,JHARKHAND,,GULAM SARWAR,NAGMA NIGAR,,,,,A S PUBLIC SCHOOL,,,,,,2007-01-01
SANIYA NISHA,7739605472,12th,2025,JHARKHAND,,MURSHID ANSARI,KHATOON,,,,,A S PUBLIC SCHOOL,,,,,,2007-01-01
ZIYA HASAN,9939172007,12th,2025,JHARKHAND,,IKRAMUL ANSARI,KHATOON,,,,,A S PUBLIC SCHOOL,,,,,,2007-01-01
ABHAY SAH,8235317396,12th,2025,JHARKHAND,,HARIDWARS,NISH DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
ABHIGYAN JYOTI KRI,8540828878,12th,2025,JHARKHAND,,RANGESH SHARMA,RINKI DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
ABHISHEK PATRO,8092232522,12th,2025,JHARKHAND,,LAKHINDAR PATRO,PADMAWATI PATRO,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
ADARSH KUMAR,7209639009,12th,2025,JHARKHAND,,ARUN MISHRA,SHARMILA MISHRA,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
AJIT RAJAK,8797925516,12th,2025,JHARKHAND,,ARUN RAJAK,DURGA DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
AKANKSHA HORO,8603218535,12th,2025,JHARKHAND,,AMAN HORO,AMJILINA HORO,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
AKASH KUMAR,8083413602,12th,2025,JHARKHAND,,PINTU SHARMA,SONI DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
AMAN KUMAR,9122128498,12th,2025,JHARKHAND,,BIRENDRA BHAGAT,BABY DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
AMAN MUNDA,7209473586,12th,2025,JHARKHAND,,CHAMURAM MUNDA,PARVATI DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
AMRITA KRI,9304298155,12th,2025,JHARKHAND,,SATYENDRA YADAV,GAYITARI DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
ANCHAL KUMARI,9204734182,12th,2025,JHARKHAND,,SAHDEO TANTI,BINA DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
ANJALI KANDIR,9572159117,12th,2025,JHARKHAND,,LOKNATH KANDIR,MANDANI KANDIR,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
ANJALI MUKHI,7764838124,12th,2025,JHARKHAND,,BASANTO MUKHI,SANDHYA MUKHI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
ANKIT KR SHR,9204238681,12th,2025,JHARKHAND,,SURAJ KR. SHR,SONI DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
ANKIT KR. SAH,8409553721,12th,2025,JHARKHAND,,BHAWN GUPTA,USHA DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
ANKIT KUMAR,8092322082,12th,2025,JHARKHAND,,PINTU PRASAD,ANITA DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
ANKUR TOPNO,7209690263,12th,2025,JHARKHAND,,VIJAY TOPNO,FULMANI TOPNO,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
ANSHU KRI,9934538544,12th,2025,JHARKHAND,,PARSHOTM PAND,PUSPHA DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
ANUP KR. YADAV,9031735212,12th,2025,JHARKHAND,,HURALAL YADAV,SUKURMUNI DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
ARIVND KR. YADAV,9128098370,12th,2025,JHARKHAND,,KANHIYA SINGH,PREMA DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
ARTI KRI,7209852915,12th,2025,JHARKHAND,,HARENDRA SAH,MANJU DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
ARUSHI KRI,7277720268,12th,2025,JHARKHAND,,ARUN SINGH,SADNA DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
AYUSH KUMAR,7739229939,12th,2025,JHARKHAND,,VARUN KAMAT,BAGWANTI DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
AYUSH KUMAR,8603647240,12th,2025,JHARKHAND,,MUKUND KR. SINGH,KUSUM DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
AYUSHMAN VAID,8877071722,12th,2025,JHARKHAND,,PRADIP KR. BAID,PUSPANJALI DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
CHANCHAL KRI,7250537928,12th,2025,JHARKHAND,,ANIL THAKUR,RINKU DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
CHANDA KUMARI,7209422884,12th,2025,JHARKHAND,,GANESH KARMAKAR,SARSWATI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
CHANDANI DELRO,9031399706,12th,2025,JHARKHAND,,LORNSE DELROCK,REENA DELROCK,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
CHHAMA KRI,8409041296,12th,2025,JHARKHAND,,SHATRUDHAN YD,LALITA DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
DISHAN SINGH,8405939100,12th,2025,JHARKHAND,,RAKESH SINGH,ARTI SINGH,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
DIVYA BARJO,8092404607,12th,2025,JHARKHAND,,VIMAL BARJO,SHEELA BARJO,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
GUNJAN KUMARI,7209639009,12th,2025,JHARKHAND,,YOGINDRA PAN,SUNILA DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
HARSH RAJ,7352045521,12th,2025,JHARKHAND,,VIREDRA PRASAD,VIBHA DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
JAIDEV SINGH,9570207215,12th,2025,JHARKHAND,,NIMAY SINGH,RUPALI SINGH,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
JYOTI KUMAR,7209938920,12th,2025,JHARKHAND,,SUNIL MODI,SUMITA MODI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
JYOTI KUMAR,9031721374,12th,2025,JHARKHAND,,SHANKER PRAJA,SUGAM DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
KAJAL KUMARI,9709200377,12th,2025,JHARKHAND,,UPENDRA SAH,RINKU DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
KAMAL KR. MANDAL,8294074340,12th,2025,JHARKHAND,,GYAN RAMJAN MANDAL,PUSPA DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
KARAN KAMAT,8873902615,12th,2025,JHARKHAND,,SHIVU SINGH,SARASWATI DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
KASHISH KRI,9195143467,12th,2025,JHARKHAND,,KARTIK KAMAT,GITA DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
KHUSHBOO KRI,9204431537,12th,2025,JHARKHAND,,SUKHDEV KARMAKAR,LAXMI DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
KHUSHBOO KRI,9955198428,12th,2025,JHARKHAND,,RAVINDRA KR YAD,SARITA DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
KHUSHBOO KUMARI,7209770742,12th,2025,JHARKHAND,,BALINDER YADAV,GITA DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
KHUSI KUMARI,9234296559,12th,2025,JHARKHAND,,BIRENDRA KR,GURIYA DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
KIRAN KRI,9204431537,12th,2025,JHARKHAND,,SHUKDEV KARMA,LAXMI KARMA,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
KIRAN KUMARI,9835930485,12th,2025,JHARKHAND,,AJAY MALAKAR,SUMAN DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
KRISHIKA KRI,7209852113,12th,2025,JHARKHAND,,KAUSHAL KUMAR,KHUSBOO SHARMA,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
LAXMI KUMARI,7209980710,12th,2025,JHARKHAND,,BIRENDRA THAKUR,LALITA DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
LAXMI KUMARI,7808458046,12th,2025,JHARKHAND,,HARISH CHNDRA NAY,PANKJANI DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
MANISH KR,7209917196,12th,2025,JHARKHAND,,DEEPAK KUMAR,SANGITA KRI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
MOHIT KUMAR,8092233827,12th,2025,JHARKHAND,,SANTOSH KUMAR,SAVITRI DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
MUSKAN KUMARI,9234320936,12th,2025,JHARKHAND,,ARUN MAHATO,SONI DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
NIKITA KUMARI,8797249444,12th,2025,JHARKHAND,,BIRJU RAHTAN,SARHI TANTU,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01
NISHU KUMARI,7209593479,12th,2025,JHARKHAND,,ANUJ THAKUR,MANJU DEVI,,,,,A.B.M.P.ADARSH HS-MS,,,,,,2007-01-01`;

    setUploading(true);
    
    try {
      // Parse the CSV data
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          processUpload(results.data, 'student_template.csv');
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          toast.error('Error parsing CSV data');
          setUploading(false);
        }
      });
    } catch (error) {
      console.error('Error processing provided data:', error);
      toast.error('Error processing student data');
      setUploading(false);
    }
  };

  const testDatabaseConnection = async () => {
    try {
      const connected = await StudentService.testConnection();
      setIsConnected(connected);
    } catch (error) {
      console.error('Connection test failed:', error);
      setIsConnected(false);
    }
  };

  const loadDatabaseStats = async () => {
    try {
      const stats = await StudentService.getDatabaseStats();
      setDbStats(stats);
    } catch (error) {
      console.error('Failed to load database stats:', error);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const processFileData = (data: any[], filename: string) => {
    const processedStudents = data.map((row, index) => {
      // Validate required fields
      const studentName = row.student_name || row['Student Name'] || row.name || row.Name || '';
      const contactNumber = row.contact_number || row['Contact Number'] || row.phone || row.Phone || '';
      const className = row.class || row['Class'] || row.class_exam || row.classExam || '';
      const year = parseInt(row.year || row.Year || row.academic_year || '0');
      const state = row.state || row.State || '';

      // Check if required fields are present
      if (!studentName.trim()) {
        throw new Error(`Row ${index + 1}: Student name is required`);
      }
      if (!contactNumber.trim()) {
        throw new Error(`Row ${index + 1}: Contact number is required`);
      }
      if (!className.trim()) {
        throw new Error(`Row ${index + 1}: Class is required`);
      }
      if (!year || year === 0) {
        throw new Error(`Row ${index + 1}: Year is required`);
      }
      if (!state.trim()) {
        throw new Error(`Row ${index + 1}: State is required`);
      }

      // Handle date of birth - provide a default date instead of null
      const dobValue = row.date_of_birth || row['Date of Birth'] || row.dob || row.DOB;
      let dateOfBirth = '2000-01-01'; // Default date
      
      if (dobValue && dobValue.trim()) {
        // Try to parse the date
        const parsedDate = new Date(dobValue);
        if (!isNaN(parsedDate.getTime())) {
          dateOfBirth = parsedDate.toISOString().split('T')[0];
        }
      }

      // Map fields to student structure for Supabase (using database column names)
      const student = {
        // Required fields
        studentname: studentName.trim(),
        contactnumber: contactNumber.trim(),
        class: className.trim(),
        year: year,
        state: state.trim(),
        dateofbirth: dateOfBirth, // Always provide a valid date
        
        // Optional fields with proper defaults
        gender: (row.gender || row.Gender || 'not_specified').toLowerCase(),
        fathername: row.father_name || row['Father Name'] || row.fatherName || '',
        mothername: row.mother_name || row['Mother Name'] || row.motherName || '',
        parentsnumber: row.parents_number || row['Parents Number'] || row.parent_phone || '',
        studentmailid: row.student_mail_id || row['Student Mail ID'] || row.email || row.Email || '',
        address: row.address || row.Address || row.location || '',
        pincode: row.pincode || row.Pincode || row.pin || '',
        collegeschool: row.college_school || row['College/School'] || row.institution || '',
        entranceexam: row.entrance_exam || row['Entrance Exam'] || row.exam || '',
        stream: row.stream || row.Stream || row.branch || row.Branch || '',
        rank: parseInt(row.rank || row.Rank || '0') || null,
        board: row.board || row.Board || row.education_board || '',
        district: row.district || row.District || row.city || '',
        city: row.city || row.City || row.district || '',
        category: row.category || row.Category || row.caste || 'General',
        examspreparing: typeof (row.exams_preparing || row.exams) === 'string' 
          ? (row.exams_preparing || row.exams).split(',').map((e: string) => e.trim()).filter(e => e)
          : Array.isArray(row.exams_preparing) ? row.exams_preparing : [],
        marks10th: parseInt(row.marks_10th || row['10th Marks'] || row.tenth_marks || '0') || 0,
        marks12th: parseInt(row.marks_12th || row['12th Marks'] || row.twelfth_marks || '0') || null,
        graduationmarks: parseInt(row.graduation_marks || row['Graduation Marks'] || '0') || null,
        institutionname: row.institution_name || row['Institution Name'] || user?.institutionName || '',
        admissionstatus: (row.admission_status || row.status || 'new').toLowerCase(),
        followupstatus: (row.follow_up_status || 'pending').toLowerCase(),
        callstatus: row.call_status || null,
        calloutcome: row.call_outcome || null,
        notes: row.notes || row.Notes || row.remarks || null,
        assignedto: user?.id || null,
        assignedexecutive: row.assigned_executive || null,
        tags: typeof row.tags === 'string' ? row.tags.split(',').map((t: string) => t.trim()).filter(t => t) : [],
        createdby: user?.id || null,
        lastupdatedby: user?.id || null
      };
      
      return student;
    });

    return processedStudents;
  };

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const supportedFormats = ['csv', 'xlsx', 'xls', 'json', 'txt'];
    
    if (!supportedFormats.includes(fileExtension || '')) {
      toast.error('Please upload a supported file format (CSV, Excel, JSON, TXT)');
      return;
    }

    setUploading(true);
    
    try {
      let parsedData: any[] = [];
      
      if (fileExtension === 'csv' || fileExtension === 'txt') {
        // Parse CSV/TXT files
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            parsedData = results.data;
            processUpload(parsedData, file.name);
          },
          error: (error) => {
            console.error('CSV parsing error:', error);
            toast.error('Error parsing CSV file');
            setUploading(false);
          }
        });
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        // Parse Excel files
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            parsedData = XLSX.utils.sheet_to_json(worksheet);
            processUpload(parsedData, file.name);
          } catch (error) {
            console.error('Excel parsing error:', error);
            toast.error('Error parsing Excel file');
            setUploading(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (fileExtension === 'json') {
        // Parse JSON files
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            parsedData = JSON.parse(e.target?.result as string);
            if (!Array.isArray(parsedData)) {
              throw new Error('JSON must contain an array of records');
            }
            processUpload(parsedData, file.name);
          } catch (error) {
            console.error('JSON parsing error:', error);
            toast.error('Error parsing JSON file');
            setUploading(false);
          }
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error('File processing error:', error);
      toast.error('Error processing file');
      setUploading(false);
    }
  };

  const processUpload = async (data: any[], filename: string) => {
    try {
      if (!data || data.length === 0) {
        toast.error('No data found in file');
        setUploading(false);
        return;
      }

      const totalRows = data.length;
      let successfulRows = 0;
      let failedRows = 0;
      const errors: string[] = [];

      // Process and validate data
      const validStudents: any[] = [];
      
      for (let i = 0; i < data.length; i++) {
        try {
          const processedStudent = processFileData([data[i]], filename)[0];
          validStudents.push(processedStudent);
        } catch (error) {
          errors.push(error instanceof Error ? error.message : `Row ${i + 1}: Processing error`);
          failedRows++;
        }
      }

      // Store in Supabase database
      if (validStudents.length > 0) {
        try {
          console.log(`Attempting to insert ${validStudents.length} students into Supabase database...`);
          
          const result = await StudentService.insertStudents(validStudents);
          successfulRows = result.success;
          
          if (result.errors.length > 0) {
            errors.push(...result.errors);
            failedRows += (validStudents.length - result.success);
          }

          console.log(`Successfully inserted ${successfulRows} students into database`);
          setIsConnected(true);
          
          // Refresh database stats
          await loadDatabaseStats();
          
        } catch (insertError) {
          console.error('Database insert error:', insertError);
          errors.push('Database connection error: ' + (insertError instanceof Error ? insertError.message : 'Unknown error'));
          failedRows = totalRows;
          successfulRows = 0;
          setIsConnected(false);
        }
      }

      // Create upload result
      const uploadResult: UploadResult = {
        id: Date.now().toString(),
        filename,
        type: 'student',
        totalRows,
        successfulRows,
        failedRows,
        errors: errors.slice(0, 10), // Show only first 10 errors
        uploadedAt: new Date().toISOString(),
        status: failedRows === 0 ? 'success' : failedRows < totalRows * 0.1 ? 'partial' : 'failed'
      };

      setUploads(prev => [uploadResult, ...prev]);
      setUploading(false);
      
      if (uploadResult.status === 'success') {
        toast.success(`Successfully uploaded ${successfulRows.toLocaleString()} student records to Supabase database`);
      } else if (uploadResult.status === 'partial') {
        toast.success(`Uploaded ${successfulRows.toLocaleString()} records with ${failedRows} errors`);
      } else {
        toast.error(`Upload failed with ${failedRows} errors`);
      }

    } catch (error) {
      console.error('Upload processing error:', error);
      toast.error('Error processing upload');
      setUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'partial':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partial':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const downloadTemplate = () => {
    const headers = 'student_name,contact_number,class,year,state,gender,father_name,mother_name,parents_number,student_mail_id,address,pincode,college_school,entrance_exam,stream,rank,board,district,city,date_of_birth';
    const sampleData = 'John Doe,+919876543210,12th,2024,Maharashtra,male,Father Name,Mother Name,+919876543211,john@email.com,123 Main St,400001,ABC School,JEE Main,Science,1000,CBSE,Mumbai,Mumbai,2000-01-01';
    const csvContent = headers + '\n' + sampleData;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Student template downloaded');
  };

  const testConnection = async () => {
    const connected = await StudentService.testConnection();
    setIsConnected(connected);
    toast.success(connected ? 'Database connected successfully!' : 'Database connection failed');
  };

  if (user?.role !== 'admin' && user?.role !== 'manager') {
    return (
      <Layout title="Data Upload">
        <div className="text-center py-12">
          <X className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">
            Only Backend and Manager portal users can upload data. Contact your system administrator for access.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Data Upload">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {user?.role === 'admin' ? 'Backend Data Upload Center' : 'Institution Data Upload'}
              </h2>
              <p className="text-gray-600">
                Upload student data using various file formats. All uploaded data is stored in Supabase database and made available based on your assigned scope.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`flex items-center px-3 py-2 rounded-lg ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isConnected ? <Wifi className="w-4 h-4 mr-2" /> : <WifiOff className="w-4 h-4 mr-2" />}
                <span className="text-sm font-medium">
                  {isConnected ? 'Supabase Connected' : 'Database Offline'}
                </span>
              </div>
              <button
                onClick={testConnection}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Test Connection
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploading ? (
                  <div>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-lg font-medium text-gray-900 mb-2">Processing and storing in Supabase database...</div>
                    <div className="text-sm text-gray-600">This may take a few minutes for large files</div>
                  </div>
                ) : (
                  <>
                    <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Upload student data file
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Drag and drop your file here, or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls,.json,.txt"
                      onChange={(e) => e.target.files && handleFiles(e.target.files)}
                      className="hidden"
                      id="file-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 cursor-pointer transition-all duration-200 shadow-lg"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Choose File
                    </label>
                  </>
                )}
              </div>

              {/* File Requirements */}
              <div className="mt-6 bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-2">Required Fields (Mandatory):</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    student_name
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    contact_number
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    class
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    year
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    state
                  </div>
                </div>
                
                <h4 className="font-medium text-gray-900 mb-2">Optional Fields:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    gender
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    father_name
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    mother_name
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    parents_number
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    student_mail_id
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    address
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    college_school
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    entrance_exam
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    stream
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    date_of_birth
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    All other fields
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <strong>Supported formats:</strong> CSV, Excel (.xlsx, .xls), JSON, TXT
                </div>
                <div className="mt-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
                  <strong>Database:</strong> Data is stored in Supabase PostgreSQL database with full ACID compliance and real-time capabilities.
                </div>
                <div className="mt-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                  <strong>Note:</strong> If date_of_birth is not provided, a default date (2000-01-01) will be used to satisfy database constraints.
                </div>
              </div>

              {/* Download Template */}
              <div className="mt-6">
                <button 
                  onClick={downloadTemplate}
                  className="flex items-center px-4 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Student Template
                </button>
              </div>
            </div>
          </div>

          {/* Upload History */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upload History</h3>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <Database className="w-3 h-3 mr-1" />
                  {isConnected ? 'Connected' : 'Offline'}
                </div>
              </div>
              
              {uploads.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Processing upload...</p>
                  <p className="text-gray-400 text-xs mt-1">Upload history will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {uploads.map((upload) => (
                    <div key={upload.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm truncate mb-1">
                            {upload.filename}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Student data • {new Date(upload.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {getStatusIcon(upload.status)}
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total rows:</span>
                          <span className="font-medium">{upload.totalRows.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Stored in DB:</span>
                          <span className="font-medium text-green-600">{upload.successfulRows.toLocaleString()}</span>
                        </div>
                        {upload.failedRows > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Failed:</span>
                            <span className="font-medium text-red-600">{upload.failedRows.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(upload.status)}`}>
                        {upload.status.toUpperCase()}
                      </span>
                      
                      {upload.errors.length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                            View errors ({upload.errors.length})
                          </summary>
                          <div className="mt-1 text-xs text-red-600 space-y-1 max-h-20 overflow-y-auto bg-red-50 p-2 rounded">
                            {upload.errors.map((error, index) => (
                              <div key={index}>• {error}</div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Database Stats */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Supabase Database</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Records</span>
                  <span className="font-medium text-green-600">
                    {dbStats.totalStudents.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Upload Sessions</span>
                  <span className="font-medium">{uploads.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium text-blue-600">
                    {uploads.length > 0 
                      ? Math.round((uploads.filter(u => u.status === 'success').length / uploads.length) * 100)
                      : 0
                    }%
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-900">Database Status</span>
                    <span className={`${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                      {isConnected ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Help */}
            <div className="mt-6 bg-blue-50 rounded-2xl p-4 border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Database Info</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Connected to Supabase PostgreSQL</p>
                <p>• Real-time data synchronization</p>
                <p>• Automatic backups & scaling</p>
                <p>• Row-level security enabled</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};