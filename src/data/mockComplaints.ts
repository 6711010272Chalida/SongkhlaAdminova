import {
  ComplaintCategory,
  ComplaintRecord,
  ComplaintStatus,
  ComplaintUrgency,
  OfficerProfile,
  AgencyDirectoryItem,
  AuditLog,
  SystemConfig
} from '../types';

export const SONGKHLA_DISTRICTS: string[] = [
  'อำเภอเมืองสงขลา',
  'อำเภอหาดใหญ่',
  'อำเภอสะเดา',
  'อำเภอสิงหนคร',
  'อำเภอจะนะ',
  'อำเภอระโนด',
  'อำเภอรัตภูมิ',
  'อำเภอนาทวี',
  'อำเภอเทพา',
  'อำเภอสะบ้าย้อย',
  'อำเภอนาหม่อม',
  'อำเภอบางกล่ำ',
  'อำเภอควนเนียง',
  'อำเภอคลองหอยโข่ง',
  'อำเภอสทิงพระ',
  'อำเภอกระแสสินธุ์'
];

export const STATUS_META: Record<
  ComplaintStatus,
  {
    labelTh: string;
    labelEn: string;
    textColor: string;
    dotColor: string;
    surfaceBg: string;
    borderColor: string;
    order: number;
  }
> = {
  new: {
    labelTh: 'รับเรื่องใหม่',
    labelEn: 'New',
    textColor: 'text-blue-700',
    dotColor: 'bg-blue-600',
    surfaceBg: 'bg-blue-50',
    borderColor: 'border-blue-200',
    order: 1
  },
  investigating: {
    labelTh: 'อยู่ระหว่างตรวจสอบ',
    labelEn: 'Investigating',
    textColor: 'text-indigo-700',
    dotColor: 'bg-indigo-600',
    surfaceBg: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    order: 2
  },
  coordinating: {
    labelTh: 'อยู่ระหว่างประสานงาน',
    labelEn: 'Coordinating',
    textColor: 'text-amber-700',
    dotColor: 'bg-amber-500',
    surfaceBg: 'bg-amber-50',
    borderColor: 'border-amber-200',
    order: 3
  },
  in_progress: {
    labelTh: 'อยู่ระหว่างดำเนินการ',
    labelEn: 'In Progress',
    textColor: 'text-sky-700',
    dotColor: 'bg-sky-600',
    surfaceBg: 'bg-sky-50',
    borderColor: 'border-sky-200',
    order: 4
  },
  waiting_info: {
    labelTh: 'รอข้อมูลเพิ่มเติม',
    labelEn: 'Waiting Info',
    textColor: 'text-orange-700',
    dotColor: 'bg-orange-500',
    surfaceBg: 'bg-orange-50',
    borderColor: 'border-orange-200',
    order: 5
  },
  completed: {
    labelTh: 'ดำเนินการเสร็จสิ้น',
    labelEn: 'Completed',
    textColor: 'text-emerald-700',
    dotColor: 'bg-emerald-600',
    surfaceBg: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    order: 6
  },
  closed: {
    labelTh: 'ยุติเรื่อง',
    labelEn: 'Closed',
    textColor: 'text-slate-600',
    dotColor: 'bg-slate-500',
    surfaceBg: 'bg-slate-100',
    borderColor: 'border-slate-300',
    order: 7
  }
};

export const URGENCY_META: Record<
  ComplaintUrgency,
  { labelTh: string; textColor: string; barColor: string }
> = {
  low: { labelTh: 'ปกติ', textColor: 'text-slate-600', barColor: 'bg-slate-400' },
  normal: { labelTh: 'เร่งด่วน', textColor: 'text-blue-700', barColor: 'bg-blue-600' },
  high: { labelTh: 'ด่วนมาก', textColor: 'text-amber-700', barColor: 'bg-amber-500' },
  critical: { labelTh: 'ด่วนที่สุด', textColor: 'text-rose-700', barColor: 'bg-rose-600' }
};

export const CATEGORY_META: Record<
  ComplaintCategory,
  { labelTh: string; shortTh: string; colorHex: string }
> = {
  infrastructure: {
    labelTh: 'สาธารณูปโภค / ถนน / ไฟฟ้า / ประปา',
    shortTh: 'สาธารณูปโภค/ถนน',
    colorHex: '#1D4ED8'
  },
  environment: {
    labelTh: 'สิ่งแวดล้อม / มลพิษ / ขยะ / น้ำเสีย',
    shortTh: 'สิ่งแวดล้อม/มลพิษ',
    colorHex: '#059669'
  },
  noise_nuisance: {
    labelTh: 'เหตุเดือดร้อนรำคาญ / เสียงดัง',
    shortTh: 'เหตุเดือดร้อนรำคาญ',
    colorHex: '#D97706'
  },
  public_service: {
    labelTh: 'การบริการภาครัฐ / เจ้าหน้าที่',
    shortTh: 'บริการภาครัฐ',
    colorHex: '#0F294A'
  },
  consumer_debt: {
    labelTh: 'หนี้นอกระบบ / การค้า / ผู้บริโภค',
    shortTh: 'หนี้นอกระบบ/ผู้บริโภค',
    colorHex: '#B91C1C'
  },
  land_dispute: {
    labelTh: 'ที่ดิน / เขตพื้นที่ / เกษตรกรรม',
    shortTh: 'ที่ดิน/เขตพื้นที่',
    colorHex: '#C5A45A'
  },
  social_welfare: {
    labelTh: 'สวัสดิการสังคม / ช่วยเหลือผู้ยากไร้',
    shortTh: 'สวัสดิการสังคม',
    colorHex: '#0284C7'
  },
  other: {
    labelTh: 'เรื่องร้องเรียนอื่นๆ',
    shortTh: 'อื่นๆ',
    colorHex: '#64748B'
  }
};

export const INITIAL_OFFICERS: OfficerProfile[] = [
  {
    id: 'off-01',
    name: 'นายธนกฤต สงขลาพัฒน์',
    position: 'นักวิเคราะห์นโยบายและแผนชำนาญการ',
    division: 'กลุ่มงานศูนย์ดำรงธรรมจังหวัดสงขลา',
    phone: '074-311-001 (สายจำลอง)'
  },
  {
    id: 'off-02',
    name: 'นางสาวณัฐริกา หาดใหญ่รักษ์',
    position: 'นิติกรปฏิบัติการ',
    division: 'กลุ่มงานศูนย์ดำรงธรรมจังหวัดสงขลา',
    phone: '074-311-002 (สายจำลอง)'
  },
  {
    id: 'off-03',
    name: 'นายภูมิรพี บ่อยางศิริ',
    position: 'เจ้าพนักงานปกครองชำนาญการ',
    division: 'กลุ่มงานศูนย์ดำรงธรรมจังหวัดสงขลา',
    phone: '074-311-003 (สายจำลอง)'
  },
  {
    id: 'off-04',
    name: 'นางสาวศิริขวัญ สมุทรวิชัย',
    position: 'นักจัดการงานทั่วไปปฏิบัติการ',
    division: 'ฝ่ายรับเรื่องราวร้องทุกข์และประสานงาน',
    phone: '074-311-004 (สายจำลอง)'
  }
];

export const INITIAL_AGENCIES: AgencyDirectoryItem[] = [
  { id: 'ag-01', name: 'เทศบาลนครหาดใหญ่', category: 'องค์กรปกครองส่วนท้องถิ่น', contactPhone: '074-200-000 (สมมติ)' },
  { id: 'ag-02', name: 'เทศบาลนครสงขลา', category: 'องค์กรปกครองส่วนท้องถิ่น', contactPhone: '074-311-000 (สมมติ)' },
  { id: 'ag-03', name: 'แขวงทางหลวงสงขลาที่ 1', category: 'โครงสร้างพื้นฐาน', contactPhone: '074-311-100 (สมมติ)' },
  { id: 'ag-04', name: 'สำนักงานทรัพยากรธรรมชาติและสิ่งแวดล้อมจังหวัดสงขลา', category: 'สิ่งแวดล้อม', contactPhone: '074-312-200 (สมมติ)' },
  { id: 'ag-05', name: 'การไฟฟ้าส่วนภูมิภาคจังหวัดสงขลา', category: 'สาธารณูปโภค', contactPhone: '074-313-300 (สมมติ)' },
  { id: 'ag-06', name: 'การประปาส่วนภูมิภาคสาขาสงขลา', category: 'สาธารณูปโภค', contactPhone: '074-314-400 (สมมติ)' },
  { id: 'ag-07', name: 'ที่ทำการปกครองอำเภอเมืองสงขลา', category: 'ฝ่ายปกครอง', contactPhone: '074-315-500 (สมมติ)' },
  { id: 'ag-08', name: 'ที่ทำการปกครองอำเภอสะเดา', category: 'ฝ่ายปกครอง', contactPhone: '074-411-600 (สมมติ)' },
  { id: 'ag-09', name: 'สำนักงานพัฒนาสังคมและความมั่นคงของมนุษย์จังหวัดสงขลา', category: 'สวัสดิการสังคม', contactPhone: '074-316-700 (สมมติ)' },
  { id: 'ag-10', name: 'ตำรวจภูธรจังหวัดสงขลา', category: 'ความมั่นคงและกฎหมาย', contactPhone: '074-317-800 (สมมติ)' },
  { id: 'ag-11', name: 'สำนักงานที่ดินจังหวัดสงขลา', category: 'ที่ดินและเขตพื้นที่', contactPhone: '074-318-900 (สมมติ)' }
];

export const INITIAL_CONFIG: SystemConfig = {
  officerDisplayName: 'นายธนกฤต สงขลาพัฒน์',
  officerPosition: 'เจ้าหน้าที่ศูนย์ดำรงธรรมจังหวัดสงขลา',
  fiscalYear: 2569,
  storageDriver: 'local_storage'
};

/**
 * 12 Fictional Demo Complaint Records (ข้อมูลสมมติทั้งหมด ห้ามใช้ข้อมูลส่วนบุคคลจริง)
 * Covers multiple months in 2026 (2569), all 7 statuses, Songkhla districts, and overdue items.
 */
export const INITIAL_COMPLAINTS: ComplaintRecord[] = [
  {
    id: 'cmp-001',
    caseNumber: 'SD-2569-001',
    receivedDate: '2026-06-12',
    complainantName: 'นายสมชาย ทดสอบ (ข้อมูลสมมติ)',
    phone: '080-000-0101',
    district: 'อำเภอหาดใหญ่',
    locationArea: 'ซอยราษฎร์ยินดี 3 ตำบลหาดใหญ่ อำเภอหาดใหญ่',
    category: 'infrastructure',
    subject: 'ไฟฟ้าส่องสว่างริมถนนสาธารณะดับหลายจุดเสี่ยงเกิดอุบัติเหตุ',
    description: 'ประชาชนในพื้นที่แจ้งว่าเสาไฟฟ้าส่องสว่างบริเวณทางแยกเข้าซอยราษฎร์ยินดี 3 ดับต่อเนื่องเป็นเวลา 5 วัน ทำให้การสัญจรช่วงกลางคืนมืดและเสี่ยงอันตราย',
    responsibleAgency: 'เทศบาลนครหาดใหญ่',
    assignedOfficer: 'นายธนกฤต สงขลาพัฒน์',
    assignedDate: '2026-06-13',
    followUpDate: '2026-06-25',
    coordinationResult: 'เทศบาลนครหาดใหญ่ส่งทีมช่างไฟฟ้าเข้าดำเนินการเปลี่ยนหลอด LED และตรวจเช็กสายเมนเรียบร้อยแล้ว',
    coordinationNotes: 'ผู้ร้องเรียนยืนยันการใช้งานปกติ',
    urgency: 'high',
    status: 'completed',
    attachments: [
      { id: 'att-101', name: 'ภาพถ่ายจุดไฟฟ้าดับ_สมมติ.jpg', type: 'image', size: '1.2 MB', uploadedAt: '2026-06-12' }
    ],
    timeline: [
      {
        id: 'tl-101',
        timestamp: '2026-06-12 09:30',
        status: 'new',
        officerName: 'นางสาวศิริขวัญ สมุทรวิชัย',
        department: 'ศูนย์ดำรงธรรมจังหวัดสงขลา',
        note: 'รับเรื่องร้องเรียนผ่านเคาน์เตอร์บริการและออกเลขที่รับเรื่อง SD-2569-001'
      },
      {
        id: 'tl-102',
        timestamp: '2026-06-13 11:00',
        status: 'coordinating',
        officerName: 'นายธนกฤต สงขลาพัฒน์',
        department: 'เทศบาลนครหาดใหญ่',
        note: 'ส่งหนังสือประสานงานฝ่ายช่างไฟฟ้า เทศบาลนครหาดใหญ่ เพื่อลงพื้นที่ตรวจสอบ'
      },
      {
        id: 'tl-103',
        timestamp: '2026-06-22 15:40',
        status: 'completed',
        officerName: 'นายธนกฤต สงขลาพัฒน์',
        department: 'ศูนย์ดำรงธรรมจังหวัดสงขลา',
        note: 'ดำเนินการเปลี่ยนโคมไฟส่องสว่างแล้วเสร็จ แจ้งผู้ร้องเรียนรับทราบผลและปิดงาน'
      }
    ],
    createdAt: '2026-06-12T02:30:00.000Z',
    updatedAt: '2026-06-22T08:40:00.000Z'
  },
  {
    id: 'cmp-002',
    caseNumber: 'SD-2569-002',
    receivedDate: '2026-07-04',
    complainantName: 'นางสาวมาลี ตัวอย่าง (ข้อมูลสมมติ)',
    phone: '080-000-0102',
    district: 'อำเภอเมืองสงขลา',
    locationArea: 'ถนนชลาทัศน์ ตำบลบ่อยาง อำเภอเมืองสงขลา',
    category: 'environment',
    subject: 'ท่อระบายน้ำอุดตันและมีกลิ่นไม่พึงประสงค์หลังฝนตกหนัก',
    description: 'บริเวณแนวท่อระบายน้ำริมทางเท้ามีเศษขยะและตะกอนสะสม ทำให้ระบายน้ำไม่ทันและส่งกลิ่นเหม็นกระทบผู้สัญจรและร้านค้าใกล้เคียง',
    responsibleAgency: 'เทศบาลนครสงขลา',
    assignedOfficer: 'นายภูมิรพี บ่อยางศิริ',
    assignedDate: '2026-07-05',
    followUpDate: '2026-07-18',
    coordinationResult: 'สำนักการช่าง เทศบาลนครสงขลา จัดรถดูดเลนเข้าขุดลอกท่อและทำความสะอาดพื้นที่แล้ว',
    urgency: 'normal',
    status: 'completed',
    attachments: [],
    timeline: [
      {
        id: 'tl-201',
        timestamp: '2026-07-04 10:15',
        status: 'new',
        officerName: 'นางสาวศิริขวัญ สมุทรวิชัย',
        note: 'ลงทะเบียนรับเรื่องร้องเรียนด้านสิ่งแวดล้อม'
      },
      {
        id: 'tl-202',
        timestamp: '2026-07-05 14:00',
        status: 'in_progress',
        officerName: 'นายภูมิรพี บ่อยางศิริ',
        department: 'เทศบาลนครสงขลา',
        note: 'ประสานเทศบาลนครสงขลาจัดคิวรถดูดโคลนเข้าดำเนินการ'
      },
      {
        id: 'tl-203',
        timestamp: '2026-07-16 16:00',
        status: 'completed',
        officerName: 'นายภูมิรพี บ่อยางศิริ',
        note: 'ขุดลอกท่อระบายน้ำเสร็จสิ้นและรายงานผลการแก้ไขเรียบร้อย'
      }
    ],
    createdAt: '2026-07-04T03:15:00.000Z',
    updatedAt: '2026-07-16T09:00:00.000Z'
  },
  {
    id: 'cmp-003',
    caseNumber: 'SD-2569-003',
    receivedDate: '2026-08-11',
    complainantName: 'นายกิตติพงษ์ แซมเปิล (ข้อมูลสมมติ)',
    phone: '080-000-0103',
    district: 'อำเภอสะเดา',
    locationArea: 'หมู่ 4 ตำบลสำนักขาม อำเภอสะเดา',
    category: 'noise_nuisance',
    subject: 'ขอให้ตรวจสอบเสียงดังจากสถานประกอบการช่วงเวลากลางคืน',
    description: 'ชาวบ้านใกล้เคียงร้องเรียนว่ามีการเปิดเครื่องเสียงดังเกินเวลากฎหมายกำหนดในช่วง 23.00 - 02.00 น. กระทบการพักผ่อนของเด็กและผู้สูงอายุ',
    responsibleAgency: 'ที่ทำการปกครองอำเภอสะเดา',
    assignedOfficer: 'นางสาวณัฐริกา หาดใหญ่รักษ์',
    assignedDate: '2026-08-12',
    followUpDate: '2026-08-25',
    coordinationResult: 'ฝ่ายปกครองอำเภอสะเดาลงพื้นที่ตักเตือนและทำบันทึกข้อตกลงลดระดับเสียงตามเกณฑ์มาตรฐานแล้ว',
    urgency: 'high',
    status: 'closed',
    attachments: [
      { id: 'att-301', name: 'บันทึกข้อตกลงไกล่เกลี่ย_สมมติ.pdf', type: 'pdf', size: '480 KB', uploadedAt: '2026-08-22' }
    ],
    timeline: [
      {
        id: 'tl-301',
        timestamp: '2026-08-11 08:45',
        status: 'new',
        officerName: 'นางสาวศิริขวัญ สมุทรวิชัย',
        note: 'รับเรื่องร้องเรียนเหตุเดือดร้อนรำคาญในพื้นที่ อ.สะเดา'
      },
      {
        id: 'tl-302',
        timestamp: '2026-08-12 13:20',
        status: 'investigating',
        officerName: 'นางสาวณัฐริกา หาดใหญ่รักษ์',
        department: 'ที่ทำการปกครองอำเภอสะเดา',
        note: 'มอบหมายชุดปฏิบัติการฝ่ายปกครองอำเภอสะเดาเข้าตรวจวัดระดับเสียง'
      },
      {
        id: 'tl-303',
        timestamp: '2026-08-24 10:30',
        status: 'closed',
        officerName: 'นางสาวณัฐริกา หาดใหญ่รักษ์',
        note: 'ผู้ประกอบการปรับปรุงการเก็บเสียงเรียบร้อย คู่กรณีพอใจและยุติเรื่อง'
      }
    ],
    createdAt: '2026-08-11T01:45:00.000Z',
    updatedAt: '2026-08-24T03:30:00.000Z'
  },
  {
    id: 'cmp-004',
    caseNumber: 'SD-2569-004',
    receivedDate: '2026-09-09',
    complainantName: 'นางประไพ จำลอง (ข้อมูลสมมติ)',
    phone: '080-000-0104',
    district: 'อำเภอสิงหนคร',
    locationArea: 'ทางหลวงหมายเลข 408 ช่วงตำบลสทิงหม้อ อำเภอสิงหนคร',
    category: 'infrastructure',
    subject: 'ผิวจราจรชำรุดเป็นหลุมบ่อบริเวณจุดกลับรถ',
    description: 'ผิวจราจรบริเวณจุดกลับรถเกิดการทรุดตัวและเป็นหลุมกว้าง ทำให้รถจักรยานยนต์เสียหลักบ่อยครั้งในช่วงฝนตก',
    responsibleAgency: 'แขวงทางหลวงสงขลาที่ 1',
    assignedOfficer: 'นายธนกฤต สงขลาพัฒน์',
    assignedDate: '2026-09-10',
    followUpDate: '2026-10-30', // Overdue active case
    coordinationResult: 'แขวงทางหลวงเข้าซ่อมแซมชั่วคราวด้วยยางแอสฟัลต์แล้ว รอปูผิวจราจรถาวรตามรอบงบประมาณ',
    coordinationNotes: 'ต้องติดตามผลการปูผิวจราจรระยะถาวรภายในเดือนพฤศจิกายน',
    urgency: 'critical',
    status: 'in_progress',
    attachments: [
      { id: 'att-401', name: 'แผนที่จุดชำรุด_ทล408_สมมติ.pdf', type: 'pdf', size: '820 KB', uploadedAt: '2026-09-09' }
    ],
    timeline: [
      {
        id: 'tl-401',
        timestamp: '2026-09-09 14:10',
        status: 'new',
        officerName: 'นางสาวศิริขวัญ สมุทรวิชัย',
        note: 'รับแจ้งปัญหาผิวถนนชำรุดเสี่ยงอุบัติเหตุ'
      },
      {
        id: 'tl-402',
        timestamp: '2026-09-10 09:00',
        status: 'coordinating',
        officerName: 'นายธนกฤต สงขลาพัฒน์',
        department: 'แขวงทางหลวงสงขลาที่ 1',
        note: 'แจ้งเหตุเร่งด่วนถึงแขวงทางหลวงสงขลาที่ 1'
      },
      {
        id: 'tl-403',
        timestamp: '2026-09-20 15:00',
        status: 'in_progress',
        officerName: 'นายธนกฤต สงขลาพัฒน์',
        department: 'แขวงทางหลวงสงขลาที่ 1',
        note: 'ซ่อมแซมชั่วคราวเพื่อความปลอดภัยแล้ว อยู่ระหว่างรอคิวซ่อมบำรุงถาวร'
      }
    ],
    createdAt: '2026-09-09T07:10:00.000Z',
    updatedAt: '2026-09-20T08:00:00.000Z'
  },
  {
    id: 'cmp-005',
    caseNumber: 'SD-2569-005',
    receivedDate: '2026-09-22',
    complainantName: 'นายวีระชัย นามสมมติ (ข้อมูลสมมติ)',
    phone: '080-000-0105',
    district: 'อำเภอจะนะ',
    locationArea: 'หมู่ 2 ตำบลตลิ่งชัน อำเภอจะนะ',
    category: 'environment',
    subject: 'ขอตรวจสอบการปล่อยน้ำเสียลงลำคลองสาธารณะ',
    description: 'พบน้ำในคลองสาธารณะมีสีคล้ำผิดปกติและมีปลาขนาดเล็กตายบริเวณท้ายหมู่บ้าน คาดว่าเกิดจากการระบายน้ำทิ้งจากพื้นที่เกษตรกรรมหรือโรงงานใกล้เคียง',
    responsibleAgency: 'สำนักงานทรัพยากรธรรมชาติและสิ่งแวดล้อมจังหวัดสงขลา',
    assignedOfficer: 'นายภูมิรพี บ่อยางศิริ',
    assignedDate: '2026-09-23',
    followUpDate: '2026-11-05', // Overdue active case
    coordinationResult: 'เจ้าหน้าที่สิ่งแวดล้อมเก็บตัวอย่างน้ำส่งตรวจวิเคราะห์ค่า BOD/COD แล้ว อยู่ระหว่างรอผลทางห้องปฏิบัติการ',
    urgency: 'critical',
    status: 'investigating',
    attachments: [],
    timeline: [
      {
        id: 'tl-501',
        timestamp: '2026-09-22 11:20',
        status: 'new',
        officerName: 'นางสาวศิริขวัญ สมุทรวิชัย',
        note: 'รับเรื่องร้องเรียนปัญหาน้ำเสีย อ.จะนะ'
      },
      {
        id: 'tl-502',
        timestamp: '2026-09-23 10:00',
        status: 'investigating',
        officerName: 'นายภูมิรพี บ่อยางศิริ',
        department: 'สำนักงานทรัพยากรธรรมชาติและสิ่งแวดล้อมจังหวัดสงขลา',
        note: 'ร่วมกับเจ้าหน้าที่สิ่งแวดล้อมลงพื้นที่เก็บตัวอย่างน้ำเพื่อตรวจสอบคุณภาพ'
      }
    ],
    createdAt: '2026-09-22T04:20:00.000Z',
    updatedAt: '2026-09-23T03:00:00.000Z'
  },
  {
    id: 'cmp-006',
    caseNumber: 'SD-2569-006',
    receivedDate: '2026-10-03',
    complainantName: 'นางสาวสุดารัตน์ พิมพ์ตัวอย่าง (ข้อมูลสมมติ)',
    phone: '080-000-0106',
    district: 'อำเภอหาดใหญ่',
    locationArea: 'ถนนเพชรเกษม ตำบลคอหงส์ อำเภอหาดใหญ่',
    category: 'consumer_debt',
    subject: 'ขอความช่วยเหลือไกล่เกลี่ยปัญหาหนี้นอกระบบและการข่มขู่ทวงหนี้',
    description: 'ผู้ร้องเรียนประสบปัญหาดอกเบี้ยเกินอัตราที่กฎหมายกำหนดและถูกติดตามทวงถามถึงสถานที่ทำงาน จึงขอเข้ารับการคุ้มครองและไกล่เกลี่ยหนี้',
    responsibleAgency: 'ตำรวจภูธรจังหวัดสงขลา',
    assignedOfficer: 'นางสาวณัฐริกา หาดใหญ่รักษ์',
    assignedDate: '2026-10-04',
    followUpDate: '2026-11-20',
    coordinationResult: 'เชิญเจ้าหนี้และลูกหนี้เข้าสู่กระบวนการไกล่เกลี่ย ณ ศูนย์ดำรงธรรมจังหวัดสงขลา เรียบร้อยแล้ว 1 ครั้ง',
    coordinationNotes: 'อยู่ระหว่างนัดหมายลงนามบันทึกข้อตกลงปรับโครงสร้างหนี้รอบที่ 2',
    urgency: 'high',
    status: 'coordinating',
    attachments: [
      { id: 'att-601', name: 'เอกสารคำร้องขอไกล่เกลี่ย_สมมติ.pdf', type: 'pdf', size: '350 KB', uploadedAt: '2026-10-03' }
    ],
    timeline: [
      {
        id: 'tl-601',
        timestamp: '2026-10-03 13:45',
        status: 'new',
        officerName: 'นางสาวณัฐริกา หาดใหญ่รักษ์',
        note: 'รับคำร้องขอความช่วยเหลือกรณีหนี้นอกระบบ'
      },
      {
        id: 'tl-602',
        timestamp: '2026-10-04 09:30',
        status: 'coordinating',
        officerName: 'นางสาวณัฐริกา หาดใหญ่รักษ์',
        department: 'ตำรวจภูธรจังหวัดสงขลา',
        note: 'ประสานชุดสืบสวนและคณะอนุกรรมการไกล่เกลี่ยหนี้นอกระบบจังหวัดสงขลา'
      }
    ],
    createdAt: '2026-10-03T06:45:00.000Z',
    updatedAt: '2026-10-04T02:30:00.000Z'
  },
  {
    id: 'cmp-007',
    caseNumber: 'SD-2569-007',
    receivedDate: '2026-10-14',
    complainantName: 'นายอนุชา ระโนดสมมติ (ข้อมูลสมมติ)',
    phone: '080-000-0107',
    district: 'อำเภอระโนด',
    locationArea: 'หมู่ 5 ตำบลระโนด อำเภอระโนด',
    category: 'land_dispute',
    subject: 'ขอให้ตรวจสอบแนวเขตทางสาธารณประโยชน์ที่มีการรุกล้ำ',
    description: 'ชาวบ้านในชุมชนขอให้หน่วยงานที่ดินตรวจสอบแนวเขตถนนซอยสาธารณะเนื่องจากพบการก่อสร้างรั้วล้ำเข้ามาในเขตทางสัญจร',
    responsibleAgency: 'สำนักงานที่ดินจังหวัดสงขลา',
    assignedOfficer: 'นายภูมิรพี บ่อยางศิริ',
    assignedDate: '2026-10-16',
    followUpDate: '2026-11-10', // Overdue active case
    coordinationNotes: 'อยู่ระหว่างขอสำเนาโฉนดและเอกสารรังวัดเพิ่มเติมจากผู้ร้องเรียน',
    urgency: 'normal',
    status: 'waiting_info',
    attachments: [],
    timeline: [
      {
        id: 'tl-701',
        timestamp: '2026-10-14 10:00',
        status: 'new',
        officerName: 'นางสาวศิริขวัญ สมุทรวิชัย',
        note: 'ลงทะเบียนรับเรื่องขอรังวัดตรวจสอบแนวเขตทางสาธารณะ'
      },
      {
        id: 'tl-702',
        timestamp: '2026-10-18 14:30',
        status: 'waiting_info',
        officerName: 'นายภูมิรพี บ่อยางศิริ',
        department: 'สำนักงานที่ดินจังหวัดสงขลา',
        note: 'แจ้งผู้ร้องเรียนนำส่งแผนที่สังเขปและสำเนาเอกสารสิทธิ์แปลงข้างเคียงเพิ่มเติม'
      }
    ],
    createdAt: '2026-10-14T03:00:00.000Z',
    updatedAt: '2026-10-18T07:30:00.000Z'
  },
  {
    id: 'cmp-008',
    caseNumber: 'SD-2569-008',
    receivedDate: '2026-10-21',
    complainantName: 'นางวันเพ็ญ นาทวีจำลอง (ข้อมูลสมมติ)',
    phone: '080-000-0108',
    district: 'อำเภอนาทวี',
    locationArea: 'หมู่ 3 ตำบลนาทวี อำเภอนาทวี',
    category: 'social_welfare',
    subject: 'ขอรับการช่วยเหลือผู้สูงอายุพิการที่ขาดแคลนอุปกรณ์ยังชีพ',
    description: 'ผู้แจ้งขอความอนุเคราะห์ประสานงานจัดหาวีลแชร์และเบี้ยยังชีพให้ผู้สูงอายุติดเตียงในพื้นที่ตำบลนาทวี',
    responsibleAgency: 'สำนักงานพัฒนาสังคมและความมั่นคงของมนุษย์จังหวัดสงขลา',
    assignedOfficer: 'นางสาวศิริขวัญ สมุทรวิชัย',
    assignedDate: '2026-10-22',
    followUpDate: '2026-10-31',
    coordinationResult: 'พมจ.สงขลา ลงพื้นที่เยี่ยมบ้าน มอบกายอุปกรณ์และขึ้นทะเบียนสิทธิสวัสดิการเรียบร้อยแล้ว',
    urgency: 'high',
    status: 'completed',
    attachments: [],
    timeline: [
      {
        id: 'tl-801',
        timestamp: '2026-10-21 09:15',
        status: 'new',
        officerName: 'นางสาวศิริขวัญ สมุทรวิชัย',
        note: 'รับเรื่องขอรับการสงเคราะห์ผู้สูงอายุและผู้พิการ'
      },
      {
        id: 'tl-802',
        timestamp: '2026-10-22 11:00',
        status: 'coordinating',
        officerName: 'นางสาวศิริขวัญ สมุทรวิชัย',
        department: 'สำนักงานพัฒนาสังคมและความมั่นคงของมนุษย์จังหวัดสงขลา',
        note: 'ประสานทีมนักสังคมสงเคราะห์ลงพื้นที่ตรวจสอบข้อเท็จจริง'
      },
      {
        id: 'tl-803',
        timestamp: '2026-10-29 15:20',
        status: 'completed',
        officerName: 'นางสาวศิริขวัญ สมุทรวิชัย',
        note: 'ส่งมอบรถเข็นและอนุมัติเงินสงเคราะห์ผู้มีรายได้น้อยเรียบร้อย'
      }
    ],
    createdAt: '2026-10-21T02:15:00.000Z',
    updatedAt: '2026-10-29T08:20:00.000Z'
  },
  {
    id: 'cmp-009',
    caseNumber: 'SD-2569-009',
    receivedDate: '2026-11-02',
    complainantName: 'นายเอกชัย รัตภูมิโมเดล (ข้อมูลสมมติ)',
    phone: '080-000-0109',
    district: 'อำเภอรัตภูมิ',
    locationArea: 'หมู่ 7 ตำบลกำแพงเพชร อำเภอรัตภูมิ',
    category: 'infrastructure',
    subject: 'น้ำประปาภูมิภาคไหลอ่อนและขุ่นในช่วงเวลาเร่งด่วน',
    description: 'ประชาชนกว่า 30 ครัวเรือนประสบปัญหาน้ำประปาไหลอ่อนมากในช่วงเช้าและเย็น พร้อมมีตะกอนขุ่นเป็นระยะ',
    responsibleAgency: 'การประปาส่วนภูมิภาคสาขาสงขลา',
    assignedOfficer: 'นายธนกฤต สงขลาพัฒน์',
    assignedDate: '2026-11-03',
    followUpDate: '2026-11-18',
    coordinationResult: 'ประสานฝ่ายผลิตและจ่ายน้ำเข้าล้างท่อเมนและปรับแรงดันน้ำประจำสถานีจ่ายน้ำย่อย',
    urgency: 'normal',
    status: 'in_progress',
    attachments: [],
    timeline: [
      {
        id: 'tl-901',
        timestamp: '2026-11-02 10:40',
        status: 'new',
        officerName: 'นางสาวศิริขวัญ สมุทรวิชัย',
        note: 'รับเรื่องร้องเรียนคุณภาพน้ำประปา อ.รัตภูมิ'
      },
      {
        id: 'tl-902',
        timestamp: '2026-11-03 13:15',
        status: 'in_progress',
        officerName: 'นายธนกฤต สงขลาพัฒน์',
        department: 'การประปาส่วนภูมิภาคสาขาสงขลา',
        note: 'อยู่ระหว่างการระบายตะกอนท่อเมนและตรวจวัดแรงดันน้ำ'
      }
    ],
    createdAt: '2026-11-02T03:40:00.000Z',
    updatedAt: '2026-11-03T06:15:00.000Z'
  },
  {
    id: 'cmp-010',
    caseNumber: 'SD-2569-010',
    receivedDate: '2026-11-08',
    complainantName: 'นางสาวพรพิมล เมืองสงขลา (ข้อมูลสมมติ)',
    phone: '080-000-0110',
    district: 'อำเภอเมืองสงขลา',
    locationArea: 'ถนนราชดำเนิน ตำบลบ่อยาง อำเภอเมืองสงขลา',
    category: 'public_service',
    subject: 'ข้อเสนอแนะการปรับปรุงระบบจัดคิวและป้ายแนะนำจุดบริการประชาชน',
    description: 'ผู้มาติดต่อราชการเสนอให้เพิ่มป้ายบอกทางภาษาไทย-อังกฤษ และจัดระเบียบจุดนั่งรอสำหรับผู้สูงอายุบริเวณอาคารบริการประชาชน',
    responsibleAgency: 'ที่ทำการปกครองอำเภอเมืองสงขลา',
    assignedOfficer: 'นายภูมิรพี บ่อยางศิริ',
    assignedDate: '2026-11-09',
    followUpDate: '2026-11-24',
    coordinationResult: 'ส่งต่อข้อเสนอแนะให้ฝ่ายอำนวยการจัดทำป้ายประชาสัมพันธ์เพิ่มเติม',
    urgency: 'low',
    status: 'coordinating',
    attachments: [],
    timeline: [
      {
        id: 'tl-1001',
        timestamp: '2026-11-08 15:00',
        status: 'new',
        officerName: 'นางสาวศิริขวัญ สมุทรวิชัย',
        note: 'บันทึกข้อเสนอแนะการพัฒนาจุดบริการประชาชน'
      },
      {
        id: 'tl-1002',
        timestamp: '2026-11-09 10:20',
        status: 'coordinating',
        officerName: 'นายภูมิรพี บ่อยางศิริ',
        department: 'ที่ทำการปกครองอำเภอเมืองสงขลา',
        note: 'ประสานหน่วยบริการจัดทำแผนผังจุดบริการและที่นั่งผู้สูงอายุ'
      }
    ],
    createdAt: '2026-11-08T08:00:00.000Z',
    updatedAt: '2026-11-09T03:20:00.000Z'
  },
  {
    id: 'cmp-011',
    caseNumber: 'SD-2569-011',
    receivedDate: '2026-11-12',
    complainantName: 'นายชัชวาล เทพาทดลอง (ข้อมูลสมมติ)',
    phone: '080-000-0111',
    district: 'อำเภอเทพา',
    locationArea: 'หมู่ 1 ตำบลปากบาง อำเภอเทพา',
    category: 'infrastructure',
    subject: 'กิ่งไม้ใหญ่พาดสายไฟฟ้าแรงต่ำเสี่ยงโค่นล้มช่วงมรสุม',
    description: 'ต้นไม้ใหญ่ริมทางสาธารณะมีกิ่งโน้มทับสายไฟฟ้าแรงต่ำ เกรงว่าจะเกิดกระแสไฟฟ้ารั่วหรือเสาไฟหักโค่นเมื่อมีลมกระโชกแรง',
    responsibleAgency: 'การไฟฟ้าส่วนภูมิภาคจังหวัดสงขลา',
    urgency: 'critical',
    status: 'new',
    attachments: [
      { id: 'att-1101', name: 'ภาพต้นไม้พาดสายไฟ_สมมติ.jpg', type: 'image', size: '940 KB', uploadedAt: '2026-11-12' }
    ],
    timeline: [
      {
        id: 'tl-1101',
        timestamp: '2026-11-12 09:05',
        status: 'new',
        officerName: 'นางสาวศิริขวัญ สมุทรวิชัย',
        note: 'รับเรื่องเร่งด่วน รอการมอบหมายเจ้าหน้าที่ประสาน กฟภ.'
      }
    ],
    createdAt: '2026-11-12T02:05:00.000Z',
    updatedAt: '2026-11-12T02:05:00.000Z'
  },
  {
    id: 'cmp-012',
    caseNumber: 'SD-2569-012',
    receivedDate: '2026-11-14',
    complainantName: 'นางสาวนลินี หาดใหญ่เดโม (ข้อมูลสมมติ)',
    phone: '080-000-0112',
    district: 'อำเภอหาดใหญ่',
    locationArea: 'ซอยปุณณกัณฑ์ ตำบลคอหงส์ อำเภอหาดใหญ่',
    category: 'environment',
    subject: 'ขอให้จัดเก็บขยะตกค้างบริเวณจุดพักขยะชุมชน',
    description: 'มีขยะชิ้นใหญ่และขยะครัวเรือนสะสมล้นถังบริเวณปากซอยปุณณกัณฑ์ ทำให้รถสัญจรผ่านลำบาก',
    responsibleAgency: 'เทศบาลนครหาดใหญ่',
    urgency: 'high',
    status: 'new',
    attachments: [],
    timeline: [
      {
        id: 'tl-1201',
        timestamp: '2026-11-14 10:50',
        status: 'new',
        officerName: 'นางสาวศิริขวัญ สมุทรวิชัย',
        note: 'รับเรื่องร้องเรียนใหม่ผ่านระบบ SONGKHLA DAMRONGDHAM CONNECT'
      }
    ],
    createdAt: '2026-11-14T03:50:00.000Z',
    updatedAt: '2026-11-14T03:50:00.000Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-11-14T03:50:00.000Z',
    actor: 'นางสาวศิริขวัญ สมุทรวิชัย',
    action: 'create',
    caseNumber: 'SD-2569-012',
    details: 'รับเรื่องร้องเรียนใหม่: ขอให้จัดเก็บขยะตกค้างบริเวณจุดพักขยะชุมชน'
  },
  {
    id: 'log-002',
    timestamp: '2026-11-12T02:05:00.000Z',
    actor: 'นางสาวศิริขวัญ สมุทรวิชัย',
    action: 'create',
    caseNumber: 'SD-2569-011',
    details: 'รับเรื่องร้องเรียนเร่งด่วน: กิ่งไม้ใหญ่พาดสายไฟฟ้าแรงต่ำ อ.เทพา'
  },
  {
    id: 'log-003',
    timestamp: '2026-11-09T03:20:00.000Z',
    actor: 'นายภูมิรพี บ่อยางศิริ',
    action: 'assign',
    caseNumber: 'SD-2569-010',
    details: 'มอบหมายหน่วยงานที่ทำการปกครองอำเภอเมืองสงขลาติดตามข้อเสนอแนะ'
  }
];
