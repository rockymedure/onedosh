# OneDosh — Visual Reference

Screenshots of the OneDosh mobile app, captured for a UX/UI review to identify areas for improvement. Screens are grouped by flow and numbered in the order a user encounters them.

## Flows

### 01 · Onboarding & Sign-up (`screens/01-onboarding/`)
| # | Screen | Notes |
|---|--------|-------|
| 01 | Splash / Get Started | Landing screen, "OneDosh. One Click." |
| 02 | Welcome — User Agreements | ToS/Privacy consent (OneDosh + Bridge) |
| 03 | Choose your Country (step 1/5) | Progress stepper, country dropdown |
| 04 | Select Country modal | Searchable country list |
| 05 | Verify Email — OTP entry | 6-digit code + custom numpad |
| 06 | Verification email | Email containing the 6-digit code |
| 07 | Confirm your PIN | 6-digit PIN entry |
| 08 | Enable Biometrics + Notifications prompt | System permission overlapping sheet |
| 09 | Enable Biometrics — Launch | Biometrics toggled on, "Launch OneDosh" |

### 02 · KYC / Identity Verification (`screens/02-kyc-verification/`)
Powered by Sumsub.
| # | Screen | Notes |
|---|--------|-------|
| 01 | Open Wallet — Verify Identity | Home prompt to verify identity |
| 02 | Residency selection | US vs. all other countries |
| 03 | Profile details (SSN, DOB) | Sensitive PII entry |
| 04 | "Your data has been accepted" (loading) | Transition/loading state |
| 05 | Verification status — Under review | ~2 min review notice |
| 06 | Verify phone number | Phone entry |
| 07 | Phone verified | Success confirmation |
| 08 | Occupation / Source of funds | Regulatory questionnaire |
| 09 | "Your data has been accepted" (success) | Completion state |

### 03 · Home & Wallet (`screens/03-home-wallet/`)
| # | Screen | Notes |
|---|--------|-------|
| 01 | Home — NG Wallet (empty) | ₦0.00, no transactions |
| 02 | Home — NG Wallet (alt capture) | Near-duplicate of 01 |
| 03 | US Wallet — USDC info sheet | "Enabling Instant Money Movement" |
| 04 | US Wallet — Cash App pending | Pending +$1.00 USDC transaction |

### 04 · Add Funds (`screens/04-add-funds/`)
| # | Screen | Notes |
|---|--------|-------|
| 01 | Add funds options | Cash App / Bank Account / Stablecoin |
| 02 | Get a virtual US bank account | Upsell sheet |
| 03 | Virtual account — USD / ACH | Lead Bank account + routing |
| 04 | Virtual account — Naira | paga account details |
| 05 | Convert to USDC | NGN → USDC conversion |

### 05 · Send / Pay (`screens/05-send/`)
| # | Screen | Notes |
|---|--------|-------|
| 01 | Select Network (stablecoin) | Chain selection with loss-of-funds warning |
| 02 | Send to a bank account | Amount entry + remarks |
| 03 | Pay Bitcoin — confirm | BTC payment confirmation |

### 06 · Cards (`screens/06-cards/`)
| # | Screen | Notes |
|---|--------|-------|
| 01 | Cards — verification in progress | Card gated on KYC |
| 02 | Create virtual card — setup fee | $1.00 one-time fee |
| 03 | Card for global spending — intro | Marketing intro |

### 07 · Profile (`screens/07-profile/`)
| # | Screen | Notes |
|---|--------|-------|
| 01 | Profile menu | Account, security, help, settings, about, logout |
