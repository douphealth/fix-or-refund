// @ts-nocheck — ported verbatim from v5 static release; covered by src/test/rules.test.ts
/**
 * Fix or Refund? — conservative, source-backed public legal-information rules.
 * Last legal review: 2026-10-30. Not an eligibility determination.
 * This module contains no DOM, network calls, telemetry or persistence.
 */
export const LAW_REVIEW_DATE = '2026-10-30';
export const GREEK_REPAIR_CUTOFF = '2026-07-31';
export const EU_COUNTRIES = [
  ['AT','Austria','Αυστρία'],['BE','Belgium','Βέλγιο'],['BG','Bulgaria','Βουλγαρία'],
  ['HR','Croatia','Κροατία'],['CY','Cyprus','Κύπρος'],['CZ','Czechia','Τσεχία'],
  ['DK','Denmark','Δανία'],['EE','Estonia','Εσθονία'],['FI','Finland','Φινλανδία'],
  ['FR','France','Γαλλία'],['DE','Germany','Γερμανία'],['GR','Greece','Ελλάδα'],
  ['HU','Hungary','Ουγγαρία'],['IE','Ireland','Ιρλανδία'],['IT','Italy','Ιταλία'],
  ['LV','Latvia','Λετονία'],['LT','Lithuania','Λιθουανία'],['LU','Luxembourg','Λουξεμβούργο'],
  ['MT','Malta','Μάλτα'],['NL','Netherlands','Κάτω Χώρες'],['PL','Poland','Πολωνία'],
  ['PT','Portugal','Πορτογαλία'],['RO','Romania','Ρουμανία'],['SK','Slovakia','Σλοβακία'],
  ['SI','Slovenia','Σλοβενία'],['ES','Spain','Ισπανία'],['SE','Sweden','Σουηδία']
];
export const PRODUCTS = [
  {id:'phone',en:'Smartphone / mobile phone',el:'Κινητό τηλέφωνο',annex:true,group:'electronic'},
  {id:'tablet',en:'Tablet (slate)',el:'Tablet',annex:true,group:'electronic'},
  {id:'cordless',en:'Cordless phone',el:'Ασύρματο τηλέφωνο',annex:true,group:'electronic'},
  {id:'tv',en:'TV / electronic display',el:'Τηλεόραση / οθόνη',annex:true,group:'electronic'},
  {id:'laptop',en:'Laptop / computer',el:'Laptop / υπολογιστής',annex:false,group:'electronic'},
  {id:'washer',en:'Washing machine / washer-dryer',el:'Πλυντήριο ρούχων / πλυντήριο-στεγνωτήριο',annex:true,group:'appliance'},
  {id:'dishwasher',en:'Dishwasher',el:'Πλυντήριο πιάτων',annex:true,group:'appliance'},
  {id:'fridge',en:'Fridge / freezer',el:'Ψυγείο / καταψύκτης',annex:true,group:'appliance'},
  {id:'dryer',en:'Tumble dryer',el:'Στεγνωτήριο ρούχων',annex:true,group:'appliance'},
  {id:'vacuum',en:'Vacuum cleaner',el:'Ηλεκτρική σκούπα',annex:true,group:'appliance'},
  {id:'heater',en:'Domestic local space heater',el:'Οικιακός τοπικός θερμαντήρας',annex:true,group:'appliance'},
  {id:'welding',en:'Welding equipment',el:'Εξοπλισμός συγκόλλησης',annex:true,group:'other'},
  {id:'server',en:'Server / data-storage equipment',el:'Εξυπηρετητής / αποθήκευση δεδομένων',annex:true,group:'other'},
  {id:'lmtbattery',en:'Light-transport battery device',el:'Συσκευή με μπαταρία ελαφρού μέσου μεταφοράς',annex:true,group:'other'},
  {id:'other',en:'Other physical product',el:'Άλλο υλικό προϊόν',annex:false,group:'other'}
];
export const SOURCES = Object.freeze({
  euGuarantee: {en:'Your Europe — legal guarantee',el:'Your Europe — νόμιμη εγγύηση',url:'https://europa.eu/youreurope/citizens/consumers/shopping/guarantees/index_en.htm',kind:'EU'},
  euSales: {en:'EUR-Lex — Directive (EU) 2019/771, Articles 10–16',el:'EUR-Lex — Οδηγία (ΕΕ) 2019/771, άρθρα 10–16',url:'https://eur-lex.europa.eu/eli/dir/2019/771/oj/eng',kind:'EU primary law'},
  euRepairLaw: {en:'EUR-Lex — Directive (EU) 2024/1799',el:'EUR-Lex — Οδηγία (ΕΕ) 2024/1799',url:'https://eur-lex.europa.eu/eli/dir/2024/1799/oj/eng',kind:'EU primary law'},
  grGuarantee: {en:'Greek government — statutory warranty',el:'gov.gr — νόμιμη εγγύηση',url:'https://www.gov.gr/el/sdg/consumer-rights/consumer-rights-and-guarantees/general/statutory-warranty',kind:'Government'},
  euRepair: {en:'European Commission — repair directive',el:'Ευρωπαϊκή Επιτροπή — δικαίωμα επισκευής',url:'https://commission.europa.eu/law/law-topic/consumer-protection-law/directive-repair-goods_en',kind:'EU'},
  grLaw: {en:'Hellenic Parliament — Law 5317/2026',el:'Βουλή των Ελλήνων — Ν. 5317/2026',url:'https://www.hellenicparliament.gr/Nomothetiko-Ergo/Anazitisi-Nomothetikou-Ergou?law_id=2fa5316d-9df6-4ff0-8eb9-b479000a6e8f',kind:'Government'},
  grEffective: {en:'Law 5317/2026 — Article 143 (effective dates)',el:'Ν. 5317/2026 — άρθρο 143 (έναρξη ισχύος)',url:'https://www.taxheaven.gr/law/5317/2026/arthro/143',kind:'Legal reference'},
  grRepair: {en:'Law 5317/2026 — Article 97 (manufacturer repair)',el:'Ν. 5317/2026 — άρθρο 97 (υποχρέωση επισκευής)',url:'https://www.taxheaven.gr/law/5317/2026/arthro/97',kind:'Legal reference'},
  grThreeYear: {en:'Law 5317/2026 — Article 102 (3-year limitation)',el:'Ν. 5317/2026 — άρθρο 102 (τριετής παραγραφή)',url:'https://www.taxheaven.gr/law/5317/2026/arthro/102',kind:'Legal reference'},
  grAnnex: {en:'Law 5317/2026 — Article 110, Annex IV',el:'Ν. 5317/2026 — άρθρο 110, παράρτημα IV',url:'https://www.taxheaven.gr/law/5317/2026/arthro/110',kind:'Legal reference'},
  euFAQ: {en:'European Commission — right-to-repair Q&A',el:'Ευρωπαϊκή Επιτροπή — ερωτήσεις για την επισκευή',url:'https://commission.europa.eu/document/download/2d443b31-dc2a-4e54-a9ec-5fbb61c895e9_en?filename=2024_07_18_QA_Right2repair_FINAL.pdf',kind:'EU'},
  grOmbudsman: {en:'Greek Consumer Ombudsman — submit a report',el:'Συνήγορος του Καταναλωτή — αναφορά',url:'https://www.synigoroskatanaloti.gr/el/ypoboli-anaforas',kind:'Government'},
  grComplaint: {en:'gov.gr — consumer complaint',el:'gov.gr — καταγγελία καταναλωτή',url:'https://www.gov.gr/ipiresies/polites-kai-kathemerinoteta/kataggelies/kataggelia-katanalote',kind:'Government'},
  eccGreece: {en:'European Consumer Centre Greece — complaint',el:'Ευρωπαϊκό Κέντρο Καταναλωτή Ελλάδας — καταγγελία',url:'https://www.eccgreece.gr/about-us/complaint-submission',kind:'ECC-Net'},
  euADR: {en:'European Commission — ADR bodies',el:'Ευρωπαϊκή Επιτροπή — φορείς ΕΕΔ',url:'https://consumer-redress.ec.europa.eu/list-alternative-dispute-resolution-adr-bodies_en',kind:'EU'},
  eccNetwork: {en:'European Consumer Centres Network',el:'Ευρωπαϊκά Κέντρα Καταναλωτών',url:'https://www.eccnet.eu/',kind:'EU'}
});

export function parseDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y,m,d] = value.split('-').map(Number);
  const dt = new Date(Date.UTC(y,m-1,d));
  return dt.getUTCFullYear()===y && dt.getUTCMonth()===m-1 && dt.getUTCDate()===d ? dt : null;
}
export function addYears(date, years) {
  const d = new Date(date.getTime());
  // Calendar anniversary, with Feb 29 capped to Feb 28 in non-leap years.
  const targetYear = d.getUTCFullYear() + years;
  const month = d.getUTCMonth(), day = d.getUTCDate();
  const endOfMonth = new Date(Date.UTC(targetYear, month+1, 0)).getUTCDate();
  return new Date(Date.UTC(targetYear, month, Math.min(day, endOfMonth)));
}
export function daysBetween(a,b) { return Math.round((b-a)/86400000); }
export function todayUTC(clock = new Date()) {return new Date(Date.UTC(clock.getFullYear(),clock.getMonth(),clock.getDate()));}

/** Accepts populated form state and optional clock. Returns symbolic fact/action codes. */
export function evaluate(raw, clock = new Date()) {
  const f = {...raw};
  const today = todayUTC(clock);
  const purchase = parseDate(f.purchaseDate);
  const delivery = parseDate(f.deliveryDate || f.purchaseDate);
  const failure = parseDate(f.failureDate);
  const errors = [];
  const validEU = EU_COUNTRIES.some(([code])=>code===f.country);
  const product = PRODUCTS.find(x=>x.id === f.product);
  if (!validEU) errors.push('country');
  if (!['business','private'].includes(f.sellerType)) errors.push('sellerType');
  if (!['new','used'].includes(f.condition)) errors.push('condition');
  if (!product) errors.push('product');
  if (!purchase) errors.push('purchaseDate');
  if (!delivery) errors.push('deliveryDate');
  if (!failure) errors.push('failureDate');
  if (!['fault','accidental','wear','unsure'].includes(f.issue)) errors.push('issue');
  if (!['none','rejected','attempted','delayed'].includes(f.sellerResponse)) errors.push('sellerResponse');
  if (!['yes','no','unsure'].includes(f.serious)) errors.push('serious');
  if (!['yes','no','unsure'].includes(f.promptNotice)) errors.push('promptNotice');
  if (!['yes','no','unsure'].includes(f.priorRepair)) errors.push('priorRepair');
  if (f.condition === 'used' && !['yes','no','unsure'].includes(f.shortenedUsed)) errors.push('shortenedUsed');
  if (purchase && purchase > today) errors.push('purchaseFuture');
  if (delivery && delivery > today) errors.push('deliveryFuture');
  if (failure && failure > today) errors.push('failureFuture');
  if (purchase && delivery && purchase > delivery) errors.push('deliveryBeforePurchase');
  if (failure && delivery && failure < delivery) errors.push('failureBeforeDelivery');
  if (errors.length) return {valid:false,errors};

  const isGreece = f.country === 'GR';
  const business = f.sellerType === 'business';
  const fault = f.issue === 'fault';
  const uncertainFault = f.issue === 'unsure';
  const physicalDamage = f.issue === 'accidental';
  const buyerIssue = physicalDamage || f.issue === 'wear';
  const in1AtFailure = failure <= addYears(delivery,1);
  const in2AtFailure = failure <= addYears(delivery,2);
  const in2Now = today <= addYears(delivery,2);
  const in3Now = today <= addYears(delivery,3);
  const in3AtFailure = failure <= addYears(delivery,3);
  const early30 = daysBetween(delivery,failure) <= 30;
  const postCutoff = Boolean(purchase && purchase >= parseDate(GREEK_REPAIR_CUTOFF));
  const repairExtensionPossible = isGreece && business && postCutoff && f.priorRepair === 'yes' && in3Now && in3AtFailure && !buyerIssue;
  const shortenedUsed = f.condition === 'used' && f.shortenedUsed === 'yes';
  const usedPeriodUncertain = f.condition === 'used' && f.shortenedUsed === 'unsure';
  const shortenedBarrier = shortenedUsed && !in1AtFailure;
  // Do not categorically reject a used-goods claim based on an alleged one-year
  // term: enforceability depends on the applicable Member State law.
  const suggestedSellerClaim = business && (fault || uncertainFault) && in2AtFailure && in2Now;
  const strongSellerClaim = suggestedSellerClaim && fault && !usedPeriodUncertain && !shortenedBarrier;
  const mfgListed = product.annex;
  const manufacturerPossible = mfgListed; // Must still verify product regulation/model/date/parts/repairability.
  const refundTriggers = f.sellerResponse === 'rejected' || f.sellerResponse === 'attempted' || f.sellerResponse === 'delayed';
  const earlyGreeceRefund = isGreece && early30 && f.promptNotice === 'yes'; // Independent route: the defect need not separately be marked serious.
  // A minor non-conformity is not itself a ground to terminate a sale.
  // We never promise a refund; seriousness and factual conditions still require review.
  const refundMayBeAvailable = suggestedSellerClaim && f.serious !== 'no' && (refundTriggers || (isGreece && earlyGreeceRefund) || f.serious === 'yes');

  let status = 'review';
  if (!business) status = 'private';
  else if (buyerIssue) status = 'damage';
  else if (strongSellerClaim) status = 'seller';
  else if (repairExtensionPossible && fault && !buyerIssue) status = 'extended';
  else if (manufacturerPossible) status = 'manufacturer';
  else if (!in2Now || !in2AtFailure) status = 'outside';
  if (f.condition === 'used' && (usedPeriodUncertain || shortenedBarrier) && status === 'seller') status = 'review';

  const reasons = [];
  const sourceIds = new Set(['euGuarantee','euSales']);
  if (isGreece) sourceIds.add('grGuarantee');
  if (manufacturerPossible) {
    sourceIds.add('euRepairLaw');sourceIds.add('euRepair');
    if (isGreece) {sourceIds.add('grRepair');sourceIds.add('grAnnex');}
  }
  if (isGreece) sourceIds.add('grEffective');
  if (!isGreece) reasons.push('euBaseline');
  if (!business) reasons.push('privateSale');
  else if (physicalDamage) reasons.push('accidental');
  else if (f.issue === 'wear') reasons.push('wear');
  else if (uncertainFault) reasons.push('causeUnclear');
  else reasons.push('faultReported');
  if (business) {
    if (in2AtFailure) reasons.push('failureWithinTwo');
    else reasons.push('failureAfterTwo');
    if (in2Now) reasons.push('withinTwoToday');
    else reasons.push('pastTwoToday');
    if (in1AtFailure && (fault || uncertainFault)) reasons.push(isGreece?'grPresumption':'euPresumption');
    else if (in2AtFailure && (fault || uncertainFault)) reasons.push('evidenceAfterOne');
    if (shortenedBarrier) reasons.push('usedOneYearAgreed');
    else if (usedPeriodUncertain) reasons.push('usedTermsUnknown');
    if (isGreece && postCutoff && (fault || uncertainFault)) {
      reasons.push('postCutoffRepairChoice');
      sourceIds.add('grThreeYear');
    } else if (isGreece && !postCutoff) reasons.push('beforeCutoff');
    if (repairExtensionPossible) { reasons.push('repairExtensionPossible');sourceIds.add('grThreeYear'); }
    if (f.sellerResponse === 'rejected') reasons.push('sellerRefused');
    if (f.sellerResponse === 'attempted') reasons.push('repairFailed');
    if (f.sellerResponse === 'delayed') reasons.push('repairDelayed');
    if (earlyGreeceRefund && suggestedSellerClaim && f.serious !== 'no') reasons.push('grEarlyRefund');
    if (f.serious==='yes' && suggestedSellerClaim) reasons.push('seriousFailure');
    if (f.condition==='used') reasons.push('usedGoods');
  }
  if (manufacturerPossible) reasons.push('annexConditional');
  else reasons.push('notAnnex');
  const remedies = {
    sellerRepair: suggestedSellerClaim ? (strongSellerClaim?'potential':'review') : (repairExtensionPossible && fault?'review':'unconfirmed'),
    replacement: suggestedSellerClaim ? (strongSellerClaim?'potential':'review') : (repairExtensionPossible && fault?'review':'unconfirmed'),
    refund: refundMayBeAvailable ? 'conditional' : 'unconfirmed',
    manufacturer: manufacturerPossible ? 'conditional' : 'unconfirmed'
  };
  const route = strongSellerClaim || (repairExtensionPossible && business && fault) || (suggestedSellerClaim && uncertainFault) ? 'seller' : manufacturerPossible ? 'manufacturer' : 'sellerEvidence';
  return {valid:true,status,route,remedies,reasons,sourceIds:[...sourceIds],facts:{
    country:f.country,product:f.product,isGreece,business,postCutoff,manufacturerPossible,
    in1AtFailure,in2AtFailure,in2Now,in3Now,in3AtFailure,early30,earlyGreeceRefund,
    sellerResponse:f.sellerResponse,issue:f.issue,serious:f.serious,promptNotice:f.promptNotice,priorRepair:f.priorRepair,
    repairExtensionPossible,shortenedUsed,shortenedBarrier,refundMayBeAvailable,
    referenceDate:today.toISOString().slice(0,10),
    purchaseDate:f.purchaseDate,deliveryDate:f.deliveryDate||f.purchaseDate,failureDate:f.failureDate
  }};
}
