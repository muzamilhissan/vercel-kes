const BG_IMAGE = '/bg-image.webp';

/** The split-panel frame shared by the sign-in and SSO screens. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-cover bg-center p-4 md:overflow-hidden md:p-10"
      style={{ backgroundImage: `url(${BG_IMAGE})` }}
    >
      <div className="relative flex h-[80vh] max-h-[45rem] min-h-[37.5rem] w-full max-w-[67.5rem] overflow-hidden rounded-[2rem] bg-surface shadow-[0_40px_100px_-20px_rgb(0_0_0_/_0.4)] max-md:h-auto max-md:min-h-0 max-md:my-auto">
        <div
          className="relative m-2 flex flex-[1.1] flex-col overflow-hidden rounded-3xl bg-cover bg-center p-12 text-white max-md:hidden"
          style={{ backgroundImage: `url(${BG_IMAGE})` }}
        >
          <div className="absolute inset-0 z-1 bg-linear-to-b from-black/20 to-black/60" />
          <div className="relative z-2 flex h-full flex-col justify-end">
            <h1 className="mb-4 font-serif text-[2.625rem] uppercase leading-[1.1]">
              Kudon
              <br />
              Engineering
              <br />
              Services
            </h1>
            <p className="max-w-[25rem] text-base font-light opacity-80">Engineering Excellence</p>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center p-8 md:p-12">{children}</div>
      </div>
    </div>
  );
}
