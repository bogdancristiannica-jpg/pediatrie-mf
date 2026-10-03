/* Date pentru unelte: noutăți, antibiotice pe o pagină, excludere din colectivitate, criterii de scoruri. */
const NEWS = [
 ["iul. 2026","Impetigo","UKHSA: excludere până la 2 zile după începerea cremei cu peroxid de hidrogen.","impetigo"],
 ["mai 2026","Infecție neonatală","Ruptura membranelor >24 h la termen devine factor de risc; „se oprește” la 36 h dacă hemocultura e negativă; la ≥35 SA se poate lua în considerare trecerea la amoxicilină orală de la 36 h.","sepsis"],
 ["mai 2026","Constipație funcțională","Ghid nou ESPGHAN/NASPGHAN; PEG 0,4–0,8 g/kg/zi; Rome V: un singur set de criterii pentru toți copiii.","constipatie"],
 ["2026","Colica sugarului","Rome V o redenumește „sindromul de disconfort al sugarului”; regurgitația nu mai este entitate separată.","colica"],
 ["2026","Infecție urinară febrilă","EAU/ESPU: tratament 4–7 zile (NICE rămâne la 7–10).","itu"],
 ["feb. 2026","Urticarie acută","Ghid internațional nou (înlocuiește 2022); fără schimbări majore pentru forma acută.","urticarie"],
 ["mai 2026","Wheezing preșcolar","GINA 2026 menține doza mică de budesonid nebulizat la 500 µg/zi (≥1 an); nu există ghid ERS, doar declarația din 2024.","wheezing"],
 ["sept. 2025","Pneumonie comunitară","NICE NG250 înlocuiește NG138: amoxicilină 3 zile în forma non-severă.","pneumonie"],
 ["2024","Anemie feriprivă","OMS coboară pragul hemoglobinei la 6–23 luni la 105 g/L.","anemie"],
 ["2016 (RCP RO)","Oxiuriază","Vermox 100 mg comprimate contraindicat sub 6 ani în România; albendazol suspensie de la 2 ani.","oxiuri"]
];

/* Antibiotice pe o pagină: [indicație, id fișă, când, prima linie, durată, alergie la penicilină, linia a doua, sursă] */
const ABX = [
 ["Otită medie acută","oma","Majoritatea: fără antibiotic sau rețetă amânată (3 zile). Imediat: copil cu stare generală alterată. De luat în considerare: otoree, bilaterală sub 2 ani.","Amoxicilină 125 / 250 / 500 mg ×3/zi (1–11 luni / 1–4 ani / ≥5 ani)","5–7 zile","Claritromicină ×2/zi: 7,5 mg/kg (<8 kg), 62,5 mg (8–11 kg), 125 mg (12–19 kg)","Amoxicilină-clavulanat 125/31: 0,25 ml/kg ×3/zi sau 5 ml ×3/zi (1–5 ani), 5–7 zile","NICE NG91"],
 ["Pneumonie comunitară non-severă","pneumonie","Evaluare după semafor; trimitere de luat în considerare.","Amoxicilină 125 / 250 / 500 mg ×3/zi (3–11 luni / 1–4 ani / 5–11 ani)","3 zile (1–2 luni: 5 zile); se prelungește dacă nu e stabil","Claritromicină 3 zile (și la suspiciune de germen atipic)","Severă: amoxicilină-clavulanat 5 zile, plus claritromicină dacă germen atipic","NICE NG250, 2025"],
 ["Faringoamigdalită streptococică","faringita","FeverPAIN 4–5 sau Centor 3–4 (NICE); test rapid pozitiv (ESCMID).","Penicilină V 62,5 mg ×4 sau 125 mg ×2 (1–11 luni); 125 mg ×4 sau 250 mg ×2 (1–5 ani)","5–10 zile (ESCMID: 10)","Claritromicină 5 zile","—","NICE NG84; ESCMID 2012"],
 ["Scarlatină","scarlatina","Toate cazurile; nu se așteaptă cultura.","Penicilină V (dozele de mai sus)","10 zile","Claritromicină 10 zile sau azitromicină 5 zile","Amoxicilina nu e în tabelul UKHSA","UKHSA 2023"],
 ["Impetigo localizat, non-bulos","impetigo","Toate cazurile (topic).","Peroxid de hidrogen 1% cremă ×2–3/zi","5 zile","Acid fusidic 2% ×3/zi dacă peroxidul nu e potrivit sau nu răspunde; mupirocină la rezistență","—","NICE NG153"],
 ["Impetigo bulos, extins sau copil cu stare generală alterată","impetigo","Oral.","Flucloxacilină 62,5–125 mg ×4/zi (1 lună–1 an); 125–250 mg ×4/zi (2–9 ani)","5 zile (până la 7)","Claritromicină ×2/zi pe greutate","Nu se combină topic + oral","NICE NG153"],
 ["Infecție urinară febrilă","itu","Urocultură recoltată corect (fără pungă). Sub 3 luni: trimitere.","Cefalosporină de generația a III-a oral sau amoxicilină-clavulanat, după rezistența locală (EAU); NICE: cefalexină","4–7 zile (EAU 2026); NICE: 7–10","—","Parenteral: copil grav sau sub 2 luni","EAU/ESPU 2026; NICE NG224, NG111"],
 ["Gastroenterită acută","gea","Doar Shigella, Campylobacter cu diaree sanguinolentă, Salmonella la copil cu risc, sepsis.","Shigella: azitromicină 12 mg/kg ziua 1, apoi 6 mg/kg 4 zile","5 zile","—","Fără antibiotic de rutină","ESPGHAN/ESPID 2014"],
 ["Infecție neonatală precoce","sepsis","Un semn roșu sau ≥2 factori; spital.","Benzilpenicilină 25 mg/kg la 12 h + gentamicină 5 mg/kg IV","36 h dacă hemocultura e negativă; 7 zile dacă e confirmată","—","De la 36 h, la ≥35 SA: amoxicilină orală","NICE NG195, 2026"],
 ["Omfalită","granulom","Secreție purulentă, eritem sau edem periombilical; spital.","Flucloxacilină + gentamicină IV","—","—","—","NICE NG195"]
];

/* Excludere din colectivitate (UKHSA, 7 sept. 2026; NHS): [boală, id fișă sau "", perioadă] */
const EXCL = [
 ["Gastroenterită (diaree, vărsături)","gea","Până la 48 h după ultimul episod de diaree sau vărsături."],
 ["Varicelă","varicela","Până la crustificarea leziunilor, de obicei 5 zile de la apariția erupției (imunodeprimați: toate leziunile crustificate)."],
 ["Impetigo","impetigo","Până la crustificarea leziunilor sau 48 h după începerea antibioticului ori a cremei cu peroxid de hidrogen 1%."],
 ["Scarlatină","scarlatina","24 h după începerea antibioticului; netratată, până dispar simptomele."],
 ["Infecții respiratorii: răceală, otită, faringită, crup, bronșiolită","raceala","Fără excludere pentru simptome ușoare (rinoree, odinofagie, tuse ușoară). Stă acasă dacă are febră."],
 ["Exantem subit (roseola)","roseola","După ce trece febra; nu se așteaptă dispariția erupției."],
 ["Boala mână-gură-picior","mgp","Fără excludere."],
 ["Eritem infecțios (parvovirus B19)","parvovirus","Fără excludere; contagios doar înainte de erupție."],
 ["Conjunctivită","conjunctivita","Fără excludere."],
 ["Oxiuriază","oxiuri","Fără excludere."],
 ["Pediculoză","pediculoza","Fără excludere."],
 ["Molluscum contagiosum","molluscum","Fără excludere."],
 ["Tuse convulsivă (în afara fișelor)","","48 h după începerea antibioticului; fără antibiotic, 21 de zile de la debutul tusei."],
 ["Rujeolă (în afara fișelor)","","4 zile după apariția erupției."],
 ["Oreion (în afara fișelor)","","5 zile de la debutul tumefacției parotidiene."],
 ["Rubeolă (în afara fișelor)","","5 zile după apariția erupției."],
 ["Tinea (în afara fișelor)","","Până la începerea tratamentului."]
];

/* Criterii de scoruri (NICE NG143, NG84; ESPGHAN 2014) */
const AMBER = ["Paloare semnalată de părinți","Nu răspunde normal la stimuli sociali; nu zâmbește; se trezește doar la stimulare prelungită; activitate redusă","Bătăi ale aripilor nazale","Tahipnee: FR >50/min la 6–12 luni, >40/min peste 12 luni","SpO₂ ≤95% în aer","Raluri crepitante","Tahicardie: >160/min sub 12 luni, >150/min la 12–24 luni, >140/min la 2–5 ani","Timp de reumplere capilară ≥3 s","Mucoase uscate; alimentație deficitară la sugar; diureză redusă","3–6 luni cu temperatură ≥39 °C","Febră ≥5 zile","Frisoane","Tumefacția unui membru sau a unei articulații; nu se sprijină pe un membru sau nu îl folosește"];
const RED = ["Paloare, tegumente marmorate, cenușii sau cianotice","Nu răspunde la stimuli sociali; pare bolnav pentru un profesionist; nu se trezește sau nu rămâne treaz; plâns slab, ascuțit sau continuu","Geamăt; FR >60/min; tiraj moderat sau sever","Turgor cutanat scăzut","Sub 3 luni cu temperatură ≥38 °C","Erupție care nu pălește la presiune","Fontanelă bombată","Redoare de ceafă","Status epileptic","Semne neurologice focale; convulsii focale"];
const CENTOR = ["Temperatură >38 °C (în anamneză)","Exsudat amigdalian","Adenopatie cervicală anterioară dureroasă","Absența tusei"];
const FP = ["Febră în ultimele 24 h","Purulență amigdaliană","Consult în ≤3 zile de la debut","Amigdale sever inflamate","Fără tuse sau coriză"];
const CDS = [["a","Aspect general",["Normal","Însetat, neliniștit sau letargic, dar iritabil la atingere","Somnolent, hipoton, rece, transpirat; comatos"]],["o","Ochi",["Normali","Ușor înfundați","Foarte înfundați"]],["m","Mucoase (limbă)",["Umede","Lipicioase","Uscate"]],["l","Lacrimi",["Prezente","Reduse","Absente"]]];

if (typeof module !== "undefined") module.exports = { NEWS, ABX, EXCL, AMBER, RED, CENTOR, FP, CDS };
