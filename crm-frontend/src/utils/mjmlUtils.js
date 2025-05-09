import mjml2html from "mjml-browser";

export const convertMJMLToHTML = (mjml) => {
  try {
    const { html, errors } = mjml2html(mjml);
    if (errors && errors.length > 0) {
      console.warn("MJML Errors:", errors);
    }
    return html;
  } catch (err) {
    console.error("Conversion failed:", err);
    return "<p>Error rendering MJML</p>";
  }
};
