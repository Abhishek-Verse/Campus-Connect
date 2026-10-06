import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { getSessionUser } from "@/lib/auth";
import { getCertificateWithDetails } from "@/lib/data";
import { formatDay } from "@/lib/utils";

export const dynamic = "force-dynamic";

const W = 841.89;
const H = 595.28;

function centerX(textWidth: number) {
  return (W - textWidth) / 2;
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const user = await getSessionUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const cert = await getCertificateWithDetails(id);
  if (!cert) return new Response("Not found", { status: 404 });
  if (user.role !== "admin" && cert.userId !== user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  const doc = await PDFDocument.create();
  const page = doc.addPage([W, H]);
  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const times = await doc.embedFont(StandardFonts.TimesRomanItalic);

  const ink = rgb(0.075, 0.07, 0.055);
  const gold = rgb(1, 0.71, 0.28);
  const flame = rgb(0.91, 0.3, 0.16);
  const white = rgb(0.96, 0.96, 0.99);
  const muted = rgb(0.62, 0.62, 0.72);

  // background
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: ink });
  // subtle violet glow top
  page.drawEllipse({
    x: W / 2,
    y: H + 60,
    xScale: 420,
    yScale: 170,
    color: rgb(0.18, 0.13, 0.36),
  });

  // double border
  page.drawRectangle({
    x: 28,
    y: 28,
    width: W - 56,
    height: H - 56,
    borderColor: gold,
    borderWidth: 1.4,
  });
  page.drawRectangle({
    x: 36,
    y: 36,
    width: W - 72,
    height: H - 72,
    borderColor: rgb(0.5, 0.42, 0.24),
    borderWidth: 0.6,
  });

  const drawCentered = (text: string, y: number, font: typeof helv, size: number, color = white) => {
    const width = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: centerX(width), y, size, font, color });
  };

  // header
  const brand = "C A M P U S C O N N E C T  ·  T C E T";
  drawCentered(brand, H - 78, helvBold, 11, flame);
  page.drawLine({
    start: { x: W / 2 - 130, y: H - 92 },
    end: { x: W / 2 + 130, y: H - 92 },
    thickness: 0.6,
    color: rgb(0.35, 0.3, 0.5),
  });

  drawCentered("CERTIFICATE", H - 150, helvBold, 44, white);
  drawCentered("OF PARTICIPATION", H - 176, helv, 15, gold);

  drawCentered("This certificate is proudly presented to", H - 226, times, 14, muted);

  const name = cert.user.name;
  drawCentered(name, H - 278, helvBold, 34, gold);
  const nameWidth = helvBold.widthOfTextAtSize(name, 34);
  page.drawLine({
    start: { x: centerX(nameWidth) - 20, y: H - 292 },
    end: { x: centerX(nameWidth) + nameWidth + 20, y: H - 292 },
    thickness: 0.7,
    color: rgb(0.6, 0.5, 0.3),
  });

  drawCentered("for enthusiastic participation in", H - 322, times, 14, muted);
  drawCentered(cert.event.title, H - 356, helvBold, 22, white);

  const meta = `organised by ${cert.event.club.name}  ·  ${formatDay(cert.event.startAt)}`;
  drawCentered(meta, H - 384, helv, 12, muted);

  // QR block (bottom left)
  const qrPayload = `CC-CERT:${cert.code}`;
  const qrBuffer = await QRCode.toBuffer(qrPayload, {
    width: 220,
    margin: 1,
    color: { dark: "#ffffff", light: "#0b0b13" },
  });
  const qrImage = await doc.embedPng(qrBuffer);
  page.drawRectangle({
    x: 70,
    y: 62,
    width: 96,
    height: 96,
    color: rgb(0.12, 0.11, 0.16),
    borderColor: rgb(0.3, 0.28, 0.4),
    borderWidth: 0.8,
  });
  page.drawImage(qrImage, { x: 76, y: 68, width: 84, height: 84 });
  page.drawText("Scan to verify", {
    x: 70,
    y: 48,
    size: 8.5,
    font: helv,
    color: muted,
  });

  // verification code (bottom right)
  const codeLabel = "VERIFICATION CODE";
  page.drawText(codeLabel, {
    x: W - 70 - helv.widthOfTextAtSize(codeLabel, 8.5),
    y: 128,
    size: 8.5,
    font: helv,
    color: muted,
  });
  page.drawText(cert.code, {
    x: W - 70 - helvBold.widthOfTextAtSize(cert.code, 13),
    y: 108,
    size: 13,
    font: helvBold,
    color: gold,
  });
  const issued = `Issued ${formatDay(cert.issuedAt)}`;
  page.drawText(issued, {
    x: W - 70 - helv.widthOfTextAtSize(issued, 9),
    y: 88,
    size: 9,
    font: helv,
    color: muted,
  });

  const pdfBytes = await doc.save();
  const filename = `campusconnect-certificate-${cert.code}.pdf`;
  return new Response(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
