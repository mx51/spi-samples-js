import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// redux provider helper
import ReduxProvider from '../../redux/ReduxProvider';
// store
import { store } from '../../redux/store';
// component
import PurchasePage from '.';

describe('Test <PurchasePage />', () => {
  test('snapshot for PurchasePage component', () => {
    const { container } = render(
      <ReduxProvider reduxStore={store}>
        <PurchasePage />
      </ReduxProvider>
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div>
          <div
            class="makeStyles-root-1"
          >
            <header
              class="MuiPaper-root MuiAppBar-root MuiAppBar-positionStatic MuiAppBar-colorPrimary makeStyles-navbar-2 MuiPaper-elevation4"
            >
              <div
                class="MuiToolbar-root MuiToolbar-dense MuiToolbar-gutters"
              >
                <button
                  class="MuiButtonBase-root MuiIconButton-root makeStyles-menuButton-4 MuiIconButton-colorInherit MuiIconButton-edgeStart"
                  data-testid="navbarMenuIcon"
                  tabindex="0"
                  type="button"
                >
                  <span
                    class="MuiIconButton-label"
                  >
                    <svg
                      aria-hidden="true"
                      class="MuiSvgIcon-root"
                      focusable="false"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
                      />
                    </svg>
                  </span>
                  <span
                    class="MuiTouchRipple-root"
                  />
                </button>
                <svg>
                  PrimaryLogoIcon.svg
                </svg>
              </div>
            </header>
          </div>
          <p>
            Purchase Page
          </p>
          <div>
            <button
              class="MuiButtonBase-root MuiButton-root MuiButton-text"
              tabindex="0"
              type="button"
            >
              <span
                class="MuiButton-label"
              >
                Counter is: 
                0
              </span>
              <span
                class="MuiTouchRipple-root"
              />
            </button>
          </div>
        </div>
      </div>
    `);
  });
});
