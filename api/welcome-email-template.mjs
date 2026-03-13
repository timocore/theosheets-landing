/**
 * Inlined welcome email template - no file I/O needed at runtime.
 * Placeholder: {{UNSUBSCRIBE_URL}}
 */

export const WELCOME_EMAIL_TEXT = `TheoSheets
Expressive Piano Editions

Welcome to the TheoSheets Founding List

Thank you for joining the TheoSheets founding list.

Your place is confirmed, and you are now part of the early circle of musicians who will receive first access when the TheoSheets collection is released.

Founding Members Will Receive:
- Early access to the collection
- A complimentary premium score
- Lifetime Founding Musician recognition on TheoSheets

Thank you for joining before launch. It means a great deal to begin in the company of musicians who care about expressive, carefully crafted editions.

With thanks,
Theo Timoc
Composer & Creator of TheoSheets

We'll only send occasional updates about the TheoSheets launch.

Manage your subscription: {{UNSUBSCRIBE_URL}}`;

export const WELCOME_EMAIL_HTML = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>You're on the TheoSheets founding list</title>
    <style>
      @media only screen and (max-width: 640px) {
        .email-shell {
          width: 100% !important;
        }
        .email-padding {
          padding-left: 28px !important;
          padding-right: 28px !important;
        }
        .brand-name {
          font-size: 30px !important;
          line-height: 36px !important;
        }
        .hero-title {
          font-size: 28px !important;
          line-height: 36px !important;
        }
        .body-copy,
        .list-copy,
        .signature-copy,
        .footer-copy {
          font-size: 16px !important;
          line-height: 28px !important;
        }
        .section-heading {
          font-size: 13px !important;
        }
      }
    </style>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f6f1e8;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    "
  >
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; mso-hide: all">
      Founding members will receive a complimentary premium score and lifetime
      recognition on TheoSheets.
    </div>

    <table
      role="presentation"
      cellpadding="0"
      cellspacing="0"
      border="0"
      width="100%"
      style="width: 100%; border-collapse: collapse; background-color: #f6f1e8"
    >
      <tr>
        <td align="center" style="padding: 40px 16px">
          <table
            role="presentation"
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="620"
            class="email-shell"
            style="width: 620px; max-width: 620px; border-collapse: collapse"
          >
            <tr>
              <td
                class="email-padding"
                style="
                  padding: 60px 60px 56px 60px;
                  background-color: #fbf8f2;
                  border: 1px solid #e7dece;
                  box-shadow: 0 2px 24px rgba(44, 38, 34, 0.08);
                "
              >
                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="border-collapse: collapse"
                >
                  <tr>
                    <td
                      align="center"
                      class="brand-name"
                      style="
                        padding: 0 0 8px 0;
                        font-family: Georgia, 'Times New Roman', serif;
                        font-size: 36px;
                        line-height: 42px;
                        color: #241d16;
                        font-weight: normal;
                      "
                    >
                      <span style="letter-spacing: 0.4px; color: #241d16;">Theo</span><span style="color: #9a7b4f; font-style: italic;">Sheets</span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      style="
                        padding: 0 0 28px 0;
                        font-family: Georgia, 'Times New Roman', serif;
                        font-size: 12px;
                        line-height: 18px;
                        color: #9a7a53;
                        letter-spacing: 2.4px;
                        text-transform: uppercase;
                      "
                    >
                      Expressive Piano Editions
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 0 0 36px 0">
                      <table
                        role="presentation"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        width="88"
                        style="width: 88px; border-collapse: collapse"
                      >
                        <tr>
                          <td
                            style="
                              height: 1px;
                              line-height: 1px;
                              font-size: 1px;
                              background-color: #cbb187;
                            "
                          >
                            &nbsp;
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="border-collapse: collapse"
                >
                  <tr>
                    <td
                      align="center"
                      class="hero-title"
                      style="
                        padding: 0 0 26px 0;
                        font-family: Georgia, 'Times New Roman', serif;
                        font-size: 36px;
                        line-height: 44px;
                        color: #241d16;
                        font-weight: normal;
                      "
                    >
                      Welcome to the TheoSheets Founding List
                    </td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      class="body-copy"
                      style="
                        padding: 0 0 24px 0;
                        font-family: Georgia, 'Times New Roman', serif;
                        font-size: 17px;
                        line-height: 30px;
                        color: #4a4036;
                      "
                    >
                      Thank you for joining the TheoSheets founding list.
                    </td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      class="body-copy"
                      style="
                        padding: 0 0 32px 0;
                        font-family: Georgia, 'Times New Roman', serif;
                        font-size: 17px;
                        line-height: 30px;
                        color: #4a4036;
                      "
                    >
                      Your place is confirmed, and you are now part of the early
                      circle of musicians who will receive first access when the
                      TheoSheets collection is released.
                    </td>
                  </tr>
                </table>

                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="border-collapse: collapse"
                >
                  <tr>
                    <td
                      align="center"
                      class="section-heading"
                      style="
                        padding: 0 0 20px 0;
                        font-family: Georgia, 'Times New Roman', serif;
                        font-size: 15px;
                        line-height: 24px;
                        color: #8c7550;
                        letter-spacing: 1.6px;
                        text-transform: uppercase;
                      "
                    >
                      Founding Members Will Receive
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 0 0 12px 0">
                      <table
                        role="presentation"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="border-collapse: collapse"
                      >
                        <tr>
                          <td
                            align="center"
                            class="list-copy"
                            style="
                              padding: 7px 0;
                              font-family: Georgia, 'Times New Roman', serif;
                              font-size: 17px;
                              line-height: 29px;
                              color: #2f2821;
                            "
                          >
                            Early access to the collection
                          </td>
                        </tr>
                        <tr>
                          <td
                            align="center"
                            class="list-copy"
                            style="
                              padding: 7px 0;
                              font-family: Georgia, 'Times New Roman', serif;
                              font-size: 17px;
                              line-height: 29px;
                              color: #2f2821;
                            "
                          >
                            A complimentary premium score
                          </td>
                        </tr>
                        <tr>
                          <td
                            align="center"
                            class="list-copy"
                            style="
                              padding: 7px 0;
                              font-family: Georgia, 'Times New Roman', serif;
                              font-size: 17px;
                              line-height: 29px;
                              color: #2f2821;
                            "
                          >
                            Lifetime Founding Musician recognition on TheoSheets
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="border-collapse: collapse"
                >
                  <tr>
                    <td align="center" style="padding: 40px 0 0 0">
                      <table
                        role="presentation"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        width="72"
                        style="width: 72px; border-collapse: collapse"
                      >
                        <tr>
                          <td
                            style="
                              height: 1px;
                              line-height: 1px;
                              font-size: 1px;
                              background-color: #e1d4bf;
                            "
                          >
                            &nbsp;
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      class="body-copy"
                      style="
                        padding: 38px 0 26px 0;
                        font-family: Georgia, 'Times New Roman', serif;
                        font-size: 17px;
                        line-height: 30px;
                        color: #4a4036;
                      "
                    >
                      Thank you for joining before launch. It means a great deal
                      to begin in the company of musicians who care about
                      expressive, carefully crafted editions.
                    </td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      class="signature-copy"
                      style="
                        padding: 0;
                        font-family: Georgia, 'Times New Roman', serif;
                        font-size: 17px;
                        line-height: 30px;
                        color: #2c241d;
                      "
                    >
                      With thanks,
                    </td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      class="signature-copy"
                      style="
                        padding: 12px 0 0 0;
                        font-family: Georgia, 'Times New Roman', serif;
                        font-size: 24px;
                        line-height: 32px;
                        color: #201a14;
                        font-weight: normal;
                      "
                    >
                      Theo Timoc
                    </td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      class="footer-copy"
                      style="
                        padding: 4px 0 0 0;
                        font-family: Georgia, 'Times New Roman', serif;
                        font-size: 14px;
                        line-height: 24px;
                        color: #7a6956;
                      "
                    >
                      Composer &amp; Creator of TheoSheets
                    </td>
                  </tr>
                </table>

                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="border-collapse: collapse"
                >
                  <tr>
                    <td
                      align="center"
                      class="footer-copy"
                      style="
                        padding: 42px 0 0 0;
                        font-family: Georgia, 'Times New Roman', serif;
                        font-size: 13px;
                        line-height: 24px;
                        color: #8a7b69;
                      "
                    >
                      We&rsquo;ll only send occasional updates about the TheoSheets
                      launch.
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 20px 0 0 0">
                      <table
                        role="presentation"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="border-collapse: separate"
                      >
                        <tr>
                          <td
                            align="center"
                            style="
                              border: 1px solid #e7dece;
                              border-radius: 999px;
                              background-color: #f6f1e8;
                              box-shadow: 0 1px 3px rgba(44, 38, 34, 0.04);
                            "
                          >
                            <a
                              href="{{UNSUBSCRIBE_URL}}"
                              style="
                                display: inline-block;
                                padding: 10px 18px;
                                font-family: Georgia, 'Times New Roman', serif;
                                font-size: 12px;
                                line-height: 20px;
                                color: #7a6956;
                                text-decoration: none;
                              "
                            >
                              Unsubscribe
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td
                align="center"
                style="
                  padding: 20px 24px 0 24px;
                  font-family: Georgia, 'Times New Roman', serif;
                  font-size: 12px;
                  line-height: 20px;
                  color: #9b8b77;
                "
              >
                TheoSheets &middot; Expressive Piano Editions
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
