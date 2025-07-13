import fs from 'fs';
import path from 'path';
import { SC2JSON } from '../src/converter/SC2XMLJSON.js';
import { SC2JSONDebugger } from '../src/converter/debugger.js';

describe('SC2JSON Converter', () => {
  let converter;
  let debuggerInstance;

  beforeEach(() => {
    debuggerInstance = new SC2JSONDebugger({ file: './debug.json' });
    converter = new SC2JSON({ debugger: debuggerInstance });
  });

  test('converts sample XML to JSON and back to XML', () => {
    const xmlText = `
      <Catalog>
        <CUnit id="Marine">
          <LifeMax value="45"/>
          <Speed value="2.25"/>
          <Attributes index="Light" value="1"/>
          <GlossaryStrongArray value="Marauder"/>
          <WeaponArray Link="GuassRifle"/>
        </CUnit>
      </Catalog>
    `;

    // Convert XML to JSON
    const json = converter.toJSON(xmlText);

    expect(json).toHaveProperty('Catalog');
    expect(Array.isArray(json.Catalog)).toBe(true);

    const marine = json.Catalog.find(u => u.id === 'Marine');
    expect(marine).toBeDefined();
    expect(marine.LifeMax.value).toBe('45');

    // Convert JSON back to XML
    const xmlOutput = converter.toXML(json);

    expect(xmlOutput).toContain('<CUnit');
    expect(xmlOutput).toContain('LifeMax');
    expect(xmlOutput).toContain('value="45"');

    // Timing info
    expect(typeof debuggerInstance.executionDurationMs).toBe('number');
  });

  test('parses and converts a large XML file', () => {
    const xmlPath = path.resolve(__dirname, '../test/unitdata.test.xml');
    const xmlData = fs.readFileSync(xmlPath, 'utf8');

    debuggerInstance.start();
    const jsonData = converter.toJSON(xmlData);
    debuggerInstance.finish();

    expect(jsonData).toHaveProperty('Catalog');
    expect(Array.isArray(jsonData.Catalog)).toBe(true);
    expect(debuggerInstance.executionDurationMs).toBeGreaterThan(0);
  });

  test('debugger records unknown enums and missing schema', () => {
    // Prepare XML with unknown enum and missing schema fields
    const xmlText = `
      <Catalog>
        <CUnit id="TestUnit" UnknownField="unknownValue">
          <Attributes index="UnknownIndex" value="5"/>
        </CUnit>
      </Catalog>
    `;

    converter.toJSON(xmlText);

    const debugData = debuggerInstance.options?.debugData || {}; // adapt if you expose debug data

    expect(debugData.enum).toBeDefined();
    expect(debugData.schema).toBeDefined();
  });

  test('load partial document with specified Schema', () => {
      const CAbilResearchjson = converter.toJSON(`
          <InfoArray index="Research1" Time="80" Upgrade="VoidRaySpeedUpgrade">
              <Resource index="Minerals" value="150"/>
              <Resource index="Vespene" value="150"/>
              <Button DefaultButtonFace="ResearchVoidRaySpeedUpgrade" State="Restricted" Requirements="LearnVoidRaySpeedUpgrade">
                  <Flags index="ShowInGlossary" value="1"/>
              </Button>
          </InfoArray>
      `,SCSchema.struct.SAbilResearchInfo );
      expect(CAbilResearchjson.Button.Flags.ShowInGlossary).toBe(1);
  });


  test('Apply patches test todo', () => {

    let converter = new SC2JSON({ debugger: cdebugger });

    let hydra = converter.toJSON(`<CUnit id="Hydralisk" actor="xxx"></CUnit>`,SCSchema.classes.CUnit)

    let hydra1 = applyPatchesDeep(hydra)
    expect(hydra1).toBeDefined();
  });


});
