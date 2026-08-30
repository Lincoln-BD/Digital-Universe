/* =========================================================
   SITE DATA — the ONE place to edit Updates & Gallery content.
   Add a new object to the top of an array and it will appear
   on the site automatically (Home shows the latest 3 updates,
   updates.html shows all of them).
   ========================================================= */

const DEEN_PLAYLISTS = [
  {
    id: "world-before-adam",
    title: "The World Before Adam (A.S.)",
    category: "Origins, Creation & Humanity",
    description: "Exploring questions surrounding creation, humanity, and the world before Adam (A.S.).",
    playlistId: "PLe4QV06SrLqDSs7qGhbo0BhPrrBR2JLOn",
    icon: "sparkles"
  },
  {
    id: "evolution-and-islam",
    title: "Evolution and Islam",
    category: "Origins, Creation & Humanity",
    description: "Exploring evolution and its relationship with Islamic perspectives and questions about human origins.",
    playlistId: "PLe4QV06SrLqCCyP0-Iez3C1qw37d7n31F",
    icon: "dna"
  },
  {
    id: "aqidah-series",
    title: "আকিদা সিরিজ (Aqidah Series)",
    category: "Foundations of Faith",
    description: "A structured series exploring the foundations and principles of Islamic belief.",
    playlistId: "PL7E7DFtKYTnZajnNkWP_Lmw9HnwkNdtE5",
    icon: "book-open",
    bangla: true
  },
  {
    id: "o-messenger",
    title: "O Messenger — AI-Visualized Series",
    category: "Stories & Visual Learning",
    description: "A visually engaging series exploring the message and stories connected with the Messengers and Prophets.",
    playlistId: "PLlZazEh_c4nScNCvGBn8OEf6ujk-sDUpg",
    icon: "clapperboard"
  }
  /* Add more playlists above this line — each needs a unique id and a YouTube playlistId (the part after "list=" in the playlist URL). */
];

const UPDATES_DATA = [
  {
    date: "Aug 2026",
    tag: "Learning",
    title: "Continuing German A2 studies",
    description: "Daily spaced-repetition vocabulary and weekly speaking practice, working toward the B1 level required for the Chemnitz program."
  },
  {
    date: "Jul 2026",
    tag: "Career",
    title: "One year in HR & Operations Coordination",
    description: "Marked a year coordinating remote HR and operations support for hospitality clients — process documentation and reporting have gotten a lot sharper."
  },
  {
    date: "Jun 2026",
    tag: "Personal",
    title: "Rebuilt this website",
    description: "Restructured the site into one connected ecosystem — career, insights, and connect, without the repetition."
  }
  /* Add new updates above this line, newest first. This feed now lives
     entirely on the Home page — there's no separate Updates page. */
];
