import { defineAstroPaperConfig } from "./src/types/config";

const title = "Developer Musings";

export default defineAstroPaperConfig({
  site: {
    url: "https://blog.kulkarni.cloud/",
    title,
    description: "Umm, many things mostly software though, I hope",
    author: "Guruprasad Kulkarni",
    ogImage: "astropaper-og.jpg",
    lang: "en",
    timezone: "Europe/Berlin",
    dir: "ltr",
  },
  posts: {
    perPage: 3,
    perIndex: 4,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: false,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/comdotlinux/blog/edit/main/",
    },
    search: "pagefind",
    toc: true,
  },
  socials: [
    { name: "github", url: "https://github.com/comdotlinux" },
    { name: "github", url: "https://github.com/gurukulkarni" },
    { name: "linkedin", url: "https://www.linkedin.com/in/comdotlinux/" },
    { name: "mail", url: "mailto:contact@kulkarni.cloud" },
    { name: "x", url: "https://twitter.com/comdotlinux" },
    {
      name: "youtube",
      url: "https://www.youtube.com/channel/UCGRXM08d5KIwqYWIaY_DxOQ",
      linkTitle: `${title} on YouTube`,
    },
    {
      name: "reddit",
      url: "https://www.reddit.com/user/comdotlinux",
      linkTitle: `${title} on Reddit`,
    },
    { name: "telegram", url: "https://comdotlinux.t.me" },
    {
      name: "mastodon",
      url: "https://mastodon.social/@comdotlinux",
      linkTitle: `${title} on Mastodon`,
    },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
