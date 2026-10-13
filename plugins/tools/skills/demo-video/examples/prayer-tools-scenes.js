// Example: scenes for a finished 3-minute Prayer.Tools demo. Its s02_model scene used type 'model' with markup
// kept in that video's index.html; with the template, write that kind of diagram as a `custom` scene.
// Scene specs. Times are seconds relative to the start of the scene's narration;
// w('word', offset, nth) resolves to the moment that word is spoken.
// Page coordinates are CSS px of the 1440px-wide captures.
const END = 99
const ADMIN = 'localhost:2380'
const SITE = 'pray-for-istanbul.localhost:3380'
const P = '/@pray-for-istanbul'

const SCENES = [
  { id: 's01_title', type: 'title', build: w => ({
    head: 'Prayer campaigns,<br>with orgs.',
    chips: [w('Creating'), w('managing'), w('looking')]
  }) },

  { id: 's02_model', type: 'model', build: w => ({
    site: w('site'), pills: [w('address'), w('team'), w('look'), w('look', .25), w('people')],
    camps: w('campaign'), cdesc: w('dates'),
    notype: w('no'), strike: w('types'),
    ahead: w('four'), ans: [w('start'), w('end'), w('goal', 0, 2), w('often')], foot: w('arrives', .3)
  }) },

  { id: 's03_ch1', type: 'chapter', build: () => ({ num: '01', title: 'Create a campaign' }) },

  { id: 's04_sites', type: 'screen', chapter: 0, build: w => ({
    kicker: '01 · Create', head: 'Start from<br>Your sites.',
    subs: [['One list of every site you run', w('Your')], ['Onboarding explains, then asks', w('explains')]],
    url: ADMIN + '/orgs',
    imgs: [{ at: -1, src: '01_sites', h: 900 }, { at: w('opens', .15), src: '02_intro', h: 900, url: ADMIN + '/orgs/new' }],
    cam: [{ at: -1, z: 1.08, x: 690, y: 400 }, { at: w('New', -.5), z: 1.08, x: 690, y: 400 }, { at: w('opens', -.1), z: 1.7, x: 1100, y: 250 },
      { at: w('opens', .25), z: 1.7, x: 1100, y: 250 }, { at: w('onboarding', .2), z: 1.3, x: 748, y: 430 }, { at: END, z: 1.34, x: 748, y: 436 }],
    cur: [{ at: -1, x: 820, y: 560 }, { at: w('New', -.1), x: 1208, y: 116 }, { at: w('opens', .6), x: 1208, y: 116 }, { at: w('asking'), x: 990, y: 520 }],
    click: [w('opens', -.12)],
    hl: [{ a: w('explains'), b: END, x: 426, y: 250, w: 640, h: 178 }]
  }) },

  { id: 's05_about', type: 'screen', chapter: 0, build: w => ({
    kicker: '01 · Create', head: 'Describe the site.',
    subs: [['Address suggested from the name', w('address')], ['Location puts prayers on the map', w('location')]],
    url: ADMIN + '/orgs/new',
    imgs: [{ at: -1, src: '03_about_empty', h: 1033 }, { at: w('address', -.3), src: '04_about_filled', h: 1033 }],
    cam: [{ at: -1, z: 1.3, x: 748, y: 425 }, { at: w('location', -.2), z: 1.3, x: 748, y: 425 }, { at: w('location', .6), z: 1.3, x: 748, y: 740 }, { at: END, z: 1.33, x: 748, y: 760 }],
    hl: [{ a: w('address'), b: w('location', -.15), x: 426, y: 258, w: 644, h: 142 }, { a: w('location'), b: w('map', .25), x: 426, y: 648, w: 644, h: 142 }],
    cur: [{ at: -1, x: 900, y: 520 }, { at: w('suggested'), x: 760, y: 305 }, { at: w('location', .3), x: 760, y: 305 }, { at: w('map', .1), x: 984, y: 969 }],
    click: [w('map', .45)]
  }) },

  { id: 's06_template', type: 'screen', chapter: 0, build: w => ({
    kicker: '01 · Create', head: 'Pick a template.',
    subs: [['Ramadan pre-fills the answers', w('fills')], ['Every answer stays editable', w('Every')]],
    url: ADMIN + P + '/site/setup',
    imgs: [{ at: -1, src: '06_setup_top', h: 900 }, { at: w('Ramadan', .12), src: '07_setup_ramadan', h: 1965 }],
    cam: [{ at: -1, z: 1.22, x: 880, y: 432 }, { at: w('fills'), z: 1.22, x: 880, y: 440 },
      { at: w('shared', .1), z: 1.25, x: 880, y: 880 }, { at: w('thirty', .1), z: 1.25, x: 880, y: 1160 },
      { at: w('daily', .1), z: 1.25, x: 880, y: 1720 }, { at: w('goal', .1), z: 1.25, x: 880, y: 1430 },
      { at: w('editable', -.2), z: 1.0, x: 720, y: 1250 }, { at: END, z: 1.0, x: 720, y: 1280 }],
    cur: [{ at: -1, x: 700, y: 560 }, { at: w('Ramadan', -.2), x: 1060, y: 356 }],
    click: [w('Ramadan', -.05)],
    hl: [{ a: w('Ramadan', .1), b: w('shared', -.15), x: 880, y: 312, w: 358, h: 92 },
      { a: w('shared'), b: w('thirty', -.1), x: 508, y: 738, w: 736, h: 290 },
      { a: w('thirty'), b: w('daily', -.1), x: 508, y: 1040, w: 736, h: 252 },
      { a: w('daily'), b: w('goal', -.1), x: 508, y: 1752, w: 544, h: 98 },
      { a: w('goal'), b: w('editable', -.4), x: 508, y: 1310, w: 736, h: 244 }]
  }) },

  { id: 's07_languages', type: 'screen', chapter: 0, build: w => ({
    kicker: '01 · Create', head: 'Choose languages.',
    subs: [['Emails go out in each person’s language', w('Here')]],
    url: ADMIN + P + '/site/setup',
    imgs: [{ at: -1, src: '08_address', h: 900 }, { at: w('languages', .1), src: '09_languages_open', h: 900 }, { at: w('Arabic', .5), src: '10_address_filled', h: 900 }],
    cam: [{ at: -1, z: 1.4, x: 876, y: 470 }, { at: w('languages'), z: 1.4, x: 876, y: 480 }, { at: END, z: 1.44, x: 876, y: 486 }],
    cur: [{ at: -1, x: 1000, y: 560 }, { at: w('languages', -.25), x: 1100, y: 434 }, { at: w('Arabic', .2), x: 1100, y: 434 }, { at: w('Arabic', .5), x: 900, y: 560 }],
    click: [w('languages', -.05)],
    hl: [{ a: w('English'), b: w('Arabic', .45), x: 506, y: 575, w: 740, h: 70 }]
  }) },

  { id: 's08_content', type: 'screen', chapter: 0, build: w => ({
    kicker: '01 · Create', head: 'Start from a library.',
    subs: [['Suggested by the template', w('suggests')], ['Use it, adapt it, or write your own', w('use')]],
    url: ADMIN + P + '/site/setup',
    imgs: [{ at: -1, src: '12_content_added', h: 900 }],
    cam: [{ at: -1, z: 1.3, x: 870, y: 420 }, { at: w('write', -.2), z: 1.3, x: 870, y: 440 }, { at: w('write', .5), z: 1.3, x: 870, y: 560 }, { at: END, z: 1.33, x: 870, y: 570 }],
    hl: [{ a: w('library', -.1), b: w('suggests', -.1), x: 508, y: 330, w: 736, h: 76 },
      { a: w('suggests'), b: w('write', -.15), x: 508, y: 466, w: 368, h: 190 },
      { a: w('write'), b: END, x: 508, y: 715, w: 736, h: 68 }]
  }) },

  { id: 's09_publish', type: 'screen', chapter: 0, build: w => ({
    kicker: '01 · Create', head: 'Check, then publish.',
    subs: [['A launch checklist shows what’s missing', w('checklist')], ['Nothing is public until you publish', w('Then')]],
    url: ADMIN + P + '/site/setup',
    imgs: [{ at: -1, src: '17_publish_ready', h: 959 }, { at: w('publish', .35), src: '18_share_toast', h: 900, url: ADMIN + P + '/site/share' }],
    cam: [{ at: -1, z: 1.3, x: 1000, y: 412 }, { at: w('reply-to', -.1), z: 1.3, x: 1000, y: 470 }, { at: w('checklist', -.1), z: 1.3, x: 880, y: 660 },
      { at: w('publish', -.35), z: 1.3, x: 950, y: 740 }, { at: w('publish', .35), z: 1.3, x: 950, y: 740 }, { at: w('live', -.3), z: 1.45, x: 1150, y: 760 }, { at: END, z: 1.5, x: 1160, y: 770 }],
    hl: [{ a: w('top'), b: w('reply-to', -.1), x: 880, y: 306, w: 272, h: 144 }, { a: w('reply-to'), b: w('checklist', -.1), x: 878, y: 522, w: 364, h: 48 },
      { a: w('checklist'), b: w('publish', -.4), x: 508, y: 604, w: 420, h: 186 }, { a: w('live', -.3), b: END, x: 1036, y: 802, w: 392, h: 84 }],
    cur: [{ at: -1, x: 1100, y: 640 }, { at: w('publish', -.35), x: 1188, y: 896 }, { at: w('live'), x: 1188, y: 896 }],
    click: [w('publish', .05)]
  }) },

  { id: 's10_public', type: 'screen', chapter: 0, build: w => ({
    kicker: '01 · Create', head: 'Your public page.',
    subs: [['Goal progress and signup', w('goal')], ['Today’s prayer and sharing', w('prayer')]],
    url: SITE + '/',
    imgs: [{ at: -1, src: '30_public', h: 2081 }],
    cam: [{ at: -1, z: 1.0, x: 720, y: 390 }, { at: w('goal', .3), z: 1.12, x: 700, y: 420 }, { at: w('signup', -.1), z: 1.0, x: 720, y: 1000 },
      { at: w('prayer', -.1), z: 1.0, x: 720, y: 1340 }, { at: w('sharing', -.2), z: 1.0, x: 720, y: 1640 }, { at: END, z: 1.0, x: 720, y: 1680 }],
    hl: [{ a: w('goal'), b: w('signup', -.2), x: 212, y: 352, w: 502, h: 60 }, { a: w('signup'), b: w('prayer', -.2), x: 346, y: 910, w: 752, h: 180 }]
  }) },

  { id: 's11_ch2', type: 'chapter', build: () => ({ num: '02', title: 'Landing page & content' }) },

  { id: 's12_landing', type: 'screen', chapter: 1, build: w => ({
    kicker: '02 · Manage', head: 'Shape the landing page.',
    subs: [['Fixed sections, fixed order', w('fixed')], ['Add your own sections', w('Add')], ['One-click AI translate', w('AI')]],
    url: ADMIN + P + '/site/landing',
    imgs: [{ at: -1, src: '43_landing', h: 1201 }, { at: w('Add', .45), src: '56_landing_section', h: 1752 }],
    cam: [{ at: -1, z: 1.0, x: 720, y: 450 }, { at: w('Add', -.2), z: 1.2, x: 1000, y: 620 }, { at: w('Add', .5), z: 1.2, x: 1000, y: 620 },
      { at: w('sections', .2, 2), z: 1.2, x: 880, y: 1060 }, { at: w('AI', -.3), z: 1.65, x: 780, y: 1010 }, { at: END, z: 1.7, x: 780, y: 1015 }],
    hl: [{ a: w('fixed'), b: w('Add', -.3), x: 424, y: 162, w: 904, h: 520 }, { a: w('sections', .1, 2), b: w('AI', -.35), x: 450, y: 836, w: 852, h: 544 },
      { a: w('AI', -.1), b: END, x: 470, y: 978, w: 264, h: 104, tag: 'AI translate' }],
    cur: [{ at: -1, x: 1000, y: 520 }, { at: w('Add', -.15), x: 1246, y: 730 }, { at: w('sections', 0, 2), x: 1246, y: 730 }, { at: w('AI', -.2), x: 660, y: 1000 }],
    click: [w('Add', .15)]
  }) },

  { id: 's13_live', type: 'screen', chapter: 1, build: w => ({
    kicker: '02 · Manage', head: 'Live in one save.',
    subs: [],
    url: SITE + '/',
    imgs: [{ at: -1, src: '36_public_after', h: 2298 }],
    cam: [{ at: -1, z: 1.0, x: 720, y: 450 }, { at: w('new', -.2), z: 1.18, x: 720, y: 790 }, { at: END, z: 1.2, x: 720, y: 800 }],
    hl: [{ a: w('new'), b: END, x: 338, y: 732, w: 766, h: 176, tag: 'New section' }]
  }) },

  { id: 's14_content', type: 'screen', chapter: 1, build: w => ({
    kicker: '02 · Manage', head: 'Edit prayer content.',
    subs: [['A numbered sequence of days', w('numbered')], ['Per language, in a rich-text editor', w('rich')], ['{place} fills in for each site', w('placeholders')]],
    url: ADMIN + P + '/site/content',
    imgs: [{ at: -1, src: '42_content', h: 900 }, { at: w('edit', -.1), src: '54_content_edit', h: 900 }],
    cam: [{ at: -1, z: 1.0, x: 720, y: 450 }, { at: w('Step', -.1), z: 1.35, x: 905, y: 400 }, { at: w('edit', .2), z: 1.2, x: 1000, y: 430 },
      { at: w('placeholders', -.1), z: 1.75, x: 740, y: 380 }, { at: END, z: 1.78, x: 740, y: 384 }],
    hl: [{ a: w('Step'), b: w('edit', -.1), x: 672, y: 178, w: 346, h: 48 }, { a: w('edit', .15), b: w('placeholders', -.15), x: 676, y: 252, w: 712, h: 396 },
      { a: w('placeholders'), b: END, x: 704, y: 298, w: 266, h: 50, tag: '{place} → Istanbul, Türkiye', tagPos: 'right' }]
  }) },

  { id: 's15_campaign', type: 'screen', chapter: 1, build: w => ({
    kicker: '02 · Manage', head: 'Relaunch next year.',
    subs: [['Setup stays editable', w('setup')], ['Thank-you email when it ends', w('thank')], ['Past campaigns keep results', w('results')]],
    url: ADMIN + P + '/site/campaigns',
    imgs: [{ at: -1, src: '41_campaigns', h: 900 }, { at: w('keeps', .1), src: '50_campaign_detail', h: 2271, url: ADMIN + P + '/site/campaigns/13740be8…' }],
    cam: [{ at: -1, z: 1.0, x: 720, y: 450 }, { at: w('keeps', .1), z: 1.0, x: 720, y: 450 }, { at: w('setup', -.1), z: 1.3, x: 1000, y: 820 },
      { at: w('thank', -.2), z: 1.3, x: 1000, y: 1960 }, { at: w('results', -.2), z: 1.3, x: 1000, y: 450 }, { at: END, z: 1.32, x: 1000, y: 452 }],
    cur: [{ at: -1, x: 900, y: 520 }, { at: w('Each', .05), x: 520, y: 194 }],
    click: [w('campaign', 0)],
    hl: [{ a: w('setup'), b: w('thank', -.25), x: 488, y: 640, w: 780, h: 820 }, { a: w('thank'), b: w('results', -.25), x: 488, y: 1760, w: 780, h: 426 },
      { a: w('results'), b: END, x: 488, y: 192, w: 780, h: 128 }]
  }) },

  { id: 's16_ch3', type: 'chapter', build: () => ({ num: '03', title: 'Subscribers' }) },

  { id: 's17_signup', type: 'screen', chapter: 2, build: w => ({
    kicker: '03 · Subscribers', head: 'Sign up in seconds.',
    subs: [['Pick a reminder time', w('reminded')], ['Own language and time zone', w('language')], ['Consent boxes never pre-ticked', w('boxes')]],
    url: SITE + '/signup',
    imgs: [{ at: -1, src: '31_signup', h: 1112 }, { at: w('choosing', -.1), src: '32_signup_filled', h: 900 }, { at: w('pre-ticked', .7), src: '33_signup_done', h: 900, url: SITE + '/pray?joined=1&verify=1' }],
    cam: [{ at: -1, z: 1.12, x: 720, y: 420 }, { at: w('reminded', -.1), z: 1.18, x: 720, y: 560 }, { at: w('language', -.1), z: 1.18, x: 720, y: 460 },
      { at: w('boxes', -.2), z: 1.18, x: 720, y: 640 }, { at: w('pre-ticked', .7), z: 1.12, x: 720, y: 420 }, { at: END, z: 1.12, x: 720, y: 420 }],
    hl: [{ a: w('reminded'), b: w('language', -.15), x: 346, y: 530, w: 747, h: 130 }, { a: w('language'), b: w('boxes', -.2), x: 346, y: 352, w: 747, h: 78 },
      { a: w('boxes'), b: w('pre-ticked', .3), x: 346, y: 758, w: 300, h: 66 }],
    cur: [{ at: -1, x: 900, y: 600 }, { at: w('pre-ticked', .05), x: 420, y: 890 }],
    click: [w('pre-ticked', .4)]
  }) },

  { id: 's18_list', type: 'screen', chapter: 2, build: w => ({
    kicker: '03 · Subscribers', head: 'Every signup, one list.',
    subs: [['Intercessors live in the site’s CRM', w('CRM')]],
    url: ADMIN + P + '/crm/contacts',
    imgs: [{ at: -1, src: '44_contacts', h: 900 }],
    cam: [{ at: -1, z: 1.0, x: 720, y: 450 }, { at: END, z: 1.06, x: 720, y: 470 }],
    hl: [{ a: w('lands'), b: END, x: 322, y: 226, w: 1102, h: 608 }]
  }) },

  { id: 's19_contact', type: 'screen', chapter: 2, build: w => ({
    kicker: '03 · Subscribers', head: 'See each person’s prayer.',
    subs: [['Prayer times and next reminder', w('prayer')], ['Pause, add, check in', w('Pause')], ['Delete their data on request', w('delete')]],
    url: ADMIN + P + '/crm/contacts/be3b0243…',
    imgs: [{ at: -1, src: '51_contact_detail', h: 1741 }],
    cam: [{ at: -1, z: 1.1, x: 760, y: 472 }, { at: w('prayer', -.2), z: 1.35, x: 748, y: 1080 }, { at: w('Pause', -.1), z: 1.45, x: 800, y: 1150 },
      { at: w('delete', -.1), z: 1.5, x: 800, y: 1200 }, { at: END, z: 1.5, x: 800, y: 1205 }],
    hl: [{ a: w('prayer'), b: w('Pause', -.15), x: 360, y: 920, w: 776, h: 376 }, { a: w('Pause'), b: w('check-in', -.15), x: 990, y: 1118, w: 124, h: 36 },
      { a: w('check-in'), b: w('delete', -.15), x: 374, y: 1246, w: 150, h: 40 }, { a: w('delete'), b: END, x: 938, y: 1248, w: 176, h: 38 }]
  }) },

  { id: 's20_email', type: 'screen', chapter: 2, build: w => ({
    kicker: '03 · Subscribers', head: 'Opt-in email only.',
    subs: [['Current or past campaigns', w('current')], ['Everyone who asked for updates', w('everyone')], ['Prayer reminders never affected', w('reminders')]],
    url: ADMIN + P + '/marketing',
    imgs: [{ at: -1, src: '52_marketing', h: 900 }, { at: w('reaches'), src: '53_compose', h: 1297, url: ADMIN + P + '/marketing/new' }],
    cam: [{ at: -1, z: 1.15, x: 760, y: 452 }, { at: w('reaches', .1), z: 1.1, x: 760, y: 472 }, { at: w('opted', .1), z: 1.3, x: 748, y: 940 }, { at: END, z: 1.3, x: 748, y: 950 }],
    hl: [{ a: w('opted'), b: w('current', -.15), x: 256, y: 866, w: 910, h: 26 }, { a: w('current'), b: w('past', -.1), x: 256, y: 896, w: 492, h: 92 },
      { a: w('past'), b: w('everyone', -.1), x: 748, y: 896, w: 492, h: 92 }, { a: w('everyone'), b: w('reminders', -.2), x: 256, y: 990, w: 492, h: 72 }]
  }) },

  { id: 's21_stats', type: 'screen', chapter: 2, build: w => ({
    kicker: '03 · Subscribers', head: 'Track the goal.',
    subs: [['People, prayers, praying now', w('progress')], ['Export intercessors any time', w('export')]],
    url: ADMIN + P + '/site/stats',
    imgs: [{ at: -1, src: '45_stats', h: 1054 }],
    cam: [{ at: -1, z: 1.28, x: 1000, y: 380 }, { at: w('export', -.2), z: 1.32, x: 1000, y: 260 }, { at: END, z: 1.34, x: 1000, y: 262 }],
    hl: [{ a: w('progress'), b: w('export', -.2), x: 340, y: 140, w: 1070, h: 122 }, { a: w('export'), b: END, x: 964, y: 85, w: 186, h: 40 }],
    cur: [{ at: -1, x: 900, y: 500 }, { at: w('export', .1), x: 1060, y: 106 }],
    click: [w('time', 0)]
  }) },

  { id: 's22_outro', type: 'outro', build: w => ({ head: 'Create. Manage. Grow.', cols: [w('Create'), w('manage'), w('grow')], foot: w('Take') }) }
]
