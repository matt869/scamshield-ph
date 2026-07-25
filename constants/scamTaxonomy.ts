import type { ScamCategory } from '../types';

/**
 * Taxonomy of scams commonly targeting Filipinos. Used both as the label set
 * the model classifies into and as the content for the Learn screen.
 */
export const SCAM_TAXONOMY: ScamCategory[] = [
  {
    id: 'gcash_phishing',
    label: 'GCash / e-wallet phishing',
    aliases: ['fake GCash', 'Maya scam'],
    description:
      'Fake messages pretending to be GCash, Maya, or another e-wallet, claiming your account is locked, you received money by mistake, or you won a promo. The goal is to steal your MPIN or OTP, or get you to "return" money.',
    channels: ['SMS', 'Messenger', 'Viber', 'Email'],
    warningSigns: [
      'Links that are not gcash.com or maya.ph (e.g. gcash-verify.xyz)',
      'Asking for your MPIN or OTP — legit apps never ask for these',
      'Urgent threats: "account will be deactivated within 24 hours"',
      '"Nagkamali po ako ng send" followed by a request to send money back',
    ],
    example:
      'GCASH: Your account has been temporarily locked due to unusual activity. Verify now at gcash-secure-ph.com to avoid permanent deactivation.',
  },
  {
    id: 'bank_phishing',
    label: 'Bank phishing (smishing)',
    aliases: ['fake bank SMS'],
    description:
      'Texts or emails impersonating BDO, BPI, Metrobank, UnionBank, Landbank, etc., with links to fake login pages that harvest your credentials and OTP.',
    channels: ['SMS', 'Email'],
    warningSigns: [
      "Sender is a regular mobile number, not the bank's registered name",
      'Link domains that imitate the bank (bdo-online-ph.com)',
      'Claims of "unauthorized transaction" you must cancel via a link',
    ],
    example:
      'BDO Advisory: We detected a login from an unknown device. If this was not you, secure your account: bdo-verification-ph.net',
  },
  {
    id: 'otp_sim_swap',
    label: 'OTP theft / SIM swap',
    aliases: ['OTP scam'],
    description:
      'Someone convinces you to share a one-time PIN, or hijacks your SIM by tricking your telco, letting them take over your e-wallet, bank, and social accounts.',
    channels: ['Call', 'SMS'],
    warningSigns: [
      'Caller claiming to be "customer service" asking you to read back an OTP',
      'Unexpected OTP messages you did not request',
      'Sudden loss of mobile signal (possible SIM swap in progress)',
    ],
    example:
      'This is Globe customer care. To upgrade your SIM to 5G, please read back the 6-digit code we just sent you.',
  },
  {
    id: 'investment_scam',
    label: 'Investment / paluwagan scam',
    aliases: ['budol', 'double-your-money', 'Ponzi'],
    description:
      'Offers of guaranteed high returns — crypto trading, "paluwagan" pools, forex bots, or agri "cooperatives". Early payouts come from new victims until the operator disappears.',
    channels: ['Facebook', 'Messenger', 'Telegram', 'TikTok'],
    warningSigns: [
      'Guaranteed returns ("30% monthly, walang talo")',
      'Pressure to recruit friends and family',
      'Not registered with the SEC, or using a fake SEC registration',
      'Payouts only via e-wallet to personal accounts',
    ],
    example:
      'Legit po ito! Invest 5,000 now and receive 6,500 in 7 days. Proof of payouts in our group. Limited slots only!',
  },
  {
    id: 'love_scam',
    label: 'Romance / love scam',
    aliases: ['catfishing'],
    description:
      'A stranger builds a romantic relationship online, then invents emergencies — hospital bills, customs fees, plane tickets — that only your money can solve.',
    channels: ['Facebook', 'Dating apps', 'Instagram', 'WhatsApp'],
    warningSigns: [
      'Refuses video calls or always has camera problems',
      'Professes love unusually fast',
      'Every story eventually leads to a money request',
      'Photos are stock images or stolen from other profiles',
    ],
    example:
      'My love, I shipped a package with my savings for our future, but customs is asking for a ₱35,000 release fee. Can you help me just this once?',
  },
  {
    id: 'job_offer_scam',
    label: 'Fake job offer / task scam',
    aliases: ['task scam', 'like-and-earn'],
    description:
      'Recruiters offering easy online jobs — liking videos, boosting orders, data entry — that pay small amounts at first, then require "deposits" or "membership upgrades" to withdraw earnings.',
    channels: ['WhatsApp', 'Telegram', 'SMS', 'Facebook'],
    warningSigns: [
      'Hired instantly with no interview',
      'Small real payouts early to build trust',
      'You must top up your own money to "unlock" bigger tasks',
      'Company name is vague or impersonates a real brand',
    ],
    example:
      'Good day! We are hiring part-time staff. Earn 500-3,000 pesos daily just by liking TikTok videos. No experience needed. Message us to start!',
  },
  {
    id: 'online_seller_scam',
    label: 'Online seller / buyer scam',
    aliases: ['fake shop', 'COD scam'],
    description:
      'Fake online shops that take payment and never ship, sellers who send fake items, or "buyers" who send forged payment screenshots for your items.',
    channels: ['Facebook Marketplace', 'Instagram', 'Shopee/Lazada look-alikes'],
    warningSigns: [
      'Price far below market ("rush sale, need money today")',
      'Payment only via direct bank/e-wallet transfer, refuses COD',
      'New account with no reviews, comments turned off',
      'Buyer sends a "payment confirmation" screenshot and pressures you to ship',
    ],
    example:
      'iPhone 15 Pro Max brand new sealed 25k only!! Rush!! First to pay first served, GCash only, no COD po.',
  },
  {
    id: 'loan_app_harassment',
    label: 'Predatory loan app',
    aliases: ['5-6 online', 'harassment loans'],
    description:
      'Unregistered lending apps that grant instant loans, then harvest your contacts and photos to shame and harass you into paying inflated "penalties".',
    channels: ['App stores', 'SMS', 'Facebook ads'],
    warningSigns: [
      'App demands access to contacts and gallery',
      'Loan term is much shorter than advertised',
      'Threats to message your contacts if you are late',
      "Not on the SEC's list of registered lending companies",
    ],
    example:
      'FINAL WARNING: Your loan is overdue. Pay within 2 hours or we will send your photo and details to all your contacts as a SCAMMER alert.',
  },
  {
    id: 'lottery_raffle',
    label: 'Fake lottery / raffle win',
    aliases: ['congratulations scam'],
    description:
      'Messages claiming you won a raffle from a telco, mall, or brand — but you must pay "tax" or "processing fees" first, or click a link to claim.',
    channels: ['SMS', 'Messenger', 'Email'],
    warningSigns: [
      'You never joined the raffle',
      'Winning requires paying a fee upfront',
      'Uses names like DTI/telco promos with fake permit numbers',
    ],
    example:
      'CONGRATULATIONS! Your SIM number won ₱780,000 in a foundation raffle draw. To claim, contact Atty. Reyes and prepare the processing fee.',
  },
  {
    id: 'government_impersonation',
    label: 'Government agency impersonation',
    aliases: ['SSS/PhilHealth scam', 'BIR scam'],
    description:
      'Fake messages from SSS, PhilHealth, Pag-IBIG, BIR, LTO, or POEA about benefits, violations, or unclaimed funds, designed to steal credentials or collect "fees".',
    channels: ['SMS', 'Email', 'Facebook'],
    warningSigns: [
      'Government agencies do not send clickable links for claims via SMS',
      'Demands payment via e-wallet to a personal number',
      'Threatens arrest or license suspension unless you act now',
    ],
    example:
      'SSS NOTICE: You have unclaimed benefits worth ₱14,500. Claim before expiry: sss-benefits-ph.com/claim',
  },
  {
    id: 'parcel_scam',
    label: 'Parcel / delivery scam',
    aliases: ['customs fee scam'],
    description:
      'Fake notifications from LBC, J&T, DHL, or "customs" saying a package is on hold until you pay a fee or confirm details via a link.',
    channels: ['SMS', 'Email'],
    warningSigns: [
      'You are not expecting a package',
      'Tracking link goes to a non-official domain',
      'Small "redelivery fee" designed to capture your card details',
    ],
    example:
      'J&T Express: Your parcel #PH88231 is on hold due to incomplete address. Pay the ₱45 redelivery fee here: jnt-track-ph.info',
  },
  {
    id: 'family_emergency',
    label: 'Family emergency / impostor',
    aliases: ['dugo-dugo', 'kamag-anak scam'],
    description:
      'Someone poses as a relative, friend, or their "lawyer/nurse" claiming an accident, arrest, or emergency that needs money immediately — increasingly using hacked accounts or AI-cloned voices.',
    channels: ['Call', 'Messenger', 'SMS'],
    warningSigns: [
      'Extreme urgency and secrecy ("wag mo muna sabihin kay Mama")',
      'Refuses to be called back on the known number',
      'A relative\'s account suddenly asking to borrow money or "pahiram ng load"',
    ],
    example:
      'Ate, si Kuya to, bagong number ko. Na-aksidente ako, nasa hospital. Pahiram muna ng 8k for deposit, bayaran ko agad pagkalabas ko. Wag mo na tawagan si Mama, mag-aalala lang.',
  },
];

export const CATEGORY_IDS = SCAM_TAXONOMY.map((c) => c.id);

export function getCategory(id: string): ScamCategory | undefined {
  return SCAM_TAXONOMY.find((c) => c.id === id);
}

/** Compact one-line-per-category digest injected into the system prompt. */
export function taxonomyDigest(): string {
  return SCAM_TAXONOMY.map((c) => `- ${c.id}: ${c.label} — ${c.description}`).join('\n');
}
