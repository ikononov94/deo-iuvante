module.exports = {
  rootUrl: 'https://ikononov-deo-iuvante-test.herokuapp.com',
  gridUrl: 'http://localhost:4444/wd/hub',
  compositeImage: true,
  windowSize: '360x772',
  retry: 3,

  browsers: {
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          mobileEmulation: {
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X)'
            + ' AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4',
            deviceMetrics: {
              width: 360,
              height: 640,
              pixelRatio: 1
            }
          }
        }
      }
    }
  }
};
