import { CircleUserRound, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

function WelcomeHeader() {
  return (
    <header className="bg-[var(--tmd-background)] px-5 pt-6 pb-4">
      {/* APP BAR */}
      <div className="flex items-center justify-between">
        <Link to="/" className="text-[13px] font-extrabold tracking-wide text-[var(--tmd-primary)]">
          TRANS METRO DEWATA
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/tiket" aria-label="Tiket saya">
            <Ticket size={20} className="text-[var(--tmd-text)]" />
          </Link>

          <Link to="/akun" aria-label="Akun saya">
            <CircleUserRound size={21} className="text-[var(--tmd-text)]" />
          </Link>
        </div>
      </div>

      {/* GREETING */}
      <p className="mt-6 text-sm font-medium text-[var(--tmd-muted)]">
        Selamat datang, User!
      </p>

      {/* SIMPLE INFORMATION BANNER */}
      <Link
        to="/info"
        className="
          mt-3 flex h-[112px] overflow-hidden
          rounded-xl
          bg-gradient-to-br from-[var(--tmd-primary)] via-[var(--tmd-primary-bright)] to-[var(--tmd-accent)]
          text-white shadow-[0_10px_24px_rgba(206,14,45,0.18)]
          transition active:scale-[0.99]
        "
      >
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-3">
          <h1 className="text-[15px] font-bold text-white">
            Panduan perjalanan
          </h1>

          <p className="text-[10px] leading-4 text-white/85">
            Tarif, jadwal, dan informasi layanan bus.
          </p>

          <span className="text-[11px] font-bold text-white underline decoration-white/60 underline-offset-2">
            Lihat panduan
          </span>
        </div>

        <div className="w-[42%] shrink-0 overflow-hidden">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/63/Trans_Metro_Dewata_%28TB-V-07%29_Citouro_New_Armada.jpg"
            alt="Bus Trans Metro Dewata"
            className="h-full w-full object-cover object-center"
          />
        </div>
      </Link>
    </header>
  );
}

export default WelcomeHeader;
