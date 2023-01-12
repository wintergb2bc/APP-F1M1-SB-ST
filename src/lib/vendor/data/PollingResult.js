//輪詢結果
export default class PollingResult {
  /**
   * @param NewData (更新後的)新數據
   * @param Changes 本次變更
   */
  constructor(
    NewData,
    Changes = [],
  )
  {
    Object.assign(this, {NewData, Changes});
  }
}