# RAGMind - RAG-Powered Conversational AI Assistant for Enterprise Data, Enforced by Generative AI

<div align="center">
    <img src="./logo.png" alt="RAGMind-logo" width="30%"  style="border-radius: 50%; padding-bottom: 20px"/>
</div>

RAGMind, is your second brain, uses the power of GenerativeAI to be your personal assistant ! Turbocharged with AI capabilities to make it even easier for entreprises to easily bring the power of AI to their Dormant Data.

## Key Features 🎯

- **Fast and Efficient**: Designed with speed and efficiency at its core. RAGMind ensures rapid access to your data.
- **Secure**: Your data, your control. Always.
- **OS Compatible**: Ubuntu 22 or newer.
- **File Compatibility**: Text, Markdown, PDF, Powerpoint, Excel, CSV, Word, Audio, Video.
- **Public/Private**: Share your brains with your employees via a public link, or keep them private.
- **Marketplace**: Share your brains with your colleagues, or use other people's brains to boost your productivity.
- **Offline Mode**: RAGMind works offline, so you can access your data anytime, anywhere.

## Demo Highlights 🎥

<!-- https://github.com/yyassif/ragmind/ -->

## Getting Started 🚀

If you would like to deploy locally, follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

You can find everything on the [documentation](https://docs.yyassif.dev/).

### Prerequisites 📋

Ensure you have the following installed:

- Docker
- Docker Compose

### 60 seconds Installation 💽

You can find the installation video [here](https://www.youtube.com/watch?v=cXBa6dZJN48).

- **Step 0**: Supabase CLI

  Follow the instructions [here](https://supabase.com/docs/guides/cli/getting-started) to install the Supabase CLI that is required.

  ```bash
  supabase -v # Check that the installation worked
  ```


- **Step 1**: Clone the repository:

  ```bash
  git clone https://github.com/yyassif/ragmind.git && cd ragmind
  ```

- **Step 2**: Copy the `.env.example` files

  ```bash
  cp .env.example .env
  ```

- **Step 3**: Update the `.env` files

  ```bash
  vim .env # or emacs or vscode or nano
  ```

  Update **OPENAI_API_KEY** in the `.env` file.

  You just need to update the `OPENAI_API_KEY` variable in the `.env` file. You can get your API key [here](https://platform.openai.com/api-keys). You need to create an account first. And put your credit card information. Don't worry, you won't be charged unless you use the API. You can find more information about the pricing [here](https://openai.com/pricing/).


- **Step 4**: Launch the project

  ```bash
  cd backend && supabase start
  ```
  and then 
  ```bash
  cd ../
  docker compose pull
  docker compose up
  ```

  If you have a Mac, go to Docker Desktop > Settings > General and check that the "file sharing implementation" is set to `VirtioFS`.

  If you are a developer, you can run the project in development mode with the following command: `docker compose -f docker-compose.dev.yml up --build`

- **Step 5**: Login to the app

  You can now sign in to the app with `admin@yyassif.dev` & `admin`. You can access the app at [http://localhost:3000/login](http://localhost:3000/login).

  You can access RAGMind backend API at [http://localhost:5050/docs](http://localhost:5050/docs)

  You can access supabase at [http://localhost:54323](http://localhost:54323)

## Updating RAGMind 🚀

- **Step 1**: Pull the latest changes

  ```bash
  git pull
  ```

- **Step 2**: Update the migration

  ```bash
  supabase migration up
  ```

