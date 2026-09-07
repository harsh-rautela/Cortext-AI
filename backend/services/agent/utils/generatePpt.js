import pptxgen from "pptxgenjs";

export const generatePpt = async (data) => {
  const ppt = new pptxgen();

  ppt.layout = "LAYOUT_WIDE";
  ppt.author = "Generated Presentation";
  ppt.subject = data.subtitle || "";
  ppt.title = data.title || "Presentation";

  // Theme
  ppt.theme = {
    headFontFace: "Aptos Display",
    bodyFontFace: "Aptos",
  };

  // -------------------------
  // Title Slide
  // -------------------------
  const titleSlide = ppt.addSlide();

  titleSlide.background = { color: "F7F9FC" };

  titleSlide.addText(data.title || "", {
    x: 1,
    y: 2,
    w: 11.3,
    h: 0.8,
    fontFace: "Aptos Display",
    fontSize: 34,
    bold: true,
    color: "172033",
    align: "center",
    margin: 0,
  });

  if (data.subtitle) {
    titleSlide.addText(data.subtitle, {
      x: 1.5,
      y: 3,
      w: 10.3,
      h: 0.6,
      fontSize: 18,
      color: "5B6475",
      align: "center",
      margin: 0,
    });
  }

  // -------------------------
  // Content Slides
  // -------------------------
  (data.slides || []).forEach((slideData, index) => {
    const slide = ppt.addSlide();

    slide.background = { color: "FFFFFF" };

    // Slide title
    slide.addText(slideData.title || `Slide ${index + 1}`, {
      x: 0.7,
      y: 0.5,
      w: 12,
      h: 0.6,
      fontFace: "Aptos Display",
      fontSize: 28,
      bold: true,
      color: "172033",
      margin: 0,
    });

    // Accent line
    slide.addShape(ppt.ShapeType.line, {
      x: 0.7,
      y: 1.25,
      w: 11.9,
      h: 0,
      line: {
        color: "3B82F6",
        width: 2,
      },
    });

    // Points
    const points = slideData.points || [];

    const bulletText = points.map((point) => ({
      text: point,
      options: {
        bullet: {
          indent: 18,
        },
        hanging: 5,
        breakLine: true,
      },
    }));

    slide.addText(bulletText, {
      x: 1,
      y: 1.7,
      w: 11,
      h: 4.8,
      fontSize: 20,
      color: "303846",
      breakLine: false,
      valign: "mid",
      paraSpaceAfterPt: 18,
      margin: 0,
    });

    // Slide number
    slide.addText(`${index + 1}`, {
      x: 12.2,
      y: 7,
      w: 0.5,
      h: 0.3,
      fontSize: 10,
      color: "9CA3AF",
      align: "right",
      margin: 0,
    });
  });

  // -------------------------
  // Thank You Slide
  // -------------------------
  const thankYouSlide = ppt.addSlide();

  thankYouSlide.background = { color: "F7F9FC" };

  // Main Thank You text
  thankYouSlide.addText("Thank You", {
    x: 1,
    y: 2.3,
    w: 11.3,
    h: 0.9,
    fontFace: "Aptos Display",
    fontSize: 40,
    bold: true,
    color: "172033",
    align: "center",
    margin: 0,
  });

  // Supporting text
  thankYouSlide.addText(
    data.thankYouMessage || "Thank you for your time and attention.",
    {
      x: 2,
      y: 3.4,
      w: 9.3,
      h: 0.6,
      fontSize: 18,
      color: "5B6475",
      align: "center",
      margin: 0,
    }
  );

  // Accent line
  thankYouSlide.addShape(ppt.ShapeType.line, {
    x: 5.1,
    y: 4.35,
    w: 3.1,
    h: 0,
    line: {
      color: "3B82F6",
      width: 2,
    },
  });

  // Optional contact / closing text
  if (data.contact) {
    thankYouSlide.addText(data.contact, {
      x: 2,
      y: 4.7,
      w: 9.3,
      h: 0.5,
      fontSize: 14,
      color: "6B7280",
      align: "center",
      margin: 0,
    });
  }
  return ppt;
};
