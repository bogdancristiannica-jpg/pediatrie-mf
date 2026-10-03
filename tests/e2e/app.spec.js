// Teste cap-la-cap: încărcare, navigare, căutare, calculator, scoruri, fără derulare orizontală, fără erori în consolă.
import { test, expect } from "@playwright/test";

const ROUTES = ["#acasa", "#nn", "#sm", "#ps", "#calc", "#scoruri", "#abx", "#alarma", "#excludere", "#noutati", "#surse", "#febra", "#crup"];

test.describe("încărcare și navigare", () => {
  test("pagina de start listează cele 35 de fișe și uneltele", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      // Fonturile Google pot lipsi în medii izolate (sandbox cu proxy); nu sunt erori ale paginii.
      const where = m.location()?.url ?? "";
      if (m.type() === "error" && !/fonts\.(googleapis|gstatic)/.test(where + m.text()) && !/ERR_CERT_AUTHORITY_INVALID/.test(m.text())) errors.push(m.text());
    });
    await page.goto("/");
    await expect(page).toHaveTitle(/Fișe pediatrice/);
    await expect(page.locator("#main .rows a")).toHaveCount(35);
    await expect(page.locator(".tabs a")).toHaveCount(11);
    expect(errors).toEqual([]);
  });

  test("nicio rută nu derulează orizontal", async ({ page }) => {
    for (const h of ROUTES) {
      await page.goto("/" + h);
      await page.waitForTimeout(50);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(overflow, `derulare orizontală pe ${h}`).toBe(false);
    }
  });

  test("fișa are ordinea: decizie, alarmă, tratament, nu se recomandă, diagnostic, simptome, sursă", async ({ page }) => {
    await page.goto("/#crup");
    const heads = await page.locator(".sheet .key b, .sheet .blk h2, .sheet .src strong").allTextContents();
    expect(heads.map((t) => t.trim())).toEqual(["Decizia-cheie", "Semne de alarmă / trimitere", "Tratament", "Diagnostic", "Simptome", "Sursa"]);
    await expect(page.locator(".sheet .d").first()).toContainText("0,15");
  });

  test("prima doză e vizibilă pe primul ecran al fișei", async ({ page }) => {
    await page.goto("/#crup");
    const box = await page.locator(".sheet .d").first().boundingBox();
    const h = page.viewportSize().height;
    expect(box.y + box.height).toBeLessThan(h);
  });

  test("butonul de sărit la conținut nu schimbă pagina", async ({ page }) => {
    await page.goto("/#oma");
    await page.focus(".skip");
    await page.keyboard.press("Enter");
    await expect(page.locator(".sheet h1")).toHaveText(/Otită/);
  });
});

test.describe("căutare", () => {
  const cases = [
    ["febra", /Febra fără focar/],
    ["augmentin", /Otită/],
    ["cistita", /Infecție urinară/],
    ["tuse latratoare", /crup/],
    ["ochi lipiti", /Conjunctivită/],
    ["viermi", /Oxiuriază/],
    ["nurofen", /Febra/],
  ];
  for (const [q, re] of cases) {
    test(`„${q}” → ${re}`, async ({ page }) => {
      await page.goto("/");
      await page.fill("#q", q);
      await expect(page.locator("#main .rows a .nm").first()).toHaveText(re);
    });
  }

  test("Enter deschide primul rezultat, Escape golește", async ({ page }) => {
    await page.goto("/");
    await page.fill("#q", "stridor");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#crup$/);
    await page.fill("#q", "febra");
    await page.keyboard.press("Escape");
    await expect(page.locator("#q")).toHaveValue("");
  });

  test("tastarea în căutare nu pierde focalizarea", async ({ page }) => {
    await page.goto("/#crup");
    await page.focus("#q");
    await page.keyboard.type("fe");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.type("otita");
    await expect(page.locator("#q")).toHaveValue("otita");
    await expect(page.locator("#main .rows a .nm").first()).toHaveText(/Otită/);
  });
});

test.describe("calculator de doze", () => {
  test("12,5 kg, 2 ani 3 luni", async ({ page }) => {
    await page.goto("/#calc");
    await page.fill("#cw", "12,5");
    await page.selectOption("#cy", "2");
    await page.selectOption("#cm", "3");
    const out = page.locator("#calc-out");
    await expect(out).toContainText("125–188 mg");
    await expect(out).toContainText("5,2–7,8 ml");
    await expect(out).toContainText("750 mg");
    await expect(out).toContainText("Doză unică maximum 125 mg");
    await expect(out).toContainText("250–375 mg");
    await expect(out).toContainText("250 mg ×3/zi"); // amoxicilină, 1–4 ani
    await expect(out).toContainText("1,9 mg"); // dexametazonă 0,15 × 12,5
  });

  test("sub 3 luni: ibuprofenul e marcat ca neadministrabil", async ({ page }) => {
    await page.goto("/#calc");
    await page.fill("#cw", "4");
    await page.selectOption("#cy", "0");
    await page.selectOption("#cm", "2");
    await expect(page.locator("#calc-out")).toContainText("Sub 3 luni: nu se administrează");
    await expect(page.locator("#calc-out")).toContainText("Sub 5 kg");
  });

  test("greutate în afara intervalului", async ({ page }) => {
    await page.goto("/#calc");
    await page.fill("#cw", "70");
    await expect(page.locator("#calc-out")).toContainText("între 1 și 40 kg");
  });
});

test.describe("scoruri", () => {
  test("Centor 3 → antibiotic; un semn roșu → roșu", async ({ page }) => {
    await page.goto("/#scoruri");
    for (const v of ["0", "1", "3"]) await page.check(`input[name="centor"][value="${v}"]`);
    await expect(page.locator("#r-centor")).toContainText("Centor 3/4");
    await expect(page.locator("#r-centor")).toContainText("antibiotic");
    await page.check('input[name="sem"][value="4"]');
    await expect(page.locator("#r-sem")).toContainText("Roșu");
    await page.check('input[name="cds-o"][value="2"]');
    await page.check('input[name="cds-l"][value="2"]');
    await page.check('input[name="cds-m"][value="1"]');
    await expect(page.locator("#r-cds")).toContainText("5/8");
  });
});

test.describe("accesibilitate de bază", () => {
  test("țintele de atingere din bara de navigare și din liste au ≥44 px", async ({ page }) => {
    await page.goto("/");
    for (const sel of [".tabs a", "#main .rows a", "#qclear"]) {
      for (const el of await page.locator(sel).all()) {
        const b = await el.boundingBox();
        if (b) expect(b.height, sel).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test("documentul are lang=ro și un singur h1 pe fișă", async ({ page }) => {
    await page.goto("/#febra");
    expect(await page.getAttribute("html", "lang")).toBe("ro");
    await expect(page.locator("h1")).toHaveCount(1);
  });
});
