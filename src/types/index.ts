export type UserRole = 'admin' | 'officer';

export type SystemMode = 'demo' | 'real';

export type ActiveTab = 
  | 'dashboard'     // ภาพรวมระบบ
  | 'employees'     // ข้อมูลบุคลากร
  | 'courses'       // หลักสูตรและโครงการพัฒนา
  | 'attendance'    // การเข้าร่วมฝึกอบรม
  | 'development'   // ประวัติการพัฒนา
  | 'documents'     // เอกสารและหลักฐาน
  | 'reports'       // รายงานและสถิติ
  | 'settings';     // ตั้งค่าระบบ

export type PositionLevel = 
  | 'general'             // ปฏิบัติงาน
  | 'operational'         // ปฏิบัติการ
  | 'experienced'         // ชำนาญงาน / ชำนาญการ
  | 'senior'              // ชำนาญการพิเศษ
  | 'expert'              // เชี่ยวชาญ / ผู้ทรงคุณวุฒิ
  | 'executive';          // อำนวยการ / บริหาร

export type EmployeeStatus = 
  | 'active'              // ปฏิบัติราชการปกติ
  | 'probation'           // บรรจุทดลองปฏิบัติราชการ
  | 'leave'               // ลาศึกษาต่อ / ลาเพิ่มพูนความรู้
  | 'transferred'         // โอนย้าย
  | 'retired';            // เกษียณอายุราชการ

export interface Employee {
  id: string;
  empCode: string;             // รหัสบุคลากรจำลอง เช่น SK-HR-001
  prefix: string;              // คำนำหน้าชื่อ (นาย / นาง / นางสาว / ว่าที่ ร.ต.)
  firstName: string;           // ชื่อ
  lastName: string;            // นามสกุล
  position: string;            // ตำแหน่ง
  department: string;          // กลุ่มงาน / หน่วยงาน
  positionLevel: PositionLevel;// ระดับตำแหน่ง
  startDate: string;           // วันที่เริ่มปฏิบัติงาน (YYYY-MM-DD)
  status: EmployeeStatus;      // สถานะการปฏิบัติงาน
  email: string;               // อีเมล (จำลอง)
  phone: string;               // เบอร์โทรศัพท์ (จำลอง)
  notes?: string;              // หมายเหตุ
  createdAt: string;
  updatedAt: string;
}

export type CourseCategory = 
  | 'knowledge_skill'         // การพัฒนาความรู้และทักษะเฉพาะด้าน
  | 'public_management'       // การบริหารจัดการภาครัฐยุคใหม่
  | 'law_regulation'          // กฎหมาย ระเบียบ และจริยธรรมข้าราชการ
  | 'digital_tech'            // เทคโนโลยีสารสนเทศและดิจิทัล
  | 'leadership'              // การพัฒนาภาวะผู้นำและการบริหาร
  | 'other';                  // อื่น ๆ

export type CourseStatus = 
  | 'upcoming'                // กำลังจะจัดขึ้น (เปิดรับลงทะเบียน)
  | 'ongoing'                 // อยู่ระหว่างดำเนินการฝึกอบรม
  | 'completed'               // ดำเนินการเสร็จสิ้น
  | 'cancelled';              // ยกเลิก / เลื่อนการจัด

export interface TrainingCourse {
  id: string;
  courseCode: string;          // รหัสหลักสูตร เช่น TR-2569-01
  title: string;               // ชื่อหลักสูตร / โครงการ
  category: CourseCategory;    // ประเภทหลักสูตร
  organizer: string;           // หน่วยงานผู้จัด
  location: string;            // สถานที่จัดอบรม / ระบบออนไลน์
  startDate: string;           // วันที่เริ่ม (YYYY-MM-DD)
  endDate: string;             // วันที่สิ้นสุด (YYYY-MM-DD)
  hours: number;               // จำนวนชั่วโมงอบรม
  maxAttendees: number;        // จำนวนผู้เข้ารับการอบรมเป้าหมาย
  objective: string;           // วัตถุประสงค์
  details: string;             // รายละเอียดหลักสูตร
  status: CourseStatus;        // สถานะหลักสูตร
  fiscalYear: number;          // ปีงบประมาณ เช่น 2569
  createdAt: string;
  updatedAt: string;
}

export type AttendanceStatus = 
  | 'registered'              // ลงทะเบียนแล้ว
  | 'attending'               // อยู่ระหว่างเข้าร่วม
  | 'passed'                  // ผ่านการอบรม
  | 'failed'                  // ไม่ผ่านการอบรม
  | 'cancelled';              // ยกเลิกการเข้าร่วม

export interface TrainingRecord {
  id: string;
  employeeId: string;          // เชื่อมโยง Employee
  courseId: string;            // เชื่อมโยง TrainingCourse
  registrationDate: string;    // วันที่ลงทะเบียน
  attendanceDate: string;      // วันที่เข้าร่วม
  status: AttendanceStatus;    // สถานะการเข้าร่วม
  score?: number;              // คะแนนประเมิน (0-100)
  evaluationGrade?: 'excellent' | 'good' | 'fair' | 'need_improvement'; // ผลการประเมิน
  evaluationNote?: string;     // ความเห็น / ผลประเมิน
  certificateNumber?: string;  // เลขที่ใบประกาศนียบัตร (ถ้ามี)
  certificateUrl?: string;     // ลิงก์เอกสารรับรอง
  hoursCompleted: number;      // จำนวนชั่วโมงที่ได้รับ
  createdAt: string;
  updatedAt: string;
}

export type DocumentCategory = 
  | 'certificate'             // ใบประกาศนียบัตร / วุฒิบัตร
  | 'course_material'         // เอกสารประกอบการบรรยาย / คู่มือ
  | 'project_doc'             // เอกสารโครงการ / อนุมัติงบประมาณ
  | 'general';                // เอกสารระเบียบ / ประชาสัมพันธ์

export interface DocumentItem {
  id: string;
  title: string;               // ชื่อเอกสาร
  category: DocumentCategory;  // หมวดหมู่
  fileType: 'pdf' | 'docx' | 'jpg' | 'jpeg' | 'png';
  fileSize: string;            // ขนาดไฟล์ เช่น "2.4 MB"
  courseId?: string;           // เชื่อมโยงหลักสูตร (ถ้ามี)
  employeeId?: string;         // เชื่อมโยงบุคลากร (ถ้ามี)
  uploadDate: string;          // วันที่บันทึก
  uploadedBy: string;          // ผู้บันทึก
  notes?: string;              // หมายเหตุ
  downloadUrl?: string;        // ลิงก์ดาวน์โหลด
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: 'create' | 'update' | 'delete' | 'export' | 'reset' | 'status_change';
  targetType: 'employee' | 'course' | 'attendance' | 'document' | 'system';
  targetId?: string;
  details: string;
}

export interface AgencyInfo {
  nameTh: string;
  nameEn: string;
  division: string;
  subDivision: string;
  location: string;
  fiscalYear: number;
}
