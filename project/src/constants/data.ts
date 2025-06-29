export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export const DISTRICTS_BY_STATE: Record<string, string[]> = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Sangli', 'Satara', 'Ahmednagar', 'Thane', 'Raigad', 'Ratnagiri', 'Sindhudurg', 'Dhule', 'Jalgaon', 'Nandurbar', 'Beed', 'Hingoli', 'Jalna', 'Latur', 'Osmanabad', 'Parbhani', 'Nanded', 'Akola', 'Amravati', 'Buldhana', 'Washim', 'Yavatmal', 'Wardha', 'Gadchiroli', 'Chandrapur', 'Gondia', 'Bhandara'],
  'Karnataka': ['Bangalore Urban', 'Bangalore Rural', 'Mysore', 'Hubli-Dharwad', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur', 'Shimoga', 'Tumkur', 'Raichur', 'Bidar', 'Chitradurga', 'Kolar', 'Mandya', 'Hassan', 'Dakshina Kannada', 'Udupi', 'Chikmagalur', 'Kodagu', 'Chamarajanagar', 'Gadag', 'Bagalkot', 'Haveri', 'Uttara Kannada', 'Koppal', 'Yadgir', 'Chikkaballapur', 'Ramanagara'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Vellore', 'Erode', 'Thoothukudi', 'Thanjavur', 'Dindigul', 'Cuddalore', 'Kanchipuram', 'Karur', 'Nagapattinam', 'Namakkal', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Sivaganga', 'Theni', 'Thiruvallur', 'Thiruvannamalai', 'Thiruvarur', 'Virudhunagar', 'Nilgiris', 'Dharmapuri', 'Krishnagiri', 'Tirupattur', 'Ranipet', 'Kallakurichi', 'Chengalpattu', 'Tenkasi', 'Tirupathur', 'Mayiladuthurai', 'Ariyalur'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur Nagar', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Noida', 'Firozabad', 'Jhansi', 'Muzaffarnagar', 'Mathura', 'Rampur', 'Shahjahanpur', 'Farrukhabad', 'Mau', 'Hapur', 'Etawah', 'Mirzapur', 'Bulandshahr', 'Sambhal', 'Amroha', 'Hardoi', 'Fatehpur', 'Raebareli', 'Orai', 'Sitapur', 'Bahraich', 'Modinagar', 'Unnao', 'Jaunpur', 'Lakhimpur', 'Hathras', 'Banda', 'Pilibhit', 'Barabanki', 'Khurja', 'Gonda', 'Mainpuri', 'Lalitpur', 'Etah', 'Deoria', 'Ujhani', 'Ghazipur', 'Sultanpur', 'Azamgarh', 'Bijnor', 'Sahaswan', 'Basti', 'Chandausi', 'Akbarpur', 'Ballia', 'Tanda', 'Greater Noida', 'Shikohabad', 'Shamli', 'Awagarh', 'Kasganj'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Bharuch', 'Mehsana', 'Patan', 'Porbandar', 'Palanpur', 'Valsad', 'Vapi', 'Gondal', 'Veraval', 'Godhra', 'Patan', 'Kalol', 'Dahod', 'Botad', 'Amreli', 'Deesa', 'Jetpur'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar', 'Kishangarh', 'Baran', 'Dhaulpur', 'Tonk', 'Beawar', 'Hanumangarh'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Malda', 'Bardhaman', 'Kharagpur', 'Haldia', 'Raiganj', 'Krishnanagar', 'Nabadwip', 'Medinipur', 'Jalpaiguri', 'Balurghat', 'Basirhat', 'Bankura', 'Chakdaha', 'Darjeeling', 'Alipurduar', 'Purulia', 'Jangipur'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Anantapur', 'Kadapa', 'Eluru', 'Ongole', 'Nandyal', 'Machilipatnam', 'Adoni', 'Tenali', 'Chittoor', 'Hindupur', 'Proddatur', 'Bhimavaram', 'Madanapalle', 'Guntakal', 'Dharmavaram', 'Gudivada', 'Narasaraopet', 'Tadipatri', 'Mangalagiri', 'Chilakaluripet'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Miryalaguda', 'Jagtial', 'Mancherial', 'Nirmal', 'Kothagudem', 'Ramagundam', 'Bhongir', 'Siddipet', 'Bodhan', 'Jangaon', 'Gadwal', 'Wanaparthy', 'Sircilla'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Malappuram', 'Kannur', 'Kasaragod', 'Kottayam', 'Idukki', 'Ernakulam', 'Pathanamthitta', 'Wayanad'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Firozpur', 'Hoshiarpur', 'Batala', 'Pathankot', 'Moga', 'Abohar', 'Malerkotla', 'Khanna', 'Phagwara', 'Muktsar', 'Barnala', 'Rajpura', 'Hoshiarpur', 'Kapurthala', 'Faridkot', 'Sunam'],
  'Haryana': ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind', 'Thanesar', 'Kaithal', 'Rewari', 'Narnaul', 'Pundri', 'Kosli', 'Palwal'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Danapur', 'Saharsa', 'Hajipur', 'Sasaram', 'Dehri', 'Siwan', 'Motihari', 'Nawada', 'Bagaha', 'Buxar', 'Kishanganj', 'Sitamarhi', 'Jamalpur', 'Jehanabad', 'Aurangabad'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda', 'Jeypore', 'Barbil', 'Khordha', 'Rayagada', 'Bhawanipatna', 'Dhenkanal', 'Kendujhar', 'Sunabeda', 'Kendrapara', 'Paradip', 'Jatani', 'Byasanagar', 'Jajpur', 'Rajgangpur', 'Parlakhemundi', 'Talcher', 'Sundargarh', 'Phulbani', 'Malkangiri', 'Koraput'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Dhubri', 'North Lakhimpur', 'Karimganj', 'Sibsagar', 'Goalpara', 'Barpeta', 'Mangaldoi', 'Nalbari', 'Rangia', 'Margherita', 'Titabar', 'Puranigudam', 'Mariani', 'Marigaon'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City', 'Deoghar', 'Phusro', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar', 'Chirkunda', 'Pakaur', 'Chaibasa', 'Dumka', 'Sahibganj', 'Gumla', 'Madhupur', 'Chatra', 'Godda', 'Simdega', 'Koderma', 'Khunti'],
  'Himachal Pradesh': ['Shimla', 'Solan', 'Dharamshala', 'Mandi', 'Palampur', 'Baddi', 'Nahan', 'Paonta Sahib', 'Sundarnagar', 'Chamba', 'Una', 'Kullu', 'Hamirpur', 'Bilaspur', 'Yol', 'Jubbal', 'Chail', 'Kasauli', 'Dalhousie', 'Manali', 'Keylong', 'Reckong Peo'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani-cum-Kathgodam', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Pithoragarh', 'Jaspur', 'Manglaur', 'Laksar', 'Tanakpur', 'Clement Town', 'Kichha', 'Sitarganj', 'Srinagar', 'Pauri', 'Kotdwar', 'Nagla', 'Doiwala'],
  'Chhattisgarh': ['Raipur', 'Bhilai Nagar', 'Korba', 'Bilaspur', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Raigarh', 'Ambikapur', 'Mahasamund', 'Dhamtari', 'Chirmiri', 'Bhatapara', 'Dalli-Rajhara', 'Naila Janjgir', 'Tilda Newra', 'Mungeli', 'Manendragarh', 'Sakti'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem', 'Sanquelim', 'Cuncolim', 'Quepem', 'Cansaulim', 'Aldona', 'Cortalim', 'Canacona', 'Sanguem', 'Pernem', 'Sattari', 'Dharbandora'],
  'Tripura': ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailasahar', 'Belonia', 'Khowai', 'Pratapgarh', 'Ranirbazar', 'Sonamura', 'Amarpur', 'Jirania', 'Kamalpur', 'Sabroom', 'Kumarghat', 'Bilonia', 'Kanchanpur', 'Panisagar', 'Santirbazar'],
  'Manipur': ['Imphal', 'Thoubal', 'Lilong', 'Mayang Imphal', 'Kakching', 'Nambol', 'Moirang', 'Bishnupur', 'Churachandpur', 'Senapati', 'Ukhrul', 'Tamenglong', 'Jiribam', 'Kangpokpi', 'Tengnoupal', 'Kamjong', 'Noney', 'Pherzawl'],
  'Meghalaya': ['Shillong', 'Tura', 'Nongstoin', 'Jowai', 'Baghmara', 'Williamnagar', 'Resubelpara', 'Mawkyrwat', 'Ampati', 'Mairang', 'Nongpoh', 'Khliehriat', 'Amlarem', 'Mawsynram', 'Cherrapunji', 'Dawki', 'Bholaganj', 'Tikrikilla'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Phek', 'Kiphire', 'Longleng', 'Peren', 'Mon', 'Chumukedima', 'Pfutsero', 'Jalukie', 'Tuli', 'Aboi', 'Akuluto', 'Angetyongpang'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib', 'Serchhip', 'Mamit', 'Lawngtlai', 'Saitual', 'Khawzawl', 'Hnahthial', 'Bairabi', 'Bilkhawthlir', 'Biate', 'Bungtlang', 'Chawngte', 'Darlawn', 'Demagiri'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Namsai', 'Bomdila', 'Ziro', 'Along', 'Tezu', 'Seppa', 'Khonsa', 'Tawang', 'Roing', 'Basar', 'Daporijo', 'Yingkiong', 'Anini', 'Hawai', 'Mechuka'],
  'Sikkim': ['Gangtok', 'Namchi', 'Geyzing', 'Mangan', 'Jorethang', 'Nayabazar', 'Rangpo', 'Singtam', 'Pakyong', 'Ravangla', 'Yuksom', 'Pelling', 'Lachung', 'Lachen', 'Chungthang', 'Melli', 'Kalimpong', 'Rhenock'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi', 'North East Delhi', 'North West Delhi', 'South East Delhi', 'South West Delhi', 'Shahdara']
};

export const EXAMS = [
  // Engineering Entrance Exams
  'JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'SRMJEEE', 'COMEDK UGET',
  'MHT CET', 'KCET', 'WBJEE', 'TS EAMCET', 'AP EAMCET', 'KEAM', 'OJEE', 'GUJCET',
  'TNEA', 'UPSEE', 'REAP', 'GCET', 'BCECE', 'JCECE', 'CGPET', 'HITSEEE',
  
  // Medical Entrance Exams
  'NEET UG', 'NEET PG', 'AIIMS', 'JIPMER', 'NEET MDS', 'INI CET', 'FMGE',
  
  // Management Entrance Exams
  'CAT', 'XAT', 'MAT', 'CMAT', 'SNAP', 'NMAT', 'IIFT', 'TISSNET',
  'ATMA', 'MAHCET', 'KMAT', 'TANCET', 'ICET', 'MAH MBA CET', 'IRMA',
  
  // Law Entrance Exams
  'CLAT', 'AILET', 'LSAT India', 'DU LLB', 'BHU UET', 'SLAT', 'MH CET Law',
  'TS LAWCET', 'AP LAWCET', 'KLEE', 'BLAT', 'ULSAT', 'SLAT', 'LSAT',
  
  // Other Competitive Exams
  'GATE', 'JAM', 'NET', 'SET', 'CSIR NET', 'GPAT', 'CEED', 'UCEED',
  'NIFT', 'NID', 'AIEED', 'SEED', 'PEARL CET', 'NATA', 'JEE B.Arch',
  
  // Government Job Exams
  'UPSC Civil Services', 'SSC CGL', 'SSC CHSL', 'SSC MTS', 'SSC GD',
  'IBPS PO', 'IBPS Clerk', 'SBI PO', 'SBI Clerk', 'RBI Grade B',
  'Railway NTPC', 'Railway Group D', 'Railway ALP', 'Railway JE',
  'AFCAT', 'NDA', 'CDS', 'CAPF', 'BSF', 'CRPF', 'CISF',
  
  // State Level Exams
  'MPSC', 'KPSC', 'TNPSC', 'APPSC', 'TSPSC', 'WBPSC', 'BPSC',
  'UPPSC', 'RPSC', 'HPSC', 'JPSC', 'OPSC', 'GPSC', 'HPPSC'
];

export const CLASSES = [
  // School Classes
  '10th', '11th', '12th',
  
  // Undergraduate Courses
  'B.Tech', 'B.E', 'B.Sc', 'B.Com', 'B.A', 'BBA', 'BCA', 'B.Pharma',
  'MBBS', 'BDS', 'BHMS', 'BAMS', 'B.Ed', 'B.Arch', 'B.Des', 'BFA',
  'B.Voc', 'B.P.Ed', 'B.Lib', 'LLB', 'B.Optom', 'B.Physio', 'B.Sc Nursing',
  'B.Tech CSE', 'B.Tech ECE', 'B.Tech Mechanical', 'B.Tech Civil', 'B.Tech EEE',
  
  // Postgraduate Courses
  'M.Tech', 'M.E', 'M.Sc', 'M.Com', 'M.A', 'MBA', 'MCA', 'M.Pharma',
  'MD', 'MS', 'MDS', 'M.Ed', 'M.Arch', 'M.Des', 'MFA', 'LLM',
  'M.Optom', 'M.Physio', 'MSW', 'M.Lib', 'M.Sc Nursing', 'MPH',
  
  // Diploma Courses
  'Diploma Engineering', 'Diploma Pharmacy', 'Diploma Nursing',
  'Diploma Computer Science', 'Diploma Mechanical', 'Diploma Civil',
  'Diploma Electrical', 'Diploma Electronics', 'Diploma Automobile',
  
  // Doctoral Programs
  'Ph.D', 'D.Sc', 'D.Litt', 'D.M', 'M.Ch', 'Ph.D CSE', 'Ph.D Management',
  
  // Professional Courses
  'CA', 'CS', 'CMA', 'ACCA', 'CFA', 'FRM', 'CPA', 'CISA',
  
  // Other Courses
  'ITI', 'Polytechnic', 'Certificate Course', 'Other'
];

export const STREAMS = ['Science', 'Commerce', 'Arts', 'Vocational'];

export const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Other'];

export const YEARS = Array.from({ length: 14 }, (_, i) => 2012 + i);

export const ADMISSION_STATUSES = [
  'new', 'contacted', 'interested', 'not_interested', 'enrolled', 'rejected'
];

export const FOLLOW_UP_STATUSES = [
  'pending', 'completed', 'scheduled'
];

export const CALL_STATUSES = [
  'answered', 'not_answered', 'busy', 'switched_off', 'invalid'
];

export const CALL_OUTCOMES = [
  'contacted', 'left_message', 'no_answer', 'callback_requested'
];

export const BOARDS = [
  'CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE', 'NIOS', 'Other'
];