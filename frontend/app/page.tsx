import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white">
      <div className="text-center space-y-8 p-8 max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Welcome to <span className="text-yellow-400">MWU Navigator</span>
        </h1>
        <p className="text-xl font-light opacity-90">
          Navigate the campus with ease. Find your classes, explore buildings, and get directions instantly.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/login"
            className="px-8 py-3 bg-white text-blue-700 font-bold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg text-center"
          >
            Student Login
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transform hover:scale-105 transition-all shadow-lg text-center"
          >
            Join Now
          </Link>
        </div>
        
        <div className="pt-8 border-t border-white/20">
           <Link href="/admin/login" className="text-sm font-medium text-blue-200 hover:text-white transition-colors underline decoration-dotted decoration-blue-300 underline-offset-4">
              Access Admin Portal
           </Link>
        </div>
      </div>
      
      <div className="absolute bottom-4 text-xs opacity-60">
        &copy; {new Date().getFullYear()} MWU Navigator. All rights reserved.
      </div>
    </div>
  );
}
