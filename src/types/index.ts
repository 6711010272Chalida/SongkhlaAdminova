export type WorkCategory = 
  | 'official_letter'      // หนังสือราชการ
  | 'public_petition'       // คำร้องเรียน / ศูนย์ดำรงธรรมจำลอง
  | 'development_project'   // โครงการพัฒนา / ยุทธศาสตร์
  | 'coordination'          // ประสานงานทั่วไป / บันทึกข้อความ
  | 'procurement';          // จัดซื้อจัดจ้าง / งบประมาณ

export type WorkStatus = 
  | 'pending'       // รอดำเนินการ
  | 'in_progress'   // กำลังดำเนินการ
  | 'completed'     // ดำเนินการแล้วเสร็จ
  | 'cancelled';    // ยกเลิก / ยุติเรื่อง

export type PriorityLevel = 
  | 'normal'        // ปกติ
  | 'urgent'        // ด่วน
  | 'very_urgent';  // ด่วนที่สุด

export interface ProgressNote {
  id: string;
  date: string;
  author: string;
  text: string;
}

export interface WorkRecord {
  id: string;
  refId: string;                // รหัสเอกสาร เช่น SK-69-0101
  title: string;                // เรื่อง / รายละเอียดโดยย่อ
  category: WorkCategory;       // ประเภทงาน
  receivedDate: string;         // วันที่รับเรื่อง (YYYY-MM-DD)
  followUpDate: string;         // วันนัดติดตาม / กำหนดส่ง (YYYY-MM-DD)
  status: WorkStatus;           // สถานะงาน
  priority: PriorityLevel;      // ระดับความสำคัญ
  responsiblePerson: string;    // ผู้รับผิดชอบ เช่น เจ้าหน้าที่ A (งานสารบรรณ)
  department: string;           // ส่วนงาน / กลุ่มงาน
  originAgency: string;         // หน่วยงานต้นเรื่อง / ผู้ส่ง
  details: string;              // สรุปสาระสำคัญ / ข้อสั่งการ
  notes: ProgressNote[];        // บันทึกความคืบหน้า
  createdAt: string;
  updatedAt: string;
}

export type ActiveTab = 'dashboard' | 'tracker' | 'search' | 'reports' | 'about';

export interface FilterState {
  searchQuery: string;
  category: string;
  status: string;
  priority: string;
  responsiblePerson: string;
  startDate: string;
  endDate: string;
}
