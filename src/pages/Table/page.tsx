// TODO: It is recommended to wrap inputs in the label that they are associated with (remove line below)
/* eslint jsx-a11y/label-has-associated-control: ["error", { assert: "either" } ] */

import React, { Component } from 'react';
import { Logger } from '@mx51/spi-client-js';
import TablePos from './pos';
import '../legacyStyles.scss';

class Page extends Component {
  componentDidMount() {
    const log = console;
    try {
      const receipt = new Logger(
        document.getElementById('receipt_output'),
        `\n\n \\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/ \n\n`
      );
      const flowMsg = new Logger(document.getElementById('flow_msg'));
      const pos = new TablePos(log, receipt, flowMsg);
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
                                className="input medium"
                                name="pos_id"
                                id="pos_id"
                                placeholder="Pos ID"
                                defaultValue="TABLEPOS1"
                                required
                                title="Point of sale ID"
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
                                className="input medium"
                                name="eftpos_address"
                                id="eftpos_address"
                                placeholder="EFTPOS address"
                                defaultValue="192.168.1.1"
                                title="IP address of terminal or FQDN"
                                required
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </fieldset>

                    <fieldset>
                      <legend>Print config</legend>
                      <table className="form">
                        <tbody>
                          <tr>
                            <th scope="row">
                              <label htmlFor="print_merchant_copy">Merchant receipt:</label>
                            </th>
                            <td>
                              <input
                                type="checkbox"
                                className="input"
                                id="print_merchant_copy"
                                name="print_merchant_copy"
                                defaultValue="false"
                                title="Offer Merchant Receipt From Eftpos"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">
                              <label htmlFor="rcpt_from_eftpos">Customer receipt:</label>
                            </th>
                            <td>
                              <input
                                type="checkbox"
                                className="input"
                                id="rcpt_from_eftpos"
                                name="rcpt_from_eftpos"
                                defaultValue="false"
                                title="Offer Customer Receipt From Eftpos"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">
                              <label htmlFor="sig_flow_from_eftpos">Signature:</label>
                            </th>
                            <td>
                              <input
                                type="checkbox"
                                className="input"
                                id="sig_flow_from_eftpos"
                                name="sig_flow_from_eftpos"
                                defaultValue="false"
                                title="Signature Flow to be handled by Eftpos"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </fieldset>

                    <fieldset>
                      <legend>Table config</legend>
                      <table className="form table-config">
                        <tbody>
                          <tr>
                            <th scope="row">
                              <label htmlFor="pat_all_enable">Enable all:</label>
                            </th>
                            <td>
                              <button
                                type="button"
                                className="action"
                                id="pat_all_enable"
                                name="pat_all_enable"
                                defaultValue="false"
                                title="Enable all pay at table settings"
                              >
                                Enable
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">
                              <label htmlFor="pat_enabled">Enable PAT:</label>
                            </th>
                            <td>
                              <input
                                type="checkbox"
                                className="input table-config"
                                id="pat_enabled"
                                name="pat_enabled"
                                defaultValue="false"
                                title="Enable pay at table"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">
                              <label htmlFor="operatorid_enabled">Enable operator ID:</label>
                            </th>
                            <td>
                              <input
                                type="checkbox"
                                className="input table-config"
                                id="operatorid_enabled"
                                name="operatorid_enabled"
                                defaultValue="false"
                                title="Enable operator id property"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">
                              <label htmlFor="set_allowed_operatorid">Allowed operator IDs:</label>
                            </th>
                            <td>
                              <input
                                type="text"
                                className="input small table-config"
                                id="set_allowed_operatorid"
                                name="set_allowed_operatorid"
                                defaultValue=""
                                title="Set allowed operator ids (comma seperated)"
                                size={2}
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">
                              <label htmlFor="equal_split">Equal split:</label>
                            </th>
                            <td>
                              <input
                                type="checkbox"
                                className="input table-config"
                                id="equal_split"
                                name="equal_split"
                                defaultValue="false"
                                title="Enable equal split property"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">
                              <label htmlFor="split_by_amount">Split by amount:</label>
                            </th>
                            <td>
                              <input
                                type="checkbox"
                                className="input table-config"
                                id="split_by_amount"
                                name="split_by_amount"
                                defaultValue="false"
                                title="Enable split by amount property"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">
                              <label htmlFor="tipping">Tipping:</label>
                            </th>
                            <td>
                              <input
                                type="checkbox"
                                className="input table-config"
                                id="tipping"
                                name="tipping"
                                defaultValue="false"
                                title="Enable tipping property"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">
                              <label htmlFor="summary_report">Summary report:</label>
                            </th>
                            <td>
                              <input
                                type="checkbox"
                                className="input table-config"
                                id="summary_report"
                                name="summary_report"
                                defaultValue="false"
                                title="Enable summary report"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">
                              <label htmlFor="set_label_operatorid">Operator ID label:</label>
                            </th>
                            <td>
                              <input
                                type="text"
                                className="input medium table-config"
                                id="set_label_operatorid"
                                name="set_label_operatorid"
                                defaultValue="Operator ID"
                                title="Set operatorid label"
                                required
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">
                              <label htmlFor="set_label_tableid">Table ID label:</label>
                            </th>
                            <td>
                              <input
                                type="text"
                                className="input medium table-config"
                                id="set_label_tableid"
                                name="set_label_tableid"
                                defaultValue="Table Number"
                                title="Set tableid label"
                                required
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">
                              <label htmlFor="set_label_paybutton">Pay button label:</label>
                            </th>
                            <td>
                              <input
                                type="text"
                                className="input medium table-config"
                                id="set_label_paybutton"
                                name="set_label_paybutton"
                                defaultValue="Pay at Table"
                                title="Set pay button label"
                                required
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">
                              <label htmlFor="table_retrieval_enabled">Table retrieval:</label>
                            </th>
                            <td>
                              <input
                                type="checkbox"
                                className="input table-config"
                                id="table_retrieval_enabled"
                                name="table_retrieval_enabled"
                                defaultValue="false"
                                title="Enable table retrieval button"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </fieldset>

                    <div className="submit-input">
                      <button type="button" className="action no-hide" id="save_settings">
                        Save settings
                      </button>
                    </div>
                  </form>
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
              <td className="col" id="actions-container">
                <h1>Actions</h1>

                <div className="padding-1">
                  <form name="pairing" id="pairing-form">
                    <p id="status_indicator" data-status="Unpaired" data-flow="Idle">
                      <span id="primary_status">Unpaired</span>
                      <span>: </span>
                      <span id="flow_status" className="flow_status">
                        Idle
                      </span>
                    </p>
                    <fieldset id="paring-buttons">
                      <button disabled type="button" className="action" id="pair" title="Pair with Eftpos">
                        PAIR
                      </button>
                      <button disabled type="button" className="action" id="unpair" title="Unpair and Disconnect">
                        UNPAIR
                      </button>

                      <button disabled type="button" className="action" id="pair_cancel" title="Cancel Pairing">
                        Cancel Pairing
                      </button>
                    </fieldset>
                  </form>

                  <form id="action-form" name="controls">
                    <fieldset id="action-buttons">
                      <button disabled type="button" className="action" id="open" title="Start a new bill">
                        Open table
                      </button>
                      <button
                        disabled
                        type="button"
                        className="action"
                        id="add"
                        title="Add an amount to a bill"
                        data-ref="[bill_id]"
                      >
                        Add to bill
                      </button>
                      <button
                        disabled
                        type="button"
                        className="action"
                        id="close"
                        title="Close a table"
                        data-ref="[table_number]"
                      >
                        Close table
                      </button>
                      <button
                        disabled
                        type="button"
                        className="action"
                        id="lock"
                        title="Lock/Unlock a table"
                        data-ref="[table_number, locked]"
                      >
                        Lock/Unlock table
                      </button>
                      <button disabled type="button" className="action" id="tables" title="List open tables">
                        List open tables
                      </button>
                      <button
                        disabled
                        type="button"
                        className="action"
                        id="table"
                        title="Print current bill for a table"
                      >
                        Get table bill
                      </button>
                      <button disabled type="button" className="action" id="bill" title="Print a bill">
                        Print bill ID
                      </button>

                      <button disabled type="button" className="action" id="purchase" title="Quick Purchase Tx">
                        Purchase
                      </button>
                      <button disabled type="button" className="action" id="refund" title="hand out a refund">
                        Refund
                      </button>
                      <button disabled type="button" className="action" id="settle" title="Initiate Settlement">
                        Settle
                      </button>

                      <button disabled type="button" className="action" id="tx_sign_accept" title="Accept Signature">
                        Accept Signature
                      </button>
                      <button disabled type="button" className="action" id="tx_sign_decline" title="Decline Signature">
                        Decline Signature
                      </button>
                      <button disabled type="button" className="action" id="tx_cancel" title="Attempt to Cancel Tx">
                        Cancel
                      </button>
                      <button disabled type="button" className="action" id="ok" title="acknowledge final">
                        Ok
                      </button>
                      <button
                        disabled
                        type="button"
                        className="action"
                        id="bill_ack"
                        title="acknowledge bill completion"
                      >
                        Complete Bill
                      </button>
                    </fieldset>

                    <fieldset id="action-inputs">
                      <h3 id="current-action-heading">Bill</h3>
                      <table className="form">
                        <tbody>
                          <tr className="input-field-group hidden" data-id="amount">
                            <th scope="row">
                              <label htmlFor="amount">Amount (cents): </label>
                            </th>
                            <td>
                              <input
                                className="input small"
                                type="number"
                                id="amount"
                                name="amount"
                                defaultValue="10"
                                placeholder="Amount (cents)"
                                required
                              />
                            </td>
                          </tr>
                          <tr className="input-field-group hidden" data-id="table_number">
                            <th scope="row">
                              <label htmlFor="table_number">Table #: </label>
                            </th>
                            <td>
                              <input
                                className="input small"
                                type="number"
                                id="table_number"
                                name="table_number"
                                defaultValue="1"
                                placeholder="Table number"
                                required
                              />
                            </td>
                          </tr>
                          <tr className="input-field-group hidden" data-id="locked">
                            <th scope="row">
                              <label htmlFor="locked">Locked: </label>
                            </th>
                            <td>
                              <input className="input" type="checkbox" id="locked" name="locked" defaultValue="false" />
                            </td>
                          </tr>
                          <tr className="input-field-group hidden" data-id="enabled">
                            <th scope="row">
                              <label htmlFor="enabled">Enabled: </label>
                            </th>
                            <td>
                              <input
                                className="input"
                                type="checkbox"
                                id="enabled"
                                name="enabled"
                                defaultValue="false"
                              />
                            </td>
                          </tr>
                          <tr className="input-field-group hidden" data-id="bill_id">
                            <th scope="row">
                              <label htmlFor="bill_id">Bill #: </label>
                            </th>
                            <td>
                              <input
                                className="input small"
                                type="number"
                                id="bill_id"
                                name="bill_id"
                                defaultValue=""
                                placeholder="Bill ID"
                                required
                              />
                            </td>
                          </tr>
                          <tr className="input-field-group hidden" data-id="operator_id">
                            <th scope="row">
                              <label htmlFor="operator_id">Operator ID: </label>
                            </th>
                            <td>
                              <input
                                className="input medium"
                                type="number"
                                id="operator_id"
                                name="operator_id"
                                defaultValue=""
                                placeholder="Operator ID"
                                required
                              />
                            </td>
                          </tr>
                          <tr className="input-field-group hidden" data-id="label">
                            <th scope="row">
                              <label htmlFor="label">Label: </label>
                            </th>
                            <td>
                              <input
                                className="input medium"
                                type="text"
                                id="label"
                                name="label"
                                defaultValue=""
                                placeholder="Label"
                                required
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <button type="button" className="hidden" name="submit_action" id="submit_action">
                        Submit
                      </button>
                      <button type="button" className="hidden" name="cancel_action" id="cancel_action">
                        Cancel
                      </button>
                    </fieldset>
                  </form>
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
