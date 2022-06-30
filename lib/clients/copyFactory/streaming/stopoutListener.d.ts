import {CopyFactoryStrategyStopout} from '../trading.client';

/**
 * Stopout listener for handling a stream of stopout events
 */
export default class StopoutListener {

  /**
   * Calls a predefined function with the packets data
   * @param {CopyFactoryStrategyStopout[]} strategyStopoutEvent strategy stopout event with an array of packets
   */
  onStopout(strategyStopoutEvent: CopyFactoryStrategyStopout[]): Promise<void>;

}
