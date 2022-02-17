/**
 * Stopout listener for handling a stream of stopout events
 */
export default class StopoutListener {

  /**
   * Calls a predefined function with the packets data
   * @param {Object[]} strategyStopoutEvent strategy stopout event with an array of packets
   */
  onStopout(strategyStopoutEvent: Object[]): Promise<void>;

}
