import { 
  Employee, 
  TrainingCourse, 
  TrainingRecord, 
  DocumentItem, 
  AuditLog, 
  CourseCategory, 
  PositionLevel,
  EmployeeStatus,
  AttendanceStatus,
  DocumentCategory
} from '../types';

export const POSITION_LEVEL_LABELS: Record<PositionLevel, { labelTh: string; labelEn: string }> = {
  general: { labelTh: 'ปฏิบัติงาน', labelEn: 'Operational Level (General)' },
  operational: { labelTh: 'ปฏิบัติการ', labelEn: 'Practitioner Level' },
  experienced: { labelTh: 'ชำนาญการ / ชำนาญงาน', labelEn: 'Professional Level' },
  senior: { labelTh: 'ชำนาญการพิเศษ', labelEn: 'Senior Professional Level' },
  expert: { labelTh: 'เชี่ยวชาญ', labelEn: 'Expert Level' },
  executive: { labelTh: 'อำนวยการ / บริหาร', labelEn: 'Executive Level' }
};

export const EMPLOYEE_STATUS_LABELS: Record<EmployeeStatus, { labelTh: string; color: string; bg: string }> = {
  active: { labelTh: 'ปฏิบัติราชการ', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  probation: { labelTh: 'ทดลองปฏิบัติราชการ', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  leave: { labelTh: 'ลาศึกษาต่อ/ดูงาน', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200' },
  transferred: { labelTh: 'โอนย้ายสังกัด', color: 'text-slate-600', bg: 'bg-slate-100 border-slate-200' },
  retired: { labelTh: 'เกษียณอายุราชการ', color: 'text-neutral-500', bg: 'bg-neutral-100 border-neutral-200' }
};

export const COURSE_CATEGORY_LABELS: Record<CourseCategory, { labelTh: string; labelEn: string; color: string }> = {
  knowledge_skill: { 
    labelTh: 'การพัฒนาความรู้และทักษะเฉพาะด้าน', 
    labelEn: 'Professional Knowledge & Skills',
    color: 'text-blue-700 bg-blue-50 border-blue-200'
  },
  public_management: { 
    labelTh: 'การบริหารจัดการภาครัฐยุคใหม่', 
    labelEn: 'Modern Public Management',
    color: 'text-indigo-700 bg-indigo-50 border-indigo-200'
  },
  law_regulation: { 
    labelTh: 'กฎหมาย ระเบียบ และจริยธรรม', 
    labelEn: 'Law, Regulations & Ethics',
    color: 'text-amber-800 bg-amber-50 border-amber-200'
  },
  digital_tech: { 
    labelTh: 'เทคโนโลยีสารสนเทศและดิจิทัล', 
    labelEn: 'Digital & Information Technology',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
  },
  leadership: { 
    labelTh: 'การพัฒนาภาวะผู้นำและการบริหาร', 
    labelEn: 'Leadership Development',
    color: 'text-purple-700 bg-purple-50 border-purple-200'
  },
  other: { 
    labelTh: 'หลักสูตรทั่วไปและอื่น ๆ', 
    labelEn: 'General & Others',
    color: 'text-slate-700 bg-slate-50 border-slate-200'
  }
};

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, { labelTh: string; color: string; bg: string }> = {
  registered: { labelTh: 'ลงทะเบียนแล้ว', color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' },
  attending: { labelTh: 'กำลังเข้าร่วม', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200' },
  passed: { labelTh: 'ผ่านการอบรม', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  failed: { labelTh: 'ไม่ผ่านการอบรม', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
  cancelled: { labelTh: 'ยกเลิก', color: 'text-neutral-500', bg: 'bg-neutral-100 border-neutral-200' }
};

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, { labelTh: string; labelEn: string }> = {
  certificate: { labelTh: 'ใบประกาศนียบัตร / วุฒิบัตร', labelEn: 'Certificates' },
  course_material: { labelTh: 'เอกสารประกอบการบรรยาย', labelEn: 'Training Materials' },
  project_doc: { labelTh: 'เอกสารโครงการและงบประมาณ', labelEn: 'Project Documents' },
  general: { labelTh: 'ระเบียบและเอกสารทั่วไป', labelEn: 'General Guidelines' }
};

// 1. Initial Demo Employees
export const INITIAL_DEMO_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    empCode: 'SK-HR-001',
    prefix: 'นาย',
    firstName: 'สมเกียรติ',
    lastName: 'พัฒนศิริ',
    position: 'นักทรัพยากรบุคคลชำนาญการพิเศษ',
    department: 'กลุ่มงานบริหารทรัพยากรบุคคล',
    positionLevel: 'senior',
    startDate: '2016-05-16',
    status: 'active',
    email: 'somkiat.p@songkhla.demo.th',
    phone: '074-312-001',
    notes: 'หัวหน้าคณะทำงานขับเคลื่อนแผนพัฒนาบุคลากรจังหวัดสงขลา',
    createdAt: '2026-01-10T08:30:00Z',
    updatedAt: '2026-10-15T10:00:00Z'
  },
  {
    id: 'emp-002',
    empCode: 'SK-HR-002',
    prefix: 'นางสาว',
    firstName: 'กานดา',
    lastName: 'สงขลารักษ์',
    position: 'นักทรัพยากรบุคคลชำนาญการ',
    department: 'กลุ่มงานบริหารทรัพยากรบุคคล',
    positionLevel: 'experienced',
    startDate: '2020-02-01',
    status: 'active',
    email: 'kanda.s@songkhla.demo.th',
    phone: '074-312-002',
    notes: 'ผู้ประสานงานหลักสูตรพัฒนาทักษะดิจิทัลและการประเมินสมรรถนะ',
    createdAt: '2026-01-10T08:30:00Z',
    updatedAt: '2026-10-12T09:15:00Z'
  },
  {
    id: 'emp-003',
    empCode: 'SK-HR-003',
    prefix: 'นาย',
    firstName: 'ธนากร',
    lastName: 'สิริวิศาล',
    position: 'นักวิเคราะห์นโยบายและแผนปฏิบัติการ',
    department: 'กลุ่มงานยุทธศาสตร์และข้อมูลเพื่อการพัฒนาจังหวัด',
    positionLevel: 'operational',
    startDate: '2023-11-01',
    status: 'active',
    email: 'thanakorn.s@songkhla.demo.th',
    phone: '074-312-003',
    notes: 'ผู้จัดทำข้อมูลสถิติแผนพัฒนากลุ่มจังหวัดภาคใต้ฝั่งอ่าวไทย',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-10-01T14:20:00Z'
  },
  {
    id: 'emp-004',
    empCode: 'SK-HR-004',
    prefix: 'นาง',
    firstName: 'พิมพา',
    lastName: 'แก้วมณี',
    position: 'นิติกรชำนาญการ',
    department: 'กลุ่มงานประสานราชการและกฎหมาย',
    positionLevel: 'experienced',
    startDate: '2018-08-01',
    status: 'active',
    email: 'pimpa.k@songkhla.demo.th',
    phone: '074-312-004',
    notes: 'วิทยากรด้านวินัยข้าราชการและระเบียบการจัดซื้อจัดจ้าง',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-09-20T11:00:00Z'
  },
  {
    id: 'emp-005',
    empCode: 'SK-HR-005',
    prefix: 'นาย',
    firstName: 'วรภัทร',
    lastName: 'จินดาวัลย์',
    position: 'นักวิชาการคอมพิวเตอร์ปฏิบัติการ',
    department: 'กลุ่มงานเทคโนโลยีสารสนเทศและการสื่อสาร',
    positionLevel: 'operational',
    startDate: '2024-03-01',
    status: 'active',
    email: 'woraphat.j@songkhla.demo.th',
    phone: '074-312-005',
    notes: 'ดูแลระบบเครือข่ายและระบบความมั่นคงปลอดภัยสารสนเทศศาลากลาง',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-10-18T16:00:00Z'
  },
  {
    id: 'emp-006',
    empCode: 'SK-HR-006',
    prefix: 'นางสาว',
    firstName: 'อรวรรณ',
    lastName: 'สมิหลาภิรมย์',
    position: 'เจ้าพนักงานธุรการชำนาญงาน',
    department: 'กลุ่มงานอำนวยการ',
    positionLevel: 'experienced',
    startDate: '2017-06-15',
    status: 'active',
    email: 'orawan.s@songkhla.demo.th',
    phone: '074-312-006',
    notes: 'บริหารงานสารบรรณกลางและการออกหนังสือราชการ',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-08-10T10:30:00Z'
  },
  {
    id: 'emp-007',
    empCode: 'SK-HR-007',
    prefix: 'นาย',
    firstName: 'ณัฐพงศ์',
    lastName: 'เกาะยอเจริญ',
    position: 'เจ้าหน้าที่รับเรื่องร้องเรียน (บริการประชาชน)',
    department: 'กลุ่มงานศูนย์ดำรงธรรมจังหวัดสงขลา',
    positionLevel: 'general',
    startDate: '2025-07-01',
    status: 'probation',
    email: 'nattapong.k@songkhla.demo.th',
    phone: '074-312-007',
    notes: 'บรรจุใหม่ อยู่ระหว่างการประเมินผลการทดลองปฏิบัติราชการ 6 เดือน',
    createdAt: '2026-03-01T09:30:00Z',
    updatedAt: '2026-09-01T08:45:00Z'
  },
  {
    id: 'emp-008',
    empCode: 'SK-HR-008',
    prefix: 'นางสาว',
    firstName: 'ศศิวิมล',
    lastName: 'สุขเกษม',
    position: 'นักวิชาการการเงินและบัญชีปฏิบัติการ',
    department: 'กลุ่มงานการเงินและบัญชี',
    positionLevel: 'operational',
    startDate: '2022-10-01',
    status: 'leave',
    email: 'sasiwimon.s@songkhla.demo.th',
    phone: '074-312-008',
    notes: 'ได้รับอนุมัติลาเพิ่มพูนความรู้หลักสูตรบริหารการคลังภาครัฐระดับสูง',
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-10-05T13:20:00Z'
  }
];

// 2. Initial Demo Training Courses
export const INITIAL_DEMO_COURSES: TrainingCourse[] = [
  {
    id: 'crs-001',
    courseCode: 'TR-2569-01',
    title: 'การยกระดับทักษะดิจิทัลและการประยุกต์ใช้ AI ในงานสารบรรณภาครัฐ',
    category: 'digital_tech',
    organizer: 'สำนักงาน ก.พ. ร่วมกับ สถาบันดิจิทัลสงขลา (จำลอง)',
    location: 'ห้องประชุม 1 ชั้น 5 ศาลากลางจังหวัดสงขลา (และออนไลน์ Zoom)',
    startDate: '2026-02-18',
    endDate: '2026-02-20',
    hours: 18,
    maxAttendees: 40,
    objective: 'เสริมสร้างสมรรถนะบุคลากรในการนำเครื่องมือดิจิทัลและ AI มาช่วยวิเคราะห์และร่างหนังสือราชการอย่างถูกต้อง',
    details: 'เนื้อหาครอบคลุมการจัดการเอกสารอิเล็กทรอนิกส์ ความปลอดภัยไซเบอร์เบื้องต้น และจริยธรรมการใช้ AI ภาครัฐ',
    status: 'completed',
    fiscalYear: 2569,
    createdAt: '2026-01-12T08:00:00Z',
    updatedAt: '2026-02-22T17:00:00Z'
  },
  {
    id: 'crs-002',
    courseCode: 'TR-2569-02',
    title: 'พระราชบัญญัติการปฏิบัติราชการทางอิเล็กทรอนิกส์และระเบียบวินัยข้าราชการ',
    category: 'law_regulation',
    organizer: 'สำนักงาน ก.พ.ร. ร่วมกับ สำนักงานจังหวัดสงขลา',
    location: 'หอประชุมศาลากลางจังหวัดสงขลา',
    startDate: '2026-04-08',
    endDate: '2026-04-09',
    hours: 12,
    maxAttendees: 60,
    objective: 'สร้างความเข้าใจกฎหมายวิธีปฏิบัติราชการทางอิเล็กทรอนิกส์ พ.ศ. 2565 และการคุ้มครองข้อมูลส่วนบุคคล (PDPA)',
    details: 'เน้นกรณีศึกษาข้อพิพาททางปกครองและแนวปฏิบัติสำหรับเจ้าหน้าที่ศาลากลางและที่ว่าการอำเภอ',
    status: 'completed',
    fiscalYear: 2569,
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-04-10T16:30:00Z'
  },
  {
    id: 'crs-003',
    courseCode: 'TR-2569-03',
    title: 'การพัฒนาภาวะผู้นำและการบริหารการเปลี่ยนแปลงในระบบราชการ 4.0',
    category: 'leadership',
    organizer: 'สถาบันดำรงราชานุภาพ กระทรวงมหาดไทย (แบบจำลอง)',
    location: 'โรงแรม บีพี สมิหลา บีช แอนด์ รีสอร์ท สงขลา',
    startDate: '2026-07-15',
    endDate: '2026-07-18',
    hours: 24,
    maxAttendees: 30,
    objective: 'เสริมสร้างทักษะผู้นำยุคใหม่ การสร้างแรงบันดาลใจ และการบริหารทีมข้ามสายงานในภาวะวิกฤต',
    details: 'การจำลองสถานการณ์การบริหารจัดการอุทกภัยและการบูรณาการข้อมูลร่วมกับองค์กรปกครองส่วนท้องถิ่น',
    status: 'completed',
    fiscalYear: 2569,
    createdAt: '2026-06-01T08:30:00Z',
    updatedAt: '2026-07-20T12:00:00Z'
  },
  {
    id: 'crs-004',
    courseCode: 'TR-2569-04',
    title: 'เทคนิคการไกล่เกลี่ยข้อพิพาทและบริการประชาชนเชิงรุกสำหรับศูนย์ดำรงธรรม',
    category: 'knowledge_skill',
    organizer: 'กรมการปกครอง ร่วมกับ ศาลากลางจังหวัดสงขลา',
    location: 'ห้องประชุมไทยบุรี มหาวิทยาลัยวลัยลักษณ์ (ศูนย์ประสานงานสงขลา)',
    startDate: '2026-09-02',
    endDate: '2026-09-04',
    hours: 18,
    maxAttendees: 35,
    objective: 'พัฒนาทักษะการสื่อสารเชิงบวก การรับฟังอย่างเข้าอกเข้าใจ และกระบวนการระงับข้อขัดแย้งในชุมชน',
    details: 'ฝึกปฏิบัติ Role-play ข้อพิพาทเรื่องที่ดินทำกิน สิ่งแวดล้อม และข้อร้องเรียนด้านสาธารณูปโภค',
    status: 'completed',
    fiscalYear: 2569,
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-09-06T15:00:00Z'
  },
  {
    id: 'crs-005',
    courseCode: 'TR-2569-05',
    title: 'การเขียนข้อเสนอโครงการและการบริหารงบประมาณเชิงยุทธศาสตร์จังหวัด',
    category: 'public_management',
    organizer: 'สำนักงบประมาณ ร่วมกับ สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ',
    location: 'ห้องประชุมสารภี 1 ศาลากลางจังหวัดสงขลา',
    startDate: '2026-11-12',
    endDate: '2026-11-14',
    hours: 18,
    maxAttendees: 45,
    objective: 'เตรียมความพร้อมบุคลากรในการจัดทำคำของบประมาณรายจ่ายประจำปี 2570 และการประเมินความคุ้มค่าโครงการ',
    details: 'แนวทางการจัดทำตัวชี้วัดผลสัมฤทธิ์ (KPI) และการติดตามผลการดำเนินงานตามแผนพัฒนาจังหวัด 5 ปี',
    status: 'upcoming',
    fiscalYear: 2569,
    createdAt: '2026-10-01T09:00:00Z',
    updatedAt: '2026-10-15T11:00:00Z'
  },
  {
    id: 'crs-006',
    courseCode: 'TR-2569-06',
    title: 'การบริหารจัดการความเสี่ยงและการรักษาความมั่นคงปลอดภัยสารสนเทศภาครัฐ',
    category: 'digital_tech',
    organizer: 'สำนักงานคณะกรรมการการรักษาความมั่นคงปลอดภัยไซเบอร์แห่งชาติ (สกมช.)',
    location: 'ระบบออนไลน์ E-Learning และสัมมนาผ่านเครือข่าย',
    startDate: '2026-12-01',
    endDate: '2026-12-05',
    hours: 30,
    maxAttendees: 50,
    objective: 'พัฒนาทักษะการตรวจสอบช่องโหว่ความปลอดภัย การตอบสนองต่อภัยคุกคามไซเบอร์ และการกู้คืนระบบ',
    details: 'หลักสูตรภาคปฏิบัติพร้อมการทดสอบประเมินผลมาตรฐานสมรรถนะดิจิทัลข้าราชการพลเรือน',
    status: 'upcoming',
    fiscalYear: 2569,
    createdAt: '2026-10-10T14:00:00Z',
    updatedAt: '2026-10-18T10:00:00Z'
  }
];

// 3. Initial Demo Training Records (Relationships between Employees & Courses)
export const INITIAL_DEMO_RECORDS: TrainingRecord[] = [
  {
    id: 'tr-001',
    employeeId: 'emp-001',
    courseId: 'crs-003',
    registrationDate: '2026-06-10',
    attendanceDate: '2026-07-15',
    status: 'passed',
    score: 95,
    evaluationGrade: 'excellent',
    evaluationNote: 'มีส่วนร่วมในการอภิปรายและนำเสนอแบบจำลองการบริหารจัดการภาวะวิกฤตได้อย่างยอดเยี่ยม',
    certificateNumber: 'SK-HRD-2569-001',
    certificateUrl: '/certs/cert-001.pdf',
    hoursCompleted: 24,
    createdAt: '2026-06-10T08:00:00Z',
    updatedAt: '2026-07-20T12:00:00Z'
  },
  {
    id: 'tr-002',
    employeeId: 'emp-001',
    courseId: 'crs-001',
    registrationDate: '2026-01-20',
    attendanceDate: '2026-02-18',
    status: 'passed',
    score: 92,
    evaluationGrade: 'excellent',
    evaluationNote: 'ผ่านเกณฑ์ทดสอบการประยุกต์ใช้เครื่องมือดิจิทัลในงานเอกสาร',
    certificateNumber: 'SK-HRD-2569-002',
    certificateUrl: '/certs/cert-002.pdf',
    hoursCompleted: 18,
    createdAt: '2026-01-20T09:00:00Z',
    updatedAt: '2026-02-22T17:00:00Z'
  },
  {
    id: 'tr-003',
    employeeId: 'emp-002',
    courseId: 'crs-001',
    registrationDate: '2026-01-22',
    attendanceDate: '2026-02-18',
    status: 'passed',
    score: 88,
    evaluationGrade: 'good',
    evaluationNote: 'สามารถนำความรู้ไปประยุกต์ใช้กับงานทะเบียนประวัติบุคลากรได้เป็นอย่างดี',
    certificateNumber: 'SK-HRD-2569-003',
    certificateUrl: '/certs/cert-003.pdf',
    hoursCompleted: 18,
    createdAt: '2026-01-22T10:00:00Z',
    updatedAt: '2026-02-22T17:00:00Z'
  },
  {
    id: 'tr-004',
    employeeId: 'emp-002',
    courseId: 'crs-002',
    registrationDate: '2026-03-10',
    attendanceDate: '2026-04-08',
    status: 'passed',
    score: 86,
    evaluationGrade: 'good',
    evaluationNote: 'เข้าใจหลักเกณฑ์และข้อปฏิบัติตาม พ.ร.บ. ปฏิบัติราชการทางอิเล็กทรอนิกส์',
    certificateNumber: 'SK-HRD-2569-004',
    certificateUrl: '/certs/cert-004.pdf',
    hoursCompleted: 12,
    createdAt: '2026-03-10T11:00:00Z',
    updatedAt: '2026-04-10T16:30:00Z'
  },
  {
    id: 'tr-005',
    employeeId: 'emp-003',
    courseId: 'crs-001',
    registrationDate: '2026-01-25',
    attendanceDate: '2026-02-18',
    status: 'passed',
    score: 90,
    evaluationGrade: 'excellent',
    evaluationNote: 'ใช้เทคโนโลยีช่วยการสืบค้นข้อมูลยุทธศาสตร์ได้รวดเร็วขึ้น',
    certificateNumber: 'SK-HRD-2569-005',
    certificateUrl: '/certs/cert-005.pdf',
    hoursCompleted: 18,
    createdAt: '2026-01-25T08:30:00Z',
    updatedAt: '2026-02-22T17:00:00Z'
  },
  {
    id: 'tr-006',
    employeeId: 'emp-003',
    courseId: 'crs-005',
    registrationDate: '2026-10-05',
    attendanceDate: '2026-11-12',
    status: 'registered',
    hoursCompleted: 0,
    createdAt: '2026-10-05T09:00:00Z',
    updatedAt: '2026-10-05T09:00:00Z'
  },
  {
    id: 'tr-007',
    employeeId: 'emp-004',
    courseId: 'crs-002',
    registrationDate: '2026-03-05',
    attendanceDate: '2026-04-08',
    status: 'passed',
    score: 98,
    evaluationGrade: 'excellent',
    evaluationNote: 'ร่วมเป็นวิทยากรกลุ่มย่อยและให้ข้อเสนอแนะทางกฎหมายแก่ผู้เข้าอบรม',
    certificateNumber: 'SK-HRD-2569-006',
    certificateUrl: '/certs/cert-006.pdf',
    hoursCompleted: 12,
    createdAt: '2026-03-05T08:00:00Z',
    updatedAt: '2026-04-10T16:30:00Z'
  },
  {
    id: 'tr-008',
    employeeId: 'emp-005',
    courseId: 'crs-001',
    registrationDate: '2026-02-05',
    attendanceDate: '2026-02-18',
    status: 'passed',
    score: 94,
    evaluationGrade: 'excellent',
    evaluationNote: 'ช่วยสนับสนุนด้านเทคนิคและระบบเครือข่ายระหว่างการฝึกอบรม',
    certificateNumber: 'SK-HRD-2569-007',
    certificateUrl: '/certs/cert-007.pdf',
    hoursCompleted: 18,
    createdAt: '2026-02-05T09:00:00Z',
    updatedAt: '2026-02-22T17:00:00Z'
  },
  {
    id: 'tr-009',
    employeeId: 'emp-005',
    courseId: 'crs-006',
    registrationDate: '2026-10-12',
    attendanceDate: '2026-12-01',
    status: 'registered',
    hoursCompleted: 0,
    createdAt: '2026-10-12T14:30:00Z',
    updatedAt: '2026-10-12T14:30:00Z'
  },
  {
    id: 'tr-010',
    employeeId: 'emp-006',
    courseId: 'crs-001',
    registrationDate: '2026-01-20',
    attendanceDate: '2026-02-18',
    status: 'passed',
    score: 85,
    evaluationGrade: 'good',
    evaluationNote: 'ฝึกพิมพ์และบันทึกสารบรรณอิเล็กทรอนิกส์ได้ตามเกณฑ์มาตรฐาน',
    certificateNumber: 'SK-HRD-2569-008',
    certificateUrl: '/certs/cert-008.pdf',
    hoursCompleted: 18,
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-02-22T17:00:00Z'
  },
  {
    id: 'tr-011',
    employeeId: 'emp-007',
    courseId: 'crs-004',
    registrationDate: '2026-08-10',
    attendanceDate: '2026-09-02',
    status: 'passed',
    score: 84,
    evaluationGrade: 'good',
    evaluationNote: 'เรียนรู้ทักษะการรับเรื่องร้องทุกข์จากประชาชนด้วยความสุภาพ',
    certificateNumber: 'SK-HRD-2569-009',
    certificateUrl: '/certs/cert-009.pdf',
    hoursCompleted: 18,
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-09-06T15:00:00Z'
  },
  {
    id: 'tr-012',
    employeeId: 'emp-007',
    courseId: 'crs-002',
    registrationDate: '2026-03-15',
    attendanceDate: '2026-04-08',
    status: 'passed',
    score: 80,
    evaluationGrade: 'fair',
    evaluationNote: 'ผ่านการทดสอบความรู้พื้นฐานกฎหมายและระเบียบราชการ',
    certificateNumber: 'SK-HRD-2569-010',
    certificateUrl: '/certs/cert-010.pdf',
    hoursCompleted: 12,
    createdAt: '2026-03-15T09:00:00Z',
    updatedAt: '2026-04-10T16:30:00Z'
  }
];

// 4. Initial Demo Documents
export const INITIAL_DEMO_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-001',
    title: 'คู่มือการพัฒนาสมรรถนะบุคลากรภาครัฐจังหวัดสงขลา ปี 2569 (จำลอง)',
    category: 'general',
    fileType: 'pdf',
    fileSize: '3.4 MB',
    uploadDate: '2026-01-10',
    uploadedBy: 'นายสมเกียรติ พัฒนศิริ',
    notes: 'แผนแม่บทและเกณฑ์ตัวชี้วัดการฝึกอบรมไม่น้อยกว่า 30 ชั่วโมง/คน/ปี',
    downloadUrl: '#'
  },
  {
    id: 'doc-002',
    title: 'สไลด์บรรยาย: AI และการยกระดับงานบริการสารบรรณภาครัฐ',
    category: 'course_material',
    fileType: 'pdf',
    fileSize: '8.2 MB',
    courseId: 'crs-001',
    uploadDate: '2026-02-18',
    uploadedBy: 'นางสาวกานดา สงขลารักษ์',
    notes: 'เอกสารประกอบหลักสูตร TR-2569-01',
    downloadUrl: '#'
  },
  {
    id: 'doc-003',
    title: 'วุฒิบัตรรับรองการผ่านหลักสูตรภาวะผู้นำ (ตัวอย่างจำลอง)',
    category: 'certificate',
    fileType: 'pdf',
    fileSize: '1.1 MB',
    courseId: 'crs-003',
    employeeId: 'emp-001',
    uploadDate: '2026-07-20',
    uploadedBy: 'ฝ่ายทรัพยากรบุคคล',
    notes: 'ใบประกาศนียบัตรของนายสมเกียรติ พัฒนศิริ รหัส SK-HRD-2569-001',
    downloadUrl: '#'
  },
  {
    id: 'doc-004',
    title: 'เอกสารข้อเสนอโครงการอบรมเทคนิคการไกล่เกลี่ยศูนย์ดำรงธรรม',
    category: 'project_doc',
    fileType: 'docx',
    fileSize: '1.8 MB',
    courseId: 'crs-004',
    uploadDate: '2026-08-05',
    uploadedBy: 'ฝ่ายทรัพยากรบุคคล',
    notes: 'เอกสารอนุมัติงบประมาณและกำหนดการฝึกอบรม',
    downloadUrl: '#'
  },
  {
    id: 'doc-005',
    title: 'แนวปฏิบัติการคุ้มครองข้อมูลส่วนบุคคล (PDPA) ศาลากลางสงขลา',
    category: 'course_material',
    fileType: 'pdf',
    fileSize: '4.6 MB',
    courseId: 'crs-002',
    uploadDate: '2026-04-05',
    uploadedBy: 'นางพิมพา แก้วมณี',
    notes: 'คู่มือและแบบฟอร์มขอความยินยอมสำหรับหน่วยงานราชการ',
    downloadUrl: '#'
  },
  {
    id: 'doc-006',
    title: 'ภาพบรรยากาศการฝึกอบรมปฏิบัติการดิจิทัล รุ่นที่ 1',
    category: 'general',
    fileType: 'jpg',
    fileSize: '5.2 MB',
    courseId: 'crs-001',
    uploadDate: '2026-02-20',
    uploadedBy: 'ฝ่ายสารสนเทศ',
    notes: 'ภาพถ่ายกิจกรรมห้องประชุม 1 ศาลากลางจังหวัดสงขลา',
    downloadUrl: '#'
  }
];

// 5. Initial Demo Audit Logs
export const INITIAL_DEMO_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-10-18T14:30:00Z',
    userName: 'นายสมเกียรติ พัฒนศิริ (ผู้ดูแลระบบ)',
    userRole: 'admin',
    action: 'update',
    targetType: 'course',
    targetId: 'crs-005',
    details: 'ปรับปรุงกำหนดวันเริ่มอบรมหลักสูตรการเขียนข้อเสนอโครงการ เป็น 12 พ.ย. 2569'
  },
  {
    id: 'log-002',
    timestamp: '2026-10-15T11:20:00Z',
    userName: 'นางสาวกานดา สงขลารักษ์ (เจ้าหน้าที่)',
    userRole: 'officer',
    action: 'create',
    targetType: 'attendance',
    targetId: 'tr-009',
    details: 'ลงทะเบียน นายวรภัทร จินดาวัลย์ เข้าร่วมหลักสูตรความมั่นคงปลอดภัยไซเบอร์ (TR-2569-06)'
  },
  {
    id: 'log-003',
    timestamp: '2026-10-12T09:45:00Z',
    userName: 'นายสมเกียรติ พัฒนศิริ (ผู้ดูแลระบบ)',
    userRole: 'admin',
    action: 'create',
    targetType: 'employee',
    targetId: 'emp-008',
    details: 'เพิ่มข้อมูลบุคลากรใหม่: นางสาวศศิวิมล สุขเกษม ตำแหน่ง นักวิชาการการเงินและบัญชีปฏิบัติการ'
  }
];

// LocalStorage Keys
const STORAGE_PREFIX = 'songkhla_hrd_';
const KEYS = {
  MODE: `${STORAGE_PREFIX}mode`,
  ROLE: `${STORAGE_PREFIX}role`,
  EMPLOYEES: `${STORAGE_PREFIX}employees_v2`,
  COURSES: `${STORAGE_PREFIX}courses_v2`,
  RECORDS: `${STORAGE_PREFIX}records_v2`,
  DOCUMENTS: `${STORAGE_PREFIX}documents_v2`,
  LOGS: `${STORAGE_PREFIX}logs_v2`,
};

export function loadStoredData() {
  if (typeof window === 'undefined') {
    return {
      mode: 'demo' as const,
      role: 'admin' as const,
      employees: INITIAL_DEMO_EMPLOYEES,
      courses: INITIAL_DEMO_COURSES,
      records: INITIAL_DEMO_RECORDS,
      documents: INITIAL_DEMO_DOCUMENTS,
      logs: INITIAL_DEMO_LOGS
    };
  }

  try {
    const storedMode = (localStorage.getItem(KEYS.MODE) as 'demo' | 'real') || 'demo';
    const storedRole = (localStorage.getItem(KEYS.ROLE) as 'admin' | 'officer') || 'admin';

    if (storedMode === 'real') {
      const empRaw = localStorage.getItem(`${KEYS.EMPLOYEES}_real`);
      const crsRaw = localStorage.getItem(`${KEYS.COURSES}_real`);
      const recRaw = localStorage.getItem(`${KEYS.RECORDS}_real`);
      const docRaw = localStorage.getItem(`${KEYS.DOCUMENTS}_real`);
      const logRaw = localStorage.getItem(`${KEYS.LOGS}_real`);

      return {
        mode: 'real' as const,
        role: storedRole,
        employees: empRaw ? JSON.parse(empRaw) : [],
        courses: crsRaw ? JSON.parse(crsRaw) : [],
        records: recRaw ? JSON.parse(recRaw) : [],
        documents: docRaw ? JSON.parse(docRaw) : [],
        logs: logRaw ? JSON.parse(logRaw) : []
      };
    } else {
      // Demo mode
      const empRaw = localStorage.getItem(KEYS.EMPLOYEES);
      const crsRaw = localStorage.getItem(KEYS.COURSES);
      const recRaw = localStorage.getItem(KEYS.RECORDS);
      const docRaw = localStorage.getItem(KEYS.DOCUMENTS);
      const logRaw = localStorage.getItem(KEYS.LOGS);

      return {
        mode: 'demo' as const,
        role: storedRole,
        employees: empRaw ? JSON.parse(empRaw) : INITIAL_DEMO_EMPLOYEES,
        courses: crsRaw ? JSON.parse(crsRaw) : INITIAL_DEMO_COURSES,
        records: recRaw ? JSON.parse(recRaw) : INITIAL_DEMO_RECORDS,
        documents: docRaw ? JSON.parse(docRaw) : INITIAL_DEMO_DOCUMENTS,
        logs: logRaw ? JSON.parse(logRaw) : INITIAL_DEMO_LOGS
      };
    }
  } catch (err) {
    console.error('Failed to parse storage, using initial fallback', err);
    return {
      mode: 'demo' as const,
      role: 'admin' as const,
      employees: INITIAL_DEMO_EMPLOYEES,
      courses: INITIAL_DEMO_COURSES,
      records: INITIAL_DEMO_RECORDS,
      documents: INITIAL_DEMO_DOCUMENTS,
      logs: INITIAL_DEMO_LOGS
    };
  }
}

export function saveStoredData(data: {
  mode: 'demo' | 'real';
  role: 'admin' | 'officer';
  employees: Employee[];
  courses: TrainingCourse[];
  records: TrainingRecord[];
  documents: DocumentItem[];
  logs: AuditLog[];
}) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.MODE, data.mode);
    localStorage.setItem(KEYS.ROLE, data.role);

    const suffix = data.mode === 'real' ? '_real' : '';
    localStorage.setItem(`${KEYS.EMPLOYEES}${suffix}`, JSON.stringify(data.employees));
    localStorage.setItem(`${KEYS.COURSES}${suffix}`, JSON.stringify(data.courses));
    localStorage.setItem(`${KEYS.RECORDS}${suffix}`, JSON.stringify(data.records));
    localStorage.setItem(`${KEYS.DOCUMENTS}${suffix}`, JSON.stringify(data.documents));
    localStorage.setItem(`${KEYS.LOGS}${suffix}`, JSON.stringify(data.logs));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export function resetDemoData() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(KEYS.EMPLOYEES);
    localStorage.removeItem(KEYS.COURSES);
    localStorage.removeItem(KEYS.RECORDS);
    localStorage.removeItem(KEYS.DOCUMENTS);
    localStorage.removeItem(KEYS.LOGS);
    localStorage.setItem(KEYS.MODE, 'demo');
  }
  return {
    mode: 'demo' as const,
    role: 'admin' as const,
    employees: INITIAL_DEMO_EMPLOYEES,
    courses: INITIAL_DEMO_COURSES,
    records: INITIAL_DEMO_RECORDS,
    documents: INITIAL_DEMO_DOCUMENTS,
    logs: INITIAL_DEMO_LOGS
  };
}
