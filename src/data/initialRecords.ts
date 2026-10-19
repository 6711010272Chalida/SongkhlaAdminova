import { WorkRecord } from '../types';

export const INITIAL_DEMO_RECORDS: WorkRecord[] = [
  {
    id: 'rec-001',
    refId: 'SK-69-0101',
    title: 'ประสานงานแผนแม่บทฟื้นฟูคลองสำโรงเพื่อการท่องเที่ยวเชิงนิเวศน์ชุมชน',
    category: 'development_project',
    receivedDate: '2026-10-02',
    followUpDate: '2026-10-22',
    status: 'in_progress',
    priority: 'urgent',
    responsiblePerson: 'เจ้าหน้าที่ A (กลุ่มยุทธศาสตร์)',
    department: 'กลุ่มงานยุทธศาสตร์และข้อมูลเพื่อการพัฒนาจังหวัด',
    originAgency: 'เทศบาลนครสงขลา (แบบจำลอง)',
    details: 'รวบรวมข้อมูลสถานะคุณภาพน้ำและข้อเสนอจากเวทีประชาคมชุมชนเก้าเส้ง เพื่อจัดทำกรอบข้อเสนอโครงการร่วมกับสำนักงานโยธาธิการและผังเมือง',
    notes: [
      {
        id: 'n1',
        date: '2026-10-05',
        author: 'เจ้าหน้าที่ A',
        text: 'ได้รับรายงานผลการสำรวจเบื้องต้นจากคณะทำงานภาคประชาสังคม'
      },
      {
        id: 'n2',
        date: '2026-10-12',
        author: 'เจ้าหน้าที่ A',
        text: 'ส่งหนังสือประสานงานถึงหน่วยงานท้องถิ่นเพื่อนัดประชุมร่วมวันที่ 22 ต.ค.'
      }
    ],
    createdAt: '2026-10-02T08:30:00Z',
    updatedAt: '2026-10-12T14:20:00Z'
  },
  {
    id: 'rec-002',
    refId: 'SK-69-0102',
    title: 'คำร้องขอปรับปรุงระบบไฟส่องสว่างเส้นทางเลียบทะเลสาบสงขลา',
    category: 'public_petition',
    receivedDate: '2026-10-04',
    followUpDate: '2026-10-14',
    status: 'completed',
    priority: 'normal',
    responsiblePerson: 'เจ้าหน้าที่ B (ศูนย์ดำรงธรรมจำลอง)',
    department: 'กลุ่มงานศูนย์ดำรงธรรม (ส่วนบริการประชาชน)',
    originAgency: 'ตัวแทนชมรมชาวประมงพื้นบ้าน (สมมติ)',
    details: 'ประชาชนแจ้งปัญหาเสาไฟส่องสว่างดับชำรุด 8 ต้น บริเวณทางเลียบทะเลสาบตอนล่าง ส่งผลต่อความปลอดภัยเวลากลางคืน',
    notes: [
      {
        id: 'n3',
        date: '2026-10-06',
        author: 'เจ้าหน้าที่ B',
        text: 'ส่งเรื่องประสานการไฟฟ้าส่วนภูมิภาคและเทศบาลตำบลดำเนินการซ่อมบำรุง'
      },
      {
        id: 'n4',
        date: '2026-10-13',
        author: 'เจ้าหน้าที่ B',
        text: 'ตรวจสอบงานซ่อมแซมแล้วเสร็จ ครบทั้ง 8 จุด ยุติเรื่องและแจ้งผู้ร้อง'
      }
    ],
    createdAt: '2026-10-04T09:15:00Z',
    updatedAt: '2026-10-13T16:00:00Z'
  },
  {
    id: 'rec-003',
    refId: 'SK-69-0103',
    title: 'จัดทำหนังสือเวียนมาตรการประหยัดพลังงานและการลดใช้กระดาษในสถานที่ราชการ',
    category: 'official_letter',
    receivedDate: '2026-10-08',
    followUpDate: '2026-10-24',
    status: 'in_progress',
    priority: 'normal',
    responsiblePerson: 'เจ้าหน้าที่ C (งานสารบรรณ)',
    department: 'กลุ่มงานอำนวยการ (งานสารบรรณกลาง)',
    originAgency: 'สำนักงานปลัดสำนักนายกรัฐมนตรี (สมมติ)',
    details: 'ยกร่างหนังสือเวียนกำชับส่วนราชการภายในศาลากลาง ดำเนินมาตรการลดปริมาณเอกสารกระดาษและปิดสวิตช์เครื่องปรับอากาศช่วงพักเที่ยง',
    notes: [
      {
        id: 'n5',
        date: '2026-10-10',
        author: 'เจ้าหน้าที่ C',
        text: 'ร่างหนังสือเวียนเรียบร้อย รอเสนอหัวหน้าสำนักงานลงนามตรวจทาน'
      }
    ],
    createdAt: '2026-10-08T10:00:00Z',
    updatedAt: '2026-10-10T11:30:00Z'
  },
  {
    id: 'rec-004',
    refId: 'SK-69-0104',
    title: 'สรุปรายงานผลการเบิกจ่ายงบประมาณการพัฒนาคุณภาพชีวิตไตรมาส 1',
    category: 'procurement',
    receivedDate: '2026-09-28',
    followUpDate: '2026-10-10',
    status: 'completed',
    priority: 'urgent',
    responsiblePerson: 'เจ้าหน้าที่ D (ฝ่ายการเงินและพัสดุ)',
    department: 'กลุ่มงานบริหารทรัพยากรบุคคลและการเงิน',
    originAgency: 'สำนักงานคลังจังหวัดสงขลา (แบบจำลอง)',
    details: 'รวบรวมสถิติอัตราการเบิกจ่ายงบประมาณโครงการพัฒนาด้านอาชีพและสิ่งแวดล้อม จำแนกตาม 16 อำเภอ สรุปส่งกรมบัญชีกลาง',
    notes: [
      {
        id: 'n6',
        date: '2026-10-01',
        author: 'เจ้าหน้าที่ D',
        text: 'ตรวจสอบข้อมูลการเบิกจ่ายครบทั้ง 16 อำเภอ'
      },
      {
        id: 'n7',
        date: '2026-10-09',
        author: 'เจ้าหน้าที่ D',
        text: 'จัดพิมพ์เอกสารรายงานสรุปและจัดส่งทางระบบสารบรรณเรียบร้อย'
      }
    ],
    createdAt: '2026-09-28T13:45:00Z',
    updatedAt: '2026-10-09T17:00:00Z'
  },
  {
    id: 'rec-005',
    refId: 'SK-69-0105',
    title: 'ตรวจสอบเอกสารโครงการปรับปรุงภูมิทัศน์แหลมสมิหลาและสวนสองทะเล',
    category: 'development_project',
    receivedDate: '2026-10-11',
    followUpDate: '2026-10-28',
    status: 'in_progress',
    priority: 'very_urgent',
    responsiblePerson: 'เจ้าหน้าที่ A (กลุ่มยุทธศาสตร์)',
    department: 'กลุ่มงานยุทธศาสตร์และข้อมูลเพื่อการพัฒนาจังหวัด',
    originAgency: 'กลุ่มส่งเสริมการท่องเที่ยวจังหวัด (สมมติ)',
    details: 'ตรวจแบบผังการติดตั้งจุดคัดแยกขยะอัจฉริยะ ป้ายสื่อความหมาย 3 ภาษา และแท่นชาร์จรถกอล์ฟไฟฟ้าสำหรับบริการผู้สูงอายุ',
    notes: [
      {
        id: 'n8',
        date: '2026-10-14',
        author: 'เจ้าหน้าที่ A',
        text: 'ได้รับความเห็นทางเทคนิคจากวิศวกรโยธา เตรียมจัดประชุมกลุ่มย่อย'
      }
    ],
    createdAt: '2026-10-11T11:20:00Z',
    updatedAt: '2026-10-14T15:10:00Z'
  },
  {
    id: 'rec-006',
    refId: 'SK-69-0106',
    title: 'คำร้องขอเอกสารรับรองสิ่งปลูกสร้างเพื่อการอนุรักษ์ย่านเมืองเก่าสงขลา',
    category: 'public_petition',
    receivedDate: '2026-10-15',
    followUpDate: '2026-10-25',
    status: 'pending',
    priority: 'normal',
    responsiblePerson: 'เจ้าหน้าที่ B (ศูนย์ดำรงธรรมจำลอง)',
    department: 'กลุ่มงานศูนย์ดำรงธรรม (ส่วนบริการประชาชน)',
    originAgency: 'ชมรมอนุรักษ์สถาปัตยกรรมชิโน-ยูโรเปียน (สมมติ)',
    details: 'ขอหนังสือรับรองประวัติและแบบสถาปัตยกรรมอาคารตึกแถวโบราณถนนนครนอก เพื่อใช้ประกอบการขอขึ้นทะเบียนมรดกทางวัฒนธรรม',
    notes: [
      {
        id: 'n9',
        date: '2026-10-15',
        author: 'เจ้าหน้าที่ B',
        text: 'ลงทะเบียนรับเรื่อง ส่งต่อกลุ่มงานวัฒนธรรมเพื่อร่วมพิจารณาความถูกต้อง'
      }
    ],
    createdAt: '2026-10-15T14:10:00Z',
    updatedAt: '2026-10-15T14:10:00Z'
  },
  {
    id: 'rec-007',
    refId: 'SK-69-0107',
    title: 'การจัดซื้อพัสดุครุภัณฑ์คอมพิวเตอร์และระบบสำรองไฟประจำปีงบประมาณ',
    category: 'procurement',
    receivedDate: '2026-10-01',
    followUpDate: '2026-10-16',
    status: 'completed',
    priority: 'normal',
    responsiblePerson: 'เจ้าหน้าที่ D (ฝ่ายการเงินและพัสดุ)',
    department: 'กลุ่มงานบริหารทรัพยากรบุคคลและการเงิน',
    originAgency: 'ฝ่ายพัสดุและยานพาหนะ (จำลอง)',
    details: 'จัดหาเครื่องคอมพิวเตอร์ประมวลผล 15 ชุด และเครื่องสำรองไฟฟ้า (UPS) 15 เครื่อง ตามเกณฑ์ราคากลางกระทรวงดิจิทัลฯ',
    notes: [
      {
        id: 'n10',
        date: '2026-10-03',
        author: 'เจ้าหน้าที่ D',
        text: 'คณะกรรมการตรวจรับพัสดุเข้าทดสอบอุปกรณ์ครบถ้วน'
      },
      {
        id: 'n11',
        date: '2026-10-16',
        author: 'เจ้าหน้าที่ D',
        text: 'ลงนามใบตรวจรับและส่งต่อฝ่ายบัญชีเพื่อจ่ายเงินตามสัญญา'
      }
    ],
    createdAt: '2026-10-01T09:00:00Z',
    updatedAt: '2026-10-16T15:30:00Z'
  },
  {
    id: 'rec-008',
    refId: 'SK-69-0108',
    title: 'หนังสือเชิญหน่วยงานภาคีร่วมประชุมวางแผนซักซ้อมรับมืออุทกภัยล่วงหน้า',
    category: 'coordination',
    receivedDate: '2026-10-14',
    followUpDate: '2026-10-21',
    status: 'in_progress',
    priority: 'very_urgent',
    responsiblePerson: 'เจ้าหน้าที่ C (งานสารบรรณ)',
    department: 'กลุ่มงานอำนวยการ (งานสารบรรณกลาง)',
    originAgency: 'สำนักงานป้องกันและบรรเทาสาธารณภัยจังหวัด (สมมติ)',
    details: 'จัดเตรียมวาระการประชุมและส่งหนังสือเชิญนายอำเภอทั้ง 16 อำเภอ ร่วมทดสอบระบบแจ้งเตือนระดับน้ำและศูนย์พักพิงชั่วคราว',
    notes: [
      {
        id: 'n12',
        date: '2026-10-14',
        author: 'เจ้าหน้าที่ C',
        text: 'ออกเลขหนังสือเชิญและส่งทางระบบสารบรรณอิเล็กทรอนิกส์จำลองแล้ว 12 หน่วยงาน'
      }
    ],
    createdAt: '2026-10-14T08:00:00Z',
    updatedAt: '2026-10-16T10:45:00Z'
  },
  {
    id: 'rec-009',
    refId: 'SK-69-0109',
    title: 'คำร้องเรียนเรื่องการระบายน้ำและการก่อสร้างสะพานข้ามคลองเตย',
    category: 'public_petition',
    receivedDate: '2026-10-17',
    followUpDate: '2026-10-26',
    status: 'pending',
    priority: 'urgent',
    responsiblePerson: 'เจ้าหน้าที่ B (ศูนย์ดำรงธรรมจำลอง)',
    department: 'กลุ่มงานศูนย์ดำรงธรรม (ส่วนบริการประชาชน)',
    originAgency: 'ชาวบ้านชุมชนคลองเตย หมู่ 4 (สมมติ)',
    details: 'ข้อร้องเรียนเรื่องเศษวัสดุก่อสร้างสะพานกีดขวางทางน้ำไหล ขอให้หน่วยงานตรวจสอบและเปิดทางน้ำเพื่อป้องกันน้ำเอ่อล้นเข้าท่วมพื้นที่สวน',
    notes: [
      {
        id: 'n13',
        date: '2026-10-17',
        author: 'เจ้าหน้าที่ B',
        text: 'รับคำร้อง จัดทำบันทึกแจ้งโครงการชลประทานในพื้นที่ตรวจสอบข้อเท็จจริง'
      }
    ],
    createdAt: '2026-10-17T11:00:00Z',
    updatedAt: '2026-10-17T11:00:00Z'
  },
  {
    id: 'rec-010',
    refId: 'SK-69-0110',
    title: 'ประสานงานโครงการจัดนิทรรศการนวัตกรรมบริการภาครัฐสู่ประชาชน',
    category: 'coordination',
    receivedDate: '2026-10-16',
    followUpDate: '2026-10-30',
    status: 'pending',
    priority: 'normal',
    responsiblePerson: 'เจ้าหน้าที่ C (งานสารบรรณ)',
    department: 'กลุ่มงานอำนวยการ (งานสารบรรณกลาง)',
    originAgency: 'สถาบันอุดมศึกษาในจังหวัดสงขลา (แบบจำลองโครงงานนักศึกษา)',
    details: 'ประสานการจัดสรรพื้นที่ห้องประชุมศาลากลาง สำหรับจัดแสดงผลงานโครงงานนวัตกรรมดิจิทัลของนักศึกษาและการประกวดต้นแบบบริการ',
    notes: [
      {
        id: 'n14',
        date: '2026-10-16',
        author: 'เจ้าหน้าที่ C',
        text: 'ตรวจสอบตารางการใช้งานห้องประชุมใหญ่ชั้น 2 ว่างตรงตามกำหนด'
      }
    ],
    createdAt: '2026-10-16T15:20:00Z',
    updatedAt: '2026-10-16T15:20:00Z'
  }
];

export const CATEGORY_LABELS: Record<string, { labelTh: string; labelEn: string; icon: string }> = {
  official_letter: {
    labelTh: 'หนังสือราชการ',
    labelEn: 'Official Letter',
    icon: 'FileText'
  },
  public_petition: {
    labelTh: 'คำร้องเรียน/บริการประชาชน',
    labelEn: 'Public Petition',
    icon: 'MessageSquare'
  },
  development_project: {
    labelTh: 'โครงการพัฒนาจังหวัด',
    labelEn: 'Development Project',
    icon: 'Briefcase'
  },
  coordination: {
    labelTh: 'ประสานงานทั่วไป',
    labelEn: 'Inter-agency Coordination',
    icon: 'Share2'
  },
  procurement: {
    labelTh: 'จัดซื้อจัดจ้าง/งบประมาณ',
    labelEn: 'Procurement & Finance',
    icon: 'CreditCard'
  }
};

export const STATUS_LABELS: Record<string, { labelTh: string; labelEn: string; color: string; bg: string; border: string }> = {
  pending: {
    labelTh: 'รอดำเนินการ',
    labelEn: 'Pending',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200'
  },
  in_progress: {
    labelTh: 'กำลังดำเนินการ',
    labelEn: 'In Progress',
    color: 'text-sky-700',
    bg: 'bg-sky-50',
    border: 'border-sky-200'
  },
  completed: {
    labelTh: 'ดำเนินการแล้วเสร็จ',
    labelEn: 'Completed',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200'
  },
  cancelled: {
    labelTh: 'ยกเลิก / ยุติเรื่อง',
    labelEn: 'Cancelled',
    color: 'text-slate-500',
    bg: 'bg-slate-100',
    border: 'border-slate-300'
  }
};

export const PRIORITY_LABELS: Record<string, { labelTh: string; labelEn: string; color: string; dotColor: string }> = {
  normal: {
    labelTh: 'ปกติ',
    labelEn: 'Normal',
    color: 'text-slate-600',
    dotColor: 'bg-slate-400'
  },
  urgent: {
    labelTh: 'ด่วน',
    labelEn: 'Urgent',
    color: 'text-amber-700',
    dotColor: 'bg-amber-500'
  },
  very_urgent: {
    labelTh: 'ด่วนที่สุด',
    labelEn: 'Very Urgent',
    color: 'text-rose-700',
    dotColor: 'bg-rose-600'
  }
};

const STORAGE_KEY = 'songkhla_adminflow_records_v1';

export function loadRecordsFromStorage(): WorkRecord[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_RECORDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_RECORDS));
      return INITIAL_DEMO_RECORDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_DEMO_RECORDS;
  } catch (e) {
    console.error('Error loading from storage:', e);
    return INITIAL_DEMO_RECORDS;
  }
}

export function saveRecordsToStorage(records: WorkRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Error saving to storage:', e);
  }
}

export function resetRecordsStorage(): WorkRecord[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_RECORDS));
  }
  return INITIAL_DEMO_RECORDS;
}
