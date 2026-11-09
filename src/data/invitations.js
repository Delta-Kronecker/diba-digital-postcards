export const INVITATIONS_DATA = {
  'wedding-amir-sara': {
    slug: 'wedding-amir-sara',
    category: 'wedding',
    categoryTitle: 'دعوت‌نامه عروسی و عقد',
    title: 'جشن پیوند امیر و سارا',
    subtitle: 'به نام پروردگار عشق و زیبایی',
    hostNames: 'امیرحسین و سارا',
    groomName: 'امیرحسین',
    brideName: 'سارا',
    parents: 'خانواده‌های رضایی و طباطبایی',
    datePersian: 'جمعه ۲۸ خرداد ۱۴۰۶ - ساعت ۱۹:۰۰',
    targetDate: '2027-06-18T19:00:00',
    venue: 'تالار مجلل اسپیناس پالاس',
    address: 'تهران، سعادت‌آباد، انتهای بلوار پیام، تالار گراند هال اسپیناس',
    coordinates: { lat: 35.7924, lng: 51.3653 },
    poem: 'در زلال شب چشمان تو بیدار شدم / با تو از ظلمت خاموش رها گشتم و بیدار شدم',
    coverImage: `${import.meta.env.BASE_URL}images/wedding-cover.jpg`,
    images: [
      { id: '1', url: `${import.meta.env.BASE_URL}images/wedding-cover.jpg`, title: 'پرتره زوج' },
      { id: '2', url: `${import.meta.env.BASE_URL}images/wedding-hall.jpg`, title: 'فضای تالار' },
      { id: '3', url: `${import.meta.env.BASE_URL}images/wedding-flowers.jpg`, title: 'گل‌آرایی اختصاصی' },
    ],
    audioTrack: { title: 'Valz-e Eshgh (والس عشق)', type: 'synth-romantic' },
    theme: {
      accentColor: '#B49A70',
      dustyRose: '#A77D80',
      canvas: '#F6F1E9',
      hasGold: true,
      sealText: 'A & S',
    }
  },

  'memorial-haj-reza': {
    slug: 'memorial-haj-reza',
    category: 'memorial',
    categoryTitle: 'یادبود و ترحیم',
    title: 'مراسم یادبود زنده‌یاد حاج رضا تهرانی',
    subtitle: 'انالله و انا الیه راجعون',
    deceasedName: 'زنده‌یاد حاج رضا تهرانی',
    family: 'خانواده‌های تهرانی، شریفی و وابستگان',
    datePersian: 'پنج‌شنبه ۳۰ اردیبهشت ۱۴۰۶ - ساعت ۱۵:۰۰ الی ۱۷:۰۰',
    targetDate: '2027-05-20T15:00:00',
    venue: 'مسجد جامع شهرک غرب',
    address: 'تهران، شهرک غرب، خیابان ایران‌زمین، مسجد جامع شهرک غرب',
    poem: 'ای رفته ز دل، رفتن تو زود بود / رفتی و دل ما به غم آلود بود',
    coverImage: `${import.meta.env.BASE_URL}images/memorial-cover.jpg`,
    images: [
      { id: '1', url: `${import.meta.env.BASE_URL}images/memorial-cover.jpg`, title: 'یادبود' },
      { id: '2', url: `${import.meta.env.BASE_URL}images/memorial-candle.jpg`, title: 'نور و یاد' },
    ],
    audioTrack: { title: 'Ney & Ambient Reverie', type: 'synth-soothing' },
    theme: {
      accentColor: '#687567', // Sage green zero gold
      canvas: '#F6F1E9',
      hasGold: false, // ZERO GOLD MANDATE
      sealText: 'یادبود',
    }
  },

  'general-gallery-opening': {
    slug: 'general-gallery-opening',
    category: 'general',
    categoryTitle: 'نمایشگاه و گالری هنر',
    title: 'افتتاحیه نمایشگاه معماری ایرانی-مدرن',
    subtitle: 'بازخوانی خطوط و فرم‌های اصیل در معماری معاصر',
    hostNames: 'گالری نياوران و انجمن معماران',
    datePersian: 'شنبه ۱۹ تیر ۱۴۰۶ - ساعت ۱۷:۰۰',
    targetDate: '2027-07-10T17:00:00',
    venue: 'فرهنگسرای نیاوران - گالری شماره ۱',
    address: 'تهران، خیابان پاسداران، مقابل پارک نیاوران',
    poem: 'هنر بازتاب روح زیبایی‌پسند انسان در آینه زمان است.',
    coverImage: `${import.meta.env.BASE_URL}images/general-cover.jpg`,
    images: [
      { id: '1', url: `${import.meta.env.BASE_URL}images/general-cover.jpg`, title: 'طراحی پوستر' },
      { id: '2', url: `${import.meta.env.BASE_URL}images/general-arch.jpg`, title: 'آرک معماری' },
    ],
    audioTrack: { title: 'Classical Piano Ambient', type: 'synth-classical' },
    theme: {
      accentColor: '#B49A70',
      canvas: '#F6F1E9',
      hasGold: true,
      sealText: 'ART',
    }
  },

  'opening-tech-hub': {
    slug: 'opening-tech-hub',
    category: 'opening',
    categoryTitle: 'رویداد رسمی افتتاحیه',
    title: 'افتتاح مرکز فناوری و نوآوری تک‌هاب',
    subtitle: 'آغاز عصری نو در هوش مصنوعی و طراحی محصول',
    hostNames: 'گروه صنعتی و سرمایه‌گذاری تک‌هاب',
    datePersian: 'یکشنبه ۲۴ مرداد ۱۴۰۶ - ساعت ۱۰:۰۰',
    targetDate: '2027-08-15T10:00:00',
    venue: 'سالن همایش‌های بین‌المللی برج میلاد',
    address: 'تهران، بزرگراه همت غرب، مرکز همایش‌های برج میلاد، سالن حافظ',
    poem: 'نوآوری، ساختن آینده‌ای شایسته شأن و اندیشه انسان است.',
    coverImage: `${import.meta.env.BASE_URL}images/opening-cover.jpg`,
    images: [
      { id: '1', url: `${import.meta.env.BASE_URL}images/opening-cover.jpg`, title: 'نمای اصلی' },
      { id: '2', url: `${import.meta.env.BASE_URL}images/opening-venue.jpg`, title: 'سالن اصلی' },
    ],
    audioTrack: { title: 'Corporate Synth Luxury', type: 'synth-modern' },
    theme: {
      accentColor: '#B49A70',
      canvas: '#F6F1E9',
      hasGold: true,
      sealText: 'TECH',
    }
  },

  'festival-nowruz-1404': {
    slug: 'festival-nowruz-1404',
    category: 'festival',
    categoryTitle: 'جشن‌ها و مناسبت‌های ملی',
    title: 'همایش و گردهمایی بزرگ نوروز ۱۴۰۶',
    subtitle: 'گشت گرداگرد مهر گیتی‌افروز، روز نو آمد و نو گشت روز',
    hostNames: 'میزبانی آکادمی فرهنگی و هنری دیبا',
    datePersian: 'یکشنبه ۱ فروردین ۱۴۰۶ - ساعت ۱۸:۰۰',
    targetDate: '2027-03-21T18:00:00',
    venue: 'مجموعه هتل رویال پارک',
    address: 'تهران، خیابان فرشته، سالن مروارید رویال',
    poem: 'برآمد باد صبح و بوی نوروز / به کام دوستداران و بهروز',
    coverImage: `${import.meta.env.BASE_URL}images/festival-cover.jpg`,
    images: [
      { id: '1', url: `${import.meta.env.BASE_URL}images/festival-cover.jpg`, title: 'جشن نوروز' },
      { id: '2', url: `${import.meta.env.BASE_URL}images/festival-lights.jpg`, title: 'نورپردازی جشن' },
    ],
    audioTrack: { title: 'Traditional Festive Chill', type: 'synth-festive' },
    theme: {
      accentColor: '#A77D80',
      canvas: '#F6F1E9',
      hasGold: true,
      sealText: '۱۴۰۶',
    }
  },

  'birthday-aria-10': {
    slug: 'birthday-aria-10',
    category: 'birthday',
    categoryTitle: 'جشن تولد اختصاصی',
    title: 'جشن ۱۰ سالگی آریا',
    subtitle: 'یک روز پر از شادی، بازی و خاطره‌های ماندگار',
    hostNames: 'پدر و مادر آریا',
    datePersian: 'جمعه ۵ آذر ۱۴۰۶ - ساعت ۱۶:۰۰ الی ۲۰:۰۰',
    targetDate: '2027-11-26T16:00:00',
    venue: 'سالن اختصاصی واندرلند VIP',
    address: 'تهران، میدان ونک، خیابان ملاصدرا، پلاک ۴۵',
    poem: 'قدم‌های کوچکت روشنی‌بخش خانه ماست؛ زادروزت خجسته باد آریا جان',
    coverImage: `${import.meta.env.BASE_URL}images/birthday-cover.jpg`,
    images: [
      { id: '1', url: `${import.meta.env.BASE_URL}images/birthday-cover.jpg`, title: 'کاور تولد' },
      { id: '2', url: `${import.meta.env.BASE_URL}images/birthday-cake.jpg`, title: 'کیک تولد' },
    ],
    audioTrack: { title: 'Upbeat Celebration Chimes', type: 'synth-happy' },
    theme: {
      accentColor: '#A77D80',
      canvas: '#F6F1E9',
      hasGold: true,
      sealText: 'ARIA',
    }
  }
};
