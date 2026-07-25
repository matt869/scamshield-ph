import type { ActionGuide, Hotline } from '../types';

/**
 * PH reporting channels and recovery playbooks shown on the Recovery screen.
 * Contact details are the publicly listed ones as of mid-2026 — surface them
 * with a "verify on the official site" note since hotlines change.
 */

export const NATIONAL_HOTLINES: Hotline[] = [
  {
    name: 'NBI Cybercrime Division',
    contact: '(02) 8523-8231 loc. 3454 / ccdov@nbi.gov.ph',
    note: 'File a complaint in person or via the NBI website (nbi.gov.ph).',
  },
  {
    name: 'PNP Anti-Cybercrime Group (ACG)',
    contact: '(02) 8414-1560 / 0966-976-5971 / acg.pnp.gov.ph',
    note: 'Accepts walk-in and online complaints; keep your screenshots as evidence.',
  },
  {
    name: 'Cybercrime Investigation and Coordinating Center (CICC)',
    contact: '1326 (24/7 hotline)',
    note: 'Government hotline for scam and cybercrime victims.',
  },
  {
    name: 'DTI Consumer Care (online sellers)',
    contact: '1-384 (1-DTI) / consumercare@dti.gov.ph',
  },
  {
    name: 'SEC Enforcement (investment scams)',
    contact: 'epd@sec.gov.ph / (02) 8818-6337',
    note: 'Check if an investment entity is registered at sec.gov.ph before investing.',
  },
  {
    name: 'Bangko Sentral ng Pilipinas (bank complaints)',
    contact: 'consumeraffairs@bsp.gov.ph / BSP Online Buddy at bsp.gov.ph',
    note: 'Escalate here if your bank or e-wallet does not resolve your complaint.',
  },
];

export const ACTION_GUIDES: ActionGuide[] = [
  {
    id: 'just_received',
    title: 'I just received this — what now?',
    appliesTo: [],
    steps: [
      'Do not click any link, and do not reply — even to say "stop". Replying confirms your number is active.',
      'Do not share any OTP, MPIN, PIN, or password with anyone, ever. No legit company asks for these.',
      'Block and report the sender in your messaging app.',
      'If it impersonates a company (bank, GCash, telco), report it to that company through their official app or hotline so they can warn others.',
      'Warn family members — scammers often blast the same message to related numbers.',
    ],
    hotlines: [],
  },
  {
    id: 'clicked_link',
    title: 'I clicked the link or entered my details',
    appliesTo: ['gcash_phishing', 'bank_phishing', 'government_impersonation', 'parcel_scam'],
    steps: [
      'Change the password of the affected account immediately, and of any other account using the same password.',
      'Enable two-factor authentication (but never share the codes with anyone).',
      'If you entered card details, call your bank now to block the card.',
      'If you entered your e-wallet MPIN, change it in the app and review linked devices.',
      'Watch for OTP texts you did not request — that means someone is trying to log in.',
    ],
    hotlines: [],
  },
  {
    id: 'sent_money',
    title: 'I already sent money',
    appliesTo: [],
    steps: [
      'Act fast — recovery is most likely in the first hours.',
      'GCash: report in-app via Help Center, or call 2882. Ask them to flag the recipient account.',
      'Maya: call (02) 8845-7788 or report in-app.',
      'Bank transfer: call your bank\'s hotline and request a recall/dispute; also report the recipient account to the receiving bank.',
      'Save everything: screenshots of the conversation, receipts, reference numbers, the scammer\'s number/account.',
      'File a report with NBI Cybercrime or PNP ACG — banks and e-wallets act faster with a police/NBI report number.',
    ],
    hotlines: [],
  },
  {
    id: 'shared_otp',
    title: 'I shared my OTP / MPIN',
    appliesTo: ['otp_sim_swap', 'gcash_phishing', 'bank_phishing'],
    steps: [
      'Open the real app immediately and change your MPIN/password before the scammer uses the code.',
      'Log out all other devices/sessions in the app\'s security settings.',
      'Call the provider\'s hotline to freeze the account if you see any transaction you did not make.',
      'If your phone suddenly loses signal, contact your telco at once — your SIM may be getting swapped.',
    ],
    hotlines: [],
  },
  {
    id: 'loan_harassment',
    title: 'A loan app is harassing me',
    appliesTo: ['loan_app_harassment'],
    steps: [
      'Do not pay "penalties" out of fear — harassment and contact-shaming are illegal (SEC and NPC rules).',
      'Screenshot every threat; these are your evidence.',
      'Report the app to the SEC (epd@sec.gov.ph) and the National Privacy Commission (complaints@privacy.gov.ph).',
      'Warn your contacts that messages "exposing" you are part of an illegal collection scheme.',
      'Revoke the app\'s permissions and uninstall it after collecting evidence.',
    ],
    hotlines: [],
  },
  {
    id: 'investment_loss',
    title: 'I invested and can\'t withdraw',
    appliesTo: ['investment_scam', 'job_offer_scam'],
    steps: [
      'Stop sending money now — "unlock fees" and "tax payments" to release your balance are part of the scam.',
      'Do not recruit anyone else, even to "recover" your loss.',
      'Collect proof: group chats, payment receipts, wallet addresses, account names.',
      'Report the scheme to the SEC Enforcement and Investor Protection Department.',
      'File a complaint with NBI Cybercrime or PNP ACG; group complaints from multiple victims move faster.',
    ],
    hotlines: [],
  },
];

/** Guides relevant to a category, general ones first. */
export function guidesForCategory(categoryId: string): ActionGuide[] {
  const general = ACTION_GUIDES.filter((g) => g.appliesTo.length === 0);
  const specific = ACTION_GUIDES.filter((g) => g.appliesTo.includes(categoryId));
  return [...specific, ...general];
}
