/* =========================================================
   PHOTOS — edit this file to add your own pictures.

   1. Drop images into the matching folder, e.g.
        assets/img/awards/siu/1.jpg
   2. List them below (src + optional caption).

   Missing files are skipped automatically, so it's fine
   to leave entries here before the photos exist.
   ========================================================= */

window.SITE_MEDIA = {
  awards: {
    siu: {
      title: "IEEE SIU 2026 — 1st Prize, Undergraduate Poster Competition",
      images: [
        { src: "assets/img/awards/siu/1.jpg", caption: "IEEE SIU 2026 — receiving the certificate of achievement for the 1st Prize" }
      ]
    },
    estu: {
      title: "ESTÜ 19th Project Fair — 1st Prize in Computer Engineering",
      images: [
        { src: "assets/img/awards/estu/1.jpg", caption: "The AeroSearch team with our advisor, 1st Prize certificates in hand" },
        { src: "assets/img/awards/estu/2.jpg", caption: "On stage at the 19th Project Fair and Competition award ceremony" }
      ]
    },
    graduation: {
      title: "ESTÜ 2026 — 2nd in the Faculty of Engineering",
      images: [
        { src: "assets/img/awards/graduation/1.jpg", caption: "Graduation day at Eskişehir Technical University" },
        { src: "assets/img/awards/graduation/2.jpg", caption: "Official ranking letter from the Dean's Office (personal details redacted)" }
      ]
    },
    tubitak: {
      title: "TÜBİTAK 3501 Undergraduate Research Scholarship",
      images: []
    }
  },

  /* Optional: a cover image replaces the drawn illustration on a
     project card; images appear as a gallery inside its pop-up. */
  projects: {
    retailglue:    { cover: "", images: [] },
    aerosearch:    { cover: "", images: [
      { src: "assets/img/awards/siu/1.jpg", caption: "1st Prize at IEEE SIU 2026" },
      { src: "assets/img/awards/estu/1.jpg", caption: "1st Prize at the ESTÜ 19th Project Fair" },
      { src: "assets/img/awards/estu/2.jpg", caption: "Award ceremony at Eskişehir Technical University" }
    ] },
    fisheye:       { cover: "", images: [] },
    aeroretrieval: { cover: "", images: [] }
  }
};
