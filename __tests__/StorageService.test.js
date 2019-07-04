import StorageService from "../source/services/StorageService";

test('Test saveData', () => {
    // expect(StorageService.saveData('testBool', false)).toBe(false);
    StorageService.saveData('testBool', true).then(() => {
        StorageService.getData('testBool').then((value => {
            expect(value, true);
        }))
    })
});
