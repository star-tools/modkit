/**
 * SC2ModReader Jest Test Suite
 * 
 * This test verifies the SC2ModReader's ability to:
 * 
 * - Load StarCraft II mod files from the filesystem as .SC2Mod MPQ archives
 * - Load mod files from inside .zip archives, including nested zip paths (zip-in-zip)
 * - Merge multiple mods into one, correctly combining catalogs
 * - Handle multiple base directories and resolve relative/absolute paths properly
 * 
 * Expected behavior:
 * - All individual reads return mods with 9 catalogs
 * - Merging mods results in 11 catalogs
 */

import SC2ModReader from "../src/SC2ModReader";

const test_examples_directory = "/Applications/StarCraft II/tools/modkit/docs/test";

describe('SC2ModReader', () => {

    let testReader1;

    beforeAll(() => {
        testReader1 = new SC2ModReader(test_examples_directory);
    });

    test('should load example.SC2Mod with 9 catalogs', async () => {
        const testMod1 = await testReader1.read("example.SC2Mod");
        expect(testMod1.catalogs.length).toBe(9);
    });

    test('should load mod from inside zip with 9 catalogs', async () => {
        const testMod2 = await testReader1.read("example.zip:cnc-data.SC2Mod");
        expect(testMod2.catalogs.length).toBe(9);
    });

    test('should load mod from nested zip with 9 catalogs', async () => {
        const testMod3 = await testReader1.read("example2.zip:example.zip:cnc-data.SC2Mod");
        expect(testMod3.catalogs.length).toBe(9);
    });

    test('should merge multiple mods resulting in 11 catalogs', async () => {
        const testMod4 = await testReader1.merge([
            "example.SC2Mod",
            "example.zip:cnc-data.SC2Mod",
            "example2.zip:example.zip:cnc-data.SC2Mod"
        ]);
        expect(testMod4.catalogs.length).toBe(11);
    });

    describe('with multiple base directories', () => {

        let testReader2;

        beforeAll(() => {
            testReader2 = new SC2ModReader({
                base: "/Applications/StarCraft II/",
                directories: {
                    test1: test_examples_directory,
                    test2: './tools/modkit/docs/test/',
                }
            });
        });

        test('should load test1:example.SC2Mod with 9 catalogs', async () => {
            const testMod5 = await testReader2.read("test1:example.SC2Mod");
            expect(testMod5.catalogs.length).toBe(9);
        });

        test('should load test2:example.SC2Mod with 9 catalogs', async () => {
            const testMod6 = await testReader2.read("test2:example.SC2Mod");
            expect(testMod6.catalogs.length).toBe(9);
        });

    });

});
