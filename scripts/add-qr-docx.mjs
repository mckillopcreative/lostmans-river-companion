// Adds the chapter QR codes (one under each "Chapter N –" heading) and the companion block on
// the copyright page to the KDP-formatted manuscript, by editing the .docx package directly so
// the designer's formatting is untouched. Usage:
//   node scripts/add-qr-docx.mjs <in.docx> qr <out.docx>   (needs: npm i -D adm-zip fast-xml-parser)
import { createRequire } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const require = createRequire(import.meta.url);
const AdmZip = require('adm-zip');
const { XMLValidator } = require('fast-xml-parser');

const [, , inFile, qrDir, outFile] = process.argv;
const zip = new AdmZip(inFile);
let doc = zip.readAsText('word/document.xml');
let rels = zip.readAsText('word/_rels/document.xml.rels');

const EMU_IN = 914400;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rpr = (sz, extra = '') => `<w:rPr><w:rFonts w:ascii="Garamond" w:hAnsi="Garamond"/>${extra}<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/></w:rPr>`;
const para = (inner, { sz = 26, before = 0, after = 0, extra = '' } = {}) =>
  `<w:p><w:pPr><w:spacing w:before="${before}" w:after="${after}" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/>${rpr(sz, extra)}</w:pPr>${inner}</w:p>`;
const textRun = (t, sz, extra = '') => `<w:r>${rpr(sz, extra)}<w:t xml:space="preserve">${esc(t)}</w:t></w:r>`;

let nextId = 9000;
function drawing(rId, inches, name) {
  const cx = Math.round(inches * EMU_IN);
  const id = nextId++;
  return (
    `<w:r><w:rPr><w:noProof/></w:rPr><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">` +
    `<wp:extent cx="${cx}" cy="${cx}"/><wp:effectExtent l="0" t="0" r="0" b="0"/>` +
    `<wp:docPr id="${id}" name="${esc(name)}" descr="QR code: ${esc(name)}"/>` +
    `<wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr>` +
    `<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">` +
    `<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${id}" name="${esc(name)}"/><pic:cNvPicPr/></pic:nvPicPr>` +
    `<pic:blipFill><a:blip r:embed="${rId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>` +
    `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cx}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic>` +
    `</a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`
  );
}
function addImage(file, target) {
  const rId = `rIdQR${target.replace(/\W/g, '')}`;
  zip.addFile(`word/media/${target}`, readFileSync(file));
  rels = rels.replace('</Relationships>', `<Relationship Id="${rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${target}"/></Relationships>`);
  return rId;
}

// ---- chapter codes: after each "Chapter N –" heading paragraph
let placed = 0;
for (let n = 1; n <= 23; n++) {
  const file = join(qrDir, `ch-${String(n).padStart(2, '0')}.png`);
  if (!existsSync(file)) throw new Error('missing ' + file);
  const re = new RegExp(`<w:t(?: xml:space="preserve")?>Chapter ${n} –\\s*</w:t>`);
  const m = re.exec(doc);
  if (!m) throw new Error(`heading for chapter ${n} not found`);
  const pEnd = doc.indexOf('</w:p>', m.index) + 6;
  const rId = addImage(file, `qr-ch-${String(n).padStart(2, '0')}.png`);
  const block =
    para(drawing(rId, 0.75, `Chapter ${n} code`), { before: 60, after: 0 }) +
    para(textRun(`lostmansriver.com/ch/${n}`, 16, '<w:color w:val="595959"/>'), { sz: 16, after: 120 });
  doc = doc.slice(0, pEnd) + block + doc.slice(pEnd);
  placed++;
}

// ---- the companion block on the copyright page (before the paragraph that carries section 2's sectPr)
const isbnAt = doc.indexOf('>9798374178890<');
if (isbnAt < 0) throw new Error('ISBN paragraph not found');
const sectAt = doc.indexOf('<w:sectPr', isbnAt);
const sectParaStart = Math.max(doc.lastIndexOf('<w:p ', sectAt), doc.lastIndexOf('<w:p>', sectAt));
const homeRId = addImage(join(qrDir, 'home-inside-cover.png'), 'qr-home.png');
const companion =
  para('', { sz: 20, after: 0 }) +
  para(textRun('Your Fishing Guide Companion', 24, '<w:i/>'), { sz: 24, before: 240, after: 60 }) +
  para(textRun('This book comes with a free website: the real chart of the Ten Thousand Islands, every fish, the boats, the crew, the tackle box, and Chapter 1 read aloud. Scan the code at the top of any chapter to open that chapter, or start here.', 18), { sz: 18, after: 120 }) +
  para(drawing(homeRId, 1.0, 'Companion site code'), { after: 40 }) +
  para(textRun('lostmansriver.com', 20), { sz: 20, after: 0 });
doc = doc.slice(0, sectParaStart) + companion + doc.slice(sectParaStart);

// ---- validate and write
for (const [name, xml] of [['document.xml', doc], ['document.xml.rels', rels]]) {
  const v = XMLValidator.validate(xml);
  if (v !== true) throw new Error(`${name} invalid: ${JSON.stringify(v.err).slice(0, 300)}`);
}
zip.updateFile('word/document.xml', Buffer.from(doc, 'utf8'));
zip.updateFile('word/_rels/document.xml.rels', Buffer.from(rels, 'utf8'));
zip.writeZip(outFile);
console.log(`placed ${placed} chapter codes + the companion block → ${outFile}`);
