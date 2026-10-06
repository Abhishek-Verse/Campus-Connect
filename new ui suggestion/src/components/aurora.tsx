export function AuroraBackdrop({ subtle = false }: { subtle?: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: -1 }}
    >
      {/* faint rule grid */}
      <div className="grid-lines absolute inset-0" />
      {/* oversized ghost rings */}
      <div
        className="absolute -top-48 -right-48 h-[560px] w-[560px] rounded-full border-[1.5px]"
        style={{
          borderColor: "rgba(24,22,17,0.12)",
          opacity: subtle ? 0.5 : 1,
        }}
      />
      <div
        className="absolute -top-24 -right-24 h-[300px] w-[300px] rounded-full border-[1.5px] border-dashed"
        style={{
          borderColor: "rgba(214,59,34,0.28)",
          opacity: subtle ? 0.45 : 1,
        }}
      />
      <div
        className="float-slow absolute bottom-[-180px] left-[-160px] h-[440px] w-[440px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(214,59,34,0.07), transparent)",
          opacity: subtle ? 0.5 : 1,
        }}
      />
      {/* bottom edge wash */}
      <div
        className="absolute inset-x-0 bottom-0 h-64"
        style={{
          background:
            "linear-gradient(to top, rgba(24,22,17,0.035), transparent)",
        }}
      />
    </div>
  );
}
