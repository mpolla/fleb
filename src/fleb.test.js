const { sanoHei, parseName, parseGrid, parseComment, parseQslmessage, updateQsoList, printAdif, parseCall, parseMode, detectband } = require("./fleb.js");
const {makeJsonArray, parseSotaref} = require("./fleb");

var fs = require("fs");


test('Parse call', () => {
  expect(parseCall("on1on")).toBe("ON1ON");

  // Random LotW users from http://www.hb9bza.net/lotw/lotw.txt
  expect(parseCall("SM/DL1FWN/P")).toBe("SM/DL1FWN/P");
  expect(parseCall("SM5CBM")).toBe("SM5CBM");
  expect(parseCall("WA2FON/VE9")).toBe("WA2FON/VE9");
  expect(parseCall("ZS1/GJ7LJJ/P")).toBe("ZS1/GJ7LJJ/P");
  expect(parseCall("ZV9ARSATC")).toBe("ZV9ARSATC");
  expect(parseCall("2E0AAO")).toBe("2E0AAO");
  // These are not call signs
  expect(parseCall(" 80m ")).toBe(null);
  expect(parseCall("1001 ft8")).toBe(null);
  expect(parseCall("1237 @Bridgette ft8 <foo>")).toBe(null);
  // Test context
  expect(parseCall("1201 on2on")).toBe("ON2ON");
  expect(parseCall(" on3on ")).toBe("ON3ON");
  expect(parseCall("23 sm/oh2cme/p #KP20 [asdf] @Mike <foo>")).toBe("SM/OH2CME/P");

  // 9X5RU Rwanda
  expect(parseCall("9X5RU")).toBe("9X5RU");
  // Bouvet island dxpedition 2023
  expect(parseCall("3y0j")).toBe("3Y0J")
  // King Hussein of Jordan
  expect(parseCall("jy1")).toBe("JY1")
  // Aalto University satellite Foresail-1
  expect(parseCall("OH2F1S")).toBe("OH2F1S")
})

test('Parse name', () => {
  expect(parseName("33 oh2cme @Matti #KP20")).toBe("Matti");
  expect(parseName("33 oh2cme #KP20")).toBe(null);
});

test('Parse grid', () => {
  expect(parseGrid("33 oh2cme @Matti #KP20")).toBe("KP20");
  expect(parseGrid("33 oh2cme @Matti #KP20lf")).toBe("KP20lf");
  expect(parseGrid("33 oh2cme @Matti")).toBe(null);
  expect(parseGrid("mygrid #KP20")).toBe("KP20");
  expect(parseGrid("mygrid KP20lf")).toBe("KP20lf");
});


test('Parse comment', () => {
  expect(parseComment("33 oh2cme @Matti <comment> #KP20")).toBe("comment");
  expect(parseComment("33 oh2cme @Matti < comment > #KP20")).toBe("comment");
  expect(parseComment("33 oh2cme @Matti #KP20")).toBe(null);
});

test('Parse mode', () => {
  expect(parseMode("80m cw 2335 ra3ax")).toBe("CW");
  expect(parseMode("3.525 cw 2335 ra3ax")).toBe("CW");
  expect(parseMode("20m cw")).toBe("CW");
  expect(parseMode(" ft8 ")).toBe("FT8");
  expect(parseMode("10m ssb asdf")).toBe("SSB");
  expect(parseMode("bft8aaaassbbbssbsbcwcwcwcwcw")).toBe(null);
});

test('Parse QSL message', () => {
  expect(parseQslmessage("33 oh2cme @Matti [jotain] #KP20")).toBe("jotain");
  expect(parseQslmessage("33 oh2cme @Matti #KP20")).toBe(null);
});

test('Parse SOTA reference', () => {
  expect(parseSotaref("2203 sm2bb SM/NB-011")).toBe("SM/NB-011")
})

test('Detect band for frequency', () => {
  expect(detectband("14.044")).toBe("20m");
  expect(detectband("3.699")).toBe("80m");
  expect(detectband("145.500")).toBe("2m");
});


test('Parse ADIF export: basic.txt', () => {
  let txt = fs.readFileSync("./src/test/basic.txt").toString('utf-8');
  let adi = fs.readFileSync("./src/test/basic.adi").toString('utf-8')
      .replace("ADIF Export for Fast Log Entry by DF3CB", "ADIF Export for Fast Log Entry in-Browser by OH2CME")
      .replace('<PROGRAMID:3>FLE', '<PROGRAMID:4>FLEB');
  expect(printAdif(makeJsonArray(txt))).toBe(adi);
})

test('Parse ADIF export: sample_wwff_sota.txt', () => {
  let txt = fs.readFileSync("./src/test/sample_wwff_sota.txt").toString('utf-8');
  let adi = fs.readFileSync("./src/test/sample_wwff_sota.adi").toString('utf-8')
      .replace("ADIF Export for Fast Log Entry by DF3CB", "ADIF Export for Fast Log Entry in-Browser by OH2CME")
      .replace('<PROGRAMID:3>FLE', '<PROGRAMID:4>FLEB');
  expect(printAdif(makeJsonArray(txt))).toBe(adi);
})

test('Parse ADIF export: sample_dxpedition.txt', () => {
  let txt = fs.readFileSync("./src/test/sample_dxpedition.txt").toString('utf-8');
  let adi = fs.readFileSync("./src/test/sample_dxpedition.adi").toString('utf-8')
      .replace("ADIF Export for Fast Log Entry by DF3CB", "ADIF Export for Fast Log Entry in-Browser by OH2CME")
      .replace('<PROGRAMID:3>FLE', '<PROGRAMID:4>FLEB');
  expect(printAdif(makeJsonArray(txt))).toBe(adi);
})