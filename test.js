var assert = require('assert');
var {isRootSync} = require('./index.js') 




describe('isRootSync', function () {
  
    it('C: should be root', function() {
        let path = 'C:'
        assert.equal(true, isRootSync(path));
    });

    it('C:\\ should be root', function() {
        let path = 'C:\\'
        assert.equal(true, isRootSync(path));
    });

    it('C:\\test\\ should not be root', function() {
        let path = 'C:\\test\\'
        assert.equal(false, isRootSync(path));
    });

})