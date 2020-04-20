// TODO: It is recommended to wrap inputs in the label that they are associated with (remove line below)
/* eslint jsx-a11y/label-has-associated-control: ["error", { assert: "either" } ] */

import React, { Component, Props } from 'react';
import { Logger } from '@mx51/spi-client-js';
import KebabPos from './pos';

class Page extends Component {
  componentDidMount() {
    const log = console;
    try {
      const receipt = new Logger(
        document.getElementById('receipt_output'),
        `\n\n \\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/ \n\n`
      );
      const flowMsg = new Logger(document.getElementById('flow_msg'));
      const pos = new KebabPos(log, receipt, flowMsg);
      pos.Start();
    } catch (err) {
      log.error(err);
    }
  }

  componentWillUnmount() {
    window.location.reload();
  }

  render() {
    return (
      <div className="status-unpaired flow-idle">
        <table id="layout">
          <tr>
            <td className="col settings" rowSpan={2}>
              <h1>Settings</h1>
              <div className="padding-1">
                <form name="settings" onSubmit={() => false}>
                  <table className="form">
                    <tr>
                      <th>
                        <label htmlFor="pos_id">Pos ID:</label>
                      </th>
                      <td>
                        <input
                          type="text"
                          className="input"
                          name="pos_id"
                          id="pos_id"
                          placeholder="Pos ID"
                          defaultValue="KEBABPOS1"
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label htmlFor="eftpos_address">EFTPOS Address:</label>
                      </th>
                      <td>
                        <input
                          type="text"
                          className="input"
                          name="eftpos_address"
                          id="eftpos_address"
                          placeholder="EFTPOS address"
                          defaultValue="192.168.1.1"
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label htmlFor="rcpt_from_eftpos">Receipt from EFTPOS:</label>
                      </th>
                      <td>
                        <input
                          type="checkbox"
                          className="input"
                          id="rcpt_from_eftpos"
                          name="rcpt_from_eftpos"
                          defaultValue="false"
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label htmlFor="sig_flow_from_eftpos">Sig from EFTPOS:</label>
                      </th>
                      <td>
                        <input
                          type="checkbox"
                          className="input"
                          id="sig_flow_from_eftpos"
                          name="sig_flow_from_eftpos"
                          defaultValue="false"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>&nbsp;</td>
                      <td>
                        <button type="button" className="input no-hide" id="save_settings">
                          Save
                        </button>
                      </td>
                    </tr>
                  </table>
                </form>
              </div>
              <h1>Status</h1>
              <div className="padding-1 status">
                <p id="status_indicator" data-status="Unpaired" data-flow="Idle">
                  <span id="primary_status">Unpaired</span>
                  <span>: </span>
                  <span id="flow_status" className="flow_status">
                    Idle
                  </span>
                </p>
                <p className="paring-buttons">
                  <button type="button" className="input" id="pair">
                    PAIR
                  </button>
                  <button type="button" className="input" id="unpair">
                    UNPAIR
                  </button>
                </p>
              </div>
            </td>
            <td className="col flow">
              <h1>
                Flow: <span id="flow_status_heading">Idle</span>
              </h1>
              <div className="padding-1">
                <div>
                  <p id="flow_msg" />
                </div>
                <pre id="log" />
              </div>
            </td>
            <td className="col receipt" rowSpan={2}>
              <h1>Receipt</h1>
              <div className="padding-1">
                <div id="receipt_output" />
              </div>
            </td>
          </tr>
          <tr>
            <td className="col actions">
              <h1>Actions</h1>

              <div className="padding-1">
                <p className="action-buttons">
                  <button type="button" className="input" id="pair_confirm">
                    Confirm Code
                  </button>
                  <button type="button" className="input" id="pair_cancel">
                    Cancel Pairing
                  </button>
                  <button type="button" className="input" id="purchase">
                    Purchase
                  </button>
                  <button type="button" className="input" id="moto">
                    Moto
                  </button>
                  <button type="button" className="input" id="cashout">
                    Cashout
                  </button>
                  <button type="button" className="input" id="refund">
                    Refund
                  </button>
                  <button type="button" className="input" id="settle">
                    Settle
                  </button>
                  <button type="button" className="input" id="settle_enq">
                    Settle Enquiry
                  </button>
                  <button type="button" className="input" id="glt">
                    Get Last Transaction
                  </button>
                  <button type="button" className="input" id="tx_sign_accept">
                    Accept Signature
                  </button>
                  <button type="button" className="input" id="tx_sign_decline">
                    Decline Signature
                  </button>
                  <button type="button" className="input" id="tx_cancel">
                    Cancel
                  </button>
                  <button type="button" className="input" id="tx_auth_code">
                    Phone Auth
                  </button>
                  <button type="button" className="input" id="recover">
                    Recover
                  </button>
                  <button type="button" className="input" id="ok">
                    Ok
                  </button>
                  <button type="button" className="input" id="ok_cancel">
                    Cancel
                  </button>
                </p>

                <fieldset id="amount_input" className="input">
                  <label htmlFor="amount">Amount (cents): </label>
                  <input type="number" id="amount" name="amount" defaultValue="10" placeholder="Amount (cents)" />
                </fieldset>
                <fieldset id="tip_amount_input" className="input">
                  <label htmlFor="tip_amount">Tip Amount (cents): </label>
                  <input
                    type="number"
                    id="tip_amount"
                    name="tip_amount"
                    defaultValue="0"
                    placeholder="Tip Amount (cents)"
                  />
                </fieldset>
                <fieldset id="cashout_amount_input" className="input">
                  <label htmlFor="cashout_amount">Cash out amount (cents): </label>
                  <input
                    type="number"
                    id="cashout_amount"
                    name="cashout_amount"
                    defaultValue="0"
                    placeholder="Cash out Amount (cents)"
                  />
                </fieldset>
                <fieldset id="prompt_for_cash_input" className="input">
                  <label htmlFor="prompt_for_cash">Prompt for Cash?: </label>
                  <input type="checkbox" id="prompt_for_cash" name="prompt_for_cash" defaultValue="false" />
                </fieldset>
                <fieldset id="pos_ref_id_input" className="input">
                  <label htmlFor="pos_ref_id">Pos Ref ID: </label>
                  <input type="text" id="pos_ref_id" name="pos_ref_id" placeholder="Pos Ref ID" defaultValue="" />
                </fieldset>
                <fieldset id="auth_code_input" className="input">
                  <label htmlFor="auth_code">Auth Code: </label>
                  <input
                    type="tel"
                    id="auth_code"
                    name="auth_code"
                    placeholder="Submit Phone For Auth Code"
                    defaultValue=""
                  />
                </fieldset>
              </div>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

export default Page;
