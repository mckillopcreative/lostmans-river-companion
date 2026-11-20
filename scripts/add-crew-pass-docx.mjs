// The Amazon gift edition (2026-11-20): adds the Crew Pass to the QR-code interior, on the blank
// last page (so the page count stays 194 and the cover still fits), and one line about it to the
// companion block on the copyright page. Edits the .docx package directly, like add-qr-docx.mjs,
// so the designer's formatting is untouched. Word then exports the PDF.
//   node scripts/add-crew-pass-docx.mjs <in: the QR-codes docx> <PASS-CODE> <out.docx>
// The pass code must be one the Worker accepts (BOOK_PASS in worker/wrangler.toml).
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const AdmZip = require('adm-zip');
const QRCode = require('qrcode');
const { XMLValidator } = require('fast-xml-parser');

const [, , inFile, pass, outFile] = process.argv;
if (!inFile || !/^[A-Z]+-[A-Z0-9]{4}$/.test(pass || '') || !outFile) throw new Error('usage: add-crew-pass-docx.mjs <in.docx> <WORD-1234> <out.docx>');
const zip = new AdmZip(inFile);
let doc = zip.readAsText('word/document.xml');
let rels = zip.readAsText('word/_rels/document.xml.rels');

const EMU_IN = 914400;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rpr = (sz, extra = '') => `<w:rPr><w:rFonts w:ascii="Garamond" w:hAnsi="Garamond"/>${extra}<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/></w:rPr>`;
const para = (inner, { sz = 22, before = 0, after = 0, extra = '' } = {}) =>
  `<w:p><w:pPr><w:spacing w:before="${before}" w:after="${after}" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/>${rpr(sz, extra)}</w:pPr>${inner}</w:p>`;
const run = (t, sz, extra = '') => `<w:r>${rpr(sz, extra)}<w:t xml:space="preserve">${esc(t)}</w:t></w:r>`;
function drawing(rId, inches, name) {
  const cx = Math.round(inches * EMU_IN);
  return (
    `<w:r><w:rPr><w:noProof/></w:rPr><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">` +
    `<wp:extent cx="${cx}" cy="${cx}"/><wp:effectExtent l="0" t="0" r="0" b="0"/>` +
    `<wp:docPr id="9500" name="${esc(name)}" descr="QR code: ${esc(name)}"/>` +
    `<wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr>` +
    `<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">` +
    `<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="9500" name="${esc(name)}"/><pic:cNvPicPr/></pic:nvPicPr>` +
    `<pic:blipFill><a:blip r:embed="${rId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>` +
    `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cx}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic>` +
    `</a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`
  );
}

// ---- the QR code: it opens /pass/ with the code already filled in
const png = await QRCode.toBuffer(`https://lostmansriver.com/pass/#${pass}`, { errorCorrectionLevel: 'M', margin: 1, scale: 16, color: { dark: '#000000', light: '#ffffff' } });
zip.addFile('word/media/qr-crew-pass.png', png);
rels = rels.replace('</Relationships>', `<Relationship Id="rIdQRcrewpass" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/qr-crew-pass.png"/></Relationships>`);

// ---- the last page: before the empty paragraph that ends the body (its section is centred top to bottom)
const lastSect = doc.lastIndexOf('<w:sectPr');
const lastPara = Math.max(doc.lastIndexOf('<w:p ', lastSect), doc.lastIndexOf('<w:p>', lastSect));
if (lastPara < 0 || doc.slice(lastPara, lastSect).includes('<w:t')) throw new Error('the last paragraph is not the empty one I expected');
const B = '<w:b/>';
const I = '<w:i/>';
const passPage =
  para(run('YOUR CREW PASS', 40, B + '<w:spacing w:val="40"/>'), { sz: 40, after: 60 }) +
  para(run('This book comes with the Summer Fishing Guide Experience', 24, I), { sz: 24, after: 0 }) +
  para(run('for up to five readers: you and four friends,', 24, I), { sz: 24, after: 0 }) +
  para(run('brothers, sisters or cousins.', 24, I), { sz: 24, after: 200 }) +
  para(
    run('Each reader gets the whole book read aloud, Guide School, 23 missions, badges and a fishing guide license, Wild Florida, and Matt’s Fishing Journal, on their own tablet or phone. It opens in a web browser. There is nothing to install.', 20),
    { sz: 20, after: 240 },
  ) +
  para(run('1.  A grown-up scans this code, or goes to ', 22) + run('lostmansriver.com/pass', 22, B), { sz: 22, after: 100 }) +
  para(drawing('rIdQRcrewpass', 1.35, 'Crew Pass code'), { after: 140 }) +
  para(run('2.  Type your pass code:', 22), { sz: 22, after: 60 }) +
  para(run(pass, 44, B + '<w:spacing w:val="60"/>'), { sz: 44, after: 140 }) +
  para(run('3.  Hand out the five links, one to each reader.', 22), { sz: 22, after: 260 }) +
  para(run('Stuck? Write to help@lostmansriver.com and a person will sort it out.', 18, I), { sz: 18, after: 0 });
doc = doc.slice(0, lastPara) + passPage + doc.slice(lastPara);

// ---- the copyright page: say the pass is there (this page shows in Amazon's Read Sample; the code does not)
const old = 'Scan the code at the top of any chapter to open that chapter, or start here.</w:t></w:r></w:p>';
if (doc.split(old).length !== 2) throw new Error('companion block sentence not found exactly once');
doc = doc.replace(
  old,
  () =>
    old +
    para(run('Your Crew Pass is on the last page: it opens the whole Summer Fishing Guide Experience for up to five readers.', 18, B), { sz: 18, after: 120 }),
);

for (const [name, xml] of [['document.xml', doc], ['document.xml.rels', rels]]) {
  const v = XMLValidator.validate(xml);
  if (v !== true) throw new Error(`${name} invalid: ${JSON.stringify(v.err).slice(0, 300)}`);
}
zip.updateFile('word/document.xml', Buffer.from(doc, 'utf8'));
zip.updateFile('word/_rels/document.xml.rels', Buffer.from(rels, 'utf8'));
zip.writeZip(outFile);
console.log(`Crew Pass ${pass} on the last page + the line on the copyright page → ${outFile}`);
