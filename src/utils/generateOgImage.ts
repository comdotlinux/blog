import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { SITE } from "@config";

const fetchFonts = async () => {
  const fontFileRegular = await fetch(
    "https://www.1001fonts.com/download/font/ibm-plex-mono.regular.ttf"
  );
  const fontRegular: ArrayBuffer = await fontFileRegular.arrayBuffer();

  const fontFileBold = await fetch(
    "https://www.1001fonts.com/download/font/ibm-plex-mono.bold.ttf"
  );
  const fontBold: ArrayBuffer = await fontFileBold.arrayBuffer();

  return { fontRegular, fontBold };
};

const { fontRegular, fontBold } = await fetchFonts();

const ogImage = (text: string) => ({
  type: "div",
  props: {
    style: {
      background: "#fefbfb",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    children: [
      {
        type: "div",
        props: {
          style: {
            position: "absolute",
            top: "-1px",
            right: "-1px",
            border: "4px solid #000",
            background: "#ecebeb",
            opacity: "0.9",
            borderRadius: "4px",
            display: "flex",
            justifyContent: "center",
            margin: "2.5rem",
            width: "88%",
            height: "80%",
          },
        },
      },
      {
        type: "div",
        props: {
          style: {
            border: "4px solid #000",
            background: "#fefbfb",
            borderRadius: "4px",
            display: "flex",
            justifyContent: "center",
            margin: "2rem",
            width: "88%",
            height: "80%",
          },
          children: {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                margin: "20px",
                width: "90%",
                height: "90%",
              },
              children: [
                {
                  type: "p",
                  props: {
                    style: {
                      fontSize: 72,
                      fontWeight: "bold",
                      maxHeight: "84%",
                      overflow: "hidden",
                    },
                    children: text,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      marginBottom: "8px",
                      fontSize: 28,
                    },
                    children: [
                      {
                        type: "span",
                        props: {
                          children: [
                            "by ",
                            {
                              type: "span",
                              props: {
                                style: { color: "transparent" },
                                children: '"',
                              },
                            },
                            {
                              type: "span",
                              props: {
                                style: {
                                  overflow: "hidden",
                                  fontWeight: "bold",
                                },
                                children: SITE.author,
                              },
                            },
                          ],
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: { overflow: "hidden", fontWeight: "bold" },
                          children: SITE.title,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    ],
  },
});

const options = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: [
    {
      name: "IBM Plex Mono",
      data: fontRegular,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "IBM Plex Mono",
      data: fontBold,
      weight: 600 as const,
      style: "normal" as const,
    },
  ],
};

const generateOgImage = async (mytext = SITE.title): Promise<Buffer> => {
  const sanitizedText = mytext
    .replace(/[/\\?%*:|"<> ]/g, "-")
    .replace(/--/g, "-");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svg = await satori(ogImage(sanitizedText) as any, options);
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
};

export default generateOgImage;
