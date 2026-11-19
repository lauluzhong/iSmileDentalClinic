/**
 * Malay (ms) and Simplified Chinese (zh) versions of three English pages:
 * the Damansara Jaya location page, a services summary, and the common
 * questions page. Each language has its own URL so search engines index it as
 * a separate page (see INTL_ROUTES and scripts/prerender-home.js).
 *
 * Translation rules (19 Nov 2026): translate the meaning of the English page,
 * add no claims, no prices, no named dentists, no em dashes, no emergency or
 * after-hours claims. Clinic name, street address and phone stay as written.
 * Every softened sentence is listed in the PR description for a native read.
 *
 * In answers, the phone number written as PHONE_TEXT is turned into a
 * tappable tel: link and "WhatsApp" into a wa.me link by IntlText.
 */

export const SITE = 'https://ismile.com.my';
export const PHONE_TEXT = '016-322 2135';
export const TEL = 'tel:+60163222135';
export const WA = 'https://wa.me/60163222135';

export const CLINIC = {
  name: 'iSmile Dental Clinic',
  street: '75 & 75A, Jalan SS 22/23, Damansara Jaya',
  locality: 'Petaling Jaya',
  region: 'Selangor',
  postcode: '47400',
  country: 'MY',
  telephone: '+60163222135',
  lat: '3.1258343',
  lng: '101.6162338',
};

export const MAPS_URL = 'https://www.google.com/maps/dir/?api=1&destination=iSmile%20Dental%20Clinic%2C%2075%20Jalan%20SS%2022%2F23%2C%20Damansara%20Jaya&destination_place_id=ChIJMyz-_jZJzDERBTVNqS_uGzg';
export const WAZE_URL = 'https://ul.waze.com/ul?place=ChIJMyz-_jZJzDERBTVNqS_uGzg&ll=3.12583430%2C101.61623380&navigate=yes';

export { PAGE_PATHS, HTML_LANG, LANG_LABEL, INTL_ROUTES } from './intlRoutes.jsx';

// Service rows: [English page to link to, ms name, ms line, zh name, zh line].
// Items without their own English page link to their category page.
const SERVICE_GROUPS = [
  {
    to: '/services/protect',
    ms: 'Jaga dan baiki gigi', zh: '保护与修复', msLine: 'Pencegahan dan pemulihan', zhLine: '预防与修复',
    items: [
      ['/services/protect', 'Pemeriksaan gigi', 'Pemeriksaan menyeluruh supaya doktor gigi dapat tahu keadaan gigi dan merancang rawatan.', '牙齿检查', '全面检查口腔，让牙医了解情况并安排治疗。'],
      ['/services/protect', 'Cuci gigi (scaling dan polishing)', 'Membersihkan plak, karang gigi dan kesan kotoran pada gigi.', '洗牙', '清除牙菌斑、牙石和牙齿表面的污渍。'],
      ['/services/protect', 'Tampal gigi', 'Menampal gigi berlubang dengan bahan sewarna gigi.', '补牙', '用和牙齿颜色相近的材料修补蛀牙。'],
      ['/services/protect/root-canal', 'Rawatan akar gigi (root canal)', 'Membuang tisu pulpa yang rosak dan menutup saluran akar untuk membantu mengekalkan gigi yang dijangkiti.', '根管治疗', '清除受损的牙髓并封闭根管，尽量保住受感染的牙齿。'],
      ['/services/protect/wisdom-tooth', 'Cabut gigi bongsu', 'Membuang gigi bongsu yang terselit, diterangkan langkah demi langkah sebelum bermula.', '智齿拔除', '拔除阻生智齿，开始前会一步一步向您解释。'],
    ],
  },
  {
    to: '/services/straighten',
    ms: 'Luruskan gigi', zh: '矫正牙齿', msLine: 'Ortodontik', zhLine: '正畸',
    items: [
      ['/services/straighten/clear-aligners', 'Pendakap gigi lutsinar (clear aligners)', 'Tray lutsinar yang boleh ditanggal, seperti Invisalign, Angel Aligner dan ClearSmile.', '隐形牙套', '可拆卸的透明牙套，例如 Invisalign、Angel Aligner 和 ClearSmile。'],
      ['/services/straighten', 'Pendakap gigi (besi dan lutsinar)', 'Braces tetap dengan bracket besi atau bracket lutsinar.', '牙套（金属和透明托槽）', '固定式牙套，有金属托槽和透明托槽。'],
      ['/services/straighten', 'Alat boleh tanggal', 'Alat untuk pergerakan gigi kecil dan membantu tumbesaran, digunakan pada peringkat awal.', '活动矫正器', '用于轻微牙齿移动和生长引导的早期矫正器。'],
      ['/services/straighten', 'Retainer', 'Alat yang dibuat khas untuk mengekalkan kedudukan gigi selepas rawatan.', '保持器', '量身定做，在矫正后帮助牙齿保持位置。'],
    ],
  },
  {
    to: '/services/replace',
    ms: 'Ganti gigi yang hilang', zh: '修复缺牙', msLine: 'Prostetik dan implan', zhLine: '假牙与种植牙',
    items: [
      ['/services/replace/dental-implants', 'Implan gigi', 'Pengganti akar gigi yang hilang, dengan rupa yang semula jadi.', '种植牙', '替代缺失的牙根，外观自然。'],
      ['/services/replace', 'Bridge gigi', 'Gigi palsu tetap untuk menutup ruang satu atau lebih gigi yang hilang.', '牙桥', '固定式修复，填补一颗或多颗缺牙的空隙。'],
      ['/services/replace', 'Gigi palsu penuh', 'Pengganti semua gigi yang hilang, untuk mengunyah dan rupa.', '全口假牙', '替代全部缺失的牙齿，恢复咀嚼和外观。'],
      ['/services/replace', 'Gigi palsu separa', 'Gigi palsu boleh tanggal untuk menggantikan beberapa gigi.', '局部假牙', '可拆卸，用来替代几颗缺失的牙齿。'],
      ['/services/replace', 'Baiki dan lapik semula gigi palsu', 'Supaya gigi palsu muat dengan selesa.', '假牙修理与重衬', '让假牙戴起来更贴合舒适。'],
    ],
  },
  {
    to: '/services/enhance',
    ms: 'Cantikkan senyuman', zh: '美化笑容', msLine: 'Pergigian kosmetik', zhLine: '美容牙科',
    items: [
      ['/services/enhance/cosmetic-dentistry', 'Venir komposit', 'Membentuk semula gigi untuk memperbaiki bentuk dan rupa.', '树脂贴面', '直接在牙齿上塑形，改善外观。'],
      ['/services/enhance/cosmetic-dentistry', 'Venir seramik', 'Lapisan porselin nipis yang tahan lama.', '陶瓷贴面', '耐用的薄瓷贴片。'],
      ['/services/enhance/teeth-whitening', 'Pemutihan gigi di rumah', 'Tray yang dibuat khas dan gel profesional untuk digunakan di rumah.', '居家美白', '量身定做的牙托配合专业美白凝胶，在家使用。'],
      ['/services/enhance/teeth-whitening', 'Pemutihan gigi di klinik', 'Pemutihan di klinik apabila anda mahu hasil lebih cepat.', '诊所美白', '在诊所进行，适合想更快看到效果的人。'],
      ['/services/enhance', 'Crown seramik', 'Untuk gigi yang rosak teruk atau untuk memperbaiki rupa.', '全瓷牙冠', '适合严重受损或需要改善外观的牙齿。'],
      ['/services/enhance', 'Pemulihan seluruh mulut', 'Memulihkan gigi yang haus untuk fungsi, kesihatan dan rupa.', '全口重建', '修复磨损的牙齿，改善功能、健康和外观。'],
    ],
  },
  {
    to: '/services/children',
    ms: 'Kanak-kanak dan tumbesaran', zh: '儿童与成长', msLine: 'Pergigian kanak-kanak', zhLine: '儿童牙科',
    items: [
      ['/services/children/pediatric-dentistry', 'Rawatan gigi kanak-kanak', 'Pemeriksaan, cuci gigi dan nasihat penjagaan gigi untuk anak-anak.', '儿童牙科', '为孩子做检查、洗牙和口腔护理指导。'],
      ['/services/children/myofunctional', 'Ortodontik miofungsian', 'Membetulkan tabiat mulut untuk membantu tumbesaran rahang dan muka.', '肌功能矫正', '纠正口腔习惯，帮助引导颌骨和面部生长。'],
      ['/services/children', 'Fissure sealant', 'Salutan pelindung pada gigi belakang untuk mengelakkan gigi berlubang di alur gigi.', '窝沟封闭', '在后牙表面涂上保护层，预防沟槽蛀牙。'],
      ['/services/children', 'Fluorida', 'Menguatkan enamel supaya gigi lebih tahan daripada berlubang.', '涂氟', '强化牙釉质，让牙齿更不容易蛀。'],
      ['/services/children', 'Tampal gigi susu', 'Rawatan tampal gigi susu secara lembut.', '乳牙补牙', '温和地修补乳牙。'],
      ['/services/children', 'Cabut gigi susu', 'Membuang gigi susu yang tidak tertanggal supaya gigi kekal boleh tumbuh.', '拔乳牙', '拔除迟迟不掉的乳牙，让恒牙顺利长出。'],
    ],
  },
];

const servicesFor = (lang) => SERVICE_GROUPS.map((g) => ({
  title: g[lang],
  line: g[lang + 'Line'],
  to: g.to,
  items: g.items.map(([to, msN, msD, zhN, zhD]) => ({ to, name: lang === 'ms' ? msN : zhN, desc: lang === 'ms' ? msD : zhD })),
}));

const ms = {
  switchLabel: 'Bahasa',
  hours: [
    ['Isnin hingga Jumaat', '9:30 pagi hingga 5:30 petang'],
    ['Sabtu', '9:30 pagi hingga 3:30 petang'],
    ['Ahad dan cuti umum', 'Tutup'],
  ],
  addressLines: ['75 & 75A, Jalan SS 22/23', 'Damansara Jaya, 47400 Petaling Jaya', 'Selangor, Malaysia'],
  contact: { call: 'Telefon', whatsapp: 'WhatsApp', phoneLine: 'Telefon atau WhatsApp', orCall: 'Atau telefon kami di' },
  location: {
    eyebrows: { services: 'Rawatan untuk semua umur', visit: 'Di klinik', faq: 'Jawapan ringkas', closing: 'Mula di sini' },
    title: 'Klinik Gigi di Damansara Jaya, PJ | iSmile Dental Clinic',
    description: 'Klinik gigi keluarga di Jalan SS 22/23, Damansara Jaya, dekat Atria. Pemeriksaan, cuci gigi, pendakap gigi dan rawatan gigi kanak-kanak. WhatsApp untuk temu janji.',
    h1: ['Klinik gigi keluarga anda di ', 'Damansara Jaya'],
    intro: 'Rawatan gigi yang lembut untuk kanak-kanak, orang dewasa dan warga emas, di Jalan SS 22/23, Damansara Jaya. Kami utamakan keselesaan anda dan kesihatan gigi untuk jangka panjang.',
    aboutTitle: ['Tentang klinik kami di ', 'Damansara Jaya'],
    about: 'Dari klinik kami di Damansara Jaya, kami merawat keluarga di seluruh Petaling Jaya, daripada pemeriksaan biasa hingga rawatan pemulihan dan kosmetik. Kami guna peralatan moden seperti X-ray digital dan pengimbas mulut, dan kami terangkan setiap pilihan dengan jelas.',
    highlights: [
      ['Peralatan moden', 'X-ray digital, pengimbas 3D dan pensterilan'],
      ['Mesra keluarga', 'Suasana yang selesa untuk semua peringkat umur'],
      ['Penerangan yang jelas', 'Kami terangkan setiap pilihan rawatan supaya anda boleh buat keputusan dengan yakin'],
      ['Lokasi yang mudah', 'Parking khas di depan klinik, dekat Atria Damansara Jaya'],
    ],
    servicesTitle: ['Rawatan ', 'kami'],
    servicesDesc: 'Penjagaan gigi untuk seluruh keluarga. Senarai penuh ada di halaman perkhidmatan.',
    services: [
      ['/services/children', 'Rawatan gigi keluarga dan kanak-kanak', 'Pemeriksaan, cuci gigi, fluorida dan nasihat penjagaan gigi untuk setiap ahli keluarga.'],
      ['/services/straighten/clear-aligners', 'Ortodontik dan pendakap gigi lutsinar', 'Invisalign, braces dan rawatan awal untuk meluruskan gigi dan membetulkan gigitan.'],
      ['/services/enhance/cosmetic-dentistry', 'Rawatan gigi kosmetik', 'Pemutihan gigi, venir dan rawatan senyuman.'],
      ['/services/protect/wisdom-tooth', 'Cabut gigi bongsu', 'Pemeriksaan dan pembuangan gigi bongsu, diterangkan langkah demi langkah sebelum bermula.'],
      ['/services/replace/dental-implants', 'Implan gigi', 'Pengganti gigi yang hilang, dengan rupa yang semula jadi.'],
      ['/services/protect/root-canal', 'Crown, bridge dan rawatan akar gigi', 'Rawatan untuk melindungi gigi yang rosak dan menggantikan gigi yang hilang.'],
    ],
    allServices: 'Lihat semua perkhidmatan',
    visitTitle: ['Datang ke klinik kami di ', 'Damansara Jaya'],
    addressH: 'Alamat',
    hoursH: 'Waktu operasi',
    parkingH: 'Parking',
    parking: [
      'Parking khas di depan klinik',
      'Parking tambahan di Atria, jalan kaki sekejap sahaja',
      'Mudah dari Damansara Utama, SS2, Bandar Utama dan seluruh Petaling Jaya',
    ],
    mapTitle: 'Peta lokasi iSmile Dental Clinic',
    faqTitle: ['Soalan ', 'lazim'],
    faq: [
      { q: 'Di mana iSmile Dental Clinic di Damansara Jaya?', a: 'Klinik kami di 75 & 75A, Jalan SS 22/23, Damansara Jaya, 47400 Petaling Jaya. Kami dekat dengan Atria Shopping Gallery, dan ada parking khas di depan klinik.' },
      { q: 'Pukul berapa klinik dibuka?', a: 'Isnin hingga Jumaat, 9:30 pagi hingga 5:30 petang. Sabtu, 9:30 pagi hingga 3:30 petang. Tutup pada hari Ahad dan cuti umum.' },
      { q: 'Perlu buat temu janji dulu?', a: 'Ya, kami terima pesakit dengan temu janji. WhatsApp atau telefon kami dan kami akan cari masa yang sesuai untuk anda dan keluarga.' },
      { q: 'Adakah klinik terima pesakit baru?', a: 'Ya, kami alu-alukan pesakit dan keluarga baru. Telefon atau WhatsApp kami di 016-322 2135 untuk temu janji pertama anda.' },
      { q: 'Apa rawatan yang ada di klinik Damansara Jaya?', a: 'Kami sediakan rawatan gigi untuk keluarga dan semua peringkat umur, pemeriksaan dan cuci gigi, tampal gigi, rawatan kosmetik dan pemulihan, pendakap gigi, implan gigi, cabut gigi bongsu dan banyak lagi.' },
      { q: 'Macam mana nak buat temu janji?', a: 'Telefon 016-322 2135 atau hantar mesej WhatsApp. Elok buat temu janji awal untuk dapat masa yang anda mahu.' },
    ],
    closingTitle: ['Jom buat temu janji di ', 'Damansara Jaya'],
    closing: 'Hantar mesej WhatsApp kepada kami dan kami akan cari masa yang sesuai untuk anda.',
    cta: 'WhatsApp untuk temu janji',
    waText: 'Hai, saya mahu buat temu janji di klinik Damansara Jaya.',
  },
  services: {
    eyebrows: { hero: 'Perkhidmatan kami', closing: 'Sedia membantu' },
    title: 'Perkhidmatan Rawatan Gigi | iSmile Dental Clinic, Damansara Jaya',
    description: 'Senarai rawatan gigi di iSmile Dental Clinic, Damansara Jaya: cuci gigi, tampal gigi, pendakap gigi, implan, pemutihan dan rawatan gigi kanak-kanak.',
    h1: ['Rawatan gigi ', 'kami'],
    intro: 'Ini ringkasan rawatan yang kami sediakan di klinik Damansara Jaya. Setiap rawatan ada halaman penuh dalam bahasa Inggeris.',
    note: 'Halaman butiran dalam bahasa Inggeris',
    groups: servicesFor('ms'),
    closingTitle: ['Tak pasti rawatan mana yang ', 'sesuai?'],
    closing: 'Doktor gigi akan periksa dulu dan terangkan pilihan anda. Hantar mesej WhatsApp untuk temu janji.',
    cta: 'WhatsApp untuk temu janji',
  },
  faq: {
    eyebrows: { hero: 'Panduan pesakit', closing: 'Hubungi kami' },
    title: 'Soalan Lazim | iSmile Dental Clinic, Damansara Jaya',
    description: 'Jawapan kepada soalan biasa tentang parking, temu janji, bayaran, X-ray dan rawatan gigi kanak-kanak di iSmile Dental Clinic, Damansara Jaya.',
    h1: ['Soalan ', 'lazim'],
    intro: 'Kami mahu anda rasa yakin dan faham setiap langkah rawatan gigi anda bersama kami.',
    sections: [
      { category: 'Lawatan dan bayaran', questions: [
        { q: 'Di mana saya boleh parking?', a: 'Ada parking tepi jalan di sekitar klinik. Ada juga parking berbumbung di Atria Shopping Gallery, lebih kurang 1 minit berjalan kaki dari klinik.' },
        { q: 'Macam mana nak buat temu janji?', a: 'Kami terima pesakit dengan temu janji sahaja, supaya setiap pesakit dapat perhatian penuh. Telefon atau WhatsApp kami di 016-322 2135.' },
        { q: 'Boleh bayar dengan kad kredit?', a: 'Boleh. Kami terima kad kredit utama termasuk Visa dan Mastercard. Kami juga terima e-wallet dan DuitNow QR.' },
        { q: 'Bagaimana saya boleh tahu kos rawatan?', a: 'Kos rawatan bergantung pada keperluan setiap orang. Semasa konsultasi, kami akan beri pelan rawatan dan pecahan kos yang jelas sebelum anda bersetuju.' },
        { q: 'Adakah klinik sesuai untuk pengguna kerusi roda?', a: 'Ya, klinik kami di tingkat bawah dengan laluan kerusi roda. Ada juga parking khas di depan klinik untuk mereka yang perlukan, seperti pengguna kerusi roda dan warga emas.' },
      ] },
      { category: 'Penjagaan gigi', questions: [
        { q: 'Berapa kerap saya perlu jumpa doktor gigi?', a: 'Kami sarankan pemeriksaan dan cuci gigi setiap 6 bulan. Lawatan berkala membantu menjaga kesihatan gigi dan membolehkan kami nampak masalah lebih awal.' },
        { q: 'Apa perlu saya buat kalau gigi sakit, bengkak atau cedera?', a: 'Telefon atau WhatsApp kami di 016-322 2135 semasa waktu klinik. Kami akan beri nasihat tentang langkah seterusnya dan cuba cari masa untuk anda.' },
        { q: 'Selamatkah X-ray gigi?', a: 'Kami guna pengimejan digital 2D dan 3D yang memberi gambar yang jelas dengan dos radiasi yang rendah. X-ray membantu doktor gigi merancang rawatan dengan selamat dan tepat.' },
      ] },
      { category: 'Gigi kanak-kanak', questions: [
        { q: 'Bila anak perlu jumpa doktor gigi kali pertama?', a: 'Kami sarankan lawatan pertama sebelum hari jadi pertama anak, atau dalam masa enam bulan selepas gigi pertama tumbuh. Ini juga saranan Persatuan Pergigian Malaysia dan American Academy of Pediatric Dentistry. Lawatan awal membantu anak rasa selesa dan membolehkan kami mengesan perubahan ketika masih mudah diuruskan.' },
        { q: 'Boleh bawa anak-anak sekali?', a: 'Boleh. Kami klinik keluarga dan kami suka jumpa kanak-kanak. Pasukan kami akan memperkenalkan rawatan gigi kepada anak anda secara perlahan-lahan dan lembut supaya mereka rasa selesa.' },
        { q: 'Apa rawatan gigi untuk kanak-kanak?', a: 'Kami sediakan pemeriksaan, fluorida dan fissure sealant untuk mencegah gigi berlubang. Kami juga sediakan rawatan ortodontik awal dan terapi miofungsian, yang boleh membantu tumbesaran rahang.' },
      ] },
    ],
    closingTitle: ['Ada soalan ', 'lain?'],
    closing: 'Tak jumpa jawapan yang anda cari? Hubungi pasukan kami.',
    cta: 'WhatsApp kami',
  },
};

const zh = {
  switchLabel: '语言',
  hours: [
    ['星期一至星期五', '上午 9:30 至下午 5:30'],
    ['星期六', '上午 9:30 至下午 3:30'],
    ['星期日及公共假期', '休息'],
  ],
  addressLines: ['75 & 75A, Jalan SS 22/23', 'Damansara Jaya, 47400 Petaling Jaya', 'Selangor, Malaysia'],
  contact: { call: '打电话', whatsapp: 'WhatsApp', phoneLine: '电话或 WhatsApp', orCall: '或致电' },
  location: {
    eyebrows: { services: '适合各个年龄层', visit: '诊所信息', faq: '常见解答', closing: '开始预约' },
    title: '八打灵再也 Damansara Jaya 牙科诊所 | iSmile Dental Clinic',
    description: '位于 Damansara Jaya, Jalan SS 22/23 的家庭牙科诊所，靠近 Atria。提供牙齿检查、洗牙、牙套和儿童牙科。WhatsApp 预约。',
    h1: ['您在 ', 'Damansara Jaya', ' 的家庭牙医'],
    intro: '为孩子、大人和长辈提供温和的牙科护理，地点在 Damansara Jaya 的 Jalan SS 22/23。我们重视您的舒适和长远的口腔健康。',
    aboutTitle: ['关于我们位于 ', 'Damansara Jaya', ' 的诊所'],
    about: '我们位于 Damansara Jaya 的诊所为八打灵再也各地的家庭提供服务，涵盖日常检查、修复和美容治疗。我们使用数码 X 光和口内扫描仪等现代设备，并会清楚解释每一个选择。',
    highlights: [
      ['现代设备', '数码 X 光、3D 扫描仪和消毒设备'],
      ['适合全家', '让每个年龄层都感到自在的环境'],
      ['清楚说明', '我们会解释每个治疗选择，让您安心做决定'],
      ['交通方便', '诊所门前有专用停车位，靠近 Atria Damansara Jaya'],
    ],
    servicesTitle: ['我们的', '服务'],
    servicesDesc: '为全家人提供牙科护理。完整列表请看服务页面。',
    services: [
      ['/services/children', '家庭与儿童牙科', '为家里每个人做检查、洗牙、涂氟和口腔护理指导。'],
      ['/services/straighten/clear-aligners', '牙齿矫正与隐形牙套', 'Invisalign、牙套和早期矫正，让牙齿整齐并改善咬合。'],
      ['/services/enhance/cosmetic-dentistry', '美容牙科', '牙齿美白、贴面和笑容改善。'],
      ['/services/protect/wisdom-tooth', '智齿拔除', '检查和拔除智齿，开始前会一步一步向您解释。'],
      ['/services/replace/dental-implants', '种植牙', '替代缺失的牙齿，外观自然。'],
      ['/services/protect/root-canal', '牙冠、牙桥和根管治疗', '保护受损的牙齿，并替代缺失的牙齿。'],
    ],
    allServices: '查看所有服务',
    visitTitle: ['欢迎来我们 ', 'Damansara Jaya', ' 的诊所'],
    addressH: '地址',
    hoursH: '营业时间',
    parkingH: '停车',
    parking: [
      '诊所门前有专用停车位',
      'Atria 也有停车场，走路很近',
      '从 Damansara Utama、SS2、Bandar Utama 和八打灵再也各区前来都很方便',
    ],
    mapTitle: 'iSmile Dental Clinic 位置地图',
    faqTitle: ['常见', '问题'],
    faq: [
      { q: 'iSmile Dental Clinic 在 Damansara Jaya 哪里？', a: '我们的诊所在 75 & 75A, Jalan SS 22/23, Damansara Jaya, 47400 Petaling Jaya，靠近 Atria Shopping Gallery，诊所门前有专用停车位。' },
      { q: '诊所几点开门？', a: '星期一至星期五，上午 9:30 至下午 5:30；星期六，上午 9:30 至下午 3:30。星期日及公共假期休息。' },
      { q: '需要先预约吗？', a: '需要，我们采用预约制。请 WhatsApp 或打电话给我们，我们会为您和家人安排合适的时间。' },
      { q: '诊所接受新病人吗？', a: '接受，欢迎新病人和新家庭。请拨打或 WhatsApp 016-322 2135 预约第一次就诊。' },
      { q: 'Damansara Jaya 诊所提供哪些治疗？', a: '我们为全家各年龄层提供牙科护理，包括检查和洗牙、补牙、美容和修复治疗、牙齿矫正、种植牙、智齿拔除等。' },
      { q: '怎样预约？', a: '请拨打 016-322 2135 或发 WhatsApp 给我们。建议提早预约，以便安排您想要的时间。' },
    ],
    closingTitle: ['在 ', 'Damansara Jaya', ' 预约看牙'],
    closing: '发 WhatsApp 给我们，我们会为您安排合适的时间。',
    cta: 'WhatsApp 预约',
    waText: '你好，我想预约 Damansara Jaya 诊所。',
  },
  services: {
    eyebrows: { hero: '我们的服务', closing: '我们乐意协助您' },
    title: '牙科服务 | iSmile Dental Clinic, Damansara Jaya',
    description: 'iSmile Dental Clinic（Damansara Jaya）的牙科服务：洗牙、补牙、牙套、种植牙、牙齿美白和儿童牙科。',
    h1: ['我们的', '牙科服务'],
    intro: '以下是我们 Damansara Jaya 诊所提供的治疗简介。每项治疗都有英文的详细页面。',
    note: '英文详细页面',
    groups: servicesFor('zh'),
    closingTitle: ['不确定哪种治疗', '适合您？'],
    closing: '牙医会先为您检查，再解释您的选择。发 WhatsApp 给我们预约。',
    cta: 'WhatsApp 预约',
  },
  faq: {
    eyebrows: { hero: '就诊指南', closing: '联系我们' },
    title: '常见问题 | iSmile Dental Clinic, Damansara Jaya',
    description: '关于停车、预约、付款、X 光和儿童牙科的常见问题解答。iSmile Dental Clinic，Damansara Jaya。',
    h1: ['常见', '问题'],
    intro: '我们希望您对在这里看牙的每一步都感到安心和清楚。',
    sections: [
      { category: '就诊与付款', questions: [
        { q: '哪里可以停车？', a: '诊所附近有路边停车位。Atria Shopping Gallery 也有室内停车场，走到诊所大约 1 分钟。' },
        { q: '怎样预约？', a: '我们只接受预约，让每位病人都得到专心的照顾。请拨打或 WhatsApp 016-322 2135。' },
        { q: '可以刷信用卡吗？', a: '可以。我们接受 Visa 和 Mastercard 等主要信用卡，也接受电子钱包和 DuitNow QR。' },
        { q: '怎样知道治疗费用？', a: '费用取决于每个人的需要。咨询时，我们会给您治疗计划和清楚的费用明细，您同意后才开始。' },
        { q: '诊所方便轮椅进出吗？', a: '方便。诊所在底楼，轮椅可以进出。诊所门前也有专用停车位，方便轮椅使用者和年长病人。' },
      ] },
      { category: '日常牙齿护理', questions: [
        { q: '多久要看一次牙医？', a: '我们建议每 6 个月做一次检查和洗牙。定期检查有助保持口腔健康，也让我们能及早发现问题。' },
        { q: '牙痛、肿或牙齿受伤怎么办？', a: '请在诊所营业时间内拨打或 WhatsApp 016-322 2135。我们会告诉您下一步怎么做，并尽量为您安排时间。' },
        { q: '牙科 X 光安全吗？', a: '我们使用数码 2D 和 3D 影像，画面清晰，辐射剂量低。X 光帮助牙医安全、准确地安排治疗。' },
      ] },
      { category: '儿童牙齿护理', questions: [
        { q: '孩子几岁要第一次看牙医？', a: '我们建议在孩子一岁生日前，或第一颗牙长出后六个月内第一次看牙医。马来西亚牙科协会和美国儿童牙科学会也是这样建议的。早点来能让孩子感到自在，也让我们在问题还简单时就发现变化。' },
        { q: '可以带孩子一起来吗？', a: '当然可以。我们是家庭诊所，很欢迎小朋友。我们的团队会一步一步、温和地带孩子认识看牙，让他们感到舒服。' },
        { q: '有哪些儿童牙科服务？', a: '我们提供检查、涂氟和窝沟封闭来预防蛀牙，也提供早期矫正和肌功能治疗，可以帮助引导颌骨生长。' },
      ] },
    ],
    closingTitle: ['还有', '问题吗？'],
    closing: '找不到您要的答案？欢迎联系我们的团队。',
    cta: 'WhatsApp 我们',
  },
};

export const CONTENT = { ms, zh };
