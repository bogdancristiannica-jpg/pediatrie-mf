---
name: ios-simulator
description: Verifică pagina în simulatorul iOS (Safari pe iPhone) — pornește serverul local, deschide adresa în simulator, face capturi de ecran și verifică zonele sigure, tastatura și „Adaugă pe ecranul principal”. Folosește-l după orice schimbare de interfață sau înainte de un release.
---

# Verificare în simulatorul iOS

Scop: să vezi pagina exact cum o vede un medic pe iPhone, în Safari, nu doar în emularea Playwright/WebKit.
Comenzile `xcrun simctl` fac parte din Xcode; cer macOS cu Xcode și un runtime iOS instalat.

## Pași

1. Construiește și pornește serverul local (ascultă pe toate interfețele, portul 4173):
   ```bash
   npm run dev
   ```
2. Alege și pornește un iPhone (prima dată; simulatorul reține starea):
   ```bash
   xcrun simctl list devices available | grep -i iphone
   xcrun simctl boot "iPhone 16"      # sau alt nume din listă
   open -a Simulator
   ```
3. Deschide pagina în Safari din simulator (simulatorul folosește rețeaua gazdei, deci `localhost` merge):
   ```bash
   xcrun simctl openurl booted http://localhost:4173/
   ```
4. Captură de ecran pentru fiecare ecran verificat (le citești cu unealta Read):
   ```bash
   xcrun simctl io booted screenshot /tmp/sim-acasa.png
   xcrun simctl openurl booted "http://localhost:4173/#calc" && xcrun simctl io booted screenshot /tmp/sim-calc.png
   ```
5. Rotește în peisaj din meniul Simulatorului (Device → Rotate) și repetă captura pentru o fișă lungă.

## Lista de verificare (bifează în raport)

- [ ] Bara de căutare nu declanșează mărirea paginii la atingere (fontul câmpului e 17 px).
- [ ] Antetul lipicios nu acoperă conținutul după derulare; în peisaj devine normal (nu lipicios).
- [ ] Nimic nu intră sub Dynamic Island sau sub marginile rotunjite (zone sigure stânga/dreapta în peisaj).
- [ ] Marcajul „✕” din „Nu se recomandă” se afișează (Safari nu suportă `::marker` cu `content`).
- [ ] Tastatura nu acoperă rezultatul calculatorului când tastezi greutatea.
- [ ] Partajare → „Adaugă pe ecranul principal”: pictograma și numele „Fișe pediatrice” apar; aplicația se deschide fără bara Safari.
- [ ] Modul avion după prima deschidere a versiunii publicate (Pages): pagina se deschide din cache.

## Când nu merge

- `Unable to boot device`: `xcrun simctl shutdown all` apoi reia pasul 2.
- Pagina nu se încarcă: verifică `curl -I http://localhost:4173/` pe gazdă; serverul trebuie să ruleze din acest repo.
- Service worker-ul nu e activ pe `http://localhost`? Este: localhost e tratat ca origine sigură. Pe alte adrese http nu.

Raportează perimetrul: „Am verificat: ecranele X, Y în portret și peisaj pe iPhone N, iOS M. NU am verificat: Z.”
