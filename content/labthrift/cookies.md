# LabThrift Cookies and Browser Storage

Draft updated October 3, 2026. Effective date: pending adoption. This notice covers the public pages and shipped browser code reviewed for LabThrift, Lab plan and ByteRush. It is not a complete inventory of storage used after signing in.

## What these technologies do

Cookies are small records a browser can send with matching requests. Local storage keeps information for a website across visits; session storage normally lasts for the current tab's session. Browser or device settings can change those lifetimes. A service can also process network or performance information without setting a cookie.

The [LabThrift Privacy Notice](privacy.md) explains the associated information and purposes. Visiting digifender.com to read this document uses the company website's separate [privacy notice](/legal/privacy).

## Main guide site

At labthrift.com, the appearance control uses the local-storage key `labthrift-theme` for a chosen light or dark theme. Choosing the system setting removes that saved preference. The main guide site does not require an account.

## Lab plan

The shipped planner code uses the following browser records when the relevant controls or account screens are used:

- `lab-plan-theme`: local storage for appearance.
- `lab-plan-tour-done-v2`: local storage recording that the introduction has been completed.
- `lab-plan-cloud-passkey-ack:` followed by the username: local storage for an acknowledgment about a cloud-backed passkey. The key itself can reveal the username to someone with access to that browser profile.
- `lab-plan-pane`: session storage for the selected notebook section.
- `lab-plan-hide-completed`: session storage for the completed-step visibility choice.

Account authentication also involves server-side session handling. Names, lifetimes and attributes of any authenticated-session cookies require verification before adoption; no signed-in cookie inventory was obtained for this draft. Clearing a display preference does not delete notebook records held by the service.

## ByteRush

At app.labthrift.com, `byterush-store` in local storage holds app state. Depending on use, it can include learning progress, followed topics, quiz responses, achievements, inventory entries, guided-project paths and step/completion records, sound preferences, account information and sync status. This record is created even in the initial unsigned-in experience and persists across visits until cleared, replaced or otherwise removed.

The app's export and restore features copy saved information into or out of a file. Protect that file and your browser profile. Local storage is different from your passkey provider's credential storage and from any synchronized server records, including synchronized guided-project progress. Clearing one does not automatically erase the others.

## Cloudflare delivery, security and performance

The reviewed public pages loaded Cloudflare security features. In the inspected browsing sessions, Cloudflare set `cf_clearance` and `__cf_ob` cookies and used `_cfPre_tabId` in session storage. Security storage can vary with the checks applied to a request. Some cookies are persistent and others are session records; inspect your browser for the expiration currently applied. See [Cloudflare's cookie documentation](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/) for its documented security technologies.

The pages also loaded the Cloudflare performance beacon. Cloudflare states that this beacon measures page performance without using cookies or other browser storage for that measurement. It can still send performance and page information to Cloudflare. The security cookies above should not be confused with the separate performance beacon. See [Cloudflare's RUM documentation](https://developers.cloudflare.com/speed/observatory/rum-beacon/).

## Controls and consequences

Your browser can show, block or clear cookies and site storage. Blocking security or sign-in mechanisms can prevent access. Clearing ByteRush storage can remove unsynchronized progress; export anything you need first. Clearing planner preferences resets interface choices and does not establish that account information has been deleted.

This draft does not promise that the product sites currently provide a consent banner or granular cookie-preference center. Required notices and consent controls must be matched to the technologies and jurisdictions involved before adoption. No marketing-ad storage was identified during the public-page review, but that observation is not a claim that no information is processed.

## Questions and changes

We will update the inventory when service features or provider behavior materially change. Contact [legal@digifender.com](mailto:legal@digifender.com), call [(833) 633-9838](tel:+18336339838), or write to Digifender LLC, 9169 W State St #884, Garden City, ID 83714, United States.
