import type { Conversation, Message, Post, Ride, User } from '../../types'

/**
 * Seed data for demo mode.
 *
 * Timestamps are generated relative to load time so the feed always reads as
 * "posted 2 hours ago" rather than showing stale dates.
 */

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const ago = (ms: number) => new Date(Date.now() - ms).toISOString()
const ahead = (ms: number) => new Date(Date.now() + ms).toISOString()

const img = (name: string) => `${process.env.PUBLIC_URL || ''}/assets/listings/${name}.svg`

/** The identity a visitor gets when they enter the demo. */
export const DEMO_USER: User = {
  id: 'demo-user',
  name: 'Demo Student',
  email: 'demo@purdue.edu',
  university: 'Purdue University',
  verified: true,
  created_at: ago(90 * DAY),
  updated_at: ago(2 * DAY),
}

export const DEMO_SELLERS: User[] = [
  {
    id: 'user-maya',
    name: 'Maya Rodriguez',
    email: 'mrodriguez@purdue.edu',
    university: 'Purdue University',
    verified: true,
    created_at: ago(200 * DAY),
    updated_at: ago(3 * DAY),
  },
  {
    id: 'user-devin',
    name: 'Devin Park',
    email: 'dpark@purdue.edu',
    university: 'Purdue University',
    verified: true,
    created_at: ago(150 * DAY),
    updated_at: ago(DAY),
  },
  {
    id: 'user-aisha',
    name: 'Aisha Bello',
    email: 'abello@iu.edu',
    university: 'Indiana University',
    verified: true,
    created_at: ago(120 * DAY),
    updated_at: ago(5 * HOUR),
  },
  {
    id: 'user-tyler',
    name: 'Tyler Nguyen',
    email: 'tnguyen@purdue.edu',
    university: 'Purdue University',
    verified: true,
    created_at: ago(80 * DAY),
    updated_at: ago(12 * HOUR),
  },
  {
    id: 'user-sofia',
    name: 'Sofia Kaur',
    email: 'skaur@iu.edu',
    university: 'Indiana University',
    verified: true,
    created_at: ago(60 * DAY),
    updated_at: ago(30 * MINUTE),
  },
  {
    id: 'user-jalen',
    name: 'Jalen Brooks',
    email: 'jbrooks@purdue.edu',
    university: 'Purdue University',
    verified: true,
    created_at: ago(40 * DAY),
    updated_at: ago(4 * HOUR),
  },
]

export const DEMO_USERS: User[] = [DEMO_USER, ...DEMO_SELLERS]

const seller = (id: string) => {
  const u = DEMO_USERS.find((candidate) => candidate.id === id)
  return u
    ? { name: u.name, avatar: u.avatar, university: u.university }
    : { name: 'Anonymous', avatar: undefined, university: '' }
}

type SeedPost = Omit<Post, 'users'> & { users: NonNullable<Post['users']> }

const post = (p: Omit<Post, 'users'>): SeedPost => ({ ...p, users: seller(p.user_id) })

export const DEMO_POSTS: Post[] = [
  post({
    id: 'post-iphone-13-pro',
    user_id: 'user-maya',
    type: 'item',
    title: 'iPhone 13 Pro — 128GB, Graphite',
    description:
      'Battery health 91%, no scratches on the screen. Comes with the original box, a MagSafe case and a 20W charger. Upgrading to a 16 so it needs to go before finals week.',
    price: 520,
    category: 'Electronics',
    location: 'Purdue — Chauncey Hill',
    images: [img('electronics-phone')],
    created_at: ago(2 * HOUR),
    status: 'active',
    tags: ['iphone', 'apple', 'unlocked'],
    is_flash_deal: false,
  }),
  post({
    id: 'post-stewart-calculus',
    user_id: 'user-devin',
    type: 'book',
    title: 'Stewart Calculus, 8th Ed. (MA 161/162)',
    description:
      'Hardcover, all pages intact, light highlighting in chapters 3-5. Same edition the department still lists for MA 161. Bookstore wants $180 for this.',
    price: 40,
    category: 'Books',
    location: 'Purdue — Wiley Hall',
    images: [img('books-textbook')],
    created_at: ago(5 * HOUR),
    status: 'active',
    tags: ['textbook', 'calculus', 'ma161'],
    is_flash_deal: false,
  }),
  post({
    id: 'post-purdue-iu-football',
    user_id: 'user-tyler',
    type: 'ticket',
    title: 'Purdue vs. Indiana — 2 tickets, Section 8',
    description:
      'Two seats together, row 14, shaded side. Transferring through the official app so the barcodes move cleanly. Selling at face value, not scalping.',
    price: 85,
    category: 'Tickets',
    location: 'Ross-Ade Stadium',
    images: [img('tickets-game')],
    created_at: ago(40 * MINUTE),
    status: 'active',
    tags: ['football', 'bucket-game', 'student-section'],
    is_flash_deal: false,
  }),
  post({
    id: 'post-futon-grey',
    user_id: 'user-aisha',
    type: 'item',
    title: 'Grey futon — folds flat, fits a dorm',
    description:
      'Two years old, no stains or tears, cover is machine washable. You will need a friend and an SUV. Can help carry it down to the loading door.',
    price: 75,
    category: 'Furniture',
    location: 'IU — Bloomington, 3rd St',
    images: [img('furniture-futon')],
    created_at: ago(8 * HOUR),
    status: 'active',
    tags: ['futon', 'dorm', 'moving-out'],
    is_flash_deal: false,
  }),
  post({
    id: 'post-mini-fridge',
    user_id: 'user-sofia',
    type: 'item',
    title: 'Mini fridge, 3.2 cu ft — works perfectly',
    description:
      'Small freezer compartment on top, runs quiet enough to sleep next to. Cleaned out and defrosted already. Pickup only, no delivery.',
    price: 55,
    category: 'Electronics',
    location: 'IU — Read Center',
    images: [img('appliance-fridge')],
    created_at: ago(DAY + 3 * HOUR),
    status: 'active',
    tags: ['fridge', 'dorm', 'appliance'],
    is_flash_deal: false,
  }),
  post({
    id: 'post-trek-bike',
    user_id: 'user-jalen',
    type: 'item',
    title: 'Trek FX 2 hybrid — tuned last month',
    description:
      'Size M, new brake pads and a fresh chain from the co-op. Includes a U-lock and a rear rack. Great for the ride from campus to Lafayette.',
    price: 230,
    category: 'Sports',
    location: 'Purdue — Cary Quad',
    images: [img('sports-bike')],
    created_at: ago(2 * DAY),
    status: 'active',
    tags: ['bike', 'trek', 'commuter'],
    is_flash_deal: false,
  }),
  post({
    id: 'post-airport-ride',
    user_id: 'user-devin',
    type: 'ride',
    title: 'Ride to IND airport — Friday 6am, 3 seats',
    description:
      'Leaving from the Union at 6:00am sharp, arriving around 7:15. Splitting gas four ways. One carry-on plus a checked bag each fits in the trunk.',
    price: 22,
    category: 'Transportation',
    location: 'Purdue Memorial Union',
    images: [img('ride-airport')],
    created_at: ago(6 * HOUR),
    status: 'active',
    tags: ['ride', 'airport', 'break'],
    is_flash_deal: false,
  }),
  post({
    id: 'post-sublet-summer',
    user_id: 'user-aisha',
    type: 'sublet',
    title: 'Summer sublet — 1 room in a 3BR, utilities in',
    description:
      'May through August, furnished, in-unit laundry, 12 minute walk to the union. Two quiet roommates who are also on campus for the summer.',
    price: 480,
    category: 'Housing',
    location: 'IU — Bloomington, Walnut St',
    images: [img('housing-sublet')],
    created_at: ago(3 * DAY),
    status: 'active',
    tags: ['sublet', 'summer', 'furnished'],
    is_flash_deal: false,
  }),
  post({
    id: 'post-orgo-tutoring',
    user_id: 'user-sofia',
    type: 'service',
    title: 'Organic chemistry tutoring — $20/hr',
    description:
      'TA for CHEM 255 for three semesters. I work through past exams rather than re-lecturing. Meet at the library or over a call, groups of two welcome.',
    price: 20,
    category: 'Services',
    location: 'IU — Wells Library',
    images: [img('service-tutoring')],
    created_at: ago(11 * HOUR),
    status: 'active',
    tags: ['tutoring', 'chem255', 'exam-prep'],
    is_flash_deal: false,
  }),
  post({
    id: 'post-dell-monitor',
    user_id: 'user-maya',
    type: 'item',
    title: 'Dell 27" 1440p monitor + stand',
    description:
      'IPS panel, 75Hz, no dead pixels. HDMI and DisplayPort cables included. Bought it for a co-op that went remote and never needed two screens.',
    price: 140,
    category: 'Electronics',
    location: 'Purdue — Lawson Hall',
    images: [img('electronics-monitor')],
    created_at: ago(19 * HOUR),
    status: 'active',
    tags: ['monitor', 'dell', '1440p'],
    is_flash_deal: false,
  }),
  post({
    id: 'post-standing-desk',
    user_id: 'user-tyler',
    type: 'item',
    title: 'Standing desk, manual crank — 48"',
    description:
      'Solid top, crank is smooth, no wobble at standing height. Disassembles into two pieces so it fits in a sedan. Graduating in May.',
    price: 95,
    category: 'Furniture',
    location: 'Purdue — West Lafayette',
    images: [img('furniture-desk')],
    created_at: ago(4 * DAY),
    status: 'active',
    tags: ['desk', 'standing-desk', 'graduating'],
    is_flash_deal: false,
  }),
  post({
    id: 'post-hoodie-bundle',
    user_id: 'user-jalen',
    type: 'item',
    title: 'Purdue hoodie bundle — 3 for $30',
    description:
      'Two black, one gold, all size L, all washed. No cracked prints. Cheaper than one new hoodie at the bookstore.',
    price: 30,
    category: 'Clothing',
    location: 'Purdue — Hillenbrand',
    images: [img('clothing-hoodie')],
    created_at: ago(DAY + 8 * HOUR),
    status: 'active',
    tags: ['hoodie', 'apparel', 'bundle'],
    is_flash_deal: false,
  }),

  /* Flash deals — these drive the Live Now tab. */
  post({
    id: 'post-flash-concert',
    user_id: 'user-sofia',
    type: 'ticket',
    title: 'Tonight: Elliott Hall show — 1 ticket',
    description:
      'Floor, row J. My ride bailed so it is going for half of what I paid. Doors at 7, I can transfer it the moment you message me.',
    price: 35,
    category: 'Tickets',
    location: 'Elliott Hall of Music',
    images: [img('tickets-concert')],
    created_at: ago(25 * MINUTE),
    status: 'active',
    tags: ['concert', 'tonight', 'floor'],
    is_flash_deal: true,
    flash_deal_expires_at: ahead(4 * HOUR),
  }),
  post({
    id: 'post-flash-textbooks',
    user_id: 'user-devin',
    type: 'book',
    title: 'Flash: 4 engineering textbooks, $60 the lot',
    description:
      'Thermo, statics, circuits and linear algebra. Moving out Sunday and they are not coming with me. First person to show up gets all four.',
    price: 60,
    category: 'Books',
    location: 'Purdue — Armstrong Hall',
    images: [img('books-novel')],
    created_at: ago(70 * MINUTE),
    status: 'active',
    tags: ['textbooks', 'bundle', 'moving-out'],
    is_flash_deal: true,
    flash_deal_expires_at: ahead(2 * HOUR),
  }),
  post({
    id: 'post-flash-fridge',
    user_id: 'user-aisha',
    type: 'item',
    title: 'Flash: desk lamp + fan, free with fridge',
    description:
      'Clearing my room tonight. Lamp and fan are free if you take the mini fridge listing too. Everything works, nothing is broken.',
    price: 45,
    category: 'Furniture',
    location: 'IU — Read Center',
    images: [img('appliance-fridge')],
    created_at: ago(3 * HOUR),
    status: 'active',
    tags: ['free', 'moving-out', 'tonight'],
    is_flash_deal: true,
    flash_deal_expires_at: ahead(6 * HOUR),
  }),

  /* A sold listing, so Profile and filtering have something non-active to show. */
  post({
    id: 'post-sold-airpods',
    user_id: 'demo-user',
    type: 'item',
    title: 'AirPods Pro (2nd gen) — sold',
    description: 'Sold to a sophomore in Cary. Left up as a reference for the reputation score.',
    price: 130,
    category: 'Electronics',
    location: 'Purdue — Cary Quad',
    created_at: ago(9 * DAY),
    status: 'sold',
    tags: ['airpods', 'sold'],
    is_flash_deal: false,
  }),

  /* Listings owned by the demo visitor, so Profile is not empty. */
  post({
    id: 'post-demo-lamp',
    user_id: 'demo-user',
    type: 'item',
    title: 'Desk lamp, adjustable arm',
    description:
      'Warm and cool settings, USB port in the base. Barely used since I mostly work in the library.',
    price: 15,
    category: 'Furniture',
    location: 'Purdue — Hillenbrand',
    created_at: ago(DAY),
    status: 'active',
    tags: ['lamp', 'desk'],
    is_flash_deal: false,
  }),
]

export const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-maya',
    participants: [DEMO_USER.id, 'user-maya'],
    last_message_id: 'msg-maya-3',
    unread_count: 1,
    created_at: ago(DAY),
    updated_at: ago(18 * MINUTE),
    listing_title: 'iPhone 13 Pro — 128GB, Graphite',
    listing_price: 520,
    listing_image: img('electronics-phone'),
  },
  {
    id: 'conv-devin',
    participants: [DEMO_USER.id, 'user-devin'],
    last_message_id: 'msg-devin-2',
    unread_count: 0,
    created_at: ago(2 * DAY),
    updated_at: ago(4 * HOUR),
    listing_title: 'Stewart Calculus, 8th Ed. (MA 161/162)',
    listing_price: 40,
    listing_image: img('books-textbook'),
  },
  {
    id: 'conv-tyler',
    participants: [DEMO_USER.id, 'user-tyler'],
    last_message_id: 'msg-tyler-2',
    unread_count: 2,
    created_at: ago(3 * DAY),
    updated_at: ago(DAY),
    listing_title: 'Purdue vs. Indiana — 2 tickets, Section 8',
    listing_price: 85,
    listing_image: img('tickets-game'),
  },
]

export const DEMO_MESSAGES: Message[] = [
  {
    id: 'msg-maya-1',
    sender_id: DEMO_USER.id,
    receiver_id: 'user-maya',
    conversation_id: 'conv-maya',
    post_id: 'post-iphone-13-pro',
    content: 'Hey, is the 13 Pro still around? Would $480 work if I pick it up today?',
    created_at: ago(3 * HOUR),
    read: true,
  },
  {
    id: 'msg-maya-2',
    sender_id: 'user-maya',
    receiver_id: DEMO_USER.id,
    conversation_id: 'conv-maya',
    post_id: 'post-iphone-13-pro',
    content: 'Still here. I can do $500 with the case and charger, that is as low as I can go.',
    created_at: ago(50 * MINUTE),
    read: true,
  },
  {
    id: 'msg-maya-3',
    sender_id: 'user-maya',
    receiver_id: DEMO_USER.id,
    conversation_id: 'conv-maya',
    post_id: 'post-iphone-13-pro',
    content: 'I am in the Union until 4 if you want to look at it first.',
    created_at: ago(18 * MINUTE),
    read: false,
  },
  {
    id: 'msg-devin-1',
    sender_id: DEMO_USER.id,
    receiver_id: 'user-devin',
    conversation_id: 'conv-devin',
    post_id: 'post-stewart-calculus',
    content: 'Is the calc book the loose-leaf version or the hardcover?',
    created_at: ago(6 * HOUR),
    read: true,
  },
  {
    id: 'msg-devin-2',
    sender_id: 'user-devin',
    receiver_id: DEMO_USER.id,
    conversation_id: 'conv-devin',
    post_id: 'post-stewart-calculus',
    content: 'Hardcover. Binding is solid, I only highlighted the integration chapters.',
    created_at: ago(4 * HOUR),
    read: true,
  },
  {
    id: 'msg-tyler-1',
    sender_id: 'user-tyler',
    receiver_id: DEMO_USER.id,
    conversation_id: 'conv-tyler',
    post_id: 'post-purdue-iu-football',
    content: 'Both seats are together in section 8 if you still want the pair.',
    created_at: ago(DAY + HOUR),
    read: false,
  },
  {
    id: 'msg-tyler-2',
    sender_id: 'user-tyler',
    receiver_id: DEMO_USER.id,
    conversation_id: 'conv-tyler',
    post_id: 'post-purdue-iu-football',
    content: 'Transfer takes about a minute through the app once you send me your email.',
    created_at: ago(DAY),
    read: false,
  },
]

export const DEMO_RIDES: Ride[] = [
  {
    id: 'ride-ind-friday',
    driver_id: 'user-devin',
    origin: 'Purdue Memorial Union',
    destination: 'Indianapolis Airport (IND)',
    departure_time: ahead(2 * DAY),
    available_seats: 3,
    price: 22,
    description: 'Leaving 6:00am sharp, splitting gas four ways.',
    status: 'active',
    created_at: ago(6 * HOUR),
  },
  {
    id: 'ride-chicago-break',
    driver_id: 'user-jalen',
    origin: 'West Lafayette',
    destination: 'Chicago — Union Station',
    departure_time: ahead(5 * DAY),
    available_seats: 2,
    price: 30,
    description: 'Dropping at Union Station, can detour to Hyde Park for $5 more.',
    status: 'active',
    created_at: ago(DAY),
  },
]
