export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">Xodus<span className="text-teal-400">Pay</span></h1>
        <div className="flex gap-4">
          <a href="/login" className="px-4 py-2 text-gray-300 hover:text-white">Login</a>
          <a href="/signup" className="px-4 py-2 bg-teal-500 text-black font-semibold rounded-full hover:bg-teal-400">Get Started</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-8 py-24">
        <h2 className="text-5xl font-bold mb-6">Bid Smart.<br/>Save More.</h2>
        <p className="text-xl text-gray-400 max-w-2xl mb-10">AI-powered real-time bidding on premium fashion. Get exclusive items at the right price — without the brand paying the cost.</p>
        <a href="/signup" className="px-8 py-4 bg-teal-500 text-black font-bold text-lg rounded-full hover:bg-teal-400">Start Bidding Now</a>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-16 border-t border-gray-800">
        <div className="p-6 bg-gray-900 rounded-2xl">
          <div className="text-3xl mb-4">🤖</div>
          <h3 className="text-xl font-bold mb-2">AI Bidding</h3>
          <p className="text-gray-400">Our AI evaluates bids in real-time based on inventory, demand and market trends.</p>
        </div>
        <div className="p-6 bg-gray-900 rounded-2xl">
          <div className="text-3xl mb-4">👑</div>
          <h3 className="text-xl font-bold mb-2">Premium Brands</h3>
          <p className="text-gray-400">Access slow-moving stock from top premium fashion retailers worldwide.</p>
        </div>
        <div className="p-6 bg-gray-900 rounded-2xl">
          <div className="text-3xl mb-4">🌍</div>
          <h3 className="text-xl font-bold mb-2">Global Access</h3>
          <p className="text-gray-400">Anyone, anywhere can participate. Inclusive and accessible to all.</p>
        </div>
      </section>
    </main>
  );
}