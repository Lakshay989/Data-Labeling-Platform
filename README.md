# Data-Labeling-Platform

A decentralized data labelling platform leveraging Web3 technology and Solana blockchain for secure micropayments. This platform allows users to upload datasets for labeling and enables workers, primarily in developing nations, to label data and earn Solana.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

## Introduction
This project aims to solve the inefficiencies associated with micropayments in data labeling tasks by using Solana blockchain technology. The platform is similar to Amazon Mechanical Turk but focuses on utilizing blockchain for faster and cheaper transactions.

## Features
- Secure file storage with Amazon S3 and CloudFront.
- Direct file uploads using pre-signed URLs.
- Integration with Solana blockchain for efficient micropayments.
- User authentication and transactions through Solana Wallet Adapter.
- Robust backend with Node.js, Express, PostgresSQL, and Prisma ORM.
- Asynchronous processing for handling payments and data validation.
- Responsive and intuitive UI with Next.js, React.js, and TypeScript.

## Tech Stack
- **Frontend:** Next.js, React.js, TypeScript
- **Backend:** Node.js, Express
- **Database:** PostgresSQL with Prisma ORM
- **Storage:** Amazon S3, CloudFront
- **Blockchain:** Solana
- **Other Tools:** Postman (API testing)

## Architecture
The platform is designed with a microservices architecture, separating the frontend, backend, and blockchain interactions to ensure scalability and maintainability.

![image](https://github.com/user-attachments/assets/20eaea1b-e002-454f-8dda-e87903d4ea38)


### Components
1. **Frontend:**
   - Developed with Next.js, React.js, and TypeScript.
   - Provides interfaces for data upload, task management, and payment tracking.

2. **Backend:**
   - Built with Node.js and Express.
   - Manages task lifecycle, user authentication, and payment processing.
   - Utilizes PostgresSQL for data storage and Prisma ORM for database interactions.

3. **Storage:**
   - Amazon S3 for object storage.
   - CloudFront for content delivery.
   - Pre-signed URLs for secure file uploads.

4. **Blockchain Integration:**
   - Solana blockchain for micropayments.
   - Solana Wallet Adapter for transaction management and user authentication.

## Installation
To run this project locally, follow these steps:

### Prerequisites
- Node.js (v14 or later)
- PostgreSQL
- AWS account (for S3 and CloudFront)
- Solana CLI and wallet

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/data-labeling-platform.git
   cd data-labeling-platform
   ```

2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Set up environment variables:**

   Create a .env file in the root directory and add your configuration details:

    env
    ```bash
    DATABASE_URL=your_postgres_database_url
    AWS_ACCESS_KEY_ID=your_aws_access_key
    AWS_SECRET_ACCESS_KEY=your_aws_secret_key
    YOUR_RPC_URL=devnet (You can use alchemy for generating it)
    WALLET_PRIVATE_KEY=your_solana_wallet_private_key
    ```
    
  Note: Next.js has a specific way of naming enviorment variables usually with a prefix of "NEXT_PUBLIC_". Kindly refer this [official documentation](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables) for more          details.

4. **Migrate the database:**

    ```bash
    npx prisma migrate dev
    ```

5. **Start the development server:**

    *Backend*

    ```bash
    tsc -b
    node dist/index.js
    ```

    *Either frontend*

    ```bash
    npm run dev (or) yarn dev
    ```

    
### Usage

    Upload Data:
        Users can upload data files through the UI. Files are stored securely in S3 using pre-signed URLs.

    Label Data:
        Workers can pick up tasks and label the data.
        Micropayments are processed using Solana blockchain, ensuring quick and low-cost transactions.

    Manage Payments:
        Users can pay for tasks and verify payments through the platform.
        Workers can request payouts and receive payments in their Solana wallets.

### Contributing

Contributions are welcome! Please follow these steps to contribute:

    Fork the repository.
    Create a new branch (git checkout -b feature-branch).
    Commit your changes (git commit -m 'Add new feature').
    Push to the branch (git push origin feature-branch).
    Open a pull request.
