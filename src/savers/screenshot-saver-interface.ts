/* eslint-disable no-unused-vars */
export interface ScreenshotSaverInterface {
  /**
   * @returns {Promise<string>} the place where the image is stored
   */
  saveScreenshot(
    imageBuffer: Buffer,
    type: string,
    filename: string
  ): Promise<string>;
}
