function AppSplash() {
  return (
    <div className="fixed inset-0 z-[9999] flex justify-center bg-[#EEF3F1]">
      <div
        className="
          relative h-dvh w-full max-w-[480px] overflow-hidden
          bg-[radial-gradient(circle_at_top,#ffffff_0%,#f4f7f6_40%,#edf2f0_100%)]
        "
      >
        {/* BACKGROUND LAYER */}
        <div className="absolute inset-0 bg-white/10" />

        {/* SILHOUETTE BACKGROUND */}
        <div className="pointer-events-none absolute inset-x-0 top-[70px] z-[1] opacity-[0.30]">
          <svg
            viewBox="0 0 480 270"
            className="h-[270px] w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* clouds */}
            <path
              d="M22 75C22 55 38 39 58 39C75 39 89 50 94 66C98 64 103 63 108 63C126 63 141 77 141 95H22V75Z"
              fill="#DCE7E3"
            />
            <path
              d="M367 56C367 43 377 33 390 33C400 33 409 39 412 48C415 47 418 46 422 46C434 46 444 56 444 68H367V56Z"
              fill="#DCE7E3"
            />
            <path
              d="M410 47C410 31 422 19 438 19C452 19 463 29 467 42C470 41 473 40 477 40C490 40 501 50 501 64H410V47Z"
              fill="#DCE7E3"
            />

            {/* hills */}
            <path
              d="M0 165C31 144 57 138 90 144C120 149 141 165 165 173C190 180 208 175 232 165C258 154 285 147 314 153C336 157 355 168 379 172C412 177 441 165 480 150V270H0V165Z"
              fill="#BFD1CA"
            />
            <path
              d="M0 195C28 180 56 173 84 177C116 181 133 195 163 203C191 210 214 207 239 197C264 188 287 180 315 183C341 186 362 198 392 203C423 208 449 199 480 185V270H0V195Z"
              fill="#CDDAD6"
            />
            <path
              d="M0 223C35 209 63 206 95 211C121 215 147 227 181 231C208 234 233 230 257 224C285 217 310 212 338 215C373 219 401 232 430 236C448 239 462 237 480 232V270H0V223Z"
              fill="#D8E3DF"
            />

            {/* candi bentar */}
            <path d="M183 96H208V206H183V96Z" fill="#8FA9A0" />
            <path d="M219 96H244V206H219V96Z" fill="#8FA9A0" />
            <path d="M177 206H214V216H177V206Z" fill="#8FA9A0" />
            <path d="M213 206H250V216H213V206Z" fill="#8FA9A0" />
            <path d="M186 82H205V96H186V82Z" fill="#8FA9A0" />
            <path d="M222 82H241V96H222V82Z" fill="#8FA9A0" />
            <path d="M182 75H209L204 82H187L182 75Z" fill="#8FA9A0" />
            <path d="M218 75H245L240 82H223L218 75Z" fill="#8FA9A0" />

            {/* temple right */}
            <rect x="390" y="117" width="8" height="90" rx="4" fill="#89A59B" />
            <path d="M394 90L370 118H418L394 90Z" fill="#89A59B" />
            <path d="M394 110L366 142H422L394 110Z" fill="#89A59B" />
            <path d="M394 132L362 168H426L394 132Z" fill="#89A59B" />
            <path d="M394 156L356 196H432L394 156Z" fill="#89A59B" />
            <path d="M366 196H422V210H366V196Z" fill="#89A59B" />
            <rect x="377" y="210" width="34" height="35" rx="2" fill="#89A59B" />

            {/* palm trees */}
            <rect x="12" y="182" width="5" height="38" rx="3" fill="#90AAA1" />
            <path d="M14 182C0 174 -7 163 -11 149C4 155 10 164 14 174" fill="#90AAA1" />
            <path d="M14 182C28 175 35 163 39 149C24 155 18 164 14 174" fill="#90AAA1" />
            <path d="M14 181C0 182 -10 177 -20 169C-5 167 6 170 14 175" fill="#90AAA1" />
            <path d="M14 181C28 182 38 177 48 169C33 167 22 170 14 175" fill="#90AAA1" />

            <rect x="86" y="189" width="5" height="36" rx="3" fill="#90AAA1" />
            <path d="M88 189C74 181 67 171 63 158C77 164 84 172 88 182" fill="#90AAA1" />
            <path d="M88 189C102 182 109 171 113 158C99 164 92 172 88 182" fill="#90AAA1" />
            <path d="M88 187C75 188 65 184 55 177C69 175 79 177 88 182" fill="#90AAA1" />
            <path d="M88 187C101 188 111 184 121 177C107 175 97 177 88 182" fill="#90AAA1" />

            <rect x="332" y="186" width="5" height="36" rx="3" fill="#90AAA1" />
            <path d="M334 186C320 178 313 168 309 155C323 161 330 169 334 179" fill="#90AAA1" />
            <path d="M334 186C348 179 355 168 359 155C345 161 338 169 334 179" fill="#90AAA1" />
            <path d="M334 184C321 185 311 181 301 174C315 172 325 174 334 179" fill="#90AAA1" />
            <path d="M334 184C347 185 357 181 367 174C353 172 343 174 334 179" fill="#90AAA1" />

            {/* birds */}
            <path d="M286 102C289 99 292 99 296 102" stroke="#8FA9A0" strokeWidth="2" strokeLinecap="round" />
            <path d="M299 102C302 99 305 99 309 102" stroke="#8FA9A0" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* ROAD SHAPE */}
        <div className="absolute inset-x-0 bottom-[208px] z-[2] flex justify-center">
          <div className="relative h-[66px] w-[92%] rounded-[999px] bg-[#D8E2DF]" />
        </div>

        {/* BUS */}
        <div className="absolute inset-x-0 bottom-[235px] z-[3] flex justify-center px-4">
          <img
            src="/bus.png"
            alt="Bus Trans Metro Dewata"
            className="
              tmd-bus-float
              h-auto w-[88%] max-w-[380px]
              object-contain
              drop-shadow-[0_18px_28px_rgba(0,0,0,0.18)]
            "
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        </div>

        {/* TITLE */}
        <div className="absolute inset-x-0 bottom-[135px] z-[4] px-6 text-center">
          <h1 className="text-[20px] font-extrabold tracking-tight text-[#24324A]">
            TRANS METRO DEWATA
          </h1>
        </div>

        {/* LOADING BAR */}
        <div className="absolute inset-x-0 bottom-[74px] z-[4] px-6">
          <div className="mx-auto h-[10px] w-[250px] overflow-hidden rounded-full bg-[#DCE6E2]">
            <div className="tmd-loading-bar h-full rounded-full bg-[linear-gradient(90deg,#3B847E_0%,#6DB1A3_100%)]" />
          </div>

          <p className="mt-4 text-center text-[12px] text-[#7C898F]">
            Menyiapkan aplikasi...
          </p>
        </div>

        <style>{`
          .tmd-bus-float {
            animation: tmdBusFloat 2.2s ease-in-out infinite;
          }

          .tmd-loading-bar {
            width: 42%;
            animation: tmdSplashLoad 1.35s ease-in-out infinite;
          }

          @keyframes tmdBusFloat {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-6px);
            }
          }

          @keyframes tmdSplashLoad {
            0% {
              transform: translateX(-120%);
            }
            100% {
              transform: translateX(270%);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .tmd-bus-float,
            .tmd-loading-bar {
              animation: none !important;
            }

            .tmd-loading-bar {
              width: 100%;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </div>
  )
}

export default AppSplash