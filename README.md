# WSU Software Development Club Website

The official club website for the Software Development Club at Washington State University. This site enables our club to showcase our projects, announce upcoming events, highlight our team members, and provide information about our club for prospective members looking to join our community!

## Tech Stack

- **React.js** - UI Llibrary
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Neon Serverless PostgreSQL** - Backend relational database
- **Vercel** - Deployment platform

## Prerequisites

- **Node.js 22.13.1**
  - If you have [nvm](https://github.com/nvm-sh/nvm) installed, run `nvm use` to automatically switch to the correct version

## Design Guidelines

This project follows the [WSU brand guidelines](https://brand.wsu.edu/) for colors and visual elements.

## How to Contribute

1. **Clone the Repository**
   - Each team member should start by cloning the repository to their local machine:
     ```bash
     git clone https://github.com/WSU-Software-Development-Club/club-website.git
     cd club-website
     ```
2. **Install All Dependencies**
   After navigating into the cloned repository, run:

   ```bash
   npm install
   ```

   What This Does:

   Reads package.json: Fetches all the dependencies and devDependencies listed.
   Creates node_modules Folder: Downloads and installs all necessary packages locally.
   Ensures Consistency: Everyone has the same versions of packages, preventing "it works on my machine" issues.

3. **Start The Development Server**
   Once all dependencies are installed, start the development server to verify everything is set up correctly:
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```
4. **Checkout a Branch:**
   - Ensure you're working on one of your own branches or a branch that you've been assigned to.
   - To switch to a branch:
     ```bash
     git checkout <branch-name>
     ```

5. **Make Changes:**
   - Implement your changes or updates within the checked-out branch.

6. **Commit Your Changes:**
   - Stage the changes and commit them with a meaningful message:
     ```bash
     git add .
     git commit -m "Your descriptive commit message"
     ```

7. **Push the Branch to Origin:**
   - Push the branch with your changes to the remote repository:
     ```bash
     git push origin <branch-name>
     ```

8. **Create a Pull Request:**
   - Go to GitHub and create a pull request from your branch to the appropriate base branch.
