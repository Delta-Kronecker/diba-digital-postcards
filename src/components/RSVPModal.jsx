import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, User, Users, MessageSquare, Send, Calendar } from 'lucide-react';

export default function RSVPModal({
  isOpen = false,
  onClose = () => {},
  eventSlug = 'wedding-amir-sara',
  eventTitle = 'جشن پیوند امیر و سارا',
  category = 'wedding',
  accentColor = '#B49A70',
  hasGold = true
}) {
  const [fullName, setFullName] = useState('');
  const [attending, setAttending] = useState('yes'); // 'yes' or 'no'
  const [guestCount, setGuestCount] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Check if RSVP was already saved in localStorage
  useEffect(() => {
    if (isOpen) {
      const savedData = localStorage.getItem(`ponisha_rsvp_${eventSlug}`);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setFullName(parsed.fullName || '');
          setAttending(parsed.attending || 'yes');
          setGuestCount(parsed.guestCount || 1);
          setNotes(parsed.notes || '');
          setSubmitted(true);
        } catch (e) {}
      } else {
        setSubmitted(false);
      }
    }
  }, [isOpen, eventSlug]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('لطفاً نام و نام خانوادگی خود را وارد کنید.');
      return;
    }

    const payload = {
      fullName: fullName.trim(),
      attending,
      guestCount,
      notes: notes.trim(),
      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem(`ponisha_rsvp_${eventSlug}`, JSON.stringify(payload));
    setError('');
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
  };

  const isMemorial = category === 'memorial';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden glass-panel border border-amber-500/30 text-stone-900"
        style={{
          background: 'rgba(246, 241, 233, 0.94)'
        }}
      >
        {/* Top Decorative Line */}
        <div 
          className="h-1 w-full absolute top-0 left-0 right-0 bg-gold-foil"
          style={{
            background: hasGold
              ? 'linear-gradient(135deg, #B49A70 0%, #E6D5B8 50%, #B49A70 100%)'
              : accentColor
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full hover:bg-stone-200/60 text-stone-600 transition-colors"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-widest text-stone-500 font-vazir block mb-1">
            {isMemorial ? 'تأیید حضور و پیام تسلیت' : 'اعلام حضور و پاسخ (RSVP)'}
          </span>
          <h3 className="text-2xl font-bold font-estedad text-stone-800">
            {eventTitle}
          </h3>
        </div>

        {submitted ? (
          /* Confirmation View */
          <div className="text-center py-6 animate-in zoom-in-95 duration-400">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold font-estedad text-stone-800 mb-2">
              پاسخ شما با موفقیت ثبت گردید
            </h4>
            <p className="text-sm font-vazir text-stone-600 mb-6 leading-relaxed">
              با تشکر از {fullName} عزیز؛ پاسخ شما در حافظه دستگاه ذخیره شد و میزبان مطلع خواهد گردید.
            </p>
            <div className="p-4 bg-stone-100/80 rounded-2xl border border-stone-300/50 text-right text-xs font-vazir text-stone-700 mb-6 space-y-2">
              <div><strong className="text-stone-900">وضعیت حضور:</strong> {attending === 'yes' ? 'با کمال میل افتخار حضور خواهم داشت' : 'متأسفانه امکان حضور ندارم'}</div>
              {attending === 'yes' && <div><strong className="text-stone-900">تعداد همراهان:</strong> {guestCount} نفر</div>}
              {notes && <div><strong className="text-stone-900">یادداشت / پیام:</strong> {notes}</div>}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-vazir font-medium hover:bg-stone-200/50 transition-colors"
              >
                ویرایش پاسخ
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-xs font-vazir font-medium text-stone-950 shadow-md transition-transform active:scale-95"
                style={{
                  background: hasGold ? 'linear-gradient(135deg, #B49A70 0%, #E6D5B8 100%)' : accentColor,
                  color: hasGold ? '#25231F' : '#FFF'
                }}
              >
                تأیید و بستن
              </button>
            </div>
          </div>
        ) : (
          /* RSVP Form View */
          <form onSubmit={handleSubmit} className="space-y-4 text-right">
            {error && (
              <div className="p-3 rounded-xl bg-rose-100/80 border border-rose-300 text-rose-800 text-xs font-vazir">
                {error}
              </div>
            )}

            {/* Full Name Input */}
            <div>
              <label className="block text-xs font-vazir font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-700" />
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: علی رضایی"
                className="w-full px-4 py-3 rounded-xl border border-stone-300/80 bg-stone-50/70 text-stone-800 text-sm font-vazir focus:outline-none focus:ring-2 focus:ring-amber-600/40"
              />
            </div>

            {/* Attendance Radio Buttons */}
            <div>
              <label className="block text-xs font-vazir font-medium text-stone-700 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                آیا در این مراسم شرکت خواهید کرد؟
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttending('yes')}
                  className={`p-3 rounded-xl border text-xs font-vazir font-medium flex items-center justify-center gap-2 transition-all ${
                    attending === 'yes'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-sm'
                      : 'border-stone-300 bg-stone-50 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full border ${attending === 'yes' ? 'bg-amber-600 border-amber-600' : 'border-stone-400'}`} />
                  با کمال میل شرکت می‌کنم
                </button>

                <button
                  type="button"
                  onClick={() => setAttending('no')}
                  className={`p-3 rounded-xl border text-xs font-vazir font-medium flex items-center justify-center gap-2 transition-all ${
                    attending === 'no'
                      ? 'border-stone-600 bg-stone-200 text-stone-900 shadow-sm'
                      : 'border-stone-300 bg-stone-50 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full border ${attending === 'no' ? 'bg-stone-600 border-stone-600' : 'border-stone-400'}`} />
                  متأسفانه سعادت حضور ندارم
                </button>
              </div>
            </div>

            {/* Guest Count (If Attending) */}
            {attending === 'yes' && (
              <div className="animate-in fade-in duration-300">
                <label className="block text-xs font-vazir font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-700" />
                  تعداد نفرات همراه
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300/80 bg-stone-50/70 text-stone-800 text-sm font-vazir focus:outline-none focus:ring-2 focus:ring-amber-600/40"
                >
                  <option value={1}>۱ نفر (فقط خودم)</option>
                  <option value={2}>۲ نفر (همراه)</option>
                  <option value={3}>۳ نفر</option>
                  <option value={4}>۴ نفر</option>
                  <option value={5}>۵ نفر یا بیشتر</option>
                </select>
              </div>
            )}

            {/* Notes / Message */}
            <div>
              <label className="block text-xs font-vazir font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                {isMemorial ? 'پیام تسلیت یا متنی برای خانواده' : 'پیام تبریک یا توصیحات تکمیلی'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder={isMemorial ? 'تسلیت صمیمانه خود را بنویسید...' : 'تبریک یا هرگونه پیام دلخواه...'}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300/80 bg-stone-50/70 text-stone-800 text-sm font-vazir focus:outline-none focus:ring-2 focus:ring-amber-600/40"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-vazir font-medium text-sm text-amber-950 flex items-center justify-center gap-2 shadow-lg hover:brightness-105 active:scale-95 transition-all"
                style={{
                  background: hasGold
                    ? 'linear-gradient(135deg, #B49A70 0%, #E6D5B8 50%, #B49A70 100%)'
                    : accentColor,
                  color: hasGold ? '#25231F' : '#FFF'
                }}
              >
                <Send className="w-4 h-4" />
                ثبت نهایی پاسخ
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
