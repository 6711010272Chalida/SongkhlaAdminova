import React from 'react';
import { WaveMotif } from './WaveMotif';
import { 
  Target, 
  Lightbulb, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  GraduationCap, 
  ShieldCheck, 
  Layers, 
  FileCheck2,
  Clock,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Hero Presentation Card */}
      <div className="bg-gradient-to-br from-[#0F2038] via-[#142A4A] to-[#0A1628] text-white rounded-2xl p-6 sm:p-10 border border-slate-700 shadow-xl relative overflow-hidden">
        {/* Subtle decorative wave background */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
          <WaveMotif size="lg" className="w-96 h-96" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-300/20 text-amber-300 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>โครงงานนวัตกรรมดิจิทัลสำหรับบริการภาครัฐ (Student Prototype Project)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
            SONGKHLA AdminFlow
          </h1>
          <p className="text-amber-200/90 text-sm sm:text-base font-medium">
            ระบบต้นแบบสนับสนุนการจัดการข้อมูลและการประสานงานภาครัฐ
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
            โครงการออกแบบต้นแบบระบบสารสนเทศเพื่อสนับสนุนการติดตามหนังสือราชการ งานโครงการยุทธศาสตร์ และเรื่องร้องเรียนของศูนย์ดำรงธรรมจำลอง มุ่งเน้นการยกระดับความโปร่งใส ความรวดเร็วในการติดตามผล และการทำงานร่วมกันอย่างไร้รอยต่อระหว่างกลุ่มงานในศาลากลางจังหวัด
          </p>
        </div>
      </div>

      {/* Critical Legal & Prototype Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 sm:p-6 text-amber-950 space-y-2 shadow-xs">
        <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>ข้อชี้แจงสำคัญเกี่ยวกับสถานะระบบ (Prototype Disclaimer)</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-amber-900">
          ระบบ <strong>SONGKHLA AdminFlow</strong> นี้เป็น <strong>ผลงานต้นแบบแนวคิดนวัตกรรมที่จัดทำขึ้นโดยนักศึกษา</strong> เพื่อใช้ประกอบการนำเสนอผลงานทางวิชาการและโครงงานฝึกงานเท่านั้น <strong>มิใช่ระบบงานราชการจริงของศาลากลางจังหวัดสงขลา</strong> และไม่มีการเชื่อมต่อกับระบบฐานข้อมูลของกระทรวง ทบวง กรม หรือสารบรรณอิเล็กทรอนิกส์จริง ข้อมูลและชื่อบุคคลทั้งหมดเป็นข้อมูลสมมติ (Fictional Demo Data)
        </p>
      </div>

      {/* Section 1: Objectives (วัตถุประสงค์โครงการ) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#0F2038] flex items-center justify-center font-bold">
            <Target className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0F2038]">
              วัตถุประสงค์ของการพัฒนานวัตกรรมต้นแบบ
            </h2>
            <p className="text-xs text-slate-500">Core Objectives & Project Mission</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0F2038] text-amber-300 text-xs flex items-center justify-center font-bold">1</span>
              ลดปัญหาความล่าช้าในการติดตามงาน
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              พัฒนากระดานติดตามสถานะแบบเรียลไทม์ที่แสดงกำหนดวันนัดติดตามชัดเจน ช่วยให้เจ้าหน้าที่ทราบสถานะของหนังสือราชการและเรื่องร้องเรียนได้ทันทีโดยไม่ต้องค้นหาจากแฟ้มเอกสารกระดาษ
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0F2038] text-amber-300 text-xs flex items-center justify-center font-bold">2</span>
              รวมศูนย์ข้อมูลการประสานงานระหว่างกลุ่มงาน
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              สร้างศูนย์กลางข้อมูลจำลองสำหรับบันทึกประวัติการประสานงาน (Progress Timeline) เพื่อให้เจ้าหน้าที่แต่ละฝ่ายมองเห็นความคืบหน้าร่วมกันและประสานงานได้อย่างต่อเนื่องแม้มีการผลัดเปลี่ยนเวรปฏิบัติงาน
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0F2038] text-amber-300 text-xs flex items-center justify-center font-bold">3</span>
              ระบบสืบค้นข้อมูลที่สะดวกรวดเร็ว
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ออกแบบฟังก์ชัน Smart Search ที่สามารถค้นหาได้ทั้งจากรหัสเอกสาร คำสำคัญ ข้อสั่งการ และชื่อหน่วยงานต้นเรื่อง ช่วยลดระยะเวลาในการสืบค้นข้อมูลของประชาชนและเจ้าหน้าที่
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0F2038] text-amber-300 text-xs flex items-center justify-center font-bold">4</span>
              สนับสนุนการตัดสินใจของผู้บริหารผ่าน Dashboard
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              นำเสนอรายงานสถิติเชิงภาพ (Visual Analytics) ที่สรุปอัตรางานค้าง ปริมาณงานรายเดือน และการกระจายตัวของภารกิจงาน เพื่อใช้ประกอบการวางแผนจัดสรรทรัพยากรบุคคล
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Expected Benefits (ประโยชน์ที่คาดว่าจะได้รับ) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#0F2038] flex items-center justify-center font-bold">
            <Lightbulb className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0F2038]">
              ประโยชน์ที่คาดว่าจะได้รับ (Expected Benefits)
            </h2>
            <p className="text-xs text-slate-500">คุณค่าเชิงยุทธศาสตร์และการบริการประชาชน</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-xs font-bold text-amber-700">สำหรับเจ้าหน้าที่ผู้ปฏิบัติงาน</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              มีระบบจัดระเบียบงานที่ชัดเจน ลดความผิดพลาดจากการลืมกำหนดนัดหมาย และสามารถเรียกดูข้อมูลย้อนหลังได้ทันทีในระหว่างการประชุมหรือประสานงาน
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-xs font-bold text-amber-700">สำหรับหัวหน้าส่วนราชการและผู้บริหาร</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              สามารถติดตามคอขวดของการดำเนินงาน (Bottlenecks) ได้แบบภาพรวม ทราบได้ทันทีว่าเรื่องใดล่าช้าเกินกำหนดส่ง และสั่งการแก้ไขได้อย่างตรงจุด
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-xs font-bold text-amber-700">สำหรับประชาชนและชุมชน</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              ได้รับการตอบสนองต่อคำร้องเรียนอย่างรวดเร็ว โปร่งใส และสามารถสอบถามความคืบหน้าของเรื่องที่ยื่นไว้ได้อย่างแม่นยำด้วยรหัสอ้างอิงกลาง
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Limitations & Future Development Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Limitations */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">
              ข้อจำกัดของระบบต้นแบบ (Limitations)
            </h2>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span><strong>การจัดเก็บข้อมูลระดับเบราว์เซอร์:</strong> ข้อมูลทั้งหมดถูกจัดเก็บใน LocalStorage ของผู้ใช้งาน เพื่อความปลอดภัยและเพื่อการสาธิต ไม่มีการส่งข้อมูลขึ้นเซิร์ฟเวอร์ภายนอก</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span><strong>ไม่เชื่อมต่อระบบราชการจริง:</strong> ระบบนี้ไม่มีการเชื่อมต่อกับระบบ e-SARABAN หรือระบบสารบรรณอิเล็กทรอนิกส์กลางของสำนักงาน ก.พ.ร. หรือกระทรวงมหาดไทย</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span><strong>ไม่มีระบบส่งข้อความแจ้งเตือนอัตโนมัติ:</strong> การแจ้งเตือนแสดงผ่านอินเทอร์เฟซของเว็บแอปพลิเคชัน ไม่มีการส่ง SMS หรือ LINE Notify อัตโนมัติ</span>
            </li>
          </ul>
        </div>

        {/* Future Development Roadmap */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">
              แนวทางการพัฒนาต่อยอดในอนาคต (Future Roadmap)
            </h2>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
              <strong className="text-slate-900 block mb-1">
                1. การศึกษาบริบทการทำงานจริงร่วมกับเจ้าหน้าที่ผู้มีอำนาจ
              </strong>
              <span>
                ก่อนการนำระบบไปใช้งานจริง จำเป็นต้องลงพื้นที่ศึกษากฎระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ พ.ศ. 2526 และที่แก้ไขเพิ่มเติม รวมถึงระเบียบความปลอดภัยข้อมูลส่วนบุคคล (PDPA) ร่วมกับบุคลากรผู้ปฏิบัติหน้าที่จริง
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
              <strong className="text-slate-900 block mb-1">
                2. การบูรณาการระบบพิสูจน์ตัวตนภาครัฐ (Digital ID)
              </strong>
              <span>
                วางแผนเชื่อมต่อกับระบบ ThaID ของกรมการปกครองเพื่อยืนยันตัวตนของเจ้าหน้าที่และประชาชนผู้ยื่นคำร้อง พร้อมทั้งเพิ่มระบบ Role-Based Access Control (RBAC) ตามลำดับชั้นสายบังคับบัญชา
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
              <strong className="text-slate-900 block mb-1">
                3. การเชื่อมต่อ API สารบรรณกลางและลายมือชื่อดิจิทัล (Digital Signature)
              </strong>
              <span>
                พัฒนาต่อยอดให้สามารถรับ-ส่งเอกสารผ่านเกณฑ์มาตรฐานสารบรรณดิจิทัล พร้อมระบบประทับเวลารับรอง (Time Stamping) ที่มีผลผูกพันทางกฎหมาย
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Credits & Footer */}
      <div className="p-6 bg-slate-100 rounded-xl text-center space-y-2 border border-slate-200">
        <p className="text-xs font-semibold text-slate-700">
          SONGKHLA AdminFlow · โครงงานต้นแบบนวัตกรรมเทคโนโลยีดิจิทัลเพื่อการพัฒนาท้องถิ่น
        </p>
        <p className="text-[11px] text-slate-500 max-w-xl mx-auto">
          ผลงานแนวคิดสำหรับการศึกษาวิจัยและนำเสนอในระดับมหาวิทยาลัย · สร้างสรรค์ด้วยความมุ่งมั่นที่จะเห็นบริการภาครัฐไทยมีความทันสมัย โปร่งใส และเข้าถึงง่ายสำหรับประชาชนทุกคน
        </p>
      </div>
    </div>
  );
};
