import React, { useState } from 'react';
import { ArrowUpLeft, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { toPersianDigits } from '../utils/numbers';

const COLLECTIONS = [
  ['wedding-amir-sara', 'عروسی و عقد'],
  ['memorial-haj-reza', 'ترحیم و یادبود'],
  ['general-gallery-opening', 'نمایشگاه و عمومی'],
  ['opening-tech-hub', 'افتتاحیهٔ تجاری'],
  ['festival-nowruz-1404', 'جشن‌ها و مناسبت‌ها'],
  ['birthday-aria-10', 'تولد و جشن اختصاصی'],
];

const STUDIO = [
  ['home', 'دربارهٔ آتلیه'],
  ['customizer', 'استودیو طراحی'],
  ['gallery', 'نمایشگاه نمونه‌ها'],
  ['wedding-amir-sara', 'تجربهٔ گشودن پاکت'],
];

export default function Footer({ onNavigate = () => {} }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const year = toPersianDigits(new Date().getFullYear() + 621);

  return (
    <footer className="bg-ink-band text-cream safe-b">
      <div className="shell pt-16 md:pt-20">
        <div className="grid grid-cols-1 gap-12 border-b border-cream/12 pb-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center border border-gold/50">
                <span className="font-display text-lg text-gold">د</span>
              </span>
              <div>
                <p className="font-display text-2xl font-semibold leading-none">دیبا</p>
                <p lang="en" className="latin mt-1 text-xs text-cream/60">Diba Atelier</p>
              </div>
            </div>

            <p className="mt-6 max-w-sm text-xs leading-[2.1] text-cream/65">
              آتلیهٔ دعوت دیجیتال؛ طراحی کارت‌پستال و دعوت‌نامه‌های فاخر با
              تایپوگرافی فارسی، مهر موم و تجربهٔ گشودن پاکت.
            </p>

            <div className="mt-8 flex items-center gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex size-9 items-center justify-center border border-cream/15 text-cream/60 transition-colors after:absolute after:-inset-1 after:content-[''] hover:border-gold hover:text-gold"
                aria-label="اینستاگرام دیبا"
              >
                <Instagram className="size-4" aria-hidden="true" />
              </a>
              <a
                href="mailto:hello@diba.studio"
                className="relative flex size-9 items-center justify-center border border-cream/15 text-cream/60 transition-colors after:absolute after:-inset-1 after:content-[''] hover:border-gold hover:text-gold"
                aria-label="ایمیل دیبا"
              >
                <Mail className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <nav aria-label="مجموعه‌ها" className="md:col-span-3">
            <h2 lang="en" className="latin mb-5 text-xs text-gold-soft/90">Collections</h2>
            <ul className="space-y-3">
              {COLLECTIONS.map(([id, label]) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(id)}
                    className="block w-full py-1.5 -my-1.5 text-start text-xs text-cream/60 transition-colors hover:text-cream"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="آتلیه" className="md:col-span-2">
            <h2 lang="en" className="latin mb-5 text-xs text-gold-soft/90">Atelier</h2>
            <ul className="space-y-3">
              {STUDIO.map(([id, label]) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(id)}
                    className="block w-full py-1.5 -my-1.5 text-start text-xs text-cream/60 transition-colors hover:text-cream"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <h2 lang="en" className="latin mb-5 text-xs text-gold-soft/90">Contact</h2>
            <ul className="space-y-3 text-xs text-cream/65">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-gold/70" aria-hidden="true" />
                تهران، فرشته
              </li>
              <li className="flex items-center gap-2" dir="ltr">
                <Phone className="size-3.5 shrink-0 text-gold/70" aria-hidden="true" />
                +98 21 2200 0000
              </li>
              <li>
                <a href="mailto:hello@diba.studio" className="inline-block -my-1.5 py-1.5 hover:text-cream">
                  hello@diba.studio
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 items-end gap-8 py-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="font-display text-xl text-cream">از آتلیه باخبر شوید.</h2>
            <p className="mt-2 text-xs text-cream/65">
              هر چند هفته، یک مجموعهٔ تازه و یادداشتی دربارهٔ طراحی دعوت.
            </p>
          </div>

          <form
            className="md:col-span-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.trim()) return;
              setSent(true);
              setEmail('');
            }}
          >
            <label htmlFor="footer-email" className="sr-only">
              ایمیل شما
            </label>
            <div className="flex items-center border-b border-cream/25 focus-within:border-gold">
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ایمیل شما"
                inputMode="email"
                autoComplete="email"
                enterKeyHint="send"
                className="h-11 w-full bg-transparent text-base text-cream placeholder:text-cream/55 focus:outline-none sm:text-sm"
              />
              <button
                type="submit"
                aria-label="عضویت در خبرنامه"
                className="flex size-11 shrink-0 items-center justify-center text-gold transition-transform hover:-translate-x-1"
              >
                <ArrowUpLeft className="size-4" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 min-h-[1rem] text-xs text-gold-soft/90" aria-live="polite">
              {sent ? 'ثبت شد؛ به‌زودی از آتلیه می‌شنوید.' : ''}
            </p>
          </form>
        </div>
      </div>

      <div className="border-t border-cream/12">
        <div className="shell flex flex-col items-center justify-between gap-3 py-5 text-xs text-cream/60 sm:flex-row">
          <p>© {year} دیبا، تمامی حقوق محفوظ است.</p>
          <div className="flex items-center gap-5">
            <span className="">Made in Tehran</span>
            <span>دسترس‌پذیر و راست‌به‌چپ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
