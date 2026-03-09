# Softvisionxr

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Contact Mail Integration

This project supports two modes for contact email delivery:

- `formsubmit` (default): no SMTP setup required
- `backend`: Node.js API with Nodemailer and SMTP credentials

Current default mode is configured in `src/environments/environment.ts`.

### Quick Start (No SMTP Required)

1. Keep `contactMode: 'formsubmit'` in environment files.
2. Set `contactRecipientEmail` to your inbox email.
3. Submit the contact form once from website.
4. Open FormSubmit activation email and click confirm link.

After activation, all customer form submissions will arrive on your configured email.

### 1) Configure environment variables

Create `.env` in project root and copy values from `.env.example`.

Required mail values:

- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_SECURE`
- `MAIL_USER`
- `MAIL_PASS`
- `CONTACT_TO_EMAIL`

### 2) Run backend API

```bash
npm run server
```

Server starts on `http://localhost:3000` by default.

### 3) Run Angular app

```bash
npm start
```

Angular contact form posts to `http://localhost:3000/api/contact` in development.

### 4) Health check

```bash
GET http://localhost:3000/api/health
```

### API endpoint

```bash
POST /api/contact
```

Payload:

```json
{
	"name": "Your Name",
	"email": "you@example.com",
	"phone": "+91 98765 43210",
	"subject": "Project discussion",
	"message": "I want to discuss a new web platform..."
}
```

### Switch between modes

Use these keys in both `src/environments/environment.ts` and `src/environments/environment.prod.ts`:

- `contactMode`: `formsubmit` or `backend`
- `contactRecipientEmail`: target inbox for `formsubmit`

## Auth and Route Security

This project includes a starter auth/security foundation:

- `AuthGuard` protects secured routes
- `AuthInterceptor` adds `Authorization` header for API calls to `apiBaseUrl`
- Protected route: `/admin`
- Login page route: `/login`

Demo login credentials:

- Email: `admin@softvisionxr.com`
- Password: `Admin@123`

Notes:

- This is a frontend starter auth flow for development and demo use.
- For production, replace demo login logic with backend JWT auth and refresh tokens.

## Free Hosting

This project is ready for free deployment on both Netlify and Vercel.

### Netlify (recommended)

1. Push your latest code to GitHub.
2. In Netlify, choose **Add new site** -> **Import an existing project**.
3. Select this repository.
4. Build settings:
	- Build command: `npm run build:prod`
	- Publish directory: `dist/softvisionxr`
5. Deploy.

`netlify.toml` is already included with SPA redirect support.

### Vercel

1. Import this GitHub repository in Vercel.
2. Framework preset can stay as **Other**.
3. Deploy.

`vercel.json` is already included with static build output and SPA routing.

## SEO Optimization

The project now includes foundational SEO setup:

- Route-wise dynamic page titles and meta descriptions
- Open Graph and Twitter meta tags
- Dynamic canonical URL updates on route change
- `robots.txt` at site root
- `sitemap.xml` at site root

SEO files and config:

- `src/index.html`
- `src/app/app-routing.module.ts`
- `src/app/app.component.ts`
- `src/robots.txt`
- `src/sitemap.xml`

## Custom Domain Setup (Netlify)

1. Open Netlify site dashboard.
2. Go to **Domain settings** -> **Add a domain**.
3. Enter your domain (for example `softvisionxr.com`).
4. In your domain registrar DNS, set:
	- `www` as `CNAME` to your Netlify subdomain
	- Apex/root domain as `A` records to Netlify load balancer IPs (shown in Netlify UI)
5. In Netlify, set the primary domain and enable HTTPS (automatic SSL).

After domain is connected, update these URLs from Netlify URL to your custom domain:

- `src/environments/environment.ts` -> `siteUrl`
- `src/environments/environment.prod.ts` -> `siteUrl`
- `src/index.html` -> canonical and `og:url`
- `src/sitemap.xml` -> all `<loc>` entries
- `src/robots.txt` -> sitemap URL

Then redeploy.
