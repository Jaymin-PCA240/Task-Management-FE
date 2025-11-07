export default function Footer() {
  return (
    <footer className="bg-black/60 backdrop-blur-md text-gray-300 py-6 text-center border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm">&copy; {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
        <div className="flex justify-center mt-3 gap-4">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}
