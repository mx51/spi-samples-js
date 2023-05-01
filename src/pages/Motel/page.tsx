// TODO: It is recommended to wrap inputs in the label that they are associated with (remove line below)
/* eslint jsx-a11y/label-has-associated-control: ["error", { assert: "either" } ] */

import React, { Component } from 'react';
import { Logger } from '@mx51/spi-client-js';
import MotelPos from './pos';

class Page extends Component {
  componentDidMount() {
    const log = console;
    try {
      const receipt = new Logger(
        document.getElementById('receipt_output')!,
        `\n\n \\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/ \n\n`
      );
      const flowMsg = new Logger(document.getElementById('flow_msg')!);
      const pos = new MotelPos(log, receipt, flowMsg);
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
      <div className="legacy-pos status-unpaired flow-idle">
        <table id="layout">
          <tbody>
            <tr>
              <td className="col settings" rowSpan={2}>
                <h1>Settings</h1>
                <div className="padding-1">
                  <form name="settings" id="settings-form" onSubmit={() => false}>
                    <fieldset>
                      <legend>EFTPOS config</legend>
                      <table className="form">
                        <tbody>
                          <tr>
                            <th scope="row">
                              <label htmlFor="pos_id">Pos ID:</label>
                            </th>
                            <td>
                              <input
                                type="text"
                                className="medium input"
                                name="pos_id"
                                id="pos_id"
                                placeholder="Pos ID"
                                defaultValue="MOTELPOS1"
                                required
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">
                              <label htmlFor="eftpos_address">EFTPOS Address:</label>
                            </th>
                            <td>
                              <input
                                type="text"
                                className="medium input"
                                name="eftpos_address"
                                id="eftpos_address"
                                placeholder="EFTPOS address"
                                defaultValue="192.168.1.1"
                                required
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">
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
                            <th scope="row">
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
                            <th scope="row">
                              <label htmlFor="print_merchant_copy">Merchant copy:</label>
                            </th>
                            <td>
                              <input
                                type="checkbox"
                                className="input"
                                id="print_merchant_copy"
                                name="print_merchant_copy"
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
                        </tbody>
                      </table>
                    </fieldset>
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
                    <button type="button" className="input" id="pair_cancel">
                      Cancel Pairing
                    </button>

                    <button type="button" className="input" id="acct_verify">
                      Verify account
                    </button>
                    <button type="button" className="input" id="preauth_open">
                      Open Preauth
                    </button>
                    <button type="button" className="input" id="preauth_topup">
                      Topup Preauth
                    </button>
                    <button type="button" className="input" id="preauth_topdown">
                      Reduce Preauth
                    </button>
                    <button type="button" className="input" id="preauth_extend">
                      Extend Preauth
                    </button>
                    <button type="button" className="input" id="preauth_complete">
                      Complete Preauth
                    </button>
                    <button type="button" className="input" id="preauth_cancel">
                      Cancel Preauth
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

                  <fieldset id="surcharge_input" className="input">
                    <label htmlFor="surcharge">Surcharge: </label>
                    <input
                      type="number"
                      id="surcharge"
                      name="surcharge"
                      defaultValue="0"
                      placeholder="Surcharge (cents)"
                    />
                  </fieldset>

                  <fieldset id="preauth_ref_input" className="input">
                    <label htmlFor="preauth_ref">Preauth Ref #: </label>
                    <input
                      type="tel"
                      minLength={8}
                      id="preauth_ref"
                      name="preauth_ref"
                      defaultValue=""
                      placeholder="Preauth reference"
                    />
                  </fieldset>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Page;
