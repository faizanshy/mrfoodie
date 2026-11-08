MR FOODIE — GITHUB PAGES WEBSITE

FILES
- index.html     Main website page
- style.css      Design and responsive layout
- script.js      Menu, cart, checkout and order email
- assets/        Reserved for your future images

IMPORTANT: CONNECT ORDERS TO YOUR GMAIL
This is a static GitHub Pages website, so it cannot send email by itself. This project uses FormSubmit to deliver checkout orders to your Gmail without a server.

1. Open script.js in Notepad or VS Code.
2. Find this line near the top:
   const ORDER_EMAIL = "YOUR_GMAIL_ADDRESS@gmail.com";
3. Replace the placeholder with the Gmail address where you want to receive orders. Keep the quotation marks.
4. Save the file.
5. Upload the CONTENTS of this Mr-Foodie folder to the ROOT of your GitHub repository. index.html must be at the top level, not inside another folder.
6. In GitHub, open Settings > Pages. Select Deploy from a branch, choose your main branch and /(root), then Save.
7. Open your published website and submit one test order.
8. FormSubmit will send an activation/confirmation email to your Gmail. Open it and click the activation link. After activation, future orders will be delivered to that inbox.

NOTES
- The website does not process online card payments. Checkout currently offers Cash on Delivery or “Other (confirm by phone)”.
- Delivery fee is not calculated; confirm it with the customer.
- Test the first order and email activation before sharing the website with customers.
- Keep your Gmail address correct in script.js.
- FormSubmit is a third-party email delivery service. Its availability and policies are separate from GitHub Pages.
