# Problem Picker

Problem Picker helps college students explore 1,670 software and hardware project statements, filter by topic and skill, build a shortlist, and compare ideas.

## Run the website on your computer

1. Install [Node.js 20 or newer](https://nodejs.org/).
2. Download or clone this project, then open a terminal in the project folder.
3. Install the project packages:

   ```bash
   npm install
   ```

4. Start the local website:

   ```bash
   npm run dev
   ```

5. Open the local URL printed in the terminal (usually `http://localhost:5173`).

To check the production build and tests, run:

```bash
npm run build
npm test
npm run lint
npm run format:check
```

## Update the problem statements

Replace `data/problem_statements.xlsx` with the updated workbook, then run the data generator from the project folder. The generator needs Python 3, `pandas`, and `openpyxl`:

```bash
python -m pip install pandas openpyxl
python scripts/build_data.py
```

The script writes `src/data/problems.json`, including grouped topics, tags, and rough difficulty/build-time estimates. Do not edit the generated JSON by hand.

## Deploy to GitHub Pages

1. Push this project to a GitHub repository.
2. In the repository, open **Settings → Pages** and set the source to **GitHub Actions**.
3. Push a commit to the `main` branch (or run the **Deploy to GitHub Pages** workflow manually from the **Actions** tab).
4. Wait for the workflow to finish, then open the Pages URL shown in **Settings → Pages**.

The workflow builds the site, adds a fallback page for direct problem links, and publishes the `dist` folder. Vite derives the correct base path from the GitHub repository name; user/organization Pages repositories use the root path.

## Deploy to Netlify

1. Sign in to [Netlify](https://www.netlify.com/) and choose **Add new site → Import an existing project**.
2. Connect the GitHub repository.
3. Set the build command to `npm run build` and the publish directory to `dist`.
4. Choose **Deploy site**. Netlify rebuilds the site after each push.

## Deploy to Vercel

1. Sign in to [Vercel](https://vercel.com/) and choose **Add New → Project**.
2. Import the GitHub repository.
3. Keep the detected Vite settings, or set the build command to `npm run build` and output directory to `dist`.
4. Choose **Deploy**. Vercel rebuilds the site after each push.
