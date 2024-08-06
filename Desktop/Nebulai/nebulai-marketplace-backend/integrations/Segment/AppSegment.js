const { Analytics } = require("@segment/analytics-node");
 
class AppSegment {

  segmentWriteKey = process.env.SEGMENT_WRITE_KEY ?? null
  analytics = null;
  constructor() {
    if(this.segmentWriteKey && process.env.NODE_ENV === 'production'){
      this.analytics = new Analytics({
        writeKey: this.segmentWriteKey,
        flushAt: process.env.NODE_ENV === "development" ? 1 : 20,
      });
    }
  }

  async identify(data) {
    if(!this.analytics){
      console.log('Segment not initialized..');return;
    }
    try {
      this.analytics.identify(data);
    } catch (e) {
      console.error("AppSegment ERROR |identify| ", e.message);
    }
  }
};

module.exports = new AppSegment();
