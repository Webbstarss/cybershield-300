import Head from 'next/head';
import Chatbot from '../components/Chatbot';

export default function Home() {
  return (
    <div>
      <Head>
        <title>CyberShield 300</title>
      </Head>
      <main>
        <h1>CyberShield 300</h1>
        <Chatbot />
      </main>
    </div>
  );
}
