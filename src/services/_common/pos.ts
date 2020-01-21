import { SuccessState } from '@assemblypayments/spi-client-js';

class Pos {
  registeredEventListeners: any = [];

  // Element value getter methods
  static getElementValue(elementSelector: string) {
    const element = document.querySelector(elementSelector);
    return element ? (element as HTMLInputElement).value : '';
  }

  static getElementSanitizedValue(elementSelector: string) {
    return Pos.sanitizePrintText(Pos.getElementValue(elementSelector));
  }

  static getElementCheckboxValue(elementSelector: string) {
    const element = document.querySelector(elementSelector);
    return element ? (element as HTMLInputElement).checked : false;
  }

  static getElementNumberValue(elementSelector: string) {
    const value = Pos.getElementValue(elementSelector);
    return value ? parseInt(value, 10) : 0;
  }

  // Cleans RTF strings so that the terminal will accept them
  static sanitizePrintText(printText: string) {
    let sanitizedText = printText.replace('\\emphasis', 'emphasis');
    sanitizedText = sanitizedText.replace('\\clear', 'clear');
    return sanitizedText.replace('\r\n', '\n');
  }

  // Helper method to shorten and bind adding an event listener
  addUiOperation(elementSelector: string, eventType: string, operationFunction: Function): boolean {
    const boundFunction = operationFunction.bind(this);
    const targetEl = document.querySelector(elementSelector);

    if (!targetEl) return false;
    targetEl.addEventListener(eventType, boundFunction);
    this.registeredEventListeners.push({
      targetEl,
      eventType,
      boundFunction,
    });

    return true;
  }

  // Helper to route the resulting tranaction state to the correct handler
  static processCompletedEvent(flowMsg: Logger, receipt: Logger, eventType: any, transactionState: any) {
    const transactionStateMap = {
      [SuccessState.Failed]: eventType.handleFailedTransaction,
      [SuccessState.Success]: eventType.handleSuccessfulTransaction,
      [SuccessState.Unknown]: eventType.handleUnknownState,
    };
    const trasactionStateHandler = transactionStateMap[transactionState.Success];
    console.log('###', transactionState.Success);

    if (!trasactionStateHandler) {
      throw new Error('Unknown transaction state');
    }

    trasactionStateHandler(flowMsg, receipt, transactionState.Response);
  }
}

export default Pos;
