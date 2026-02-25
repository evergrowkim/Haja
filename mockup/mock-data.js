/* ============================================
   Mock Data - 하자 이걸로
   Realistic sample data for prototype
   ============================================ */

const MOCK = {
  // Current user
  currentUser: {
    name: '김현수',
    role: '점검 관리자',
    initials: '김',
    tenant: '한솔건설점검'
  },

  // Projects
  projects: [
    { id: 'p1', name: '래미안 원베일리 2차', code: 'RW-2024', buildings: 8, units: 1240, phase: 'pre_check', progress: 67 },
    { id: 'p2', name: '힐스테이트 세운 3단지', code: 'HS-2024', buildings: 12, units: 980, phase: 'movein', progress: 89 },
    { id: 'p3', name: '디에이치 자이 개포', code: 'DZ-2024', buildings: 5, units: 640, phase: 'quality_check', progress: 34 },
  ],

  // Current project
  currentProject: null,

  // Status definitions
  statuses: {
    PENDING:     { label: '접수대기', class: 'pending' },
    RECEIVED:    { label: '접수완료', class: 'received' },
    ASSIGNED:    { label: '배정완료', class: 'assigned' },
    IN_PROGRESS: { label: '처리중', class: 'in-progress' },
    COMPLETED:   { label: '처리완료', class: 'completed' },
    REJECTED:    { label: '반려', class: 'rejected' },
    VERIFIED:    { label: '검수완료', class: 'verified' },
    CLOSED:      { label: '종결', class: 'closed' },
  },

  // Work types (공종)
  workTypes: [
    '도장', '미장', '타일', '목공', '설비(급배수)', '설비(난방)', '전기', '창호',
    '방수', '석공', '가구(싱크대)', '가구(수납장)', '잡철', '유리', '조경', '기타'
  ],

  // Defect types (하자유형)
  defectTypes: {
    '도장': ['오염', '기포/들뜸', '균열', '탈락', '색상불량', '누락'],
    '미장': ['균열', '들뜸', '마감불량', '단차', '누락'],
    '타일': ['파손', '들뜸', '줄눈불량', '오염', '단차', '누락'],
    '설비(급배수)': ['누수', '파손', '미설치', '작동불량', '배수불량'],
    '설비(난방)': ['누수', '미작동', '온도불균일', '소음', '파손'],
    '전기': ['미점등', '미설치', '접촉불량', '오결선', '파손'],
    '창호': ['파손', '기밀불량', '개폐불량', '시건불량', '결로'],
    '방수': ['누수', '들뜸', '균열', '미시공'],
  },

  // Severity levels
  severities: [
    { level: 1, label: '경미', description: '미관상 불량', class: 'severity-1' },
    { level: 2, label: '보통', description: '기능 저하', class: 'severity-2' },
    { level: 3, label: '중대', description: '기능 불량', class: 'severity-3' },
    { level: 4, label: '긴급', description: '안전/구조 위험', class: 'severity-4' },
  ],

  // Contractors
  contractors: [
    { id: 'c1', name: '대한도장', workTypes: ['도장'], phone: '010-1234-5678', active: 23 },
    { id: 'c2', name: '신우미장', workTypes: ['미장'], phone: '010-2345-6789', active: 18 },
    { id: 'c3', name: '동아타일', workTypes: ['타일'], phone: '010-3456-7890', active: 12 },
    { id: 'c4', name: '한솔설비', workTypes: ['설비(급배수)', '설비(난방)'], phone: '010-4567-8901', active: 31 },
    { id: 'c5', name: '삼성전기공사', workTypes: ['전기'], phone: '010-5678-9012', active: 15 },
    { id: 'c6', name: '대림창호', workTypes: ['창호'], phone: '010-6789-0123', active: 9 },
    { id: 'c7', name: '한양방수', workTypes: ['방수'], phone: '010-7890-1234', active: 7 },
  ],

  // Defects (main dataset)
  defects: [
    {
      id: 'd001', receiptNumber: '260128-0001', building: '101', unit: '301', room: '거실',
      position: '천장', workType: '도장', defectType: '균열', severity: 3,
      status: 'IN_PROGRESS', description: '거실 천장 도장면 균열 약 50cm, 지속적으로 확대 추정',
      contractor: '대한도장', reporter: '박소영', phase: 'pre_check',
      isUrgent: false, confidence: 0.94, createdAt: '2026-01-28 09:15',
      promiseDate: '2026-02-05', images: 2
    },
    {
      id: 'd002', receiptNumber: '260128-0002', building: '101', unit: '502', room: '안방',
      position: '벽', workType: '미장', defectType: '들뜸', severity: 2,
      status: 'ASSIGNED', description: '안방 벽면 미장 들뜸 약 30x30cm 범위',
      contractor: '신우미장', reporter: '김현수', phase: 'pre_check',
      isUrgent: false, confidence: 0.88, createdAt: '2026-01-28 10:32',
      promiseDate: '2026-02-07', images: 3
    },
    {
      id: 'd003', receiptNumber: '260128-0003', building: '102', unit: '1201', room: '주방',
      position: '바닥', workType: '타일', defectType: '파손', severity: 2,
      status: 'COMPLETED', description: '주방 바닥 타일 1매 파손 (모서리 깨짐)',
      contractor: '동아타일', reporter: '이정민', phase: 'pre_check',
      isUrgent: false, confidence: 0.96, createdAt: '2026-01-27 14:20',
      promiseDate: '2026-02-03', images: 2
    },
    {
      id: 'd004', receiptNumber: '260128-0004', building: '102', unit: '801', room: '욕실',
      position: '천장', workType: '설비(급배수)', defectType: '누수', severity: 4,
      status: 'IN_PROGRESS', description: '욕실 천장에서 지속적 누수 발생. 윗층 배관 문제 의심',
      contractor: '한솔설비', reporter: '최영호', phase: 'pre_check',
      isUrgent: true, confidence: 0.91, createdAt: '2026-01-28 08:05',
      promiseDate: '2026-01-31', images: 4
    },
    {
      id: 'd005', receiptNumber: '260127-0005', building: '103', unit: '402', room: '거실',
      position: '벽', workType: '전기', defectType: '미점등', severity: 2,
      status: 'VERIFIED', description: '거실 벽 콘센트 3구 중 1구 통전 안됨',
      contractor: '삼성전기공사', reporter: '박소영', phase: 'pre_check',
      isUrgent: false, confidence: 0.82, createdAt: '2026-01-27 11:45',
      promiseDate: '2026-02-01', images: 1
    },
    {
      id: 'd006', receiptNumber: '260127-0006', building: '101', unit: '1502', room: '안방',
      position: '창', workType: '창호', defectType: '기밀불량', severity: 3,
      status: 'PENDING', description: '안방 창문 닫힘 상태에서 외풍 발생. 기밀 테이프 점검 필요',
      contractor: null, reporter: '김현수', phase: 'pre_check',
      isUrgent: false, confidence: null, createdAt: '2026-01-27 16:30',
      promiseDate: null, images: 2
    },
    {
      id: 'd007', receiptNumber: '260129-0007', building: '103', unit: '702', room: '욕실',
      position: '벽', workType: '타일', defectType: '줄눈불량', severity: 1,
      status: 'RECEIVED', description: '욕실 벽 타일 줄눈 일부 미시공 (약 2m 구간)',
      contractor: null, reporter: '이정민', phase: 'pre_check',
      isUrgent: false, confidence: 0.90, createdAt: '2026-01-29 09:00',
      promiseDate: null, images: 1
    },
    {
      id: 'd008', receiptNumber: '260129-0008', building: '102', unit: '301', room: '주방',
      position: '벽', workType: '가구(싱크대)', defectType: '파손', severity: 2,
      status: 'REJECTED', description: '싱크대 상판 모서리 찍힘. 보수 후 재검수 필요',
      contractor: '대한도장', reporter: '최영호', phase: 'pre_check',
      isUrgent: false, confidence: 0.85, createdAt: '2026-01-29 10:20',
      promiseDate: '2026-02-04', images: 3
    },
    {
      id: 'd009', receiptNumber: '260129-0009', building: '101', unit: '201', room: '현관',
      position: '바닥', workType: '석공', defectType: '오염', severity: 1,
      status: 'CLOSED', description: '현관 대리석 바닥 시멘트 오염 (세척 필요)',
      contractor: '동아타일', reporter: '박소영', phase: 'pre_check',
      isUrgent: false, confidence: 0.93, createdAt: '2026-01-26 13:40',
      promiseDate: '2026-01-28', images: 1
    },
    {
      id: 'd010', receiptNumber: '260130-0010', building: '103', unit: '1001', room: '거실',
      position: '천장', workType: '도장', defectType: '오염', severity: 1,
      status: 'PENDING', description: '거실 천장 도장면 핸드프린트 오염 다수',
      contractor: null, reporter: '김현수', phase: 'pre_check',
      isUrgent: false, confidence: null, createdAt: '2026-01-30 08:50',
      promiseDate: null, images: 2
    },
    {
      id: 'd011', receiptNumber: '260130-0011', building: '102', unit: '601', room: '발코니',
      position: '바닥', workType: '방수', defectType: '균열', severity: 3,
      status: 'ASSIGNED', description: '발코니 바닥 방수층 균열, 우천 시 침수 우려',
      contractor: '한양방수', reporter: '이정민', phase: 'pre_check',
      isUrgent: true, confidence: 0.89, createdAt: '2026-01-30 11:15',
      promiseDate: '2026-02-03', images: 3
    },
    {
      id: 'd012', receiptNumber: '260130-0012', building: '101', unit: '901', room: '거실',
      position: '벽', workType: '도장', defectType: '기포/들뜸', severity: 2,
      status: 'RECEIVED', description: '거실 벽면 도장 기포 발생 약 1m 범위',
      contractor: null, reporter: '최영호', phase: 'pre_check',
      isUrgent: false, confidence: 0.91, createdAt: '2026-01-30 14:05',
      promiseDate: null, images: 2
    },
  ],

  // Dashboard stats
  getStats() {
    const d = this.defects;
    const total = d.length;
    const pending = d.filter(x => x.status === 'PENDING').length;
    const inProgress = d.filter(x => ['ASSIGNED', 'IN_PROGRESS'].includes(x.status)).length;
    const completed = d.filter(x => ['COMPLETED', 'VERIFIED', 'CLOSED'].includes(x.status)).length;
    const rejected = d.filter(x => x.status === 'REJECTED').length;
    const urgent = d.filter(x => x.isUrgent).length;
    const avgConfidence = d.filter(x => x.confidence).reduce((s, x) => s + x.confidence, 0) / d.filter(x => x.confidence).length;

    return { total, pending, inProgress, completed, rejected, urgent, avgConfidence };
  },

  getStatusCounts() {
    const counts = {};
    Object.keys(this.statuses).forEach(s => {
      counts[s] = this.defects.filter(d => d.status === s).length;
    });
    return counts;
  },

  getWorkTypeCounts() {
    const counts = {};
    this.defects.forEach(d => {
      counts[d.workType] = (counts[d.workType] || 0) + 1;
    });
    return counts;
  },

  getBuildingCounts() {
    const counts = {};
    this.defects.forEach(d => {
      const key = d.building + '동';
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  },

  // History for a defect
  getDefectHistory(defectId) {
    const histories = {
      'd001': [
        { status: 'PENDING', label: '접수대기', by: '시스템', time: '01/28 09:15', note: '하자 등록' },
        { status: 'RECEIVED', label: '접수완료', by: 'AI', time: '01/28 09:15', note: 'AI 분류 완료 (신뢰도 94%)' },
        { status: 'ASSIGNED', label: '배정완료', by: '시스템', time: '01/28 09:16', note: '대한도장 자동 배정' },
        { status: 'IN_PROGRESS', label: '처리중', by: '대한도장', time: '01/29 10:30', note: '현장 확인 후 보수 착수' },
      ],
      'd004': [
        { status: 'PENDING', label: '접수대기', by: '시스템', time: '01/28 08:05', note: '긴급 하자 등록' },
        { status: 'RECEIVED', label: '접수완료', by: 'AI', time: '01/28 08:06', note: 'AI 분류 완료 (신뢰도 91%)' },
        { status: 'ASSIGNED', label: '배정완료', by: '시스템', time: '01/28 08:06', note: '한솔설비 긴급 배정' },
        { status: 'IN_PROGRESS', label: '처리중', by: '한솔설비', time: '01/28 09:00', note: '윗층 배관 확인 중' },
      ],
    };
    return histories[defectId] || [
      { status: 'PENDING', label: '접수대기', by: '시스템', time: '01/28 09:00', note: '하자 등록' },
      { status: 'RECEIVED', label: '접수완료', by: 'AI', time: '01/28 09:01', note: 'AI 분류 완료' },
    ];
  },

  // RAG similar cases
  getSimilarCases(workType, defectType) {
    return [
      { id: 'SC-001', project: '래미안 레벤투스', similarity: 92, workType, defectType, resolution: '전면 재시공', duration: '3일' },
      { id: 'SC-002', project: '힐스테이트 천호', similarity: 87, workType, defectType, resolution: '부분 보수', duration: '1일' },
      { id: 'SC-003', project: '자이 더 아이파크', similarity: 81, workType, defectType, resolution: '교체', duration: '2일' },
    ];
  }
};

// ============================================
// 10K-Scale Aggregated Statistics
// Simulates a project with 12,847 total defects
// across 8 buildings, 1,240 units
// ============================================
MOCK.scaledStats = {
  total: 12847,
  today: 47,
  todayDelta: 12,  // vs yesterday
  thisWeek: 287,
  lastWeek: 312,

  // Status distribution
  statusCounts: {
    PENDING: 1243,
    RECEIVED: 892,
    ASSIGNED: 1567,
    IN_PROGRESS: 2134,
    COMPLETED: 4231,
    REJECTED: 487,
    VERIFIED: 1842,
    CLOSED: 451
  },

  // Derived metrics
  get openCount() { return this.statusCounts.PENDING + this.statusCounts.RECEIVED + this.statusCounts.ASSIGNED + this.statusCounts.IN_PROGRESS; },
  get completedCount() { return this.statusCounts.COMPLETED + this.statusCounts.VERIFIED + this.statusCounts.CLOSED; },
  get completionRate() { return Math.round(this.completedCount / this.total * 100); },
  get overdueCount() { return 342; },
  get avgProcessDays() { return 3.8; },
  get avgProcessDaysLastMonth() { return 4.2; },

  // SLA metrics
  sla: {
    withinSLA: 11203,
    nearSLA: 892,   // within 2 days of deadline
    overSLA: 342,
    noDeadline: 410,
  },

  // Severity distribution (total)
  severityCounts: { 1: 5234, 2: 4891, 3: 2103, 4: 619 },

  // Building x Floor heatmap data
  // Each building has floors 1-25, value = defect count on that floor
  buildingHeatmap: {
    '101': { floors: 25, units: 200, total: 1823,
      byFloor: [12,45,67,82,91,78,65,54,88,72,63,58,74,69,55,47,39,42,36,31,28,22,19,15,11],
      overdue: 48, avgDays: 3.2 },
    '102': { floors: 25, units: 200, total: 2104,
      byFloor: [18,52,78,95,103,88,76,67,94,85,73,66,81,75,62,54,45,48,41,35,30,25,21,17,13],
      overdue: 62, avgDays: 4.1 },
    '103': { floors: 20, units: 160, total: 1567,
      byFloor: [14,42,61,74,83,71,59,48,72,64,55,49,62,57,46,39,32,35,29,24],
      overdue: 38, avgDays: 3.5 },
    '104': { floors: 20, units: 160, total: 1432,
      byFloor: [11,38,55,68,76,65,53,44,66,58,50,45,57,52,42,36,29,32,27,22],
      overdue: 35, avgDays: 3.3 },
    '105': { floors: 25, units: 200, total: 1891,
      byFloor: [15,48,71,86,96,82,69,58,85,76,66,60,76,70,58,50,42,45,38,33,29,24,20,16,12],
      overdue: 52, avgDays: 3.9 },
    '106': { floors: 15, units: 120, total: 1203,
      byFloor: [22,58,84,98,107,92,78,66,89,81,72,64,79,73,40],
      overdue: 31, avgDays: 3.0 },
    '107': { floors: 15, units: 100, total: 987,
      byFloor: [18,47,68,81,89,77,64,54,73,66,57,51,64,59,19],
      overdue: 28, avgDays: 3.6 },
    '108': { floors: 15, units: 100, total: 840,
      byFloor: [15,40,58,69,76,66,55,46,62,56,49,44,55,51,18],
      overdue: 21, avgDays: 2.8 },
  },

  // Work type distribution (10K scale)
  workTypeCounts: {
    '도장': 3241, '미장': 2187, '타일': 1654, '설비(급배수)': 1123,
    '전기': 987, '창호': 876, '설비(난방)': 743, '방수': 621,
    '가구(싱크대)': 412, '석공': 387, '가구(수납장)': 298,
    '목공': 145, '잡철': 87, '유리': 52, '조경': 23, '기타': 11
  },

  // Contractor performance (10K scale)
  contractors: [
    { name: '대한도장', assigned: 1842, completed: 1523, overdue: 67, avgDays: 2.8, satisfaction: 4.2, rejectRate: 3.1, activeCrew: 12 },
    { name: '신우미장', assigned: 1456, completed: 1187, overdue: 52, avgDays: 3.4, satisfaction: 3.9, rejectRate: 4.8, activeCrew: 8 },
    { name: '동아타일', assigned: 1234, completed: 1067, overdue: 38, avgDays: 3.1, satisfaction: 4.5, rejectRate: 2.3, activeCrew: 6 },
    { name: '한솔설비', assigned: 1867, completed: 1534, overdue: 89, avgDays: 4.5, satisfaction: 3.6, rejectRate: 6.2, activeCrew: 15 },
    { name: '삼성전기공사', assigned: 987, completed: 845, overdue: 31, avgDays: 2.9, satisfaction: 4.3, rejectRate: 2.7, activeCrew: 7 },
    { name: '대림창호', assigned: 876, completed: 732, overdue: 28, avgDays: 3.7, satisfaction: 4.0, rejectRate: 3.5, activeCrew: 5 },
    { name: '한양방수', assigned: 621, completed: 534, overdue: 22, avgDays: 3.2, satisfaction: 4.1, rejectRate: 2.9, activeCrew: 4 },
    { name: '명성석공', assigned: 387, completed: 312, overdue: 15, avgDays: 3.0, satisfaction: 4.4, rejectRate: 1.8, activeCrew: 3 },
  ],

  // Weekly trend data (last 12 weeks)
  weeklyTrend: [
    { week: 'W49', registered: 312, completed: 287, cumOpen: 4521 },
    { week: 'W50', registered: 345, completed: 298, cumOpen: 4568 },
    { week: 'W51', registered: 289, completed: 312, cumOpen: 4545 },
    { week: 'W52', registered: 378, completed: 334, cumOpen: 4589 },
    { week: 'W01', registered: 401, completed: 356, cumOpen: 4634 },
    { week: 'W02', registered: 356, completed: 378, cumOpen: 4612 },
    { week: 'W03', registered: 312, completed: 401, cumOpen: 4523 },
    { week: 'W04', registered: 298, completed: 412, cumOpen: 4409 },
    { week: 'W05', registered: 287, completed: 389, cumOpen: 4307 },
    { week: 'W06', registered: 267, completed: 345, cumOpen: 4229 },
    { week: 'W07', registered: 245, completed: 312, cumOpen: 4162 },
    { week: 'W08', registered: 287, completed: 378, cumOpen: 4071 },
  ],

  // Daily trend data (last 14 days)
  dailyTrend: [
    { date: '01/17', reg: 42, comp: 38 }, { date: '01/18', reg: 38, comp: 45 },
    { date: '01/19', reg: 51, comp: 41 }, { date: '01/20', reg: 35, comp: 52 },
    { date: '01/21', reg: 44, comp: 39 }, { date: '01/22', reg: 48, comp: 56 },
    { date: '01/23', reg: 39, comp: 47 }, { date: '01/24', reg: 43, comp: 51 },
    { date: '01/25', reg: 37, comp: 44 }, { date: '01/26', reg: 52, comp: 48 },
    { date: '01/27', reg: 41, comp: 53 }, { date: '01/28', reg: 46, comp: 42 },
    { date: '01/29', reg: 38, comp: 55 }, { date: '01/30', reg: 47, comp: 49 },
  ],

  // AI Insights (anomaly detection, patterns, recommendations)
  aiInsights: [
    {
      type: 'anomaly',
      severity: 'high',
      title: '102동 8-12층 설비 누수 집중 발생',
      description: '최근 2주간 102동 8~12층 급배수 누수 하자가 평균 대비 340% 증가. 공통 배관 라인 점검 필요.',
      metric: '23건 / 2주',
      baseline: '평균 5건 / 2주',
      affectedUnits: ['801','802','901','902','1001','1002','1101','1102','1201','1202'],
      recommendedAction: '102동 8-12층 공용 배관 라인 일괄 점검 의뢰',
      detectedAt: '2026-01-30 06:00',
    },
    {
      type: 'pattern',
      severity: 'medium',
      title: '도장 기포/들뜸 하자 101동 집중',
      description: '101동 도장 기포/들뜸 유형이 전체 도장 하자의 42%를 차지. 특정 배치 자재 불량 가능성.',
      metric: '187건 (101동)',
      baseline: '전체 평균 112건/동',
      affectedUnits: null,
      recommendedAction: '101동 도장 자재 LOT 번호 확인 및 자재 시험 의뢰',
      detectedAt: '2026-01-29 06:00',
    },
    {
      type: 'bottleneck',
      severity: 'high',
      title: '한솔설비 처리 지연 심각',
      description: '한솔설비 평균 처리일 4.5일로 SLA 기준(3일) 초과. 현재 미처리 333건 적체.',
      metric: '평균 4.5일',
      baseline: 'SLA 기준 3일',
      affectedUnits: null,
      recommendedAction: '한솔설비 추가 인력 투입 요청 또는 보조 업체 배정',
      detectedAt: '2026-01-30 06:00',
    },
    {
      type: 'prediction',
      severity: 'medium',
      title: '다음 주 예상 접수: 약 260건',
      description: '최근 4주 추이 분석 결과, 접수량 감소 추세. 다음 주 예상 접수 260건 (현 주 대비 -9.4%).',
      metric: '260건 예상',
      baseline: '이번 주 287건',
      affectedUnits: null,
      recommendedAction: '시공사별 처리 가능 물량 사전 조율',
      detectedAt: '2026-01-30 06:00',
    },
    {
      type: 'quality',
      severity: 'low',
      title: 'AI 분류 정확도 하락 추이',
      description: '최근 1주 AI 분류 정확도 87.2%로 이전 주 91.4% 대비 하락. 방수/설비 구분 오류 증가.',
      metric: '87.2%',
      baseline: '목표 90% 이상',
      affectedUnits: null,
      recommendedAction: '방수/설비 분류 모델 재학습 데이터 검토',
      detectedAt: '2026-01-30 06:00',
    },
  ],

  // Priority queue - top items needing attention
  priorityQueue: [
    { id: 'PQ-001', receiptNumber: '260128-0004', building: '102', unit: '801', room: '욕실',
      workType: '설비(급배수)', severity: 4, status: 'IN_PROGRESS', daysOpen: 3,
      reason: '긴급 누수 - SLA 임박', score: 98 },
    { id: 'PQ-002', receiptNumber: '260125-0187', building: '102', unit: '1001', room: '욕실',
      workType: '설비(급배수)', severity: 4, status: 'ASSIGNED', daysOpen: 6,
      reason: 'SLA 초과 + 긴급', score: 96 },
    { id: 'PQ-003', receiptNumber: '260122-0134', building: '105', unit: '1502', room: '발코니',
      workType: '방수', severity: 3, status: 'IN_PROGRESS', daysOpen: 9,
      reason: 'SLA 초과 D+6 / 우천 예보', score: 92 },
    { id: 'PQ-004', receiptNumber: '260120-0098', building: '101', unit: '2301', room: '욕실',
      workType: '설비(급배수)', severity: 3, status: 'ASSIGNED', daysOpen: 11,
      reason: 'SLA 초과 D+8', score: 89 },
    { id: 'PQ-005', receiptNumber: '260126-0201', building: '103', unit: '1801', room: '거실',
      workType: '창호', severity: 3, status: 'IN_PROGRESS', daysOpen: 5,
      reason: '동절기 외풍 / 입주민 2차 민원', score: 87 },
    { id: 'PQ-006', receiptNumber: '260118-0067', building: '102', unit: '901', room: '욕실',
      workType: '설비(급배수)', severity: 4, status: 'REJECTED', daysOpen: 13,
      reason: '반려 후 미재배정 D+5', score: 95 },
    { id: 'PQ-007', receiptNumber: '260124-0156', building: '106', unit: '1201', room: '안방',
      workType: '도장', severity: 2, status: 'IN_PROGRESS', daysOpen: 7,
      reason: 'SLA 초과 D+4 / 반복 하자', score: 78 },
    { id: 'PQ-008', receiptNumber: '260127-0189', building: '104', unit: '501', room: '주방',
      workType: '타일', severity: 2, status: 'ASSIGNED', daysOpen: 4,
      reason: 'SLA 임박 (내일 만료)', score: 75 },
  ],

  // AI classification accuracy by work type
  aiAccuracy: {
    '도장': 93.2, '미장': 89.7, '타일': 94.1, '설비(급배수)': 86.3,
    '전기': 91.8, '창호': 90.5, '설비(난방)': 84.2, '방수': 82.7,
    '가구(싱크대)': 88.4, '석공': 92.1, '가구(수납장)': 87.9,
    overall: 89.4, lastWeek: 91.2, target: 90.0
  },

  // Processing pipeline funnel
  pipeline: {
    unassigned: 1243 + 892,  // PENDING + RECEIVED
    assigned: 1567,
    inProgress: 2134,
    awaitingVerification: 4231,  // COMPLETED but not verified
    verified: 1842,
    rejected: 487,
  },

  // Overdue breakdown by severity
  overdueBreakdown: {
    bySeverity: { 4: 23, 3: 89, 2: 156, 1: 74 },
    byDays: { '1-3': 142, '4-7': 108, '8-14': 62, '15+': 30 },
    byContractor: {
      '한솔설비': 89, '신우미장': 52, '대한도장': 67, '동아타일': 38,
      '대림창호': 28, '삼성전기공사': 31, '한양방수': 22, '명성석공': 15
    }
  }
};

// Initialize current project
MOCK.currentProject = MOCK.projects[0];
