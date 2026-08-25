import os
from build_common import page, page_hero, mini_cta, premium_cta_band, SOCIAL_LINKS_SVG

OUT = os.path.dirname(os.path.abspath(__file__))

def write(filename, html):
    with open(os.path.join(OUT, filename), "w", encoding="utf-8") as f:
        f.write(html)
    print("wrote", filename)

# =========================================================
# HOME
# =========================================================
home_hero = '''<section class="hero home-hero" id="home">
  <div class="lens-flare" aria-hidden="true"></div>
  <div class="home-intro">
    <span class="eyebrow" data-gsap="fade"><i data-lucide="rocket"></i> AVAILABLE FOR OPPORTUNITIES</span>
    <h1 class="kinetic-heading" id="heroName">MD. SADMAN SHAHARIER</h1>
    <div class="home-role" id="cycleText" aria-live="polite"></div>
    <p class="lede" data-gsap="fade">Welcome to my digital home — a place where my professional journey, personal interests, ideas, learning, and experiences come together in one spot.</p>
    <div class="hero-ctas" data-gsap="fade" style="justify-content:center;">
      <a href="career.html" class="btn btn-elite magnetic">Explore My Career <i data-lucide="arrow-right"></i></a>
      <a href="connect.html" class="btn btn-glass btn-elite-outline magnetic">Connect With Me</a>
    </div>
  </div>

  <div class="home-questions">
    <div class="home-question glass" data-gsap="up"><strong>Who is Sadman?</strong>HR & Operations professional, lifelong learner, and a curious mind across tech, football, and faith.</div>
    <div class="home-question glass" data-gsap="up" style="--delay:0.08s"><strong>What does he do?</strong>Coordinates HR & Operations remotely today, while preparing for a fully-funded Master's in Germany.</div>
    <div class="home-question glass" data-gsap="up" style="--delay:0.16s"><strong>What's on this site?</strong>Career journey, knowledge & insights, personal interests, Deen, media, and ongoing updates.</div>
    <div class="home-question glass" data-gsap="up" style="--delay:0.24s"><strong>How to connect?</strong>Email, LinkedIn, WhatsApp, or the contact form — pick whatever's easiest for you.</div>
  </div>
  <div class="scroll-cue">SCROLL<span>↓</span></div>
</section>'''

home_body = '''<section class="section" style="padding-top:20px;">
  <div class="section-head" data-gsap="up">
    <span class="tag-label"><i data-lucide="compass"></i> QUICK PATHS</span>
    <h2 class="kinetic-heading">Explore the Ecosystem</h2>
    <p>Different visitors come here for different reasons — pick where you'd like to start.</p>
  </div>
</section>
<div class="hub-grid" data-gsap-group>
  <a href="about.html" class="hub-card glass border-glow" data-accent="about" data-gsap="scale">
    <span class="hub-card-icon"><i data-lucide="user"></i></span>
    <h3>About</h3>
    <p>The story, values, and direction behind the career.</p>
    <span class="hub-link">Read the story <i data-lucide="arrow-up-right"></i></span>
  </a>
  <a href="journey.html" class="hub-card glass border-glow" data-accent="journey" data-gsap="scale">
    <span class="hub-card-icon"><i data-lucide="graduation-cap"></i></span>
    <h3>Education</h3>
    <p>From SSC to an upcoming Master's in Germany — the academic path so far.</p>
    <span class="hub-link">See timeline <i data-lucide="arrow-up-right"></i></span>
  </a>
  <a href="career.html" class="hub-card glass border-glow" data-accent="career" data-gsap="scale">
    <span class="hub-card-icon"><i data-lucide="briefcase"></i></span>
    <h3>Career</h3>
    <p>HR & Operations experience, roles, and where I'm headed next.</p>
    <span class="hub-link">View journey <i data-lucide="arrow-up-right"></i></span>
  </a>
  <a href="insights.html" class="hub-card glass border-glow" data-accent="insights" data-gsap="scale">
    <span class="hub-card-icon"><i data-lucide="lightbulb"></i></span>
    <h3>Insights</h3>
    <p>HR, AI, crypto, football, faith & entertainment — one organized hub.</p>
    <span class="hub-link">Explore hub <i data-lucide="arrow-up-right"></i></span>
  </a>
  <a href="connect.html" class="hub-card glass border-glow" data-accent="connect" data-gsap="scale">
    <span class="hub-card-icon"><i data-lucide="satellite"></i></span>
    <h3>Connect</h3>
    <p>LinkedIn, email, WhatsApp, or a quick message — your choice.</p>
    <span class="hub-link">Say hello <i data-lucide="arrow-up-right"></i></span>
  </a>
</div>

<section class="section section-alt">
  <div class="section-head" data-gsap="up">
    <span class="tag-label"><i data-lucide="activity"></i> LATEST</span>
    <h2 class="kinetic-heading">What I'm Doing Now</h2>
    <p>A running log of current focus, progress, and milestones.</p>
  </div>
  <div class="updates-feed" style="padding:0;" id="latestUpdates"></div>
</section>'''

home_cta = premium_cta_band(
    "KNOW MORE",
    "Want the Fuller Picture?",
    "Beyond the résumé — the story, the values, and the easiest way to reach out.",
    "Know More", "about.html",
    "Connect With Me", "connect.html",
)

write("index.html", page(
    "home",
    "MD. Sadman Shaharier — Personal Digital Ecosystem",
    "The personal digital home of MD. Sadman Shaharier — HR & Operations professional, lifelong learner, and curious mind across technology, football, and faith.",
    home_hero,
    home_body,
    cta=home_cta,
))

# =========================================================
# ABOUT
# =========================================================
about_hero = page_hero("user", "01 — MY STORY", "About Me",
    "Not just a job candidate — a person with a story, values, and a direction. Here's the fuller picture.")

about_body = '''<div class="about-grid">
  <div class="about-block glass" style="padding:28px 30px;" data-gsap="up">
    <h2>Who I Am</h2>
    <p>I'm MD. Sadman Shaharier — an HR & Operations professional based in Bangladesh, currently coordinating remote HR and operations support for a US hospitality client, while preparing for a fully-funded Master's program in Germany.</p>
    <p>Outside of work, I follow football tactics closely, keep an eye on crypto markets, track where AI and robotics are heading, and spend time studying Islamic knowledge — sources first, always.</p>
  </div>

  <div class="about-block glass" style="padding:28px 30px;" data-gsap="up">
    <h2>My Values & Mindset</h2>
    <p>Evidence over assumption, consistency over intensity, and clarity over noise — in how I work, learn, and think.</p>
    <div class="value-grid" data-gsap-group>
      <div class="value-chip glass" data-gsap="scale"><i data-lucide="target" class="value-icon"></i><h4>Discipline</h4><p>Small, consistent progress compounds.</p></div>
      <div class="value-chip glass" data-gsap="scale"><i data-lucide="search" class="value-icon"></i><h4>Evidence-based</h4><p>Check the source before believing the claim.</p></div>
      <div class="value-chip glass" data-gsap="scale"><i data-lucide="heart-handshake" class="value-icon"></i><h4>Integrity</h4><p>Do it right when no one's checking.</p></div>
    </div>
  </div>

  <div class="about-block glass" style="padding:28px 30px;" data-gsap="up">
    <h2>Goals & Future Direction</h2>
    <p>Short term: reach German B1 fluency and finalize the move to Chemnitz University of Technology for my MSc.</p>
    <p>Longer term: build deep expertise at the intersection of HR, operations, and technology — and keep this website growing as an honest record of that journey.</p>
  </div>

  <div class="about-block glass" style="padding:28px 30px;" data-gsap="up">
    <h2>Currently Learning</h2>
    <p>German (A2, working toward B1), sharpening football tactical analysis, and following how AI tools are reshaping HR and operations work day to day.</p>
  </div>
</div>'''

write("about.html", page(
    "about",
    "About — MD. Sadman Shaharier",
    "The story, values, and direction behind MD. Sadman Shaharier — beyond just a resume.",
    about_hero,
    about_body,
    cta=mini_cta("Curious about the career side?", "See the full professional timeline and current role.", "View Career", "career.html"),
))

# =========================================================
# JOURNEY (Education)
# =========================================================
journey_hero = page_hero("graduation-cap", "02 — INTELLECTUAL FOUNDATIONS", "Education Journey",
    "Four academic milestones — each one a building block toward the next.")

journey_body = '''<section class="section" style="padding-top:0;">
  <div class="edu-matrix">
    <div class="edu-line" aria-hidden="true"></div>

    <div class="edu-node flip-card" data-gsap="scale" tabindex="0">
      <div class="flip-inner">
        <div class="flip-front glass border-glow">
          <span class="edu-step">SSC</span>
          <h3>Chittagong City Corp. Model High School</h3>
        </div>
        <div class="flip-back glass">
          <p><strong>Secondary School Certificate</strong></p>
          <p>The foundation year — core sciences, mathematics, and language, sat under the Chittagong City Corporation education board.</p>
        </div>
      </div>
    </div>

    <div class="edu-node flip-card" data-gsap="scale" tabindex="0" style="--delay:0.1s">
      <div class="flip-inner">
        <div class="flip-front glass border-glow">
          <span class="edu-step">HSC</span>
          <h3>Chittagong Collegiate College</h3>
        </div>
        <div class="flip-back glass">
          <p><strong>Higher Secondary Certificate</strong></p>
          <p>One of Chittagong's most reputed colleges — where analytical thinking and academic discipline were sharpened.</p>
        </div>
      </div>
    </div>

    <div class="edu-node flip-card" data-gsap="scale" tabindex="0" style="--delay:0.2s">
      <div class="flip-inner">
        <div class="flip-front glass border-glow">
          <span class="edu-step">BBA</span>
          <h3>Int'l Islamic University Chittagong</h3>
        </div>
        <div class="flip-back glass">
          <p><strong>Major: Human Resource Management</strong></p>
          <p>Built a practical foundation in people management, organizational behavior, and business operations.</p>
        </div>
      </div>
    </div>

    <div class="edu-node flip-card edu-next" data-gsap="scale" tabindex="0" style="--delay:0.3s">
      <div class="flip-inner">
        <div class="flip-front glass border-glow">
          <span class="edu-step step-next">MSc</span>
          <h3>Chemnitz University of Technology</h3>
        </div>
        <div class="flip-back glass">
          <p><strong>Germany 🟢 In Progress</strong></p>
          <p>Fully-funded Master's program — the next chapter, currently in visa and language preparation.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="section-head" data-gsap="up">
    <span class="tag-label"><i data-lucide="languages"></i> LANGUAGES & CERTIFICATIONS</span>
    <h2 class="kinetic-heading">Building Toward Germany</h2>
    <p>Structured, exam-driven language progress required for German university admission and visa.</p>
  </div>
  <div class="skill-categories" data-gsap-group>
    <div class="skill-cat float-card border-glow" data-gsap="scale">
      <span class="skill-cat-icon"><i data-lucide="languages"></i></span>
      <h3>German — A1 to A2</h3>
      <p class="skill-desc">Following the official CEFR levels (A1 → A2 → B1). A1 certified; A2 currently in progress using daily spaced-repetition vocabulary, Deutsche Welle listening practice, and Tandem speaking sessions.</p>
      <div class="neon-tags">
        <span class="neon-tag aqua">A1 Certified</span>
        <span class="neon-tag aqua">A2 In Progress</span>
      </div>
    </div>
    <div class="skill-cat float-card border-glow" data-gsap="scale" style="--delay:0.15s">
      <span class="skill-cat-icon"><i data-lucide="badge-check"></i></span>
      <h3>English — Professional Fluency</h3>
      <p class="skill-desc">Used daily in remote HR & Operations work — written reporting, candidate communication, and cross-border coordination.</p>
      <div class="neon-tags">
        <span class="neon-tag violet">Professional Working Proficiency</span>
      </div>
    </div>
  </div>
</section>'''

write("journey.html", page(
    "journey",
    "Education Journey — MD. Sadman Shaharier",
    "Academic timeline of MD. Sadman Shaharier — from SSC in Chittagong to an upcoming Master's in Germany.",
    journey_hero,
    journey_body,
    cta=mini_cta("Ready for the next chapter?", "See how this education is shaping the career ahead.", "View Career", "career.html"),
))

# =========================================================
# CAREER
# =========================================================
career_hero = page_hero("briefcase", "03 — PROFESSIONAL JOURNEY", "Career & Professional Journey",
    "Career progression in HR & Operations — click a role for the full detail.")

career_body = '''<section class="section" style="padding-top:0;">
  <div class="orbit-timeline">
    <div class="orbit-spine" aria-hidden="true"></div>

    <button class="orbit-card current" data-expand data-gsap="left">
      <div class="orbit-marker"><span class="marker-pulse"></span></div>
      <div class="orbit-main">
        <span class="orbit-tag">CURRENT</span>
        <h3>HR & Operations Coordinator</h3>
        <p class="orbit-org">Metro Hospitality · Remote</p>
      </div>
      <span class="expand-icon"><i data-lucide="plus"></i></span>
      <div class="orbit-detail">
        <ul>
          <li>Coordinate day-to-day HR and operational support for US hospitality clients remotely</li>
          <li>Monitor surveillance systems to ensure operational continuity and security compliance</li>
          <li>Maintain incident logs, operational reports, and escalation records</li>
          <li>Identify and escalate operational, technical, and security issues</li>
          <li>Support the HR Manager in recruitment: resume screening, candidate shortlisting, interview scheduling, and coordination</li>
          <li>Maintain HR databases and employee records</li>
          <li>Prepare HR and operational reports for management</li>
          <li>Ensure compliance with internal policies and confidentiality standards</li>
        </ul>
      </div>
    </button>

    <button class="orbit-card" data-expand data-gsap="left">
      <div class="orbit-marker"><span class="marker-pulse"></span></div>
      <div class="orbit-main">
        <span class="orbit-tag">PAST</span>
        <h3>Executive Recruiter</h3>
        <p class="orbit-org">Steadfast International Services · Remote</p>
      </div>
      <span class="expand-icon"><i data-lucide="plus"></i></span>
      <div class="orbit-detail">
        <ul>
          <li>Managed end-to-end recruitment for diverse roles across IT, Engineering, Business, Healthcare, and Technical sectors</li>
          <li>Posted jobs on multiple platforms, screened resumes, and coordinated candidate submissions to recruiters</li>
          <li>Maintained accurate ATS records and databases; ensured data quality and timely updates</li>
          <li>Scheduled interviews, coordinated candidate follow-ups, and assisted with onboarding documentation</li>
          <li>Supported internal HR and recruitment reporting to ensure accuracy and compliance</li>
          <li>Negotiated salaries and relocation terms; maintained professional communication with candidates via email and phone</li>
        </ul>
      </div>
    </button>

    <button class="orbit-card" data-expand data-gsap="left">
      <div class="orbit-marker"><span class="marker-pulse"></span></div>
      <div class="orbit-main">
        <span class="orbit-tag">INTERNSHIP</span>
        <h3>HR Intern</h3>
        <p class="orbit-org">Patenga Footwear Pvt. Ltd.</p>
      </div>
      <span class="expand-icon"><i data-lucide="plus"></i></span>
      <div class="orbit-detail">
        <ul>
          <li>Assisted in recruitment and worker onboarding processes</li>
          <li>Organized employee files and HR documentation</li>
          <li>Supported the HR team in disciplinary and conflict-resolution cases</li>
          <li>Ensured compliance with company policies and labor regulations</li>
        </ul>
      </div>
    </button>
  </div>
</section>

<section class="section section-alt">
  <div class="section-head" data-gsap="up">
    <span class="tag-label"><i data-lucide="brain-circuit"></i> STRATEGIC EXPERTISE</span>
    <h2 class="kinetic-heading">Skills & Toolkit</h2>
    <p>Core capability clusters, organized by category — not made-up percentages.</p>
  </div>
  <div class="skill-categories" data-gsap-group>
    <div class="skill-cat float-card border-glow" data-gsap="scale">
      <span class="skill-cat-icon"><i data-lucide="users"></i></span>
      <h3>HR & Recruitment</h3>
      <p class="skill-desc">End-to-end recruitment, ATS management, onboarding, employee records, and HR reporting across multiple sectors.</p>
      <div class="neon-tags"><span class="neon-tag violet">Full-Cycle Recruiting</span><span class="neon-tag violet">HRIS / ATS</span></div>
    </div>
    <div class="skill-cat float-card border-glow" data-gsap="scale" style="--delay:0.1s">
      <span class="skill-cat-icon"><i data-lucide="settings-2"></i></span>
      <h3>Operations</h3>
      <p class="skill-desc">Remote operational coordination, incident logging, compliance monitoring, and cross-team escalation for hospitality clients.</p>
      <div class="neon-tags"><span class="neon-tag pink">Process Coordination</span><span class="neon-tag pink">Compliance</span></div>
    </div>
    <div class="skill-cat float-card border-glow" data-gsap="scale" style="--delay:0.2s">
      <span class="skill-cat-icon"><i data-lucide="trending-up"></i></span>
      <h3>Growth & Digital Marketing</h3>
      <p class="skill-desc">Strategy-first thinking on positioning, campaign structure, and the awareness → conversion funnel, applied to real goals.</p>
      <div class="neon-tags"><span class="neon-tag aqua">Positioning</span><span class="neon-tag aqua">Funnel Strategy</span></div>
    </div>
    <div class="skill-cat float-card border-glow" data-gsap="scale" style="--delay:0.3s">
      <span class="skill-cat-icon"><i data-lucide="languages"></i></span>
      <h3>Languages</h3>
      <p class="skill-desc">Professional English, plus German being built step by step (A1 certified, A2 in progress) for study and life in Germany.</p>
      <div class="neon-tags"><span class="neon-tag gold">English</span><span class="neon-tag gold">German A1→A2</span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="resume-box glass border-glow" data-gsap="scale">
    <div>
      <h3><i data-lucide="file-lock-2"></i> Request My Resume</h3>
      <p>My full resume isn't posted publicly. Send a short request and I'll get back to you directly.</p>
    </div>
    <button class="btn btn-elite magnetic" id="resumeRequestBtn" type="button">Request My Resume <i data-lucide="arrow-right"></i></button>
  </div>
</section>

<!-- Resume request modal -->
<div class="form-modal-overlay" id="resumeModalOverlay" role="dialog" aria-modal="true" aria-hidden="true">
  <div class="form-modal-panel glass">
    <button class="form-close" id="resumeModalClose" aria-label="Close"><i data-lucide="x"></i></button>
    <h3>Request My Resume</h3>
    <p>Tell me a little about why you'd like a copy — I personally review and respond to every request.</p>
    <form id="resumeRequestForm">
      <div class="field-group"><label for="reqName">Your name</label><input type="text" id="reqName" required></div>
      <div class="field-group"><label for="reqEmail">Your email</label><input type="email" id="reqEmail" required></div>
      <div class="field-group"><label for="reqReason">Reason (optional)</label><textarea id="reqReason" placeholder="e.g. hiring for an HR role, collaboration, networking..."></textarea></div>
      <button type="submit" class="btn btn-elite btn-form">Send Request <i data-lucide="send"></i></button>
      <p class="form-status" id="resumeRequestStatus"></p>
    </form>
  </div>
</div>'''

write("career.html", page(
    "career",
    "Career — MD. Sadman Shaharier",
    "HR & Operations career journey of MD. Sadman Shaharier, plus skills, toolkit, and how to request a resume.",
    career_hero,
    career_body,
    cta=mini_cta("Want to dig into specific topics?", "HR, AI, crypto, and more — organized in one place.", "Browse Insights", "insights.html"),
))

# =========================================================
# INSIGHTS HUB
# =========================================================
insights_hero = page_hero("lightbulb", "04 — KNOWLEDGE & INSIGHTS HUB", "Insights",
    "One organized ecosystem — HR, technology, markets, sports, faith, and entertainment, without the repetition.")

def insight_card(icon, color_class, title, desc, href, cta_label):
    return f'''<a href="{href}" class="insight-card glass border-glow" data-gsap="scale">
    <span class="insight-icon" style="background:rgba(134,112,240,0.14); color:var(--{color_class});"><i data-lucide="{icon}"></i></span>
    <h3>{title}</h3>
    <p>{desc}</p>
    <span class="read-more">{cta_label} <i data-lucide="arrow-up-right"></i></span>
  </a>'''

insights_body = f'''<div class="insight-grid" data-gsap-group>
  {insight_card("briefcase", "gold", "Career & HR", "Recruitment, operations, and lessons from working across HR functions remotely.", "career.html", "View career")}
  {insight_card("cpu", "cyanblue", "AI & Technology", "Where artificial intelligence and robotics are heading, and what it means for how we work.", "tech-ai.html", "Explore")}
  {insight_card("coins", "aqua", "Crypto & Markets", "A beginner-friendly guide plus live prices for 8 major coins, converted to BDT.", "crypto.html", "Explore")}
  {insight_card("radar", "amber", "Sports — Football", "Tactical breakdowns with a focus on FC Bayern München, plus xG and pressing concepts.", "football.html", "Explore")}
  {insight_card("moon-star", "gold", "My Faith", "Evidence-based reflections plus a Deen Academy study station on Iman, Islam & the Kalima.", "deen.html", "Explore")}
  {insight_card("clapperboard", "rose", "Entertainment", "Series and films worth the watch — quick, honest takes.", "movies.html", "Explore")}
</div>'''

write("insights.html", page(
    "insights",
    "Insights — MD. Sadman Shaharier",
    "Knowledge and insights hub covering HR, AI, cryptocurrency, football, faith, and entertainment.",
    insights_hero,
    insights_body,
    cta=mini_cta("Have a topic you want covered?", "Reach out — new insight articles get added regularly.", "Suggest a topic", "connect.html"),
))

# =========================================================
# FOOTBALL
# =========================================================
football_hero = page_hero("radar", "PERSONAL UNIVERSE · FOOTBALL", "Football Intelligence",
    "Two lenses on the same passion: tactical analysis, and actually playing the game.")

football_body = '''<section class="section" style="padding-top:0;">
  <div class="hud-grid">
    <div class="hud-panel tactical border-glow" data-gsap="right">
      <div class="hud-panel-head"><span class="hud-dot violet"></span><span>TACTICAL ANALYTICS</span></div>
      <h3>Football Intelligence</h3>
      <p class="hud-desc">Deep-dive technical and tactical breakdowns of the Bundesliga — with absolute priority on <strong>FC Bayern München</strong>: pressing structure, build-up shape, and matchday adjustments.</p>
      <div class="hud-readouts">
        <div class="readout"><span class="readout-label">PRIORITY CLUB</span><span class="readout-val violet">FC Bayern 🔴</span></div>
        <div class="readout"><span class="readout-label">LEAGUE FOCUS</span><span class="readout-val violet">Bundesliga</span></div>
        <div class="readout"><span class="readout-label">LENS</span><span class="readout-val violet">Tactics + Data</span></div>
        <div class="readout"><span class="readout-label">METHOD</span><span class="readout-val violet">Formations · Pressing · xG</span></div>
      </div>
    </div>
    <div class="hud-panel active border-glow" data-gsap="left">
      <div class="hud-panel-head"><span class="hud-dot pink"></span><span>ACTIVE ATHLETICISM</span></div>
      <h3>Played & Competed</h3>
      <div class="active-grid">
        <div class="active-tile"><i data-lucide="dribbble"></i>Cricket</div>
        <div class="active-tile"><i data-lucide="circle-dot"></i>Football</div>
        <div class="active-tile"><i data-lucide="badge"></i>Badminton</div>
        <div class="active-tile glow-badge"><i data-lucide="gamepad-2"></i>eFootball</div>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="section-head" data-gsap="up">
    <span class="tag-label"><i data-lucide="book-open"></i> THE BASICS</span>
    <h2 class="kinetic-heading">Football Tactics — Explained Simply</h2>
  </div>
  <div class="about-grid" style="margin:0; max-width:820px;">
    <div class="about-block glass" style="padding:24px 28px;" data-gsap="up">
      <h2>Formations</h2>
      <p>A formation (like 4-3-3 or 4-2-3-1) describes how players are arranged on the pitch — defenders, midfielders, and attackers.</p>
    </div>
    <div class="about-block glass" style="padding:24px 28px;" data-gsap="up">
      <h2>Pressing</h2>
      <p>Pressing means chasing down the opponent quickly after losing the ball, to win it back high up the pitch before the other team can build an attack.</p>
    </div>
    <div class="about-block glass" style="padding:24px 28px;" data-gsap="up">
      <h2>Expected Goals (xG)</h2>
      <p>xG estimates how likely a shot was to become a goal, based on distance, angle, and situation. It's used to judge chance quality, not just the scoreline.</p>
    </div>
  </div>
</section>'''

write("football.html", page(
    "football",
    "Football Intelligence — MD. Sadman Shaharier",
    "Football tactical analysis focused on FC Bayern München and the Bundesliga, plus sports actually played.",
    football_hero,
    football_body,
    cta=mini_cta("Want to explore another category?", "HR, AI, crypto, faith & entertainment — one organized hub.", "Back to Insights", "insights.html"),
))

# =========================================================
# TECH & AI
# =========================================================
tech_hero = page_hero("cpu", "PERSONAL UNIVERSE · TECH & AI", "Technology, AI & Global Panorama",
    "Tracking where AI, robotics, and global power shifts are heading — and what it means for how we live and work.")

tech_body = '''<div class="insight-grid" style="padding-top:0;">
  <div class="insight-card glass border-glow" data-gsap="scale">
    <span class="insight-icon" style="background:rgba(245,95,166,0.14); color:var(--pink);"><i data-lucide="cpu"></i></span>
    <h3>Artificial Intelligence</h3>
    <p>AI systems learn patterns from data to perform tasks — from writing and translation to decision-making — and are becoming part of everyday tools.</p>
  </div>
  <div class="insight-card glass border-glow" data-gsap="scale" style="--delay:0.1s">
    <span class="insight-icon" style="background:rgba(245,95,166,0.14); color:var(--pink);"><i data-lucide="bot"></i></span>
    <h3>Autonomous Robotics</h3>
    <p>Robots that can sense their environment and act without constant human control — used in factories, and increasingly, in daily life.</p>
  </div>
  <div class="insight-card glass border-glow" data-gsap="scale" style="--delay:0.2s">
    <span class="insight-icon" style="background:rgba(34,184,214,0.14); color:var(--cyanblue);"><i data-lucide="globe-2"></i></span>
    <h3>Global Power Shifts</h3>
    <p>Following shifts in global alliances, economic policy between major powers, and the political landscape across Muslim-majority nations — understanding events in context rather than reacting to single headlines.</p>
  </div>
</div>'''

write("tech-ai.html", page(
    "tech-ai",
    "Technology, AI & Global Panorama — MD. Sadman Shaharier",
    "Notes on artificial intelligence, robotics, and global geopolitical shifts.",
    tech_hero,
    tech_body,
    cta=mini_cta("Want to explore another category?", "HR, crypto, football, faith & entertainment — one organized hub.", "Back to Insights", "insights.html"),
))

# =========================================================
# CRYPTO
# =========================================================
crypto_hero = page_hero("coins", "PERSONAL UNIVERSE · CRYPTOCURRENCY", "Cryptocurrency & Blockchain",
    "A beginner-friendly guide — plus live prices for 8 major coins, converted to BDT.")

crypto_body = '''<section class="section" style="padding-top:0;">
  <div class="about-block glass" style="padding:28px 30px; max-width:820px; margin:0 auto 30px;" data-gsap="up">
    <h2>What is Crypto?</h2>
    <p>Cryptocurrency is digital money that runs on a <strong>blockchain</strong> — a public record book shared across thousands of computers instead of one bank. No single company controls it, and every transaction is recorded permanently and openly.</p>
  </div>

  <div style="max-width:820px; margin:0 auto;">
    <h3 style="font-family:var(--font-display); font-size:19px; margin-bottom:14px;">Live Market Snapshot <span class="live-badge">LIVE</span></h3>
    <p style="color:var(--frost-dim); font-size:14px; margin-bottom:14px;">Prices below update automatically, converted from USD to BDT, and sorted biggest-to-smallest by market cap.</p>
    <div class="crypto-table-wrap">
      <table class="crypto-table">
        <thead><tr><th>Coin</th><th>Price</th><th>Market Cap</th><th>24h</th></tr></thead>
        <tbody id="cryptoLiveGrid"><tr><td colspan="4" class="crypto-loading">Loading live prices…</td></tr></tbody>
      </table>
    </div>
    <div class="crypto-meta">
      <span id="cryptoStatus">Loading…</span>
      <button id="cryptoRefreshBtn" class="crypto-refresh" type="button">⟳ Refresh now</button>
    </div>
    <p class="crypto-attribution">Prices via CoinGecko · Exchange rate via ExchangeRate-API · Auto-refreshes every 5 minutes</p>
  </div>
</section>

<section class="section section-alt">
  <div class="section-head" data-gsap="up">
    <span class="tag-label"><i data-lucide="info"></i> THE 8 COINS, EXPLAINED SIMPLY</span>
    <h2 class="kinetic-heading">Coin Guide</h2>
  </div>
  <div class="coin-grid" data-gsap-group>
    <div class="coin-card" data-gsap="scale"><span class="coin-symbol">BTC</span><h4>Bitcoin</h4><p>The first cryptocurrency. Often called "digital gold" — used mainly as a store of value.</p></div>
    <div class="coin-card" data-gsap="scale"><span class="coin-symbol">ETH</span><h4>Ethereum</h4><p>A blockchain that runs programs called "smart contracts." Powers most apps, tokens, and NFTs.</p></div>
    <div class="coin-card" data-gsap="scale"><span class="coin-symbol">XRP</span><h4>XRP (Ripple)</h4><p>Built for fast, cheap cross-border payments between banks and payment providers.</p></div>
    <div class="coin-card" data-gsap="scale"><span class="coin-symbol">SOL</span><h4>Solana</h4><p>A high-speed blockchain known for very fast, low-cost transactions.</p></div>
    <div class="coin-card" data-gsap="scale"><span class="coin-symbol">DOGE</span><h4>Dogecoin</h4><p>Started as a joke coin, now widely used for tipping and payments thanks to a large, active community.</p></div>
    <div class="coin-card" data-gsap="scale"><span class="coin-symbol">TAO</span><h4>Bittensor</h4><p>Powers a decentralized network that trains and rewards artificial intelligence models.</p></div>
    <div class="coin-card" data-gsap="scale"><span class="coin-symbol">SUI</span><h4>Sui</h4><p>A newer blockchain designed for fast, parallel transaction processing.</p></div>
    <div class="coin-card" data-gsap="scale"><span class="coin-symbol">SEI</span><h4>Sei</h4><p>A high-speed blockchain built specifically for fast trading applications.</p></div>
  </div>
</section>

<section class="section">
  <div class="about-grid" style="margin:0; max-width:820px;">
    <div class="about-block glass" style="padding:24px 28px;" data-gsap="up">
      <h2>How to Invest via Binance (General Steps)</h2>
      <ol style="color:var(--frost-dim); font-size:14px; padding-left:18px; display:flex; flex-direction:column; gap:6px;">
        <li>Create an account and complete identity verification (KYC)</li>
        <li>Deposit funds using a bank transfer or card</li>
        <li>Use the <strong>Spot</strong> market to buy a coin at the current price</li>
        <li>Turn on 2-factor authentication (2FA) to secure your account</li>
        <li>Consider moving larger holdings to a personal wallet for safekeeping</li>
      </ol>
    </div>
    <div class="about-block glass" style="padding:24px 28px;" data-gsap="up">
      <h2>Technical Analysis Basics</h2>
      <p><strong>CoinMarketCap (CMC)</strong> — check a coin's price, ranking, and trading volume before researching further.</p>
      <p><strong>Support & Resistance</strong> — price levels where a coin has repeatedly stopped falling (support) or rising (resistance).</p>
      <p><strong>Fair Value Gap (FVG)</strong> — a gap left on the chart when price moves fast in one direction, which price often returns to "fill" later.</p>
    </div>
  </div>
  <p class="disclaimer" style="max-width:820px; margin:24px auto 0;"><i data-lucide="info"></i> Educational overview only — not financial advice. Prices are approximate and crypto markets are highly volatile; always do your own research.</p>
</section>'''

write("crypto.html", page(
    "crypto",
    "Cryptocurrency & Blockchain — MD. Sadman Shaharier",
    "Beginner-friendly cryptocurrency guide with live prices for 8 major coins, converted to BDT.",
    crypto_hero,
    crypto_body,
    cta=mini_cta("Want to explore another category?", "HR, AI, football, faith & entertainment — one organized hub.", "Back to Insights", "insights.html"),
))

# =========================================================
# MOVIES
# =========================================================
movies_hero = page_hero("clapperboard", "PERSONAL UNIVERSE · ENTERTAINMENT", "Movies & Series",
    "Flip a card to see the take.")

movies_body = '''<section class="section" style="padding-top:0;">
  <div class="ent-block">
    <h3 class="ent-subhead"><i data-lucide="tv"></i> High-Stakes Series</h3>
    <div class="ent-row">
      <div class="ent-card flip-card" tabindex="0" data-gsap="scale"><div class="flip-inner"><div class="flip-front ent-front g1"><span class="ent-emoji">🐉</span><span class="ent-title">Game of Thrones</span></div><div class="flip-back ent-back glass"><span class="rating-pill violet">Epic Scale</span><p>Power, politics, and betrayal at their sharpest.</p></div></div></div>
      <div class="ent-card flip-card" tabindex="0" data-gsap="scale"><div class="flip-inner"><div class="flip-front ent-front g2"><span class="ent-emoji">🔥</span><span class="ent-title">House of the Dragon</span></div><div class="flip-back ent-back glass"><span class="rating-pill pink">Dynasty Drama</span><p>The Targaryen fire, before the fall.</p></div></div></div>
      <div class="ent-card flip-card" tabindex="0" data-gsap="scale"><div class="flip-inner"><div class="flip-front ent-front g3"><span class="ent-emoji">🚕</span><span class="ent-title">The Boys</span></div><div class="flip-back ent-back glass"><span class="rating-pill aqua">Dark Satire</span><p>Superheroes, unfiltered and brutal.</p></div></div></div>
    </div>
  </div>

  <div class="ent-block">
    <h3 class="ent-subhead"><i data-lucide="film"></i> Masterclass Cinema</h3>
    <div class="ent-row ent-row-wide">
      <div class="ent-card flip-card" tabindex="0" data-gsap="scale"><div class="flip-inner"><div class="flip-front ent-front g4"><span class="ent-emoji">🔫</span><span class="ent-title">John Wick</span></div><div class="flip-back ent-back glass"><span class="rating-pill violet">Action Precision</span></div></div></div>
      <div class="ent-card flip-card" tabindex="0" data-gsap="scale"><div class="flip-inner"><div class="flip-front ent-front g5"><span class="ent-emoji">🦇</span><span class="ent-title">The Dark Knight</span></div><div class="flip-back ent-back glass"><span class="rating-pill pink">Genre-Defining</span></div></div></div>
      <div class="ent-card flip-card" tabindex="0" data-gsap="scale"><div class="flip-inner"><div class="flip-front ent-front g6"><span class="ent-emoji">🌀</span><span class="ent-title">Inception</span></div><div class="flip-back ent-back glass"><span class="rating-pill aqua">Mind-Bending</span></div></div></div>
      <div class="ent-card flip-card" tabindex="0" data-gsap="scale"><div class="flip-inner"><div class="flip-front ent-front g7"><span class="ent-emoji">🐻</span><span class="ent-title">The Revenant</span></div><div class="flip-back ent-back glass"><span class="rating-pill violet">Raw Survival</span></div></div></div>
      <div class="ent-card flip-card" tabindex="0" data-gsap="scale"><div class="flip-inner"><div class="flip-front ent-front g8"><span class="ent-emoji">💎</span><span class="ent-title">Blood Diamond</span></div><div class="flip-back ent-back glass"><span class="rating-pill pink">Hard-Hitting</span></div></div></div>
      <div class="ent-card flip-card" tabindex="0" data-gsap="scale"><div class="flip-inner"><div class="flip-front ent-front g9"><span class="ent-emoji">🎭</span><span class="ent-title">Parasite</span></div><div class="flip-back ent-back glass"><span class="rating-pill aqua">Masterclass</span></div></div></div>
    </div>
  </div>
</section>'''

write("movies.html", page(
    "movies",
    "Movies & Series — MD. Sadman Shaharier",
    "Series and films worth the watch, with quick honest takes.",
    movies_hero,
    movies_body,
    cta=mini_cta("Want to explore another category?", "HR, AI, crypto, football & faith — one organized hub.", "Back to Insights", "insights.html"),
))

# =========================================================
# DEEN
# =========================================================
deen_hero = page_hero("moon-star", "DEEN & PERSONAL VALUES", "Faith & Study",
    "A quiet space for reflection, learning, and spiritual discipline.")

deen_body = '''<section class="section deen-section" style="padding-top:0;">
  <div class="deen-pattern" aria-hidden="true"></div>
  <div class="about-grid" style="margin:0; max-width:820px;">
    <div class="about-block glass" style="padding:28px 30px;" data-gsap="fade">
      <h2>Islamic Views</h2>
      <p>An evidence-based approach to Islamic knowledge — prioritizing the Qur'an and authentic Hadith, understood through the lens of the earliest generations of Muslims and the major scholars of Ahl al-Sunna wal-Jama'ah.</p>
      <p>This approach values clear textual evidence over cultural custom, while remaining respectful toward the broader Sunni scholarly tradition, including Hanafi, Deobandi, and other schools of thought.</p>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="section-head" data-gsap="up">
    <span class="tag-label deen-label"><i data-lucide="book-open"></i> DEEN ACADEMY · STUDY STATION</span>
    <h2 class="kinetic-heading">Iman, Islam & the Kalima</h2>
    <p>A dedicated space for tracking learning across the Islamic sciences — building knowledge methodically over time.</p>
  </div>

  <div class="about-grid" style="margin:0; max-width:820px;">
    <div class="about-block glass" style="padding:24px 28px;" data-gsap="up">
      <h2>Iman (Faith) — The Six Pillars</h2>
      <p>Based on the well-known Hadith of Jibril, Iman means believing in:</p>
      <ol style="color:var(--frost-dim); font-size:14px; padding-left:18px; display:flex; flex-direction:column; gap:4px;">
        <li>Allah</li><li>His Angels</li><li>His Books (revealed scriptures)</li><li>His Messengers</li><li>The Last Day (Judgment)</li><li>Divine Decree (Qadr) — the good and the bad</li>
      </ol>
    </div>
    <div class="about-block glass" style="padding:24px 28px;" data-gsap="up">
      <h2>Islam (Practice) — The Five Pillars</h2>
      <ol style="color:var(--frost-dim); font-size:14px; padding-left:18px; display:flex; flex-direction:column; gap:4px;">
        <li><strong>Shahada</strong> — the testimony of faith</li>
        <li><strong>Salah</strong> — the five daily prayers</li>
        <li><strong>Zakat</strong> — obligatory charity</li>
        <li><strong>Sawm</strong> — fasting in Ramadan</li>
        <li><strong>Hajj</strong> — pilgrimage to Makkah, once in a lifetime if able</li>
      </ol>
    </div>
    <div class="about-block glass" style="padding:24px 28px;" data-gsap="up">
      <h2>The Kalima (Shahada) & Its Conditions</h2>
      <p>The declaration: <em>"La ilaha illallah, Muhammadur rasulullah"</em> — <strong>"There is no deity worthy of worship except Allah, and Muhammad is His Messenger."</strong></p>
      <p>Scholars commonly summarize its conditions as: Knowledge, Certainty, Acceptance, Submission, Truthfulness, Sincerity, and Love.</p>
    </div>
  </div>
  <p class="disclaimer" style="max-width:820px; margin:24px auto 0;"><i data-lucide="info"></i> A concise summary for learning purposes — not a substitute for guidance from a qualified teacher of Islamic knowledge.</p>
</section>'''

write("deen.html", page(
    "deen",
    "Deen & Values — MD. Sadman Shaharier",
    "Islamic learning, reflections, and personal values — presented respectfully and simply.",
    deen_hero,
    deen_body,
    cta=mini_cta("Want to explore another category?", "HR, AI, crypto, football & entertainment — one organized hub.", "Back to Insights", "insights.html"),
))

# NOTE: Media and Updates are no longer standalone pages.
# - Media removed per brief (no content yet, was causing layout/perf issues).
# - Updates is folded into Home's "What I'm Doing Now" section instead of
#   living on its own as a mostly-empty page.

# =========================================================
# CONNECT
# =========================================================
connect_hero = page_hero("satellite", "MATRIX CONNECTION", "Let's Connect",
    "Open to opportunities, collaboration, or a good conversation about football, markets, or ideas.")

connect_body = f'''<section class="section" style="padding-top:0;">
  <div style="text-align:center; margin-bottom:36px;">
    <button class="email-copy magnetic" id="emailCopy" data-email="hello@example.com" style="margin:0 auto;">
      <i data-lucide="mail"></i>
      <span id="emailText">hello@example.com</span>
      <span class="copy-hint" id="copyHint">Click to copy</span>
    </button>
  </div>

  <div class="connect-grid" data-gsap-group>
    <a href="#" class="connect-card brand-linkedin glass border-glow" data-gsap="scale"><span class="connect-icon">{SOCIAL_LINKS_SVG["linkedin"]}</span><span>LinkedIn</span></a>
    <a href="#" class="connect-card brand-facebook glass border-glow" data-gsap="scale"><span class="connect-icon">{SOCIAL_LINKS_SVG["facebook"]}</span><span>Facebook</span></a>
    <a href="#" class="connect-card brand-x glass border-glow" data-gsap="scale"><span class="connect-icon">{SOCIAL_LINKS_SVG["x"]}</span><span>X / Twitter</span></a>
    <a href="#" class="connect-card brand-whatsapp glass border-glow" data-gsap="scale"><span class="connect-icon">{SOCIAL_LINKS_SVG["whatsapp"]}</span><span>WhatsApp</span></a>
  </div>

  <div class="contact-form-wrap glass border-glow" data-gsap="scale">
    <h3>Send a Message</h3>
    <form id="contactForm">
      <div class="field-group"><label for="cName">Your name</label><input type="text" id="cName" required></div>
      <div class="field-group"><label for="cEmail">Your email</label><input type="email" id="cEmail" required></div>
      <div class="field-group"><label for="cMessage">Message</label><textarea id="cMessage" required placeholder="Professional inquiry, collaboration idea, or just a hello..."></textarea></div>
      <button type="submit" class="btn btn-elite btn-form">Send Message <i data-lucide="send"></i></button>
      <p class="form-status" id="contactFormStatus"></p>
    </form>
  </div>
</section>'''

write("connect.html", page(
    "connect",
    "Connect — MD. Sadman Shaharier",
    "Get in touch with MD. Sadman Shaharier via email, LinkedIn, WhatsApp, or a direct message.",
    connect_hero,
    connect_body,
))

print("\\nAll pages generated.")
