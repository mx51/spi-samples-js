// TODO: It is recommended to wrap inputs in the label that they are associated with (remove line below)
/* eslint jsx-a11y/label-has-associated-control: ["error", { assert: "either" } ] */

import React, { Component } from 'react';
import { Logger } from '@assemblypayments/spi-client-js';
import RamenPos from './pos';

class Page extends Component {
  componentDidMount() {
    const log = console;
    try {
      const receipt = new Logger(
        document.getElementById('receipt_output'),
        `\n\n \\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/ \n\n`
      );
      const flowMsg = new Logger(document.getElementById('flow_msg'));
      const pos = new RamenPos(log, receipt, flowMsg);
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
                <form name="settings" id="settings_form">
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
                          placeholder="POS ID"
                          defaultValue="RAMENPOS1"
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label htmlFor="pos_vendor_key">API Key:</label>
                      </th>
                      <td>
                        <input
                          type="text"
                          className="input"
                          name="pos_id"
                          id="pos_vendor_key"
                          placeholder="POS Vendor Key"
                          defaultValue="RamenPosDeviceIpApiKey"
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label htmlFor="serial_number">Serial #:</label>
                      </th>
                      <td>
                        <input
                          type="text"
                          className="input"
                          name="serial_number"
                          id="serial_number"
                          placeholder="XXX-XXX-XXX"
                          defaultValue=""
                          pattern="[0-9]{3}-[0-9]{3}-[0-9]{3}"
                          minLength={11}
                          maxLength={11}
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
                          defaultValue="1"
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
                          defaultValue="1"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>&nbsp;</td>
                      <td>
                        <button type="submit" className="input no-hide" id="save_settings">
                          Save
                        </button>
                      </td>
                    </tr>
                  </table>
                </form>
              </div>
              <h1>Auto Address Settings</h1>
              <div className="padding-1 status">
                <form name="address_settings" id="address_settings_form">
                  <table className="form">
                    <tr>
                      <th>
                        <label htmlFor="test_mode">Test mode:</label>
                      </th>
                      <td>
                        <input type="checkbox" className="input" id="test_mode" name="test_mode" defaultValue="1" />
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label htmlFor="use_secure_web_sockets">Secure WebSockets:</label>
                      </th>
                      <td>
                        <input
                          type="checkbox"
                          className="input"
                          id="use_secure_web_sockets"
                          name="use_secure_web_sockets"
                          defaultValue="1"
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label htmlFor="auto_resolve_eftpos_address">Auto Address:</label>
                      </th>
                      <td>
                        <input
                          type="checkbox"
                          className="input"
                          id="auto_resolve_eftpos_address"
                          name="auto_resolve_eftpos_address"
                          defaultValue="1"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>&nbsp;</td>
                      <td>
                        <button type="submit" className="input no-hide" id="save_address_settings">
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
                  <button type="button" className="input" id="settle">
                    Settle
                  </button>
                  <button type="button" className="input" id="settle_enq">
                    Settle Enquiry
                  </button>
                  <button type="button" className="input" id="glt">
                    Get Last Transaction
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
                  <button type="button" className="input" id="print">
                    Print
                  </button>
                  <button type="button" className="input" id="save_receipt">
                    Save receipt
                  </button>
                  <button type="button" className="input" id="terminal_status">
                    Terminal Status
                  </button>
                  <button type="button" className="input" id="ok">
                    Ok
                  </button>
                  <button type="button" className="input" id="ok_retry">
                    Ok Retry
                  </button>
                  <button type="button" className="input" id="ok_override_paid">
                    Ok Override Paid
                  </button>
                  <button type="button" className="input" id="ok_cancel">
                    Ok Transaction Unsuccessful
                  </button>
                </p>

                <fieldset id="purchase_inputs" className="input">
                  <h3>Purchase / Moto / Cashout / Refund</h3>
                  <div id="amount_input">
                    <label htmlFor="amount">Amount (cents): </label>
                    <input type="number" id="amount" name="amount" defaultValue="10" placeholder="Amount (cents)" />
                  </div>
                  <div id="tip_amount_input">
                    <label htmlFor="tip_amount">Tip Amount (cents): </label>
                    <input
                      type="number"
                      id="tip_amount"
                      name="tip_amount"
                      defaultValue="0"
                      placeholder="Tip Amount (cents)"
                    />
                  </div>
                  <div id="cashout_amount_input">
                    <label htmlFor="cashout_amount">Cash out amount (cents): </label>
                    <input
                      type="number"
                      id="cashout_amount"
                      name="cashout_amount"
                      defaultValue="0"
                      placeholder="Cash out Amount (cents)"
                    />
                  </div>
                  <div id="prompt_for_cash_input">
                    <label htmlFor="prompt_for_cash">Prompt for Cash?: </label>
                    <input type="checkbox" id="prompt_for_cash" name="prompt_for_cash" defaultValue="false" />
                  </div>
                  <div id="surcharge_amount_input">
                    <label htmlFor="surcharge_amount">Surcharge Amount (cents): </label>
                    <input
                      type="number"
                      id="surcharge_amount"
                      name="surcharge_amount"
                      defaultValue="0"
                      placeholder="Surcharge Amount (cents)"
                    />
                  </div>

                  <div>
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
                    <button type="button" className="input" id="tx_sign_accept">
                      Accept Signature
                    </button>
                    <button type="button" className="input" id="tx_sign_decline">
                      Decline Signature
                    </button>
                  </div>
                </fieldset>

                <fieldset id="zip_purchase_input" className="input">
                  <h3>Zip Purchase</h3>
                  <div>
                    <label htmlFor="zip_purchase_amount">Amount: </label>
                    <input
                      type="tel"
                      id="zip_purchase_amount"
                      name="zip_purchase_amount"
                      placeholder="Amount"
                      defaultValue="10"
                    />
                  </div>
                  <div>
                    <label htmlFor="zip_purchase_store_code">Store Code: </label>
                    <input
                      type="tel"
                      id="zip_purchase_store_code"
                      name="zip_purchase_store_code"
                      placeholder="Store Code"
                      defaultValue=""
                    />
                  </div>
                  <div>
                    <label htmlFor="zip_purchase_description">Description: </label>
                    <input
                      type="tel"
                      id="zip_purchase_description"
                      name="zip_purchase_description"
                      placeholder="Description"
                      defaultValue="Purchase"
                    />
                  </div>
                  <div>
                    <button type="button" className="input" id="zip_purchase">
                      Zip Purchase
                    </button>
                  </div>
                </fieldset>

                <fieldset id="zip_refund_input" className="input">
                  <h3>Zip Refund</h3>
                  <div>
                    <label htmlFor="zip_refund_amount">Amount: </label>
                    <input
                      type="tel"
                      id="zip_refund_amount"
                      name="zip_refund_amount"
                      placeholder="Amount"
                      defaultValue="10"
                    />
                  </div>
                  <div>
                    <label htmlFor="zip_refund_store_code">Original Receipt Number: </label>
                    <input
                      type="tel"
                      id="zip_refund_store_code"
                      name="zip_refund_store_code"
                      placeholder="Original Receipt Number"
                      defaultValue=""
                    />
                  </div>
                  <div>
                    <button type="button" className="input" id="zip_refund">
                      Zip Refund
                    </button>
                  </div>
                </fieldset>

                <fieldset id="suppress_merchant_password_input" className="input">
                  <label htmlFor="suppress_merchant_password">Suppress Merchant Password?: </label>
                  <input
                    type="checkbox"
                    id="suppress_merchant_password"
                    name="suppress_merchant_password"
                    defaultValue="1"
                  />
                </fieldset>

                <fieldset id="print_merchant_copy_input" className="input">
                  <label htmlFor="print_merchant_copy">Print merchant copy?: </label>
                  <input type="checkbox" id="print_merchant_copy" name="print_merchant_copy" defaultValue="false" />
                </fieldset>
                <fieldset id="receipt_header_input" className="input">
                  <label htmlFor="receipt_header">Receipt header: </label>
                  <textarea id="receipt_header" name="receipt_header" defaultValue="" placeholder="" />
                </fieldset>
                <fieldset id="receipt_footer_input" className="input">
                  <label htmlFor="receipt_footer">Receipt footer: </label>
                  <textarea id="receipt_footer" name="receipt_footer" defaultValue="" placeholder="" />
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
